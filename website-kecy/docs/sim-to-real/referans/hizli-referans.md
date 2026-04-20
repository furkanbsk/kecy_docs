---
title: 'Hızlı Referans'
sidebar_position: 1
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Hızlı Referans'
needsTranslation: true
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [quick_reference.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/quick_reference.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

Quick commands for common tasks. For detailed explanations, see [Calibrating the SO-101](/sim-to-real/robot-laboratuvari/kalibrasyon) and [Operating the SO-101](/sim-to-real/robot-laboratuvari/calistirma).

## Simulation (teleop and eval) — Docker

Launch the Isaac Sim container for sim teleop and sim policy evaluation:

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

Run this container for the client/server GR00T inference workflow.

```bash
xhost +
docker run -it --rm --name real-robot --network host --privileged --gpus all \
-e DISPLAY \
-v /dev:/dev \
-v /run/udev:/run/udev:ro \
-v $HOME/.Xauthority:/root/.Xauthority \
-v /tmp/.X11-unix:/tmp/.X11-unix \
-v ~/.cache/huggingface/lerobot/calibration:/root/.cache/huggingface/lerobot/calibration \
-v ~/sim2real/models:/workspace/models \
-v ~/sim2real/Sim-to-Real-SO-101-Workshop/docker/env:/root/env \
-v ~/sim2real/Sim-to-Real-SO-101-Workshop/docker/real/scripts:/Isaac-GR00T/gr00t/eval/real_robot/SO100 \
real-robot \
/bin/bash
```

## Find Robot Ports

Inside the `teleop-docker` container:

```bash
lerobot-find-port
```

When prompted, **disconnect** USB cable and **press Enter**. The tool reports the port (e.g., `/dev/ttyACM0`).

You can either write these down to use for future commands, or assign them to environment variables in your terminal.

```bash
# Save to environment variables
setenv ROBOT_PORT=/dev/ttyACM0
setenv TELEOP_PORT=/dev/ttyACM1

# Set robot IDs (based on your station label)
setenv ROBOT_ID=orange_robot
setenv TELEOP_ID=orange_teleop
```

## Find Cameras

Inside the `teleop-docker` container:

```bash
lerobot-find-cameras opencv
```

Review captured images in `./output/captured_images` to identify gripper vs. external camera indices.

Similar to the robot ports, you can save these to environment variables in your terminal or enter them manually into commands.

```bash
# Save to environment variables
setenv CAMERA_GRIPPER=0
setenv CAMERA_EXTERNAL=2
```

## Calibrate Leader Arm (Teleop)

Inside `teleop-docker` container:

```bash
lerobot-calibrate \
--teleop.type=so101_leader \
--teleop.port=$TELEOP_PORT \
--teleop.id=$TELEOP_ID
```

Follow prompts to move joints to middle-of-range, then through full range of motion.

## Calibrate Follower Arm (Robot)

Inside `teleop-docker` container:

```bash
lerobot-calibrate \
--robot.type=so101_follower \
--robot.port=$ROBOT_PORT \
--robot.id=$ROBOT_ID
```

## Teleoperation of Real Robot

Inside `teleop-docker` container:

```bash
lerobot-teleoperate \
--robot.type=so101_follower \
--robot.port=$ROBOT_PORT \
--robot.id=$ROBOT_ID \
--teleop.type=so101_leader \
--teleop.port=$TELEOP_PORT \
--teleop.id=$TELEOP_ID
```

## Common Issues

See [Troubleshooting Guide](/sim-to-real/referans/sorun-giderme) for detailed solutions.

| Symptom               | Likely Cause                             |
| --------------------- | ---------------------------------------- |
| All motors missing    | Power not connected                      |
| One motor missing     | Loose motor cable, or just needs restart |
| `Torque_Enable` error | Power cycle robot                        |
| Camera index changed  | Re-run `lerobot-find-cameras`            |
| Port not found        | Check USB, run `lerobot-find-port`       |
