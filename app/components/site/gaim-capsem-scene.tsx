"use client";

import { Canvas, type ThreeEvent, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import {
  angularVelocityFromDrag,
  hasUnlockedCapsem,
  integrateAngularInertia,
} from "./gaim-capsem-physics";

type SceneProps = {
  isUnlocked: boolean;
  keyboardActivation: number;
  onClose: () => void;
  onUnlock: () => void;
  prefersReducedMotion: boolean;
};

type DragState = {
  accumulatedRotation: number;
  isDragging: boolean;
  lastTime: number;
  lastX: number;
  lastY: number;
  pointerId: number | null;
  travelInPixels: number;
  velocityX: number;
  velocityY: number;
};

const MODEL_PATH = "/models/gaim-capsem.glb";

export function GaimCapsemScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.25], fov: 32 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 4, 5]} intensity={4.8} color="#fff6e7" />
      <pointLight position={[-3, -2, 3]} intensity={5.5} color="#4f93ff" />
      <pointLight position={[2.5, 0, 2]} intensity={2.8} color="#ff7a00" />
      <InteractiveCapsem {...props} />
    </Canvas>
  );
}

function InteractiveCapsem({
  isUnlocked,
  keyboardActivation,
  onClose,
  onUnlock,
  prefersReducedMotion,
}: SceneProps) {
  const groupRef = useRef<Group>(null);
  const dragRef = useRef<DragState>(createInitialDragState());
  const previousKeyboardActivation = useRef(0);
  const unlockedDuringGesture = useRef(false);
  const loadedModel = useLoader(GLTFLoader, MODEL_PATH);
  const model = useMemo(() => loadedModel.scene.clone(true), [loadedModel.scene]);

  useEffect(() => {
    if (!isUnlocked) {
      dragRef.current.accumulatedRotation = 0;
      dragRef.current.velocityX = 0;
      dragRef.current.velocityY = 0;
      unlockedDuringGesture.current = false;
    }
  }, [isUnlocked]);

  useEffect(() => {
    if (keyboardActivation === previousKeyboardActivation.current) {
      return;
    }

    previousKeyboardActivation.current = keyboardActivation;
    if (groupRef.current) {
      groupRef.current.rotation.y += Math.PI / 2;
    }
    onUnlock();
  }, [keyboardActivation, onUnlock]);

  function registerRotation(amountInRadians: number) {
    const drag = dragRef.current;
    drag.accumulatedRotation += Math.abs(amountInRadians);
    if (!isUnlocked && hasUnlockedCapsem(drag.accumulatedRotation)) {
      unlockedDuringGesture.current = true;
      onUnlock();
    }
  }

  useFrame((_, deltaInSeconds) => {
    const group = groupRef.current;
    const drag = dragRef.current;
    if (!group || drag.isDragging || prefersReducedMotion) {
      return;
    }

    const xResult = integrateAngularInertia(
      group.rotation.x,
      drag.velocityX,
      deltaInSeconds,
    );
    const yResult = integrateAngularInertia(
      group.rotation.y,
      drag.velocityY,
      deltaInSeconds,
    );
    registerRotation(
      Math.abs(xResult.rotation - group.rotation.x) +
        Math.abs(yResult.rotation - group.rotation.y),
    );
    group.rotation.x = xResult.rotation;
    group.rotation.y = yResult.rotation;
    drag.velocityX = xResult.velocity;
    drag.velocityY = yResult.velocity;
  });

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    if (dragRef.current.pointerId !== null) {
      return;
    }

    event.stopPropagation();
    dragRef.current = {
      ...dragRef.current,
      isDragging: true,
      lastTime: performance.now(),
      lastX: event.clientX,
      lastY: event.clientY,
      pointerId: event.pointerId,
      travelInPixels: 0,
      velocityX: 0,
      velocityY: 0,
    };
    setPointerCapture(event);
  }

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    const group = groupRef.current;
    const drag = dragRef.current;
    if (!group || !drag.isDragging || drag.pointerId !== event.pointerId) {
      return;
    }

    event.stopPropagation();
    const now = performance.now();
    const elapsedInMilliseconds = now - drag.lastTime;
    const deltaX = event.clientX - drag.lastX;
    const deltaY = event.clientY - drag.lastY;
    const rotationX = deltaY * 0.012;
    const rotationY = deltaX * 0.012;

    group.rotation.x += rotationX;
    group.rotation.y += rotationY;
    drag.velocityX = angularVelocityFromDrag(deltaY, elapsedInMilliseconds);
    drag.velocityY = angularVelocityFromDrag(deltaX, elapsedInMilliseconds);
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.lastTime = now;
    drag.travelInPixels += Math.abs(deltaX) + Math.abs(deltaY);
    registerRotation(Math.abs(rotationX) + Math.abs(rotationY));
  }

  function handlePointerEnd(event: ThreeEvent<PointerEvent>) {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) {
      return;
    }

    const isTapToClose = isUnlocked && drag.travelInPixels < 5;
    drag.isDragging = false;
    drag.pointerId = null;
    if (prefersReducedMotion) {
      drag.velocityX = 0;
      drag.velocityY = 0;
    }
    releasePointerCapture(event);
    if (isTapToClose && !unlockedDuringGesture.current) {
      onClose();
    }
    unlockedDuringGesture.current = false;
  }

  return (
    <group
      ref={groupRef}
      rotation={[0.12, -0.28, -0.06]}
      scale={1.12}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <primitive object={model} />
    </group>
  );
}

function createInitialDragState(): DragState {
  return {
    accumulatedRotation: 0,
    isDragging: false,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
    pointerId: null,
    travelInPixels: 0,
    velocityX: 0,
    velocityY: 0,
  };
}

function setPointerCapture(event: ThreeEvent<PointerEvent>) {
  const target = event.target as EventTarget & { setPointerCapture?: (id: number) => void };
  target?.setPointerCapture?.(event.pointerId);
}

function releasePointerCapture(event: ThreeEvent<PointerEvent>) {
  const target = event.target as EventTarget & { releasePointerCapture?: (id: number) => void };
  target?.releasePointerCapture?.(event.pointerId);
}
