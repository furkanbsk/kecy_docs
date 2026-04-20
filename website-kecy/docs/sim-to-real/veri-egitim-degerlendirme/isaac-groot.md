---
title: 'Isaac GR00T: Görü-Dil-Eylem Modelleri'
sidebar_position: 2
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Isaac GR00T: Görü-Dil-Eylem Modelleri'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [10-groot.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/10-groot.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

### Bu Modül İçin Neye İhtiyacım Var?

Çoğunlukla teori, kod örnekleriyle. `real-robot` kapsayıcısı derlenmiş bir bilgisayar dışında ek donanım gerekmez.

Bu oturumda NVIDIA Isaac GR00T adlı VLA modelini, nasıl çalıştığını ve iş başında örneklerini inceleyeceğiz.

## Öğrenme Hedefleri

Bu oturumun sonunda şunları yapabileceksiniz:

- Görü-dil-eylem modellerinin ne olduğunu ve neden güçlü olduklarını **açıklama**

- GR00T mimarisini ve bileşenlerini **tanımlama**

- VLA'ların geleneksel robot öğrenme yaklaşımlarından nasıl farklılaştığını **anlama**

## GR00T Nedir?

NVIDIA Isaac GR00T, insansı robot araştırma ve geliştirmesini hızlandırmak için genel amaçlı robot temel modelleri (foundation models) ve veri iş hatları geliştirmeye yönelik bir araştırma girişimi ve geliştirme platformudur.

Şunları sağlar:

- Büyük ölçekli veriden **önceden eğitilmiş görsel anlama**

- Esnek görev tanımı için **dile koşullu davranış**

- Gerçek zamanlı robot kontrolüne uygun **eylem üretimi**

Bu kursta, SO-101 robotu için post-train edilmiş GR00T N1.6 modellerini kullanacağız.

:::note

**Bu kursta eğitim süresi**

GR00T post-training'i GPU donanımda birkaç saat gerektirir — bu kursun tek seferde izin verdiğinden daha uzundur. Gün boyu kullanacağınız, çeşitli veri setlerinde önceden eğitilmiş bir politika kümesi hazırladık. Bu, eğitim işlerinin tamamlanmasını beklemek yerine iş akışını anlamaya, sonuçları değerlendirmeye ve stratejiler üzerinde yineleme yapmaya odaklanmanızı sağlar.

Burada gösterilen komutlar ve betikler o politikaları üretmek için kullanılan aynılarıdır; böylece öğrenme yolunu tamamladıktan sonra kendi donanımınızda süreci yeniden üretebilirsiniz.

:::

### GR00T N1.6'da Yeni Olan Ne?

GR00T N1.6, hem model mimarisi hem de veride iyileştirmelerle N1.5'e göre belirgin bir yükseltmedir.

**Mimari Değişiklikler:**

| Bileşen | N1.5 | N1.6 |
| --- | --- | --- |
| Temel VLM | Standart | Esnek çözünürlüklü Cosmos-Reason-2B varyantı |
| DiT katmanları | 16 | 32 (2 kat büyük) |
| VLM sonrası adaptör | 4 katmanlı transformer | Kaldırıldı; VLM'in üst 4 katmanını serbest bırakır (unfreeze) |
| Eylem formatı | Mutlak eklem açıları/EEF | Duruma göreli (state-relative) eylem parçaları |

### Vaka Çalışması: Zero-Shot Aktarım İyileştirmesi

GR00T, her biri önemli iyileştirmeler içeren birkaç yineleme yayınladı. N1.6'nın ölçülebilir gerçek dünya kazanımlarına nasıl dönüştüğüne bir örnek olarak SO-101 vaka çalışmasına bakalım.

**Görev**: Tüpleri mattan alıp rafa yerleştirme (yalnızca simülasyon eğitim verisi)

_\[Yer tutucu: Mat-tan-rafa görevi denemesinde N1.5 ve N1.6'nın yan yana karşılaştırması\]_

Bu, temel model iyileştirmelerinin göreve özgü gerçek veri olmasa bile sim-to-real boşluğunu nasıl azaltabildiğini gösterir.

## Görü-Dil-Eylem Modeli Nedir?

**Görü-Dil-Eylem (VLA) modelleri**, görsel girdi ve dil talimatlarını alıp robot gibi bedenlenmiş (embodied) bir etmen için düşük veya orta seviye eylemler üreten temel modellerdir.

```
Girdi: Kamera görüntüsü (1 veya daha fazla) + "Kırmızı tüpü al ve rafa yerleştir"
Çıktı: Görevi yürütmek için eklem konumları/hızlarından oluşan sıra
```

### Eğitim Aşamaları

VLA'lar tipik olarak aşamalar halinde eğitilir:

1.  **Büyük ölçekli ön eğitim (pretraining)**: İnternet ölçeğinde çok modlu veri (görüntüler, metin, video) genel görsel ve dilsel anlayışı inşa eder

2.  **Denetimli taklit/davranış kopyalama (imitation/behavior cloning)**: Robot gösterimleri, modele gözlemleri eylemlere eşlemeyi öğretir

3.  **İsteğe bağlı pekiştirmeli öğrenme (reinforcement learning)**: Gerçek dünya etkileşimi ve geri bildirimi yoluyla davranışı ince ayar eder

### Mimari Genel Bakışı

![VLA Model Mimarisi](/img/sim-to-real/10-isaac-groot/gr00t-architecture.png)

### Temel Bileşenler

**Görü Kodlayıcı (Vision Encoder)**: Kamera görüntülerini zengin öznitelik temsillerine dönüştürür

- Büyük görüntü veri setlerinde (ImageNet vb.) önceden eğitilmiştir

- Nesneleri, uzamsal ilişkileri, olası eylemleri (affordance) anlar

**Dil Kodlayıcı (Language Encoder)**: Görev talimatlarını işler

- Doğal dili görev gömmelerine (embedding) eşler

- Yeni görev tanımlarına zero-shot genelleme sağlar

**Modlar Arası Füzyon (Cross-Modal Fusion)**: Görü ve dili birleştirir

- Görsel öznitelikleri dile ilişkilendiren dikkat mekanizmaları

- Dil kavramlarını görsel gözlemlere temellendirir

**Eylem Çözücüsü (Action Decoder)**: Robot eylemlerini üretir

- Birleştirilmiş görsel-dilsel özniteliklere koşullanmıştır

- Uygun eylem temsilini (eklem konumları, hızları vb.) üretir

## VLA'lar Neden Güçlü

### 1\. Doğal Görev Tanımı

Belirli davranışları programlamak yerine görevleri düz dille tanımlayın:

```
"Robota en yakın mavi tüpü al"
"Tüpü soldaki boş yuvaya yerleştir"
"Tüpü masadan rafa taşı"
```

### 2\. Görsel Genelleme

Önceden eğitilmiş görü kodlayıcılar şunları sağlar:

- Aydınlatma değişikliklerine dayanıklılık

- Nesne kategorilerinin tanınması

- Uzamsal ilişkilerin anlaşılması

- Görsel alanlar arası aktarım

### 3\. Aktarım Öğrenmesi (Transfer Learning)

Önceden eğitilmiş bileşenler öğrenmeyi hızlandırır:

- Görüyü sıfırdan öğrenmek gerekmez

- Dil anlayışı "bedava" gelir

- Eğitim, eylem üretimine odaklanır

### 4\. Çok Modlu Akıl Yürütme

Görsel ve anlamsal anlayışı birleştirin:

- "Kırmızı olan" → Görüntüde kırmızı nesneleri bul

- "En yakın tüp" → Uzamsal akıl yürütme

- "Dikkatli yerleştir" → Hareket dinamiklerini ayarla

## Eylem Uzayı ve Kontrol

### Eylem Temsilleri

GR00T birkaç eylem temsilini destekler:

**Eklem Konumu Eylemleri**

- Robot konfigürasyonu üzerinde doğrudan kontrol

- Tüm kol koordinasyonunu öğrenmeyi gerektirir

**Uç İşlevleyici (End-Effector) Eylemleri**

- Ters kinematik (inverse kinematics) eklem komutlarını hesaplar

- Kol konfigürasyonunu soyutlar

**Eylem Parçalama (Action Chunking)**

- Aynı anda birden fazla gelecekteki eylemi tahmin etme

- Daha pürüzsüz yürütme, zamansal tutarlılık

Bu kursta **eylem parçalamalı eklem konumu eylemlerini** kullanıyoruz.

### Action Horizon Parametresi

`action_horizon` parametresi, modelin aynı anda kaç gelecekteki eylemi tahmin edeceğini kontrol eder. Hem eğitimi hem de konuşlandırmayı etkileyen kritik bir hiperparametredir.

**Neyi kontrol eder:**

- **Eğitim**: Model, geleceğe `action_horizon` zaman adımı için tahmin yapmayı öğrenir

- **Çıkarım (Inference)**: Model, her ileri geçişte `action_horizon` eylemden oluşan bir parça üretir

**Ödünleşimler:**

| Ufuk | Artıları | Eksileri |
| --- | --- | --- |
| Kısa (4-8) | Daha tepkisel, hızlı düzeltir | Kesik kesik hareket, sık yeniden planlama |
| Orta (16) | Pürüzsüzlük ve tepkisellik dengeli | Çoğu görev için iyi varsayılan |
| Uzun (32+) | Çok pürüzsüz yörüngeler | Hataları yavaş düzeltir, aşmaya (overshoot) meyilli |

:::tip

Varsayılan `action_horizon=16` ile başlayın. Yalnızca belirli sorunlar gözlemlerseniz ayarlayın: robot hedefleri aşarsa azaltın, hareket çok sarsıntılıysa artırın.

:::

## Örnek: İş Başında GR00T

### GR00T Post-Training

```bash
set -x -e

export NUM_GPUS=1

DATASET_PATH= #modelinizin yolunu belirleyin

# torchrun --nproc_per_node=$NUM_GPUS --master_port=29500 \
CUDA_VISIBLE_DEVICES=0 python \
gr00t/experiment/launch_finetune.py \
--base_model_path nvidia/GR00T-N1.6-3B \
--dataset_path $DATASET_PATH \
--modality_config_path examples/SO100/so100_config.py \
--embodiment_tag NEW_EMBODIMENT \
--num_gpus $NUM_GPUS \
--output_dir /tmp/so100_finetune \
--save_steps 1000 \
--save_total_limit 5 \
--max_steps 10000 \
--warmup_ratio 0.05 \
--weight_decay 1e-5 \
--learning_rate 1e-4 \
--use_wandb \
--global_batch_size 32 \
--color_jitter_params brightness 0.3 contrast 0.4 saturation 0.5 hue 0.08 \
--dataloader_num_workers 4
```

## Pratik Düşünceler

### Veri Gereksinimleri

VLA eğitimi tipik olarak şunları gerektirir:

- Temel yetkinlik için görev başına **50-200 gösterim**

- Her gösterimi tanımlayan **dil etiketlemeleri**

- Genellemeyi etkinleştirmek için **çeşitli koşullar**

:::tip

Kalite, miktardan daha önemlidir. 50 kaliteli, çeşitli gösterim çoğu zaman 500 tekrarlı olandan daha iyi performans gösterir.

:::

### Hesaplama Gereksinimleri

GR00T eğitimi şunlardan yararlanır:

- **GPU belleği**: Tam model eğitimi için 24GB+

- **Eğitim süresi**: Veri seti boyutuna bağlı olarak 2-8 saat

- **Çıkarım**: Modern GPU'larda (RTX 3080+) gerçek zamanlı

## Önemli Çıkarımlar

- VLA modelleri görü, dil ve eylemi birleşik bir mimaride birleştirir

- GR00T, öğrenmeyi hızlandırmak için önceden eğitilmiş bileşenler sunar

- Dile koşullanma esnek görev tanımını mümkün kılar

- Eylem parçalama pürüzsüz, zamansal olarak tutarlı kontrol sağlar

- Önceden eğitilmiş görü kodlayıcılar görsel genellemeyi mümkün kılar

## Kaynaklar

- [NVIDIA Isaac GR00T GitHub](https://github.com/NVIDIA/Isaac-GR00T) — Kaynak kod, model ağırlıkları ve dokümantasyon

- [Cosmos Cookbook](https://nvidia-cosmos.github.io/cosmos-cookbook/) — Cosmos dünya temel modelleri için tarifler ve örnekler

## Sırada Ne Var?

VLA'ları kavramsal olarak anladığınıza göre, simülasyonda politika değerlendirmesi çalıştırın. Sonraki oturum [Simülasyon Değerlendirmesi](/sim-to-real/veri-egitim-degerlendirme/sim-degerlendirme) bölümünde, açık döngü ve kapalı döngü değerlendirmeyi kullanarak politikaları simülasyonda karşılaştıracaksınız.
