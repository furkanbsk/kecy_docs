---
title: 'Genel Bakış'
sidebar_position: 1
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Genel Bakış'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [01-overview.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/01-overview.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

Bu öğrenme yolu size, simülasyonda başlayıp gerçek dünyaya geçerek bir fiziksel AI modelini nasıl eğitip gerçek bir robota nasıl konuşlandıracağınızı öğretecek.

![](/img/sim-to-real/01-genel-bakis/sim-teleop-example-huggingface.gif)

_Simülasyonda teleoperasyon örneği._

![](/img/sim-to-real/01-genel-bakis/so101_vial_to_rack_task.gif)

_Teleoperasyon verisiyle eğitilmiş model tarafından yapılan otonom yürütme._

## Fiziksel AI Nedir?

Fiziksel AI (Physical AI), fiziksel dünya ile etkileşime giren ve onu manipüle eden AI sistemlerini ifade eder. Üretici veya etmen (agentic) AI'dan (görüntü üreticiler, sohbet botları gibi) farklı olarak Fiziksel AI şunları yapabilir:

- **Algılama**: sensörler aracılığıyla gerçek dünyayı algılar

- **Akıl yürütme**: fizik, nesneler ve uzamsal ilişkiler üzerine düşünür

- **Eylem**: motorlar, aktüatörler ve uç işlevleyiciler (end-effector) aracılığıyla hareket eder

- **Uyum sağlama**: gerçek ortamların öngörülemezliğine uyum sağlar

Bu öğrenme yolu; simülasyondan gözünüzün önünde otonom çalışan gerçek bir robota kadar, fiziksel robotlarla baştan sona bir Fiziksel AI iş akışını öğretir.

## Görev: Santrifüj Tüplerinin Al-Bırak İşlemi

![SO-101 robotu tarafından gerçekleştirilen tüpten rafa görevi](/img/sim-to-real/01-genel-bakis/so101_vial_to_rack_task.gif)

_SO-101 robotu tarafından otonom gerçekleştirilen tüpten-rafa al-bırak görevi._

Bugün kullanacağımız görev **santrifüj tüplerinin yapılandırılmamış al-bırak işlemi**. Tüpler masa üzerine dağınık halde yerleştirilmiş ve belirli bir rafa yerleştirilmeleri gerekiyor.

Görevi daha ulaşılabilir kılmak için bazı kısıtları bir ışık kutusu (lightbox) ve bazı görev parametreleriyle basitleştirdik.

Ancak **öğreneceğiniz araç ve teknikler daha karmaşık görevlere** ve üretim robotlarına da uygulanabilir. Bu öğrenme yolunun odağı sim-to-real **iş akışıdır**.

### Neden Bu Görev?

Peki bu görevi neden seçtik? Laboratuvar problemini çözen mühendisler olduğumuzu hayal edelim.

Kurgusal problemimizde bu tüpler bir olukta aşağıya salınmış ya da başka bir şekilde yapılandırılmamış biçimde dağılmış durumda; fakat zaten mevcut olan bir otomatik makine hattı tarafından işlenmek üzere bir rafa düzenlenmeleri gerekiyor.

- **Gerçek dünya karşılığı**: bu, öğelerin otonom analiz makineleri için hazırlanması gereken iş akışlarının bir benzeri.

- **Güvenlik etkileri**: potansiyel tehlikeli örneklerle çalışılan kullanım senaryolarını düşünün — insan temasının en aza indirilmesi kritik, bu yüzden robotik kullanılıyor. Görevi simülasyonda öğretebilmek ayrıca zamandan tasarruf sağlar ve maruziyeti azaltır.

- **Teknik zorluk**: değişime uyum, robotun adapte olup yeniden denemesi.

- **Ulaşılabilir**: öğrenme için bu görev, nesnelerini toplayıp teleoperasyonla yürütmeye yetecek kadar basit.

## Bu Problem Neden İlginç?

Politikamız 2B kamera bilgileriyle çalışacak ve tüplerin rafa yerleştirilmesi, tüplerin yeniden yönlendirilmesini ve oldukça hassas biçimde yerleştirilmesini gerektiriyor.

Görevi kendiniz teleoperasyonla yapınca muhtemelen göreceksiniz ki başlangıçta kolay değil. Önemli bir sorun şu: robot bir tüpü kavradıktan sonra robotun uç (gripper) kamerası kapanıyor; dolayısıyla politikanın bu bilgi olmadan da çalışabilmesi gerekiyor.

Kendiniz teleoperasyon yaptığınızda bu zorluğu birebir deneyimleyeceksiniz.

:::note

SO-101 bir üretim robotu değil; ancak bu araçları üretim robotlarına uygulamadan önce öğrenmek için eğlenceli ve ulaşılabilir bir platform. Vurgulamak gerekirse, buradaki odak başka görevlere veya üretim robotlarına uygulayabileceğiniz bir **iş akışıdır**.

:::

## Simülasyon Neden Önemli?

![Görev telkafes: masadaki tüpler, çerçevelenmiş hedef raf.](/img/sim-to-real/01-genel-bakis/task-wireframe.gif)

_Görev telkafesi: tüpler masaya dağıtılmış, robot tarafından bir rafa yerleştirilecek._

Robotları gerçek dünyada eğitmek pahalı, riskli ve bazen tehlikelidir.

Simülasyon bu temel sınırlamaları ele alır:

1.  **Zaman**: Gerçek dünya veri toplama yavaştır — bir tek robotunuz da olsa bin robotunuz da olsa bir yörünge aynı süreyi alır

2.  **Maliyet**: Robot donanımı pahalıdır ve keşif sırasındaki hatalar hasara yol açabilir

3.  **Güvenlik**: Başarısızlık modlarını gerçek donanımda keşfetmek tehlikeli olabilir

4.  **Çeşitlilik**: Çeşitli eğitim senaryoları oluşturmak (farklı ışık, nesne, konumlar) emek yoğundur

Simülasyon bunların hepsini ele alır:

| Zorluk              | Gerçek Dünya             | Simülasyon                  |
| ------------------- | ------------------------ | --------------------------- |
| Eğitim hızı         | 1x gerçek zamanlı        | 1000x+ paralel ortam        |
| Donanım maliyeti    | Robot başına 10K$-100K$+ | Marjinal hesaplama maliyeti |
| Hata sonucu         | Hasar, duruş süresi      | Sıfırla ve devam et         |
| Senaryo çeşitliliği | Manuel kurulum           | Prosedürel üretim           |

### Ayrıcalıklı Bilgi

Simülasyon ayrıca gerçek dünyada elde edilmesi mümkün olmayan bilgilere erişim sağlar:

- **Tam nesne pozları**: Algı gürültüsü ya da kapanma yoktur

- **Temas kuvvetleri**: Her temas noktasında hassas ölçümler

- **Kesin etiketler**: Mükemmel segmentasyon ve nesne kimliği

- **Durum türevleri**: Tam hızlar ve ivmeler

Bu ayrıcalıklı bilgi, nihai politika yalnızca gerçekçi sensör girdileri kullansa bile öğrenmeyi hızlandırabilir.

## Önemli Çıkarımlar

- Simülasyon, gerçek dünyada imkansız olan hızlı, güvenli ve çeşitli eğitim olanağı sağlar

- Sim-to-real boşluğu, sistematik yaklaşımlar gerektiren temel bir zorluktur

- Bu öğrenme yolu, birden fazla boşluk kapatma stratejisiyle uygulamalı deneyim sunar

- Başarı, yineleme ve yaklaşımları birleştirmekten gelir

Isaac GR00T adlı bir VLA (Vision-Language-Action, Görü-Dil-Eylem) modeli kullanarak sistemimiz "tüpü al ve rafa yerleştir" gibi bir dil komutunu alacak; eklem geri bildirimi ve kamera gözlemlerini politika girdisi olarak kullanacak. Politika daha sonra görevi yürütmek için motor pozisyonları üretecek.

## Sırada Ne Var?

Bu öğrenme yolu hedeflerinize ve zaman kısıtlarınıza uyum sağlayacak şekilde biraz esneklik barındırıyor. Şimdi bu seçeneklere bakalım!

[Bu Kursu Nasıl Takip Edersiniz](/sim-to-real/giris/nasil-calisilir) bölümüne devam edin.
