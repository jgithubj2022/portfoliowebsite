"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./project-hover-tabs.module.css";

const projects = [
    { title: "MangaBite", description: "A personal manga library with reading status, ratings, and a way to discover what friends are collecting.",
        url: "https://github.com/jgithubj2022/manga-tracker",
        images: [
            { src: "/projects/originals/mangabite.png", caption: "Manga library" },
            { src: "/projects/gallery/mangabite-edit.png", caption: "Reading status and ratings" },
            { src: "/projects/gallery/mangabite-comments.png", caption: "Manga comments" },
            { src: "/projects/gallery/mangabite-friends.png", caption: "Friends and requests" },
            { src: "/projects/gallery/mangabite-settings.png", caption: "Account settings" },
        ],
    },
    { title: "SeaPredictor", description: "From satellite detections to a navigable picture of where marine debris may travel.",
        url: "https://devpost.com/software/seapredictor",
        images: [
            { src: "/projects/originals/seapredictor.png", caption: "Marine debris drift map" },
        ],
    },
    { title: "musicAffinity", description: "Explore genre matches from tempo, energy, and instrumentation—with a clear separation between prediction and explanation.",
        url: "https://github.com/jgithubj2022/music-affinity-calculator",
        images: [
            { src: "/projects/originals/music-affinity.png", caption: "Genre matches with Gemini explanation" },
            { src: "/projects/gallery/music-affinity-results.png", caption: "Model-ranked genre matches" },
        ],
    },
    { title: "ThinkBoard", description: "Capture a thought by voice without leaving the page. Pick it up later in a shared notes workspace.",
        url: "https://github.com/jgithubj2022/thinkboard-project",
        images: [
            { src: "/projects/originals/thinkboard.png", caption: "Notes workspace" },
            { src: "/projects/gallery/thinkboard-extension.png", caption: "Browser extension" },
            { src: "/projects/gallery/thinkboard-voice-capture.png", caption: "Voice capture" },
            { src: "/projects/gallery/thinkboard-create-note.png", caption: "Create a note" },
            { src: "/projects/gallery/thinkboard-edit-note.png", caption: "Edit a note" },
        ],
    }
];

export default function ProjectHoverTabs() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [imageIndexes, setImageIndexes] = useState(() => projects.map(() => 0));
    const buttons = useRef<(HTMLButtonElement | null)[]>([]);
    const id = useId();
    const reduceMotion = useReducedMotion();

    function changeImage(projectIndex: number, direction: -1 | 1) {
        setImageIndexes((current) => current.map((imageIndex, index) => (
            index === projectIndex
                ? Math.max(0, Math.min(projects[index].images.length - 1, imageIndex + direction))
                : imageIndex
        )));
    }

    function handleKeys(
        event: KeyboardEvent<HTMLButtonElement>,
        index: number,
    ) {
        let newIndex = index;

        switch (event.key) {
            case "ArrowDown":
                newIndex = (index + 1) % projects.length;
                break;
            case "ArrowUp":
                newIndex = (index - 1 + projects.length) % projects.length;
                break;
            case "Home":
                newIndex = 0;
                break;
            case "End":
                newIndex = projects.length - 1;
                break;
            default:
                return;
        }
        event.preventDefault();
        event.stopPropagation();
        setActiveIndex(newIndex);
        buttons.current[newIndex]?.focus();
    }
    return (
        <div className={styles.showcase} data-project-hover-tabs>
        <div
            className={styles.tabs}
            role="tablist"
            aria-label="Choose a project"
            aria-orientation="vertical"
        >
            {projects.map((project, index) => {
            const active = index === activeIndex;

            return (
                <button
                key={project.title}
                ref={(element) => {
                    buttons.current[index] = element;
                }}
                id={`${id}-tab-${index}`}
                type="button"
                role="tab"
                aria-label={project.title}
                aria-selected={active}
                aria-controls={`${id}-panel-${index}`}
                tabIndex={active ? 0 : -1}
                className={styles.tab}
                onPointerEnter={(event) => {
                    if (
                    event.pointerType === "mouse" &&
                    window.matchMedia("(hover: hover)").matches
                    ) {
                    setActiveIndex(index);
                    }
                }}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => handleKeys(event, index)}
                >
                <span className={styles.title}>
                    <span>{project.title}</span>
                    <span aria-hidden="true">{active ? "−" : "+"}</span>
                </span>

                <motion.span
                    className={styles.description}
                    aria-hidden="true"
                    initial={false}
                    animate={{
                    height: active ? "auto" : 0,
                    opacity: active ? 1 : 0,
                    }}
                    transition={{
                    duration: reduceMotion ? 0 : 0.22,
                    ease: "easeOut",
                    }}
                >
                    <span>{project.description}</span>
                </motion.span>
                </button>
            );
            })}
        </div>

        <div className={styles.preview}>
            {projects.map((project, index) => {
            const active = index === activeIndex;
            const imageIndex = imageIndexes[index];
            const selectedImage = project.images[imageIndex];

            return (
                <section
                key={project.title}
                id={`${id}-panel-${index}`}
                role="tabpanel"
                aria-labelledby={`${id}-tab-${index}`}
                tabIndex={0}
                hidden={!active}
                className={styles.panel}
                onKeyDown={(event) => {
                    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
                    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                    event.preventDefault();
                    event.stopPropagation();
                    changeImage(index, event.key === "ArrowLeft" ? -1 : 1);
                }}
                >
                <p className={styles.srOnly}>{project.description}</p>

                <div className={styles.imageFrame} id={`${id}-images-${index}`}>
                    {project.images.map((screenshot, screenshotIndex) => (
                    <motion.div
                    key={screenshot.src}
                    className={styles.imageLayer}
                    aria-hidden={screenshotIndex !== imageIndex}
                    initial={false}
                    animate={{ opacity: screenshotIndex === imageIndex ? 1 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    >
                    <Image
                        src={screenshot.src}
                        alt={`${project.title}: ${screenshot.caption}`}
                        fill
                        sizes="(max-width: 760px) 90vw, 65vw"
                        loading={active && Math.abs(screenshotIndex - imageIndex) <= 1 ? "eager" : "lazy"}
                        className={styles.image}
                    />
                    </motion.div>
                    ))}
                </div>

                <div className={styles.galleryControls}>
                    <button
                        type="button"
                        className={styles.galleryArrow}
                        aria-label={`Previous ${project.title} screenshot`}
                        aria-controls={`${id}-images-${index}`}
                        disabled={imageIndex === 0}
                        onClick={() => changeImage(index, -1)}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                            <path d="M19 12H5m7-7-7 7 7 7" />
                        </svg>
                    </button>
                    <p className={styles.galleryStatus} role="status" aria-live="polite" aria-atomic="true">
                        <span className={styles.galleryCaption}>{selectedImage.caption}</span>
                        <span className={styles.galleryCount}>
                            <span className={styles.srOnly}>{project.title} screenshot </span>
                            {imageIndex + 1} / {project.images.length}
                        </span>
                    </p>
                    <button
                        type="button"
                        className={styles.galleryArrow}
                        aria-label={`Next ${project.title} screenshot`}
                        aria-controls={`${id}-images-${index}`}
                        disabled={imageIndex === project.images.length - 1}
                        onClick={() => changeImage(index, 1)}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                            <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <a
                    className={styles.projectLink}
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                >
                    View {project.title}
                    <span aria-hidden="true">↗</span>
                </a>
                </section>
            );
            })}
        </div>
        </div>
    );
    }
