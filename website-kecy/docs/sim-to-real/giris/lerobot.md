---
title: 'LeRobot: Arka Plan ve Topluluk'
sidebar_position: 4
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: LeRobot: Arka Plan ve Topluluk'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [04-lerobot.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/04-lerobot.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

### Bu Modül İçin Neye İhtiyacım Var?

Hiçbir şeye — bu modül tamamen teoriktir.

Bu oturumda, önünüzdeki SO-101 robotunun arka planını, Hugging Face LeRobot projesini ve çalışmanızı destekleyecek topluluk kaynaklarını inceleyeceğiz.

Bu çerçeve (framework) robotik öğrenmenin ulaşılabilir bir yoludur ve endüstriyel robotlarda kullanılan uygulamaların aynılarına — üstelik evde bile deneyebileceğiniz uygun maliyetli bir biçimde — aşinalık kazandırır.

## Öğrenme Hedefleri

Bu oturumun sonunda şunları yapabileceksiniz:

- SO-101 robotunu ve yeteneklerini **tanımlama**

- LeRobot projesini ve robotik topluluğundaki rolünü **açıklama**

- Sürekli öğrenme için topluluk kaynaklarını **belirleme**

## SO-101 Robotu

SO-101, manipülasyon görevlerinde araştırma ve eğitim için tasarlanmış 6-DOF (serbestlik derecesi) bir robot koludur.

Günlük konuşmada SO-101'i tek bir robot gibi ele alsak da genellikle bir çift olarak satılır veya üretilir:

- **Teleop kol** ("leader" olarak da bilinir): Gösterim yapmak için bu kolu elle hareket ettirirsiniz. Enkoder konumları kaydedilebilir, robot kolunu doğrudan sürmek için kullanılabilir ya da ikisi birden yapılabilir.

- **Robot kol** ("follower" olarak da bilinir): Teleoperasyon sırasında teleop kolu taklit eder; değerlendirme sırasında bir politika tarafından sürülür.

![SO-101 Follower Kolu](/img/sim-to-real/04-lerobot/SO101_follower.jpg)

_SO-101 Robot, "follower kol" olarak da bilinir._

Tipik kit ayrıca simüle edilmiş robotları veya "follower" kolu kontrol etmek için kullanılan bir teleoperasyon kolunu da içerir.

![SO-101 Leader Kolu](/img/sim-to-real/04-lerobot/SO101_leader.jpg)

_SO-101 Teleoperasyon Kolu, "leader kol" veya "teleop kol" olarak da bilinir. Kolun ucunda elinizle robotu manipüle etmeniz için bulunan kavrayıcıya (gripper) dikkat edin._

### Eklem Yapılandırması

SO-101'in altı eklemi vardır:

1.  **Taban (Base)** (J1): Dikey eksen etrafında dönüş

2.  **Omuz (Shoulder)** (J2): Birinci kol segmentinin eğimi

3.  **Dirsek (Elbow)** (J3): İkinci kol segmentinin eğimi

4.  **Bilek Eğimi (Wrist Pitch)** (J4): Bileğin yukarı/aşağı dönüşü

5.  **Bilek Dönüşü (Wrist Roll)** (J5): Bileğin kol ekseni etrafında dönüşü

6.  **Kavrayıcı (Gripper)** (J6): Paralel çeneli kavrayıcı

### Neden SO-101?

SO-101 bu öğrenme yolu için idealdir, çünkü:

- **Ulaşılabilir**: Eğitim ve araştırma için uygun maliyetlidir

- **İyi belgelenmiş**: Güçlü topluluk desteği vardır

- **LeRobot entegrasyonu**: LeRobot ekosisteminde birinci sınıf destek sunar

- **Simülasyona hazır**: Doğru simülasyon modelleri mevcuttur

## LeRobot Projesi

LeRobot, Hugging Face tarafından geliştirilen açık kaynaklı bir kütüphanedir; veri toplama, eğitim, robot kontrolü ve robot politikalarının değerlendirilmesi için araçlar içerir.

### Topluluk Veri Setleri

LeRobot, Hugging Face Hub üzerinde topluluk tarafından katkı sağlanan veri setlerini LeRobot Dataset Formatı ile barındırır.

- Binlerce robot gösterimi

- Birden fazla robot platformu

- Çeşitli manipülasyon görevleri

- Birlikte çalışabilirlik için standartlaştırılmış formatlar

## Bu Kurs İçin Neden LeRobot?

LeRobot bu kursun temelidir; bunun birkaç pratik nedeni vardır:

### Hugging Face Hub ile Kesintisiz Veri Akışı

Veriyi sisteme alıp dışarı vermek kolaydır:

```bash
# Örnek komut

# Topladığınız veri setini Hub'a yükleyin
hf upload ${HF_USER}/my_robot_dataset ./datasets/my_robot_dataset

# Eğitim veya co-training için veri setlerini çekin
hf download lerobot/community_dataset
```

Bu Hub entegrasyonu; veri setlerini iş arkadaşlarınızla paylaşmanızı, verinizi sürümlemenizi ve topluluk katkılarına en az sürtünmeyle erişmenizi sağlar.

### Post-Training (Eğitim Sonrası) İş Hattı

LeRobot, yerleşik eğitim iş hatlarını (NVIDIA Isaac GR00T, SmolVLA ve daha fazlası dahil) sarmalar:

```bash
# Örnek komut
# Verinizde bir politikayı ince ayar yapın
python lerobot/scripts/train.py \
--policy.type=gr00t \
--dataset.repo_id=${HF_USER}/my_dataset
```

Zamanınızı altyapıyla değil, göreviniz üzerinde harcarsınız.

### Gerçek Robot Değerlendirmesi

Veri toplama için kullanılan çerçeve, politika konuşlandırmayı da yapar:

```bash
# Örnek komut
# Eğitilmiş bir politikayı gerçek robot üzerinde değerlendirin
lerobot-eval \
--robot.type=so101_follower \
--robot.port=$ROBOT_PORT \
--policy_path ${HF_USER}/my_trained_policy
```

Bu, döngüyü kapatır: veri topla → eğit → konuşlandır → değerlendir → yineleme yap. Hepsi tek bir sistem içinde.

## Topluluk Kaynakları

### Veri Seti Görselleştirici

LeRobot, Hugging Face Spaces üzerinde etkileşimli bir veri seti görselleştirici sunar:

- [LeRobot Dataset Visualizer](https://huggingface.co/spaces/lerobot/visualize_dataset)

Bu aracı Hub'daki herhangi bir LeRobot veri setini keşfetmek için kullanın. Bölümler arasında gezinebilir, kamera akışlarını izleyebilir ve eylem/durum yörüngelerini inceleyebilirsiniz — veri kalitesi sorunlarını ayıklamak veya eğitimden önce bir veri setinin neler içerdiğini anlamak için yararlıdır.

### Dokümantasyon

- [LeRobot Documentation](https://huggingface.co/docs/lerobot)

- [SO-101 Getting Started Guide](https://huggingface.co/docs/lerobot/en/so101)

### Örnekler ve Öğreticiler

- [GR00T N1.5 SO-101 Tuning](https://huggingface.co/blog/nvidia/gr00t-n1-5-so101-tuning)

- Topluluk notebook'ları ve örnekleri

### Topluluk Kanalları

- Hugging Face Discord

- GitHub Discussions

- Topluluk forumları

## Hugging Face Hub Entegrasyonu

LeRobot, Hugging Face Hub'dan şunlar için faydalanır:

### Veri Seti Paylaşımı

```bash
# Örnek komut
# Bir topluluk veri seti indir
hf download lerobot/so101_pickplace
```

### Model Paylaşımı

```bash
# Örnek komut
# Önceden eğitilmiş bir modeli indir
hf download lerobot/groot_so101_vial_pickup
```

### Deney Takibi

Weights & Biases ve diğer deney takip araçlarıyla entegrasyon.

### Bu Kursta Hugging Face'i Nasıl Kullandık

**1\. Gösterim toplamak için veri seti formatı**

Tüm teleoperasyon verileri için LeRobot veri seti formatını kullandık. Bölümler; gözlemler (ör. kamera görüntüleri), robot durumu ve eylemlerle birlikte tutarlı bir şema içinde saklanır. Kayıt, eğitim için ve Hub'a yüklemek için verinin doğru yapıya düşmesini sağlayacak şekilde `--repo_id` ve `--repo_root` ile `lerobot_agent` (veya gerçek donanımda `lerobot_record`) kullanılarak yapılır.

**2\. Veri setlerini paylaşmak**

Veri setleri, eğitim için yeniden kullanılabilsin, başkalarıyla paylaşılabilsin ve sürümlenebilsin diye Hugging Face Hub'a yüklendi. Kayıt sırasında `--dataset.repo_id=${HF_USER}/dataset_name` ve `--dataset.push_to_hub=true` kullandık; mevcut yerel veri setleri içinse `hf upload` kullandık. Hub üzerindeki [LeRobot Dataset Visualizer](https://huggingface.co/spaces/lerobot/visualize_dataset), eğitimden önce bölümleri incelemek ve kaliteyi doğrulamak için kullanıldı.

**3\. Co-training için veri setlerini birleştirmek (sim + gerçek, sim + Cosmos)**

Co-training için birden fazla veri kaynağını tek bir eğitim veri setinde birleştirdik. Sim + gerçek: simülasyon teleop veri setleriyle gerçek robot teleop veri setlerini (ör. `so101_teleop_vials_rack_left` ile `so101_teleop_vials_rack_left_real_50`) birleştirdik; böylece politika her ikisinden de öğrenebildi. Sim + Cosmos: temel sim verisini Cosmos ile zenginleştirilmiş sentetik veriyle birleştirdik. Birleştirme, Hub üzerinden (birden fazla repo indir, yerelde birleştir) ya da eğitim betiğini tek bir birleşik repoya yönlendirerek yapıldı; böylece tek bir koşu sim, gerçek ve zenginleştirilmiş veriyi birlikte kullanabildi.

**4\. Değerlendirmeleri paylaşmak**

Değerlendirme sonuçları ve politika kontrol noktaları (checkpoint) Hub üzerinden paylaşıldı. Eğitilmiş modeller (ör. GR00T kontrol noktaları veya LeRobot politika repoları olarak) yüklendi; böylece başkaları değerlendirmeleri yeniden üretebildi veya aynı politikayı hem simülasyonda hem de gerçek robotta çalıştırabildi. Bu öğrenme yolunda, herkesi aynı temel çizgiler (baseline) ve co-train edilmiş modeller üzerinde hizalamak için belirli veri seti ve model repolarına verilen bağlantılar kullanıldı.

## Önemli Çıkarımlar

- SO-101, sim-to-real öğrenmek için ulaşılabilir ve iyi desteklenen bir robottur

- LeRobot, açık kaynaklı araçlar, veri setleri ve modeller sunar

- Hugging Face topluluğu sürekli destek ve kaynaklar sağlar

- Giderek büyüyen bir robot öğrenci ve uygulayıcı topluluğuna katılıyorsunuz

## Sırada Ne Var?

Sırada, [Çalışma Alanını Kurma](/sim-to-real/robot-laboratuvari/calisma-alani) bölümü fiziksel ışık kutusunu (lightbox) ve görev aksesuarlarını montajlama ve aydınlatma adımlarını anlatır. Ardından [SO-101'i Kalibre Etme](/sim-to-real/robot-laboratuvari/kalibrasyon) güç verme ve kalibrasyonu, [SO-101'i Çalıştırma](/sim-to-real/robot-laboratuvari/calistirma) ise teleoperasyon ve kamera kurulumunu kapsar.
