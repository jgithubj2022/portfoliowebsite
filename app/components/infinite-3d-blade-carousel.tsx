"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";
import { useReducedMotion } from "motion/react";

export type BladeCarouselItem = {
  eyebrow: string;
  title: string;
  stat: string;
};

type Infinite3DBladeCarouselProps = {
  items: BladeCarouselItem[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  onOpen: (index: number) => void;
};

const SLOT_COUNT = 5;
const DEFAULT_CARD_STEP = 170;

function wrapIndex(value: number, length: number) {
  return ((value % length) + length) % length;
}

function smoothstep(start: number, end: number, value: number) {
  const progress = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return progress * progress * (3 - 2 * progress);
}

export default function Infinite3DBladeCarousel({
  items,
  activeIndex,
  onActiveChange,
  onOpen,
}: Infinite3DBladeCarouselProps) {
  const reduceMotion = useReducedMotion();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pointerIdRef = useRef<number | null>(null);
  const pointerActiveRef = useRef(false);
  const dragMovedRef = useRef(false);
  const pointerStartXRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const momentumRef = useRef(0);
  const targetOffsetRef = useRef(-activeIndex * DEFAULT_CARD_STEP);
  const renderedOffsetRef = useRef(-activeIndex * DEFAULT_CARD_STEP);
  const renderedVelocityRef = useRef(0);
  const cardStepRef = useRef(DEFAULT_CARD_STEP);
  const centerVirtualRef = useRef(activeIndex);
  const internalActiveRef = useRef(activeIndex);
  const frameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const inViewRef = useRef(true);
  const autoplayPausedRef = useRef(false);
  const stepAnimationRef = useRef<(time: number) => void>(() => undefined);
  const [centerVirtualIndex, setCenterVirtualIndex] = useState(activeIndex);

  const applyCardGeometry = useCallback((renderedOffset: number) => {
    if (items.length === 0) return;

    const cardStep = cardStepRef.current;
    const activeFloatIndex = -renderedOffset / cardStep;
    const nearestCenter = Math.round(activeFloatIndex);

    if (nearestCenter !== centerVirtualRef.current) {
      centerVirtualRef.current = nearestCenter;
      setCenterVirtualIndex(nearestCenter);

      const nextActiveIndex = wrapIndex(nearestCenter, items.length);
      if (nextActiveIndex !== internalActiveRef.current) {
        internalActiveRef.current = nextActiveIndex;
        onActiveChange(nextActiveIndex);
      }
    }

    for (let slot = 0; slot < SLOT_COUNT; slot += 1) {
      const card = cardRefs.current[slot];
      if (!card) continue;

      const virtualIndex = nearestCenter + slot - Math.floor(SLOT_COUNT / 2);
      const distance = virtualIndex - activeFloatIndex;
      const absoluteDistance = Math.abs(distance);
      const depth = Math.pow(Math.min(1, absoluteDistance / 2), 0.9);
      const direction = distance === 0 ? 0 : distance > 0 ? 1 : -1;
      const translateX = distance * cardStep;
      const translateZ = 42 - depth * 150;
      const rotateY = -direction * depth * 13;
      const scale = 1 - depth * 0.23;
      const opacity = Math.max(0, 1 - smoothstep(1.55, 2.55, absoluteDistance));
      const blur = reduceMotion ? 0 : 1.8 * smoothstep(0.35, 2.2, absoluteDistance);

      card.style.zIndex = String(1000 - Math.round(absoluteDistance * 100));
      card.style.opacity = String(opacity);
      card.style.filter = blur > 0.05 ? `blur(${blur}px)` : "none";
      card.style.transform = `translate3d(calc(-50% + ${translateX}px), -50%, ${translateZ}px) rotateY(${rotateY}deg) rotateZ(0deg) scale(${scale})`;
    }
  }, [items.length, onActiveChange, reduceMotion]);

  const requestAnimation = useCallback(() => {
    if (frameRef.current !== null) return;
    lastFrameTimeRef.current = 0;
    frameRef.current = window.requestAnimationFrame(stepAnimationRef.current);
  }, []);

  const stepAnimation = useCallback((time: number) => {
    frameRef.current = null;
    const previousTime = lastFrameTimeRef.current;
    const deltaTime = previousTime
      ? Math.min(Math.max((time - previousTime) / 1000, 1 / 240), 1 / 30)
      : 1 / 60;
    lastFrameTimeRef.current = time;

    let targetOffset = targetOffsetRef.current;
    let renderedOffset = renderedOffsetRef.current;
    let renderedVelocity = renderedVelocityRef.current;

    const autoplaying = !reduceMotion && inViewRef.current && !autoplayPausedRef.current && !pointerActiveRef.current;
    if (autoplaying) targetOffset -= 14 * deltaTime;

    if (!pointerActiveRef.current) {
      targetOffset += momentumRef.current * deltaTime;
      momentumRef.current *= Math.pow(0.94, deltaTime * 60);
      if (Math.abs(momentumRef.current) < 0.25) momentumRef.current = 0;
    }

    if (reduceMotion) {
      renderedOffset = targetOffset;
      renderedVelocity = 0;
    } else {
      const stiffness = pointerActiveRef.current ? 245 : 175;
      const damping = pointerActiveRef.current ? 31 : 25;
      const acceleration = (targetOffset - renderedOffset) * stiffness - renderedVelocity * damping;
      renderedVelocity += acceleration * deltaTime;
      renderedOffset += renderedVelocity * deltaTime;
    }

    targetOffsetRef.current = targetOffset;
    renderedOffsetRef.current = renderedOffset;
    renderedVelocityRef.current = renderedVelocity;
    applyCardGeometry(renderedOffset);

    const stillSettling =
      Math.abs(targetOffset - renderedOffset) > 0.02 ||
      Math.abs(renderedVelocity) > 0.02 ||
      Math.abs(momentumRef.current) > 0.02;

    if (autoplaying || pointerActiveRef.current || stillSettling) {
      frameRef.current = window.requestAnimationFrame(stepAnimationRef.current);
    }
  }, [applyCardGeometry, reduceMotion]);

  useEffect(() => {
    stepAnimationRef.current = stepAnimation;
  }, [stepAnimation]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const nextStep = Math.max(108, Math.min(190, entry.contentRect.width * 0.22));
      cardStepRef.current = nextStep;
      const centeredOffset = -centerVirtualRef.current * nextStep;
      targetOffsetRef.current = centeredOffset;
      renderedOffsetRef.current = centeredOffset;
      renderedVelocityRef.current = 0;
      applyCardGeometry(centeredOffset);
    });

    resizeObserver.observe(carousel);
    return () => resizeObserver.disconnect();
  }, [applyCardGeometry]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      if (entry.isIntersecting) requestAnimation();
    }, { threshold: 0.2 });

    observer.observe(carousel);
    return () => observer.disconnect();
  }, [requestAnimation]);

  useEffect(() => {
    if (items.length === 0 || activeIndex === internalActiveRef.current) return;

    const currentVirtualIndex = centerVirtualRef.current;
    const currentItemIndex = wrapIndex(currentVirtualIndex, items.length);
    let itemDelta = wrapIndex(activeIndex - currentItemIndex, items.length);
    if (itemDelta > items.length / 2) itemDelta -= items.length;

    momentumRef.current = 0;
    targetOffsetRef.current = -(currentVirtualIndex + itemDelta) * cardStepRef.current;
    requestAnimation();
  }, [activeIndex, items.length, requestAnimation]);

  useEffect(() => {
    applyCardGeometry(renderedOffsetRef.current);
    requestAnimation();

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [applyCardGeometry, requestAnimation]);

  const moveToVirtualIndex = (virtualIndex: number) => {
    momentumRef.current = 0;
    targetOffsetRef.current = -virtualIndex * cardStepRef.current;
    requestAnimation();
  };

  const activateVirtualIndex = (virtualIndex: number) => {
    const itemIndex = wrapIndex(virtualIndex, items.length);
    if (virtualIndex === centerVirtualRef.current) onOpen(itemIndex);
    else moveToVirtualIndex(virtualIndex);
  };

  const finishPointerInteraction = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return;

    pointerActiveRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pointerIdRef.current = null;
    requestAnimation();
  };

  if (items.length === 0) return null;

  return (
    <div
      ref={carouselRef}
      className="blade-carousel"
      role="region"
      aria-label="Infinite portfolio carousel"
      aria-roledescription="carousel"
      tabIndex={0}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") autoplayPausedRef.current = true;
      }}
      onPointerLeave={(event) => {
        if (pointerActiveRef.current && !event.currentTarget.hasPointerCapture(event.pointerId)) {
          finishPointerInteraction(event);
        }
        if (event.pointerType === "mouse") {
          autoplayPausedRef.current = false;
          requestAnimation();
        }
      }}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        pointerActiveRef.current = true;
        pointerIdRef.current = event.pointerId;
        dragMovedRef.current = false;
        pointerStartXRef.current = event.clientX;
        lastPointerXRef.current = event.clientX;
        lastPointerTimeRef.current = event.timeStamp;
        targetOffsetRef.current = renderedOffsetRef.current;
        renderedVelocityRef.current = 0;
        momentumRef.current = 0;
        requestAnimation();
      }}
      onPointerMove={(event) => {
        if (!pointerActiveRef.current || pointerIdRef.current !== event.pointerId) return;

        const movement = event.clientX - lastPointerXRef.current;
        const elapsed = Math.max((event.timeStamp - lastPointerTimeRef.current) / 1000, 0.001);
        if (!dragMovedRef.current && Math.abs(event.clientX - pointerStartXRef.current) > 4) {
          dragMovedRef.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }

        targetOffsetRef.current += movement;
        const instantaneousVelocity = Math.max(-2600, Math.min(2600, movement / elapsed));
        const smoothing = 1 - Math.exp(-20 * elapsed);
        momentumRef.current += (instantaneousVelocity - momentumRef.current) * smoothing;
        lastPointerXRef.current = event.clientX;
        lastPointerTimeRef.current = event.timeStamp;
      }}
      onPointerUp={finishPointerInteraction}
      onPointerCancel={finishPointerInteraction}
      onClickCapture={(event) => {
        if (!dragMovedRef.current) return;
        dragMovedRef.current = false;
        event.preventDefault();
        event.stopPropagation();
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        event.stopPropagation();
        moveToVirtualIndex(centerVirtualRef.current + (event.key === "ArrowRight" ? 1 : -1));
      }}
      onFocusCapture={() => {
        autoplayPausedRef.current = true;
      }}
      onBlurCapture={(event: FocusEvent<HTMLDivElement>) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        autoplayPausedRef.current = false;
        requestAnimation();
      }}
    >
      {Array.from({ length: SLOT_COUNT }, (_, slot) => {
        const virtualIndex = centerVirtualIndex + slot - Math.floor(SLOT_COUNT / 2);
        const itemIndex = wrapIndex(virtualIndex, items.length);
        const item = items[itemIndex];
        const distance = slot - Math.floor(SLOT_COUNT / 2);
        const absoluteDistance = Math.abs(distance);
        const depth = Math.pow(Math.min(1, absoluteDistance / 2), 0.9);
        const direction = distance === 0 ? 0 : distance > 0 ? 1 : -1;
        const active = distance === 0;

        return (
          <button
            ref={(element) => {
              cardRefs.current[slot] = element;
            }}
            className={`blade-card infinite-blade-card ${active ? "is-active" : ""}`}
            key={`carousel-slot-${slot}`}
            type="button"
            tabIndex={active ? 0 : -1}
            aria-label={`${item.title}${active ? ", selected" : ", select"}`}
            aria-current={active ? "true" : undefined}
            onClick={() => activateVirtualIndex(virtualIndex)}
            style={{
              opacity: Math.max(0, 1 - smoothstep(1.55, 2.55, absoluteDistance)),
              transform: `translate3d(calc(-50% + ${distance * DEFAULT_CARD_STEP}px), -50%, ${42 - depth * 150}px) rotateY(${-direction * depth * 13}deg) rotateZ(0deg) scale(${1 - depth * 0.23})`,
              zIndex: 1000 - absoluteDistance * 100,
            }}
          >
            <span className="blade-icon">{item.stat}</span>
            <span className="blade-number">{item.stat}</span>
            <span className="blade-eyebrow">{item.eyebrow}</span>
            <strong>{item.title}</strong>
          </button>
        );
      })}

      <span className="carousel-status" aria-live="polite">
        {items[wrapIndex(centerVirtualIndex, items.length)].title}, item {wrapIndex(centerVirtualIndex, items.length) + 1} of {items.length}
      </span>
    </div>
  );
}
