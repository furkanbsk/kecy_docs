---
title: 'Veri Setleri ve Modeller'
sidebar_position: 2
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Veri Setleri ve Modeller'
needsTranslation: true
---

:::info Kaynak

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [datasets-and-models.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/datasets-and-models.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

Pre-collected datasets and pre-trained model checkpoints used in this course, hosted on Hugging Face.

## Datasets

| Dataset

|

Description

|

Used In

|  |
|  |

|

[sreetz-nv/so101_teleop_vials_rack_left](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left)

|

75 sim-only teleoperation demonstrations

|

[Strategy 1](/sim-to-real/veri-egitim-degerlendirme/strateji-1-domain-randomization), [Sim Evaluation](/sim-to-real/veri-egitim-degerlendirme/sim-degerlendirme), [Real Evaluation](/sim-to-real/veri-egitim-degerlendirme/gercek-degerlendirme)

| |

[sreetz-nv/so101_teleop_vials_rack_left_real_50](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left_real_50)

|

50 real-world teleoperation demonstrations

|

[Strategy 2](/sim-to-real/veri-zenginlestirme/strateji-2-cotraining)

| |

[sreetz-nv/so101_teleop_vials_rack_left_augment_02](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left_augment_02)

|

75 sim + 7 Cosmos-augmented episodes

|

[Strategy 3](/sim-to-real/veri-zenginlestirme/strateji-3-cosmos)

| |

[sreetz-nv/so101_teleop_vials_rack_left_cosmos_70](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left_cosmos_70)

|

75 sim + 70 Cosmos-augmented episodes

|

[Strategy 3](/sim-to-real/veri-zenginlestirme/strateji-3-cosmos)

|

## Models

| Model

|

Description

|

Used In

|  |
|  |

|

[nvidia/GR00T-N1.6-3B](https://huggingface.co/nvidia/GR00T-N1.6-3B)

|

Base GR00T N1.6 foundation model

|

[GR00T](/sim-to-real/veri-egitim-degerlendirme/isaac-groot)

| |

[aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left](https://huggingface.co/aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left)

|

Sim-only fine-tuned (75 sim episodes)

|

[Sim Evaluation](/sim-to-real/veri-egitim-degerlendirme/sim-degerlendirme), [Real Evaluation](/sim-to-real/veri-egitim-degerlendirme/gercek-degerlendirme)

| |

[aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left_sim_and_real](https://huggingface.co/aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left_sim_and_real)

|

Sim + real co-trained (75 sim + 50 real)

|

[Strategy 2](/sim-to-real/veri-zenginlestirme/strateji-2-cotraining)

| |

[aravindhs-NV/sreetz-so101_teleop_vials_rack_left_augment_02](https://huggingface.co/aravindhs-NV/sreetz-so101_teleop_vials_rack_left_augment_02)

|

Cosmos-augmented (75 sim + 7 Cosmos)

|

[Strategy 3](/sim-to-real/veri-zenginlestirme/strateji-3-cosmos)

| |

[aravindhs-NV/so100-orig-groot-vials-rack-left-cosmos-70](https://huggingface.co/aravindhs-NV/so100-orig-groot-vials-rack-left-cosmos-70)

|

Cosmos-augmented (75 sim + 70 Cosmos)

|

[Strategy 3](/sim-to-real/veri-zenginlestirme/strateji-3-cosmos)

|

## Download Models

From the root of the course repository:

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

On this page
