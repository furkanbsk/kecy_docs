---
title: Sinyal ve Sistemler Nedir?
sidebar_position: 2
---

Robotik konusuna dalmadan önce, iki temel kavramı anlayalım: sinyal ve sistemler. Sistemleri bilgi taşıyıcıları (mesajlar gibi), sistemleri ise bilgi işleyicileri (çevirmenler gibi) olarak düşünebilirsiniz. Robotikte, sensörler işaret gönderir ve robotun beyni (sistem) bu işaretleri işleyerek kararlar alır.

Sinyal : Zaman, uzay veya diğer değişkenlerle değişen ve bilgi taşıyan herhangi bir fiziksel niceliktir.

Gerçek Hayattan Örnekler

• Sesiniz - bilgi taşıyan ses dalgaları • Sıcaklık ölçümleri - zamanla değişen sayılar • Bir fotoğraf - uzayda değişen parlaklık • Robot sensör verisi - ultrasonik sensörden gelen mesafe ölçümleri

Sinyallerin Türleri

1. Analog Sinyaller : Sürekli ve düzgün olan sinyalerdir, belirli bir aralıktaki herhangi bir değeri alabilir. Örnek olarak sıcaklık sinyali verilebilir, sıcaklığın 20 dereceden 25 dereceye çıkarkenki yükselişi sürekli bir sinyaldir. Robotik alanından örnek olarak herhangi bir robotun motorlarının sahip olduğu açıyı ölçen sensörden çıkan veri analog sinyaldir.

2. Dijital Sinyaller : Ayrık adımlarla oluşan rampa merdiven gibi eğilimler gösterebilen sinyallerdir. Bu sinyaller sadece belirli değerler alır, bu değerler genellikle 0 ve 1 gibi değerlerden oluşur. En basit örnekle robotun engel sensöründen gelen engel var cevabı (1) ve engel yok cevabı (0) dijital sinyale örnektir.

Sistem : Bir giriş sinyali alan ve onu işleyen ve bir çıkış sinyali üreten her şeydir.

```json
GİRİŞ SİNYALİ → [SİSTEM] → ÇIKIŞ SİNYALİ
```

Kahve Makinesi Sistemi • Giriş: Su + kahve + düğmeye basma • Sistem: Isıtma ve demleme işlemi • Çıkış: Sıcak kahve Hesap Makineniz • Giriş: Yazdığınız sayılar ve işlemler • Sistem: Matematiksel işleme • Çıkış: Ekrandaki sonuç Robot Engelden Kaçınma • Giriş: Mesafe sensörü okuması (duvara 30cm) • Sistem: Karar verme algoritması • Çıkış: Sola dön komutu

Sistemler Nasıl Davranır? Önemli Sistem Özellikleri

## Sistemler Nasıl Davranır ?

1. Doğrusallık (Orantılı Sistem) Girişi iki katına çıkarırsanız, çıkış da iki katına çıkar. Örnek: Bir yayı 1 cm bastırmak 10N kuvvet gerektiriyorsa, 2 cm bastırmak 20N gerektirir. Yay sistemi doğrusaldır (belirli limitler içinde). Robotikte: İdeal motor hız kontrolü - voltajı iki katına çıkarın, hız iki katına çıkar.
2. Zamandan Bağımsızlık (Tutarlı Sistem) Sistem, ne zaman kullanırsanız kullanın aynı şekilde davranır. Örnek: 180°C’deki fırınınız Pazartesi kullanılsa da Cuma kullanılsa da aynı çalışır. Robotikte: Düzgün kalibre edilmiş bir sensör tutarlı okumalar verir.
3. Nedensellik (Mantıklı Sistem) Çıkış, sadece geçmiş ve şimdiki girişlere bağlıdır, gelecekteki girişlere değil. Örnek: Engeli görmeden fren yapamazsınız - gördükten sonra tepki verirsiniz. Robotikte neden önemli: Gerçek dünya sistemleri nedensel olmalıdır çünkü robotlar geleceği tahmin edemez (makine öğrenimi olmadan)!

## Yaygın Sinyal İşlemleri

### Kullanacağınız İşlemler

**1. Yükseltme/Ölçekleme** Sinyali büyütmek veya küçültmek.

- _Örnek_: Müzikte sesi açmak
- _Robotikte_: Zayıf sensör sinyallerini işleme için yükseltmek

**2. Toplama** İki Sinyali birleştirmek.

- _Örnek_: İki ses kaydını karıştırmak
- _Robotikte_: Birden fazla sensörden gelen verileri birleştirmek (sensör füzyonu)

**3. Gecikme** Sinyali zamanda kaydırmak.

- _Örnek_: Seste yankı efekti
- _Robotikte_: Hareketi algılamak için mevcut sensör okumasını öncekiyle karşılaştırmak

**4. Filtreleme** Sinyalin istenmeyen kısımlarını çıkarmak.

- _Örnek_: Gürültü önleyici kulaklıklar
- _Robotikte_: Temiz yönelim verisi elde etmek için jiroskop okumalarından gürültüyü çıkarmak

### Frekans Nedir?

**Frekans**, bir şeyin ne kadar hızlı tekrar ettiğini veya salınım yaptığını söyler.

- **Düşük frekans**: Yavaş değişimler (okyanus gelgitleri gibi)
- **Yüksek frekans**: Hızlı değişimler (titreşimler gibi)

### Frekans Robotikte Neden Önemli?

**Örnek 1: Motor Kontrolü** Bir robot motoru 100 Hz'de (saniyede 100 kez) kontrol sinyalleri alabilir. Bu frekans, robotun ne kadar düzgün hareket ettiğini belirler.

**Örnek 2: Sensör Gürültüsü** Sensör verilerindeki yüksek frekanslı gürültü, hızlı ve titrek okumalar olarak görünür. Bunları yumuşatmak ve yararlı yavaş değişen işaretleri korumak için alçak geçiren filtreler kullanırız.

## Sinyal ve Sistemlerin Robotikle ilgisi

**Basit Bir Robot Senaryosu: Duvara Paralel Gidiş**

1. **İşaret Üretimi**: Ultrasonik sensör ses dalgaları yayar (Sinyal)
2. **İşaret Alımı**: Sensör yankıyı alır ve zaman gecikmesini ölçer
3. **Sistem İşleme**:
   - Zamanı mesafeye dönüştür (d = hız × zaman / 2)
   - Gürültüyü azaltmak için filtreleme uygula
   - Karar ver: "Çok yakın mı? Uzaklaş. Çok uzak mı? Yaklaş."
4. **Çıkış İşareti**: Motorlara komut gönderilir
5. **Sistem Tepkisi**: Robot pozisyonunu ayarlar

**Sensör Sinyallerii:**

- Mesafe (ultrasonik, LiDAR)
- Yönelim (IMU, jiroskop)
- Görüş (kamera görüntüleri)
- Dokunma (kuvvet sensörleri)

**İşleme Sistemleri:**

- Filtreler (gürültülü veriyi yumuşatır)
- Kontrolörler (hassas hareket için PID kontrolü)
- Durum tahmin ediciler (robotun konumunu bulur)

**Çıkış İşaretleri:**

- Motor komutları (hız, yön)
- Servo pozisyonları (kol açıları)
- LED göstergeleri (durum gösterimi)

## Önemli Noktalar

1. **İşaretler bilgi taşır** - robotunuz boyunca akan verilerdir
2. **Sistemler işaretleri işler** - karar veren algoritmalar ve devrelerdir
3. **İşaret özelliklerini anlamak** sensör sorunlarını gidermenize yardımcı olur
4. **Filtreleme gürültüyü çıkarır** - güvenilir robot çalışması için gereklidir
5. **Frekans önemlidir** - güncelleme hızlarını ve sistem duyarlılığını belirler
