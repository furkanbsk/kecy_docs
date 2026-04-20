---
title: 'Kod ve Modelleri İndirme'
sidebar_position: 2
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Kod ve Modelleri İndirme'
needsTranslation: true
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [06-get-the-code.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/06-get-the-code.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

What Do I Need for This Module?

Hands-on. You'll need a computer with Docker and an NVIDIA GPU (Ada or Blackwell architecture).

In this module, you'll clone the workshop repository and build the Docker containers used throughout the rest of the course.

The current version of this content uses:

- Isaac Sim 5.1.0

- Isaac Lab 2.3.0

- LeRobot 0.4.3

- GR00T N1.6

## Clone the Repository

```bash
git clone https://github.com/isaac-sim/Sim-to-Real-SO-101-Workshop.git
cd Sim-to-Real-SO-101-Workshop
```

## Build the Teleop and Simulation Container

```bash
docker build -t teleop-docker -f docker/sim/Dockerfile .
```

## Build the Real Robot and Inference Server

This build takes significantly longer than the teleop container.

Blackwell GPUs

For NVIDIA GPUs based on the Blackwell architecture (e.g. RTX PRO 6000):

```bash
./docker/real/build.sh blackwell
```

Ada GPUs

For NVIDIA GPUs based on the Ada architecture (e.g. RTX 4090):

```bash
./docker/real/build.sh ada
```

## Get the Models

You can either download these now, or as you go.

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

## What's Next?

Next we'll calibrate and start running our robot!

Continue to [Calibrating the SO-101](/sim-to-real/robot-laboratuvari/kalibrasyon).

On this page
