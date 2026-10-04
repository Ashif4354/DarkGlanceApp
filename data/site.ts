export type ProjectCategory =
  "Automation" | "Web" | "Desktop" | "Mobile" | "Open Source" | "Tools";
export type Project = {
  id: string;
  name: string;
  eyebrow: string;
  oneLiner: string;
  description: string;
  tech: string[];
  categories: ProjectCategory[];
  license?: string;
  highlights?: string[];
  links: {
    github?: string;
    live?: string;
    package?: string;
    playStore?: string;
  };
  stats?: { commits?: number; stars?: number; forks?: number };
  art: string;
  size: "feature" | "wide" | "normal";
  logo?: string;
};

export const site = {
  identity: {
    name: "Ashif",
    handle: "DarkGlance",
    title: "FullStack Developer",
    location: "Chennai, India",
    email: "darkglance.developer@gmail.com",
    logo: "https://cdn.darkglance.in/portfolio/me/DG.png",
    avatar: "https://cdn.darkglance.in/portfolio/me/DG.png",
    tagline: "I build tools nobody asked for, then everybody needs.",
    bio: "I love building something new—sometimes for my own use cases, sometimes for someone else’s. It’s my hobby, my passion, and usually how I spend a free afternoon. Most of my projects are public and MIT licensed. Also, I’m a big One Piece fan.",
    links: {
      github: "https://github.com/Ashif4354",
      linkedin: "https://www.linkedin.com/in/ashif4354",
      instagram: "https://www.instagram.com/ig_darkglance/",
    },
  },
  skills: {
    strong: ["Python", "JavaScript", "Django", "Flask", "Node.js", "React"],
    other: [
      "FastAPI",
      "Next.js",
      "React Native",
      "Playwright",
      "Socket.IO",
      "MongoDB",
      "Docker",
      "Ollama / Gemini",
      "MCP / FastMCP",
      "PydanticAI",
      "Async systems",
      "Webhooks",
    ],
    learning: ["Dart", "Flutter", "Go", "Gin"],
  },
  projects: [
    {
      id: "streamstorm",
      name: "StreamStorm",
      eyebrow: "Desktop · Automation",
      oneLiner:
        "A bot that automates sending messages in YouTube live stream chats, with a realtime dashboard and a built-in MCP server.",
      description:
        "Desktop app that sends messages into YouTube live chats at scale (mass messaging, a.k.a. spamming), across multiple Google accounts running in parallel isolated browser profiles. You set the target stream, the message list, intervals and slow-mode delays, and it runs on repeat, on schedule, or at full speed. It can also create channels, subscribe, and generate messages with AI (OpenAI, Anthropic, Gemini, custom). Under the hood: FastAPI engine + Playwright browser automation, React/Vite desktop UI, Socket.IO realtime dashboard (live logs, message rate, CPU/RAM charts, kill/pause/resume per instance), and a FastMCP server so LLM clients can start, stop and control storms with plain-English prompts.",
      tech: [
        "Python",
        "FastAPI",
        "Playwright",
        "Socket.IO",
        "FastMCP",
        "PydanticAI",
        "React",
        "Vite",
        "Next.js",
      ],
      categories: ["Automation", "Desktop", "Tools"],
      license: "Personal Use License",
      links: {
        github: "https://github.com/Ashif4354/StreamStorm",
        live: "https://streamstorm.darkglance.in/",
      },
      stats: { commits: 595, stars: 38, forks: 13 },
      logo: "https://cdn.darkglance.in/portfolio/projects/streamstorm/logo.png",
      art: "stream",
      size: "feature",
    },
    {
      id: "ticketradar",
      name: "TicketRadar",
      eyebrow: "Realtime · Alerts",
      oneLiner:
        "Async movie ticket booking monitor that alerts you the moment tickets drop.",
      description:
        "Continuously tracks platforms like BookMyShow for showtime openings across your chosen theatres and dates. The moment tickets open, it alerts you through WhatsApp messages, automated phone calls, SMS, Discord webhooks or email. Everything is managed from a real-time web dashboard.",
      highlights: [
        "Asynchronous monitoring",
        "5 alert channels",
        "Real-time dashboard",
      ],
      tech: ["FastAPI", "React", "Vite", "Firebase", "Twilio"],
      categories: ["Automation", "Web", "Tools"],
      links: { live: "https://ticketradar.darkglance.in/" },
      logo: "https://cdn.darkglance.in/portfolio/projects/ticketradar/logo.png",
      art: "radar",
      size: "wide",
    },
    {
      id: "dgupdater",
      name: "DGUpdater",
      eyebrow: "Python · PyPI",
      oneLiner:
        "No/low-code CLI that auto-updates desktop apps with chunked incremental updates.",
      description:
        "Published on PyPI. Developer flow is dgupdater init → commit → publish; the app calls check_update(). Splits releases into chunks stored in MongoDB, so users download only what changed. Cross-platform (Windows, Linux, macOS).",
      tech: ["Python", "MongoDB", "CLI", "PyPI"],
      categories: ["Open Source", "Tools"],
      license: "MIT",
      links: {
        github: "https://github.com/Ashif4354/DGUpdater",
        package: "https://pypi.org/project/dgupdater/",
      },
      stats: { commits: 99, stars: 16 },
      logo: "https://cdn.darkglance.in/portfolio/projects/dgupdater/logo.png",
      art: "terminal",
      size: "normal",
    },
    {
      id: "cyclictasks",
      name: "CyclicTasks",
      eyebrow: "Scheduler · Docker",
      oneLiner:
        "Keeps free-tier backends awake 24/7 with automated pulse pings.",
      description:
        "Scheduler that sends regular pulses to your server apps so they do not sleep on free hosting. Works with any framework or platform. Docker-ready.",
      tech: ["Python", "React", "Docker"],
      categories: ["Automation", "Open Source", "Tools"],
      license: "MIT",
      links: {
        github: "https://github.com/Ashif4354/CyclicTasks",
        live: "https://cyclictasks.darkglance.in/",
      },
      stats: { commits: 84, stars: 15 },
      logo: "https://cdn.darkglance.in/portfolio/projects/cyclictasks/logo.png",
      art: "pulse",
      size: "normal",
    },
    {
      id: "pagevision",
      name: "PageVision",
      eyebrow: "Browser Extension · AI",
      oneLiner:
        "Browser extension to run AI queries on any webpage using Gemini/Gemma or local Ollama models.",
      description:
        "Bring your own API key or run fully local with Ollama (auto-detects installed models). No tracking, no data collection, settings stored locally.",
      tech: ["Browser Extension", "React", "Gemini / Gemma", "Ollama"],
      categories: ["Automation", "Open Source", "Tools"],
      license: "MIT",
      links: {
        github: "https://github.com/Ashif4354/PageVision",
        live: "https://pagevision.darkglance.in/",
      },
      stats: { stars: 12 },
      logo: "https://cdn.darkglance.in/portfolio/projects/pagevision/logo.png",
      art: "vision",
      size: "normal",
    },
    {
      id: "dgbuzzer",
      name: "DGBuzzer",
      eyebrow: "Android · Google Play",
      oneLiner: "A simple buzzer app, live on Google Play.",
      description: "A simple buzzer app for Android.",
      tech: ["React Native", "Android"],
      categories: ["Mobile"],
      links: {
        github: "https://github.com/Ashif4354/DGBuzzer",
        live: "https://dgbuzzer.darkglance.in/",
        playStore: "https://play.google.com/store/apps/details?id=com.dgbuzzer",
      },
      stats: { stars: 13 },
      logo: "https://cdn.darkglance.in/portfolio/projects/dgbuzzer/logo.png",
      art: "buzzer",
      size: "normal",
    },
    {
      id: "tactoetic",
      name: "TacToeTic",
      eyebrow: "Realtime · Multiplayer",
      oneLiner:
        "Online multiplayer Tic-Tac-Toe. Create or join a room and play a friend in realtime.",
      description:
        "Online multiplayer Tic-Tac-Toe. Create or join a room and play a friend in realtime.",
      tech: ["Flask", "React"],
      categories: ["Web", "Open Source"],
      license: "MIT",
      links: {
        github: "https://github.com/Ashif4354/TacToeTic",
        live: "https://tactoetic.darkglance.in/",
      },
      stats: { stars: 13 },
      logo: "https://cdn.darkglance.in/portfolio/projects/tactoetic/logo.png",
      art: "grid",
      size: "normal",
    },
  ] satisfies Project[],
};

export const filters = [
  "All",
  "Automation",
  "Web",
  "Desktop",
  "Mobile",
  "Open Source",
  "Tools",
] as const;
