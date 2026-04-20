---
title: 'Strateji 1: Domain Randomization'
sidebar_position: 1
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Strateji 1: Domain Randomization'
needsTranslation: false
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [09-strategy1-dr-teleop.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/09-strategy1-dr-teleop.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

### Bu Modül İçin Neye İhtiyacım Var?

Uygulamalı. `teleop-docker` kapsayıcısına, SO-101 teleop koluna ve Isaac Lab simülasyonu için bir NVIDIA GPU'ya ihtiyacınız olacak.

Gerçek robotta teleoperasyon yaptığınıza göre şimdi aynı şeyi _simülasyonda_ Isaac Lab ile deneyelim.

Bu modülde, simüle edilmiş bir SO-101 robotunu sürmek için teleop kolu kullanacak, böylece Isaac Lab ile gösterimler toplayacağız.

Simülasyon olduğu için dünyayı kontrol edebilir ve ilginç şekillerde manipüle edebiliriz — örneğin veri setimizin yeterince çeşitli olmasını sağlamak için **domain randomization (alan rastgeleleştirme)** kullanabiliriz.

![Simülasyonda Teleoperasyon](/img/sim-to-real/09-strateji-1-domain-randomization/teleop_in_sim.gif)

_Simülasyonda Teleoperasyon._

## Öğrenme Hedefleri

Bu oturumun sonunda şunları yapabileceksiniz:

- Domain randomization'ı ve sim-to-real aktarımını neden iyileştirdiğini **açıklama**

- Simülasyonda teleoperasyon yoluyla gösterim verisi **toplama**

- Gösterimleri zenginleştirmek için domain randomization **uygulama**

## Domain Randomization Nedir?

Domain randomization (DR), şu fikre dayanan bir sim-to-real stratejisidir: simülasyonun gerçeği mükemmel şekilde eşleştirmesini sağlamak yerine, eğitim sırasında simülasyon parametrelerini rastgeleleştirin; böylece politika, gerçek dünya değerleri de dahil aralıktaki herhangi bir değere karşı sağlam (robust) hale gelir.

Basitçe söylemek gerekirse: top yakalamayı nasıl öğrenebileceğinizi düşünün.

Her zaman aynı pozda yakalarsanız, topa _uzanmayı_ veya eldiveni farklı yönlerde tutmayı öğrenemeyebilirsiniz. Pratikte topun size farklı yerlere atılmasını çeşitlendirerek top yakalama için büyük olasılıkla daha iyi bir "politika" öğrenirsiniz.

### Neleri rastgeleleştirmeliyiz?

Neyin rastgeleleştirileceğinin tek bir yanıtı yoktur. Ancak iyi bir genel kural, **gerçek dünyada değişmesi muhtemel** ya da robotun ortamında değişebilecek **parametreleri** rastgeleleştirmektir.

SO-101 ile tüp rafı vaka çalışması için neyin iyi sonuç verdiğini inceleyelim.

![Domain Randomization Örneği](/img/sim-to-real/09-strateji-1-domain-randomization/teleop-domain-randomization.gif)

_Domain Randomization Örneği. Sahne her sıfırlandığında bir dizi parametre verilen aralıklar içinde rastgeleleştirilir._

**Görsel Domain Randomization:**

- Nesne renkleri, dokuları, malzemeleri

- Aydınlatma yoğunluğu, yönü, renk sıcaklığı

- Kamera konumu, yönlendirmesi, görüş alanı

- Arka plan görünümü

Görsel domain randomization'ın başka örnekleri şunlardır:

**Fizik Domain Randomization:**

- Nesne kütlesi, sürtünme, geri tepme (restitution)

- Eklem sönümleme (damping), sürtünme, sınırlar

- Aktüatör gecikmeleri, gürültüsü, ofsetleri

- Sensör gürültü karakteristikleri

Güçlü Yönler ve Sınırlamalar

**Güçlü yönler:**

- Zenginleştirme için gerçek dünya verisi gerekmez

- Bilinmeyen parametreleri ele alır

- Birçok parametreye ölçeklenir

- Uygulaması basittir

**Sınırlamalar:**

- Bilimden çok sanat (aralıkları ayarlamak)

- Optimalliği sağlamlık karşılığında takas eder

- Muhafazakâr, yavaş hareketler üretebilir

- Oldukça dinamik görevlerde iyi çalışmaz

## Teleoperasyon: İnsan Gösterimlerini Toplama

Bu derste teleoperasyon sırasında domain randomization uygulayacağız. Bunları _taklit öğrenmesi (imitation learning)_ olarak bilinen bir robot öğrenme türünü gerçekleştirmek için kullanacağız.

### Neden Taklit Öğrenmesi? (okumak için genişletin)

Teleoperasyon, insan uzmanlığını iş başında yakalamamıza olanak tanır; böylece sistem, görevleri yerine getirirken insanların sağladığı doğal, sezgisel hareketlerden yararlanabilir.

İnsanlar içgüdüsel olarak görev başarısı için neyin önemli olduğunu bilir ve bu, işin önemli yönlerini yansıtan gösterimlere yol açar.

Bu süreç ayrıca çeşitlilik getirir; çünkü farklı bireyler aynı göreve kendilerine özgü şekillerde yaklaşabilir. En önemlisi, teleoperasyonla toplanan gösterimler güvenilir biçimde başarılı görev tamamlamasını temsil eder ve taklit öğrenmesi için yüksek kaliteli veri sağlar.

## Uygulamalı: Gösterim Toplama

Görevin videosu aşağıdadır:

![LeRobot Dataset Visualizer'da teleoperasyon örneği](/img/sim-to-real/09-strateji-1-domain-randomization/sim-teleop-example-huggingface.gif)

_Örnek: LeRobot Dataset Visualizer üzerinden yeniden oynatılan SO-101 teleoperasyonu._

Bu veri setini Hugging Face'te [Dataset Visualizer](https://huggingface.co/spaces/lerobot/visualize_dataset?path=%2Fsreetz-nv%2Fso101_teleop_vials_rack_left%2Fepisode_29%3Ft%3D0) ile görüntüleyin.

:::tip

Kameralar veya robot bağlantısıyla sorun mu yaşıyorsunuz? [Sorun Giderme Kılavuzu](/sim-to-real/referans/sorun-giderme) bölümüne bakın.

:::

### Simülasyon Ortamını Başlatma (Docker)

1.  Önceki modülden `teleop-docker` kapsayıcısının terminali hâlâ açıksa bu adımı atlayabilirsiniz. Değilse açılır menüyü **genişletin** ve komutu **çalıştırın**.

### Simülasyonda teleop ve değerlendirme için kullanılan Isaac Sim kapsayıcısını başlatın:

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

### Simülasyonda Teleoperasyon Pratiği

Kayıt yapmadan teleoperasyon pratiği yapmak için simülasyon ortamını başlatalım.

Bu, veri toplamadan önce teleop kontrollerine ve kamera görünümlerine aşina olmanın iyi bir yoludur.

1.  (Opsiyonel) Ortam değişkenlerinizin doğru ayarlandığından emin olmak için hızlı bir sağlamlık kontrolü **çalıştırın**.

```bash
echo "Teleop port is ${TELEOP_PORT} with id ${TELEOP_ID}"
```

Ayarlı değillerse `lerobot-find-port` kullanarak portları bulun ve tekrar atayın:

### Port değişkenlerini ayarlama örneği

```bash
setenv TELEOP_PORT=/dev/ttyACM # !! güncellediğinizden emin olun
setenv ROBOT_PORT=/dev/ttyACM # !! güncellediğinizden emin olun

setenv TELEOP_ID=orange_teleop # bu satırı olduğu gibi kullanın
setenv ROBOT_ID=orange_robot # bunu olduğu gibi kullanın
```

2.  Teleop kolu toplu bir pozisyona **hareket ettirin**. Robot garip bir başlangıç konumundaysa başlangıçta simülasyondaki nesnelere çarpabilir.

3.  Önceden yapılandırılmış simülasyon ortamımızla Isaac Lab'i açmak için aşağıdaki komutu **çalıştırın**. İki seçenek arasından tercih yapabilirsiniz: domain randomization'ı olmayan `Lerobot-So101-Teleop-Vials-To-Rack` veya domain randomization'ı etkinleştirilmiş `Lerobot-So101-Teleop-Vials-To-Rack-DR`.

```bash
lerobot_agent --task Lerobot-So101-Teleop-Vials-To-Rack-DR
```

Bu, Isaac Sim'i başlatır ve eğitim ortamını yükler.

:::note

Bu ilk başlatıldığında yüklenmesi yaklaşık 2 dakika sürer.

Takılırsa konsolu hata için kontrol edin. Büyük olasılıkla robot tam olarak bağlı değildir. Sorunlar yaşıyorsanız robota güç döngüsü yapın (arkadaki güç kablosunu çekip tekrar takın).

:::

![](/img/sim-to-real/09-strateji-1-domain-randomization/teleop-open.png)

4.  Sonraki adım için Isaac Lab'i **açık tutun**.

### Kameraları Kurma

Simülasyonumuzun bize AI modelimizin kullanacağı aynı kamera görünümlerini göstermesi gerekir.

VLA eğitimi için teleoperasyon yaparken, modelin otonom çalışırken kullanacağı kamera görünümlerini teleoperasyon için de kullanmamız kritiktir.

Aksi takdirde modelin sahip olmayacağı önyargılar veya avantajlar ekleyebiliriz.

:::info

**Teleoperasyon yaparken yalnızca kavrayıcı ve harici kameralardan bakın.**

Sahneyi kendi gözlerinizle ya da simülasyon sahnesindeki diğer kameralarla izlediğinizde, modelin çıkarım sırasında erişimi olmayacak algısal avantajlar (affordance) ekleyebilirsiniz.

Politika yalnızca kameraların gördüğünü görür. Ekranınızda görüntülenen kamera görünümlerine tamamen güvenmek için kendinizi eğitin. Bu, gösterimlerinizin politikanın gerçekten algılayabileceği şeyleri yansıtmasını sağlar.

:::

Varsayılan olarak yalnızca genel perspektif kamerasını göreceksiniz. Bunu düzeltelim.

1.  **Window > Viewports** menüsüne **gidin** ve aynı anda iki kamera görebilmemiz için hem _Viewport 1_ hem de _Viewport 2_'yi **etkinleştirin**.

![](/img/sim-to-real/09-strateji-1-domain-randomization/enable_second_viewport.png) _(Görsel kaynakta eksik)_

2.  Viewport'lardan birinde **camera menüsüne** **gidin** ve `gripper_cam`'ı **seçin**.

![](/img/sim-to-real/09-strateji-1-domain-randomization/choose_camera.png)

3.  Diğer viewport'ta **camera menüsüne** **gidin** ve `Camera_OmniVision_9782_Color` kamerasını **seçin**.

Her viewport için kameralarla eşleşmesi için en-boy oranını 4:3'e **ayarlayın**.

4.  Viewport'taki **settings menüsüne** gidin.

5.  Sağ taraftaki **Viewport > Aspect Ratio altında** `16:9` göreceksiniz. Bunu `4:3` olarak **değiştirin**. ![](/img/sim-to-real/09-strateji-1-domain-randomization/set_aspect_ratio.png) ![](/img/sim-to-real/09-strateji-1-domain-randomization/viewports_and_cameras_setup.png)

6.  Şimdi teleoperasyon yapmayı deneyin ve bölüm (episode) biçiminde veri toplamaya geçmeden önce teleop kontrolleri ve kamera görünümlerine aşina olmak için biraz vakit harcayın.

7.  Ortamı domain randomization ile sıfırlamak için **R'ye basın**. Çalışmazsa uygulamaya odak vermek için viewport'a **tıklayın** ve tekrar **deneyin**.

8.  Terminalde tüplerin kavrandığı veya rafa yerleştirildiği gibi alt görev başarısına ilişkin durum güncellemelerini göreceğinizi **fark edin**.

**Kontroller (bu komutları kullanmak için Viewport'a tıklayın)**

- Ortamı sıfırlamak için **R'ye basın** (kaydı da durdurur)

- Çalışmaya devam ederken bölümler işlenmek üzere kuyruğa alınır

9.  Bittiğinde terminalde **CTRL+C'ye basarak** Isaac Lab'i **durdurun**.

### Gösterim Kaydına Başlama

Veri toplamaya hazır olduğunuzda, topladığımız verinin nereye kaydedileceğine dair birkaç ek argüman ekleyeceğiz.

Teleop etmenini başlatmadan önce Hugging Face kullanıcı adınızı bir ortam değişkeni olarak ayarlayın. Bu, veri setlerinizi benzersiz bir ad alanında (namespace) düzenlemek için kullanılır.

Hesabınız yoksa veya giriş yapmak istemiyorsanız yerel veri toplama için kendiniz bir kullanıcı adı uydurabilirsiniz.

1.  `your-hf-username` yerine gerçek Hugging Face kullanıcı adınızı yazarak şunu **çalıştırın**:

```bash
export HF_USER=your-hf-username
```

Bunu aşağıdaki komutları çalıştırmadan önce terminal oturumu başına yalnızca bir kez yapmanız gerekir. Giriş yapıp gösterimlerinizi yüklemek istemiyorsanız uydurma bir kullanıcı adı kullanmakta özgürsünüz.

### Genel Akış

Her bölüm için şunları yapacağız:

1.  **Ortamı sıfırla**: Tüp konumlarını, raf konumunu, kamera pozlarını ve aydınlatmayı rastgeleleştirmek için **R'ye basın**.

2.  **Kaydet**: Kaydı başlatmak için **S'ye basın**

3.  **Yürüt**: Gösterime hemen **başlayın**.

4.  **Tamamla**: Kaydı durdurmak için **S'ye basın**

**Gösterim Kalitesi Kılavuzu:**

**İyi gösterimler:**

- Pürüzsüz, kasıtlı hareketler

- Tüple net kavrama teması

- Rafa başarılı yerleştirme

- Çalışırken yalnızca kamera görünümlerine bakma

**Kaçının:**

- Sarsıntılı, tereddütlü hareketler

- Kaçırılan kavramalar veya düşürmeler

- Gerçek görev yürütmesinden fazlasını dahil etme

1.  Kayıt oturumunu **başlatın**. Bu daha önceki ortama benzer olacak, ama iptal etmek, kaydı başlatmak ve durdurmak için ek kontrollerimiz olacak.

```bash
lerobot_agent --task Lerobot-So101-Teleop-Vials-To-Rack-DR \
--repo_id ${HF_USER}/so101_teleop_vials \
--repo_root $(pwd)/datasets/so101_teleop_vials \
--task_name "Pick up the vial and place it in the rack"
```

2.  Pencereyi, viewport'ları ve kameraları **kurun** (**Teleoperasyon Pratiği**'ndeki ile aynı):

    - **Window > Viewport**: Aynı anda iki kamera görünümü görmek için her iki viewport'u **etkinleştirin**.

    - Bir viewport'ta camera menüsünü **açın** ve **gripper_cam**'ı **seçin**.

    - Diğer viewport'ta camera menüsünü **açın** ve **Camera_OmniVision_9782_Color**'ı **seçin**.

    - Her viewport için: viewport ayarlarını **açın**, **Viewport > Aspect Ratio**'ya **gidin** ve 16:9 yerine **4:3**'e **ayarlayın**.

3.  **Kayıt Kontrolleri:** Isaac Sim viewport'u "odak"ta olmalıdır (uygulamanın UI'ına **tıklayın**)

- Bir bölümün kaydını başlat/durdur için **S'ye basın**

- Mevcut kaydı iptal etmek için **C'ye basın** (hatalar için yararlı)

- Ortamı sıfırlamak için **R'ye basın** (kaydı da durdurur)

- Çalışmaya devam ederken bölümler işlenmek üzere kuyruğa alınır

Örnek terminal çıktısı:

```
[INFO]: Started recording.
[INFO]: Stopped recording.
[INFO]: Copy episode to CPU...
[INFO]: Episode added to queue.
[INFO]: [ASYNC] received episode from queue...
[INFO]: Cleared buffers
```

4.  Bittiğinde `[INFO]: No More episodes in queue` mesajını gördüğünüzden **emin olun**. Göremiyorsanız birkaç saniye bekleyin. Bu, tüm bölümlerin işlendiği ve kaydedildiği anlamına gelir.

5.  Terminalde **CTRL+C'ye basarak** Isaac Lab'i **durdurun**.

### Adım 4: Toplanan Veriyi İnceleme

1.  Opsiyonel: bir gösterim kaydettiyseniz kaydedilen bölümleri incelemek için LeRobot dataset görselleştiricisini **kullanın**:

```bash
lerobot-dataset-viz \
--repo-id ${HF_USER}/so101_teleop_vials \
--root $(pwd)/datasets/so101_teleop_vials \
--episode-index 0
```

Farklı bölümleri görüntülemek için `--episode-index` değerini değiştirin.

## Simülasyonda Domain Randomization

Domain randomization avantajlarını en üst düzeye çıkarmak için birden fazla oturumda gösterim toplayın. Ortam, bölümler arasında koşulları otomatik olarak rastgeleleştirir.

Koda bir göz atalım.

### Kod Turu: Domain Randomization Uygulaması

Isaac Lab ortamı, DR'yi sıfırlama olayı işleyicileri (reset event handlers) aracılığıyla uygular. İşte teleop ortamı kod tabanındaki temel rastgeleleştirme yöntemlerinin bir turu.

Atölye deposunda bu rastgeleleştirmeler DR görev varyantlarında uygulanır (örneğin `Lerobot-So101-Teleop-Vials-To-Rack-DR`). Temel `Lerobot-So101-Teleop-Vials-To-Rack` görevi gök ışığını (sky light) kapalı tutar ve sabit turuncu robot rengi kullanır.

**Aydınlatma Rastgeleleştirmesi** (`randomize_sky_light`)

_Dosya: `sim_to_real_so101/source/sim_to_real_so101/mdp/resets.py`_

Her sıfırlamada ortamın kubbe ışığını (dome light) — pozlama, renk sıcaklığı ve HDRI dokusu — rastgeleleştirir:

```python
1def randomize_sky_light(
2    env,
3    env_ids: torch.Tensor | None,
4    exposure_range: tuple[float, float],
5    temperature_range: tuple[float, float],
6    textures_root: str,
7    asset_cfg: SceneEntityCfg = None,
8):
9    # Rastgele pozlama ve renk sıcaklığı örnekle
10    exposure = math_utils.sample_uniform(*exposure_range, (1,), device="cpu").item()
11    temperature = math_utils.sample_uniform(*temperature_range, (1,), device="cpu").item()
12
13    # Kullanılabilir seçeneklerden rastgele HDRI dokusu seç
14    textures = glob.glob(os.path.join(textures_root, "*.exr"))
15    texture = textures[torch.randint(0, len(textures), (1,)).item()]
16
17    # Kubbe ışığına uygula
18    prim.GetAttribute("inputs:exposure").Set(exposure)
19    prim.GetAttribute("inputs:colorTemperature").Set(temperature)
20    prim.GetAttribute("inputs:texture:file").Set(Sdf.AssetPath(texture))
```

**Kamera Pozu Rastgeleleştirmesi** (`randomize_camera_pose`)

_Dosya: `sim_to_real_so101/source/sim_to_real_so101/mdp/resets.py`_

Harici kameraya küçük konum ve dönüş ofsetleri ekler:

```python
1def randomize_camera_pose(
2    env,
3    env_ids: torch.Tensor | None,
4    prim_path_pattern: str,
5    pos_range: dict[str, tuple[float, float]] = None,  # örn. {"x": (-0.02, 0.02)}
6    rot_range: dict[str, tuple[float, float]] = None,  # örn. {"pitch": (-0.05, 0.05)}
7):
8    # USD varsayılan pozuna göre rastgele ofsetler örnekle
9    x = base_pos[0] + math_utils.sample_uniform(*pos_range.get("x", (0, 0)), (1,)).item()
10    y = base_pos[1] + math_utils.sample_uniform(*pos_range.get("y", (0, 0)), (1,)).item()
11    z = base_pos[2] + math_utils.sample_uniform(*pos_range.get("z", (0, 0)), (1,)).item()
12
13    # Temel kuaterniyonu rastgele delta rotasyonla birleştir
14    delta_quat = math_utils.quat_from_euler_xyz(roll, pitch, yaw)
15    final_quat = math_utils.quat_mul(base_quat_tensor, delta_quat)
```

**Nesne Pozu Rastgeleleştirmesi** (`reset_vials_rack`)

_Dosya: `sim_to_real_so101/source/sim_to_real_so101/mdp/resets.py`_

Tüp ve raf konumlarını rastgeleleştirir; tüpleri yuvalara önceden yerleştirme olasılığıyla:

```python
1def reset_vials_rack(
2    env,
3    env_ids: torch.Tensor,
4    vials: list[str],
5    rack: str,
6    rack_pose_range: dict[str, tuple[float, float]],
7    pose_range: dict[str, tuple[float, float]],
8    rack_placement_prob: float = 0.33,
9):
10    # Raf konumu ve yönelimini rastgeleleştir
11    new_rack_positions, new_rack_orientations = random_asset_pose(
12        env, env_ids, rack, rack_pose_range, {}
13    )
14
15    # Belirli bir olasılıkla rastgele bir yuvaya önceden bir tüp yerleştir
16    if torch.rand(1).item() < rack_placement_prob:
17        vial_idx = torch.randint(0, len(vial_objects), (1,)).item()
18        slot_idx = torch.randint(0, total_slots, (1,)).item()
19        # Yuva konumunu raf yerel çerçevesinden dünya çerçevesine dönüştür
20        slot_position, slot_orientation = math_utils.combine_frame_transforms(
21            new_rack_positions, new_rack_orientations,
22            slot_position_local, slot_orientation_local
23        )
24        vial.write_root_pose_to_sim(slot_pose, env_ids=env_ids)
```

**Bağlama: Olay Yapılandırması**

_Dosya: `sim_to_real_so101/source/sim_to_real_so101/tasks/task_env_cfg.py`_

Bu rastgeleleştirme fonksiyonları, ortam yapılandırmasında sıfırlama olayları olarak kaydedilir:

```python
1@configclass
2class TaskEventCfg(EventCfg):
3
4    reset_sky_light = EventTerm(
5        func=randomize_sky_light,
6        mode="reset",
7        params={
8            "exposure_range": (-4.0, 3.0),
9            "temperature_range": (2500.0, 9500.0),
10            "textures_root": f"{assets_path}/hdri",
11            "asset_cfg": SceneEntityCfg("sky_light"),
12        },
13    )
14
15    reset_camera_external_pose = EventTerm(
16        func=randomize_camera_pose,
17        mode="reset",
18        params={
19            "prim_path_pattern": "{ENV_REGEX_NS}/LightStudio/LightBox/camera_mount",
20            "pos_range": {"x": (-0.02, 0.02), "y": (-0.02, 0.02), "z": (-0.01, 0.01)},
21            "rot_range": {"roll": (-0.05, 0.05), "pitch": (-0.05, 0.05), "yaw": (-0.05, 0.05)},
22        },
23    )
```

Bir bölüm her sıfırlandığında Isaac Lab, `mode="reset"` olan her kayıtlı `EventTerm`'ü çağırır ve yeni bir rastgeleleştirme uygular.

Bu atölye taşıma (migration) için DR görev yapılandırmalarında mat yaw rastgeleleştirme aralığı `(-0.1, 0.1)`'e daraltılmıştır.

:::tip

Aralıkları veya hangi sıfırlamaların çalıştığını değiştirerek domain randomization'ı deneyebilirsiniz. `task_env_cfg.py`'de `TaskEventCfg` sınıfı her rastgeleleştirmeyi bir `params` sözlüğüne sahip bir `EventTerm` olarak kaydeder. Örneğin, varyasyonu genişletmek veya daraltmak için `reset_sky_light`'taki `exposure_range` veya `temperature_range`'i ya da `reset_camera_external_pose`'daki `pos_range` / `rot_range`'i ayarlayın. Bir `EventTerm`'ü yorum satırına almak o rastgeleleştirmeyi devre dışı bırakır.

Nerede düzenleme yaptığınıza dikkat edin — kapsayıcının içindeyseniz, değişiklikler yeniden başlatmada kaybolabilir.

:::

### Alt Görev Puanlaması

Simülasyonumuzun tüpün ne zaman kavrandığını ve ne zaman rafa yerleştirildiğini algılayabildiğine terminal çıktısında dikkat edin.

```bash
[GRASP] Vial grasped in env(s): [0]
[RELEASE] Vial released in env(s): [0]
[RACK] vial_2 placed in rack in env(s): [0]
```

Bu strateji, politika çıkarımına başladığımızda yararlıdır; çünkü politikanın ne kadar iyi performans gösterdiğini otomatik olarak puanlayabiliriz.

### Simülasyon ve Gerçek Teleoperasyon Karşılaştırması

| Özellik | Simülasyon | Gerçek Robot |
| --- | --- | --- |
| Domain randomization | Otomatik | Manuel, ortamda fiziksel olarak değiştirebileceklerinizle sınırlı |
| Veri toplama hızı | Daha hızlı sıfırlama, paralel ortamlar mümkün | Yalnızca gerçek zamanlı |
| Donanım aşınması | Yok | Zamanla birikir |
| Görsel çeşitlilik | Prosedürel üretim | Manuel varyasyon gerekir |
| Fizik doğruluğu | Yaklaşık | Temel doğruluk (ground truth) |

### Her Birini Ne Zaman Kullanmalı

**Şu durumlarda simülasyon kullanın:**

- DR ile başlangıç veri setini inşa ederken

- Donanım kısıtlı veya paylaşılmışken

- Görev veya politika varyasyonlarını hızlı ve güvenli şekilde keşfederken

- Gerçek ortam hazır, erişilebilir değilken veya geliştirme sırasında

**Şu durumlarda gerçek robot kullanın:**

- Yüksek kaliteli temel doğruluk (ground truth) toplarken

- Simülasyonda eğitilmiş politikaları doğrularken

- Gerçek dünya nüanslarını (sürtünme, aydınlatma) yakalarken

## Önemli Çıkarımlar

- Domain randomization, politikaları çeşitli koşullarda eğiterek sağlam hale getirir

- Teleoperasyon, insan uzmanlığını gösterim biçiminde yakalar

- Teleoperasyonu her zaman yalnızca kamera görünümlerini kullanarak yapın — gözlerinizi değil

- DR zenginleştirmesi, veri setinizi çeşitli koşullarla çoğaltır

- Gerçek gösterimler + DR zenginleştirmesi birleşimi güçlü bir temel çizgidir

## Sırada Ne Var?

Zenginleştirilmiş gösterimler toplandığına göre, politikaların nasıl eğitilip sunulduğunu öğrenin. Sonraki oturum [Isaac GR00T: Görü-Dil-Eylem Modelleri](/sim-to-real/veri-egitim-degerlendirme/isaac-groot) bölümünde, değerlendirmeler çalıştırmadan önce VLA'ları ve GR00T mimarisini inceleyeceksiniz.
