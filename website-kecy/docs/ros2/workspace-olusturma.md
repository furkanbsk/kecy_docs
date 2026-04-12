---
title: ROS 2 Workspace Oluşturma
sidebar_position: 4
---

```bash
# Ana dizinde workspace klasörü oluştur
mkdir -p ~/ros2_ws/src
# Workspace dizinine git
cd ~/ros2_ws
# Workspace'i derle (henüz paket yok, bu normaldir)
colcon build
# Yeni workspace'i kaynak al
source ~/ros2_ws/install/setup.bash
```

:::tip **İpucu**: Her yeni terminal açtığınızda hem ROS 2 kurulumunu hem de workspace'inizi kaynak almanız gerekir: :::

```bash
source /opt/ros/humble/setup.bash
source ~/ros2_ws/install/setup.bash
```

---

## Sıkça Karşılaşılan Sorunlar ve Çözümler

### Sorun 1: "bash: ros2: command not found"

**Çözüm**: Setup script'ini kaynak almayı unutmuşsunuz.

```bash
source /opt/ros/humble/setup.bash
```

### Sorun 2: Node'lar birbirini görmüyor / Topic'lere abone olamıyor

**Çözüm**: Muhtemelen farklı ROS_DOMAIN_ID kullanıyorsunuz. Aynı domain'de olduğunuzdan emin olun:

```bash
# Domain ID'yi kontrol et
echo $ROS_DOMAIN_ID
# Varsayılan domain (0) kullan
unset ROS_DOMAIN_ID
# veya belirli bir domain ayarla
export ROS_DOMAIN_ID=42
```

### Sorun 3: Paket bulunamıyor hatası

**Çözüm**: Workspace'inizi derledikten sonra kaynak almayı unutmuşsunuz:

```bash
cd ~/ros2_ws
colcon build
source install/setup.bash
```

### Sorun 4: Permission denied hatası (Ubuntu)

**Çözüm**: Bazı dosyalara root izni gerekebilir:

```bash
sudo chown -R $USER:$USER ~/ros2_ws
```
