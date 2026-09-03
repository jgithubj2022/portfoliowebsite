"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function PortfolioControls() {
  const [playing, setPlaying] = useState(false);
  const [intro, setIntro] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const replay = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const frame = requestAnimationFrame(() => setPlaying(!preference.matches));
    const update = () => setPlaying(!preference.matches);
    preference.addEventListener("change", update);
    return () => { cancelAnimationFrame(frame); preference.removeEventListener("change", update); };
  }, []);
  const closeIntro = () => { dialog.current?.close(); setIntro(false); replay.current?.focus(); };
  return <>
    <div className="folio-avatar-screen">
      <div className="folio-avatar-label"><span>JILES / AVATAR</span><span aria-hidden="true">●</span></div>
      <Image className="folio-avatar-image" src={playing ? "/avatar/portrait-idle.webp" : "/avatar/portrait-still.webp"} alt="Jiles’s Xbox avatar" width={240} height={432} unoptimized preload />
      <button className="folio-avatar-toggle" type="button" onClick={() => setPlaying(!playing)} aria-pressed={playing}>{playing ? "Ⅱ Pause avatar" : "▷ Play avatar"}</button>
    </div>
    <button className="folio-replay" ref={replay} onClick={() => { setIntro(true); dialog.current?.showModal(); }}>▷ Play console intro</button>
    <dialog className="folio-intro" ref={dialog} aria-label="Console intro" onCancel={closeIntro} onClick={event => { if (event.target === event.currentTarget) closeIntro(); }}>
      {intro && <div className="folio-intro-content"><video src="/television/startscreenblenderV2.mp4" autoPlay muted playsInline controls /><button type="button" autoFocus onClick={closeIntro}>Return to portfolio →</button></div>}
    </dialog>
  </>;
}
