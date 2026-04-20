---
title: 'Strateji 4: SAGE + GapONet ile Aktüatör Boşluğunu Ölçme'
sidebar_position: 1
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Strateji 4: SAGE + GapONet ile Aktüatör Boşluğunu Ölçme'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [15-strategy4-sage.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/15-strategy4-sage.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

![SAGE GapONet Karşılaştırması](/img/sim-to-real/15-strateji-4-sage/sage-gaponet-comparison-feb9-model.png)

_SAGE GapONet Karşılaştırması_

Bu oturumda, SAGE kullanarak aktüasyon boşluğunu hassas bir şekilde nasıl nicelleştireceğinizi ve basit parametre ayarıyla yakalanamayan karmaşık aktüasyon dinamiklerini GapONet'in nasıl modelleyebildiğini öğreneceksiniz.

## Öğrenme Hedefleri

Bu oturumun sonunda şunları yapabileceksiniz:

- SAGE'in eklem bazında sim-to-real boşluğunu nasıl nicelleştirdiğini **açıklama**

- İyileştirmeye yol göstermek için SAGE analiz sonuçlarını **yorumlama**

- GapONet'in karmaşık aktüasyon dinamiklerini nasıl modellediğini **tanımlama**

## Sorun: Bilinmeyen Boşluk Kaynakları

Şimdiye kadar bu stratejilerin sağladığı iyileştirmeleri gördünüz:

- Domain randomization (Strateji 1)

- Gerçek veriyle ortak eğitim (Strateji 2)

- Cosmos zenginleştirmesi (Strateji 3)

Ancak aktüasyon boşluklarını henüz ele almadık. Bunları sistematik olarak kapatmak için, önce bazı kaynakları anlayalım:

### Sim-to-Real Boşluğunun Kaynakları

**Algılama (Sensing) Sırasında:**

- Kameralar için basitleştirilmiş veya yanlış sensör modelleri

- Simülatördeki fizik modelleme boşlukları

**Aktüasyon Sırasında:**

- Yanlış veya eksik aktüatör modelleri

- Fizik modelleme boşlukları (temas nüansları, sürtünme, kapalı döngü bağlantılar)

- Sistem düzeyinde karakterize edilmemiş dinamik etkiler (yük ile değişen eylemsizlik davranışı, değişken sürtünme)

- Yanlış URDF (eksik bileşen ayrıntıları, eksik özellikler, kullanıcı girdi hatası)

- CAD → URDF → USD format dönüşüm hataları

Bu boşlukları kapatmak için şunları bilmeniz gerekir:

- Boşluklar tam olarak **nerede**?

- **Ne kadar büyük**?

- **Neyin neden olduğu**?

Özellikle SO-101 için bir zorluk, aktüatörlerin sisteme ciddi bir geri tepme (backlash) sokabilen hobi servoları olmasıdır ve bu geri tepme robotun kinematik zinciri boyunca birikir.

SAGE, bu boşluğu görselleştirmemize ve ilgili verileri toplamamıza yardımcı olabilir.

## SAGE Nedir?

**SAGE** (Sim-to-Real Actuation Gap Estimation), sim-to-real boşluk algılaması, ölçümü ve köprülenmesine yönelik bir yaklaşımı göstermek amacıyla Tongji Üniversitesi (TJU), Pekin Üniversitesi (PKU) ve NVIDIA'nın ortaklaşa yürüttüğü bir projedir.

SAGE, eşleştirilmiş gerçek ve sim veri setlerini toplamanın, analiz etmenin, sim-to-real boşluğunu tahmin etmenin ve görselleştirmenin sistematik bir yolunu sunar.

**Depo**: [isaac-sim2real/sage](https://github.com/isaac-sim2real/sage)

SAGE sistematik olarak:

1.  Aynı hareketler için eşleştirilmiş gerçek ve simülasyon verilerini **toplar**

2.  Alanlar arasında konum, hız ve torku **karşılaştırır**

3.  Eklem bazında boşluğu **nicelleştirir**

4.  Boşluğun en büyük olduğu yeri **görselleştirir**

5.  GapONet veya parametre ayarı ile hedefli iyileştirmeyi **mümkün kılar**

![SAGE Genel Bakış](/img/sim-to-real/15-strateji-4-sage/sage-overview.png)

_SAGE boru hattı genel bakış: çeşitli hareket kaynaklarından boşluk tahmininden boşluk köprülemeye kadar._

### SAGE İş Akışı

```
┌─────────────────┐     ┌─────────────────┐
│  Hareket        │     │  Gerçek Robot   │
│  Dosyaları      │────▶│  Veri Toplama   │
│  (retargeted    │     │  (pos, hız, τ)  │
│   diziler)      │     │                 │
└─────────────────┘     └────────┬────────┘
                             │
                             ▼
┌─────────────────┐     ┌─────────────────┐
│  Isaac Sim'de   │     │   Simülasyon    │
│  Aynı Hareketler│────▶│  Veri Toplama   │
│                 │     │  (pos, hız, τ)  │
└─────────────────┘     └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Boşluk Analizi │
                    │  Eklem Bazında  │
                    │  Görselleştirme │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Boşluk Köprüleme│
                    │  (GapONet, vb.) │
                    └─────────────────┘
```

### Vaka Çalışması: SO-101 SAGE Boru Hattı Genel Bakışı

Aşağıdakiler size tüm boru hattının sezgisel bir genel bakışını sunar; adım adım uygulama bu belgenin ilerleyen kısımlarında yer almaktadır.

**Boru hattı kısaca.** SO-101 için biz (1) sim verisi toplarız, (2) gerçek robot verisi toplarız ve (3) bir boşluk-köprüleme modeli (GapONet; ayrıntıları daha sonra ele alınır) eğitiriz. SO-101 kurulumumuz bu tür bir eğitim için 8 saatlik gerçek yörünge verisi topladı.

<video controls autoPlay loop muted width="600">
  <source src="/img/sim-to-real/15-strateji-4-sage/so101_data_collection.mp4" type="video/mp4" />
</video>

_Gerçek robot veri toplama sırasında SO-101._

Aşağıda GapONet eğitildikten sonraki etkisini görmenin iki yolunu gösteriyoruz.

**1\. Simülasyon ortamında görsel karşılaştırma.** Isaac Sim'de gerçek robot hareketini sim tekrarı (replay) ile üst üste koyarız. Aşağıdaki GUI ekran görüntüsü şunu gösterir: **üstte** — gerçek sonuç ile GapONet _olmadan_ sim; **altta** — gerçek sonuç ile GapONet _ile_ sim. GapONet ile sim izi, gerçek harekete çok daha yakından uyuyor.

![Isaac Sim'de gerçek vs sim GapONet olmadan (üst) ve gerçek vs sim GapONet ile (alt)](/img/sim-to-real/15-strateji-4-sage/sage-gaponet-comparison-feb9-model.png)

_Üst: gerçek vs sim GapONet olmadan. Alt: gerçek vs sim GapONet ile._

**2\. Nicel eklem düzeyi hatası.** Her eklemde gerçek ile sim arasındaki hatayı ölçeriz. Aşağıdaki grafikte **turuncu**, GapONet _olmadan_ gerçek vs sim hatasıdır; **yeşil**, GapONet _ile_ gerçek vs sim hatasıdır. Daha düşük yeşil çubuklar, GapONet'in boşluğu azalttığını gösterir.

![Eklem düzeyi hata: turuncu = GapONet olmadan gerçek vs sim, yeşil = GapONet ile gerçek vs sim](/img/sim-to-real/15-strateji-4-sage/sage_new_dataset_results.png)

_Eklem hatası: turuncu = GapONet olmadan gerçek vs sim; yeşil = GapONet ile gerçek vs sim._

## SAGE Depo Yapısı

Dosya düzenini anlamak, çerçevede gezinmeye yardımcı olur. Mevcut yapı için [SAGE deposuna](https://github.com/isaac-sim2real/sage) bakın; basitleştirilmiş bir genel bakış:

```
sage/
├── assets/                    # Robot USD dosyaları
│   └── {robot_name}/
├── configs/
│   ├── {robot_name}_joints.yaml       # Tam eklem listesi
│   └── {robot_name}_valid_joints.txt  # Hareketle ilgili eklemler
├── docs/                      # Robota özgü kılavuzlar (ör. SO-101 için LEROBOT_REAL)
├── motion_files/
│   └── {robot_name}/{source}/         # Retargeted hareket dosyaları
├── output/
│   ├── sim/{robot_name}/{source}/{motion_name}/   # Simülasyon sonuçları
│   └── real/{robot_name}/{source}/{motion_name}/  # Gerçek robot sonuçları
├── sage/                      # Python paketi
│   ├── assets.py              # Robot yapılandırması (USD yolu, PD kazançları vb.)
│   ├── simulation.py          # Isaac Sim simülasyon kodu
│   ├── analysis.py            # Sim vs gerçek karşılaştırma ve metrikler
│   ├── real_unitree/          # Unitree H1-2 gerçek robot kodu
│   ├── real_realman/          # Realman WR75S gerçek robot kodu
│   └── real_so101/            # LeRobot SO-101 gerçek robot kodu
└── scripts/
├── run_simulation.py      # Simülasyon veri toplamayı çalıştır
├── run_analysis.py        # Sim vs gerçek karşılaştır, metrik ve grafik üret
└── run_real.py            # Gerçek robot veri toplamayı çalıştır
```

## Uygulama: Simülasyonda Bir Eylem Dizisinde SAGE Çalıştırma

Bu uygulama, tam SAGE boru hattını gösterir: aynı hareketi hem simülasyonda hem de gerçek donanımda çalıştırmak ve ardından boşluğu analiz etmek.

:::info

Bu uygulama referans amaçlıdır; zaman nedeniyle bugün bunu uygulamalı yapmayacağız.

:::

### Başlangıç

1.  İlk olarak, SAGE deposunu **klonlayın**:

```bash
git clone git@github.com:isaac-sim2real/sage.git
cd sage
```

2.  SAGE kapsayıcısını **başlatın**:

```bash
xhost +
docker run --name isaac-lab --entrypoint bash -it --gpus all -e "ACCEPT_EULA=Y" --rm --network=host \
-e "PRIVACY_CONSENT=Y" \
-e DISPLAY \
-v /tmp/.X11-unix:/tmp/.X11-unix \
-v $HOME/.Xauthority:/root/.Xauthority \
-v ~/docker/isaac-sim/cache/kit:/isaac-sim/kit/cache:rw \
-v ~/docker/isaac-sim/cache/ov:/root/.cache/ov:rw \
-v ~/docker/isaac-sim/cache/pip:/root/.cache/pip:rw \
-v ~/docker/isaac-sim/cache/glcache:/root/.cache/nvidia/GLCache:rw \
-v ~/docker/isaac-sim/cache/computecache:/root/.nv/ComputeCache:rw \
-v ~/docker/isaac-sim/logs:/root/.nvidia-omniverse/logs:rw \
-v ~/docker/isaac-sim/data:/root/.local/share/ov/data:rw \
-v ~/docker/isaac-sim/documents:/root/Documents:rw \
-v $(pwd):/app:rw \
sage
```

### Hareket Dosyası Seçme

Hareket dosyaları retargeted eylem dizilerini içerir. SAGE çeşitli hareket kaynaklarını destekler:

- **Teleoperasyon**: İnsan güdümlü hareketler

- **Uzaktan kumanda**: Joystick veya klavye kontrollü

- **Retargeted hareketler**: Hareket yakalamadan (motion capture) veya başka robotlardan

SO-101 için hareket dosyaları `motion_files/so101/custom/` altında bulunur; pick-and-place ve diğer yörüngeler dahil:

```bash
# Hareket dosyaları konumu
ls motion_files/so101/custom/

# Örnek çıktı (altküme):
# actuator_bandwidth.txt
# pick_place.txt
# oscillation_low_freq.txt
# random_waypoints.txt
# ...
```

Her `.txt` dosyası zaman içinde eklem açı pozisyonlarını içerir (biçim: ilk satır eklem adları, ardından her satırda radyan cinsinden virgülle ayrılmış açılar).

### Robot Yapılandırmasını Doğrulama

`sage/assets.py` içinde robot yapılandırmasını doğrulama:

```python
1# ROBOT_CONFIGS içindeki SO-101 girişi
2"so101": {
3    "usd_path": "assets/so101/SO-ARM101-USD.usd",
4    "offset": (0.0, 0.0, 0.0),
5    "default_kp": 100.0,   # PD kontrolörü sertliği (stiffness)
6    "default_kd": 2.0,     # PD kontrolörü sönümlemesi (damping)
7    "default_control_freq": 50.0,  # Kontrol frekansı (Hz)
8}
```

Geçerli eklem listesini doğrulama:

```bash
cat configs/so101_valid_joints.txt

# Örnek çıktı:
# Rotation
# Pitch
# Elbow
# Wrist_Pitch
# Wrist_Roll
# Jaw
```

### Simülasyon Veri Toplamayı Çalıştırma

SAGE kapsayıcısındaki aynı terminalin içinden, hareket dizisini Isaac Sim'de şimdi çalıştıracaktık:

```bash
${ISAACSIM_PATH}/python.sh scripts/run_simulation.py \
--robot-name so101 \
--motion-source custom \
--motion-files motion_files/so101/custom/pick_place.txt \
--valid-joints-file configs/so101_valid_joints.txt \
--output-folder output \
--fix-root \
--physics-freq 200 \
--render-freq 200 \
--control-freq 50 \
--kp 100 \
--kd 2
```

Bu şunları toplar:

- Komuta edilen eklem pozisyonları

- Gerçek eklem pozisyonları (simülasyondan)

- Eklem hızları

- Eklem torkları

### Gerçek Robot Veri Toplamayı Çalıştırma

Şimdi eşleştirilmiş bir veri seti oluşturmak için, aynı hareketi fiziksel SO-101 üzerinde çalıştıracağız. Bu gerçekten robotu hareket ettirecek ve veri kaydedecektir.

Buradaki talimatları izleyin: [LEROBOT_REAL.md](https://github.com/isaac-sim2real/sage/blob/main/docs/LEROBOT_REAL.md)

### Boşluğu Analiz Etme

Eşleştirilmiş sim-gerçek verisini karşılaştırın:

```bash
python scripts/run_analysis.py \
--robot-name so101 \
--motion-source custom \
--motion-names "pick_place" \
--output-folder output \
--valid-joints-file configs/so101_valid_joints.txt
```

![SAGE Elbow Axis Analizi](/img/sim-to-real/15-strateji-4-sage/sage-elbow-axis-analysis.png)

_Belirli bir eksen ve belirli bir hareket için boşluğu nicelleştirmek amacıyla SAGE verisinin analizi._

## Boşluk Köprüleme İçin Eşleştirilmiş Veriyi Kullanma

Sim-gerçek eşleştirilmiş veriniz olduğunda, aktüasyon boşluğunu köprüleyen bir sinir ağı eğitebilirsiniz. Bu boşluk-köprüleme modeli iki şekilde kullanılabilir:

**1\. Simülasyon ortamına entegre etme.** Modeli sim içinde kullanın, böylece ortam gerçek aktüasyonla daha iyi eşleşir. Bu boşluk-düzeltilmiş sim'de eğitilen politikaların sorunsuz sim-to-real konuşlandırma elde etme olasılığı daha yüksektir. Aşağıdaki şekil bu kullanımı göstermektedir.

**2\. Gerçek robot konuşlandırmasında kullanma.** Modeli gerçek robotta çıkarım (inference) zamanında uygulayın, böylece politikanın eylemleri yürütmeden önce aktüasyon boşluğu için düzeltilir. GapONet + GR00T entegrasyonu üzerine gelecekteki çalışmanın arkasındaki fikir budur: sim'de eğitilen bir politika, donanımda konuşlandırıldığında boşluk köprülemeden yararlanır.

![Simülasyon içinde boşluk-köprüleme modeli](/img/sim-to-real/15-strateji-4-sage/sage-use-in-training.png)

_Politikaların daha gerçekçi aktüasyonla eğitilebilmesi için simülasyon ortamı içinde bir boşluk-köprüleme modeli kullanımı._

## GapONet Nedir?

**GapONet**, Pekin Üniversitesi (PKU) tarafından geliştirilmiştir ve analitik olarak kolayca modellenemeyen etkileri yakalayan bir aktüatör davranış sinir ağı modeli öğrenir. GapONet, SAGE ekosisteminin bir parçasıdır ve SAGE'e entegrasyonu devam etmektedir.

### GapONet Nasıl Çalışır?

```
Eğitim Aşaması:
Girdi:  Komut edilen eylem dizileri (hareketlerden)
Hedef:  Gerçek sonuç hareketi (gerçek robottan)
Öğrenir: Komut → gerçek davranış eşlemesi

Çıkarım Aşaması:
Girdi:  Politikanın amaçlanan eylemi
Çıktı:  Amaçlanan davranışı gerçekleştiren kompanse edilmiş eylem
```

### GapONet Eğitimi

:::note

Bu bölüm referans amaçlıdır; zaman nedeniyle bugün bu eğitimi uygulamalı yapmayacağız.

:::

[GapONet deposu](https://github.com/jiemingcui/gaponet), sim-to-real insansı robot kontrolü için DeepONet, Transformer ve MLP mimarilerine sahip Isaac Lab tabanlı bir uygulama sunar. Depoyu ve gerekli assetleri kurduktan sonra (depo README'sine bakın), operatör ortamıyla eğitin:

```bash
python scripts/rsl_rl/train.py --task Isaac-Humanoid-Operator-Delta-Action \
--num_envs=4080 --max_iterations 100000 --experiment_name Sim2Real \
--letter amass --run_name delta_action_mlp_payload --device cuda env.mode=train --headless
```

`--num_envs`, `--max_iterations` ve `--run_name` değerlerini gerektiği gibi ayarlayın. Diğer mimariler veya görevler için deponun [Usage](https://github.com/jiemingcui/gaponet#usage) ve [Adding a New Robot](https://github.com/jiemingcui/gaponet#adding-a-new-robot) bölümlerine bakın.

**Değerlendirme ve dışa aktarma.** Bir kontrol noktasını değerlendirin:

```bash
python scripts/rsl_rl/play.py --task Isaac-Humanoid-Operator-Delta-Action \
--model ./model/model_17950.pt --num_envs 20 --headless
```

Isaac Sim olmadan hafif çıkarım için JIT'e dışa aktarın:

```bash
python scripts/rsl_rl/inference_jit.py \
--export \
--checkpoint ./model/model_17950.pt \
--task Isaac-Humanoid-Operator-Delta-Action \
--output ./model/policy.pt \
--device cuda:0 \
--num_envs 20
```

Ardından test verisi üzerinde çıkarım çalıştırın (Isaac Sim gerekmez):

```bash
python scripts/rsl_rl/deploy.py \
--model ./model/policy.pt \
--test_data ./source/sim2real/sim2real/tasks/humanoid_operator/motions/motion_amass/edited_27dof/test.npz
```

SO-101 veya diğer kollar için SAGE'in boşluk-köprüleme eğitimi genellikle eşleştirilmiş SAGE verisi kullanarak en büyük sim-to-real boşluğuna sahip eklemlere (ör. kavrayıcı, bilek) odaklanır; kesin betikler [SAGE deposuna](https://github.com/isaac-sim2real/sage) ve oradaki herhangi bir GapONet entegrasyonuna bağlıdır.

## Önceden Toplanmış Veri Seti

İnsansı robot araştırması için SAGE, önceden toplanmış veri setleri sunar:

**Unitree Veri Seti** (H1-2 insansı robot):

- Değişen yükler altında (0-3 kg) üst vücut hareketleri

- AMASS veri setinden uyarlanmış hareketler

- Eşleştirilmiş sim-gerçek verisi

**RealMan Veri Seti** (WR75S kollar):

- Dört farklı yük koşulu altında test edilmiş dört kol

- Robotlar arası genelleme çalışmaları

Bu veri setlerini indirmek için PKU Disk bağlantısı, SAGE deposunun [Processed Sim2Real Datasets](https://github.com/isaac-sim2real/sage#processed-sim2real-datasets) bölümündedir.

## Topluluk Odaklı Gelecek

SAGE, dünya çapındaki robot bilimcilerinin ortak çözümler için bir araya geldiği topluluk odaklı bir çaba haline gelmek üzere tasarlanmıştır.

**Topluluk Katkıları:**

- **Eşleştirilmiş veri setleri**: Yeni robotlar ve görevler için gerçek-sim hareket verisi

- **Sim-Ready assetler**: Doğru simülasyon için kalibre edilmiş robot USD dosyaları

- **Yeni NN mimarileri**: Boşluk tahmini ve kompanzasyonu için yeni modeller

- **Hibrit çözümler**: Analitik ve öğrenilmiş yaklaşımların kombinasyonları

**Planlanan Topluluk Özellikleri:**

- **Lider tablosu (leaderboard)**: Eğitilmiş ağları kalite, desteklediği görev uzayı ve robot modellerine göre sıralar

- **OEM Geri Bildirimi**: İnsansı robot üreticilerine assetlerini ve API'lerini iyileştirmede rehberlik eder

Kendi verinizi ve modellerinizi katkıda bulunmak, tüm robotik topluluğunun sim-to-real boşluğunu daha hızlı kapatmasına yardımcı olur.

## Gelecek İş: GapONet + GR00T Entegrasyonu

Kilit bir sonraki adım, SO-101 görevimiz için GapONet çıkarımını doğrudan GR00T konuşlandırma döngüsüne entegre etmektir:

```
GR00T Politikası → Eylem Komutu → GapONet Kompanzasyonu → Robot Yürütmesi
```

Bu, VLA politikasının amaçlanan eylemlerini çıkarırken GapONet'in gerçek zamanlı olarak aktüatör dinamiklerini otomatik olarak kompanse etmesine olanak tanır—temel modellerin genelleme yeteneğini öğrenilmiş aktüatör modellerinin hassasiyetiyle birleştirir.

Bu entegrasyon aktif geliştirme aşamasındadır.

## Önemli Çıkarımlar

- SAGE, nicel ve eklem bazında boşluk analizi sağlar

- Boru hattı: aynı hareket → sim + gerçek → karşılaştır → nicelleştir

- Boşlukların nerede olduğunu bilmek hedefli iyileştirmeyi mümkün kılar

- Küçük boşluklar: parametreleri ayarlayın; büyük boşluklar: GapONet kullanın

- GapONet, basit ayarla düzelmeyen karmaşık dinamikleri modelleyebilir

- Isaac Lab entegrasyonu, simülasyon iş akışlarında doğrudan kullanımı mümkün kılar

## Kaynaklar

- **SAGE Deposu**: [isaac-sim2real/sage](https://github.com/isaac-sim2real/sage)

- **GapONet Deposu**: [jiemingcui/gaponet](https://github.com/jiemingcui/gaponet)

## Sırada Ne Var?

Neler öğrendiğinizin bir özeti ve sonraki adımlar için [Sonuç](/sim-to-real/aktuator-bosluk/sonuc) bölümüne devam edin.
