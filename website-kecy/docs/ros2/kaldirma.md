---
title: Kaldırma (Uninstall)
sidebar_position: 6
---

ROS 2'yi kaldırmak için:

### Ubuntu

```bash
# ROS 2 paketlerini kaldır
sudo apt remove ~nros-humble-* && sudo apt autoremove

# ROS 2 deposunu da kaldır (opsiyonel)
sudo apt remove ros2-apt-source
sudo apt update
sudo apt autoremove
```

### Windows

1. `C:\dev\ros2_humble` dizinini silin
2. Ortam değişkenlerinden ROS 2 ile ilgili eklediğiniz değişiklikleri kaldırın
