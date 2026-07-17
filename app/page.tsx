"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

const blades = [
  {
    eyebrow: "Latest Builds",
    title: "Projects",
    stat: "1",
  },
  {
    eyebrow: "Player Profile",
    title: "Skills",
    stat: "2",
  },
  {
    eyebrow: "Message Center",
    title: "Contact",
    stat: "3",
  },
];

const projects = [
  {
    title: "MangaBite",
    url: "https://github.com/jgithubj2022/manga-tracker",
  },
  {
    title: "Sea-Predictor (Hackathon Winner)",
    url: "https://devpost.com/software/seapredictor",
  },
  {
    title: "MusicAffinity",
    url: "https://github.com/jgithubj2022/music-affinity-calculator",
  }
];

const skills = ["Next.js ", "FastAPI ", "React ", "TypeScript ", "Python ", "Vercel "];

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [selectedBlade, setSelectedBlade] = useState(0);
  const activeBlade = blades[selectedBlade];
  const contentRef = useRef<HTMLElement | null>(null);

  const openBladePage = (index: number) => {
    setSelectedBlade(index);
    window.requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

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


  if (!hasEntered) {
    return (
      <main className="loading-screen" onClick={() => setHasEntered(true)}>
        <div className="loading-panel">
          <div className="crt-power-on">
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
            <button className="startfont" type="button"><span>C</span><span>l</span><span>i</span><span>c</span><span>k</span> <span>t</span><span>o</span> <span>s</span><span>t</span><span>a</span><span>r</span><span>t</span></button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
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
                onClick={() => openBladePage(index)}
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
                  onClick={() => openBladePage(index)}
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
              <span>Focus: Fullstack</span>
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


          <footer className="control-strip anim">
            <button className="control-dot muted" type="button" onClick={() => setSelectedBlade((current) => Math.max(current - 1, 0))}>{"<"}</button>  
            <button className="control-dot muted" type="button" onClick={() => setSelectedBlade((current) => Math.min(current + 1, blades.length - 1))}>{">"}</button> 
          </footer>
          </section>
        </div>
      </main>
      <section ref={contentRef} className="blade-page">
        <div className="blade-page-layout">
          {selectedBlade === 0 && (
            <section className="blade-page-panel" aria-label="Projects">
              <h1 className="blade-page-header">Projects</h1>
              <div className="blade-page-body">
                <div className="blade-page-list">
                  {projects.map((project) => (
                    <button
                      className="blade-page-tile"
                      key={project.title}
                      type="button"
                      onClick={() => window.open(project.url, "_blank", "noreferrer")}
                    >
                      {project.title}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}
          {selectedBlade === 1 && (
            <section className="blade-page-panel" aria-label="Skills">
              <h1 className="blade-page-header">Skills</h1>
              <div className="blade-page-body">
                <div className="blade-page-list">
                  {skills.map((skill) => (
                    <div className="blade-page-tile" key={skill}>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          {selectedBlade === 2 && (
            <section className="blade-page-panel" aria-label="Contact">
              <h1 className="blade-page-header">Contact</h1>
              <div className="blade-page-body">
                <p className="blade-page-copy">email: jilessmithiiiwork@gmail.com</p>
                <p className="blade-page-copy">linkedin: https://www.linkedin.com/in/jiles-smith-29a463321/</p>
              </div>
            </section>
          )}
        </div>
      </section>
      </>
  );
}
