---
title: 'Simülasyonda Değerlendirme'
sidebar_position: 3
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Simülasyonda Değerlendirme'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [11-sim-evaluation.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/11-sim-evaluation.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

### Bu Modül İçin Neye İhtiyacım Var?

Uygulamalı. Isaac Lab simülasyonu için `teleop-docker` ve `real-robot` kapsayıcılarına ve bir NVIDIA GPU'ya ihtiyacınız olacak.

Bu oturumda, daha sonra gerçek robotta kullanacağınız aynı GR00T tabanlı kurulumu kullanarak simülasyonda politika değerlendirmesi çalıştıracaksınız.

## Öğrenme Hedefleri

Bu oturumun sonunda şunları yapabileceksiniz:

- GR00T sunucu + istemci (Docker) kurulumunu kullanarak simülasyonda politika değerlendirmesi **çalıştırma**

- Farklı veri miktarları ve zenginleştirmelerle eğitilmiş politikaların nasıl davrandığını **karşılaştırma**

- Simülasyonda yaygın hata modlarını **belirleme**

## Hangi Politikayı Değerlendireceğiz?

Sizin için eğittiğimiz politikaları kullanma veya kendinizinkini eğitme seçeneğiniz olacak. Bizimkileri kullanırsanız çalışma alanının doğru kurulduğundan ve robotun dikkatlice kalibre edildiğinden emin olun.

:::tip

GR00T'u LeRobot ile kullanmak için kurulum ve entegrasyon kılavuzları için resmi [LeRobot GR00T dokümantasyonunu](https://huggingface.co/docs/lerobot/en/groot) izleyin. GR00T N1.5 modelleri yerel olarak desteklenir ve doğrudan LeRobot çerçevesi içinde değerlendirilebilir. GR00T N1.6 için LeRobot'a entegrasyon hâlâ sürmektedir. Bu sırada eğitim ve çıkarımı, en yeni model özellikleri için resmi [Isaac GR00T deposunu](https://github.com/NVIDIA/Isaac-GR00T) veya sağlanan Docker imajlarını kullanarak çalıştırmanız gerekir.

:::

Şu [75 simülasyon gösteriminden oluşan veri setini](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left) kullandık. Hugging Face'te [dataset visualizer](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left) ile görüntüleyin. Bu _yalnızca simülasyon_ veri setidir; yani herhangi bir gerçek dünya verisi olmadan tamamen simülasyonda eğitilmiştir. İlk stratejimiz yalnızca simülasyona ve domain randomization'a (alan rastgeleleştirme) dayanmaktır.

![SO-101 sim teleop tüpleri-sola-raf veri setinin görselleştirilmesi](/img/sim-to-real/11-sim-degerlendirme/lerobot_dataset_visualize_teleop_vials_rack_left.png)

**Değerlendirme politikalarını eğitmek için kullanılan yalnızca simülasyon gösterim veri setinden görselleştirilmiş örnek bölümler.**

## Simülasyonda Politika Değerlendirmesi Çalıştırma

Bu kurs boyunca değerlendirme çalıştırdığımızda iki terminal söz konusu olacaktır:

1.  Host terminali; burada GR00T kapsayıcısını ve politika sunucusunu başlatırız

2.  İstemci (client) terminali; burada değerlendirme koşusunu çalıştırır ve robotu fiilen kontrol ederiz

Simülasyonda istemcimiz simülatörümüzdür. Gerçek robotta ise istemcimiz robotun kendisidir.

### Terminal 1 (real-robot kapsayıcısı) — GR00T politika sunucusunu başlatma

1.  Yeni bir terminal penceresi **açın** (**CTRL+ALT+T**).

2.  Docker `real-robot` kapsayıcısını **çalıştırın**.

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

3.  Bu kapsayıcının içinde, hangi modelin değerlendirileceğini ayarlamak için şunu **çalıştırın**.

```bash
export MODEL=aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left/checkpoint-10000
```

4.  Politika sunucusunu bu modelle **çalıştırın**.

```bash
python Isaac-GR00T/gr00t/eval/run_gr00t_server.py \
--model-path /workspace/models/$MODEL
```

5.  `Server is ready and listening on tcp://0.0.0.0:5555` mesajını gördüğünüzde politika sunucusu bağlantıları kabul etmeye hazırdır.

### Terminal 2 (teleop-docker kapsayıcısı) — Değerlendirme koşusu

1.  Önceki modülden `teleop-docker` kapsayıcısının terminali hâlâ açıksa bu adımı atlayabilirsiniz. Değilse açılır menüyü **genişletin** ve komutu **çalıştırın**.

### Simülasyonda teleop ve değerlendirme için kullanılan Isaac Sim kapsayıcısını başlatın:

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

2.  Bu komut, daha az aydınlatma değişimli bir ortamla başlayarak robotu simülasyonda hareket ettirmeye başlar.

```bash
lerobot_eval \
--task Lerobot-So101-Teleop-Vials-To-Rack-Eval \
--rename_map '{"external_D455": "front", "ego": "wrist"}' \
--action_horizon 16 \
--lang_instruction "Pick up the vial and place it in the yellow rack" \
--rerun
```

Bu, hem Isaac Sim'i hem de Rerun'u başlatır.

:::note

`--rerun` bayrağı opsiyoneldir.

Hata ayıklama için döngüye Rerun'u ekler; böylece politika çalışırken eklem eylemlerini ve kamera akışlarını görebilirsiniz. Bu, kamera görünümlerinin makul ve atamaların doğru olduğunu onaylamanıza olanak tanır.

:::

3.  (Alternatif olarak) Değerlendirmeyi **headless** (başsız) modda çalıştırabilirsiniz; yani Isaac Sim UI veya Rerun görselleştirmesi yoktur:

```bash
lerobot_eval \
--task Lerobot-So101-Teleop-Vials-To-Rack-Eval \
--rename_map '{"external_D455": "front", "ego": "wrist"}' \
--action_horizon 16 \
--lang_instruction "Pick up the vial and place it in the yellow rack" \
--headless
```

### Değerlendirmeyi İzleme

Modelin performansının değerlendirilmesi için terminali izleyin. Sahne ya bir zaman aşımı sonrası ya da tüp rafın yuvalarına girmeye başladığında sıfırlanır.

Tüplerin ne kadar yuvarlandığına ve aydınlatmanın ne kadar karanlık olduğuna bağlı olarak, değerlendirme başarı oranının **%50-70 arasında** olmasını bekleyin.

Bu veri setinin oldukça düşük sayıda gösterim (75 al-bırak gösterimi) içerdiğini unutmayın; dolayısıyla politika nihai olarak ihtiyacımız olacak kadar genelleme yapamayabilir.

![Değerlendirme koşusunun görselleştirilmesi](/img/sim-to-real/11-sim-degerlendirme/sim-eval-rollout.gif)

Örnek çıktı:

```bash
Rollout (ep 7, success: 66.7%):  33%|█████████████████████▉                                             | 131/400 [00:06<00:15][GRASP] Vial grasped in env(s): [0]
Rollout (ep 7, success: 66.7%):  70%|██████████████████████████████████████████████▉                    | 280/400 [00:14<00:06][RACK] vial_1 placed in rack in env(s): [0]
Rollout (ep 7, success: 66.7%):  70%|███████████████████████████████████████████████▏                   | 282/400 [00:14<00:06]
Rollout (ep 8, success: 71.4%):  34%|
```

### Daha Fazla Aydınlatma Değişimine Karşı Test Etme

Daha fazla aydınlatma rastgeleleştirmesiyle önceden yapılandırılmış başka bir ortam hazırladık. Bu, yalnızca birazcık kod değişikliğiyle simülasyonu bir politikayı farklı koşullara karşı stres testine tabi tutmak için nasıl kullanabileceğinizin bir örneğidir.

Bu değerlendirme ortamını aşağıdaki komutu çalıştırarak kullanabilirsiniz:

```bash
lerobot_eval \
--task Lerobot-So101-Teleop-Vials-To-Rack-DR-Eval \
--rename_map '{"external_D455": "front", "ego": "wrist"}' \
--action_horizon 16 \
--lang_instruction "Pick up the vial and place it in the yellow rack"
```

### Temizlik

Model değerlendirmelerini denemeyi bitirdiğinizde:

1.  teleop-docker kapsayıcısında Isaac Lab'i durdurmak için **CTRL+C'ye basın**.

2.  Aynı terminalde `teleop-docker` kapsayıcısından çıkmak için `exit` **yazın** ve **Enter'a basın**.

3.  real-robot kapsayıcısında politika sunucusunu durdurmak için **CTRL+C'ye basın**. Bu terminali açık bırakabilirsiniz.

:::tip

Hangi kapsayıcıların çalıştığını görmek isterseniz tüm kapsayıcıları listelemek için `docker ps` çalıştırabilirsiniz.

:::

## Yaygın Hata Modları

Değerlendirme koşularını gözlemlerken hata modlarına dikkat edin. Bu politikanın yalnızca sınırlı miktarda veriyle — yalnızca 75 gösterim (deneyimli bir operatör için ~1 saatlik teleoperasyon süresi) — eğitildiğini unutmayın.

## Önemli Çıkarımlar

- Az sayıda gösterimle eğitilen politikalar **genelleme** yapamaz

- Güçlü politikalar için domain randomization şarttır

- Daha çeşitli eğitim verisi, daha fazla aynı eğitim verisinden üstündür

- Bu yalnızca simülasyon politikaları, gerçek robotta çalıştırırken karşılaştırma için bir temel çizgi (baseline) sağlar

## Sırada Ne Var?

Fiziksel kurulumunuzun hâlâ [Çalışma Alanını Kurma](/sim-to-real/robot-laboratuvari/calisma-alani) bölümüyle eşleştiğini doğrulayın, ardından aynı politikayı fiziksel SO-101 üzerinde çalıştırmak ve sim-to-real boşluğunu gözlemlemek için [Gerçek Değerlendirme](/sim-to-real/veri-egitim-degerlendirme/gercek-degerlendirme) bölümüyle devam edin.
