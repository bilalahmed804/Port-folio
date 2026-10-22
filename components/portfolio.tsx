"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { profile, projects } from "@/lib/portfolio";
import { Sticker } from "@/components/sticker";
import { About } from "@/components/about";
import { Work } from "@/components/work";
import { Experience } from "@/components/experience";
import { Toolkit } from "@/components/toolkit";

const nav = [{ label: "Home", href: "#home" }, { label: "About", href: "#about" }, { label: "Work", href: "#work" }, { label: "Experience", href: "#experience" }];

export function Portfolio() {
  const paperRef = useRef<HTMLElement>(null);
  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    window.history.replaceState(window.history.state, "", "#home");
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  useEffect(() => {
    const sections = Array.from(paperRef.current?.querySelectorAll<HTMLElement>(".stack-section") ?? []);
    const header = document.querySelector<HTMLElement>(".topbar");
    const updateStack = () => {
      const headerHeight = header?.offsetHeight ?? 76;
      sections.forEach((section) => {
        // Let tall content finish scrolling before pinning its bottom edge.
        const top = Math.min(headerHeight, window.innerHeight - section.offsetHeight);
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
    const sections = Array.from(paperRef.current?.querySelectorAll<HTMLElement>(":scope > section[id]") ?? []);
    const header = document.querySelector<HTMLElement>(".topbar");
    let frame = 0;
    const updateActive = () => {
      frame = 0;
      const headerBottom = header?.getBoundingClientRect().bottom ?? 76;
      const readingLine = headerBottom + (window.innerHeight - headerBottom) * .3;
      let current = "home";
      // Later sections cover earlier sticky pages, so the last matching section wins.
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= readingLine && rect.bottom > headerBottom) current = section.id;
      }
      const label = nav.find(item => item.href === `#${current}`)?.label ?? (current === "toolkit" ? "Experience" : "Contact");
      setActive(previous => previous === label ? previous : label);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(updateActive); };
    const observer = new ResizeObserver(schedule);
    sections.forEach(section => observer.observe(section));
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
  const project = projects.find((item) => item.id === selected);
  return <>
    <header className="topbar"><a href="#home" onClick={scrollToTop} className="brand" aria-label="Bilal Ahmed home">{profile.initials}</a><nav>{nav.map((item) => <a key={item.label} aria-current={active === item.label ? "location" : undefined} className={active === item.label ? "active" : ""} href={item.href} onClick={item.href === "#home" ? scrollToTop : undefined}>{item.label}</a>)}</nav><a className={`button button-orange header-cta ${active === "Contact" ? "contact-active" : ""}`} aria-current={active === "Contact" ? "location" : undefined} href="#contact">Let’s talk <span>↗</span></a><a className={`mobile-talk ${active === "Contact" ? "contact-active" : ""}`} aria-current={active === "Contact" ? "location" : undefined} href="#contact" aria-label="Contact">↗</a></header>
    <main ref={paperRef} className="paper">
      <section id="home" className="hero stack-section">
        <Sticker kind="pencil" className="hero-pencil float-a"/><Sticker kind="star" className="hero-star float-b"/><Sticker kind="bus" className="hero-bus float-c"/><Sticker kind="coin" className="hero-coin float-a"/><Sticker kind="mug" className="hero-mug float-b"/><Sticker kind="phone" className="hero-phone float-c"/><Sticker kind="bike" className="hero-bike float-b"/>
        <span className="hand hero-intro">Hi, I’m <span className="arrow-scribble">↘</span></span>
        <div className="hero-title-wrap"><span className="tag tag-pink tag-brand">React & Next.js</span><span className="tag tag-yellow tag-illustration">TypeScript</span><h1>{profile.name}</h1><span className="tag tag-green tag-frontend">MERN stack</span><span className="tag tag-blue tag-mobile">Mobile apps</span></div>
        <p className="hero-copy">I build responsive web experiences<br className="desktop-break"/> and mobile apps people can rely on.</p>
        <div className="hero-actions"><a className="button button-orange" href="#work">See my work <span>↘</span></a><p className="hand resume-note">My focus: <a href="#toolkit">web / mobile / MERN</a></p></div>
        <div className="availability"><span className="status-dot"/> Web & mobile developer <b>·</b> {profile.location} <b>·</b> PKT</div>
        <span className="hero-sticker-note hand">Made with a little extra joy ✳</span>
      </section>
      <About />
      <Work onOpen={setSelected} />
      <Experience />
      <Toolkit onOpen={setSelected} />
      <section id="contact" className="contact stack-section"><Sticker kind="star" className="contact-star float-b"/><div className="section-index">05 <span>— YOUR TURN</span></div><p className="hand eyebrow">Got a good feeling about this?</p><h2>Let’s make<br/>something <span>matter.</span></h2><p className="contact-copy">Have a project in mind, a role to discuss, or an idea to share? Reach me at bilalahmeddev409@gmail.com.</p><a className="button button-orange contact-button" href="mailto:bilalahmeddev409@gmail.com?subject=Hello%20Bilal">Say hello <span>↗</span></a><div className="social-links"><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`tel:${profile.phone}`}>Call +92 319 9244031 ↗</a></div><footer><a href="#home" onClick={scrollToTop} className="brand footer-brand">{profile.initials}</a><span>Designed with care & a little bit of doodling.</span><a href="#home" onClick={scrollToTop}>Back to top ↑</a><span>© 2026 {profile.name}</span></footer></section>
    </main>
    {project && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}><section className={`project-modal project-${project.color}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close project details">×</button><div className="modal-kicker">{project.number} / {project.kind}</div><h2 id="modal-title">{project.name}</h2><p className="modal-lead">{project.description}</p><p className="modal-detail">{project.detail}</p><div className="modal-tools">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div><p className="modal-footnote">{project.url ? <a href={project.url} target="_blank" rel="noreferrer">Visit the live project ↗</a> : project.id === "ride-sharing" ? "Personal demo project · No public link available." : "Contributed to development and deployment on Android and iOS."}</p></section></div>}
  </>;
}
