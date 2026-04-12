---
title: ROS 2 Nedir?
sidebar_position: 1
---

**Robot Operating System (ROS)**, robot uygulamaları oluşturmak için geliştirilmiş bir yazılım kütüphaneleri ve araçlar setidir. Sürücülerden en son algoritmalara, güçlü geliştirici araçlarından açık kaynak topluluğuna kadar robotik projeniz için ihtiyacınız olan her şeyi içerir.

ROS ilk olarak 2007 yılında başlatıldı. O zamandan bu yana, robotik ve ROS topluluğunda çok şey değişti. ROS 2 projesi, bu değişikliklere uyum sağlamak, ROS 1'in harika yönlerinden yararlanmak ve olmayan yönleri iyileştirmek amacıyla geliştirildi.

---

## Neden ROS 2?

### ROS 1'den ROS 2'ye Geçiş Nedenleri

**1. Modern İletişim Altyapısı**

- ROS 2, DDS (Data Distribution Service) adlı endüstri standardı bir middleware kullanır
- Daha güvenilir ve ölçeklenebilir ağ iletişimi
- Gerçek zamanlı sistemler için daha iyi destek

**2. Üretim Ortamları İçin Hazır**

- Endüstriyel robotlar için güvenlik özellikleri
- Daha iyi performans ve kaynak yönetimi
- Sertifikalı güvenlik mekanizmaları

**3. Çoklu Platform Desteği**

- Linux (Ubuntu, RHEL, Fedora)
- Windows 10/11
- macOS
- Gömülü sistemler (Raspberry Pi, NVIDIA Jetson)

**4. Gerçek Zamanlı Destek**

- Deterministik davranış
- Öncelik tabanlı görev yönetimi
- Düşük gecikme süresi

---

## ROS 2 Temel Kavramları

ROS 2 ile çalışmaya başlamadan önce birkaç temel kavramı anlamak önemlidir:

### Node (Düğüm)

Robotik sisteminizdeki tek bir işlevi yerine getiren bağımsız bir programdır. Örneğin, bir node kamera görüntülerini işleyebilir, başka bir node motor kontrolünü sağlayabilir.

### Topic (Konu)

Node'ların birbiriyle iletişim kurduğu isimlendirilmiş veri kanallarıdır. Publisher (yayıncı) node'lar veri gönderir, subscriber (abone) node'lar bu verileri alır.

### Service (Servis)

Talep-yanıt modelinde çalışan senkron iletişim mekanizmasıdır. Bir node servis talep eder, diğer node yanıt verir.

### Action (Aksiyon)

Uzun süren görevler için asenkron iletişim mekanizmasıdır. Geri bildirim, iptal etme ve durum güncelleme özellikleri sunar.

### Package (Paket)

ROS 2'de kod organizasyonunun temel birimidir. Node'lar, kütüphaneler, konfigürasyon dosyaları ve diğer kaynakları içerir.

---

## ROS 2 Humble Hawksbill Hakkında

**Humble Hawksbill**, Mayıs 2022'de yayınlanan ROS 2'nin uzun dönem destekli (LTS - Long Term Support) sürümüdür.

### Önemli Özellikler

- **Destek Süresi**: Mayıs 2027'ye kadar (5 yıl)
- **Hedef Platformlar**: Ubuntu 22.04 (Jammy Jellyfish)
- **Kararlılık**: Üretim ortamları için önerilen sürüm
- **Topluluk Desteği**: Geniş dokümantasyon ve topluluk kaynakları

### Humble'ı Ne Zaman Kullanmalı?

- Uzun dönem projeler için
- Üretim ortamlarında
- Kararlılık öncelikli uygulamalarda
- Endüstriyel robotik projelerde

> Not: Eğer en son özellikleri denemek istiyorsanız, Rolling Ridley dağıtımına bakabilirsiniz. Ancak başlangıç için Humble en iyi seçimdir.

---

## Sistem Gereksinimleri

### Ubuntu Kurulumu İçin

- **İşletim Sistemi**: Ubuntu 22.04 (Jammy Jellyfish)
- **Mimari**: amd64 (x86_64) veya arm64 (aarch64)
- **Disk Alanı**: Minimum 5 GB (Desktop kurulum için 10 GB önerilir)
- **RAM**: Minimum 2 GB (4 GB önerilir)

### Windows Kurulumu İçin

- **İşletim Sistemi**: Windows 10 veya Windows 11
- **Mimari**: 64-bit (amd64)
- **Gerekli Yazılımlar**: Visual Studio 2019 veya daha yenisi
- **Disk Alanı**: Minimum 10 GB
- **RAM**: Minimum 4 GB

---

##

## Ek Kaynaklar

### Resmi Dokümantasyon

- [ROS 2 Humble Documentation](https://docs.ros.org/en/humble/)
- [ROS 2 Concepts](https://docs.ros.org/en/humble/Concepts.html)
- [ROS 2 Tutorials](https://docs.ros.org/en/humble/Tutorials.html)

### Topluluk ve Destek

- [ROS Discourse Forum](https://discourse.ros.org/)
- [Robotics Stack Exchange](https://robotics.stackexchange.com/)
- [ROS Discord Kanalı](https://discord.com/servers/open-robotics-1077825543698927656)

### Videolar ve Dersler

- [Official ROS Vimeo Channel](https://vimeo.com/osrfoundation)
- [ROSCon Sunumları](https://roscon.ros.org/)

---

:::tip **İpucu:** ROS 2 öğrenirken takıldığınızda, resmi dokümantasyon ve KecyAI en iyi kaynaklarınızdır. Topluluğa soru sormaktan çekinmeyin! :::

**Şimdi robotik dünyasına adım atma zamanı! İyi öğrenmeler! 🤖**
