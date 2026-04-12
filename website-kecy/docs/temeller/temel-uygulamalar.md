---
title: Robotikte Temel Uygulamalar
sidebar_position: 3
---

## 1. Sensör Veri İşleme

Sensörler ham veri üretir, ancak bu veriler genellikle doğrudan kullanılamaz. Sensör veri işleme, bu ham verileri robotun anlayabileceği ve karar verebileceği anlamlı bilgilere dönüştürür.

Örneğin:

Ultrasonik sensörünüz "ses dalgasının geri dönüş süresi: 0.002 saniye" der. Bu sayı tek başına pek bir şey ifade etmez. Sensör veri işleme ile bu süreyi mesafeye çevirirsiniz: mesafe = (hız × zaman) / 2 = (340 m/s × 0.002 s) / 2 = 34 cm. Artık robotunuz "önümde 34 cm uzakta bir engel var" diye anlayabilir.

### Robotikte Kullanım Alanları

Bir çizgi takip eden robot düşünün. Kamera veya IR sensörler görüntü alır, ancak robot "sağa dön" veya "düz git" kararı veremez. Veri işleme, görüntüdeki çizginin konumunu hesaplar, çizginin merkeze göre ne kadar sağda veya solda olduğunu bulur ve bunu motor komutlarına dönüştürür. Aynı şekilde, bir IMU sensörü ham jiroskop ve ivmeölçer verileri üretir, veri işleme bu sayıları birleştirerek robotun tam yönelimini (hangi açıda durduğunu) hesaplar.

---

## 2. Kontrol Sistemleri

Kontrol sistemleri, robotun istediğiniz gibi hareket etmesini sağlar. Sadece "git" demek yetmez, robotun hızını, yönünü ve pozisyonunu sürekli düzenlemesi gerekir.

Örneğin:

Bir araba kullandığınızı düşünün. 100 km/h hızda gitmek istiyorsunuz. Gaz pedalına basarsınız, ama hız 95 km/h'de kalırsa biraz daha basarsınız. 105 km/h olursa gevşetirsiniz. İşte yaptığınız şey bir kontrol sistemidir: hedef ile gerçeği karşılaştırıp sürekli düzeltme yaparsınız.

### Robotikte En Yaygın ve Önemli : PID Kontrolü Nedir?

PID (Proportional-Integral-Derivative) en popüler kontrol yöntemidir. Üç basit kuralı vardır:

**P (Orantılı)**: Hata ne kadar büyükse, o kadar güçlü düzelt. Robot hedeften 10 cm uzaktaysa, 1 cm uzakta olduğundan daha hızlı hareket etsin.

**I (İntegral)**: Uzun süredir küçük bir hata varsa, onu topla ve düzelt. Robot hedefin hep 2 cm gerisinde kalıyorsa, bunu fark et ve telafi et.

**D (Türevsel)**: Hata çok hızlı değişiyorsa, yavaşla. Robot hedefe çok hızlı yaklaşıyorsa, çarpmaması için önceden yavaşla.

Bu üç bileşeni dengeli kullanarak, robot hem hızlı hem de stabil şekilde hedefine ulaşır. Örneğin, bir robot kolu tam 90 derece açıya dönmeli, bir drone havada belirli yükseklikte kalmalı veya bir tekerli robot belirli bir hızda gitmelidir - hepsi PID kontrolü ile yapılır.

---

## 3. Sinyal Filtreleme

Gerçek dünyadaki sensörler hiçbir zaman mükemmel değildir. Titreşim, elektriksel gürültü veya çevresel faktörler yüzünden sensör okumaları sürekli zıplar. Filtreleme, bu gürültüyü azaltarak gerçek sinyali ortaya çıkarır.

örneğin:

Gürültülü bir kafede arkadaşınızı dinlemeye çalışıyorsunuz. Beyniniz otomatik olarak arka plan seslerini "filtreler" ve arkadaşınızın sesine odaklanır. İşaret filtreleme de aynı şeyi yapar: istediğimiz sinyali korur, istemediğimiz gürültüyü atar.

### İki Temel Filtre Türü

**Alçak Geçiren Filtre (Low-Pass Filter)**: Yavaş değişen sinyalleri geçirir, hızlı değişenleri (gürültüyü) engeller. Mesafe sensörü sürekli 30 cm, 32 cm, 29 cm, 31 cm arası zıplıyorsa, alçak geçiren filtre bunları yumuşatarak düzgün bir 30 cm okuması verir. Bu filtreyi sıcaklık ölçümlerinde, mesafe sensörlerinde veya robot konumu takibinde kullanırız.

**Yüksek Geçiren Filtre (High-Pass Filter)**: Hızlı değişen sinyalleri geçirir, yavaş değişenleri engeller. Robotunuz titreşim algılamalıysa (birisi robota vurdu mu?) ama yerçekiminin sabit etkisini görmezden gelmeli. Yüksek geçiren filtre, ani değişimleri yakalar ama sabit veya yavaş değişen etkileri yok sayar.

### Robotik Örnek

Bir denge robotu düşünün (iki tekerlekli, Segway gibi). Jiroskop ve ivmeölçer sensörleri var. İvmeölçer robotun eğimini ölçer ama titreşimden çok gürültülü. Jiroskop dönme hızını ölçer ama zamanla sapma yapar. Çözüm: Tamamlayıcı filtre (Complementary Filter). İvmeölçer verisine alçak geçiren, jiroskop verisine yüksek geçiren filtre uygulayıp ikisini birleştiririz. Sonuç: Hem hızlı hem de doğru eğim bilgisi!

---

## 4. Geri Besleme Döngüleri

Geri besleme, robotun yaptığı işin sonucunu ölçerek kendini düzeltmesidir. "Açık döngü" sistemlerde robot körce komut yürütür, "kapalı döngü" sistemlerde ise sonucu kontrol edip gerekirse düzeltir.

Örneğin:

Gözleriniz kapalıyken bardağa su dökmeye çalışın (açık döngü) - muhtemelen dökersiniz. Şimdi gözleriniz açıkken yapın (kapalı döngü) - bardak dolarken görür, tam yerinde durdurursunuz. Gözleriniz "geri besleme" sağlar.

### Açık Döngü vs Kapalı Döngü

**Açık Döngü Sistemi**: Robot "2 saniye ileri git" komutu alır ve uygular. Zemin kaygan mı, pil zayıf mı, motor aşınmış mı - önemli değil, komut uygulanır. Sonuç belirsizdir.

**Kapalı Döngü Sistemi**: Robot "30 cm ileri git" komutu alır. Ama sürekli pozisyonunu ölçer (enkoder veya GPS ile). 28 cm gittiyse "henüz yeterli değil" diyerek devam eder. 30 cm'e ulaşınca durur. Sonuç tahmin edilebilir ve doğrudur.

Örneğin:

Bir otonom araç şeritte kalmalı. Kamera şeritleri görür (sensör), aracın şeridin neresinde olduğunu hesaplar (sensör işleme), direksiyonu ne kadar kırması gerektiğini belirler (kontrol sistemi) ve direksiyonu döndürür (tahrik). Ardından tekrar kameraya bakar - araç istenen konumda mı? Değilse, düzeltmeye devam eder. Bu sürekli tekrarlanan döngü, geri besleme döngüsüdür.

Başka bir örnek: Robot kol bir nesneyi kavramalı. Konum sensörleri kolun nerede olduğunu söyler, hedef pozisyonla karşılaştırılır ve motorlara komut gönderilir. Kol hareket ettikçe konum sürekli ölçülür ve hedefle karşılaştırılır. Hedefe ulaşılana kadar bu döngü devam eder. Bu sayede kol, yük ağır da olsa hafif de olsa, her durumda doğru pozisyona gider.

---

## Özetle

Bu dört kavram, her robotun temel işleyişidir:

**Sensör veri işleme** ham verileri anlamlı bilgiye çevirir. **Filtreleme** bu bilgiyi temizler. **Kontrol sistemleri** ne yapılacağına karar verir. **Geri besleme** yapılanın doğru olup olmadığını kontrol eder ve düzeltir.

Bu döngü durmadan tekrar eder ve robotunuz çevresini algılayan, karar veren ve kendini sürekli düzelten otonom bir sistem haline gelir. İşte robotiğin sihri bu sonsuz, hızlı döngüde gizlidir!
