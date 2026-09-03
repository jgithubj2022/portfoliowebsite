"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimate, useReducedMotion, stagger } from "motion/react";
import PixelCursor from "./pixel-cursor";

const THEMES = [
  { id: "console", name: "Console", description: "Original green glow" },
  { id: "synthwave", name: "Synthwave", description: "Violet & neon pink" },
  { id: "aqua", name: "Aqua", description: "Electric ocean blue" },
  { id: "halloween", name: "Halloween", description: "Dark mode" },
];
const THEME_KEY = "portfolio-theme";
const CURSOR_KEY = "portfolio-pixel-cursor";
const PIXELS = Array.from({ length: 120 }, (_, index) => index);

export default function ThemeControls() {
  const [theme, setTheme] = useState("console");
  const [cursor, setCursor] = useState(true);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [scope, animate] = useAnimate();
  const reducedMotion = useReducedMotion();
  const changing = useRef(false);
  const mounted = useRef(false);
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    mounted.current = true;
    const frame = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(THEME_KEY);
        if (THEMES.some((item) => item.id === saved)) {
          document.documentElement.dataset.theme = saved!;
          setTheme(saved!);
        }
        setCursor(localStorage.getItem(CURSOR_KEY) !== "off");
      } catch { /* Storage can be unavailable in private browsing. */ }
      setReady(true);
    });
    const close = (event: PointerEvent) => {
      if (event.target instanceof Node && !menu.current?.contains(event.target)) {
        menu.current?.removeAttribute("open");
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.removeAttribute("open");
        menu.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      mounted.current = false;
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const changeTheme = async (next: string) => {
    if (changing.current || next === theme) return;
    changing.current = true;
    setBusy(true);
    const apply = () => {
      document.documentElement.dataset.theme = next;
      setTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch { /* Keep working without storage. */ }
    };
    try {
      if (!reducedMotion) {
        // Cover the screen first; only switch the palette while fully covered.
        await animate(".theme-pixel", { opacity: 1 }, {
          duration: 0.06, delay: stagger(0.003, { from: "center" }),
        });
      }
      if (!mounted.current) return;
      apply();
      if (!reducedMotion) {
        await animate(".theme-pixel", { opacity: 0 }, {
          duration: 0.1, delay: stagger(0.003, { from: "last" }),
        });
      }
    } finally {
      changing.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  return (
    <>
      <details className="appearance-menu" ref={menu}>
        <summary className="btn btn-sm appearance-trigger">
          <span aria-hidden="true">▦</span> Appearance
        </summary>
        <section className="appearance-panel" aria-label="Appearance settings" aria-busy={busy}>
          <div className="appearance-heading"><span>MAKE IT YOURS</span><span aria-hidden="true">✦</span></div>
          <h2>Choose your atmosphere</h2>
          <p>Same portfolio. Your colors.</p>
          <div className="theme-options" role="group" aria-label="Website theme">
            {THEMES.map((item) => (
              <button key={item.id} type="button" className="btn theme-option"
                data-theme={item.id} aria-pressed={theme === item.id}
                disabled={!ready || busy} onClick={() => void changeTheme(item.id)}>
                <span className="theme-swatches" aria-hidden="true"><i /><i /><i /></span>
                <span><strong>{item.name}</strong><small>{item.description}</small></span>
                <span className="theme-check" aria-hidden="true">{theme === item.id ? "✓" : ""}</span>
              </button>
            ))}
          </div>
          <label className="cursor-setting">
            <span><strong>Pixel cursor</strong><small>Theme-matched hover glow</small></span>
            <input type="checkbox" className="toggle toggle-sm toggle-primary" checked={cursor}
              disabled={!ready} onChange={(event) => {
                const enabled = event.target.checked;
                setCursor(enabled);
                try { localStorage.setItem(CURSOR_KEY, enabled ? "on" : "off"); } catch { /* Optional storage. */ }
              }} />
          </label>
          <p className="appearance-note" role="status">{busy ? "Switching atmosphere…" : `${THEMES.find((item) => item.id === theme)?.name} selected · Saved on this device`}</p>
        </section>
      </details>
      <div ref={scope} className="theme-transition" aria-hidden="true" style={{ visibility: busy ? "visible" : "hidden" }}>
        {PIXELS.map((pixel) => <span className="theme-pixel" key={pixel} />)}
      </div>
      <PixelCursor enabled={ready && cursor} />
    </>
  );
}
