---
title: 'Strateji 3: Cosmos ile Veri Seti Zenginleştirme'
sidebar_position: 2
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Strateji 3: Cosmos ile Veri Seti Zenginleştirme'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [14-strategy3-cosmos.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/14-strategy3-cosmos.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

### Bu Modül İçin Neye İhtiyacım Var?

Uygulamalı. Kalibre edilmiş SO-101 robota, her iki kameraya, monte edilmiş çalışma alanına ve `real-robot` kapsayıcısına ihtiyacınız olacak.

Bu oturumda, Cosmos'un nasıl çeşitli sentetik eğitim verisi oluşturabildiğini öğrenecek ve Cosmos ile zenginleştirilmiş politikaları gerçek robota konuşlandıracaksınız.

## Öğrenme Hedefleri

Bu oturumun sonunda şunları yapabileceksiniz:

- Cosmos ve dünya modellerinin sentetik robot verisini nasıl ürettiğini **açıklama**

- Cosmos zenginleştirmesiyle eğitilmiş politikaları **konuşlandırma**

- Farklı eğitim verisi stratejileri arasında performansı **karşılaştırma**

## Domain Randomization ve Ortak Eğitimin Ötesinde

Strateji 1'de simülasyon parametrelerini çeşitlendirmek için domain randomization (DR) kullandınız. Bu etkilidir ama sınırlıdır:

- Yalnızca açıkça rastgeleleştirdiğiniz şeyleri çeşitlendirir

- Simülasyon render'ı hâlâ "sentetik" görünür

- Gerçekten yeni senaryolar üretemez

**Cosmos**, üretken modelleme (generative modeling) yoluyla bu kısıtlamaları ele alır.

## Cosmos Nedir?

Cosmos, NVIDIA'nın fiziksel AI için geliştirdiği dünya temel modelidir (world foundation model). Şunları yapabilir:

- İstemlerden veya başlangıç karelerinden gerçekçi video dizileri **üretmek**

- Makul fiziksel etkileşimleri **simüle etmek**

- Çeşitli sentetik senaryolarla robot eğitim verisini **zenginleştirmek**

### Cosmos Nasıl Çalışır?

```
Girdi: Robot demonstrasyon videosu + istem (prompt)
   "Aynı görev, farklı aydınlatma, farklı şişe konumları"

Cosmos şunu üretir: Tutarlı fiziğe ve yeni görsel görünüme sahip
                    senaryonun çoklu varyasyonları

Çıktı: Çeşitli koşullarla zenginleştirilmiş eğitim verisi
```

İstem (prompt):

```
prompt: Photorealistic first-person view from a robotic arm's orange claw-like gripper. The prongs are visible at the bottom edge, hovering over a heavily corroded, textured rusty steel plate showing oxidation and wear mat. To the left is a yellow rectangular vial rack; to the right, two white opaque centrifuge tubes with blue caps, filled with a white substance, lie horizontally. Plain white wall background with {bright, diffused clinical LED lighting. Sharp macro focus, realistic plastic finishes, and fluid mechanical motion.
{
"name": "so101",
"prompt_path": "prompt_test2.txt",
"video_path": "ego_rgb_001.mp4",
"guidance": 3,
"depth": {
"control_weight": 0.2,
"control_path": "ego_depth_001.mp4"
},
"edge": {
"control_weight": 1.0
},
"seg": {
"control_weight": 0.3,
"control_path": "ego_instance_id_segmentation_001.mp4"
},
"vis": {
"control_weight": 0.1
}
}
```

![Cosmos Zenginleştirme Örneği 1](/img/sim-to-real/14-strateji-3-cosmos/cosmos-augment-1.gif)

_Cosmos Zenginleştirme Örneği 1_

### Temel Yetenekler

**Görsel Çeşitlilik**

- Fotogerçekçi render varyasyonları

- Doğal aydınlatma değişiklikleri

- Arka plan ve doku çeşitliliği

**Senaryo Çeşitliliği**

- Nesne konumu değişiklikleri

- Farklı nesne örnekleri

- Çevresel modifikasyonlar

**Fiziksel Tutarlılık**

- Makul fiziği korur

- Görev yapısını korur

- Tutarlı nesne etkileşimleri

## Uygulama: Cosmos ile Zenginleştirilmiş Veriyi Kullanma

Bu öğrenme yolu için Cosmos ile zenginleştirilmiş veri setlerini önceden ürettik.

DR ile zenginleştirilmiş veriyle karşılaştırın:

- Render'daki görsel farkı fark edin

- Aydınlatma ve doku varyasyonlarını gözlemleyin

- Fiziksel makullüğü kontrol edin

## Değerlendirilecek Politikalar

Cosmos ile zenginleştirilmiş veriyle eğitilmiş bir politikayı, [Strateji 2](/sim-to-real/veri-zenginlestirme/strateji-2-cotraining) ve [Gerçek Değerlendirme](/sim-to-real/veri-egitim-degerlendirme/gercek-degerlendirme) bölümlerindekiyle aynı iki terminalli GR00T sunucu + istemci kurulumunu kullanarak konuşlandırın.

:::tip

Konuşlandırma sorunları için [Sorun Giderme Rehberi'ne](/sim-to-real/referans/sorun-giderme) bakın.

:::

### Hangi Politikayı Çalıştırıyoruz?

Test edilecek iki adet Cosmos ile zenginleştirilmiş politikamız var. Terminal 1'de `MODEL`'i değerlendirmek istediğiniz kontrol noktasına ayarlayın:

| Eğitim Verisi Karışımı | Veri Setini Görselleştir | Model Kontrol Noktası |
| --- | --- | --- |
| 75 sim bölümü + 7 Cosmos ile zenginleştirilmiş bölüm | [Hugging Face'te görselleştir](https://huggingface.co/spaces/lerobot/visualize_dataset?path=%2Fsreetz-nv%2Fso101_teleop_vials_rack_left_augment_02%2Fepisode_75) | [aravindhs-NV/sreetz-so101_teleop_vials_rack_left_augment_02/](https://huggingface.co/aravindhs-NV/sreetz-so101_teleop_vials_rack_left_augment_02) |
| 75 sim bölümü + 70 Cosmos ile zenginleştirilmiş bölüm | [Hugging Face'te görselleştir](https://huggingface.co/spaces/lerobot/visualize_dataset?path=%2Fsreetz-nv%2Fso101_teleop_vials_rack_left_cosmos_70%2Fepisode_75) | [aravindhs-NV/so100-orig-groot-vials-rack-left-cosmos-70](https://huggingface.co/aravindhs-NV/so100-orig-groot-vials-rack-left-cosmos-70) |

### Çalışma Alanı Hazırlığı

Strateji 2 ile aynı: robot bağlantısını doğrulayın, şişeleri ve rafı yerleştirin, kameraların net bir görüşü olduğundan emin olun, ışık kutusunu açın. [Çalışma Alanını Oluşturma](/sim-to-real/robot-laboratuvari/calisma-alani), [Strateji 2: Çalışma alanı hazırlığı](/sim-to-real/veri-zenginlestirme/strateji-2-cotraining#çalışma-alanı-hazırlığı) ve [Gerçek Değerlendirme: Çalışma alanı hazırlığı](/sim-to-real/veri-egitim-degerlendirme/gercek-degerlendirme) bölümlerine bakın.

### Gerçek Robotta Politika Değerlendirmesi Çalıştırma

Bu kurs boyunca değerlendirme çalıştırdığımızda iki terminal söz konusu olacaktır:

1.  Host terminali; burada GR00T kapsayıcısını ve politika sunucusunu başlatırız

2.  İstemci (client) terminali; burada değerlendirme koşusunu (rollout) çalıştırır ve robotu kontrol ederiz

Gerçek robot değerlendirmesi için istemci fiziksel robottur.

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

2.  Bu kapsayıcının içinde şunu **çalıştırın**. `MODEL`'i test etmek istediğiniz Cosmos ile zenginleştirilmiş kontrol noktasına ayarlayın (ör. 75+70 Cosmos).

```bash
export MODEL=aravindhs-NV/so100-orig-groot-vials-rack-left-cosmos-70
```

3.  Politika sunucusunu bu modelle **çalıştırın**.

```bash
python Isaac-GR00T/gr00t/eval/run_gr00t_server.py \
--model-path /workspace/models/$MODEL
```

### Terminal 2 (real-robot kapsayıcısı) — Değerlendirme koşusu

İkinci bir terminal açın. Aynı `real-robot` kapsayıcısına bağlanacak ve robot istemcisini çalıştıracaksınız.

1.  Host'ta, kapsayıcıya **bağlanın**:

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

Yürütme sırasında robotu ve terminali izleyin. Davranışı yalnızca sim ve ortak eğitilmiş politikalarla karşılaştırın: Cosmos ile zenginleştirilmiş politikalar, aydınlatma ve görsel varyasyona karşı farklı bir dayanıklılık gösterebilir.

**Robotu durdurmak için:** Terminal 2'de (robot istemcisi) **CTRL+C'ye basın**. Terminal 1'deki politika sunucusu çalışmaya devam eder.

**Tekrar çalıştırmak için:** Terminal 2'de `python Isaac-GR00T/gr00t/eval/real_robot/SO100/so101_eval.py ...` komutunu tekrar çalıştırmanız yeterlidir.

**Modeli değiştirmek veya tamamen yeniden başlatmak için:**

1.  Her iki terminaldeki komutları **durdurun** (**CTRL+C**)

2.  Değerlendirmek istediğiniz modeli yansıtacak şekilde `MODEL` ortam değişkenini **ayarlayın**

3.  Her terminaldeki komutları (model sunucusu, robot istemcisi) **yeniden başlatın**

### Cosmos ile Zenginleştirilmiş Veriyle Eğitilen Diğer Politikayı Denemek İçin

1.  Terminal 1'de, politika sunucusunu durdurmak için **CTRL+C'ye basın**.

2.  Terminal 2'de, robot istemcisini durdurmak için **CTRL+C'ye basın**.

3.  `MODEL` ortam değişkenini değerlendirmek istediğiniz modele **ayarlayın**.

```bash
export MODEL=aravindhs-NV/sreetz-so101_teleop_vials_rack_left_augment_02/checkpoint-10000
```

4.  Aynı komutu tekrar çalıştırarak politika sunucusunu **yeniden başlatın**.

```bash
python Isaac-GR00T/gr00t/eval/run_gr00t_server.py --model-path /workspace/models/$MODEL
```

5.  Aynı komutu tekrar çalıştırarak robot istemcisini tekrar **çalıştırın**.

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

- Değerlendirme başladığında robot yavaşça başlangıç pozuna yükselir, ardından çıkarım (inference) moduna geçer.

- Robot durdurulduğunda (**CTRL+C**), yavaşça kendi başlangıç (home) pozuna geri gider.

:::

:::tip

Değerlendirme denemeleri arasında politika sunucusunu çalışır durumda tutun. Yalnızca farklı bir model kontrol noktası yüklemek istediğinizde yeniden başlatın.

:::

### Politikaları Karşılaştırma

Cosmos ile zenginleştirilmiş politikayı çalıştırdıktan sonra, Strateji 2'den (ortak eğitilmiş) aldığınız notlarla ve daha önceki gerçek değerlendirme temel çizgisi (yalnızca sim politikası) ile karşılaştırın. Cosmos zenginleştirmesinin gerçek robotta tutarlılığı, kavrama başarısını veya yerleştirme doğruluğunu iyileştirip iyileştirmediğini not edin.

## Önemli Çıkarımlar

- Cosmos, DR yeteneklerinin ötesinde fotogerçekçi sentetik veri üretir

- Farklı yaklaşımlar sim-to-real boşluğunun farklı yönlerini ele alır

- Stratejileri birleştirmek çoğu zaman herhangi bir tek yaklaşımdan daha iyi çalışır

- Cosmos'tan gelen görsel çeşitlilik performans kazanımları açabilir

## Kaynaklar

- [Cosmos Transfer 2.5](https://research.nvidia.com/labs/dir/cosmos-transfer2.5/) — Cosmos video-to-video transfer yetenekleri üzerine NVIDIA Research sayfası

- [Cosmos Cookbook](https://nvidia-cosmos.github.io/cosmos-cookbook/) — Cosmos dünya temel modelleri için tarifler ve örnekler

## Sırada Ne Var?

Aktüasyon boşluğunu henüz ölçmedik veya ele almadık. Bir sonraki oturumda, [Sim-to-Real Strateji 4: SAGE + GapONet](/sim-to-real/aktuator-bosluk/strateji-4-sage) bölümünde aktüasyon boşluğunu sistematik olarak ölçmeyi ve kapatmayı öğreneceksiniz.
