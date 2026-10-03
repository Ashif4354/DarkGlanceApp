"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Command as CommandIcon,
  Copy,
  Menu,
  Radio,
  Sparkles,
  X,
} from "lucide-react";
import { site, filters, type Project } from "@/data/site";
import type {
  Renderer as OGLRenderer,
  Mesh as OGLMesh,
  Triangle as OGLTriangle,
  Camera as OGLCamera,
  Program as OGLProgram,
} from "ogl";
import { useLongPress } from "@/hooks/useLongPress";
import { useEggs } from "@/components/eggs/EggProvider";
import {
  FruitHint,
  LogPose,
  Poneglyph,
  SnailPhone,
  useAudioBell,
} from "@/components/eggs/registry-components";

type Pulse = {
  stars: number;
  commits: number;
  starsById: Record<string, number>;
};
const nav = [
  ["About", "about"],
  ["Work", "work"],
  ["Stack", "stack"],
  ["Contact", "contact"],
];
const sectionName = (id: string) => (id === "home" ? "home" : id);

export function Portfolio({ pulse }: { pulse: Pulse }) {
  const {
    pirate,
    setPirate,
    openEgg,
    fragments,
    collectGlyph,
    observation,
    toggleObservation,
    toggleJoy,
    setStarTotal,
  } = useEggs();
  const [active, setActive] = useState("home"),
    [scrolled, setScrolled] = useState(false),
    [scrollProgress, setScrollProgress] = useState(0),
    [callAnswered, setCallAnswered] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [commandOpen, setCommandOpen] = useState(false),
    [selected, setSelected] = useState<Project | null>(null),
    [filter, setFilter] = useState<string>("All"),
    [hovered, setHovered] = useState<string | null>(null),
    [copied, setCopied] = useState(false),
    [role, setRole] = useState(0),
    [intro, setIntro] = useState(false),
    [cursor, setCursor] = useState({ x: -100, y: -100, show: false });
  const greetingCount = useRef(0),
    lastGreeting = useRef(0),
    reduceMotion = useReducedMotion();
  const bell = useAudioBell();
  const heroLongPress = useLongPress(() => openEgg("haki"), 1000, pirate);
  useEffect(() => setStarTotal(pulse.stars), [pulse.stars, setStarTotal]);
  const visibleProjects = useMemo(
    () =>
      site.projects.filter(
        (p) => filter === "All" || p.categories.includes(filter as never),
      ),
    [filter],
  );
  const scrollTo = useCallback(
    (id: string) => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" });
      setMobileOpen(false);
      setCommandOpen(false);
    },
    [reduceMotion],
  );
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.identity.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1700);
      import("sonner").then(({ toast }) =>
        toast.success("Email copied to clipboard"),
      );
    } catch {
      window.location.href = `mailto:${site.identity.email}`;
    }
  };
  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(true), 100);
    const cycle = window.setInterval(() => setRole((v) => (v + 1) % 3), 3200);
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      setScrollProgress(
        window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight || 1),
      );
      const sections = [
        ...document.querySelectorAll<HTMLElement>("[data-section]"),
      ];
      let current = "home";
      for (const s of sections) {
        if (s.getBoundingClientRect().top < window.innerHeight * 0.45)
          current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", key);
    if (pirate)
      console.log(
        "%c⚓ DarkGlance — Looking for the One Piece? Check the Poneglyphs. Also hi recruiters, darkglance.developer@gmail.com",
        "color:#ff9d43;font-weight:bold",
      );
    return () => {
      clearTimeout(timer);
      clearInterval(cycle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", key);
    };
  }, [pirate]);
  useEffect(() => {
    if (reduceMotion) return;
    let instance:
      { raf: (time: number) => void; destroy: () => void } | undefined;
    let active = true;
    import("lenis").then(({ default: Lenis }) => {
      if (!active) return;
      instance = new Lenis({ duration: 1.1, smoothWheel: true });
      const raf = (t: number) => {
        instance?.raf(t);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    });
    return () => {
      active = false;
      instance?.destroy();
    };
  }, [reduceMotion]);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setCursor({ x: e.clientX, y: e.clientY, show: true });
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    const onLeave = () => setCursor((c) => ({ ...c, show: false }));
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerout", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, []);
  useEffect(() => {
    if (!pirate) return;
    const onTouch = () => {
      const now = Date.now();
      greetingCount.current =
        now - lastGreeting.current < 850 ? greetingCount.current + 1 : 1;
      lastGreeting.current = now;
      if (greetingCount.current >= 5) {
        openEgg("wanted");
        greetingCount.current = 0;
      }
    };
    const el = document.querySelector("footer .brand-mark");
    el?.addEventListener("click", onTouch);
    return () => el?.removeEventListener("click", onTouch);
  }, [pirate, openEgg]);
  const projectOpen = (project: Project) => setSelected(project);
  const links = (project: Project) =>
    [
      { label: "GitHub", href: project.links.github },
      { label: "Live", href: project.links.live },
      { label: "Package", href: project.links.package },
      { label: "Play Store", href: project.links.playStore },
    ].filter((x) => x.href);
  const nextSection = () => {
    const ids = ["home", "about", "work", "stack", "pulse", "contact"];
    const next = ids[(ids.indexOf(active) + 1) % ids.length];
    scrollTo(next);
  };
  return (
    <>
      <div
        className="cursor-glow"
        style={{ left: cursor.x, top: cursor.y, opacity: cursor.show ? 1 : 0 }}
        aria-hidden="true"
      />
      <div
        className="cursor-dot"
        style={{ left: cursor.x, top: cursor.y, opacity: cursor.show ? 1 : 0 }}
        aria-hidden="true"
      />
      <IntroLoader />
      <div className="grain" aria-hidden="true" />
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#home" className="brand-mark" aria-label="DarkGlance home">
          <span className="brand-symbol">
            D<span>•</span>
          </span>
          <span className="brand-name">DarkGlance</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([label, id]) => (
            <button
              key={id}
              className={active === id ? "active" : ""}
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="command-hint"
            onClick={() => setCommandOpen(true)}
            aria-label="Open command menu"
          >
            <CommandIcon size={14} />
            <span>⌘ K</span>
          </button>
          <button
            className="mobile-menu-trigger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
          <a className="header-cta" href={`mailto:${site.identity.email}`}>
            Let’s talk <ArrowUpRight size={14} />
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="home" data-section>
          <HeroMesh reduceMotion={!!reduceMotion} />
          <div className="hero-vignette" />
          <div className={`hero-content ${intro ? "is-intro" : ""}`}>
            <div className="hero-kicker">
              <span className="status-pip" /> <span>INDEPENDENT DEVELOPER</span>
              <i /> CHENNAI, INDIA
            </div>
            <h1 {...heroLongPress}>
              <span className="hero-small">Hi, I’m Ashif.</span>
              <span className="hero-name">
                Dark<span>Glance</span>
                <b>.</b>
              </span>
            </h1>
            <div className="role-row">
              <span className="role-prefix">I’m a</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={role}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="role-word"
                >
                  {
                    ["FullStack Developer", "Builder", "Open-source tinkerer"][
                      role
                    ]
                  }
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="hero-description">{site.identity.tagline}</p>
            <div className="hero-buttons">
              <button
                className="button button-primary"
                onClick={() => scrollTo("work")}
              >
                Explore my work <ArrowDownRight size={16} />
              </button>
              <button
                className="button button-quiet"
                onClick={() => scrollTo("contact")}
              >
                Say hi <ArrowUpRight size={15} />
              </button>
            </div>
            <div className="hero-now">
              <span className="now-icon">
                <Radio size={15} />
              </span>
              <div>
                <span className="eyebrow">CURRENTLY BUILDING</span>
                <strong>Useful things, one commit at a time.</strong>
              </div>
              <span className="now-pulse" />
            </div>
          </div>
          <div className="hero-bottom">
            <span>SCROLL TO EXPLORE</span>
            <span className="scroll-line" />
            {pirate && (
              <Poneglyph index={0} onCollect={() => collectGlyph(0)} />
            )}
            <span className="hero-index">
              01 <i /> 06
            </span>
          </div>
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
        </section>

        <section className="section about-section" id="about" data-section>
          <div className="section-heading">
            <span className="eyebrow">
              <i /> A LITTLE ABOUT ME
            </span>
            <span className="section-count">01 / 05</span>
          </div>
          <div className="about-grid">
            <div className="about-copy">
              <h2>
                Curiosity is
                <br />
                my <em>career path.</em>
              </h2>
              <p>{site.identity.bio}</p>
              <a
                className="text-link"
                href={site.identity.links.github}
                target="_blank"
                rel="noreferrer"
              >
                A little more on GitHub <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="facts-grid">
              <article className="fact-card fact-location">
                <span className="fact-number">01</span>
                <span className="fact-icon">⌖</span>
                <span className="eyebrow">BASED IN</span>
                <strong>Chennai, India</strong>
                <span className="fact-caption">
                  A little corner of the internet.
                </span>
              </article>
              <article className="fact-card fact-python">
                <span className="fact-number">02</span>
                <span className="fact-icon">{`{ }`}</span>
                <span className="eyebrow">DEFAULT MODE</span>
                <strong>Python-first</strong>
                <span className="fact-caption">
                  But happy to switch stacks.
                </span>
              </article>
              <article className="fact-card fact-shipping">
                <span className="fact-number">03</span>
                <span className="fact-icon">↗</span>
                <span className="eyebrow">CURRENTLY</span>
                <strong>Always shipping</strong>
                <span className="fact-caption">
                  Small ideas deserve to get built.
                </span>
              </article>
              <article
                className="fact-card fact-onepiece"
                onClick={() => openEgg("wanted")}
              >
                <span className="fact-number">04</span>
                <span className="fact-icon">☠</span>
                <span className="eyebrow">OFFLINE INTEREST</span>
                <strong>One Piece fan</strong>
                <span className="fact-caption">
                  The adventure’s still going.
                </span>
              </article>
            </div>
          </div>
        </section>

        <section className="section projects-section" id="work" data-section>
          <div className="section-heading">
            <span className="eyebrow">
              <i /> SELECTED BUILDS
            </span>
            <span className="section-count">02 / 05</span>
          </div>
          <div className="projects-title-row">
            <div>
              <h2>
                Proof of <em>build.</em>
              </h2>
              <p>
                Some things I’ve made useful. Tap a card to take a closer look.
              </p>
            </div>
            <span className="work-count">
              <b>07</b> PROJECTS
              <br />
              AND COUNTING
            </span>
          </div>
          <Tabs.Root
            value={filter}
            onValueChange={setFilter}
            className="filter-tabs"
          >
            <Tabs.List aria-label="Filter projects">
              {filters.map((f) => (
                <Tabs.Trigger key={f} value={f}>
                  {f}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
          <motion.div layout className="project-grid">
            {visibleProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                stars={pulse.starsById[project.id]}
                pirate={pirate}
                onOpen={() => projectOpen(project)}
                onEgg={() => collectGlyph(1)}
              />
            ))}
          </motion.div>
          <div className="project-bottom-note">
            <span>BUILT WITH CURIOSITY</span>
            <span className="note-line" />
            <span>
              MORE ON{" "}
              <a
                href={site.identity.links.github}
                target="_blank"
                rel="noreferrer"
              >
                GITHUB <ArrowUpRight size={12} />
              </a>
            </span>
          </div>
        </section>

        <section className="section skills-section" id="stack" data-section>
          <div className="section-heading">
            <span className="eyebrow">
              <i /> TOOLS OF THE TRADE
            </span>
            <span className="section-count">03 / 05</span>
          </div>
          <div className="skills-intro">
            <h2>
              Things I <em>reach for.</em>
            </h2>
            <p>A growing toolbox. Never done adding to it.</p>
          </div>
          <div className="skill-marquees">
            <div className="marquee-row">
              <div className="marquee-track">
                {[
                  ...site.skills.strong,
                  ...site.skills.other,
                  ...site.skills.strong,
                  ...site.skills.other,
                ].map((skill, i) => (
                  <SkillChip
                    skill={skill}
                    key={`${skill}-${i}`}
                    onHover={() => setHovered(skill)}
                    onLeave={() => setHovered(null)}
                  />
                ))}
              </div>
            </div>
            <div className="marquee-row reverse">
              <div className="marquee-track">
                {[
                  ...site.skills.other,
                  ...site.skills.strong,
                  ...site.skills.other,
                  ...site.skills.strong,
                ].map((skill, i) => (
                  <SkillChip
                    skill={skill}
                    key={`${skill}-${i}`}
                    onHover={() => setHovered(skill)}
                    onLeave={() => setHovered(null)}
                  />
                ))}
              </div>
            </div>
          </div>
          {pirate && hovered && [...site.skills.strong].includes(hovered) && (
            <FruitHint skill={hovered} close={() => setHovered(null)} />
          )}
          <div className="learning-row">
            <span className="learning-label">
              <i /> CURRENTLY LEARNING
            </span>
            <div className="learning-skills">
              {site.skills.learning.map((x) => (
                <span key={x} title="Still training in the New World">
                  {x}
                  <b>↗</b>
                </span>
              ))}
            </div>
            <span className="learning-note">
              Still training in the New World <Sparkles size={13} />
            </span>
          </div>
        </section>

        <section className="section pulse-section" id="pulse" data-section>
          <div className="pulse-card">
            <div className="pulse-art">
              <div className="pulse-ring ring-a" />
              <div className="pulse-ring ring-b" />
              <div className="pulse-ring ring-c" />
              <span>DG</span>
            </div>
            <div className="pulse-info">
              <span className="eyebrow">
                <i /> OPEN SOURCE PULSE
              </span>
              <h2>
                Small commits.
                <br />
                <em>Real momentum.</em>
              </h2>
              <p>
                A live snapshot across public repositories. GitHub refreshes
                this data every hour.
              </p>
              <div className="pulse-stats">
                <div>
                  <strong>{pulse.stars}</strong>
                  <span>STARS</span>
                </div>
                <i />
                <div>
                  <strong>{pulse.commits.toLocaleString()}</strong>
                  <span>COMMITS*</span>
                </div>
                <small>*commit totals from project data</small>
              </div>
            </div>
            <div className="pulse-code">
              <span className="code-top">
                <i />
                <i />
                <i /> <b>github.pulse</b>
              </span>
              <code>
                <span className="code-muted">const</span> things = &#123;
                <br />
                <span className="code-key"> ideas</span>:{" "}
                <span className="code-string">&quot;made real&quot;</span>,
                <br />
                <span className="code-key"> status</span>:{" "}
                <span className="code-string">&quot;shipping&quot;</span>,<br />
                <span className="code-key"> stars</span>:{" "}
                <span className="code-number">{pulse.stars}</span>,<br />
                <span className="code-key"> next</span>:{" "}
                <span className="code-string">&quot;keep building&quot;</span>
                <br />
                &#125;;<span className="code-cursor">_</span>
              </code>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" data-section>
          <div className="contact-glow" />
          <div className="contact-top">
            <span className="eyebrow">
              <i /> HAVE A GOOD ONE?
            </span>
            <span className="section-count">05 / 05</span>
          </div>
          <div className="contact-content">
            <div className="contact-copy">
              <span className="eyebrow contact-label">
                THE NEXT GOOD THING STARTS HERE
              </span>
              <h2>
                Let’s build
                <br />
                something <em>useful.</em>
              </h2>
              <p>
                Have an idea, a project, or just want to say hi? My inbox is
                open.
              </p>
              <div className="contact-buttons">
                <a
                  href={`mailto:${site.identity.email}`}
                  className="button button-primary"
                >
                  Start a conversation <ArrowUpRight size={17} />
                </a>
                <button className="button button-outline" onClick={copyEmail}>
                  {copied ? <Check size={16} /> : <Copy size={15} />}{" "}
                  {copied ? "Copied" : "Copy email"}
                </button>
              </div>
              <div className="social-links">
                <a
                  href={site.identity.links.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <BrandIcon kind="github" />
                </a>
                <a
                  href={site.identity.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <BrandIcon kind="linkedin" />
                </a>
                <a
                  href={site.identity.links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <BrandIcon kind="instagram" />
                </a>
                <span className="social-divider" />
                <span className="social-note">
                  Usually replies within a day.
                </span>
              </div>
            </div>
            <div className={`snail-contact ${pirate ? "" : "no-egg"}`}>
              <div className="snail-label">
                <span className="eyebrow">INCOMING MESSAGE</span>
                <span className="snail-signal">
                  <i /> RINGING
                </span>
              </div>
              {pirate && (
                <SnailPhone
                  muted={bell.muted}
                  setMuted={bell.setMuted}
                  reveal={callAnswered}
                  onPick={() => {
                    bell.play();
                    setCallAnswered(true);
                    document
                      .getElementById("contact-email")
                      ?.classList.add("email-revealed");
                    document
                      .getElementById("contact-email")
                      ?.scrollIntoView({
                        block: "nearest",
                        behavior: "smooth",
                      });
                  }}
                />
              )}
              <span id="contact-email" className="contact-email">
                {site.identity.email}
              </span>
              <div className="snail-fine">
                DEN DEN MUSHI · DIRECT LINE TO ASHIF
              </div>
            </div>
          </div>
          <footer className="site-footer">
            <a
              className="brand-mark footer-brand"
              href="#home"
              aria-label="DarkGlance home"
            >
              <span className="brand-symbol">
                D<span>•</span>
              </span>
            </a>
            <a
              className="footer-jolly"
              href="#contact"
              onMouseEnter={(e) => e.currentTarget.classList.add("flag-show")}
              onClick={(e) => {
                e.preventDefault();
                openEgg("wanted");
              }}
              aria-label="DarkGlance original pirate flag"
            >
              <svg viewBox="0 0 46 40" aria-hidden="true">
                <path d="M9 37V4m0 2c12-7 19 6 31 0v21c-12 6-19-7-31 0" />
                <circle cx="23" cy="17" r="5" />
                <path d="m18 16-4-2m14 2 4-2M18 20l-5 2m15-2 5 2M21 15v-2m4 2v-2M20 23l-4 5m10-5 4 5" />
              </svg>
              <span>#OnePieceForever</span>
            </a>
            {pirate && (
              <span className="footer-psst">psst... try the Konami code</span>
            )}
            {pirate && (
              <Poneglyph index={2} onCollect={() => collectGlyph(2)} />
            )}
            <button className="footer-top" onClick={() => scrollTo("home")}>
              BACK TO TOP <ArrowUpRight size={13} />
            </button>
            <span>© {new Date().getFullYear()} DARKGLANCE</span>
          </footer>
        </section>
      </main>
      {pirate && (
        <LogPose
          progress={Math.min(scrollProgress, 1)}
          next={sectionName(
            ["home", "about", "work", "stack", "pulse", "contact"][
              (["home", "about", "work", "stack", "pulse", "contact"].indexOf(
                active,
              ) +
                1) %
                6
            ],
          )}
          onClick={nextSection}
        />
      )}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="sheet-overlay" />
          <Dialog.Content className="mobile-sheet">
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <div className="sheet-head">
              <a className="brand-mark" href="#home">
                <span className="brand-symbol">
                  D<span>•</span>
                </span>
                <span className="brand-name">DarkGlance</span>
              </a>
              <Dialog.Close className="sheet-close">
                <X />
              </Dialog.Close>
            </div>
            {nav.map(([label, id], i) => (
              <button key={id} onClick={() => scrollTo(id)}>
                <span>0{i + 1}</span>
                {label}
                <ArrowUpRight size={16} />
              </button>
            ))}
            <p>DESIGNED & BUILT IN CHENNAI</p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root open={commandOpen} onOpenChange={setCommandOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="command-overlay" />
          <Dialog.Content className="command-dialog">
            <Dialog.Title className="sr-only">Command menu</Dialog.Title>
            <Command label="Site commands">
              <div className="command-input-wrap">
                <CommandIcon size={17} />
                <Command.Input placeholder="What are you looking for?" />
                <kbd>ESC</kbd>
              </div>
              <Command.List>
                <Command.Empty>No results found.</Command.Empty>
                <Command.Group heading="NAVIGATION">
                  {nav.map(([label, id]) => (
                    <Command.Item key={id} onSelect={() => scrollTo(id)}>
                      <ArrowRight size={15} />
                      {label}
                      <span>Jump to section</span>
                    </Command.Item>
                  ))}
                  <Command.Item
                    onSelect={() => {
                      setCommandOpen(false);
                      setSelected(site.projects[0]);
                    }}
                  >
                    ◈ &nbsp;Open StreamStorm<span>Project preview</span>
                  </Command.Item>
                </Command.Group>
                <Command.Group heading="QUICK ACTIONS">
                  <Command.Item onSelect={copyEmail}>
                    <Copy size={15} />
                    Copy email<span>To clipboard</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() =>
                      window.open(site.identity.links.github, "_blank")
                    }
                  >
                    <BrandIcon kind="github" />
                    GitHub<span>Open profile</span>
                  </Command.Item>
                  <Command.Item onSelect={() => setPirate(!pirate)}>
                    ⚓ Pirate mode: {pirate ? "on" : "off"}
                    <span>{pirate ? "Eggs enabled" : "Eggs disabled"}</span>
                  </Command.Item>
                  {pirate && (
                    <Command.Group heading="SECRETS">
                      <Command.Item
                        onSelect={() => {
                          setCommandOpen(false);
                          openEgg("wanted");
                        }}
                      >
                        ???<span>A hidden poster</span>
                      </Command.Item>
                      <Command.Item onSelect={() => toggleJoy()}>
                        ✨ Gear 5<span>Joy mode · 15 sec</span>
                      </Command.Item>
                      <Command.Item
                        onSelect={() => {
                          setCommandOpen(false);
                          toggleObservation();
                        }}
                      >
                        ◎ {observation ? "Turn off" : "Observation Haki"}
                        <span>See everything</span>
                      </Command.Item>
                      <Command.Item onSelect={() => setCommandOpen(false)}>
                        Poneglyphs:{" "}
                        {fragments.toString(2).replace(/0/g, "").length}/3
                        <span>Secret quest</span>
                      </Command.Item>
                    </Command.Group>
                  )}
                </Command.Group>
              </Command.List>
              <div className="command-foot">
                <span>↑↓ NAVIGATE</span>
                <span>↵ SELECT</span>
                <span>ESC CLOSE</span>
              </div>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root
        open={!!selected}
        onOpenChange={(v) => !v && setSelected(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="project-overlay" />
          <Dialog.Content className="project-dialog">
            <Dialog.Close className="project-close" aria-label="Close project">
              <X />
            </Dialog.Close>
            {selected && (
              <>
                <div className={`dialog-art art-${selected.art}`}>
                  <span>{selected.eyebrow}</span>
                  <b>{selected.name}</b>
                  <div className="art-grid" />
                  <i className="art-orb" />
                </div>
                <div className="dialog-body">
                  <span className="eyebrow">
                    PROJECT · {selected.categories.join(" / ").toUpperCase()}
                  </span>
                  <h2>{selected.name}</h2>
                  <p>{selected.description}</p>
                  {selected.highlights && (
                    <div className="project-highlights">
                      {selected.highlights.map((item) => (
                        <span key={item}>✳ {item}</span>
                      ))}
                    </div>
                  )}
                  <div className="tech-list">
                    {selected.tech.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <div className="dialog-meta">
                    {selected.license && (
                      <span>
                        LICENSE <b>{selected.license}</b>
                      </span>
                    )}
                    {selected.stats?.commits && (
                      <span>
                        COMMITS <b>{selected.stats.commits}</b>
                      </span>
                    )}
                    {pulse.starsById[selected.id] !== undefined && (
                      <span>
                        GITHUB STARS <b>✳ {pulse.starsById[selected.id]}</b>
                      </span>
                    )}
                  </div>
                  <div className="dialog-links">
                    {links(selected).map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {l.label}
                        <ArrowUpRight size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function IntroLoader() {
  const [progress, setProgress] = useState(0),
    [visible, setVisible] = useState(true);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const pct = Math.min((now - start) / 760, 1);
      setProgress(Math.round(pct * 100));
      if (pct < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(() => setVisible(false), 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return visible ? (
    <div className="ship-loader" aria-hidden="true">
      <svg viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="23" />
        <circle cx="32" cy="32" r="8" />
        <path d="M32 2v15m0 30v15M2 32h15m30 0h15M11 11l11 11m20 20 11 11M53 11 42 22M22 42 11 53M24 32h16M32 24v16" />
      </svg>
      <span>SETTING SAIL… {progress}</span>
      <i />
    </div>
  ) : null;
}
function ProjectCard({
  project,
  index,
  stars,
  pirate,
  onOpen,
  onEgg,
}: {
  project: Project;
  index: number;
  stars?: number;
  pirate: boolean;
  onOpen: () => void;
  onEgg: () => void;
}) {
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.035 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setSpot({
          x: ((e.clientX - r.left) / r.width) * 100,
          y: ((e.clientY - r.top) / r.height) * 100,
        });
      }}
      className={`project-card card-${project.size} card-${project.id} art-${project.art}`}
      style={
        {
          "--spot-x": `${spot.x}%`,
          "--spot-y": `${spot.y}%`,
        } as React.CSSProperties
      }
    >
      <button
        className="card-hit"
        onClick={onOpen}
        aria-label={`View ${project.name} project`}
      >
        <div className="card-art">
          <span className="card-index">0{index + 1}</span>
          <span className="card-category">{project.eyebrow}</span>
          <div className="art-visual">
            <ArtVisual type={project.art} />
          </div>
          <span className="card-art-name">
            {project.name}
            <ArrowUpRight size={15} />
          </span>
          <span className="card-art-label">TODO: screenshot</span>
        </div>
        <div className="card-info">
          <div className="card-title-row">
            <div>
              <h3>{project.name}</h3>
              <p>{project.oneLiner}</p>
            </div>
            <span className="card-open">
              <ArrowUpRight size={18} />
            </span>
          </div>
          <div className="card-footer">
            <div className="card-tech">
              {project.tech.slice(0, 3).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            {stars !== undefined && (
              <span className="star-count" data-github-stars={stars}>
                ✳ {stars}
              </span>
            )}
          </div>
        </div>
      </button>
      {pirate && project.id === "ticketradar" && (
        <button
          className="glyph-on-card"
          onClick={(e) => {
            e.stopPropagation();
            onEgg();
          }}
          aria-label="Collect hidden Poneglyph fragment"
          title="A faint carved symbol"
        >
          ⌘
        </button>
      )}
    </motion.article>
  );
}
function ArtVisual({ type }: { type: string }) {
  if (type === "terminal")
    return (
      <div className="terminal-art">
        <span>
          <i />
          dgupdater&nbsp;&nbsp; 0.6.2
        </span>
        <code>
          <b>$</b> pip install dgupdater
          <br />
          <small>✓ ready to publish</small>
          <br />
          <b>$</b> dgupdater commit
        </code>
      </div>
    );
  if (type === "radar")
    return (
      <div className="radar-art">
        <span className="radar-circle c1" />
        <span className="radar-circle c2" />
        <span className="radar-circle c3" />
        <span className="radar-sweep" />
        <i className="ping p1" />
        <i className="ping p2" />
        <i className="ping p3" />
        <div className="alert-pings">
          <span>WA</span>
          <span>CALL</span>
          <span>SMS</span>
          <span>DC</span>
          <span>@</span>
        </div>
        <b>
          OPEN
          <br />
          SEATS
        </b>
      </div>
    );
  if (type === "pulse")
    return (
      <div className="pulse-art-small">
        <span>⟲</span>
        <i />
        <i />
        <i />
      </div>
    );
  if (type === "vision")
    return (
      <div className="vision-art">
        <span>AI</span>
        <i />
        <i />
        <i />
      </div>
    );
  if (type === "buzzer")
    return (
      <div className="buzzer-art">
        <span>●</span>
        <small>BUZZ!</small>
      </div>
    );
  if (type === "grid")
    return (
      <div className="grid-art">
        <span>×</span>
        <span>○</span>
        <span>×</span>
        <span>○</span>
        <span>×</span>
        <span>○</span>
        <span>×</span>
        <span>○</span>
        <span>×</span>
      </div>
    );
  return (
    <div className="stream-art">
      <div className="stream-window">
        <div className="stream-bar">
          <i />
          <i />
          <i />
          <b>LIVE DASHBOARD</b>
          <span>● LIVE</span>
        </div>
        <div className="stream-graph">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="stream-stats">
          <span>
            MESSAGES SENT<strong>2,481</strong>
          </span>
          <span>
            ACTIVE INSTANCES<strong>08</strong>
          </span>
          <span>
            AVG. RATE<strong>24.8/m</strong>
          </span>
        </div>
      </div>
      <span className="stream-orbit o1" />
      <span className="stream-orbit o2" />
    </div>
  );
}
function SkillChip({
  skill,
  onHover,
  onLeave,
}: {
  skill: string;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <button
      className="skill-chip"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onClick={onHover}
    >
      {skill}
      <span>✳</span>
    </button>
  );
}
function HeroMesh({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduceMotion || !ref.current) return;
    let renderer: OGLRenderer | undefined;
    let running = true,
      mesh: OGLMesh | undefined,
      scene: OGLTriangle | undefined,
      camera: OGLCamera | undefined,
      program: OGLProgram | undefined;
    let cleanup = () => {};
    import("ogl")
      .then(({ Renderer, Triangle, Program, Mesh, Vec2, Camera }) => {
        if (!running || !ref.current) return;
        renderer = new Renderer({
          alpha: true,
          antialias: false,
          dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        });
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);
        ref.current.appendChild(gl.canvas);
        const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
        const fragment = `precision highp float; uniform vec2 u_resolution; uniform float u_time; uniform vec2 u_mouse; void main(){vec2 uv=gl_FragCoord.xy/u_resolution; vec3 col=vec3(.012,.006,.008); float t=u_time*.045; float left=exp(-distance(uv,vec2(.15+sin(t)*.03,.61)) * 3.4); float amber=exp(-distance(uv,vec2(.69+cos(t*.7)*.025,.49)) * 3.1); float pink=exp(-distance(uv,vec2(.28,.35+sin(t*.8)*.02))*3.7); float rose=exp(-distance(uv,vec2(.78,.78))*4.5); float mouse=exp(-distance(uv,u_mouse)*5.0); col+=vec3(1.,.16,.015)*left*.67; col+=vec3(1.,.51,.008)*amber*.65; col+=vec3(.89,.08,.31)*pink*.54; col+=vec3(.55,.13,.32)*rose*.4; col+=vec3(1.,.2,.04)*mouse*.08; col*=smoothstep(-.05,.85,uv.y); gl_FragColor=vec4(col,1.);}`;
        scene = new Triangle(gl);
        camera = new Camera(gl);
        program = new Program(gl, {
          vertex,
          fragment,
          uniforms: {
            u_time: { value: 0 },
            u_resolution: { value: new Vec2(1, 1) },
            u_mouse: { value: new Vec2(0.5, 0.5) },
          },
        });
        mesh = new Mesh(gl, { geometry: scene, program });
        const resize = () => {
          const b = ref.current!.getBoundingClientRect();
          renderer!.setSize(b.width, b.height);
          program!.uniforms.u_resolution.value.set(
            b.width * renderer!.dpr,
            b.height * renderer!.dpr,
          );
        };
        resize();
        const mouse = (e: PointerEvent) => {
          const b = ref.current!.getBoundingClientRect();
          program!.uniforms.u_mouse.value.set(
            e.clientX / b.width,
            1 - e.clientY / b.height,
          );
        };
        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", mouse);
        const observer = new IntersectionObserver(([entry]) => {
          document.documentElement.dataset.heroVisible = entry.isIntersecting
            ? "yes"
            : "no";
        });
        observer.observe(ref.current!);
        let raf = 0;
        const draw = (time: number) => {
          if (!running) return;
          if (
            !document.hidden &&
            document.documentElement.dataset.heroVisible !== "no"
          ) {
            program!.uniforms.u_time.value = time * 0.001;
            renderer!.render({ scene: mesh!, camera: camera! });
          }
          raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
        cleanup = () => {
          cancelAnimationFrame(raf);
          observer.disconnect();
          window.removeEventListener("resize", resize);
          window.removeEventListener("pointermove", mouse);
          gl.canvas.remove();
          gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
      })
      .catch(() => {});
    return () => {
      running = false;
      cleanup();
    };
  }, [reduceMotion]);
  return (
    <div
      ref={ref}
      className={`hero-mesh ${reduceMotion ? "mesh-static" : ""}`}
      aria-hidden="true"
    />
  );
}

function BrandIcon({ kind }: { kind: "github" | "linkedin" | "instagram" }) {
  if (kind === "github")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.61 1.22 3.25.93.1-.73.4-1.23.71-1.52-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.43-2.22 1.16-3-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.69.11 2.98.73.78 1.16 1.78 1.16 3 0 4.3-2.61 5.24-5.1 5.52.4.35.76 1.03.76 2.08v3.12c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"
        />
      </svg>
    );
  if (kind === "linkedin")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M5.2 3.3a2.1 2.1 0 1 1-4.2 0 2.1 2.1 0 0 1 4.2 0ZM1.3 7h3.7v15.2H1.3zm6 0h3.6v2.1h.1c.5-1 1.8-2.2 3.8-2.2 4 0 4.8 2.6 4.8 6v9.3h-3.8V14c0-2-.1-4.5-2.7-4.5s-3.1 2.1-3.1 4.4v8.3H7.3Z"
        />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4Zm9.8 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
      />
    </svg>
  );
}
