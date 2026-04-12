---
title: ROS 2 Kurulum (Windows)
sidebar_position: 3
---

### Ön Gereksinimler

Windows'ta ROS 2 kurulumuna başlamadan önce şu yazılımları yüklemeniz gerekir:

### 1. Visual Studio 2019 veya daha yenisi

- Visual Studio Community Edition (ücretsiz) yeterlidir
- Kurulum sırasında "Desktop development with C++" iş yükünü seçin

### 2. Chocolatey (Paket Yöneticisi)

PowerShell'i yönetici olarak açın ve şu komutu çalıştırın:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Adım 1: Gerekli Araçları Yükleme

Command Prompt veya PowerShell'i yönetici olarak açın ve şu komutu çalıştırın:

```
choco install -y python cmake git
```

### Adım 2: ROS 2 Binary'lerini İndirme

1. [ROS 2 Humble Windows release sayfasına](https://github.com/ros2/ros2/releases) gidin
2. En son `ros2-humble-*-windows-release-amd64.zip` dosyasını indirin
3. İndirilen ZIP dosyasını `C:\dev\ros2_humble` gibi bir konuma çıkarın

### Adım 3: Bağımlılıkları Yükleme

`C:\dev\ros2_humble` dizinine gidin ve şu komutu çalıştırın:

```
rosdep install --from-paths src --ignore-src -r -y
```

### Adım 4: Ortam Ayarları

ROS 2'yi kullanmadan önce her terminal oturumunda ortam ayarlarını yapın:

```
C:\dev\ros2_humble\local_setup.bat
```

### Adım 5: Kurulumu Test Etme

**5.1. İlk Command Prompt'ta:**

```
call C:\dev\ros2_humble\local_setup.bat
ros2 run demo_nodes_cpp talker
```

**5.2. İkinci Command Prompt'ta:**

```
call C:\dev\ros2_humble\local_setup.bat
ros2 run demo_nodes_py listener
```

Talker'ın mesaj yayınladığını ve Listener'ın bu mesajları aldığını görmelisiniz!

:::note **Not:** Windows'ta güvenlik duvarı uyarısı alabilirsiniz. ROS 2'nin ağ erişimine izin vermeniz gerekir. :::
