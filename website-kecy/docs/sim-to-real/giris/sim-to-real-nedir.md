---
title: 'Sim-to-Real Nedir?'
sidebar_position: 3
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Sim-to-Real Nedir?'
needsTranslation: true
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [03-sim-to-real.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/03-sim-to-real.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

What Do I Need for This Module?

Nothing — this module is theory-only.

## Learning Objectives

By the end of this session, you'll be able to:

- **Define** sim-to-real transfer and its goals

- **Identify** the four major categories of sim-to-real gaps

- **Explain** why transfer is difficult even with high-fidelity simulation

## Sim-to-Real Defined

**Sim-to-real** refers to the process of training a policy in simulation and deploying it on real hardware. The goal is a policy that performs well in the real world despite being trained entirely (or primarily) in simulation.

[![Sim-to-Real](/img/sim-to-real/03-sim-to-real-nedir/sim-and-real.png)](/img/sim-to-real/03-sim-to-real-nedir/sim-and-real.png)

Sim-to-Real with Unitree H1

## The Sim-to-Real Gap

The **sim-to-real gap** is the performance difference between simulation and reality. A policy achieving high success rates in simulation may perform significantly worse on real hardware.

:::warning

The sim-to-real gap is often larger than expected. And while colloquially we may discuss "the gap" as if it's a single entity, the gap is a complex combination of gaps in sensing, actuation, physics, and modeling.

Never assume a policy will "just work" on real hardware without systematic testing and iteration.

:::

## Sources of the Gap

### Sensing Gaps

- Camera models lack real sensor noise, blur, and distortion

- Depth sensors have idealized measurements without artifacts

- Simulated lighting differs from real lighting conditions

### Actuation Gaps

- Motor models lack friction, backlash, and thermal effects

- Joint dynamics are simplified

- Control loop timing differs between simulation and hardware

### Physics Gaps

- Contact dynamics (friction, restitution) are approximations

- Deformable objects are difficult to simulate accurately

- Fluid dynamics and granular materials are computationally expensive

### Modeling Gaps

- CAD models differ from as-built hardware

- Mass and inertia properties are estimates

## What Makes Transfer Hard?

The sim-to-real gap isn't just about simulation fidelity. Even with perfect simulation, transfer is challenging because:

1.  **Distribution shift**: Real-world conditions vary from training

2.  **Compounding errors**: Small perception errors lead to large action errors

3.  **Unmodeled dynamics**: Real physics has effects that may not be represented in simulation

4.  **Temporal differences**: Real-time constraints affect behavior

## Summary

| Gap Category

|

Examples

|  |
|  |

|

Sensing

|

Camera noise, lighting, depth artifacts

| |

Actuation

|

Friction, backlash, thermal effects

| |

Physics

|

Contact dynamics, deformables

| |

Modeling

|

CAD errors, mass/inertia estimates

|

Understanding these gaps is essential—throughout this learning path, you'll learn strategies to address each category.

## What's Next?

Now that you understand the sim-to-real challenge, let's learn about the tools we'll use. In the next session, [LeRobot: Background and Community](/sim-to-real/giris/lerobot), you'll learn about the Hugging Face ecosystem for robotics.

On this page
