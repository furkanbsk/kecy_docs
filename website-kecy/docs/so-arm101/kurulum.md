---
title: 'SO-ARM101 Kurulumu'
sidebar_position: 1
description: 'Hugging Face LeRobot SO-101 dokümantasyonundan Türkçeleştirilmiş SO-ARM101 montaj, motor yapılandırma ve kalibrasyon rehberi.'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa Hugging Face'in resmi **"LeRobot SO-101"** dokümantasyonundaki [huggingface.co/docs/lerobot/so101](https://huggingface.co/docs/lerobot/so101) sayfasından uyarlanmıştır.

Orijinal içerik Hugging Face'e aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

Aşağıdaki adımlarda, amiral gemisi robotumuz olan SO-101'in nasıl monte edileceğini açıklıyoruz.

## Parçaları Tedarik Etme

Bu [README](https://github.com/TheRobotStudio/SO-ARM100) dosyasını takip edin. İçinde malzeme listesi (bill of materials), parçaların nereden tedarik edileceği bağlantısı ve 3D baskı talimatları bulunmaktadır. Ayrıca 3D baskıyı ilk kez yapıyorsanız veya kendi 3D yazıcınız yoksa öneriler de yer alır.

## LeRobot'u Kurma 🤗

LeRobot'u kurmak için [Kurulum Rehberi'ni](https://huggingface.co/docs/lerobot/installation) takip edin.

Bu talimatlara ek olarak, Feetech SDK'yı da kurmanız gerekir:

```bash
pip install -e ".[feetech]"
```

## Adım Adım Montaj Talimatları

Follower (takip eden) kol, 1/345 dişli oranına sahip 6 adet STS3215 motor kullanır. Leader (lider) kol ise kendi ağırlığını taşıyabilmesini ve çok fazla kuvvet gerektirmeden hareket ettirilebilmesini sağlamak için üç farklı dişli oranına sahip motor kullanır. Hangi eklemde hangi motorun gerektiği aşağıdaki tabloda gösterilmiştir.

| Leader Kol Ekseni (Leader-Arm Axis)    | Motor | Dişli Oranı |
| -------------------------------------- | :---: | :---------: |
| Taban / Omuz Pan (Base / Shoulder Pan) |   1   |   1 / 191   |
| Omuz Kaldırma (Shoulder Lift)          |   2   |   1 / 345   |
| Dirsek Eğme (Elbow Flex)               |   3   |   1 / 191   |
| Bilek Eğme (Wrist Flex)                |   4   |   1 / 147   |
| Bilek Döndürme (Wrist Roll)            |   5   |   1 / 147   |
| Kavrayıcı (Gripper)                    |   6   |   1 / 147   |

## Motorları Yapılandırma

### 1. Her Kolla İlişkili USB Portlarını Bulma

Her bus servo adaptörünün portunu bulmak için MotorBus'ı bilgisayarınıza USB ve güç üzerinden bağlayın. Aşağıdaki betiği çalıştırın ve istendiğinde MotorBus'ın bağlantısını kesin:

```bash
lerobot-find-port
```

Örnek çıktı:

```
Finding all available ports for the MotorBus.
['/dev/tty.usbmodem575E0032081', '/dev/tty.usbmodem575E0031751']
Remove the USB cable from your MotorsBus and press Enter when done.

[...Karşılık gelen leader veya follower kolun bağlantısını kesin ve Enter'a basın...]

The port of this MotorsBus is /dev/tty.usbmodem575E0032081
Reconnect the USB cable.
```

Burada bulunan port `/dev/tty.usbmodem575E0032081`, leader veya follower kolunuza karşılık gelir.

Linux'ta USB portlarına erişim vermek için şunu çalıştırmanız gerekebilir:

```bash
sudo chmod 666 /dev/ttyACM0
sudo chmod 666 /dev/ttyACM1
```

Örnek çıktı:

```
Finding all available ports for the MotorBus.
['/dev/ttyACM0', '/dev/ttyACM1']
Remove the usb cable from your MotorsBus and press Enter when done.

[...Karşılık gelen leader veya follower kolun bağlantısını kesin ve Enter'a basın...]

The port of this MotorsBus is /dev/ttyACM1
Reconnect the USB cable.
```

Burada bulunan port `/dev/ttyACM1`, leader veya follower kolunuza karşılık gelir.

### 2. Motor Kimliklerini (ID) ve Baudrate Değerlerini Ayarlama

Her motor, bus üzerinde benzersiz bir kimlikle (id) tanımlanır. Yepyeni motorlar genellikle varsayılan olarak `1` kimliğiyle gelir. Motorlar ile kontrolör arasındaki iletişimin düzgün çalışması için önce her motora farklı ve benzersiz bir id atamamız gerekir. Ayrıca bus üzerindeki veri iletim hızı baudrate ile belirlenir. Kontrolör ile tüm motorların birbiriyle konuşabilmesi için aynı baudrate ile yapılandırılmış olması gerekir.

Bu amaçla, önce her motora kontrolör ile tek tek bağlanarak bu değerleri ayarlamamız gerekir. Bu parametreleri motorların iç belleğinin (EEPROM) kalıcı bölümüne yazacağımız için bunu yalnızca bir kez yapmamız yeterlidir.

Motorları başka bir robottan yeniden kullanıyorsanız id ve baudrate değerleri büyük olasılıkla eşleşmeyeceği için muhtemelen bu adımı da gerçekleştirmeniz gerekecektir.

Aşağıdaki video, motor id'lerinin ayarlanmasına ilişkin adım sırasını göstermektedir.

##### Motorları kurma videosu

<video controls width="600">
  <source src="https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/lerobot/setup_motors_so101_2.mp4" type="video/mp4" />
</video>

#### Follower (Takip Eden Kol)

Bilgisayarınızdan gelen USB kablosunu ve güç kaynağını follower kolunun kontrolör kartına bağlayın. Ardından önceki adımda elde ettiğiniz port bilgisini kullanarak aşağıdaki komutu veya API örneğini çalıştırın. Ayrıca `id` parametresiyle leader kolunuza bir isim de vermeniz gerekecektir.

```bash
lerobot-setup-motors \
    --robot.type=so101_follower \
    --robot.port=/dev/tty.usbmodem585A0076841  # <- Kendi portunuzla değiştirin
```

#### Sorun Giderme

Bu noktada bir hata alırsanız, kablolarınızı kontrol edin ve doğru şekilde takılı olduklarından emin olun:

- Güç kaynağı
- Bilgisayarınız ile kontrolör kartı arasındaki USB kablosu
- Kontrolör kartından motora giden 3-pinli kablo

Bir Waveshare kontrolör kartı kullanıyorsanız, iki jumper'ın da `B` kanalında (USB) ayarlandığından emin olun.

Ardından şu mesajı görmelisiniz:

```bash
'gripper' motor id set to 6
```

Bunu bir sonraki talimat izler:

```bash
Connect the controller board to the 'wrist_roll' motor only and press enter.
```

3-pinli kabloyu kontrolör kartından çıkarabilirsiniz; ancak diğer ucunu gripper (kavrayıcı) motorunda bırakabilirsiniz çünkü zaten doğru yerinde olacaktır. Şimdi bilek döndürme (wrist roll) motoruna yeni bir 3-pinli kablo takın ve bunu kontrolör kartına bağlayın. Önceki motorda olduğu gibi, yalnızca bu motorun karta bağlı olduğundan ve motorun başka hiçbir motora bağlı olmadığından emin olun.

Her motor için işlemi talimatlara göre tekrarlayın.

:::tip

Her adımda Enter'a basmadan önce kablolarınızı kontrol edin. Örneğin kartı hareket ettirirken güç kaynağı kablosu çıkabilir.

:::

İşlem bittiğinde betik sona erecektir; artık motorlar kullanıma hazırdır. Şimdi 3-pinli kabloyu her motordan bir sonrakine takabilir ve ilk motordan (id=1 olan 'shoulder pan') gelen kabloyu kontrolör kartına bağlayabilirsiniz. Kart artık kolun tabanına takılabilir.

#### Leader (Lider Kol)

Leader kolu için de aynı adımları uygulayın.

```bash
lerobot-setup-motors \
    --teleop.type=so101_leader \
    --teleop.port=/dev/tty.usbmodem575E0031751  # <- Kendi portunuzla değiştirin
```

## Adım Adım Montaj

Bu bölüm, SO-101'in eklem eklem nasıl birleştirileceğini anlatır. Ayrıntılı video ve görseller için [orijinal Hugging Face sayfasına](https://huggingface.co/docs/lerobot/so101) başvurun.

### Eklem 1 (Joint 1)

- Her iki motor boynuzunu (motor horn) takın. Üstteki boynuzu M3x6mm vida ile sabitleyin. Alttaki boynuz için vida gerekmez.
- İlk motoru yukarıdan kaydırarak yerleştirin.
- İlk motoru 4 adet M2x6mm vida ile sabitleyin.
- Tabanı omuz motoruna 4 adet M3x6mm vida ile her iki taraftan tutturun.

<video controls width="600">
  <source src="https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/lerobot/Joint1_v2.mp4" type="video/mp4" />
</video>

### Eklem 2 (Joint 2)

- Her iki motor boynuzunu takın. Üstteki boynuzu M3x6mm vida ile sabitleyin. Alttaki boynuz için vida gerekmez.
- İkinci motoru yukarıdan kaydırarak yerleştirin.
- İkinci motoru 4 adet M2x6mm vida ile sabitleyin.
- Üst kolu her iki taraftan 4 adet M3x6mm vida ile tutturun.

<video controls width="600">
  <source src="https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/lerobot/Joint2_v2.mp4" type="video/mp4" />
</video>

### Eklem 3 (Joint 3)

- Her iki motor boynuzunu takın. Üstteki boynuzu M3x6mm vida ile sabitleyin. Alttaki boynuz için vida gerekmez.
- Motor 3'ü yerleştirin ve 4 adet M2x6mm vida ile sabitleyin.
- Ön kolu (forearm) motor 3'e her iki taraftan 4 adet M3x6mm vida ile bağlayın.

<video controls width="600">
  <source src="https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/lerobot/Joint3_v2.mp4" type="video/mp4" />
</video>

### Eklem 4 (Joint 4)

- Her iki motor boynuzunu takın. Üstteki boynuzu M3x6mm vida ile sabitleyin. Alttaki boynuz için vida gerekmez.
- Motor tutucusu 4'ü üzerine kaydırın.
- Motor 4'ü yerleştirin.
- Motor 4'ü 4 adet M2x6mm vida ile sabitleyin.

<video controls width="600">
  <source src="https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/lerobot/Joint4_v2.mp4" type="video/mp4" />
</video>

### Eklem 5 (Joint 5)

- Motor 5'i bilek tutucusuna (wrist holder) yerleştirin ve 2 adet M2x6mm ön vida ile sabitleyin.
- Bilek motoruna yalnızca bir motor boynuzu takın ve bunu M3x6mm boynuz vidası ile sabitleyin.
- Bileği motor 4'e her iki taraftan 4 adet M3x6mm vida ile tutturun.

<video controls width="600">
  <source src="https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/lerobot/Joint5_v2.mp4" type="video/mp4" />
</video>

### Kavrayıcı / Kol (Gripper / Handle)

- Kavrayıcıyı motor 5'e takın; bileğin üzerindeki motor boynuzuna 4 adet M3x6mm vida ile sabitleyin.
- Kavrayıcı motorunu yerleştirin ve her iki taraftan 2'şer adet M2x6mm vida ile sabitleyin.
- Kavrayıcı motoruna her iki motor boynuzunu takın. Üstteki boynuzu M3x6mm vida ile sabitleyin; alttaki boynuz için vida gerekmez.
- Kavrayıcı pençesini (gripper claw) takın ve her iki taraftan 4'er adet M3x6mm vida ile sabitleyin.

<video controls width="600">
  <source src="https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/lerobot/Gripper_v2.mp4" type="video/mp4" />
</video>

**Leader kol için ek adımlar:**

- Leader tutucusunu bileğe monte edin ve 4 adet M3x6mm vida ile sabitleyin.
- Kolu (handle) motor 5'e 1 adet M2x6mm vida ile tutturun.
- Kavrayıcı motorunu yerleştirin, her iki taraftan 2'şer adet M2x6mm vida ile sabitleyin ve M3x6mm boynuz vidası ile bir motor boynuzu takın.
- Follower tetiğini (trigger) 4 adet M3x6mm vida ile tutturun.

## Kalibrasyon

Ardından, leader ve follower kollarının aynı fiziksel konumda aynı pozisyon değerlerine sahip olmasını sağlamak için robotunuzu kalibre etmeniz gerekir. Kalibrasyon süreci çok önemlidir çünkü bir robot üzerinde eğitilmiş bir sinir ağının başka bir robot üzerinde de çalışmasına olanak tanır.

<video controls width="600">
  <source src="https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/lerobot/calibrate_so101_2.mp4" type="video/mp4" />
</video>

#### Follower

Follower kolu kalibre etmek için aşağıdaki komutu veya API örneğini çalıştırın:

```bash
lerobot-calibrate \
    --robot.type=so101_follower \
    --robot.port=/dev/tty.usbmodem58760431551 \ # <- Kendi portunuzla değiştirin
    --robot.id=my_awesome_follower_arm # <- Robotunuza bir isim verin
```

#### Leader

Leader kolu kalibre etmek için de aynı adımları uygulayın:

```bash
lerobot-calibrate \
    --teleop.type=so101_leader \
    --teleop.port=/dev/tty.usbmodem58760431551 \ # <- Kendi portunuzla değiştirin
    --teleop.id=my_awesome_leader_arm # <- Leader kolunuza bir isim verin
```

Kalibrasyon işlemi sırasında, istemleri takip ederek her eklemi mekanik durak (end-stop) boyunca hareket aralığının ortasından tam aralığın sonuna kadar hareket ettirin.

## Sonraki Adımlar

Robotunuz monte edilip kalibre edildikten sonra, LeRobot ile aşağıdaki adımlara devam edebilirsiniz (ayrıntılar için [LeRobot dokümantasyonuna](https://huggingface.co/docs/lerobot) bakın):

- **Teleoperasyon (Teleoperate):** `lerobot-teleoperate` komutu ile leader koldan follower kolu kontrol etme
- **Kamera ekleme (Add cameras):** OpenCV veya RealSense kameralarıyla görsel algılama ekleme
- **Veri seti kaydetme (Record a dataset):** `lerobot-record` ile teleoperasyon sırasında demonstrasyon toplama
- **Veri setini görselleştirme (Visualize a dataset):** Hugging Face Dataset Visualizer ile kayıtları inceleme
- **Bölüm tekrarı (Replay an episode):** Kaydedilmiş bir bölümü robot üzerinde yeniden oynatma
- **Politika eğitme (Train a policy):** Kaydettiğiniz veriyle bir davranış klonlama politikası eğitme
- **Politikayı değerlendirme (Evaluate your policy):** Eğitilmiş politikayı gerçek robot üzerinde çalıştırma

:::tip

Sorularınız varsa veya yardıma ihtiyaç duyuyorsanız lütfen [LeRobot Discord sunucusuna](https://discord.com/invite/s3KuuzsPFb) katılın.

:::

## İlgili Sayfalar

- Bu sitede detaylı kalibrasyon ve çalıştırma için: [Sim-to-Real → Robot Laboratuvarı → Kalibrasyon](/sim-to-real/robot-laboratuvari/kalibrasyon)
- Çalışma alanı kurulumu: [Sim-to-Real → Robot Laboratuvarı → Çalışma Alanı](/sim-to-real/robot-laboratuvari/calisma-alani)
- Hızlı komut referansı: [Sim-to-Real → Referans → Hızlı Referans](/sim-to-real/referans/hizli-referans)
