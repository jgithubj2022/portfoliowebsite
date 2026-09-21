"use client";

import { useEffect, useRef, useState } from "react";
import Infinite3DBladeCarousel from "./components/infinite-3d-blade-carousel";
import ProjectHoverTabs from "./components/project-hover-tabs";

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

const contacts = [
  {
    title: "LinkedIn",
    url: "https://www.linkedin.com/in/jiles-smith/",
  },
  {
    title: "Email",
    url: "mailto:jilessmithiiiwork@gmail.com",
  }
];

const skills = ["Next.js ", "FastAPI ", "React ", "TypeScript ", "Python ", "Vercel ", "MongoDB ", "Express.js ", "Node.js "];

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
      if (event.defaultPrevented) return;
      if (
        event.target instanceof Element &&
        event.target.closest(".appearance-menu, [data-project-hover-tabs]")
      ) return;
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
            <Infinite3DBladeCarousel
              items={blades}
              activeIndex={selectedBlade}
              onActiveChange={setSelectedBlade}
              onOpen={openBladePage}
            />
          </section>

          <aside className="avatar-stage anim" aria-label="Blender avatar preview space">
            <div className="avatar-shadow" />

            <div className="avatar-visual">
              <div className="avatar-hud" aria-hidden="true">
                <span>Jiles Smith</span>
                <span>Age: 21</span>
                <span>Focus: Fullstack</span>
              </div>

              <div className="avatar-video-frame">
                <img
                  className="avatar-gif"
                  src="/avatar/avataridleV2.gif"
                  alt=""
                  aria-hidden="true"
                />
              </div>
            </div>
          </aside>
          </section>
        </div>
      </main>
      <section ref={contentRef} className="blade-page">
        <div className="blade-page-layout">
          {selectedBlade === 0 && (
            <section className="blade-page-panel" aria-label="Projects">
              <h1 className="blade-page-header">Projects</h1>

              <div className="blade-page-body">
                <ProjectHoverTabs />
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
                <div className="blade-page-list">
                {contacts.map((contacts) => (
                    <button
                      className="blade-page-tile"
                      key={contacts.title}
                      type="button"
                      onClick={() => window.open(contacts.url, "_blank", "noreferrer")}
                    >
                      {contacts.title}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
      </>
  );
}
