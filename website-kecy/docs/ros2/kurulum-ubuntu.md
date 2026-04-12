---
title: ROS 2 Kurulum (Ubuntu)
sidebar_position: 2
---

## Kurulum: Ubuntu (Önerilen)

### Adım 1: Sistem Dilini Ayarlama

Sisteminizin UTF-8 destekli bir dil ayarına sahip olduğundan emin olun:

```bash
# Mevcut dil ayarlarını kontrol et
locale
# Gerekli paketleri yükle
sudo apt update && sudo apt install locales
# İngilizce dil desteğini oluştur
sudo locale-gen en_US en_US.UTF-8
# Sistem dilini güncelle
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
# Dil ayarını terminalde aktif et
export LANG=en_US.UTF-8
# Tekrar kontrol et
locale
```

### Adım 2: Kaynak Depolarını Ekleme

ROS 2 paketlerini yüklemek için Ubuntu'ya ROS 2 apt deposunu eklemeniz gerekiyor.

- **2.1. Universe deposunu etkinleştirin:**

```bash
sudo apt install software-properties-common
sudo add-apt-repository universe
```

- **2.2. ROS 2 GPG anahtarını ekleyin:**

```bash
sudo apt update && sudo apt install curl -y
export ROS_APT_SOURCE_VERSION=$(curl -s https://api.github.com/repos/ros-infrastructure/ros-apt-source/releases/latest | grep -F "tag_name" | awk -F\" '{print $4}')
curl -L -o /tmp/ros2-apt-source.deb "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}})_all.deb"
sudo dpkg -i /tmp/ros2-apt-source.deb
```

### Adım 3: ROS 2 Paketlerini Yükleme

- **3.1. Önce paket listesini güncelleyin:**

```bash
sudo apt update
sudo apt upgrade
```

> ⚠️ **Önemli Uyarı**: Ubuntu 22.04'te, ROS 2 bağımlılıklarını yüklemeden önce sisteminizi güncellemeniz kritik öneme sahiptir. Özellikle `systemd` ve `udev` paketlerinin güncel olması gerekir. Taze kurulmuş bir sistemde güncelleme yapmadan ROS 2 kurarsanız, kritik sistem paketleri kaldırılabilir!

- **3.2. ROS 2 Humble'ı yükleyin:**Üç farklı kurulum seçeneğiniz var:
- **Seçenek A: Desktop Kurulum (Önerilen)**ROS 2, RViz, demolar ve tutorial'lar dahil:
  ```bash
  sudo apt install ros-humble-desktop
  ```
- **Seçenek B: ROS-Base Kurulum (Minimal)**Sadece iletişim kütüphaneleri, mesaj paketleri ve komut satırı araçları (GUI araçları yok):
  ```bash
  sudo apt install ros-humble-ros-base
  ```
- **Seçenek C: Geliştirme Araçları**ROS 2 paketleri derlemek için derleyiciler ve araçlar:
  ```bash
  sudo apt install ros-dev-tools
  ```

> 💡 **Öneri**: İlk defa ROS 2 öğreniyorsanız, "Desktop Kurulum" seçeneğini tercih edin. RViz gibi görselleştirme araçları öğrenme sürecini kolaylaştırır.

### Adım 4: Ortam Ayarları

ROS 2'yi kullanmaya başlamadan önce, her yeni terminal oturumunda ortam değişkenlerini ayarlamanız gerekir.

- **4.1. Setup script'ini çalıştırın:**

```bash
source /opt/ros/humble/setup.bash
```

- **4.2. Otomatik yükleme için `.bashrc` dosyasına ekleyin:**Her terminal açtığınızda manuel olarak kaynak almak yerine, bunu otomatik hale getirin:
  ```bash
  echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
  source ~/.bashrc
  ```

> **Not**: Eğer `zsh` veya başka bir shell kullanıyorsanız, `.bashrc` yerine ilgili yapılandırma dosyasını (örneğin `.zshrc`) düzenleyin ve `setup.bash` yerine `setup.zsh` kullanın.

### Adım 5: Kurulumu Test Etme

Kurulumun başarılı olup olmadığını test edelim!

- **5.1. İlk terminalde Talker node'unu çalıştırın:**

```bash
source /opt/ros/humble/setup.bash
ros2 run demo_nodes_cpp talker
```

Şunu görmelisiniz:

```
[INFO] [talker]: Publishing: 'Hello World: 1'
[INFO] [talker]: Publishing: 'Hello World: 2'
[INFO] [talker]: Publishing: 'Hello World: 3'
...
```

- **5.2. İkinci bir terminal açın ve Listener node'unu çalıştırın:**

```bash
source /opt/ros/humble/setup.bash
ros2 run demo_nodes_py listener
```

Şunu görmelisiniz:

```
[INFO] [listener]: I heard: [Hello World: 1]
[INFO] [listener]: I heard: [Hello World: 2]
[INFO] [listener]: I heard: [Hello World: 3]
...
```

🎉 **Tebrikler!** Hem C++ hem de Python API'lerinin düzgün çalıştığını doğruladınız. ROS 2 başarıyla kuruldu!
