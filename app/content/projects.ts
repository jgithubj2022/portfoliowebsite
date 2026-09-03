export type PortfolioProject = {
  slug: string; title: string; category: string; description: string; image: string;
  technologies: string[]; role: string; url: string; award?: string;
  challenge: string; approach: string[]; flow: string[]; result: string;
};

export const projects: PortfolioProject[] = [
  {
    slug: "seapredictor", title: "SeaPredictor", category: "Environmental computing",
    description: "From satellite detections to a navigable picture of where marine debris may travel.",
    image: "/projects/sea.webp", technologies: ["Next.js", "CesiumJS", "Python"],
    role: "Frontend & model integration · team project",
    url: "https://devpost.com/software/seapredictor", award: "Best Use of AI/ML · FullyHacks 2026",
    challenge: "Marine debris data needs geographic context. SeaPredictor brings detection and drift forecasting into one interface.",
    approach: ["I created the Next.js frontend and integrated my team’s trained model.", "An interactive CesiumJS globe presents detections and forecast movement together.", "The team’s pipeline combines satellite analysis with OpenDrift simulations."],
    flow: ["Satellite detection", "Drift simulation", "Interactive globe"],
    result: "Our team received Best Use of AI/ML at FullyHacks 2026. My contribution focused on making the model accessible through the web interface.",
  },
  {
    slug: "thinkboard", title: "ThinkBoard", category: "Web app + browser extension",
    description: "Capture a thought by voice without leaving the page. Pick it up later in a shared notes workspace.",
    image: "/projects/thinkboard.webp", technologies: ["React", "Express", "MongoDB", "Web Speech API"],
    role: "Application & extension development", url: "https://github.com/jgithubj2022/thinkboard-project",
    challenge: "Taking a note while browsing usually interrupts the task at hand. ThinkBoard connects a web workspace with a lightweight, in-page capture tool.",
    approach: ["A Manifest V3 extension mounts a draggable, resizable React panel inside a Shadow DOM, isolating its styles from the host page.", "Voice commands and manual note editing use the same Express API and MongoDB data store as the web app.", "The interface includes loading, validation, retry, and error states. Upstash Redis supplies IP-based rate limiting."],
    flow: ["Voice or typed note", "Shared Express API", "MongoDB workspace"],
    result: "A connected note-taking workflow across the web app and Chrome extension, including create, edit, and delete operations and an Alt + V voice shortcut.",
  },
  {
    slug: "mangabite", title: "MangaBite", category: "Reading & community",
    description: "A personal manga library with reading status, ratings, and a way to discover what friends are collecting.",
    image: "/projects/manga.webp", technologies: ["PHP", "MySQL", "CSS"],
    role: "Web development & visual identity", url: "https://github.com/jgithubj2022/manga-tracker",
    challenge: "A useful reading tracker has to make a growing collection easy to search, update, and personalize—not just store a list of titles.",
    approach: ["Library records support reading status, ratings, descriptions, image uploads, search, and editing.", "Account handling uses password hashing and prepared SQL statements, with MySQL storing the library data.", "The live edition adds friends, messages, and a ‘Bite’ action that copies a title into another reader’s collection without copying the original owner’s personal rating or status."],
    flow: ["Reader’s collection", "PHP application", "MySQL library"],
    result: "A working personal-library application with an original logo and a social extension of the core tracking workflow. The public repository documents the base application and live-only features.",
  },
  {
    slug: "music-affinity", title: "MusicAffinity", category: "Applied machine learning",
    description: "Explore genre matches from tempo, energy, and instrumentation—with a clear separation between prediction and explanation.",
    image: "/projects/music.webp", technologies: ["Python", "Supervised learning", "Gemini"],
    role: "Machine-learning application development", url: "https://github.com/jgithubj2022/music-affinity-calculator",
    challenge: "A genre recommendation is more useful when listeners can understand how musical traits relate to the result.",
    approach: ["The input captures characteristics such as tempo, energy, danceability, mood, vocals, and instrumentation.", "A supervised classifier produces ranked genre matches and affinity scores.", "Gemini explains the returned results in plain language; it does not choose genres or calculate their scores."],
    flow: ["Musical traits", "Genre classifier", "Scores + explanation"],
    result: "An exploratory music tool that pairs a structured prediction pipeline with readable explanations. The repository includes the model workflow and optional dataset import.",
  },
];

export const email = "jilessmithiiiwork@gmail.com";
export const github = "https://github.com/jgithubj2022";
export const linkedin = "https://www.linkedin.com/in/jiles-smith/";
