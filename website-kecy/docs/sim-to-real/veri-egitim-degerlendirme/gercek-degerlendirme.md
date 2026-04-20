---
title: 'Gerçek Robotta Değerlendirme'
sidebar_position: 4
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Gerçek Robotta Değerlendirme'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [12-real-evaluation.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/12-real-evaluation.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

### Bu Modül İçin Neye İhtiyacım Var?

Uygulamalı. Kalibre edilmiş SO-101 robota, her iki kameraya, monte edilmiş çalışma alanına ve `real-robot` kapsayıcısına ihtiyacınız olacak.

Bu oturumda, simülasyonda kullandığınız aynı GR00T tabanlı kurulumu kullanarak fiziksel SO-101 robot üzerinde politika değerlendirmesi çalıştıracaksınız.

İstemci (client) artık simülatör yerine gerçek robot!

## Öğrenme Hedefleri

Bu oturumun sonunda şunları yapabileceksiniz:

- GR00T sunucu + istemci (Docker) kurulumunu kullanarak gerçek robotta politika değerlendirmesi **çalıştırma**

- Sim-to-real boşluğunu ilk elden **gözlemleme**

- Değerlendirmeyi güvenli şekilde **durdurma ve yeniden başlatma**

## Hangi Politikayı Çalıştırıyoruz?

Simülasyonda değerlendirdiğiniz aynı politikayı kullanıyoruz. Kesin `MODEL` (kontrol noktası yolu) aşağıdaki komutlarda ayarlanmıştır.

## Gerçek Robotta Politika Değerlendirmesi Çalıştırma

Bu kurs boyunca değerlendirme çalıştırdığımızda iki terminal söz konusu olacaktır:

1.  Host terminali; burada GR00T kapsayıcısını ve politika sunucusunu başlatırız

2.  İstemci (client) terminali; burada değerlendirme koşusunu (rollout) çalıştırır ve robotu fiilen kontrol ederiz

Simülasyonda istemcimiz simülatörümüzdür. Gerçek robotta ise istemcimiz robotun kendisidir.

### Terminal 1 (real-robot kapsayıcısı) — GR00T politika sunucusunu başlatma

1.  `real-robot` kapsayıcısını zaten çalıştıran terminali **bulun**.

### Bulamıyorsanız kapsayıcıyı çalıştırma komutunu görmek için tıklayın.

`real-robot` kapsayıcısının terminali açık değilse yeni bir terminal penceresi **açın** (**CTRL+ALT+T**) ve docker `real-robot` kapsayıcısını şu komutla çalıştırın:

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

2.  Bu kapsayıcının içinde şunu **çalıştırın**. Burada hangi modelin değerlendirileceğini seçeriz.

```bash
export MODEL=aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left/checkpoint-10000
```

3.  Politika sunucusunu bu modelle **çalıştırın**.

```bash
python Isaac-GR00T/gr00t/eval/run_gr00t_server.py \
--model-path /workspace/models/$MODEL
```

### Terminal 2 (real-robot kapsayıcısı) — Değerlendirme koşusu

İkinci bir terminal açın. Aynı `real-robot` kapsayıcısına bağlanacak ve robot istemcisini çalıştıracaksınız. Bu adım, robotunuzun zaten kalibre edilmiş olduğunu varsayar (muhtemelen bunu daha önce yaptınız).

1.  `real-robot` kapsayıcısına ikinci bir terminal bağlayın.

```bash
docker exec -it real-robot /bin/bash
```

2.  Kapsayıcının içinde değerlendirme betiğini **çalıştırın**:

```bash
python Isaac-GR00T/gr00t/eval/real_robot/SO100/so101_eval.py \
--robot.type=so101_follower \
--robot.port="$ROBOT_PORT" \
--robot.id="$ROBOT_ID" \
--robot.cameras="{
  wrist:  {type: opencv, index_or_path: $CAMERA_GRIPPER, width: 640, height: 480, fps: 30},
  front:  {type: opencv, index_or_path: $CAMERA_EXTERNAL, width: 640, height: 480, fps: 30}
}" \
--policy_host=localhost \
--policy_port=5555 \
--lang_instruction="Pick up the vial and place it in the yellow rack" \
--rerun True
```

:::note

`--rerun` bayrağı opsiyoneldir.

Hata ayıklama için döngüye Rerun'u dahil eder; böylece politika çalışırken eklem eylemlerini ve kamera akışlarını görebilirsiniz. Bu, kamera görünümlerinin makul ve atamaların doğru olduğunu onaylamanıza olanak tanır.

:::

### Değerlendirmeyi İzleme

Yürütme sırasında robotu ve terminali izleyin. Politika, siz durdurana ya da değerlendirmeyi tamamlayana kadar çalışır. Yakından izleyin ama mesafenizi koruyun; beklenmedik davranışları not edin ve müdahale etmeye hazır olun.

**Robotu durdurmak için:** Terminal 2'de (robot istemcisi) **CTRL+C'ye basın**. Terminal 1'deki politika sunucusu çalışmaya devam eder.

**Tekrar çalıştırmak için:** Terminal 2'de `python Isaac-GR00T/gr00t/eval/real_robot/SO100/so101_eval.py ...` komutunu tekrar çalıştırmanız yeterlidir.

**Modeli değiştirmek veya tamamen yeniden başlatmak için:**

1.  Her iki terminaldeki komutları **durdurun** (**CTRL+C**)

2.  Değerlendirmek istediğiniz modeli yansıtacak şekilde `MODEL` ortam değişkenini **ayarlayın**

3.  Her terminaldeki komutları (model sunucusu, robot istemcisi) **yeniden başlatın**

:::note

- Değerlendirme başladığında robot yavaşça başlangıç pozuna yükselir, ardından çıkarım (inference) moduna geçer.

- Robot durdurulduğunda (CTRL+C), yavaşça kendi başlangıç (home) pozuna geri gider.

:::

:::tip

Değerlendirme denemeleri arasında politika sunucusunu çalışır durumda tutun. Yalnızca farklı bir model kontrol noktası yüklemek istediğinizde yeniden başlatın.

:::

## Yaygın Hata Modları

Gerçek değerlendirme koşularını gözlemlerken algı ve aktüasyonun simülasyondan nasıl farklılaştığına dikkat edin. Aynı politika, gerçek aydınlatma ve dinamiklerde kavramaları kaçırabilir, aşırıya gidebilir (overshoot) ya da farklı davranabilir. Bu farklılıklar, takip eden modüllerdeki stratejilerle ele alacağınız sim-to-real boşluğudur.

## Önemli Çıkarımlar

- Gerçek robot değerlendirmesi, simülasyon değerlendirmesiyle aynı GR00T sunucu + istemci mimarisini kullanır; yalnızca istemci (robot vs. simülatör) değişir

- Simülasyon ve gerçek performans arasındaki boşluk çoğu zaman hemen görünür — algı ve aktüasyonun ikisi de önemlidir

- Güvenli kapatma, önce robot istemci terminalinde CTRL+C ile yapılır

## Sırada Ne Var?

[Strateji 2: Gerçek Veriyle Co-Training](/sim-to-real/veri-zenginlestirme/strateji-2-cotraining) bölümüne devam edin; burada karma simülasyon ve gerçek veriyle eğitilmiş politikaları fiziksel robota konuşlandıracaksınız.
