---
title: 'Isaac GR00T: Görü-Dil-Eylem Modelleri'
sidebar_position: 2
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Isaac GR00T: Görü-Dil-Eylem Modelleri'
needsTranslation: true
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [10-groot.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/10-groot.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

What Do I Need for This Module?

Mostly theory with code examples. No additional hardware is required beyond a computer with the `real-robot` container built.

In this session, we'll explore the VLA model called NVIDIA Isaac GR00T, how it works, and see examples of it in action.

## Learning Objectives

By the end of this session, you'll be able to:

- **Explain** what vision-language-action models are and why they're powerful

- **Describe** the GR00T architecture and its components

- **Understand** how VLAs differ from traditional robot learning approaches

## What Is GR00T?

NVIDIA Isaac GR00T is a research initiative and development platform for developing general-purpose robot foundation models and data pipelines to accelerate humanoid robotics research and development.

It provides:

- **Pre-trained visual understanding** from large-scale data

- **Language-conditioned behavior** for flexible task specification

- **Action generation** suitable for real-time robot control

In this course, we'll use GR00T N1.6 models post-trained for the SO-101 robot.

:::note

**Training time in this course**

GR00T post-training requires several hours on GPU hardware—longer than this course allows in a single sitting. We have pre-trained a set of policies on various datasets that you will use throughout the day. This lets you focus on understanding the workflow, evaluating results, and iterating on strategies rather than waiting for training jobs to complete.

The commands and scripts shown here are the same ones used to produce those policies, so you can replicate the process on your own hardware after you finish this learning path.

:::

### What's New in GR00T N1.6

GR00T N1.6 represents a significant upgrade over N1.5, with improvements in both model architecture and data.

**Architectural Changes:**

| Component

|

N1.5

|

N1.6

|  |
|  |

|

Base VLM

|

Standard

|

Cosmos-Reason-2B variant with flexible resolution

| |

DiT layers

|

16

|

32 (2x larger)

| |

Post-VLM adapter

|

4-layer transformer

|

Removed; unfreezes top 4 VLM layers

| |

Action format

|

Absolute joint angles/EEF

|

State-relative action chunks

|

### Case Study: Zero-Shot Transfer Improvement

GR00T has already released several iterations, each with significant improvements. Let's look at an SO-101 case study as an example of how N1.6 translates to measurable real-world gains.

**Task**: Pick vials from a mat and place them on a rack (sim-only training data)

_\[Görsel (kaynakta eksik): N1.5 vs N1.6 zero-shot transfer comparison\]_

\[Placeholder: Side-by-side comparison of N1.5 and N1.6 attempting the mat-to-rack task\]

This demonstrates how foundation model improvements can reduce the sim-to-real gap even without task-specific real data.

## What Is a Vision-Language-Action Model?

**Vision-Language-Action (VLA) models** are foundation models that take visual input and language instructions and output low-level or mid-level actions for an embodied agent, such as a robot.

```
Input: Camera image (1 or more) + "Pick up the red vial and place it in the rack"
Output: Sequence of joint positions/velocities to execute the task
```

### Training Stages

VLAs are typically trained in stages:

1.  **Large-scale pretraining**: Internet-scale multimodal data (images, text, video) builds general visual and language understanding

2.  **Supervised imitation/behavior cloning**: Robot demonstrations teach the model to map observations to actions

3.  **Optional reinforcement learning**: Fine-tunes behavior through real-world interaction and feedback

### Architecture Overview

![VLA Model Architecture](/img/sim-to-real/10-isaac-groot/gr00t-architecture.png)

### Key Components

**Vision Encoder**: Processes camera images into rich feature representations

- Pre-trained on large image datasets (ImageNet, etc.)

- Understands objects, spatial relationships, affordances

**Language Encoder**: Processes task instructions

- Maps natural language to task embeddings

- Enables zero-shot generalization to new task descriptions

**Cross-Modal Fusion**: Combines vision and language

- Attention mechanisms to relate visual features to language

- Grounds language concepts in visual observations

**Action Decoder**: Generates robot actions

- Conditioned on fused visual-language features

- Outputs appropriate action representation (joint positions, velocities, etc.)

## Why VLAs Are Powerful

### 1\. Natural Task Specification

Instead of programming specific behaviors, describe tasks in plain language:

```
"Pick up the blue vial closest to the robot"
"Place the vial in the empty slot on the left"
"Move the vial from the table to the rack"
```

### 2\. Visual Generalization

Pre-trained vision encoders provide:

- Robustness to lighting changes

- Recognition of object categories

- Understanding of spatial relationships

- Transfer across visual domains

### 3\. Transfer Learning

Pre-trained components accelerate learning:

- Don't need to learn vision from scratch

- Language understanding comes "for free"

- Focus training on action generation

### 4\. Multimodal Reasoning

Combine visual and semantic understanding:

- "The red one" → Find red objects in image

- "The closest vial" → Spatial reasoning

- "Place it carefully" → Adjust motion dynamics

## Action Space and Control

### Action Representations

GR00T supports several action representations:

**Joint Position Actions**

- Direct control over robot configuration

- Requires learning full arm coordination

**End-Effector Actions**

- Inverse kinematics computes joint commands

- Abstracts away arm configuration

**Action Chunking**

- Predict multiple future actions at once

- Smoother execution, temporal consistency

In this course, we use **joint position actions with action chunking**.

### Action Horizon Parameter

The `action_horizon` parameter controls how many future actions the model predicts at once. This is a critical hyperparameter that affects both training and deployment.

**What it controls:**

- **Training**: The model learns to predict `action_horizon` timesteps into the future

- **Inference**: The model outputs a chunk of `action_horizon` actions per forward pass

**Trade-offs:**

| Horizon

|

Pros

|

Cons

|  |
|  |

|

Short (4-8)

|

More reactive, corrects quickly

|

Choppy motion, frequent replanning

| |

Medium (16)

|

Balanced smoothness and reactivity

|

Good default for most tasks

| |

Long (32+)

|

Very smooth trajectories

|

Slow to correct errors, may overshoot

|

:::tip

Start with the default `action_horizon=16`. Only adjust if you observe specific issues: reduce if the robot overshoots targets, increase if motion is too jerky.

:::

## Example: GR00T in Action

### Post-Training GR00T

```bash
set -x -e

export NUM_GPUS=1

DATASET_PATH= #set path to your model

# torchrun --nproc_per_node=$NUM_GPUS --master_port=29500 \
CUDA_VISIBLE_DEVICES=0 python \
    gr00t/experiment/launch_finetune.py \
    --base_model_path nvidia/GR00T-N1.6-3B \
    --dataset_path $DATASET_PATH \
    --modality_config_path examples/SO100/so100_config.py \
    --embodiment_tag NEW_EMBODIMENT \
    --num_gpus $NUM_GPUS \
    --output_dir /tmp/so100_finetune \
    --save_steps 1000 \
    --save_total_limit 5 \
    --max_steps 10000 \
    --warmup_ratio 0.05 \
    --weight_decay 1e-5 \
    --learning_rate 1e-4 \
    --use_wandb \
    --global_batch_size 32 \
    --color_jitter_params brightness 0.3 contrast 0.4 saturation 0.5 hue 0.08 \
    --dataloader_num_workers 4
```

## Practical Considerations

### Data Requirements

VLA training typically requires:

- **50-200 demonstrations** per task for basic competence

- **Language annotations** describing each demonstration

- **Diverse conditions** to enable generalization

:::tip

Quality matters more than quantity. 50 high-quality, diverse demonstrations often outperform 500 redundant ones.

:::

### Compute Requirements

GR00T training benefits from:

- **GPU memory**: 24GB+ for full model training

- **Training time**: 2-8 hours depending on dataset size

- **Inference**: Real-time on modern GPUs (RTX 3080+)

## Key Takeaways

- VLA models combine vision, language, and action in a unified architecture

- GR00T provides pre-trained components for accelerated learning

- Language conditioning enables flexible task specification

- Action chunking provides smooth, temporally consistent control

- Pre-trained vision encoders enable visual generalization

## Resources

- [NVIDIA Isaac GR00T GitHub](https://github.com/NVIDIA/Isaac-GR00T) — Source code, model weights, and documentation

- [Cosmos Cookbook](https://nvidia-cosmos.github.io/cosmos-cookbook/) — Recipes and examples for Cosmos world foundation models

## What's Next?

Now that you understand VLAs conceptually, run policy evaluation in simulation. In the next session, [Sim Evaluation](/sim-to-real/veri-egitim-degerlendirme/sim-degerlendirme), you'll compare policies in sim using open-loop and closed-loop evaluation.

On this page
