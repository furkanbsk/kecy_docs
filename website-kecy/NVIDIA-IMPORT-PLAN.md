# NVIDIA Sim-to-Real SO-101 → Türkçe İçe Aktarma Planı

**Kaynak:** https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/ **Hedef kategori:** `sim-to-real` (website-kecy/docs/sim-to-real/) **Durum:** Aşama A/B/C/D/E tamamlandı — tüm 19 sayfa Türkçeleştirildi, build temiz **Başlangıç:** 2026-04-12 **Tamamlanma:** 2026-04-21

---

## 0. Genel Kurallar (Değişmez)

- [ ] Hiçbir içerik atlanmayacak — metin, GIF, PNG, tablo, admonition, kod bloğu, hepsi aynen aktarılacak
- [ ] Tüm görseller yerel olarak kopyalanacak (`static/img/sim-to-real/<sayfa-slug>/`). Hotlink YOK.
- [ ] Kod blokları olduğu gibi kalacak — sadece **kod içindeki yorumlar** Türkçeleştirilecek
- [ ] Her sayfanın en üstüne kaynak atıfı eklenecek: `> Orijinal: [NVIDIA Docs](link) — bu sayfa Türkçeye çevrilmiştir.`
- [ ] Harici bağlantılar (GitHub, NVIDIA ürün sayfaları) olduğu gibi kalacak
- [ ] Terimler tutarlı kalacak (aşağıdaki sözlük)

---

## 1. Terim Sözlüğü (Tutarlılık İçin)

| EN | TR (tercih) | Not |
| --- | --- | --- |
| Sim-to-Real | Sim-to-Real | Çevirme (özel terim) |
| Domain Randomization | Alan Rastlantısallaştırma / Domain Randomization | İlk geçişte her ikisi |
| Teleoperation | Teleoperasyon | — |
| Workspace | Çalışma Alanı | — |
| Bill of Materials | Malzeme Listesi | — |
| Lightbox | Işık Kutusu | — |
| Calibration | Kalibrasyon | — |
| Vision-Language-Action | Görü-Dil-Eylem (VLA) | Kısaltma korunur |
| Dataset | Veri seti | — |
| Co-training | Ortak Eğitim (Co-training) | — |
| Fine-tuning | İnce Ayar | — |
| Policy | Politika | RL anlamında |
| Simulation | Simülasyon | — |
| Actuation Gap | Aktüatör Boşluğu | — |
| Troubleshooting | Sorun Giderme | — |
| Prop | Aksesuar / Nesne | Bağlama göre |
| Centrifuge vial | Santrifüj tüpü | — |
| Rack | Raf / Stand | — |
| Pick-and-place | Al-bırak | — |

---

## 2. Klasör Yapısı

```
website-kecy/
├── docs/sim-to-real/
│   ├── _category_.json                    (label: "Sim-to-Real", position: 3)
│   ├── giris/
│   │   ├── _category_.json                (label: "Giriş", position: 1)
│   │   ├── genel-bakis.md                 (01-overview)
│   │   ├── nasil-calisilir.md             (02-how-to-take-this-course)
│   │   ├── sim-to-real-nedir.md           (03-sim-to-real)
│   │   └── lerobot.md                     (04-lerobot)
│   ├── robot-laboratuvari/
│   │   ├── _category_.json                (label: "Robot Laboratuvarı", position: 2)
│   │   ├── calisma-alani.md               (05-building-workspace)
│   │   ├── kod-ve-modeller.md             (06-get-the-code)
│   │   ├── kalibrasyon.md                 (07-calibrating-so101)
│   │   └── calistirma.md                  (08-operating-so101)
│   ├── veri-egitim-degerlendirme/
│   │   ├── _category_.json                (label: "Veri, Eğitim, Değerlendirme", position: 3)
│   │   ├── strateji-1-domain-randomization.md  (09-strategy1-dr-teleop)
│   │   ├── isaac-groot.md                 (10-groot)
│   │   ├── sim-degerlendirme.md           (11-sim-evaluation)
│   │   └── gercek-degerlendirme.md        (12-real-evaluation)
│   ├── veri-zenginlestirme/
│   │   ├── _category_.json                (label: "Veri Setlerini Zenginleştirme", position: 4)
│   │   ├── strateji-2-cotraining.md       (13-strategy2-cotraining)
│   │   └── strateji-3-cosmos.md           (14-strategy3-cosmos)
│   ├── aktuator-bosluk/
│   │   ├── _category_.json                (label: "Aktüatör Boşluğunu Ölçme", position: 5)
│   │   ├── strateji-4-sage.md             (15-strategy4-sage)
│   │   └── sonuc.md                       (16-conclusion)
│   └── referans/
│       ├── _category_.json                (label: "Referans", position: 6)
│       ├── hizli-referans.md              (quick_reference)
│       ├── veri-setleri-ve-modeller.md    (datasets-and-models)
│       └── sorun-giderme.md               (troubleshooting)
├── static/img/sim-to-real/
│   ├── 01-genel-bakis/
│   ├── 02-nasil-calisilir/
│   ├── ...
│   └── troubleshooting/
└── scripts/
    ├── fetch-nvidia-sim2real.mjs          (indirme aşaması)
    ├── convert-nvidia-sim2real.mjs        (HTML → MD dönüşümü)
    ├── translate-nvidia-sim2real.mjs      (toplu çeviri)
    └── nvidia-sim2real-manifest.json      (sayfa-slug-URL eşlemesi)
```

---

## 3. Pipeline Aşamaları

### Aşama A — Hazırlık ✅

- [x] `scripts/nvidia-sim2real-manifest.json` oluştur (19 sayfa)
- [x] `scripts/fetch-nvidia-sim2real.mjs` yazılacak (Node, zero-dep + `fetch()`)
- [ ] `turndown` ve `turndown-plugin-gfm` paketlerini `website-kecy` dev dependency olarak ekle (HTML→MD için)

### Aşama B — Scraping (tek sefer, cache'li) ✅

- [x] 19 HTML sayfayı `scripts/.cache/nvidia-html/*.html` içine indir
- [x] Her sayfadan görsel URL'lerini çıkar
- [x] Tüm görselleri `static/img/sim-to-real/<sayfa-slug>/` altına indir — **35 içerik görseli, 150 MB**
- [x] NVIDIA chrome (logo duplikatları) temizlendi (76 dosya)
- [x] Görsel yollarını dokümandaki referanslara göre yeniden yaz (asset-map JSON'ları üretildi)

### Aşama C — HTML → Markdown Dönüşümü ✅

- [x] `scripts/convert-nvidia-sim2real.mjs` yazıldı (cheerio + turndown + turndown-plugin-gfm)
- [x] Turndown ile dönüştür — 19/19 sayfa OK
- [x] NVIDIA admonition kutularını Docusaurus `:::tip/:::note/:::warning/:::danger/:::info`'ya çevir (sentinel + dedent post-process)
- [x] Tabloları GitHub-flavored markdown tablolarına dönüştür (`turndown-plugin-gfm`)
- [x] `<video>`, iframe, GIF etiketlerini koru — GIF'ler normal `![]()` olarak; video/iframe kaynakta yoktu
- [x] Dahili `*.html` bağlantılarını Docusaurus slug'larına çevir (manifest lookup)
- [x] Frontmatter ekle: `title`, `sidebar_position`, `description`, `needsTranslation: true`
- [x] Her sayfanın üstüne kaynak atıfı admonition'ı
- [x] NVIDIA kaynağında 2 bozuk görsel (`images/n15_vs_n16_comparison.gif`, `images/two-viewports.png`) — 404'e düşüyor; converter kibarca "[Görsel (kaynakta eksik): alt]" metnine indiriyor
- [x] `docusaurus.config.ts` → `markdown.hooks.onBrokenMarkdownImages: 'warn'` ayarlandı
- [x] `yarn build` başarılı — yalnızca 4 kırık heading-anchor uyarısı (çeviri sonrası başlık slug'ları değişince zaten düzenlenecek)

### Aşama D — Çeviri

**Yaklaşım:** Claude Opus 4.7 ile toplu çeviri → insan kontrolü.

- [ ] `translate-nvidia-sim2real.mjs` script'i yazılacak
- [ ] Her sayfayı Claude'a gönder; prompt:
  - Kod bloklarına dokunma (sadece yorumları Türkçeleştir)
  - Frontmatter'a dokunma
  - Resim yollarına dokunma
  - Admonition etiketlerine dokunma (`:::tip` vb.)
  - Sözlük #1 bölümündeki terimleri kullan
  - HTML etiketlerini koru
- [ ] Çıktıyı `docs/sim-to-real/...` altına yaz
- [ ] Her sayfayı manuel incele (kalite + terim tutarlılığı)

### Aşama E — Entegrasyon

- [x] `docs/intro.md`'ye **Sim-to-Real** linki ekle
- [ ] Navbar'da **Sim-to-Real** için ayrı menü öğesi (opsiyonel — şimdilik sidebar yeterli)
- [x] `_category_.json` dosyaları yaz (kök + 6 bölüm: Giriş, Robot Lab., Veri-Eğitim-Değ., Veri-Zenginleştirme, Aktüatör Boşluğu, Referans)
- [x] `yarn workspace website-kecy build` — başarılı (4 anchor uyarısı, çeviri sonrası gider)
- [ ] Çeviri sonrası: dev server'da tüm 19 sayfayı tek tek kontrol et

---

## 4. Sayfa Bazlı Takip (19 sayfa)

Her sayfa için 4 aşama: **indir** → **dönüştür** → **çevir** → **kontrol**.

### Bölüm 1 — Giriş (4 sayfa)

| # | Sayfa | İndir | MD | Çeviri | Kontrol | Not |
| --- | --- | :-: | :-: | :-: | :-: | --- |
| 01 | Genel Bakış (01-overview) | ✅ | ✅ | ☐ | ☐ | 6 GIF (index'teki) |
| 02 | Nasıl Çalışılır (02-how-to-take-this-course) | ✅ | ✅ | ☐ | ☐ |  |
| 03 | Sim-to-Real Nedir (03-sim-to-real) | ✅ | ✅ | ☐ | ☐ |  |
| 04 | LeRobot (04-lerobot) | ✅ | ✅ | ☐ | ☐ |  |

### Bölüm 2 — Robot Laboratuvarı (4 sayfa)

| # | Sayfa | İndir | MD | Çeviri | Kontrol | Not |
| --- | --- | :-: | :-: | :-: | :-: | --- |
| 05 | Çalışma Alanını Kurma (05-building-workspace) | ✅ | ✅ | ☐ | ☐ | ~2,800 kelime, 3 tablo, 4 admonition, 2 JPG + 1 GIF |
| 06 | Kod ve Modelleri Al (06-get-the-code) | ✅ | ✅ | ☐ | ☐ |  |
| 07 | SO-101 Kalibrasyon (07-calibrating-so101) | ✅ | ✅ | ☐ | ☐ |  |
| 08 | SO-101'i Çalıştırma (08-operating-so101) | ✅ | ✅ | ☐ | ☐ |  |

### Bölüm 3 — Veri, Eğitim, Değerlendirme (4 sayfa)

| # | Sayfa | İndir | MD | Çeviri | Kontrol | Not |
| --- | --- | :-: | :-: | :-: | :-: | --- |
| 09 | Strateji 1: Domain Randomization (09-strategy1-dr-teleop) | ✅ | ✅ | ☐ | ☐ | ~3,200 kelime, 5 Python kod, 4 görsel, 5 admonition, 2 tablo |
| 10 | Isaac GR00T: VLA (10-groot) | ✅ | ✅ | ☐ | ☐ |  |
| 11 | Sim Değerlendirme (11-sim-evaluation) | ✅ | ✅ | ☐ | ☐ |  |
| 12 | Gerçek Değerlendirme (12-real-evaluation) | ✅ | ✅ | ☐ | ☐ |  |

### Bölüm 4 — Veri Setlerini Zenginleştirme (2 sayfa)

| # | Sayfa | İndir | MD | Çeviri | Kontrol | Not |
| --- | --- | :-: | :-: | :-: | :-: | --- |
| 13 | Strateji 2: Co-Training (13-strategy2-cotraining) | ✅ | ✅ | ☐ | ☐ |  |
| 14 | Strateji 3: Cosmos Zenginleştirme (14-strategy3-cosmos) | ✅ | ✅ | ☐ | ☐ |  |

### Bölüm 5 — Aktüatör Boşluğu (2 sayfa)

| # | Sayfa | İndir | MD | Çeviri | Kontrol | Not |
| --- | --- | :-: | :-: | :-: | :-: | --- |
| 15 | Strateji 4: SAGE + GapONet (15-strategy4-sage) | ✅ | ✅ | ☐ | ☐ |  |
| 16 | Sonuç (16-conclusion) | ✅ | ✅ | ☐ | ☐ |  |

### Bölüm 6 — Referans (3 sayfa)

| # | Sayfa | İndir | MD | Çeviri | Kontrol | Not |
| --- | --- | :-: | :-: | :-: | :-: | --- |
| R1 | Hızlı Referans (quick_reference) | ✅ | ✅ | ☐ | ☐ |  |
| R2 | Veri Setleri ve Modeller (datasets-and-models) | ✅ | ✅ | ☐ | ☐ |  |
| R3 | Sorun Giderme (troubleshooting) | ✅ | ✅ | ☐ | ☐ |  |

---

## 5. Görsel Varlık Takibi

Her sayfanın görselleri kendi klasöründe toplanacak. Beklenen toplam: ~80–120 dosya (GIF + PNG + JPG karışık, tahmini 100–300 MB).

| Sayfa | Beklenen Görsel | İndirilen | Yol |
| --- | :-: | :-: | --- |
| 01-overview | 6 GIF | ☐ | `static/img/sim-to-real/01-genel-bakis/` |
| 05-building-workspace | 2 JPG + 1 GIF | ☐ | `static/img/sim-to-real/05-calisma-alani/` |
| 09-strategy1-dr-teleop | 3 GIF + birkaç PNG | ☐ | `static/img/sim-to-real/09-strateji-1/` |
| (diğer sayfalar fetch aşamasında sayılacak) | — | ☐ | — |

> Not: Bazı GIF'ler büyük olabilir (>10MB). Git LFS gerekebilir; önce boyutu ölçüp karar verilecek. Checklist:
>
> - [ ] Toplam görsel boyutunu ölç
> - [ ] Eğer >50 MB → Git LFS kur
> - [ ] Eğer <50 MB → doğrudan commit

---

## 6. Yasal / Atıf

- [ ] Her sayfanın frontmatter'ının altında atıf bloğu:
  ```markdown
  :::info Kaynak Bu sayfa NVIDIA'nın **[Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac](ORIJINAL_URL)** dokümanından Türkçeye çevrilmiştir. Görseller ve kod örnekleri NVIDIA Corporation'a aittir. :::
  ```
- [ ] Kategori girişinde (`docs/sim-to-real/_category_.json` link description) aynı atıf bulunacak
- [ ] Kategori README'sinde lisans/atıf bildirimi (ana sayfada link)

---

## 7. Kalite Kontrol Listesi (Aşama E sonrası)

- [ ] Tüm 19 sayfa Docusaurus'ta render oluyor
- [ ] Tüm görseller yükleniyor (hiçbir kırık img yok)
- [ ] Tüm dahili bağlantılar çalışıyor (`yarn build` broken-link check geçiyor)
- [ ] Sidebar'da doğru sırayla görünüyor
- [ ] Admonition kutuları doğru renkte (tip/note/warning/danger)
- [ ] Kod blokları syntax highlighting aktif
- [ ] Türkçe karakterler düzgün render (ç ğ ı ö ş ü)
- [ ] Kategori başlangıç sayfası (generated-index) akıcı
- [ ] `docs/intro.md`'de yeni kategori linki var
- [ ] Mobile görünümde kırılma yok (navbar, sidebar, tablolar)

---

## 8. İlerleme Özeti

- **Toplam sayfa:** 19
- **İndir + MD dönüşümü tamamlanan:** 19 / 19 ✅
- **Türkçe çevrilen:** 19 / 19 ✅ — tüm sayfalar Türkçeleştirildi; `needsTranslation: false` bayrağı tüm dosyalarda güncellendi
- **Görsel indirilen:** 35 içerik görseli (+ NVIDIA chrome temizlendi)
- **Build durumu:** ✅ `yarn workspace website-kecy build` temiz geçiyor (0 kırık bağlantı, 0 kırık çapa)
- **Kaynakta bozuk 2 görsel:** `images/n15_vs_n16_comparison.gif`, `images/two-viewports.png` → metin notuna indirgendi
- **Son güncelleme:** 2026-04-21 — Aşama D tamamlandı; tüm 19 sayfa çevrildi; MDX `{#id}` sözdizimi sorunu Türkçe auto-slug'a geçilerek çözüldü; final build yeşil

---

## 9. Açık Kararlar / Notlar

- [x] Kategori ismi: `sim-to-real` — onaylandı
- [x] GIF'ler yerel kopyalanacak — onaylandı
- [x] Hiçbir içerik atlanmayacak — onaylandı
- [ ] Kod bloğu yorumları çevrilecek mi? (varsayılan: evet, yalnızca yorumlar)
- [ ] Çeviri yaklaşımı onayı: Claude Opus 4.7 toplu + manuel inceleme (varsayılan)
- [ ] Git LFS gerekliliği — Aşama B sonrası netleşecek

---

## 10. Sonraki Adım

1. `scripts/nvidia-sim2real-manifest.json` yazılacak
2. `scripts/fetch-nvidia-sim2real.mjs` yazılacak (cache'li HTML indirici + görsel çekici)
3. Çalıştır: 19 sayfa + görseller lokalde hazır
4. Dönüşüm script'ini yaz, 1–2 sayfada deneme yap
5. Çeviri script'ini yaz, 1 sayfada deneme yap
6. Tüm sayfalarda otomatik pipeline
7. Manuel QA + build + push
