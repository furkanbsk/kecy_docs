---
title: 'SO-101 Kalibrasyonu'
sidebar_position: 3
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: SO-101 Kalibrasyonu'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [07-calibrating-so101.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/07-calibrating-so101.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

### Bu Modül İçin Neye İhtiyacım Var?

Uygulamalı. Fiziksel SO-101 robota, teleop kola, USB kablolara ve [Çalışma Alanını Kurma](/sim-to-real/robot-laboratuvari/calisma-alani) bölümünde monte edilen çalışma alanına ihtiyacınız olacak.

Bu oturumda SO-101 robotuna güç verecek, kalibrasyon sürecini tamamlayacak ve kalibrasyonun doğru olduğunu doğrulayacaksınız.

Kalibrasyon biraz yorucu olabilse de doğru robot kontrolü ve AI modelimizin iyi performans göstermesi için şarttır.

:::tip

Bu oturumda donanım sorunlarıyla karşılaşırsanız yaygın sorunlara çözümler için [Sorun Giderme Kılavuzu](/sim-to-real/referans/sorun-giderme) bölümüne bakın.

:::

## Öğrenme Hedefleri

Bu oturumun sonunda şunları yapabileceksiniz:

- SO-101 robot koluna **güç verme** ve güvenli şekilde çalıştırma

- Teleop ve robot kolları doğru konumlandırma için **kalibre etme**

## Güvenlik Yönergeleri

Robota güç vermeden önce [Güvenlik](/sim-to-real/robot-laboratuvari/calisma-alani#işığı-kurma) protokolünü inceleyin.

## Çalışma Alanı Kurulumu

[Çalışma Alanını Kurma](/sim-to-real/robot-laboratuvari/calisma-alani) bölümünde fiziksel görev ortamını zaten monte edip hazırlamış olmanız gerekir. Burada güç verme, kalibrasyon ve teleoperasyon sırasında — sonrasında gerçek robot değerlendirmesi yaptığınızda da — bu ışık kutusu düzenini, aydınlatmasını, matını, tüplerini ve rafını tutarlı tutun.

## Robota Güç Verme

### Fiziksel Muayene

Güç vermeden önce:

1.  Robotu görünür herhangi bir hasar için **muayene edin**

2.  Tüm kabloların güvenli şekilde bağlı olduğunu **doğrulayın**

:::warning

Teleop kol, follower'a (12V) göre daha düşük voltajlı bir güç kaynağı (5V) kullanır.

Bunları karıştırmamak **çok önemlidir**.

Kolayca ayırt edebilmeniz için etiketlemenizi veya renk kodlamanızı öneririz.

:::

3.  Güç kablolarını **bağlayın**.

4.  Robotun arkasındaki kontrol kartında **güç LED'inin** yandığını **doğrulayın**.

### Bu Kurs İçin Docker Kapsayıcısını Çalıştırma

USB aygıtları takılıp çıkarıldığında işletim sisteminizin port atamaları değişebilir.

Robota ve teleop kola atanan adresi bulmak için LeRobot port bulucusunu kullanın. Portları bulduktan sonra bunları terminalinizde ortam değişkenlerine atayacağız. Böylece komutları çalıştırırken portları elle yazmak zorunda kalmayız.

1.  Yeni bir terminal penceresi **açın** (**CTRL+ALT+T**).

2.  `teleop-docker` kapsayıcısını **çalıştırın**:

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

### Teleop Kol Portunu Belirleme

3.  Port belirlemeyi başlatmak için şu komutu **çalıştırın**:

```bash
lerobot-find-port
```

4.  Araç, USB kablosunu robottan çıkarıp işlem tamamlanınca **Enter**'a basmanızı isteyecektir. **Teleop kol** ile başlayalım.

```bash
Finding all available ports for the MotorBus.
['/dev/ttyACM0', '/dev/ttyACM1']
Remove the usb cable from your MotorsBus and press Enter when done.
```

5.  Kabloyu çıkardıktan sonra **Enter'a basın**.

```
The port of this MotorsBus is '/dev/ttyACM2'
Reconnect the USB cable.
```

Bu örnekte, `/dev/ttyACM2` ana bilgisayar tarafından atanan porttur.

6.  Bu bilgiyi kullanarak teleop kol için ortam değişkenlerini **ayarlayın** — portun son komutun çıktısıyla eşleştiğinden emin olun.

```bash
setenv TELEOP_PORT=/dev/ttyACM # !! güncellediğinizden emin olun
setenv TELEOP_ID=orange_teleop # bu satırı olduğu gibi kullanın
```

:::note

Ortam değişkenlerini dışa aktarmak için `setenv` adlı özel bir yöntem kullanıyoruz; bu, değişkenleri oturumlar ve kapsayıcılar arasında kalıcı tutmamızı sağlar. Değişkenler `~/sim2real/Sim-to-Real-SO-101-Workshop/docker/env` dosyasına kaydedilecektir.

:::

### Robot Kol Portunu Belirleme

7.  **Robot kol** için aynı işlemi **tekrarlayın** ve portu not edin.

```bash
lerobot-find-port
```

8.  Bu bilgiyi kullanarak robot kol için ortam değişkenlerini **ayarlayın** — portun son komutun çıktısıyla eşleştiğinden emin olun.

```bash
setenv ROBOT_PORT=/dev/ttyACM # !! güncellediğinizden emin olun
setenv ROBOT_ID=orange_robot # bunu olduğu gibi kullanın
```

:::note

ID, kalibrasyon verisinin nerede saklandığını belirler (`~/.cache/huggingface/lerobot/calibration`). Kalibrasyonun kalıcı olması için oturumlar boyunca tutarlı ID kullanın.

:::

9.  (Opsiyonel) değerleri kontrol etmek için şu komutu **çalıştırın** ve değerlerin beklediğiniz gibi olduğunu **doğrulayın**.

```bash
echo "Teleop port is ${TELEOP_PORT} with id ${TELEOP_ID}"
echo "Robot port is ${ROBOT_PORT} with id ${ROBOT_ID}"
```

10. Bu terminali **açık tutun**.

Kapatırsanız docker kapsayıcısını yeniden başlatıp bu ortam değişkenlerini sıfırlayın. Elinizde varsa, bu portları bir deftere yazmanız iyi bir fikirdir.

:::info

Birden fazla USB kabloyu aynı anda yeniden bağlarsanız portlar değişebilir. Bu yaygın görevler [Hızlı Referans](/sim-to-real/referans/hizli-referans) sayfasından kolayca yeniden bulunabilir. Birini söküp Enter'a basarak hangi portun hangi kola karşılık geldiğini belirleyebilirsiniz.

:::

## Kalibrasyon Süreci

Kalibrasyon, leader ve follower kolların aynı fiziksel konumda aynı konum değerlerine sahip olmasını sağlar.

Süreç her iki kol için de aynıdır, yalnızca komut biraz farklıdır.

Endişelenmeyin, SO-101'i kalibre etmek birkaç kez yaptıktan sonra basit bir süreçtir.

### Kalibrasyon Neden Önemli (okumak için genişletin)

İyi kalibrasyon, sim-to-real aktarımı için şarttır. Onsuz politika robotu doğru kontrol edemez.

Kalibrasyon olmadan hasara ya da öngörülemez davranışa yol açabilecek büyük bir hata kaynağı ekliyoruz.

Teleop kolunu kalibre ederek başlayalım.

### Teleop Kolun (Leader) Kalibrasyonu

1.  Leader kol (teleoperasyon yapan robot) için kalibrasyon komutunu **çalıştırın**. Önceki adımda `$TELEOP_PORT`'u atadığınızdan emin olun.

```bash
lerobot-calibrate \
--teleop.type=so101_leader \
--teleop.port=$TELEOP_PORT \
--teleop.id=$TELEOP_ID
```

Kalibrasyon betiğinin çıktısı sizi süreç boyunca yönlendirir:

2.  **Aralığın ortasına hareket ettirin**: Talimat verildiğinde her eklemi, hareket aralığının ortasına manuel olarak götürün. Şuna benzer:

![Teleop Kol Kalibrasyon Pozu Örneği](/img/sim-to-real/07-kalibrasyon/teleop_arm_neutral_pose.jpg)

_Teleop Kol: Kalibrasyon Pozu Örneği._

:::info

**Burada bilek (wrist) eksenine özellikle dikkat edin.** Bu eksen motorun neredeyse tüm dönüş aralığını kullanır; dolayısıyla doğru ortalanmazsa enkoder taşması (overflow) / eksik dökme (underflow) ile karşılaşabilirsiniz. Kavrayıcı sapının nasıl yönlendirildiğine dikkat edin.

Bu konumu bulmanıza yardımcı olmak için kavrayıcıya iki siyah nokta ekledik. Aksi takdirde robotunuzu yalnızca görsele uydurun.

:::

3.  Nötr pozu onayladıktan sonra kalibrasyon sürecini başlatmak için **Enter'a basın**.

4.  Her eklemi tüm hareket aralığı boyunca, durana veya son noktasına çarpana kadar **hareket ettirin**. Bulduğunuzdan emin olmak için tekrarlayabilirsiniz.

![Teleop Kol Kalibrasyon Süreci Animasyonu](/img/sim-to-real/07-kalibrasyon/teleop_calibration.gif)

**Animasyonlu örnek: Teleop Kol Kalibrasyon süreci. Her eklemi ortaya hareket ettirin, onaylayın, sonra kalibrasyonu tamamlamak için son duraklara kadar tek tek tarayın.**

5.  Bittiğinde **Enter'a basın**.

:::tip

Her eklemi tüm aralığı boyunca teker teker hareket ettirmenizi öneririz; böylece hareket aralığının tamamını bulduğunuzdan ve birini atlamadığınızdan emin olursunuz.

Bir ekseni birden fazla kez hareket ettirmekte sakınca yoktur. Betik her eklem için minimum ve maksimum konumları kaydeder.

Hata yaparsanız veya emin değilseniz kalibrasyonu her zaman tekrar çalıştırabilirsiniz.

:::

### Follower Kolun (Robot) Kalibrasyonu

Bu aynı süreçtir, yalnızca komut bayrakları follower kolu yansıtacak şekilde değişir.

1.  Aynı komutu **çalıştırın**, ama argüman değişikliğine dikkat edin:

```bash
lerobot-calibrate \
--robot.type=so101_follower \
--robot.port=$ROBOT_PORT \
--robot.id=$ROBOT_ID
```

2.  Robotu kalibrasyon pozuna **götürün**. Pozun görüntüsü aşağıdadır. Her eklem hareket aralığının ortasındadır.

![](/img/sim-to-real/07-kalibrasyon/calibration_pose.jpg)

_Kalibrasyon Pozu Örneği._

![](/img/sim-to-real/07-kalibrasyon/wrist_center.jpg)

_Burada bilek eksenine özellikle dikkat edin. Ortalanmış pozisyon şuna benzer. Bu eksen motorun neredeyse tüm dönüş aralığını kullanır; dolayısıyla doğru ortalanmazsa enkoder taşması / eksik dökme ile karşılaşabilirsiniz._

3.  Kalibrasyonu başlatmak için **Enter'a basın**.

4.  Robotu tüm hareket aralığı boyunca, durana veya son noktasına çarpana kadar **hareket ettirin**. Bulduğunuzdan emin olmak için tekrarlayabilirsiniz.

:::tip

**Yalnızca gerçek son duraklar.** Her eklemi bir kabloya veya engele değil, **mekanik** son durağına kadar hareket ettirin. Bir kablo bağlantılar arasında sıkışırsa ya da robot bir kabloya çarparsa yanlış bir min/maks sınır kaydeder ve kalibrasyon yanlış olur. Kolun gerçek sınırlarına ulaşabilmesi için kablo güzergahını kontrol edin.

:::

5.  Bittiğinde **Enter'a basın**.

![SO-101 Tam Kalibrasyon Sırası](/img/sim-to-real/07-kalibrasyon/full_so101_calibration.gif)

_Tam kalibrasyon iş akışı örneği: SO-101'de tüm eklemleri aralıkları boyunca hareket ettirme._

Kalibrasyon dosyası daha sonra `~/.cache/huggingface/lerobot/calibration` dizinine, klasör adı olarak `type` ve dosya adı olarak `id` parametresi kullanılarak kaydedilir.

:::warning

**Kalibrasyon Dosyası Uyarısı**

Kalibrasyondan sonra robotu çalıştırırken, kalibrasyon dosyası robotunuz için doğru değilse şu mesajı görebilirsiniz:

```
Press ENTER to use provided calibration file associated with the id leader_arm_1, or type 'c' and press ENTER to run calibration
```

**Bu mesajı gördüğünüzde dikkatli olun.** Şunlara işaret edebilir:

- Kalibrasyon dosyası robotunuz için doğru değil

- Robot ve teleop kol karışmış (yanlış ID ataması)

- Geçerli donanım durumuyla eşleşmeyen önceki bir kalibrasyon

Emin değilseniz komutu iptal etmek için CTRL+C'ye basın ve robot atamalarını iki kez kontrol edin. Doğruysa kalibrasyonu tekrar çalıştırabilirsiniz.

:::

### Çalışmanızı Kontrol Etme

Kalibrasyonunuzun doğru olduğunu nasıl anlarsınız?

Kalibrasyonunuzu, topladığımız küçük bir kalibrasyon veri setiyle karşılaştıran küçük bir betik var.

1.  Şu komutu **çalıştırın**:

```bash
python docker/real/scripts/so101_check_calibration.py
```

Örnek çıktı:

```
============================================================================
SO101 CALIBRATION CHECK REPORT
File:  /root/.cache/huggingface/lerobot/calibration/robots/so101_follower/orange_robot.json
Stats: /workspace/Sim-to-Real-SO-101-Workshop/real_robot/calibration_stats.json
============================================================================

[1] Motion Range vs Stats (threshold ±2.0σ)

Joint               Range     Mean    Std  Deviation    Offset  Status
--------------------------------------------------------------------------
shoulder_pan         2718     2725     32     -0.23σ      -174  ✓ PASS
shoulder_lift        2353     2350     77     +0.04σ       710  ✓ PASS
elbow_flex           2230     2222      9     +0.90σ     -1659  ✓ PASS
wrist_flex           2331     2329     17     +0.11σ      -330  ✓ PASS
wrist_roll           3857     4026    114     -1.48σ      -555  ✓ PASS
gripper              1483     1475     33     +0.23σ      -845  ✓ PASS

[2] Live Encoder Positions

Joint               Position    Calibrated Range     In Range
--------------------------------------------------------------------------
shoulder_pan            2174       857 - 3575       ✓ OK
shoulder_lift            888       872 - 3225       ✓ OK
elbow_flex              3059       861 - 3091       ✓ OK
wrist_flex              1871       838 - 3169       ✓ OK
wrist_roll               100       77 - 3934        ✓ OK
gripper                 1763      1727 - 3210       ✓ OK

============================================================================
Overall: ✓ PASS — calibration looks good.
============================================================================
```

2.  Çıktıda `Overall: ✓ PASS — calibration looks good.` ifadesini gördüğünüzden **emin olun**. Değilse yeniden kalibrasyon deneyin.

:::tip

Yardıma ihtiyacınız olursa yaygın sorunlar ve tanı adımları için [Sorun Giderme Kılavuzu](/sim-to-real/referans/sorun-giderme) bölümüne bakın.

:::

## Önemli Çıkarımlar

- Sim-to-real uyumu için düzgün kalibrasyon şarttır

- LeRobot, robot kontrolü için birleşik komutlar sunar

- Veri toplama veya konuşlandırmadan önce donanımı her zaman doğrulayın

## Sırada Ne Var?

Her iki kol da kalibre edildikten sonra, robotu teleoperasyonla çalıştırmak ve kameraları yapılandırmak için [SO-101'i Çalıştırma](/sim-to-real/robot-laboratuvari/calistirma) bölümüne devam edin.
