---
title: "SO-101'i Çalıştırma"
sidebar_position: 4
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: SO-101''i Çalıştırma'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [08-operating-so101.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/08-operating-so101.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

### Bu Modül İçin Neye İhtiyacım Var?

Uygulamalı. Kalibre edilmiş SO-101 robotuna, teleop kola, her iki kameraya ve [SO-101 Kalibrasyonu](/sim-to-real/robot-laboratuvari/kalibrasyon) bölümünden çalışır durumdaki Docker kapsayıcısına ihtiyacınız olacak.

Bu oturumda leader kolu kullanarak SO-101'i teleoperasyonla çalıştıracak, kameraları yapılandıracak ve Rerun'da canlı kamera görünümleriyle teleoperasyon yapacaksınız.

Bu size hem genel olarak robotu çalıştırmada hem de bu özel görevde uygulamalı pratik sağlayacaktır.

Önce [SO-101 Kalibrasyonu](/sim-to-real/robot-laboratuvari/kalibrasyon) bölümünü tamamladığınızdan emin olun. Kalibre edilmiş bir robota ve ortam değişkenleri ayarlanmış çalışır durumdaki Docker kapsayıcısına ihtiyacınız olacak.

:::tip

Bu oturumda donanım sorunlarıyla karşılaşırsanız yaygın sorunlara çözümler için [Sorun Giderme Kılavuzu](/sim-to-real/referans/sorun-giderme) bölümüne bakın.

:::

## Öğrenme Hedefleri

Bu oturumun sonunda şunları yapabileceksiniz:

- Teleoperasyon kolunu kullanarak robotu **teleoperasyonla çalıştırma**

- AI modellerimizin kullanacağı aynı kamera görünümlerini ve hata ayıklama için Rerun'u kullanarak teleoperasyon yapabilmek için kameraları **yapılandırma**

## Teleoperasyon

Her iki kol da kalibre edildiğine göre teleoperasyona başlamaya hazırız!

1.  Teleoperasyon sürecini **başlatın**. Her iki kolun da benzer pozlarda olduğundan emin olmak iyi bir fikirdir; çünkü robot teleop kolla eşleşecek şekilde hareket edecektir.

```bash
lerobot-teleoperate \
--robot.type=so101_follower \
--robot.port=$ROBOT_PORT \
--robot.id=$ROBOT_ID \
--teleop.type=so101_leader \
--teleop.port=$TELEOP_PORT \
--teleop.id=$TELEOP_ID
```

2.  Teleop kolu **hareket ettirin** ve robot kolun eşleşmek için nasıl hareket ettiğini izleyin.

3.  Bir tüpü alıp rafa yerleştirmeyi **deneyin**!

4.  Teleoperasyonu durdurmak için terminalde **Ctrl+C'ye basın**.

## Kamera Kurulumu

Az önce yaptığınız teleoperasyon inanılmaz bir görme sistemi kullandı: insan algılama sisteminiz.

AI modelimizin bu bilgisi olmayacak, bu yüzden gösterim toplarken kameraları kullanmamız gerekiyor.

Her robot çalışma alanı bugün **iki kamera** ile donatılmıştır:

- **Kavrayıcı kamerası**: Robotun bileğine/kavrayıcısına monte edilmiştir

- **Harici kamera**: Çalışma alanını yukarıdan veya yandan gören sabit kamera

Politika bu görsel imgelerle çalıştığı için kamera ataması politika performansı açısından kritiktir. Değiştirilirlerse (kavrayıcı kamerası kendini harici kamera zannederse ya da tam tersi), politika başarısız olur.

### Neden İki Kamera?

Kavrayıcı kamerası, robot tüp gibi bir nesneyi kavradıktan sonra kapanır.

Harici kamera, manipülasyon sırasının tamamı boyunca çalışma alanını kesintisiz görünür tutar; böylece kavrayıcı kamerası engellense bile politikanın her zaman kullanılabilir görsel girdisi olur.

### Kullanılabilir Kameraları Bulma

Port bulucusuna benzer şekilde LeRobot'un da kullanılabilir kameraları belirlemek için bir aracı vardır.

Hem robot üzerindeki kameranın hem de harici sabit kameranın ID'sini belirlememiz gerekiyor.

1.  İki kameranın USB kablolarının bilgisayarınıza takılı olduğundan **emin olun**.

2.  Şu komutu **çalıştırın**:

```bash
lerobot-find-cameras opencv
```

Bu komut, her kullanılabilir kameradan bir görüntü yakalar ve her kameranın indeksini belirlemenize olanak tanır.

Örnek çıktı:

```
Searching for cameras...
Found 3 cameras:
Camera 0: /dev/video0 (USB 2.0 Camera)
Camera 1: /dev/video2 (USB 2.0 Camera)
Camera 2: /dev/video4 (Integrated Webcam)

Capturing test frames...
Camera 0: 640x480 @ 30fps - saved to ./camera_test/cam_0.jpg
Camera 1: 640x480 @ 30fps - saved to ./camera_test/cam_1.jpg
Camera 2: 1280x720 @ 30fps - saved to ./camera_test/cam_2.jpg
```

3.  Docker kapsayıcısının dışında yeni bir terminal **açın**.

4.  Görev deposuna **gidin**:

```bash
cd ~/Sim-to-Real-SO-101-Workshop
```

5.  Görüntülerin bulunduğu klasörü açmak için şu komutu **çalıştırın**:

```
open ./outputs/captured_images
```

6.  Her görüntüyü **açın** ve hangi indeksin bilek ve sabit kameraya karşılık geldiğini **not edin**. Örneğin `opencv__dev_video0.png` `0` indeksini gösterir.

7.  `teleop-docker` kapsayıcısı içindeki terminale **geri dönün**.

8.  Bunları terminalinizdeki ortam değişkenlerine **atayın** — değerleri son komutta gördüklerinizle eşleşecek şekilde güncellediğinizden emin olun.

```bash
setenv CAMERA_GRIPPER=4 # kendi değerlerinize güncellediğinizden emin olun
setenv CAMERA_EXTERNAL=6 # kendi değerlerinize güncellediğinizden emin olun
```

:::info

**Kamera İndeks Uyarısı**

Kameralar bilgisayarınızdan çıkarılıp yeniden takıldığında kamera indeksleri değişebilir. Veri toplamadan veya politika çalıştırmadan önce her zaman kamera atamalarını doğrulayın.

Teleoperasyon veya politika yürütme sırasında beklenmedik davranış görürseniz kamera indeksinin yeniden atanması yaygın bir nedendir.

:::

:::tip

Kamera veya donanım sorunları mı yaşıyorsunuz? Yaygın çözümler ve ayrıntılı tanı adımları için kenar çubuğunda da bulunan [Sorun Giderme Kılavuzu](/sim-to-real/referans/sorun-giderme) bölümüne bakın.

Yaygın komutlar için [Hızlı Referans](/sim-to-real/referans/hizli-referans) bölümüne bakın.

:::

:::note

Bu görevi zorlaştıran şeylere dikkat edin:

- Kavrayıcı kamerası kavramadan sonra kapanır

- Raf, hassas yerleşim gerektirir

- Derinlik verisi eksikliği raf hizalamasını zorlaştırır

:::

## Kameralarla Teleoperasyon Çalıştırma

Kamera indekslerini aldığımıza göre çalışma alanınızdaki gerçek kameralarla teleoperasyon çalıştırabiliriz.

1.  Şu komutu **çalıştırın**:

```bash
lerobot-teleoperate \
--robot.type=so101_follower \
--robot.port=$ROBOT_PORT \
--robot.id=$ROBOT_ID \
--teleop.type=so101_leader \
--teleop.port=$TELEOP_PORT \
--teleop.id=$TELEOP_ID \
--display_data=true \
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
}'
```

![Rerun Görüntüleyici Teleop Örneği](/img/sim-to-real/08-calistirma/rerun_viewer_teleop_hq.gif)

_Rerun Görüntüleyici Teleop Örneği._

Bu, teleoperasyon arayüzünü başlatır. Bilekte ve önde birer olmak üzere iki kamera görmelisiniz.

Bu, hem teleoperasyon hem de hata ayıklama için değerli bir araçtır.

2.  Şimdi açılan **Rerun** görüntüleyicisini kullanarak, gözlerinizi değil, **yalnızca kamera görünümlerini kullanarak** tüpleri alıp rafa yerleştirmeyi **deneyin**. Partneriniz ve sizin görevi birkaç kez yapabildiğinizi görün.

Burada biraz vakit geçireceğiz — birkaç alma denemesi yapın. Pürüzsüz, doğrudan hareketlere vurgu yapın.

3.  Teleoperasyonu durdurmak için **Ctrl+C'ye basın**.

4.  Hâlâ açıksa Rerun görüntüleyicisini **kapatın**.

## Önemli Çıkarımlar

- Kamera ataması politika performansını doğrudan etkiler

- Bu görevin ne kadar çetrefilli olduğu — kavrayıcı kamerası kavramadan sonra kapanır, harici kamera sürekli görünürlük sağlar

- Rerun görüntüleyicisi, kamera görünümlerini ve robot durumunu doğrulamak için değerli bir hata ayıklama aracıdır

## Kaynaklar

- [SO-101 Getting Started Guide](https://huggingface.co/docs/lerobot/en/so101) — Tam montaj, motor kurulum ve kalibrasyon talimatları

- [Rerun](https://rerun.io/) — Kamera görünümlerini ve robot eylemlerini görselleştirmek için bir araç

## Sırada Ne Var?

Robotunuz hazır olduğuna göre, ilk sim-to-real stratejinizi uygulayın. Sonraki oturum [Sim-to-Real Strateji 1: Teleoperasyonla Domain Randomization](/sim-to-real/veri-egitim-degerlendirme/strateji-1-domain-randomization) bölümünde, domain randomization ile simülasyonda gösterim toplayacaksınız.
