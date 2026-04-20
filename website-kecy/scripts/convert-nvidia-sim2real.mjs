#!/usr/bin/env node
// NVIDIA Sim-to-Real SO-101 HTML → Docusaurus Markdown dönüştürücüsü.
// Okur:  scripts/.cache/nvidia-html/<sourceId>.html
//        scripts/.cache/nvidia-assets/<sourceId>.json
// Yazar: docs/sim-to-real/<section>/<slug>.md
//        docs/sim-to-real/<section>/_category_.json
//
// Bu aşamada içerik hâlâ İngilizce'dir. Aşama D'de sayfa sayfa Türkçeleştirilecek.
// Bu yüzden her sayfaya "needsTranslation: true" frontmatter bayrağı eklenir
// ve üstte attribution admonition'ı konur.

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import {gfm} from 'turndown-plugin-gfm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const MANIFEST = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'nvidia-sim2real-manifest.json'),
    'utf8',
  ),
);
const HTML_DIR = path.join(__dirname, '.cache', 'nvidia-html');
const ASSET_DIR = path.join(__dirname, '.cache', 'nvidia-assets');
const DOCS_ROOT = path.join(SITE_ROOT, 'docs', MANIFEST.categoryRoot);

// ---------- URL / slug helpers ----------

// Build: sourceId → target slug path "/sim-to-real/<section>/<slug>"
const SLUG_BY_SOURCE_ID = new Map();
// Build: sourcePath (e.g. "02-how-to-take-this-course.html") → same slug
const SLUG_BY_SOURCE_PATH = new Map();
for (const p of MANIFEST.pages) {
  const slug = `/${MANIFEST.categoryRoot}/${p.section}/${p.slug}`;
  SLUG_BY_SOURCE_ID.set(p.sourceId, slug);
  SLUG_BY_SOURCE_PATH.set(p.sourcePath, slug);
}

function loadAssetMap(sourceId) {
  const file = path.join(ASSET_DIR, `${sourceId}.json`);
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, 'utf8')).assets || {};
}

// Given a relative ref (e.g. "_images/foo.gif") + the page absolute URL,
// resolve to absolute URL and look up in the asset map.
function rewriteAssetHref(ref, pageUrl, assetMap) {
  if (!ref) return null;
  if (ref.startsWith('data:') || ref.startsWith('#')) return null;
  let abs;
  try {
    abs = new URL(ref, pageUrl).href;
  } catch {
    return null;
  }
  const hit = assetMap[abs];
  if (hit && hit.webPath) return hit.webPath;
  return null;
}

// Rewrite internal links like "10-groot.html" → "/sim-to-real/veri-egitim-.../isaac-groot"
// Keeps URL fragment (#foo). Returns null if target not in manifest.
function rewriteInternalLink(href) {
  if (!href) return null;
  if (/^(https?:|mailto:|data:)/i.test(href)) return null;
  // Split off fragment
  const [pathPart, frag] = href.split('#');
  if (!pathPart) {
    // Pure fragment — keep as-is
    return null;
  }
  // Strip leading "./" or any path prefix — we only match on basename
  const basename = pathPart.split('/').pop();
  if (!basename.endsWith('.html')) return null;
  const slug = SLUG_BY_SOURCE_PATH.get(basename);
  if (!slug) return null;
  return frag ? `${slug}#${frag}` : slug;
}

// ---------- admonition map ----------

const ADMONITION_TYPE = {
  tip: 'tip',
  hint: 'tip',
  note: 'note',
  important: 'info',
  warning: 'warning',
  caution: 'warning',
  danger: 'danger',
  attention: 'warning',
  error: 'danger',
};

// ---------- cheerio pre-processing ----------

function preprocess(html, page, assetMap) {
  const $ = cheerio.load(html, {decodeEntities: true});
  const article = $('article, [role="main"]').first();
  if (!article.length) {
    throw new Error(`No <article> found for ${page.sourceId}`);
  }

  // Scope all further queries to this article — much easier to reason about.
  const $root = $('<div></div>').append(article.clone().children());

  // Remove Sphinx chrome we don't want
  $root.find('.headerlink').remove();
  $root.find('.sphinx-btn-copy').remove();
  $root.find('[role="navigation"]').remove();
  $root.find('nav').remove();
  $root.find('.prev-next-area').remove();
  $root.find('.edit-this-page').remove();

  // Strip `#` text from headers (comes from the removed headerlink anchors)
  $root.find('h1,h2,h3,h4,h5,h6').each((_, el) => {
    const $h = $(el);
    $h.text(
      $h
        .text()
        .replace(/\u00B6/g, '')
        .replace(/\s*#\s*$/, '')
        .trim(),
    );
  });

  // Rewrite <img src> — drop images that can't be resolved locally
  // (NVIDIA source has some broken `images/...` refs that 404 upstream).
  $root.find('img').each((_, el) => {
    const $img = $(el);
    const src = $img.attr('src') || '';
    const alt = $img.attr('alt') || '';
    const abs = rewriteAssetHref(
      src,
      MANIFEST.baseUrl + page.sourcePath,
      assetMap,
    );
    if (abs) {
      $img.attr('src', abs);
      $img.removeAttr('srcset');
      $img.removeAttr('data-src');
    } else if (/^https?:\/\//i.test(src)) {
      // External image URL we didn't cache — keep as-is (e.g. CDN badge).
      $img.removeAttr('srcset');
      $img.removeAttr('data-src');
    } else {
      // Unresolved relative asset — emit a visible note instead of a broken <img>.
      const note = alt
        ? `[Görsel (kaynakta eksik): ${alt}]`
        : `[Görsel kaynakta eksik]`;
      $img.replaceWith(`<em>${escapeHtml(note)}</em>`);
    }
  });

  // Rewrite <a href> for assets (mp4/webm/gif)
  $root.find('a').each((_, el) => {
    const $a = $(el);
    const href = $a.attr('href');
    if (!href) return;

    // Try asset rewrite first (for video/gif links)
    if (/\.(mp4|webm|gif|png|jpe?g|svg|mov)(?:#|\?|$)/i.test(href)) {
      const absAsset = rewriteAssetHref(
        href,
        MANIFEST.baseUrl + page.sourcePath,
        assetMap,
      );
      if (absAsset) {
        $a.attr('href', absAsset);
        return;
      }
      // Unresolved asset link — unwrap the anchor so we don't carry a 404.
      $a.replaceWith($a.contents());
      return;
    }

    // Then internal docs cross-link
    const slug = rewriteInternalLink(href);
    if (slug) {
      $a.attr('href', slug);
    }
  });

  // Wrap admonitions with sentinels that Turndown preserves (custom tags
  // are kept as raw HTML — we'll post-process to Docusaurus ::: syntax).
  $root.find('.admonition').each((_, el) => {
    const $ad = $(el);
    const cls = ($ad.attr('class') || '').toLowerCase();
    // Find the admonition keyword (tip/note/important/warning/...)
    let kind = 'note';
    for (const key of Object.keys(ADMONITION_TYPE)) {
      if (
        cls.includes(` ${key}`) ||
        cls.includes(`${key} `) ||
        cls.endsWith(key)
      ) {
        kind = ADMONITION_TYPE[key];
        break;
      }
    }
    // Remove title paragraph (we let `:::type` render the label itself)
    $ad.find('.admonition-title').first().remove();
    const inner = $ad.html() || '';
    $ad.replaceWith(
      `<p>[[ADMONITION:${kind}]]</p>${inner}<p>[[/ADMONITION]]</p>`,
    );
  });

  // Code blocks: <div class="highlight-{lang} notranslate"><div class="highlight"><pre>…</pre></div></div>
  $root.find('div[class*="highlight-"]').each((_, el) => {
    const $wrap = $(el);
    const cls = $wrap.attr('class') || '';
    const m = cls.match(/highlight-([\w+-]+)/);
    let lang = m ? m[1] : '';
    if (lang === 'default') lang = '';
    if (lang === 'text') lang = '';
    const $pre = $wrap.find('pre').first();
    if (!$pre.length) return;
    // Extract pure text — cheerio .text() strips the span-soup Pygments produces.
    const code = $pre.text().replace(/\n$/, '');
    // Use a fenced-code sentinel that turndown's escaping won't clobber.
    const fence = '```';
    const safe = code.replace(/```/g, '``\u200b`');
    $wrap.replaceWith(
      `<p>[[CODEBLOCK]]</p><pre data-lang="${lang}">${escapeHtml(
        safe,
      )}</pre><p>[[/CODEBLOCK]]</p>`,
    );
    // We keep the <pre> so turndown still sees the code. We'll re-format in post-process.
    void fence;
  });

  // Drop the "breadcrumbs" / "on this page" bits if present
  $root.find('.breadcrumbs, .toc-local, .on-this-page').remove();

  return $root.html() || '';
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------- turndown setup ----------

function makeTurndown() {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    fence: '```',
    bulletListMarker: '-',
    emDelimiter: '_',
    linkStyle: 'inlined',
  });
  td.use(gfm);

  // Our own code-block rule — Turndown's default pre/code handling drops the language.
  td.addRule('nvidia-code-block', {
    filter(node) {
      return node.nodeName === 'PRE' && node.getAttribute('data-lang') !== null;
    },
    replacement(_content, node) {
      const lang = node.getAttribute('data-lang') || '';
      const code = node.textContent || '';
      return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
    },
  });

  // Preserve line breaks inside <br>
  td.addRule('br', {
    filter: 'br',
    replacement: () => '  \n',
  });

  return td;
}

// ---------- post-process: admonition sentinels → ::: syntax ----------

function applyAdmonitions(md) {
  // Sentinel format we injected:  [[ADMONITION:type]] ... [[/ADMONITION]]
  // Turndown may wrap these in `\[\[…\]\]` (escaped brackets). Handle both.
  // When the admonition is inside a nested list, Turndown indents the opener
  // — we must dedent the whole block so `:::type` lands flush-left, otherwise
  // MDX treats it as an indented code block.
  const re =
    /[ \t]*\\?\[\\?\[ADMONITION:(\w+)\\?\]\\?\]\s*([\s\S]*?)\s*\\?\[\\?\[\/ADMONITION\\?\]\\?\]/g;
  let out = md.replace(re, (_, kind, body) => {
    const cleaned = body
      .split('\n')
      .map((l) => l.replace(/^[ \t]+/, ''))
      .join('\n')
      .trim();
    return `\n\n:::${kind}\n\n${cleaned}\n\n:::\n\n`;
  });
  // Strip the CODEBLOCK sentinels (the pre already produced the fenced block)
  out = out.replace(/[ \t]*\\?\[\\?\[CODEBLOCK\\?\]\\?\]\s*/g, '');
  out = out.replace(/[ \t]*\\?\[\\?\[\/CODEBLOCK\\?\]\\?\]\s*/g, '');
  return out;
}

// ---------- cleanup helpers ----------

function normalizeWhitespace(md) {
  // Collapse 3+ blank lines to 2
  let out = md.replace(/\n{3,}/g, '\n\n');
  // Drop trailing whitespace on lines
  out = out
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .join('\n');
  // Trim final
  return out.trim() + '\n';
}

// Replace unicode weirdness that Sphinx sometimes emits
function tidyText(md) {
  return md
    .replace(/\u00a0/g, ' ')
    .replace(/\u200b/g, '')
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2013/g, '-')
    .replace(/\u2014/g, '—');
}

// ---------- frontmatter ----------

function buildFrontmatter(page) {
  const fm = [
    '---',
    `title: ${JSON.stringify(page.title)}`,
    `sidebar_position: ${page.position}`,
    `description: ${JSON.stringify(
      `NVIDIA'nın "${MANIFEST.sourceLabel}" dokümantasyonundan Türkçeleştirilmiş içerik: ${page.title}`,
    )}`,
    `needsTranslation: true`,
    '---',
    '',
  ];
  return fm.join('\n');
}

function buildAttribution(page) {
  const pageUrl = MANIFEST.baseUrl + page.sourcePath;
  return [
    ':::info[Kaynak]',
    '',
    `Bu sayfa NVIDIA'nın resmi **"${MANIFEST.sourceLabel}"** kursundaki [${page.sourcePath}](${pageUrl}) sayfasından uyarlanmıştır.`,
    '',
    `Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.`,
    '',
    ':::',
    '',
  ].join('\n');
}

// ---------- per-page runner ----------

function convertPage(page) {
  const htmlPath = path.join(HTML_DIR, `${page.sourceId}.html`);
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`Missing cached HTML: ${htmlPath}`);
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  const assetMap = loadAssetMap(page.sourceId);

  const processedHtml = preprocess(html, page, assetMap);

  const td = makeTurndown();
  let md = td.turndown(processedHtml);
  md = applyAdmonitions(md);
  md = tidyText(md);
  md = normalizeWhitespace(md);

  // Drop the very first H1 — Docusaurus renders it from frontmatter.title.
  md = md.replace(/^\s*#\s+[^\n]+\n+/, '');

  const fm = buildFrontmatter(page);
  const attr = buildAttribution(page);
  const body = `${fm}\n${attr}\n${md}`;

  const targetPath = path.join(DOCS_ROOT, page.target);
  fs.mkdirSync(path.dirname(targetPath), {recursive: true});
  fs.writeFileSync(targetPath, body);

  return {page, bytes: body.length, target: targetPath};
}

function writeCategoryFiles() {
  // Group pages by section → pick the first occurrence of sectionLabel + sectionPosition
  const sections = new Map();
  for (const p of MANIFEST.pages) {
    if (!sections.has(p.section)) {
      sections.set(p.section, {
        slug: p.section,
        label: p.sectionLabel || p.section,
        position: p.sectionPosition || 99,
      });
    }
  }
  for (const s of sections.values()) {
    const file = path.join(DOCS_ROOT, s.slug, '_category_.json');
    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(
      file,
      JSON.stringify(
        {
          label: s.label,
          position: s.position,
          link: {
            type: 'generated-index',
            title: s.label,
            description: `${MANIFEST.sourceLabel} — ${s.label}`,
          },
        },
        null,
        2,
      ) + '\n',
    );
  }
}

function writeRootCategoryFile() {
  const file = path.join(DOCS_ROOT, '_category_.json');
  fs.writeFileSync(
    file,
    JSON.stringify(
      {
        label: MANIFEST.categoryLabel,
        position: MANIFEST.categoryPosition,
        link: {
          type: 'generated-index',
          title: MANIFEST.categoryLabel,
          description: `NVIDIA ${MANIFEST.sourceLabel} kursunun Türkçeleştirilmiş uyarlaması.`,
        },
      },
      null,
      2,
    ) + '\n',
  );
}

// ---------- main ----------

function main() {
  fs.mkdirSync(DOCS_ROOT, {recursive: true});
  writeRootCategoryFile();
  writeCategoryFiles();

  console.log(
    `Converting ${MANIFEST.pages.length} pages → ${path.relative(
      SITE_ROOT,
      DOCS_ROOT,
    )}/`,
  );
  console.log();

  const results = [];
  for (const page of MANIFEST.pages) {
    try {
      const r = convertPage(page);
      results.push(r);
      console.log(
        `  ✓ ${page.sourceId} → ${path.relative(SITE_ROOT, r.target)} (${
          r.bytes
        } B)`,
      );
    } catch (err) {
      console.error(`  ✗ ${page.sourceId}: ${err.message}`);
      console.error(err.stack);
      results.push({page, error: err.message});
    }
  }

  const failed = results.filter((r) => r.error);
  console.log('─'.repeat(60));
  console.log(
    `Done: ${results.length - failed.length}/${results.length} pages OK`,
  );
  if (failed.length) process.exit(1);
}

main();
