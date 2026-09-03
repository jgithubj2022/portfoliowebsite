"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

const sections = ["work", "about", "skills", "contact"];
export default function PortfolioNav() {
  const [active, setActive] = useState("work");
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
    sections.forEach(id => { const section = document.getElementById(id); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);
  const navigate = (event: KeyboardEvent<HTMLElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const links = Array.from(nav.current?.querySelectorAll("a") ?? []);
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? links.length - 1 : (current + (event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1) + links.length) % links.length;
    event.preventDefault(); links[next]?.focus();
  };
  return <nav className="folio-nav" aria-label="Portfolio sections" ref={nav} onKeyDown={navigate}>{sections.map((id, index) => <a href={`#${id}`} key={id} aria-current={active === id ? "location" : undefined} onClick={() => setActive(id)}><span aria-hidden="true">0{index + 1}</span>{id === "work" ? "Projects" : id[0].toUpperCase() + id.slice(1)}</a>)}</nav>;
}
