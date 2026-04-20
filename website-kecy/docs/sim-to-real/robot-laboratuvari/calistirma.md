---
title: "SO-101'i Çalıştırma"
sidebar_position: 4
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: SO-101''i Çalıştırma'
needsTranslation: true
---

:::info[Kaynak]

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [08-operating-so101.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/08-operating-so101.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

### What Do I Need for This Module?

Hands-on. You'll need the calibrated SO-101 robot, teleop arm, both cameras, and the Docker container running from [Calibrating the SO-101](/sim-to-real/robot-laboratuvari/kalibrasyon).

In this session, you'll teleoperate the SO-101 using the leader arm, configure cameras, and run teleoperation with live camera views in Rerun.

This will give you hands-on practice operating the robot in general, but also with this specific task.

Make sure you have completed [Calibrating the SO-101](/sim-to-real/robot-laboratuvari/kalibrasyon) first. You'll need a calibrated robot and the Docker container running with environment variables set.

:::tip

If you encounter hardware issues during this session, see the [Troubleshooting Guide](/sim-to-real/referans/sorun-giderme) for solutions to common problems.

:::

## Learning Objectives

By the end of this session, you'll be able to:

- **Teleoperate** the robot using the teleoperation arm

- **Configure** cameras so you can teleoperate using the same camera views our AI models will use, and Rerun for debugging

## Teleoperation

Now that both arms are calibrated, we're ready to begin teleoperating!

1.  **Begin** the teleoperation process. It's a good idea to make sure both arms are in similar poses, because the robot will move to match the teleop arm.

```bash
lerobot-teleoperate \
--robot.type=so101_follower \
--robot.port=$ROBOT_PORT \
--robot.id=$ROBOT_ID \
--teleop.type=so101_leader \
--teleop.port=$TELEOP_PORT \
--teleop.id=$TELEOP_ID
```

2.  **Move** the teleop arm and watch how the robot arm moves to match.

3.  **Try** to pick up a vial and place it in the rack!

4.  **Press Ctrl+C** in the terminal to stop the teleoperation.

## Camera Setup

The teleoperation you just did used an incredible vision system: your human perception system.

Our AI model will not have this information, so we need to use the cameras instead when we collect demonstrations.

Each robot workspace today is equipped with **two cameras**:

- **Gripper camera**: Mounted on the robot's wrist/gripper

- **External camera**: Stationary camera viewing the workspace from above or the side

And because the policy works off of these visual images, camera assignment is critical to policy performance. If they are swapped (gripper cam thinks it's the external cam, or vice versa), the policy will fail.

### Why Two Cameras?

The gripper camera becomes occluded after the robot grasps an object like a vial.

The external camera provides continuous visibility of the workspace throughout the entire manipulation sequence, ensuring the policy always has usable visual input even when the gripper camera is blocked.

### Finding Available Cameras

Similar to the port finder, LeRobot has a tool for identifying available cameras.

We need to determine the id of both the camera on the robot, and the external stationary camera.

1.  **Make sure** the two cameras' USB cables are plugged into your computer.

2.  **Run** the command:

```bash
lerobot-find-cameras opencv
```

This command captures an image from each available camera, allowing you to determine the index of each camera.

Example output:

```
Searching for cameras...
Found 3 cameras:
Camera 0: /dev/video0 (USB 2.0 Camera)
Camera 1: /dev/video2 (USB 2.0 Camera)
Camera 2: /dev/video4 (Integrated Webcam)

Capturing test frames...
Camera 0: 640x480 @ 30fps - saved to ./camera_test/cam_0.jpg
Camera 1: 640x480 @ 30fps - saved to ./camera_test/cam_1.jpg
Camera 2: 1280x720 @ 30fps - saved to ./camera_test/cam_2.jpg
```

3.  **Open** a new terminal outside of the docker container.

4.  **Navigate** to the task repository:

```bash
cd ~/Sim-to-Real-SO-101-Workshop
```

5.  **Run** this command to open the folder with the images:

```
open ./outputs/captured_images
```

6.  **Open** each image, and **note** which index correlates to wrist and stationary camera. For instance `opencv__dev_video0.png` indicates an index of `0`.

7.  **Return** to the terminal inside the `teleop-docker` container.

8.  **Assign** these to environment variables in your terminal - make sure to update the values to match what you saw in the last command.

```bash
setenv CAMERA_GRIPPER=4 # make sure to update to your values
setenv CAMERA_EXTERNAL=6 # make sure to update to your values
```

:::info

**Camera Index Warning**

Camera indices may change any time cameras are unplugged or replugged into your computer. Always verify camera assignments before collecting data or running policies.

If you see unexpected behavior during teleoperation or policy execution, camera index reassignment is a common cause.

:::

:::tip

Having camera or hardware issues? See the [Troubleshooting Guide](/sim-to-real/referans/sorun-giderme), also available on the sidebar, for common solutions and detailed diagnostic steps.

See the [Quick Reference](/sim-to-real/referans/hizli-referans) for common commands.

:::

:::note

Notice what makes this task challenging:

- the gripper camera becomes occluded after grasp

- the rack requires precise placement

- lack of depth data makes rack alignment difficult

:::

## Run Teleoperation With Cameras

Now that we have the camera indices, we can run teleoperation with the real cameras in your workspace.

1.  **Run** the command:

```bash
lerobot-teleoperate \
--robot.type=so101_follower \
--robot.port=$ROBOT_PORT \
--robot.id=$ROBOT_ID \
--teleop.type=so101_leader \
--teleop.port=$TELEOP_PORT \
--teleop.id=$TELEOP_ID \
--display_data=true \
--robot.cameras='{
"wrist": {
  "type": "opencv",
  "index_or_path": '"$CAMERA_GRIPPER"',
  "width": 640,
  "height": 480,
  "fps": 30
},
"front": {
  "type": "opencv",
  "index_or_path": '"$CAMERA_EXTERNAL"',
  "width": 640,
  "height": 480,
  "fps": 30
}
}'
```

![Rerun Viewer Teleop Example](/img/sim-to-real/08-calistirma/rerun_viewer_teleop_hq.gif)

_Rerun Viewer Teleop Example_

This will launch the teleoperation interface. You should see two cameras, one on the wrist and one on the front.

This is a valuable tool for both teleoperation and debugging.

2.  Now using the **Rerun** viewer that opened, **try** picking up vials and placing them in the rack **only using the camera views**, not your eyes. See if your partner and you can perform the task a few times.

We'll spend some time here - try to do several picks. Emphasize smooth, direct movements.

3.  **Press Ctrl+C** to stop the teleoperation.

4.  **Close** the Rerun viewer if it's still open.

## Key Takeaways

- Camera assignment directly affects policy performance

- How tricky this task is - gripper camera becomes occluded after grasp, external camera provides continuous visibility

- The Rerun viewer is a valuable debugging tool for verifying camera views and robot state

## Resources

- [SO-101 Getting Started Guide](https://huggingface.co/docs/lerobot/en/so101) — Full assembly, motor setup, and calibration instructions

- [Rerun](https://rerun.io/) — A tool for visualizing camera views and robot actions

## What's Next?

With your robot ready, apply your first sim-to-real strategy. In the next session, [Sim-to-Real Strategy 1: Domain Randomization With Teleoperation](/sim-to-real/veri-egitim-degerlendirme/strateji-1-domain-randomization), you'll collect demonstrations in simulation with domain randomization.
