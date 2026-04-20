---
title: 'Sim-to-Real Nedir?'
sidebar_position: 3
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Sim-to-Real Nedir?'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [03-sim-to-real.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/03-sim-to-real.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

### Bu Modül İçin Neye İhtiyacım Var?

Hiçbir şeye — bu modül tamamen teoriktir.

## Öğrenme Hedefleri

Bu oturumun sonunda şunları yapabileceksiniz:

- Sim-to-real aktarımını ve hedeflerini **tanımlama**

- Sim-to-real boşluklarının dört ana kategorisini **belirleme**

- Yüksek sadakatli simülasyonla bile aktarımın neden zor olduğunu **açıklama**

## Sim-to-Real'in Tanımı

**Sim-to-real**, bir politikayı simülasyonda eğitip gerçek donanımda konuşlandırma sürecidir. Hedef; tamamen (veya büyük oranda) simülasyonda eğitilmiş olmasına rağmen gerçek dünyada iyi performans gösteren bir politikadır.

![Sim-to-Real](/img/sim-to-real/03-sim-to-real-nedir/sim-and-real.png)

_Unitree H1 ile Sim-to-Real._

## Sim-to-Real Boşluğu

**Sim-to-real boşluğu**, simülasyon ile gerçeklik arasındaki performans farkıdır. Simülasyonda yüksek başarı oranına ulaşan bir politika, gerçek donanımda belirgin biçimde daha kötü sonuç verebilir.

:::warning

Sim-to-real boşluğu çoğu zaman beklenenden büyüktür. Günlük konuşmada "boşluk" tek bir kavram gibi ele alınsa da aslında algılama, aktüasyon, fizik ve modellemedeki boşlukların karmaşık bir bileşimidir.

Sistematik test ve yineleme yapmadan bir politikanın gerçek donanımda "kendiliğinden çalışacağını" asla varsaymayın.

:::

## Boşluğun Kaynakları

### Algılama (Sensing) Boşlukları

- Kamera modelleri gerçek sensör gürültüsünü, bulanıklığı ve distorsiyonu barındırmaz

- Derinlik sensörleri, yapaylıklar (artifact) olmadan idealleştirilmiş ölçümler sunar

- Simüle ışıklandırma, gerçek ışık koşullarından farklıdır

### Aktüasyon (Actuation) Boşlukları

- Motor modellerinde sürtünme, geri boşluk (backlash) ve termal etkiler eksiktir

- Eklem dinamikleri basitleştirilmiştir

- Kontrol döngüsü zamanlaması simülasyon ve donanımda farklıdır

### Fizik (Physics) Boşlukları

- Temas dinamikleri (sürtünme, geri tepme) yaklaşık değerlerdir

- Deforme olabilen nesneleri doğru şekilde simüle etmek zordur

- Akışkan dinamiği ve granüler malzemeler hesap açısından pahalıdır

### Modelleme (Modeling) Boşlukları

- CAD modelleri, inşa edilmiş (as-built) donanımdan farklıdır

- Kütle ve atalet değerleri tahmindir

## Aktarımı Zorlaştıran Nedir?

Sim-to-real boşluğu yalnızca simülasyon sadakatiyle ilgili değildir. Kusursuz simülasyonda bile aktarım zordur çünkü:

1.  **Dağılım kayması (distribution shift)**: Gerçek dünya koşulları eğitim sırasındakinden farklılaşır

2.  **Birikimli hatalar**: Küçük algı hataları büyük eylem hatalarına yol açar

3.  **Modellenmemiş dinamikler**: Gerçek fizikte, simülasyonda temsil edilmeyen etkiler bulunur

4.  **Zamansal farklılıklar**: Gerçek zamanlı kısıtlar davranışı etkiler

## Özet

| Boşluk Kategorisi | Örnekler                                            |
| ----------------- | --------------------------------------------------- |
| Algılama          | Kamera gürültüsü, aydınlatma, derinlik yapaylıkları |
| Aktüasyon         | Sürtünme, geri boşluk, termal etkiler               |
| Fizik             | Temas dinamikleri, deforme olabilen nesneler        |
| Modelleme         | CAD hataları, kütle/atalet tahminleri               |

Bu boşlukları anlamak hayati önemdedir — bu öğrenme yolu boyunca her bir kategoriyi ele alacak stratejiler öğreneceksiniz.

## Sırada Ne Var?

Sim-to-real zorluğunu anladığınıza göre şimdi kullanacağımız araçları öğrenelim. Sonraki oturum olan [LeRobot: Arka Plan ve Topluluk](/sim-to-real/giris/lerobot) bölümünde, robotik için Hugging Face ekosistemini öğreneceksiniz.
