"use client";

import Image from "next/image";

export type Project = {
  title: string;
  url: string;
  image: string;
  category: string;
  description: string;
  technologies: string[];
  note: string;
  award?: string;
};

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-card">
      <div className="project-card-front">
      <div className="project-card-top"><span>{String(index + 1).padStart(2, "0")} / {project.category}</span><span aria-hidden="true">◉</span></div>
      <a className="project-preview" href={project.url} target="_blank" rel="noreferrer" aria-label={`Explore ${project.title} (opens in a new tab)`}>
        <Image src={project.image} alt={`${project.title} interface`} width={960} height={540} sizes="(max-width: 700px) 90vw, (max-width: 1200px) 43vw, 600px" />
        <span className="project-preview-action" aria-hidden="true">Explore project ↗</span>
      </a>
      <div className="project-card-content">
        {project.award && <span className="project-award">★ {project.award}</span>}
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <ul className="project-technologies" aria-label="Technologies">{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
        <details className="project-notes"><summary>Behind the build <span aria-hidden="true">+</span></summary><p>{project.note}</p></details>
        <a className="project-link" href={project.url} target="_blank" rel="noreferrer">{project.url.includes("devpost") ? "View hackathon project" : "View source code"}<span aria-hidden="true">↗</span></a>
      </div>
      </div>
    </article>
  );
}
