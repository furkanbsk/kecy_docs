#!/usr/bin/env node
// Notion → Docusaurus importer for KecyAI Robotik Wiki.
// Idempotent: re-running regenerates docs/ and static/img/robotik-nedir/ cleanly.

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const DOCS_OUT = path.join(SITE_ROOT, 'docs');
const STATIC_IMG_OUT = path.join(SITE_ROOT, 'static', 'img');

const SOURCE_ROOT = path.resolve(
  SITE_ROOT,
  '../../notion_export_2/Private & Shared/Robotik Wiki',
);

const JOBS = [
  {
    src: 'Code Docs/Robotik Nedir 2c4f02e2d94980e19808e90e58a23e2c.md',
    target: 'temeller/robotik-nedir.md',
    title: 'Robotik Nedir?',
    position: 1,
    assetDir: 'robotik-nedir',
  },
  {
    src: 'Code Docs/Sinyal ve Sistemler Nedir 28bf02e2d94980b698f4ce41cb667aa8.md',
    target: 'temeller/sinyal-ve-sistemler.md',
    title: 'Sinyal ve Sistemler Nedir?',
    position: 2,
  },
  {
    src: 'Code Docs/Robotikte Temel Uygulamalar 277f02e2d949816491a6f7e394b2914a.md',
    target: 'temeller/temel-uygulamalar.md',
    title: 'Robotikte Temel Uygulamalar',
    position: 3,
  },
  {
    src: 'Code Docs/ROS2 Tutorials 2c4f02e2d949801fbb22ccbe8586c3c6.md',
    target: 'ros2/giris.md',
    title: 'ROS 2 Nedir?',
    position: 1,
  },
  {
    src: 'Code Docs/ROS2 Tutorials/Code Docs/ROS2 Kurulum (Ubuntu) 2c4f02e2d949819ba4f0fdb4bfe0b802.md',
    target: 'ros2/kurulum-ubuntu.md',
    title: 'ROS 2 Kurulum (Ubuntu)',
    position: 2,
  },
  {
    src: 'Code Docs/ROS2 Tutorials/Code Docs/ROS2 Kurulum (Windows) 2c4f02e2d94980b0bdaecc58ecce8b34.md',
    target: 'ros2/kurulum-windows.md',
    title: 'ROS 2 Kurulum (Windows)',
    position: 3,
  },
  {
    src: 'Code Docs/ROS2 Tutorials/Code Docs/ROS2 Workspace (Çalışma Alanı) Oluşturma 2c4f02e2d94980058c6ee1d86eed6abb.md',
    target: 'ros2/workspace-olusturma.md',
    title: 'ROS 2 Workspace Oluşturma',
    position: 4,
  },
  {
    src: 'Code Docs/ROS2 Tutorials/Code Docs/Yararlı ROS 2 Komutları 2c4f02e2d949804d94f6fd507d7a3e83.md',
    target: 'ros2/komutlar.md',
    title: 'Yararlı ROS 2 Komutları',
    position: 5,
  },
  {
    src: 'Code Docs/ROS2 Tutorials/Code Docs/Kaldırma (Uninstall) 2c4f02e2d94980fbab42c7bd259a71d9.md',
    target: 'ros2/kaldirma.md',
    title: 'Kaldırma (Uninstall)',
    position: 6,
  },
];

// Map of Notion basename (with hex ID suffix stripped) → Docusaurus slug.
const NOTION_TO_SLUG = {
  'Robotik Nedir': 'temeller/robotik-nedir',
  'Sinyal ve Sistemler Nedir': 'temeller/sinyal-ve-sistemler',
  'Robotikte Temel Uygulamalar': 'temeller/temel-uygulamalar',
  'ROS2 Tutorials': 'ros2/giris',
  'ROS2 Kurulum (Ubuntu)': 'ros2/kurulum-ubuntu',
  'ROS2 Kurulum (Windows)': 'ros2/kurulum-windows',
  'ROS2 Workspace (Çalışma Alanı) Oluşturma': 'ros2/workspace-olusturma',
  'Yararlı ROS 2 Komutları': 'ros2/komutlar',
  'Kaldırma (Uninstall)': 'ros2/kaldirma',
};

const CATEGORIES = [
  {
    dir: 'temeller',
    json: {
      label: 'Temeller',
      position: 1,
      link: {
        type: 'generated-index',
        title: 'Temeller',
        description: 'Robotik ve sinyal işleme temelleri',
      },
    },
  },
  {
    dir: 'ros2',
    json: {
      label: 'ROS 2',
      position: 2,
      link: {
        type: 'generated-index',
        title: 'ROS 2',
        description: 'ROS 2 kurulum ve kullanım',
      },
    },
  },
];

// ---------- helpers ----------

function kebab(s) {
  return s
    .replace(/İ/g, 'i')
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/%20/g, '-')
    .replace(/[\s_()[\]]+/g, '-')
    .replace(/[^a-z0-9.\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Strip leading Notion title + breadcrumb links + duplicate H1.
function stripHeader(raw) {
  const lines = raw.split(/\r?\n/);
  const isH1 = (l) => /^#(?!#)/.test(l);
  const first = lines.findIndex(isH1);
  if (first === -1) return raw;
  const second = lines.findIndex((l, i) => i > first && isH1(l));
  const bodyStart = second !== -1 ? second + 1 : first + 1;
  return lines.slice(bodyStart).join('\n');
}

// Drop trailing "Table of Contents", "---", blanks.
function stripTrailing(body) {
  const lines = body.split(/\r?\n/);
  while (lines.length > 0) {
    const last = lines[lines.length - 1].trim();
    if (last === '' || last === '---' || last === 'Table of Contents') {
      lines.pop();
    } else break;
  }
  return lines.join('\n');
}

// Rewrite Notion image refs into /img/<assetDir>/<kebab>.png and copy files.
function rewriteImages(body, sourceAbs, assetDir) {
  if (!assetDir) {
    // No asset dir → drop any image references defensively (none expected).
    return body;
  }
  const destDir = path.join(STATIC_IMG_OUT, assetDir);
  return body.replace(
    /!\[([^\]]*)\]\(((?:\.\.\/)*[^)]+\.(?:png|jpe?g|gif|webp))\)/gi,
    (_match, alt, src) => {
      const decoded = decodeURIComponent(src);
      const srcAbs = path.resolve(path.dirname(sourceAbs), decoded);
      const base = path.basename(decoded);
      const targetName = kebab(base);
      if (!fs.existsSync(srcAbs)) {
        console.warn(`  [warn] image not found: ${srcAbs}`);
        return '';
      }
      fs.mkdirSync(destDir, {recursive: true});
      fs.copyFileSync(srcAbs, path.join(destDir, targetName));
      return `![${alt}](/img/${assetDir}/${targetName})`;
    },
  );
}

// Rewrite internal .md / .csv links.
// Known → /docs/<slug>; unknown → drop link, keep text.
function rewriteInternalLinks(body) {
  return body.replace(
    /\[([^\]]+)\]\(([^)]+\.(?:md|csv))\)/gi,
    (_match, label, href) => {
      const decoded = decodeURIComponent(href);
      const base = path.basename(decoded);
      const stripped = base.replace(/ [0-9a-f]{32}(\.(?:md|csv))?$/i, '');
      if (NOTION_TO_SLUG[stripped]) {
        return `[${label}](/${NOTION_TO_SLUG[stripped]})`;
      }
      return label;
    },
  );
}

// <aside>…</aside> → Docusaurus admonition.
function rewriteAsides(body) {
  return body.replace(/<aside>([\s\S]*?)<\/aside>/g, (_match, inner) => {
    let trimmed = inner.trim();
    let type = 'note';
    if (/^💡/.test(trimmed) || /\*\*İpucu/.test(trimmed.slice(0, 40))) {
      type = 'tip';
      trimmed = trimmed.replace(/^💡\s*/, '');
    } else if (/^⚠️/.test(trimmed) || /\bUyarı\b/.test(trimmed.slice(0, 40))) {
      type = 'warning';
      trimmed = trimmed.replace(/^⚠️\s*/, '');
    } else if (/^ℹ️|^📝|^📌/.test(trimmed)) {
      type = 'note';
      trimmed = trimmed.replace(/^[ℹ️📝📌]\s*/, '');
    }
    return `:::${type}\n${trimmed}\n:::`;
  });
}

const TYPO_FIXES = [
  [/Önreğin/g, 'Örneğin'],
  [/Önreğin:/g, 'Örneğin:'],
];

function fixTypos(body) {
  for (const [re, rep] of TYPO_FIXES) body = body.replace(re, rep);
  return body;
}

function transform(raw, job) {
  let body = stripHeader(raw);
  body = stripTrailing(body);
  body = rewriteImages(body, path.join(SOURCE_ROOT, job.src), job.assetDir);
  body = rewriteInternalLinks(body);
  body = rewriteAsides(body);
  body = fixTypos(body);
  // Normalize leading whitespace.
  body = body.replace(/^\s+/, '');

  const frontmatter =
    `---\n` +
    `title: ${job.title}\n` +
    `sidebar_position: ${job.position}\n` +
    `---\n\n`;
  return frontmatter + body + '\n';
}

// ---------- runner ----------

function wipeDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, {recursive: true, force: true});
}

function main() {
  if (!fs.existsSync(SOURCE_ROOT)) {
    console.error(`Source not found: ${SOURCE_ROOT}`);
    process.exit(1);
  }

  // Wipe generated output so re-runs don't leave orphans.
  wipeDir(DOCS_OUT);
  wipeDir(path.join(STATIC_IMG_OUT, 'robotik-nedir'));
  fs.mkdirSync(DOCS_OUT, {recursive: true});

  // Hand-authored intro.md (written separately, not imported).
  const intro =
    `---\n` +
    `title: Giriş\n` +
    `sidebar_position: 0\n` +
    `slug: /\n` +
    `---\n\n` +
    `# KecyAI Robotik Wiki\n\n` +
    `Türkçe robotik ve ROS 2 eğitim notları.\n\n` +
    `- **[Temeller](/temeller/robotik-nedir)** — Robotik ve sinyal işleme temelleri\n` +
    `- **[ROS 2](/ros2/giris)** — Kurulum, workspace, komutlar\n`;
  fs.writeFileSync(path.join(DOCS_OUT, 'intro.md'), intro);
  console.log('wrote docs/intro.md');

  for (const job of JOBS) {
    const srcAbs = path.join(SOURCE_ROOT, job.src);
    if (!fs.existsSync(srcAbs)) {
      console.error(`  [err] source missing: ${srcAbs}`);
      process.exit(2);
    }
    const raw = fs.readFileSync(srcAbs, 'utf8');
    const out = transform(raw, job);
    const destAbs = path.join(DOCS_OUT, job.target);
    fs.mkdirSync(path.dirname(destAbs), {recursive: true});
    fs.writeFileSync(destAbs, out);
    console.log(`wrote docs/${job.target}`);
  }

  for (const cat of CATEGORIES) {
    const catDir = path.join(DOCS_OUT, cat.dir);
    fs.mkdirSync(catDir, {recursive: true});
    fs.writeFileSync(
      path.join(catDir, '_category_.json'),
      JSON.stringify(cat.json, null, 2) + '\n',
    );
    console.log(`wrote docs/${cat.dir}/_category_.json`);
  }

  console.log('\nImport complete.');
}

main();
