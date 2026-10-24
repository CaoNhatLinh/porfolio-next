"use client";

import {
  ArrowsOutCardinal,
  Eye,
  PersonArmsSpread,
  SquaresFour,
  Stack,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { trackPortfolioEvent } from "./analytics-tracker";
import styles from "./interface-x-ray.module.css";
import {
  getInspectionNode,
  inspectionNodes,
  type InspectionNode,
  type XRayLayer,
} from "./interface-x-ray-model";
import { ProductSurface, XRayUnderlay } from "./interface-x-ray-surface";

type InterfaceXRayProps = {
  locale: "vi" | "en";
  variant?: "full" | "compact";
};

const layerOptions = [
  { id: "system", icon: SquaresFour, vi: "Hệ thống", en: "System" },
  { id: "states", icon: Stack, vi: "Trạng thái", en: "States" },
  { id: "accessibility", icon: PersonArmsSpread, vi: "Accessibility", en: "Accessibility" },
] as const;

export function InterfaceXRay({ locale, variant = "full" }: InterfaceXRayProps) {
  const copy = locale === "vi";
  const stageRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const underlayRef = useRef<HTMLDivElement>(null);
  const activePointerRef = useRef<number | null>(null);
  const hasTrackedInteractionRef = useRef(false);
  const lensPositionRef = useRef({ x: 480, y: 280 });
  const inspectionNodeRef = useRef(inspectionNodes[1]);
  const [activeLayer, setActiveLayer] = useState<XRayLayer>("system");
  const [inspectionNode, setInspectionNode] = useState<InspectionNode>(inspectionNodes[1]);

  const updateInspectionNode = useCallback((x: number, y: number, width: number, height: number) => {
    const nextNode = getInspectionNode({ x: x / width, y: y / height });
    if (nextNode.id === inspectionNodeRef.current.id) return;
    inspectionNodeRef.current = nextNode;
    setInspectionNode(nextNode);
  }, []);

  const positionLens = useCallback((x: number, y: number) => {
    const stage = stageRef.current;
    const lens = lensRef.current;
    const underlay = underlayRef.current;
    if (!stage || !lens || !underlay) return;

    const radius = lens.offsetWidth / 2;
    const boundedX = clamp(x, radius, stage.clientWidth - radius);
    const boundedY = clamp(y, radius, stage.clientHeight - radius);
    const left = boundedX - radius;
    const top = boundedY - radius;

    lensPositionRef.current = { x: boundedX, y: boundedY };
    lens.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    underlay.style.width = `${stage.clientWidth}px`;
    underlay.style.height = `${stage.clientHeight}px`;
    underlay.style.transform = `translate3d(${-left}px, ${-top}px, 0)`;
    updateInspectionNode(boundedX, boundedY, stage.clientWidth, stage.clientHeight);
  }, [updateInspectionNode]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new ResizeObserver(() => {
      positionLens(stage.clientWidth * 0.62, stage.clientHeight * 0.48);
    });
    observer.observe(stage);
    positionLens(stage.clientWidth * 0.62, stage.clientHeight * 0.48);
    return () => observer.disconnect();
  }, [positionLens]);

  function moveLensFromPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" && activePointerRef.current !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    positionLens(event.clientX - bounds.left, event.clientY - bounds.top);
    trackFirstInteraction();
  }

  function startInspection(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") {
      moveLensFromPointer(event);
      return;
    }
    if (activePointerRef.current !== null) return;
    activePointerRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveLensFromPointer(event);
  }

  function stopInspection(event: React.PointerEvent<HTMLDivElement>) {
    if (activePointerRef.current !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    activePointerRef.current = null;
  }

  function moveLensWithKeyboard(event: React.KeyboardEvent<HTMLDivElement>) {
    const movement = movementForKey(event.key);
    if (!movement) return;
    event.preventDefault();
    const current = lensPositionRef.current;
    positionLens(current.x + movement.x, current.y + movement.y);
    trackFirstInteraction();
  }

  function trackFirstInteraction() {
    if (hasTrackedInteractionRef.current) return;
    hasTrackedInteractionRef.current = true;
    trackPortfolioEvent("interface_xray_interaction");
  }

  function changeLayer(layer: XRayLayer) {
    setActiveLayer(layer);
    trackPortfolioEvent(`interface_xray_layer_${layer}`);
  }

  return (
    <section
      className={styles.experiment}
      data-variant={variant}
      aria-labelledby="xray-title"
    >
      <XRaySidebar
        copy={copy}
        variant={variant}
        activeLayer={activeLayer}
        onLayerChange={changeLayer}
      />
      <div className={styles.instrument}>
        <InstrumentHeader copy={copy} />
        <div
          ref={stageRef}
          className={styles.stage}
          tabIndex={0}
          role="group"
          aria-label={copy
            ? "Vùng thử nghiệm. Rê chuột, kéo bằng cảm ứng hoặc dùng phím mũi tên để di chuyển thấu kính."
            : "Experiment stage. Hover, drag by touch, or use arrow keys to move the lens."}
          onPointerDown={startInspection}
          onPointerMove={moveLensFromPointer}
          onPointerUp={stopInspection}
          onPointerCancel={stopInspection}
          onKeyDown={moveLensWithKeyboard}
        >
          <ProductSurface copy={copy} />
          <div ref={lensRef} className={styles.lens} aria-hidden="true">
            <div ref={underlayRef} className={styles.underlay}>
              <XRayUnderlay layer={activeLayer} />
            </div>
            <span className={styles.lensLabel}>{layerLabel(activeLayer, copy)}</span>
          </div>
        </div>
        <InspectorBar node={inspectionNode} copy={copy} />
      </div>
    </section>
  );
}

type XRaySidebarProps = {
  copy: boolean;
  variant: "full" | "compact";
  activeLayer: XRayLayer;
  onLayerChange: (layer: XRayLayer) => void;
};

function XRaySidebar({ copy, variant, activeLayer, onLayerChange }: XRaySidebarProps) {
  const Title = variant === "compact" ? "h3" : "h1";

  return (
    <aside className={styles.sidebar}>
      <p className={styles.eyebrow}>Interactive study / 01</p>
      <Title id="xray-title" className={styles.title}>Interface<br />X-Ray</Title>
      <p className={styles.intro}>
        {copy
          ? "Rê qua một giao diện để xem cách bố cục, trạng thái và khả năng truy cập được thiết kế bên dưới."
          : "Move across an interface to see how layout, states, and accessibility are designed beneath it."}
      </p>
      <div className={styles.rule} />
      <div className={styles.layerControls} role="group" aria-label={copy ? "Chọn lớp cần soi" : "Choose a layer to inspect"}>
        {layerOptions.map(({ id, icon: Icon, vi, en }) => (
          <button
            key={id}
            type="button"
            className={`${styles.layerControl} focus-ring`}
            data-active={activeLayer === id}
            aria-pressed={activeLayer === id}
            onClick={() => onLayerChange(id)}
          >
            <span className={styles.layerIcon}><Icon size={18} /></span>
            <span>{copy ? vi : en}</span>
            <i aria-hidden="true"><b /></i>
          </button>
        ))}
      </div>
      <p className={styles.moveHint}><ArrowsOutCardinal size={18} /> {copy ? "Di chuyển để soi" : "Move to inspect"}</p>
      <p className={styles.version}>Interface X-Ray v1.0<br />Kamling Labs</p>
    </aside>
  );
}

function InstrumentHeader({ copy }: { copy: boolean }) {
  return (
    <div className={styles.instrumentHeader}>
      <strong>kamling</strong>
      <div><span>Surface</span><span>Structure</span><span>Behavior</span></div>
      <p><Eye size={16} /> {copy ? "Đang soi trực tiếp" : "Live inspection"}</p>
    </div>
  );
}

function InspectorBar({ node, copy }: { node: InspectionNode; copy: boolean }) {
  return (
    <div className={styles.inspectorBar} aria-live="polite">
      <p><span>{copy ? "Vùng" : "Region"}</span><strong>{node.label}</strong></p>
      <p><span>Node</span><strong>{node.node}</strong></p>
      <p><span>Role</span><strong>{node.role}</strong></p>
      <p><span>Level</span><strong>{node.level}</strong></p>
      <p><span>Contrast</span><strong>{node.contrast}</strong></p>
    </div>
  );
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function movementForKey(key: string) {
  const movements: Record<string, { x: number; y: number }> = {
    ArrowLeft: { x: -24, y: 0 },
    ArrowRight: { x: 24, y: 0 },
    ArrowUp: { x: 0, y: -24 },
    ArrowDown: { x: 0, y: 24 },
  };
  return movements[key];
}

function layerLabel(layer: XRayLayer, copy: boolean) {
  const labels = {
    system: copy ? "Lưới / khoảng cách" : "Grid / spacing",
    states: copy ? "Luồng trạng thái" : "State flow",
    accessibility: copy ? "Cây accessibility" : "Accessibility tree",
  };
  return labels[layer];
}
