---
title: 'Sorun Giderme'
sidebar_position: 3
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Sorun Giderme'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [troubleshooting.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/troubleshooting.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

Bu sayfa, kolay erişim için bu öğrenme yolu boyunca dağılmış sorun giderme bilgilerini tek bir yerde toplar.

Bu öğrenme yolu, simülasyonda teleoperasyon, gerçek robot değerlendirmesi ve GR00T çıkarımı için Docker kullanır.

`lerobot-find-port` ve `lerobot-find-cameras opencv` gibi komutlar `teleop-docker` kapsayıcısının içinde çalıştırılır.

GR00T çıkarımı ve gerçek robot değerlendirmesi `real-robot` kapsayıcısının içinde çalıştırılır.

## Donanım Sorunları

### İlk Denenecek Şey

Güç kablosunu çıkarıp tekrar takın. Sonraki komut çalışmazsa bunu 2 kez yapın. Bu çözmezse aşağıdaki adımlara geçin.

### Robot Yanıt Vermiyor

1.  USB bağlantısını **kontrol edin**

2.  Güç LED'inin yandığını **doğrulayın**

3.  Farklı bir USB portu **deneyin**

4.  `teleop-docker` kapsayıcısının içinde portun doğru olduğunu onaylamak için `lerobot-find-port` **çalıştırın**.

### Port Bulunamadı veya /dev/ttyACM\*'de İzin Reddedildi

`lerobot-find-port` port bulamazsa veya robota erişirken izin reddedildi (permission denied) görürseniz:

1.  Terminalleri **kapatın**.

2.  Yeni bir terminal penceresi **açın** (**CTRL+ALT+T**).

3.  Seri portlara okuma/yazma erişimi **verin** (cihaz yollarını atanmış portlarınıza uyacak şekilde güncelleyin):

```bash
sudo chmod 666 /dev/ttyACM0
sudo chmod 666 /dev/ttyACM1
sudo chmod 666 /dev/ttyACM2
sudo chmod 666 /dev/ttyACM3
```

İzinler, cihazlar yeniden bağlandığında sıfırlanır; gerekirse USB'yi çıkarıp takmadan sonra bunları yeniden çalıştırın.

4.  **Kalıcı düzeltme:** Kullanıcınızı `dialout` grubuna (ve kameralar için isteğe bağlı olarak `tty` ve `video`) ekleyin, ardından oturumu kapatıp tekrar açın:

```bash
sudo usermod -a -G dialout "$USER"
sudo usermod -a -G tty "$USER"
sudo usermod -a -G video "$USER"
```

### Güç Bağlı Değil (Tüm Motorlar Eksik)

Tüm motorların eksik göründüğü şu hatayı görürseniz:

```
Missing motor IDs:
- 1 (expected model: 777)
- 2 (expected model: 777)
- 3 (expected model: 777)
- 4 (expected model: 777)
- 5 (expected model: 777)
- 6 (expected model: 777)

Full expected motor list (id: model_number):
{1: 777, 2: 777, 3: 777, 4: 777, 5: 777, 6: 777}

Full found motor list (id: model_number):
{}
```

Bu, robota **gücün bağlı olmadığını** gösterir. USB bağlantısı iletişime izin verir ama motorların ayrı güce ihtiyacı vardır.

**Çözüm:**

1.  12V güç kaynağını robota **bağlayın**

2.  Güç LED'inin yandığını **doğrulayın**

3.  Komutu **yeniden deneyin**

### Tek Motor Bağlantısız

Bir motorun eksik göründüğü bir hata görürseniz:

```
Full expected motor list (id: model_number):
{1: 777, 2: 777, 3: 777, 4: 777, 5: 777, 6: 777}

Full found motor list (id: model_number):
{2: 777, 3: 777, 4: 777, 5: 777, 6: 777}
```

Bu, motor 1'in bağlantısının kesildiğini veya iletişim kurmadığını gösterir. Bu bazen beklenmedik şekilde olur; bu durumda basit bir yeniden güçlendirme çözebilir.

**Çözüm:**

1.  **Güç döngüsü (power cycle)**: Güç kablosunu çıkarıp takın

2.  Bu işe yaramazsa, gevşek bağlantılar için **motor kablolarını inceleyin**

3.  Belirli eksik motora bağlanan kabloyu **kontrol edin**

4.  Motor zinciri zincirleme bağlıdır (daisy-chained)—gevşek bir bağlantı aşağı yöndeki motorları etkileyebilir

### Motor Bağlantı Hatası

Şu hatayı görürseniz:

```
ConnectionError: Failed to write 'Torque_Enable' on id_=2 with '1' after 1 tries. [TxRxResult] There is no status packet!
```

Bu, belirli bir motorla iletişim hatasını gösterir.

**Çözüm:**

1.  **Gücü kontrol edin**: 12V güç kaynağının bağlı ve LED'in yandığından emin olun

2.  **USB'yi kontrol edin**: USB kablosunun her iki uçta da sağlam bağlı olduğunu doğrulayın

3.  **Motorları yeniden başlatın**: Robotu güç döngüsü yapın (gücü çıkarıp yeniden bağlayın)

4.  **Motor kimliğini kontrol edin**: Belirtilen kimliğe sahip motorun bağlantısı gevşek olabilir

### Kalibrasyon Başarısız

1.  Robot portunun gerçek robotun robot.id değeriyle eşleştiğinden **emin olun**

2.  Robotun tam kalibrasyon pozunda olduğundan **emin olun**

3.  Motorların serbestçe hareket edebildiğini **kontrol edin**

4.  Hiçbir eklemin sınırda olmadığını **doğrulayın**

5.  **Yalnızca gerçek durak (end stop)** — Her eklemi mekanik durağa (end stop) getirin; bir kabloya veya engele değil. Parçalar arasında sıkışmış bir kablo (veya robotun bir kabloya çarpması) yanlış bir min/max ve hatalı kalibrasyon oluşturur. Kolun gerçek sınırlarına ulaşabilmesi için kablo yönlendirmesini kontrol edin.

![SO-101 kol segmenti, bir eklem yakınındaki kablo yönlendirmesini gösteriyor](/img/sim-to-real/referans-sorun-giderme/calibration_cable_snag.gif)

6.  Kalibrasyonu 1. adımdan itibaren **yeniden çalıştırın**

## Kamera Sorunları

### Karanlık veya Görüntü Yok

Kamera akışı çok karanlık veya siyahsa:

1.  **Lens kapağını kontrol edin** — Kameradaki lens kapağının çıkarıldığından emin olun. Bu, karanlık veya eksik akışın yaygın bir nedenidir.

2.  Kameranın güçlü ve bağlı olduğunu **doğrulayın**

3.  `teleop-docker` kapsayıcısının içinde kameranın algılandığını onaylamak için `lerobot-find-cameras opencv` **çalıştırın**

### Kamera İndeksi Değişti

Kameralar bilgisayarınızdan çıkarılıp tekrar takıldığında kamera indeksleri değişebilir.

**Çözüm:**

1.  `teleop-docker` kapsayıcısının içinde mevcut indeksleri keşfetmek için `lerobot-find-cameras opencv` **çalıştırın**

2.  Yapılandırmanızı yeni indekslerle **güncelleyin**

3.  Yakalanan test görüntülerini kontrol ederek **doğrulayın**

### Bulanık veya Odak Dışı Görüntü

Kamera akışı bulanıksa veya politika ince görsel ayrıntılarda zorlanıyorsa:

1.  **Odağı kontrol edin** — Kamera lensinin odakta olduğundan emin olun.

2.  Lens kirliyse veya tozluysa **temizleyin**

3.  Kameranın sabit yerinde olduğunu ve titreşmediğini **doğrulayın**

### Yanlış Kamera Akışı

Politika yanlış görsel girdi alıyorsa:

1.  Kamera atamalarının beklentilerle eşleştiğini **kontrol edin**

2.  Kavrayıcı kamera ile dış kameranın doğru tanımlandığını **doğrulayın**

3.  İndeksleri onaylamak için `lerobot-find-cameras opencv` komutunu **yeniden çalıştırın**

## Politika Konuşlandırma Sorunları

### "Bir kez çalıştı ama tutarlı değil"

**Olası neden:** Dağılım kayması (distribution shift)

**Çözüm:**

- Denemeler arasında başlangıç koşullarının değişip değişmediğini kontrol edin

- Kameraların sabit olduğundan ve kaymadığından emin olun

### "Kavrama her zaman aynı miktarda kayık"

**Olası neden:** Kalibrasyon veya kamera konumlandırması

**Çözüm:**

- Robot kalibrasyonunu yeniden çalıştırın

- Kamera konumlandırmasını kontrol edin

- Çalışma alanı kurulumunun eğitimle eşleştiğini doğrulayın

## Veri Seti ve Kayıt Sorunları

### Veri Seti Zaten Var (FileExistsError)

Kayıt veya değerlendirme sırasında şu hatayı görürseniz:

```
FileExistsError: [Errno 17] File exists: '/home/user/.cache/huggingface/lerobot/username/dataset_name'
```

Veya şu şekilde biten bir geri izleme (traceback):

```
AttributeError: 'NoneType' object has no attribute 'push_to_hub'
```

Bu, önceki bir çalıştırmadan kalan bir veri setinin o yolda zaten var olduğunu gösterir.

**Çözüm:**

1.  **İdeal: Farklı bir veri seti adı kullanın** — `--dataset.repo_id` parametresini değiştirin (ör. `_v2`, `_v3` vb. ekleyin)

2.  **Mevcut dizini silin** ve yeniden çalıştırın:

```bash
rm -rf ~/.cache/huggingface/lerobot/<repo_id>
```

:::warning

**`rm -rf` ile son derece dikkatli olun**. Enter'a basmadan önce yolu her zaman iki kez kontrol edin. `rm -rf /` veya `rm -rf ~` gibi bir yazım hatası kritik sistem dosyalarını veya tüm ev dizininizi kalıcı olarak silebilir. Hataları önlemek için tam yolu hata mesajından kopyala-yapıştır yapın.

:::

Yardım Alma

Takılırsanız:

1.  Belirli hata mesajınız için **bu kılavuzu kontrol edin**

2.  Robotu **güç döngüsü** yapın (birçok geçici sorunu düzeltir)

3.  Görsel davranış beklenmedikse **kamera algılamayı yeniden çalıştırın**

4.  Sorun devam ederse yukarıdaki tanı adımlarını **yeniden çalıştırın**
