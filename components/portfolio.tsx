"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { profile, projects } from "@/lib/portfolio";
import { Sticker } from "@/components/sticker";
import { About } from "@/components/about";
import { Work } from "@/components/work";
import { Experience } from "@/components/experience";
import { Toolkit } from "@/components/toolkit";

const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
];

export function Portfolio() {
  const paperRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const mobile = window.matchMedia("(max-width: 639px)");
    const closeOnResize = () => { if (!mobile.matches) setMenuOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    mobile.addEventListener("change", closeOnResize);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      mobile.removeEventListener("change", closeOnResize);
    };
  }, [menuOpen]);

  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false);
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    window.history.replaceState(window.history.state, "", "#home");
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  useEffect(() => {
    const sections = Array.from(
      paperRef.current?.querySelectorAll<HTMLElement>(".stack-section") ?? [],
    );
    const header = document.querySelector<HTMLElement>(".topbar");
    const updateStack = () => {
      const headerHeight = header?.offsetHeight ?? 76;
      sections.forEach((section) => {
        // Let tall content finish scrolling before pinning its bottom edge.
        const top = Math.min(
          headerHeight,
          window.innerHeight - section.offsetHeight,
        );
        section.style.setProperty("--stack-top", `${top}px`);
      });
    };
    const observer = new ResizeObserver(updateStack);
    sections.forEach((section) => observer.observe(section));
    if (header) observer.observe(header);
    window.addEventListener("resize", updateStack);
    updateStack();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateStack);
    };
  }, []);
  const [active, setActive] = useState("Home");
  useEffect(() => {
    const sections = Array.from(
      paperRef.current?.querySelectorAll<HTMLElement>(":scope > section[id]") ??
        [],
    );
    const header = document.querySelector<HTMLElement>(".topbar");
    let frame = 0;
    const updateActive = () => {
      frame = 0;
      const headerBottom = header?.getBoundingClientRect().bottom ?? 76;
      const readingLine =
        headerBottom + (window.innerHeight - headerBottom) * 0.3;
      let current = "home";
      // Later sections cover earlier sticky pages, so the last matching section wins.
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= readingLine && rect.bottom > headerBottom)
          current = section.id;
      }
      const label =
        nav.find((item) => item.href === `#${current}`)?.label ??
        (current === "toolkit" ? "Experience" : "Contact");
      setActive((previous) => (previous === label ? previous : label));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updateActive);
    };
    const observer = new ResizeObserver(schedule);
    sections.forEach((section) => observer.observe(section));
    if (header) observer.observe(header);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    updateActive();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, []);

  const [selected, setSelected] = useState<string | null>(null);
  const modalRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!selected || !modalRef.current) return;
    const modal = modalRef.current;
    const compact = window.matchMedia("(max-width: 1023px)");
    let release: (() => void) | undefined;
    const sync = () => {
      if (!compact.matches) {
        release?.();
        release = undefined;
        return;
      }
      if (release) return;
      const previousFocus = document.activeElement;
      const bodyOverflow = document.body.style.overflow;
      const rootOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      const focusable = () => Array.from(modal.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(element => element.getClientRects().length > 0);
      const focusFirst = () => (focusable()[0] ?? modal).focus({ preventScroll: true });
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          setSelected(null);
        } else if (event.key === "Tab") {
          const elements = focusable();
          const first = elements[0];
          const last = elements.at(-1);
          if (!first || !last) { event.preventDefault(); modal.focus({ preventScroll: true }); return; }
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      };
      const onFocus = (event: FocusEvent) => {
        if (event.target instanceof Node && !modal.contains(event.target)) focusFirst();
      };
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("focusin", onFocus);
      focusFirst();
      release = () => {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("focusin", onFocus);
        document.body.style.overflow = bodyOverflow;
        document.documentElement.style.overflow = rootOverflow;
        if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
      };
    };
    sync();
    compact.addEventListener("change", sync);
    return () => { compact.removeEventListener("change", sync); release?.(); };
  }, [selected]);
  const project = projects.find((item) => item.id === selected);
  return (
    <>
      <header ref={headerRef} className="topbar" data-menu-open={menuOpen}>
        <a
          href="#home"
          onClick={scrollToTop}
          className="brand"
          aria-label="Bilal Ahmed home"
        >
          {profile.initials}
        </a>
        <button
          ref={menuButtonRef}
          type="button"
          className="mobile-menu-toggle hidden"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="portfolio-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {menuOpen ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <nav id="portfolio-navigation" aria-label="Main navigation">
          {nav.map((item) => (
            <a
              key={item.label}
              aria-current={active === item.label ? "location" : undefined}
              className={active === item.label ? "active" : ""}
              href={item.href}
              onClick={(event) => {
                setMenuOpen(false);
                if (item.href === "#home") scrollToTop(event);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className={`button button-orange header-cta ${active === "Contact" ? "contact-active" : ""}`}
          aria-current={active === "Contact" ? "location" : undefined}
          href="#contact"
        >
          Let’s talk <span>↗</span>
        </a>
        <a
          className={`mobile-talk ${active === "Contact" ? "contact-active" : ""}`}
          aria-current={active === "Contact" ? "location" : undefined}
          href="#contact"
          aria-label="Contact"
          onClick={() => setMenuOpen(false)}
        >
          ↗
        </a>
      </header>
      <main ref={paperRef} className="paper">
        <section id="home" className="hero stack-section">
          <Sticker kind="pencil" className="hero-pencil float-a" />
          <Sticker kind="star" className="hero-star float-b" />
          <Sticker kind="bus" className="hero-bus float-c" />
          <Sticker kind="coin" className="hero-coin float-a" />
          <Sticker kind="mug" className="hero-mug float-b" />
          <Sticker kind="phone" className="hero-phone float-c" />
          <Sticker kind="bike" className="hero-bike float-b" />
          <span className="hand hero-intro">
            Hi, I’m <span className="arrow-scribble">↘</span>
          </span>
          <div className="hero-title-wrap">
            <span className="tag tag-pink tag-brand">React & Next.js</span>
            <span className="tag tag-yellow tag-illustration">TypeScript</span>
            <h1>{profile.name}</h1>
            <span className="tag tag-green tag-frontend">MERN stack</span>
            <span className="tag tag-blue tag-mobile">Mobile apps</span>
          </div>
          <p className="hero-copy">
            I build responsive web experiences
            <br className="desktop-break" /> and mobile apps people can rely on.
          </p>
          <div className="hero-actions">
            <a className="button button-orange" href="#work">
              See my work <span>↘</span>
            </a>
            <p className="hand resume-note">
              My focus: <a href="#toolkit">web / mobile / MERN</a>
            </p>
          </div>
          <div className="availability">
            <span className="status-dot" /> Web & mobile developer <b>·</b>{" "}
            {profile.location} <b>·</b> PKT
          </div>
          <span className="hero-sticker-note hand">
            Made with a little extra joy ✳
          </span>
        </section>
        <About />
        <Work onOpen={setSelected} />
        <Experience />
        <Toolkit onOpen={setSelected} />
        <section id="contact" className="contact stack-section">
          <Sticker kind="star" className="contact-star float-b" />
          <div className="section-index">
            05 <span>— YOUR TURN</span>
          </div>
          <p className="hand eyebrow">Got a good feeling about this?</p>
          <h2>
            Let’s make
            <br />
            something <span>matter.</span>
          </h2>
          <p className="contact-copy">
            Have a project in mind, a role to discuss, or an idea to share?
            Reach me at bilalahmeddev409@gmail.com.
          </p>
          <a
            className="button button-orange contact-button"
            href="mailto:bilalahmeddev409@gmail.com?subject=Hello%20Bilal"
          >
            Say hello <span>↗</span>
          </a>
          <div className="social-links">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a href={`tel:${profile.phone}`}>Call +92 319 9244031 ↗</a>
          </div>
          <footer>
            <a
              href="#home"
              onClick={scrollToTop}
              className="brand footer-brand"
            >
              {profile.initials}
            </a>
            <span>Designed with care & a little bit of doodling.</span>
            <a href="#home" onClick={scrollToTop}>
              Back to top ↑
            </a>
            <span>© 2026 {profile.name}</span>
          </footer>
        </section>
      </main>
      {project && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setSelected(null)}
        >
          <section
            ref={modalRef}
            className={`project-modal project-${project.color}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close project details"
            >
              ×
            </button>
            <div className="modal-kicker">
              {project.number} / {project.kind}
            </div>
            <h2 id="modal-title">{project.name}</h2>
            <p id="modal-description" className="modal-lead">{project.description}</p>
            <p className="modal-detail">{project.detail}</p>
            <div className="modal-tools">
              {project.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
            <p className="modal-footnote">
              {project.url ? (
                <a href={project.url} target="_blank" rel="noreferrer">
                  Visit the live project ↗
                </a>
              ) : project.id === "ride-sharing" ? (
                "Personal demo project · No public link available."
              ) : (
                "Contributed to development and deployment on Android and iOS."
              )}
            </p>
          </section>
        </div>
      )}
    </>
  );
}
