"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects } from "@/lib/portfolio";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));


export function Work({ onOpen }: { onOpen: (id: string) => void }) {
  const scene = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [compactLayout, setCompactLayout] = useState(false);
  const folders = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(0);
  const requestedIndex = useRef(0);
  const previousIndex = useRef(0);
  const switching = useRef(false);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  useLayoutEffect(() => {
    const previous = previousIndex.current;
    previousIndex.current = active;
    if (!compactLayout || previous === active) {
      switching.current = false;
      requestedIndex.current = active;
      return;
    }
    switching.current = true;
    const direction = active > previous ? 1 : -1;
    const outgoing = cards.current[previous];
    const incoming = cards.current[active];
    const animations: Animation[] = [];
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Only the compact layout uses these short paper movements. Desktop stays scroll-driven.
      if (outgoing) animations.push(outgoing.animate([
        { visibility: "visible", opacity: 1, transform: "translateX(0) rotate(0deg)", zIndex: 5 },
        { visibility: "visible", opacity: 0, transform: `translateX(${-direction * 8}px) rotate(${-direction * .35}deg)`, zIndex: 5 },
      ], { duration: 170, easing: "ease-in", fill: "both" }));
      if (incoming) animations.push(incoming.animate([
        { opacity: 0, transform: `translateX(${direction * 6}px) rotate(${direction * .2}deg)` },
        { opacity: 1, transform: "translateX(0) rotate(0deg)" },
      ], { duration: 280, delay: 60, easing: "cubic-bezier(.2,.7,.3,1)", fill: "both" }));
    }
    let cancelled = false;
    void Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
      if (cancelled) return;
      animations.forEach(animation => animation.cancel());
      switching.current = false;
      // Coalesce repeated input into the latest requested destination.
      if (requestedIndex.current !== activeIndex.current) {
        switching.current = true;
        activeIndex.current = requestedIndex.current;
        setActive(activeIndex.current);
      }
    });
    return () => {
      cancelled = true;
      animations.forEach(animation => animation.cancel());
      switching.current = false;
    };
  }, [active, compactLayout]);

  useEffect(() => {
    if (!compactLayout || !folders.current) return;
    const row = folders.current;
    const tab = row.children[active] as HTMLElement | undefined;
    if (!tab) return;
    const bounds = row.getBoundingClientRect();
    const selected = tab.getBoundingClientRect();
    row.scrollTo({ left: row.scrollLeft + selected.left - bounds.left - (row.clientWidth - selected.width) / 2, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, [active, compactLayout]);

  useEffect(() => {
    let frame = 0;
    const compact = window.matchMedia("(max-width: 1023px)");
    let wasCompact: boolean | undefined;
    const update = () => {
      frame = 0;
      if (!scene.current || !stage.current) return;
      if (wasCompact !== compact.matches) {
        setCompactLayout(compact.matches);
        wasCompact = compact.matches;
        if (compact.matches) cards.current.forEach(card => {
          if (!card) return;
          ["transform", "opacity", "visibility", "z-index"].forEach(property => card.style.removeProperty(property));
        });
      }
      if (compact.matches) {
        return;
      }
      const top = parseFloat(getComputedStyle(stage.current).top) || 0;
      const distance = Math.max(1, scene.current.offsetHeight - stage.current.offsetHeight);
      const position = clamp((top - scene.current.getBoundingClientRect().top) / distance, 0, 1) * (projects.length - 1);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const selected = Math.round(position);
      activeIndex.current = selected;
      requestedIndex.current = selected;
      setActive(selected);
      cards.current.forEach((card, index) => {
        if (!card) return;
        const offset = index - position;
        const exit = clamp(-offset, 0, 1);
        const underneath = clamp(offset, 0, 2);
        card.style.transform = reduced ? "none" : `translate3d(${-exit * 125}%, ${underneath * 12 - exit * 20}px, 0) rotate(${-exit * 15 + underneath * 1.5}deg) scale(${1 - underneath * .025})`;
        card.style.opacity = reduced ? String(index === selected ? 1 : 0) : String(offset < -1 ? 0 : 1);
        card.style.zIndex = String(projects.length - index);
        card.style.visibility = reduced && index !== selected || offset < -1 ? "hidden" : "visible";
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    if (scene.current) observer.observe(scene.current);
    if (stage.current) observer.observe(stage.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    compact.addEventListener("change", schedule);
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); compact.removeEventListener("change", schedule); };
  }, []);

  const goTo = (index: number) => {
    if (!scene.current || !stage.current) return;
    if (window.matchMedia("(max-width: 1023px)").matches) {
      const selected = clamp(index, 0, projects.length - 1);
      requestedIndex.current = selected;
      if (switching.current || selected === activeIndex.current) return;
      switching.current = true;
      activeIndex.current = selected;
      setActive(selected);
      return;
    }
    const top = parseFloat(getComputedStyle(stage.current).top) || 0;
    const distance = scene.current.offsetHeight - stage.current.offsetHeight;
    const start = window.scrollY + scene.current.getBoundingClientRect().top - top;
    window.scrollTo({ top: start + distance * clamp(index, 0, projects.length - 1) / Math.max(1, projects.length - 1), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  const moveBy = (direction: number) => goTo((window.matchMedia("(max-width: 1023px)").matches ? requestedIndex.current : active) + direction);

  return <section id="work" ref={scene} className="creative-desk" style={{ height: `${Math.max(340, projects.length * 100)}svh` }} aria-labelledby="work-title">
    <div ref={stage} className="desk-stage">
      <header className="desk-heading"><div><span className="desk-eyebrow">02 / THE CREATIVE DESK</span><h2 id="work-title">From idea<br/>to <em>delivery.</em></h2></div><div className="desk-heading-note"><span className="desk-asterisk" aria-hidden="true">✳</span><p>Web and mobile projects, and the work behind them.<br/>Scroll to explore the projects <span aria-hidden="true">↘</span></p></div></header>
      <div className="desk-surface" role="region" aria-roledescription="carousel" aria-label="Project sheets" tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); moveBy(event.key === "ArrowRight" ? 1 : -1); } }}
        onTouchStart={(event) => {
          touchStart.current = null;
          if (!compactLayout || event.touches.length !== 1 || (event.target instanceof Element && event.target.closest("a, button"))) return;
          const touch = event.touches[0];
          if (touch.clientX < 24 || touch.clientX > window.innerWidth - 24) return;
          touchStart.current = { x: touch.clientX, y: touch.clientY, time: performance.now() };
        }}
        onTouchMove={(event) => {
          const start = touchStart.current;
          if (!start) return;
          if (event.touches.length !== 1) { touchStart.current = null; return; }
          const touch = event.touches[0];
          if (Math.abs(touch.clientY - start.y) > Math.max(12, Math.abs(touch.clientX - start.x))) touchStart.current = null;
        }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || !compactLayout || event.changedTouches.length !== 1) return;
          const touch = event.changedTouches[0];
          const dx = touch.clientX - start.x;
          const dy = touch.clientY - start.y;
          if (performance.now() - start.time < 800 && Math.abs(dx) >= 56 && Math.abs(dx) > Math.abs(dy) * 1.6) moveBy(dx < 0 ? 1 : -1);
        }}>
        <div className="desk-sheet-stack">
          {projects.map((project, index) => <article key={project.id} ref={(element) => { cards.current[index] = element; }} className={`desk-sheet project-${project.color}`} data-active={index === active} aria-hidden={index !== active} inert={index !== active} aria-label={`${index + 1} of ${projects.length}: ${project.name}`}>
            <div className="sheet-meta"><span><b>FIELD NOTES</b> / PROJECT {project.number}</span><span>{project.id === "ride-sharing" ? "DEMO PROJECT" : "SELECTED PROJECT"}</span></div>
            <div className="sheet-body">
              <div className="desk-art"><span className="desk-tape" aria-hidden="true"/><div className={`desk-browser browser-${project.id}`} aria-hidden="true"><div className="desk-browser-toolbar"><i/><i/><i/><span>{project.name} / illustrated preview</span><b>↗</b></div><div className="desk-preview"><div className="preview-nav"><b>{project.name}</b><span>Web & mobile development</span></div><h4>{project.headline}</h4>{project.id === "ride-sharing" ? <div className="preview-finance"><span>LIVE RIDE STATUS</span><strong>On the way<small>Live tracking ↗</small></strong><div className="finance-bars">{[30,45,40,65,55,80,95].map((height,i)=><i key={i} style={{height:`${height}%`}}/>)}</div></div> : project.id === "casa" ? <div className="preview-brand-art"><span>C.</span><i>✳</i><small>RESPONSIVE / CONTENT / COMMERCE</small></div> : <div className="preview-planner"><span>CONNECTED EXPERIENCES <b>☀</b></span><p>✓ Connected interfaces</p><p>○ Application workflows</p><p>○ Mobile & web access</p></div>}</div></div><div className="desk-handnote">{project.note} <span aria-hidden="true">↗</span></div><div className="desk-swatches" aria-hidden="true"><i/><i/><i/><span>the little details.</span></div></div>
              <div className="desk-story"><div className="desk-project-kind">{project.kind}</div><h3>{project.name}<span>↗</span></h3><dl>{(["problem","role","result"] as const).map((key,i)=><div key={key}><dt><span>0{i+1}</span>{key === "role" ? "My role" : key}</dt><dd>{project[key]}</dd></div>)}</dl><div className="desk-tools">{project.tools.map(tool=><span key={tool}>{tool}</span>)}</div><button className="desk-open" onClick={()=>onOpen(project.id)}>Open project notes <span>↗</span></button></div>
            </div>
            <footer className="sheet-footer"><span>ILLUSTRATED PREVIEW · PROJECT DETAILS FROM MY CV</span><span>{project.number} / {String(projects.length).padStart(2,"0")}</span></footer>
          </article>)}
        </div>
      </div>
      <div className="desk-controls"><div ref={folders} className="desk-folders" role="group" aria-label="Choose a project">{projects.map((project,index)=><button key={project.id} className={`desk-folder project-${project.color}`} aria-pressed={active === index} onClick={()=>goTo(index)}><span>{project.number}</span>{project.name}<i aria-hidden="true">↗</i></button>)}</div><div className="desk-arrows"><button disabled={active===0} onClick={()=>moveBy(-1)} aria-label="Previous project">←</button><span aria-live="polite">{String(active+1).padStart(2,"0")} / {String(projects.length).padStart(2,"0")}</span><button disabled={active===projects.length-1} onClick={()=>moveBy(1)} aria-label="Next project">→</button></div></div>
    </div>
  </section>;
}
