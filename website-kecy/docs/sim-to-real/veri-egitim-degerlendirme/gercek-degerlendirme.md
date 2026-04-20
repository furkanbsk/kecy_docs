---
title: 'Gerçek Robotta Değerlendirme'
sidebar_position: 4
description: 'NVIDIA''nın "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac" dokümantasyonundan Türkçeleştirilmiş içerik: Gerçek Robotta Değerlendirme'
needsTranslation: true
---

:::info Kaynak

Bu sayfa NVIDIA'nın resmi **"Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac"** kursundaki [12-real-evaluation.html](https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/12-real-evaluation.html) sayfasından uyarlanmıştır.

Orijinal içerik NVIDIA Corporation'a aittir; burada eğitim amaçlı olarak Türkçeleştirilmektedir.

:::

What Do I Need for This Module?

Hands-on. You'll need the calibrated SO-101 robot, both cameras, the assembled workspace, and the `real-robot` container.

In this session, you'll run policy evaluation on the physical SO-101 robot using the same GR00T-based setup you used in simulation.

The client is now the real robot instead of the simulator!

## Learning Objectives

By the end of this session, you'll be able to:

- **Run** policy evaluation on the real robot using the GR00T server + client (Docker) setup

- **Observe** the sim-to-real gap firsthand

- **Stop and restart** the evaluation safely

## What Policy Are We Running?

We use the same policy you evaluated in simulation. The exact `MODEL` (checkpoint path) is set in the commands below.

## Running Policy Evaluation on the Real Robot

Throughout this course, when we run evaluations there will be two terminals involved:

1.  The host terminal, where we start the GR00T container and policy server

2.  The client terminal, where we run the evaluation rollout and actually control the robot

For sim, the client is our simulator. For the real robot, our client is the robot itself.

### Terminal 1 (real-robot container) — Start the GR00T policy server

1.  **Locate** the terminal already running the `real-robot` container.

If you can't find it, click here to see the command to run the container.

If you don't have the `real-robot` container terminal open, **open** a new terminal window (**CTRL+ALT+T**), and run the docker `real-robot` container using:

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

2.  Inside this container, **run** the following. This is where we choose which model to evaluate.

```bash
export MODEL=aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left/checkpoint-10000
```

3.  **Run** the policy server with that model.

```bash
python Isaac-GR00T/gr00t/eval/run_gr00t_server.py \
    --model-path /workspace/models/$MODEL
```

### Terminal 2 (real-robot container) — Evaluation rollout

Open a second terminal. You will attach to the same `real-robot` container and run the robot client. This step assumes your robot has been calibrated already (likely you already did this).

1.  Attach a second terminal to the `real-robot` container.

```bash
docker exec -it real-robot /bin/bash
```

2.  Once inside the container, **run** the evaluation script:

```bash
python Isaac-GR00T/gr00t/eval/real_robot/SO100/so101_eval.py \
  --robot.type=so101_follower \
  --robot.port="$ROBOT_PORT" \
  --robot.id="$ROBOT_ID" \
  --robot.cameras="{
      wrist:  {type: opencv, index_or_path: $CAMERA_GRIPPER, width: 640, height: 480, fps: 30},
      front:  {type: opencv, index_or_path: $CAMERA_EXTERNAL, width: 640, height: 480, fps: 30}
  }" \
  --policy_host=localhost \
  --policy_port=5555 \
  --lang_instruction="Pick up the vial and place it in the yellow rack" \
  --rerun True
```

:::note

The `--rerun` flag is optional.

It adds Rerun into the loop for debugging, so you can see joint actions and the camera feeds while the policy is running. This lets you confirm the camera views are reasonable and the assignments are correct.

:::

### Watching the Evaluation

Watch the robot and the terminal during execution. The policy will run until you stop it or it completes the evaluation. Watch closely but stay clear; note any unexpected behavior and be ready to intervene.

**To stop the robot:** Press **CTRL+C** in Terminal 2 (robot client). The policy server in Terminal 1 keeps running.

**To run again:** Simply run the command again `python Isaac-GR00T/gr00t/eval/real_robot/SO100/so101_eval.py ...` in Terminal 2

**To switch model or fully restart:**

1.  **Stop** both terminals' commands (**CTRL+C**)

2.  **Set** `MODEL` environment variable to the model you want to evaluate

3.  **Restart** the commands for each terminal (model server, robot client)

:::note

- At evaluation start, the robot will slowly rise to its initial pose, then enter into inference mode.

- At robot stop (CTRL+C), it will slowly drive itself back to its home pose.

:::

:::tip

Keep the policy server running between evaluation attempts. Only restart it if you want to load a different model checkpoint.

:::

## Common Failure Modes

When observing real evaluation runs, notice how perception and actuation differ from simulation. The same policy may miss grasps, overshoot, or behave differently under real lighting and dynamics. These differences are the sim-to-real gap you'll address with the strategies in the modules that follow.

## Key Takeaways

- Real robot evaluation uses the same GR00T server + client architecture as sim evaluation; only the client (robot vs. simulator) changes

- The gap between sim and real performance is often visible immediately—perception and actuation both matter

- Safe shutdown is CTRL+C in the robot client terminal first

## What's Next?

Continue with [Strategy 2: Co-Training With Real Data](/sim-to-real/veri-zenginlestirme/strateji-2-cotraining), where you'll deploy policies trained on mixed simulation and real data to the physical robot.

On this page
