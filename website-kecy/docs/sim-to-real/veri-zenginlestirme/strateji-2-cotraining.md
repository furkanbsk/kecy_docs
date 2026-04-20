---
title: 'Strateji 2: Gerçek Veriyle Ortak Eğitim'
sidebar_position: 1
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Strateji 2: Gerçek Veriyle Ortak Eğitim'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [13-strategy2-cotraining.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/13-strategy2-cotraining.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

### Bu Modül İçin Neye İhtiyacım Var?

Uygulamalı. Kalibre edilmiş SO-101 robota, teleop koluna, her iki kameraya, monte edilmiş çalışma alanına ve `real-robot` kapsayıcısına ihtiyacınız olacak.

Bu oturumda, ortak eğitim (co-training) yaklaşımlarının teorisini öğrenecek ve ardından fiziksel robota ilk politikanızı konuşlandıracaksınız.

## Öğrenme Hedefleri

Bu oturumun sonunda şunları yapabileceksiniz:

- Simülasyon ve gerçek veriyi karıştırmaya yönelik ortak eğitim stratejilerini **açıklama**

- Eğitilmiş politikaları fiziksel SO-101 robota güvenli şekilde **konuşlandırma**

- Gerçek dünya politika davranışını **gözlemleme ve belgeleme**

- İlk sim-to-real boşluğu belirtilerini **tanımlama**

## Ortak Eğitim (Co-Training) Nedir?

Ortak eğitim, politika eğitimi sırasında birden fazla kaynaktan—simülasyon ve gerçek dünya—gelen verileri birleştirir.

Örneklerimizde, küçük miktarda gerçek demonstrasyon verisini (5 bölüm) çok daha büyük bir simülasyon demonstrasyonları kümesiyle (70-100) birleştirmenin gücünü göstereceğiz.

Farklı veri karışımlarıyla eğitilmiş politikaları deneyimleme şansınız olacak.

![Fiziksel demonstrasyon](/img/sim-to-real/13-strateji-2-cotraining/real_demos_vial_rack.gif)

_Teleoperasyon ile görevin fiziksel demonstrasyonu._

:::tip

Yalnızca gerçek demonstrasyonlardan oluşan bir veri setini Hugging Face Dataset Visualizer kullanarak [buradan](https://huggingface.co/spaces/lerobot/visualize_dataset?path=%2Fsreetz-nv%2Fso101_teleop_vials_rack_left_real_50%2Fepisode_0) görüntüleyin.

:::

### Veri Zorluğu

| Veri Kaynağı             | Miktar  | Kalite   | Gerçeklik Uyumu |
| ------------------------ | ------- | -------- | --------------- |
| **Simülasyon**           | Bol     | Tutarlı  | Yaklaşık        |
| **Gerçek teleoperasyon** | Sınırlı | Değişken | Tam             |

Hiçbir kaynak tek başına ideal değildir:

- **Yalnızca sim**: Bol ancak gerçek dünya dağılımıyla eşleşmez

- **Yalnızca gerçek**: Gerçeklikle eşleşir ama miktar sınırlıdır

**Ortak eğitim** her ikisinden de yararlanır.

## (Opsiyonel) LeRobot ile Gerçek Demonstrasyon Toplama

Hem bir gerçek veri seti hem de bu sim+gerçek veri seti üzerinde eğitilmiş post-trained (son eğitimden geçmiş) bir GR00T modeli sağlayacağız. Ancak isterseniz aşağıda kendi gerçek demonstrasyonlarınızı toplayabilirsiniz.

:::note

Muhtemelen bizim veri setimizi / modelimizi kullanacağınız için bu bölüm şimdilik biraz daha az ayrıntılıdır.

:::

1.  `teleop-docker` kapsayıcısını **çalıştırın**.

2.  `hf` CLI uygulamasına giriş yapın: `hf auth login`

3.  Hugging Face kullanıcı adınızı ortam değişkeni olarak ayarlayın.

```bash
export HF_USER=your-hf-username
```

4.  Aşağıdaki komutu çalıştırın - `dataset.repo_id` argümanını ayarladığınızdan emin olun.

```bash
lerobot-record \
--robot.type=so101_follower \
--robot.port=$ROBOT_PORT \
--robot.id=$ROBOT_ID \
--robot.cameras='{
"wrist": {
  "type": "opencv",
  "index_or_path": '"$CAMERA_GRIPPER"',
  "width": 640,
  "height": 480,
  "fps": 30
},
"front": {
  "type": "opencv",
  "index_or_path": '"$CAMERA_EXTERNAL"',
  "width": 640,
  "height": 480,
  "fps": 30
}
}' \
--teleop.type=so101_leader \
--teleop.port=$TELEOP_PORT \
--teleop.id=$TELEOP_ID \
--display_data=true \
--dataset.repo_id=${HF_USER}/so101-teleop-vials-to-rack-real \
--dataset.num_episodes=5 \
--dataset.single_task="Pick up the vial and place it in the yellow rack" \
--play_sounds=false
```

5.  Kaydı kontrol etmek için şu tuşları kullanın:

- **Sağ Ok (→):** Mevcut bölümü erken durdurur veya süreyi sıfırlayıp bir sonrakine geçer.

- **Sol Ok (←):** Mevcut bölümü iptal eder ve yeniden kaydeder.

- **Escape (ESC):** Oturumu derhal durdurur, videoları kodlar ve veri setini yükler.

LeRobot Record hakkında daha fazla bilgi edinmek için: [lerobot-record](https://huggingface.co/docs/lerobot/il_robots#record-function)

6.  Bu veri setini Hugging Face Hub'a yükleyin: `hf upload ${HF_USER}/so101-teleop-vials-to-rack-real`

7.  Bu veri setini simülasyon veri setinizle birleştirin.

8.  Birleştirilmiş veri seti üzerinde GR00T'u eğitin.

## Uygulama: Ortak Eğitilmiş Politikayı Robota Konuşlandırma

Şimdi **sim-ve-gerçek ortak eğitilmiş** politikayı fiziksel robota konuşlandıralım—daha önce sim ve gerçek değerlendirmesi için kullandığınız aynı iki terminalli GR00T sunucu + istemci kurulumu.

:::tip

Donanım sorunları veya beklenmeyen politika davranışı için [Sorun Giderme Rehberi'ne](/sim-to-real/referans/sorun-giderme) bakın.

:::

### Hangi Politikayı Çalıştırıyoruz?

**Sim-ve-gerçek ortak eğitilmiş** kontrol noktasını kullanıyoruz: hem simülasyon demonstrasyonları hem de küçük bir gerçek teleoperasyon bölümleri kümesi üzerinde eğitilmiştir. Kesin `MODEL` (kontrol noktası yolu) aşağıdaki komutlarda ayarlanmıştır; farklı bir stratejiyi veya kontrol noktasını değerlendirmek için değiştirebilirsiniz.

### Çalışma Alanı Hazırlığı

Devam etmeden önce [Güvenlik](/sim-to-real/robot-laboratuvari/calisma-alani#işığı-kurma) protokolünü gözden geçirin.

1.  Robot bağlantısını **doğrulayın**: `lerobot-find-port`

2.  Köpük mat üzerine 1-3 şişeyi rastgele **yerleştirin**; rafı belirlenmiş konumuna konumlandırın

3.  Kameraların çalışma alanını net görmesini **sağlayın** ve engelleri temizleyin

4.  Işık kutusunu uygun parlaklığa **getirin** (gerekirse [Çalışma Alanını Oluşturma](/sim-to-real/robot-laboratuvari/calisma-alani#işığı-kurma) bölümüne bakın)

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

2.  Bu kapsayıcının içinde şunu **çalıştırın**. Burada hangi modelin değerlendirileceğini seçeriz (Strateji 2 için ortak eğitilmiş).

```bash
export MODEL=aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left_sim_and_real/checkpoint-10000
```

4.  Politika sunucusunu bu modelle **çalıştırın**.

```bash
python Isaac-GR00T/gr00t/eval/run_gr00t_server.py \
--model-path /workspace/models/$MODEL
```

### Terminal 2 (real-robot kapsayıcısı) — Değerlendirme koşusu

1.  İkinci bir terminal **açın**. Aynı `real-robot` kapsayıcısına bağlanacak ve robot istemcisini çalıştıracaksınız.

2.  Host'ta, son adımda başlattığınız kapsayıcıya **bağlanın**:

```bash
docker exec -it real-robot /bin/bash
```

3.  Kapsayıcının içinde değerlendirme betiğini **çalıştırın**:

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

## Önemli Çıkarımlar

- Ortak eğitim, daha iyi politikalar için simülasyon ve gerçek veriyi birleştirir

- Gerçek donanıma konuşlandırırken güvenlik her şeyden önemlidir

- Gözlemleri sistematik olarak belgeleyin—iyileştirmeye rehberlik ederler

- Sim-to-real boşluğu gerçektir ve çoğu zaman anlamlı düzeydedir

- Farklı politikalar farklı arıza modları (failure mode) sergiler

## Kaynaklar

- [Isaac-GR00T Deposu](https://github.com/NVIDIA/Isaac-GR00T) — SO-101 değerlendirme betikleri dahil GR00T konuşlandırmasının kaynak kodu

- [SO-101 Finetuning Rehberi](https://github.com/NVIDIA/Isaac-GR00T/blob/main/examples/SO100/README.md) — İnce ayar ve değerlendirmenin tam talimatları

- [Sim-and-Real Co-Training: A Simple Recipe for Vision-Based Robotic Manipulation](https://co-training.github.io/) — Ortak eğitim stratejileri üzerine RSS 2025 makalesi

## Sırada Ne Var?

Sim-to-real boşluğunu ele almak için başka bir strateji deneyelim. Bir sonraki oturumda, [Sim-to-Real Strateji 3: Cosmos ile Zenginleştirme](/sim-to-real/veri-zenginlestirme/strateji-3-cosmos) bölümünde Cosmos Transfer 2.5 kullanarak sentetik veri zenginleştirmeyi öğreneceksiniz.
