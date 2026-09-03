"use client";

import { useEffect, useRef } from "react";

export default function PixelCursor({ enabled }: { enabled: boolean }) {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!enabled) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const element = cursor.current;
    if (!element) return;
    const hide = () => {
      element.style.opacity = "0";
      document.documentElement.classList.remove("pixel-cursor-active");
    };
    const move = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType !== "mouse") { hide(); return; }
      element.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      element.style.opacity = "1";
      document.documentElement.classList.add("pixel-cursor-active");
      const target = event.target instanceof Element ? event.target : null;
      element.classList.toggle("is-hovering", !!target?.closest("button:not(:disabled), a, summary, input, label, [role=button], .loading-screen"));
    };
    const down = () => element.classList.add("is-pressed");
    const up = () => element.classList.remove("is-pressed");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    fine.addEventListener("change", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
      fine.removeEventListener("change", hide);
    };
  }, [enabled]);
  return <div ref={cursor} className="pixel-cursor" aria-hidden="true"><span className="pixel-cursor-shape" /><span className="pixel-cursor-ring" /></div>;
}
