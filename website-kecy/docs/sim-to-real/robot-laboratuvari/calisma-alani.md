---
title: 'Çalışma Alanını Kurma'
sidebar_position: 1
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Çalışma Alanını Kurma'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [05-building-workspace.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/05-building-workspace.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

### Bu Modül İçin Neye İhtiyacım Var?

Ekipman aşağıda listelenmiştir — burada robot laboratuvarınızı kuracaksınız.

Bu modül, **gerçek dünyadaki görev alanını inşa etmek ve standartlaştırmakla** ilgilidir. Buna ışık kutusu (lightbox) muhafazası, aydınlatma, kameralar, mat, tüpler ve raf dahildir — böylece eğitim ve değerlendirme için kullanılan Isaac Lab sahnesiyle uyumlu olur.

Işık kutusunu bu şekilde kurmak size tutarlı bir ortam sağlar; böylece modellerimizi ve veri setlerimizi kullanabilirsiniz.

Bu öğrenme yolundan sonra da kendi robot deneylerinizi yapmaya devam etmek için kullanmaya devam edebilirsiniz!

:::info

Neden fiziksel çalışma alanıyla başlıyoruz?

Gerçek dünyada Fiziksel AI çalışması yaptığınızda, başlangıçta kullanabileceğiniz **fiziksel** bir çalışma alanınız olmayabilir. Daha önce tartıştığımız nedenlerden (test kolaylığı, maliyet, güvenlik, yineleme kolaylığı) dolayı genellikle simülasyonda başlarız.

Bu atölyede fiziksel alanı önce kuracağız; bunun üç nedeni var:

1.  Bu bilgiyi size erken veriyoruz; böylece öğrenme yolunu tamamlamaya hazırlık olarak parça siparişi verebilir veya çalışma alanınızı kurabilirsiniz

2.  Size fiziksel robot ve teleoperasyonla deneyim kazandırmak için. Eğlencelidir!

3.  AI modelinin sahip olacağı aynı girdileri (iki kamera, eklem pozisyonları) kullanırken görevin ne kadar "zor" olduğunu hissettirmek için

:::

## Işık Kutusu Ortamı

Şu bileşenleri içeren bir **beyaz ışık kutusu muhafazası** inşa ederek başlayalım:

1.  **Kameralar** — biri robot üzerinde (bilek / kavrayıcı görünümü), biri sabit (harici / sahne görünümü)

2.  **Işıklar** — parlaklığı kontrol edilebilir difüz (yumuşatılmış) ışık

3.  **Aksesuarlar** — santrifüj tüpleri, sarı raf, köpük (foam) mat.

![Işık kutusu](/img/sim-to-real/05-calisma-alani/so101_workspace.jpg)

![Tüp Rafı](/img/sim-to-real/05-calisma-alani/vial_rack.jpg)

### Neden ışık kutusu kullanıyoruz

**Öğrenme ve hata ayıklama için değişkenleri sınırlar** Düz, parlak bir muhafaza görsel gürültüyü azaltır; böylece politika göreve özgü özelliklere — kavrayıcı, tüpler ve raf — odaklanabilir.

**Dijital ikizle uyumludur** Isaac Lab sahnesi bu muhafazanın boyutlarını, rengini, kamera konumlarını ve nesne geometrisini kopyalar. Gerçek tezgahın bu tasarımla eşleşmesi, görsel alan boşluğunu (domain gap) daraltır — sim-to-real başarısızlığının başlıca kaynaklarından biridir.

**Düşük performanslı kameralarla uyumludur** Tüketici webkamları otomatik pozlama (auto-exposure) ve sınırlı dinamik aralığa sahiptir. Kutunun içinde parlak, difüz aydınlatma görüntüleri temiz ve tutarlı tutar.

**Aktarılabilir modelleri mümkün kılar** Ortamı kontrol etmek, robotlar ve kurulumlar arasında aktarılabilir modeller hazırlamayı kolaylaştırır. Hata ayıklama; kontrolsüz sahne kaymasına değil, politika ve kalibrasyona odaklanır.

## Malzeme Listesi

Tüm robot + çalışma alanı kurulumunun toplam maliyeti aşağıdaki seçeneklere göre tahmin edilerek 500 USD'nin altında olmalıdır.

SO-101'i önceden monte edilmiş (pre-assembled) almanızı öneririz; çünkü bir teleop kolla birlikte gelir ve montajı daha kolaydır. Kendiniz de inşa edebilirsiniz ama biraz daha uğraştırıcıdır.

### Robot

Yaklaşık maliyet: 300 USD

| Ürün | Açıklama | Model/Özellikler | Adet | Ayrıntı |
| --- | --- | --- | --- | --- |
| **SO-101 Robot Kol ve Teleop Kol** | 6-DoF işbirlikçi robot kol (SO-101 veya benzeri) | [SO-101](https://shop.wowrobo.com/products/so-arm101-diy-kit-assembled-version-1?variant=46588641706201) paket 3, turuncu | 1 | Al-bırak görevi için ana robot; Teleop kol gösterim kaydı için opsiyoneldir. Bu kiti öneririz çünkü dahili kavrayıcı kamerası veri setlerimizle eşleşir. Alternatif olarak, [kendi SO-101'inizi yazdırıp inşa edebilirsiniz](https://github.com/TheRobotStudio/SO-ARM100)! |

### Çalışma Alanı

Yaklaşık maliyet: 130 USD

| Ürün | Açıklama | Model/Özellikler | Adet | Ayrıntı |
| --- | --- | --- | --- | --- |
| **Kamera (Harici)** | USB webkam, sabit montaj, ~78° yatay görüş açısı (FoV) | [Logitech C920](https://www.amazon.com/Logitech-C920x-Pro-HD-Webcam/dp/B085TFF7M1) veya eşdeğeri | 1 | Çalışma alanının genel görünümünü yakalamak için sabit bakış açısı; simülasyondaki gibi stabil ve hizalı olmalıdır. |
| **Işık Kutusu Muhafaza Panelleri** | Beyaz köpük panel (foam board) kutu, yaklaşık 30" (76 cm) geniş, 20" (51 cm) yüksek, 20" (51 cm) derin. | 5 adet [20x30" köpük panelden, 3/16" (~5 mm) kalınlık](https://www.michaels.com/product/20-x-30-white-foam-board-10110205) monte edin | 5 | Görüntüler için tutarlı, difüz ışık ve nötr arka plan sağlar. Diğer beyaz ışık kutuları da kullanılabilir. Daha kalın veya ince köpük panel de çalışır. |
| **Işık Kaynağı** | LED tüp ışık, difüz, CRI >90, ~4000K, ayarlanabilir | [Neewer Dimmable LED Bar](https://www.amazon.com/NEEWER-Inflatable-2700K-5600K-Photography-GC10B/dp/B0DQ7Y8DWX?th=1) | 1 | Çalışma alanının parlak ve tek düze aydınlatılmasını sağlar. |
| **Siyah Çalışma Matı** | Çalışma alanı için köpük mat | [Siyah EVA köpük](https://www.michaels.com/product/12-x-18-thick-foam-sheet-by-creatology-10661709) | 1 | Tüpler ve raf için kaymaz yüzey; rengi simülasyon ortamıyla uyumludur. |
| **Santrifüj Tüpleri** | 50 ml, vida kapaklı, şeffaf plastik | [Falcon tüp veya benzeri](https://www.amazon.com/Kashi-Scientific-Conical-Centrifuge-Graduation/dp/B0C35JV95M?th=1) | 1-4 | Robot tarafından manipüle edilen aksesuar; şeffaf kenarlar simülasyonla görsel tutarlılık sağlar. |
| **Tüp Rafı** | Sarı, 4+ tüp alır, simülasyon varlığına (asset) benzer | Sarı 3D yazdırılmış - modeller [burada](https://www.printables.com/model/1675961-vial-rack-50ml-centrifuge) | 1 | Tüpleri dik tutar, al-bırak işleminin hedefidir. Dijital ikizle uyumlu sarı renk en iyisidir; %5 kadar düşük dolgu oranı (infill) bile işe yarayabilir. |
| **USB-C Şarj Adaptörü** | Işığı beslemek için | [Anker 25W USB-C Şarj Adaptörü](https://www.amazon.com/gp/product/B0D72DWLZ1/) | ihtiyaç kadar | 21W veya üzeri. Tüm ışıklar ve aksesuarlar için yeterli güç; güvenlik ve cihaz spesifikasyonlarına uyum sağlayın. |
| **USB-C Kablo** | Işığı beslemek için | [USB-C - USB-C kablo, 6ft (~1.8 m)](https://www.amazon.com/Anker-Charging-MacBook-Galaxy-Charger/dp/B088NRLMPV) | 1 | Yukarıda önerilen ışık pille çalışır, ancak bu kablo onu sürekli beslemenizi sağlar. |
| **(opsiyonel) Köpük panel birleştiricileri** | Işık kutusunu monte etmek için | 3D yazdırılmış, model [burada](https://www.printables.com/model/1652109-foam-board-joints-for-lightbox) | 8 | Işık kutusunun sökülürken köpük paneli yırtmadan monte edilmesini sağlar. Alternatif olarak bant kullanabilirsiniz. |

### Aksesuarlar

Yaklaşık maliyet: 20 USD.

| Ürün | Açıklama | Model/Özellikler | Adet | Ayrıntı |
| --- | --- | --- | --- | --- |
| **Santrifüj Tüpleri** | 50 ml, vida kapaklı, şeffaf plastik | [Falcon tüp veya benzeri](https://www.amazon.com/Kashi-Scientific-Conical-Centrifuge-Graduation/dp/B0C35JV95M?th=1) | 1-4 | Robot tarafından manipüle edilen aksesuar; şeffaf kenarlar simülasyonla görsel tutarlılık sağlar. |
| **Tüp Rafı** | Sarı, 4+ tüp alır, simülasyon varlığına benzer | 3D yazdırılmış | 1 | Tüpleri dik tutar; renk/şekil dijital varlıkla yakından eşleşmelidir. |

## Çalışma Alanını İnşa Etme

Kısaca şunları yapacağız:

1.  Köpük paneli ölçüye göre **kesme**

2.  Harici kamera için bir delik **açma**

3.  Işığı **montajlama**

4.  Aksesuarları ve robotu **sabitleme** ve **konumlandırma**.

### Işık Kutusunu Monte Etme

1.  5 köpük panelden 2'sini 20" x 20" (51 cm x 51 cm) boyutlarına **kesin**. Bunlar yanlar olacak.

2.  20"x20" panellerden birinde, harici kamera için dikdörtgen bir delik **açın**. Logitech webkam kolu yaklaşık 5 cm × 1.5 cm'dir — deliği, sıkıca geçecek şekilde boyutlandırın.

3.  Şimdi kutuyu **monte edin** — iki seçenek vardır:

Seçenek A — Bant (hızlı)

Ek yerleri boyunca beyaz koli bandı (duct tape) veya gaffer bandı kullanın.

- **Artıları**: ucuz, hızlı, alet gerektirmez

- **Eksileri**: bandı sonradan çıkarırken köpük panele zarar verirsiniz

Bantlama sırasında köpük panel kenarlarını hizada tutun. Bandı her ek yerinin tüm uzunluğu boyunca çekmek en güçlü bağı üretir; küçük parçalar işe yarar ama daha zayıftır.

Seçenek B — 3D yazdırılmış köşeler (tekrar kullanılabilir)

Yukarıdaki BOM (malzeme listesi) bağlantısındaki köşe parçalarını yazdırın ve panelleri yerine geçirin.

- **Artıları**: düzgün görünüm, söküp yeniden monte etmesi kolay

- **Eksileri**: 3D yazıcıya erişim gerekir

### Kamera Konumlandırma Ölçüleri

| Parametre | Değer |
| --- | --- |
| **Yükseklik** | Işık kutusu tabanından 40 cm |
| **Arka duvardan mesafe** | Robotun arkasından kamera lensinin merkezine ~27 cm |
| **Arkadan yan uzaklık** | Arka panelden 24 cm |
| **Açı** | Aşağı doğru 45°, çalışma alanına yönlendirilmiş. Kameranın hem robotu, hem tüpleri hem de rafı iyi gördüğünden emin olun. |

:::tip

Yuva (slot) konumunu kesinleştirmeden önce kamera görünümünün örnek görüntülerle eşleştiğini doğrulayın. Birkaç santimetrelik hata kabul edilebilir; büyük sapmalar politikanın gördüklerini değiştirir ve performansı düşürür.

:::

## Işığı Kurma

Işık **parlak, difüz ve gün ışığı sıcaklığında** olmalıdır. Malzeme listesindeki ışıkları kullanırsanız bunlar zaten difüzdür.

:::warning

Bu ışıklar uzun süreli kullanımda ısınabilir. Gece boyunca açık bırakmayın ve uzun oturumlarda sıcaklığı takip edin.

:::

Köpük panel tavan — iç montaj

Üst panel için köpük panel kullanırsanız, difüz bir panel ışığı kutunun içine aşağı bakacak şekilde monte edin. Köpük paneldeki küçük deliklerden geçirilen plastik bağcıklar (zip tie) en güvenilir yöntemdir; bant işe yarayabilir ama ısıyla yapışması çözülebilir.

Açık tavan — dış montaj

Açık tavanın üstüne, çalışma alanını eşit şekilde aydınlatacak açıyla difüz bir harici ışığı mandalla tutturun veya konumlandırın.

![Işık kutusu aydınlatmasını açma ve ayarlama](/img/sim-to-real/05-calisma-alani/light-operation.gif)

**Teleoperasyon veya politika koşularından önce ışığı açın ve parlaklığı ayarlayın.**

1.  Işığın **güç düğmesine** **basın**.

2.  Taşıma kilidi (travel lock) ilerleme çubuğu tamamlanana ve ışık açık kalana kadar **güç düğmesine** tekrar **basılı tutun**.

3.  **Parlaklık kontrollerini** **kullanın**; değerlendirmeler ve veri toplama için kabaca **%50-100** hedefleyin.

4.  AC güç mevcutsa ışığın kablosunu **takın**; yalnızca pille çalışan koşular tam bir oturumu karşılayamayabilir.

## Robotu Monte Etme

SO-101'i sağlam bir masaya mandalla sabitleyin. Aşağıdaki referans fotoğrafta gösterilen konumda taban ışık kutusunun içinde kalacak şekilde konumlandırın.

Bu, robota iyi bir hareket açıklığı verir ve harici kameranın robotu iyi görmesini sağlar.

Mandalların robotun hareket açıklığını **kısıtlamadığını** **doğrulayın** — güç vermeden önce her eklemi aralığı boyunca manuel olarak hareket ettirerek test edin.

![Işık kutusu](/img/sim-to-real/05-calisma-alani/so101_workspace.jpg)

## Mat, Tüpler ve Rafı Düzenleme

Simülasyon ortamımız ve kontrol noktası modellerimiz genel olarak rafın **solda** ve tüplerin **sağda** olmasına aşırı uyumlanmıştır (overfit). Konumlandırma için yukarıdaki referans fotoğrafı kullanın.

Sonradan kullanacağımız Isaac Lab ortamını özelleştirirseniz başka yapılandırmaları da deneyebilirsiniz!

### Raf Yerleşim Ölçüleri

Köpük matı tüplerin altına düz serin ve 1-3 tüpü mata çeşitli pozlarda dağıtın (simülasyondaki genel düzenin aynısı).

## Fiziksel Yerleşim Kontrol Listesi

Robotu muhafazaya yerleştirmeden veya herhangi bir gerçek robot yazılımı çalıştırmadan önce:

1.  **Muhafaza** — Işık kutusu panelleri monte edilmiş; iç kısım dağınık nesnelerden temizlenmiş.

2.  **Mat ve aksesuarlar** — Köpük mat düz; **sarı raf** belirlenen yerinde; matta **1-3 tüp** çeşitli pozlarda (simülasyondaki genel düzen).

3.  **Kameralar** — Bilek ve harici kameralar, hem mat/raf hem de kavrayıcı çalışma alanı görünür olacak şekilde monte edilip yönlendirilmiş; ağır kapanma (occlusion) veya parlama yok.

4.  **Kablolar** — Kamera ve robot kablolarını eklem hareketini kısıtlamayacak veya takılmayacak şekilde yerleştirin (kablolar yanlış kalibrasyon sınırları oluşturabilir; bkz. [Sorun Giderme](/sim-to-real/referans/sorun-giderme), _Kalibrasyon Başarısız_).

5.  **Aydınlatma** — Işık açık ve yeterince parlak (önceki bölüm).

Herhangi bir şey taşındıysa bu kontrol listesini **[Gerçek Değerlendirme](/sim-to-real/veri-egitim-degerlendirme/gercek-degerlendirme) öncesinde** ve her [Strateji 2](/sim-to-real/veri-zenginlestirme/strateji-2-cotraining) / [Strateji 3](/sim-to-real/veri-zenginlestirme/strateji-3-cosmos) konuşlandırmasından önce **yeniden kontrol edin**.

## Önemli Çıkarımlar

- Başarılı eğitim ve konuşlandırma için çalışma alanı kurulumu kritiktir.

## Sırada Ne Var?

Çalışma alanı inşa edilip hazır hale geldiğine göre, [Kodu Edinme](/sim-to-real/robot-laboratuvari/kod-ve-modeller) bölümüne devam edin.
