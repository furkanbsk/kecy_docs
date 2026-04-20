#!/usr/bin/env node
// NVIDIA Sim-to-Real SO-101 dokümanlarını indirme aracı.
// 1) Her sayfanın HTML'sini .cache/nvidia-html/ altına indirir.
// 2) Her sayfadan görsel URL'lerini çıkarır ve static/img/sim-to-real/<assetDir>/ altına kopyalar.
// 3) Her sayfa için bir asset-map JSON dosyası yazar (HTML→MD dönüşümünde URL yeniden yazımı için).
// Idempotent: tekrar çalıştırıldığında mevcut dosyalar atlanır (--force ile yeniden indirir).

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const MANIFEST = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'nvidia-sim2real-manifest.json'),
    'utf8',
  ),
);
const CACHE_DIR = path.join(__dirname, '.cache', 'nvidia-html');
const ASSET_MAP_DIR = path.join(__dirname, '.cache', 'nvidia-assets');
const IMG_ROOT = path.join(SITE_ROOT, 'static', 'img', 'sim-to-real');

const FORCE = process.argv.includes('--force');

// ---------- helpers ----------

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function downloadText(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; kecyai-docs-importer/1.0; +https://github.com/kecyai/robotik-wiki)',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  }
  return await res.text();
}

async function downloadBinary(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; kecyai-docs-importer/1.0; +https://github.com/kecyai/robotik-wiki)',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  }
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

// "../foo/bar.png" + "https://docs.nvidia.com/.../baz/index.html" → absolute URL.
function resolveUrl(ref, baseAbs) {
  try {
    return new URL(ref, baseAbs).href;
  } catch {
    return null;
  }
}

// Safe filename from an image URL — preserve extension.
function imgFileName(absUrl) {
  const u = new URL(absUrl);
  const base = path.basename(decodeURIComponent(u.pathname));
  return base.replace(/[^\w.\-]+/g, '-');
}

// Extract <img src=…>, <source src=…>, <video src=…>, srcset first entries.
function extractAssetRefs(html) {
  const refs = new Set();
  // img src
  for (const m of html.matchAll(/<img\b[^>]*?\ssrc=["']([^"']+)["']/gi)) {
    refs.add(m[1]);
  }
  // source src (picture/video/audio)
  for (const m of html.matchAll(/<source\b[^>]*?\ssrc=["']([^"']+)["']/gi)) {
    refs.add(m[1]);
  }
  // video src
  for (const m of html.matchAll(/<video\b[^>]*?\ssrc=["']([^"']+)["']/gi)) {
    refs.add(m[1]);
  }
  // a href pointing to image/video assets
  for (const m of html.matchAll(
    /<a\b[^>]*?\shref=["']([^"']+\.(?:png|jpe?g|gif|webp|svg|mp4|webm))["']/gi,
  )) {
    refs.add(m[1]);
  }
  // data-src (lazy load)
  for (const m of html.matchAll(/<img\b[^>]*?\sdata-src=["']([^"']+)["']/gi)) {
    refs.add(m[1]);
  }
  // srcset: first URL before space
  for (const m of html.matchAll(/\ssrcset=["']([^"']+)["']/gi)) {
    const parts = m[1].split(',');
    for (const part of parts) {
      const url = part.trim().split(/\s+/)[0];
      if (url) refs.add(url);
    }
  }
  return [...refs];
}

// ---------- main ----------

async function processPage(page) {
  const pageUrl = MANIFEST.baseUrl + page.sourcePath;
  const htmlCachePath = path.join(CACHE_DIR, `${page.sourceId}.html`);
  const assetMapPath = path.join(ASSET_MAP_DIR, `${page.sourceId}.json`);
  const imgDir = path.join(IMG_ROOT, page.assetDir);

  // 1) HTML
  let html;
  if (!FORCE && fs.existsSync(htmlCachePath)) {
    html = fs.readFileSync(htmlCachePath, 'utf8');
    console.log(`  [cache] HTML ${page.sourceId}`);
  } else {
    console.log(`  [get]   HTML ${pageUrl}`);
    html = await downloadText(pageUrl);
    fs.mkdirSync(path.dirname(htmlCachePath), {recursive: true});
    fs.writeFileSync(htmlCachePath, html);
    await sleep(200); // be polite
  }

  // 2) Assets
  const refs = extractAssetRefs(html);
  const assetMap = {}; // absoluteUrl → {localPath, fileName}
  fs.mkdirSync(imgDir, {recursive: true});

  for (const ref of refs) {
    if (ref.startsWith('data:')) continue;
    const abs = resolveUrl(ref, pageUrl);
    if (!abs) continue;
    // Only pull assets from NVIDIA doc host — skip external trackers, fonts, etc.
    if (
      !/docs\.nvidia\.com|nvidia-.*\.s3\.|cloudfront\.net|developer\.nvidia\.com/.test(
        abs,
      )
    ) {
      // Still log so we don't silently drop unknown references
      // that might need manual attention.
      continue;
    }
    // Only treat as downloadable asset if it has a media-type extension.
    if (!/\.(?:png|jpe?g|gif|webp|svg|mp4|webm|mov)(?:\?|$)/i.test(abs))
      continue;

    const fileName = imgFileName(abs);
    const localAbs = path.join(imgDir, fileName);
    const localWeb = `/img/sim-to-real/${page.assetDir}/${fileName}`;

    if (!FORCE && fs.existsSync(localAbs) && fs.statSync(localAbs).size > 0) {
      assetMap[abs] = {localPath: localAbs, webPath: localWeb, fileName};
      continue;
    }

    try {
      console.log(`  [get]   IMG  ${abs}`);
      const buf = await downloadBinary(abs);
      fs.writeFileSync(localAbs, buf);
      assetMap[abs] = {
        localPath: localAbs,
        webPath: localWeb,
        fileName,
        bytes: buf.length,
      };
      await sleep(150);
    } catch (err) {
      console.warn(`  [warn] asset failed: ${abs} — ${err.message}`);
    }
  }

  // 3) Asset map
  fs.mkdirSync(path.dirname(assetMapPath), {recursive: true});
  fs.writeFileSync(
    assetMapPath,
    JSON.stringify(
      {
        sourceId: page.sourceId,
        pageUrl,
        assetDir: page.assetDir,
        assets: assetMap,
      },
      null,
      2,
    ),
  );

  return {page, assetCount: Object.keys(assetMap).length};
}

async function main() {
  fs.mkdirSync(CACHE_DIR, {recursive: true});
  fs.mkdirSync(ASSET_MAP_DIR, {recursive: true});
  fs.mkdirSync(IMG_ROOT, {recursive: true});

  console.log(
    `Fetching ${MANIFEST.pages.length} pages from ${MANIFEST.baseUrl}${
      FORCE ? ' [FORCE]' : ''
    }`,
  );
  console.log();

  const results = [];
  for (const page of MANIFEST.pages) {
    console.log(`[${page.sourceId}] ${page.title}`);
    try {
      const r = await processPage(page);
      results.push(r);
      console.log(`  ✓ ${r.assetCount} asset(s)`);
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
      results.push({page, error: err.message});
    }
    console.log();
  }

  // Summary
  const totalAssets = results.reduce((s, r) => s + (r.assetCount || 0), 0);
  const failed = results.filter((r) => r.error);
  console.log('─'.repeat(60));
  console.log(
    `Done: ${results.length - failed.length}/${results.length} pages OK`,
  );
  console.log(`Total assets downloaded: ${totalAssets}`);
  if (failed.length) {
    console.log(`Failed pages:`);
    for (const f of failed) console.log(`  - ${f.page.sourceId}: ${f.error}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
