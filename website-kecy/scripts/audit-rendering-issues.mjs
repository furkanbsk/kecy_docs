#!/usr/bin/env node
// Tarama: çevrilen 19 markdown'da yaygın MDX/Docusaurus render sorunlarını bul.

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(SITE_ROOT, 'docs', 'sim-to-real');
const HTML_DIR = path.join(__dirname, '.cache', 'nvidia-html');

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.isFile() && full.endsWith('.md')) out.push(full);
  }
  return out;
}

const mdFiles = walk(DOCS).sort();
const issues = [];
function record(file, kind, detail, line = null) {
  issues.push({file: path.relative(SITE_ROOT, file), kind, detail, line});
}

for (const f of mdFiles) {
  const txt = fs.readFileSync(f, 'utf8');
  const lines = txt.split('\n');

  // Build a "this line is inside a code fence" mask.
  const inFenceMask = new Array(lines.length).fill(false);
  let fenceOn = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) {
      // A ``` toggles fence state
      fenceOn = !fenceOn;
      inFenceMask[i] = true; // fence-line itself
      continue;
    }
    inFenceMask[i] = fenceOn;
  }

  // 1. Table issues: GFM-style pipe tables with empty alignment rows or
  //    cells that render with stray pipes.
  let inTable = false;
  for (let i = 0; i < lines.length; i++) {
    if (inFenceMask[i]) continue;
    const line = lines[i];
    if (/^\s*\|[^|\n]*\|\s*$/.test(line)) {
      // Single-cell pipe line — often a leftover from broken table.
      record(f, 'table-single-cell', line.trim(), i + 1);
    }
    // Count | occurrences — a table row has balanced pipes
    if (/^\s*\|/.test(line) && line.includes('|')) {
      inTable = true;
    } else if (inTable && !line.trim()) {
      inTable = false;
    }
  }

  // 2. Orphan / unclosed admonitions
  const opens = (txt.match(/^:::[a-zA-Z]+/gm) || []).length;
  const closes = (txt.match(/^:::\s*$/gm) || []).length;
  if (opens !== closes) {
    record(f, 'admonition-unbalanced', `opens=${opens} closes=${closes}`);
  }

  // 3. Literal [[ADMONITION:...]] leaks
  if (
    /\[\[ADMONITION|\[\[\/ADMONITION|\[\[CODEBLOCK|\[\[\/CODEBLOCK/.test(txt)
  ) {
    record(f, 'sentinel-leak', 'sentinel not post-processed');
  }

  // 4. Unclosed code fences
  const fences = (txt.match(/^```/gm) || []).length;
  if (fences % 2 !== 0) {
    record(f, 'code-fence-unbalanced', `count=${fences}`);
  }

  // 5. Raw HTML tags that can confuse MDX
  //    Known-ok: <em>, <strong>, <br>, <br/>, Docusaurus components.
  //    Problematic: <details>, <summary>, <iframe>, custom tags we didn't handle.
  for (const tag of [
    'details',
    'summary',
    'iframe',
    'video',
    'audio',
    'form',
    'input',
    'button',
    'svg',
    'path',
  ]) {
    const re = new RegExp(`<${tag}\\b`, 'i');
    if (re.test(txt)) {
      record(f, `raw-html-${tag}`, `<${tag}> tag present`);
    }
  }

  // 6. Bare JSX-looking expressions that MDX will try to parse
  //    e.g. `{something}` on its own line (skip lines inside code fences)
  for (let i = 0; i < lines.length; i++) {
    if (inFenceMask[i]) continue;
    const l = lines[i];
    if (/^\s*\{[^}]*\}\s*$/.test(l) && !l.includes('```')) {
      record(f, 'jsx-expression', l.trim(), i + 1);
    }
  }

  // 7. Images with unresolved paths
  const imgRe = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let m;
  while ((m = imgRe.exec(txt))) {
    const src = m[2];
    if (
      !src.startsWith('/img/') &&
      !src.startsWith('http://') &&
      !src.startsWith('https://') &&
      !src.startsWith('data:')
    ) {
      record(f, 'img-unresolved-path', `${src}`);
    }
  }

  // 8. Internal links that don't start with / (often broken).
  //    Ignore legitimate external attribution links to docs.nvidia.com etc.
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  while ((m = linkRe.exec(txt))) {
    const href = m[2];
    // External links are fine even if they end in .html.
    if (/^https?:\/\//.test(href)) continue;
    if (href.endsWith('.html') || /^\.\.?\/[^)]*\.html/.test(href)) {
      record(f, 'link-raw-html', href);
    }
  }

  // 9. Strayed stars / asterisks or escape artifacts
  //    Docusaurus escapes `_`, `*` sometimes badly if nested.
  if (/\\\[Görsel/.test(txt)) {
    record(f, 'escaped-gorsel', 'escaped [Görsel found');
  }

  // 10. Frontmatter sanity
  if (!txt.startsWith('---\n')) {
    record(f, 'frontmatter-missing', 'no opening ---');
  }

  // 11. Check for stray sphinx admonition-title leftovers
  if (/class="admonition-title"/.test(txt) || /class="admonition/.test(txt)) {
    record(f, 'admonition-html-leak', 'class="admonition" present');
  }
}

// ---------- Check source HTMLs for constructs we don't handle ----------
if (fs.existsSync(HTML_DIR)) {
  for (const f of fs.readdirSync(HTML_DIR).sort()) {
    if (!f.endsWith('.html')) continue;
    const html = fs.readFileSync(path.join(HTML_DIR, f), 'utf8');
    const $ = cheerio.load(html);
    const article = $('article, [role="main"]').first();
    if (!article.length) continue;

    const constructs = [];
    if (
      article.find('details, .admonition-dropdown, .sd-dropdown, .toggle')
        .length
    ) {
      constructs.push('details/dropdown');
    }
    if (article.find('figure').length) constructs.push('figure');
    if (article.find('iframe').length) constructs.push('iframe');
    if (article.find('video').length) constructs.push('video');
    if (article.find('table').length) {
      const tbl = article.find('table').first();
      const hasP = tbl.find('td > p, th > p').length > 0;
      constructs.push(
        `table (${tbl.length}x)${hasP ? ' [p-wrapped cells]' : ''}`,
      );
    }
    if (article.find('.sd-card, .bd-card').length) constructs.push('sd-card');
    if (article.find('dl').length) constructs.push('definition-list');
    if (article.find('sub, sup').length) constructs.push('sub/sup');
    if (article.find('kbd').length) constructs.push('kbd');
    if (article.find('abbr').length) constructs.push('abbr');
    if (article.find('mark').length) constructs.push('mark');
    if (article.find('[colspan], [rowspan]').length)
      constructs.push('colspan/rowspan');
    if (article.find('span.math').length) constructs.push('math');

    if (constructs.length) {
      issues.push({
        file: `HTML:${f}`,
        kind: 'source-construct',
        detail: constructs.join(', '),
      });
    }
  }
}

// ---------- report ----------
const byKind = new Map();
for (const i of issues) {
  if (!byKind.has(i.kind)) byKind.set(i.kind, []);
  byKind.get(i.kind).push(i);
}

console.log(
  `Total issues: ${issues.length} across ${
    new Set(issues.map((i) => i.file)).size
  } files`,
);
console.log('='.repeat(70));
const kinds = [...byKind.keys()].sort();
for (const k of kinds) {
  const items = byKind.get(k);
  console.log(`\n[${k}]  ${items.length} hit(s)`);
  for (const i of items.slice(0, 30)) {
    const ln = i.line ? `:${i.line}` : '';
    console.log(`  ${i.file}${ln}  ${i.detail}`);
  }
  if (items.length > 30) console.log(`  ... +${items.length - 30} more`);
}
