---
title: 'Veri Setleri ve Modeller'
sidebar_position: 2
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Veri Setleri ve Modeller'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [datasets-and-models.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/datasets-and-models.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

Bu kursta kullanılan, Hugging Face üzerinde barındırılan önceden toplanmış veri setleri ve önceden eğitilmiş model kontrol noktaları.

## Veri Setleri

| Veri Seti | Açıklama | Kullanıldığı Yer |
| --- | --- | --- |
| [sreetz-nv/so101_teleop_vials_rack_left](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left) | 75 yalnızca sim teleoperasyon demonstrasyonu | [Strateji 1](/sim-to-real/veri-egitim-degerlendirme/strateji-1-domain-randomization), [Sim Değerlendirme](/sim-to-real/veri-egitim-degerlendirme/sim-degerlendirme), [Gerçek Değerlendirme](/sim-to-real/veri-egitim-degerlendirme/gercek-degerlendirme) |
| [sreetz-nv/so101_teleop_vials_rack_left_real_50](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left_real_50) | 50 gerçek dünya teleoperasyon demonstrasyonu | [Strateji 2](/sim-to-real/veri-zenginlestirme/strateji-2-cotraining) |
| [sreetz-nv/so101_teleop_vials_rack_left_augment_02](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left_augment_02) | 75 sim + 7 Cosmos ile zenginleştirilmiş bölüm | [Strateji 3](/sim-to-real/veri-zenginlestirme/strateji-3-cosmos) |
| [sreetz-nv/so101_teleop_vials_rack_left_cosmos_70](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left_cosmos_70) | 75 sim + 70 Cosmos ile zenginleştirilmiş bölüm | [Strateji 3](/sim-to-real/veri-zenginlestirme/strateji-3-cosmos) |

## Modeller

| Model | Açıklama | Kullanıldığı Yer |
| --- | --- | --- |
| [nvidia/GR00T-N1.6-3B](https://huggingface.co/nvidia/GR00T-N1.6-3B) | Temel GR00T N1.6 temel modeli | [GR00T](/sim-to-real/veri-egitim-degerlendirme/isaac-groot) |
| [aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left](https://huggingface.co/aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left) | Yalnızca sim ince ayar (75 sim bölümü) | [Sim Değerlendirme](/sim-to-real/veri-egitim-degerlendirme/sim-degerlendirme), [Gerçek Değerlendirme](/sim-to-real/veri-egitim-degerlendirme/gercek-degerlendirme) |
| [aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left_sim_and_real](https://huggingface.co/aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left_sim_and_real) | Sim + gerçek ortak eğitilmiş (75 sim + 50 gerçek) | [Strateji 2](/sim-to-real/veri-zenginlestirme/strateji-2-cotraining) |
| [aravindhs-NV/sreetz-so101_teleop_vials_rack_left_augment_02](https://huggingface.co/aravindhs-NV/sreetz-so101_teleop_vials_rack_left_augment_02) | Cosmos ile zenginleştirilmiş (75 sim + 7 Cosmos) | [Strateji 3](/sim-to-real/veri-zenginlestirme/strateji-3-cosmos) |
| [aravindhs-NV/so100-orig-groot-vials-rack-left-cosmos-70](https://huggingface.co/aravindhs-NV/so100-orig-groot-vials-rack-left-cosmos-70) | Cosmos ile zenginleştirilmiş (75 sim + 70 Cosmos) | [Strateji 3](/sim-to-real/veri-zenginlestirme/strateji-3-cosmos) |

## Modelleri İndirme

Kurs deposunun kök dizininden:

```bash
mkdir -p models
```

```bash
hf download aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left \
--local-dir ./models/aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left

hf download aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left_sim_and_real \
--local-dir ./models/aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left_sim_and_real

hf download aravindhs-NV/sreetz-so101_teleop_vials_rack_left_augment_02 \
--local-dir ./models/aravindhs-NV/sreetz-so101_teleop_vials_rack_left_augment_02

hf download aravindhs-NV/so100-orig-groot-vials-rack-left-cosmos-70 \
--local-dir ./models/aravindhs-NV/so100-orig-groot-vials-rack-left-cosmos-70
```
