"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";

const blades = [
  {
    eyebrow: "Latest Builds",
    title: "Projects",
    stat: "1",
  },
  {
    eyebrow: "Player Profile",
    title: "About",
    stat: "2",
  },
  {
    eyebrow: "Message Center",
    title: "Contact",
    stat: "3",
  },
];

const projects = [
  "MangaBite",
  "Portfolio OS",
  "FastAPI Tools",
  "Next.js Labs",
];

const skills = ["Next.js", "FastAPI", "React", "TypeScript", "Python", "Vercel"];

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [selectedBlade, setSelectedBlade] = useState(0);
  const activeBlade = blades[selectedBlade];

  const clock = useMemo(() => {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setSelectedBlade((current) => Math.min(current + 1, blades.length - 1));
      }

      if (event.key === "ArrowLeft") {
        setSelectedBlade((current) => Math.max(current - 1, 0));
      }

      if (event.key === "ArrowDown") {
        setSelectedBlade((current) => Math.min(current + 1, blades.length - 1));
      }

      if (event.key === "ArrowUp") {
        setSelectedBlade((current) => Math.max(current - 1, 0));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!hasEntered) { //havent entered the game so screen is diff
    return (
      <main className="loading-screen" onClick={() => setHasEntered(true)}>
        <div className="loading-panel">
          <video
            className="loading-video"
            src="/television/startscreenblenderV2.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            disablePictureInPicture
            controls={false}
          />
          <button className ="startfont anim" type="button"><span>C</span><span>l</span><span>i</span><span>c</span><span>k</span> <span>t</span><span>o</span> <span>s</span><span>t</span><span>a</span><span>r</span><span>t</span> </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-shell">
      <div className="ambient-grid" />
      <div className="screen-scale">
        <section className="console-stage" aria-label="Portfolio dashboard">

        <header className="profile-bar anim">

          <div className="profile-card anim" aria-label="Profile summary">
            <div>
            </div>
          </div>
        </header>

        <nav className="section-rail" aria-label="Portfolio menu">
          {blades.map((blade, index) => (
            <button
              className={selectedBlade === index ? "is-current" : ""}
              key={blade.title}
              onClick={() => setSelectedBlade(index)}
              type="button"
            >
              {blade.title}
            </button>
          ))}
        </nav>

        <div className="section-title anim">
          <span>My Portfolio</span>
          <strong>{activeBlade.title}</strong>
        </div>

        <section className="blade-row anim" aria-label="Portfolio sections">
          {blades.map((blade, index) => {
            const offset = index - selectedBlade;
            const isActive = offset === 0;
            const cardLeft =
              offset < 0 ? `${-18 + offset * 7}rem` : isActive ? "0rem" : `${20 + (offset - 1) * 7.6}rem`;

            return (
              <button
                className={`blade-card ${isActive ? "is-active" : ""}`}
                key={blade.title}
                onClick={() => setSelectedBlade(index)}
                type="button"
                style={
                  {
                    "--blade-offset": `${offset}`,
                    "--blade-distance": `${Math.abs(offset)}`,
                    "--card-left": cardLeft,
                  } as CSSProperties
                }
                aria-pressed={isActive}
              >
                <span className="blade-icon">{blade.stat}</span>
                <span className="blade-number">{blade.stat}</span>
                <span className="blade-eyebrow">{blade.eyebrow}</span>
                <strong>{blade.title}</strong>
              </button>
            );
          })}
        </section>

        <aside className="avatar-stage anim" aria-label="Blender avatar preview space">
          <div className="avatar-hud anim" aria-hidden="true">
            <span>Jiles Smith</span>
            <span>Age: 21</span>
            <span>Hair: Black</span>
            <span></span>
          </div>
          <div className="avatar-shadow" />
          <div className="avatar-video-frame">
            <img
              className="avatar-gif"
              src="/avatar/avataridleV2.gif"
              alt=""
              aria-hidden="true"
            />
          </div>
        </aside>

        <section className="content-dock" aria-label="Portfolio details">
          <div className="dock-panel">
            <span>Latest Projects</span>
            <div className="mini-tile-row">
              {projects.map((project) => (
                <div className="mini-tile" key={project}>
                  {project}
                </div>
              ))}
            </div>
          </div>

          <div className="dock-panel contact-panel">
            <span>Online Status</span>
            <strong>Open to build</strong>
            <p>{clock} - GitHub / Resume / Email links go here.</p>
          </div>
        </section>

        <footer className="control-strip anim">
          <span className="control-dot muted">{"<"}</span>
          <span className="control-dot muted">{">"}</span>
        </footer>
        </section>
      </div>
    </main>
  );
}
