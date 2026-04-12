---
title: Yararlı ROS 2 Komutları
sidebar_position: 5
---

Başlamak için temel ROS 2 komutları:

### Node Yönetimi

```bash
# Çalışan node'ları listele
ros2 node list

# Node hakkında bilgi al
ros2 node info /node_name

# Node çalıştır
ros2 run
```

### Topic Yönetimi

```bash
# Topic'leri listele
ros2 topic list

# Topic'teki mesajları dinle
ros2 topic echo /topic_name

# Topic hakkında bilgi al
ros2 topic info /topic_name

# Topic'e mesaj yayınla
ros2 topic pub /topic_name  "data"
```

### Service Yönetimi

```bash
# Servisleri listele
ros2 service list

# Servis hakkında bilgi al
ros2 service type /service_name

# Servis çağır
ros2 service call /service_name  "request"
```

### Package Yönetimi

```bash
# Yüklü paketleri listele
ros2 pkg list

# Paketin konumunu bul
ros2 pkg prefix

# Paket oluştur
ros2 pkg create
```
