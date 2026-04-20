---
title: 'Kod ve Modelleri İndirme'
sidebar_position: 2
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Kod ve Modelleri İndirme'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [06-get-the-code.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/06-get-the-code.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

### Bu Modül İçin Neye İhtiyacım Var?

Uygulamalı. Docker yüklü bir bilgisayara ve bir NVIDIA GPU'ya (Ada veya Blackwell mimarisi) ihtiyacınız var.

Bu modülde atölye (workshop) deposunu klonlayacak ve kursun geri kalanında kullanılan Docker kapsayıcılarını (container) derleyeceksiniz.

Bu içeriğin geçerli sürümü şunları kullanır:

- Isaac Sim 5.1.0

- Isaac Lab 2.3.0

- LeRobot 0.4.3

- GR00T N1.6

## Depoyu Klonlama

```bash
git clone https://github.com/isaac-sim/Sim-to-Real-SO-101-Workshop.git
cd Sim-to-Real-SO-101-Workshop
```

## Teleop ve Simülasyon Kapsayıcısını Derleme

```bash
docker build -t teleop-docker -f docker/sim/Dockerfile .
```

## Gerçek Robot ve Çıkarım (Inference) Sunucusunu Derleme

Bu derleme, teleop kapsayıcısından belirgin şekilde daha uzun sürer.

Blackwell GPU'lar

Blackwell mimarisine dayalı NVIDIA GPU'lar için (ör. RTX PRO 6000):

```bash
./docker/real/build.sh blackwell
```

Ada GPU'lar

Ada mimarisine dayalı NVIDIA GPU'lar için (ör. RTX 4090):

```bash
./docker/real/build.sh ada
```

## Modelleri Edinme

Bunları şimdi ya da ilerledikçe indirebilirsiniz.

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

## Sırada Ne Var?

Şimdi robotumuzu kalibre edip çalıştırmaya başlayacağız!

[SO-101'i Kalibre Etme](/sim-to-real/robot-laboratuvari/kalibrasyon) bölümüne devam edin.
