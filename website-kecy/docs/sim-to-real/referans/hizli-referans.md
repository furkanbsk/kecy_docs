---
title: 'Hızlı Referans'
sidebar_position: 1
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Hızlı Referans'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [quick_reference.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/quick_reference.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

Yaygın görevler için hızlı komutlar. Ayrıntılı açıklamalar için [SO-101'i Kalibre Etme](/sim-to-real/robot-laboratuvari/kalibrasyon) ve [SO-101'i Çalıştırma](/sim-to-real/robot-laboratuvari/calistirma) bölümlerine bakın.

## Simülasyon (teleop ve değerlendirme) — Docker

Sim teleop ve sim politika değerlendirmesi için Isaac Sim kapsayıcısını başlatın:

```bash
xhost +
docker run --name teleop -it --privileged --gpus all -e "ACCEPT_EULA=Y" --rm --network=host \
-e "PRIVACY_CONSENT=Y" \
-e DISPLAY \
-v /dev:/dev \
-v /run/udev:/run/udev:ro \
-v $HOME/.Xauthority:/root/.Xauthority \
-v ~/docker/isaac-sim/cache/kit:/isaac-sim/kit/cache:rw \
-v ~/docker/isaac-sim/cache/ov:/root/.cache/ov:rw \
-v ~/docker/isaac-sim/cache/pip:/root/.cache/pip:rw \
-v ~/docker/isaac-sim/cache/glcache:/root/.cache/nvidia/GLCache:rw \
-v ~/docker/isaac-sim/cache/computecache:/root/.nv/ComputeCache:rw \
-v ~/docker/isaac-sim/logs:/root/.nvidia-omniverse/logs:rw \
-v ~/docker/isaac-sim/data:/root/.local/share/ov/data:rw \
-v ~/docker/isaac-sim/documents:/root/Documents:rw \
-v ~/.cache/huggingface/lerobot/calibration:/root/.cache/huggingface/lerobot/calibration \
-v ~/sim2real/Sim-to-Real-SO-101-Workshop/docker/env:/root/env \
-v ~/sim2real/Sim-to-Real-SO-101-Workshop:/workspace/Sim-to-Real-SO-101-Workshop \
teleop-docker:latest
```

İstemci/sunucu GR00T çıkarım iş akışı için bu kapsayıcıyı çalıştırın.

```bash
xhost +
docker run -it --rm --name real-robot --network host --privileged --gpus all \
-e DISPLAY \
-v /dev:/dev \
-v /run/udev:/run/udev:ro \
-v $HOME/.Xauthority:/root/.Xauthority \
-v /tmp/.X11-unix:/tmp/.X11-unix \
-v ~/.cache/huggingface/lerobot/calibration:/root/.cache/huggingface/lerobot/calibration \
-v ~/sim2real/models:/workspace/models \
-v ~/sim2real/Sim-to-Real-SO-101-Workshop/docker/env:/root/env \
-v ~/sim2real/Sim-to-Real-SO-101-Workshop/docker/real/scripts:/Isaac-GR00T/gr00t/eval/real_robot/SO100 \
real-robot \
/bin/bash
```

## Robot Portlarını Bulma

`teleop-docker` kapsayıcısının içinde:

```bash
lerobot-find-port
```

İstendiğinde USB kablosunu **çıkarın** ve **Enter'a basın**. Araç portu bildirir (ör. `/dev/ttyACM0`).

Bunları ileride kullanacağınız komutlarda kullanmak için yazabilir veya terminalinizdeki ortam değişkenlerine atayabilirsiniz.

```bash
# Ortam değişkenlerine kaydet
setenv ROBOT_PORT=/dev/ttyACM0
setenv TELEOP_PORT=/dev/ttyACM1

# Robot kimliklerini ayarla (istasyon etiketinize göre)
setenv ROBOT_ID=orange_robot
setenv TELEOP_ID=orange_teleop
```

## Kameraları Bulma

`teleop-docker` kapsayıcısının içinde:

```bash
lerobot-find-cameras opencv
```

Kavrayıcı ve dış kamera indekslerini tanımlamak için `./output/captured_images` içindeki yakalanmış görüntüleri inceleyin.

Robot portlarına benzer şekilde, bunları terminalinizdeki ortam değişkenlerine kaydedebilir veya komutlara manuel olarak girebilirsiniz.

```bash
# Ortam değişkenlerine kaydet
setenv CAMERA_GRIPPER=0
setenv CAMERA_EXTERNAL=2
```

## Leader Kolu (Teleop) Kalibre Etme

`teleop-docker` kapsayıcısının içinde:

```bash
lerobot-calibrate \
--teleop.type=so101_leader \
--teleop.port=$TELEOP_PORT \
--teleop.id=$TELEOP_ID
```

Eklemleri aralığın ortasına getirmek, ardından tam hareket aralığında hareket ettirmek için istemleri takip edin.

## Follower Kolu (Robot) Kalibre Etme

`teleop-docker` kapsayıcısının içinde:

```bash
lerobot-calibrate \
--robot.type=so101_follower \
--robot.port=$ROBOT_PORT \
--robot.id=$ROBOT_ID
```

## Gerçek Robotun Teleoperasyonu

`teleop-docker` kapsayıcısının içinde:

```bash
lerobot-teleoperate \
--robot.type=so101_follower \
--robot.port=$ROBOT_PORT \
--robot.id=$ROBOT_ID \
--teleop.type=so101_leader \
--teleop.port=$TELEOP_PORT \
--teleop.id=$TELEOP_ID
```

## Yaygın Sorunlar

Ayrıntılı çözümler için [Sorun Giderme Rehberi'ne](/sim-to-real/referans/sorun-giderme) bakın.

| Belirti                | Olası Neden                                         |
| ---------------------- | --------------------------------------------------- |
| Tüm motorlar eksik     | Güç bağlı değil                                     |
| Bir motor eksik        | Gevşek motor kablosu veya yeniden başlatma gerekli  |
| `Torque_Enable` hatası | Robotu güç döngüsü (power cycle) yapın              |
| Kamera indeksi değişti | `lerobot-find-cameras` komutunu tekrar çalıştırın   |
| Port bulunamadı        | USB'yi kontrol edin, `lerobot-find-port` çalıştırın |
