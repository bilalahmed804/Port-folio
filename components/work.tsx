"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/lib/portfolio";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));


export function Work({ onOpen }: { onOpen: (id: string) => void }) {
  const scene = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!scene.current || !stage.current) return;
      const top = parseFloat(getComputedStyle(stage.current).top) || 0;
      const distance = Math.max(1, scene.current.offsetHeight - stage.current.offsetHeight);
      const position = clamp((top - scene.current.getBoundingClientRect().top) / distance, 0, 1) * (projects.length - 1);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const selected = Math.round(position);
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
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  const goTo = (index: number) => {
    if (!scene.current || !stage.current) return;
    const top = parseFloat(getComputedStyle(stage.current).top) || 0;
    const distance = scene.current.offsetHeight - stage.current.offsetHeight;
    const start = window.scrollY + scene.current.getBoundingClientRect().top - top;
    window.scrollTo({ top: start + distance * clamp(index, 0, projects.length - 1) / Math.max(1, projects.length - 1), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return <section id="work" ref={scene} className="creative-desk" style={{ height: `${Math.max(340, projects.length * 100)}svh` }} aria-labelledby="work-title">
    <div ref={stage} className="desk-stage">
      <header className="desk-heading"><div><span className="desk-eyebrow">02 / THE CREATIVE DESK</span><h2 id="work-title">From sketch<br/>to <em>shipped.</em></h2></div><div className="desk-heading-note"><span className="desk-asterisk" aria-hidden="true">✳</span><p>Web, mobile, and the work behind them.<br/>Scroll to turn the sheets <span aria-hidden="true">↘</span></p></div></header>
      <div className="desk-surface" role="region" aria-roledescription="carousel" aria-label="Project sheets" tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); goTo(active + (event.key === "ArrowRight" ? 1 : -1)); } }}>
        <div className="desk-sheet-stack">
          {projects.map((project, index) => <article key={project.id} ref={(element) => { cards.current[index] = element; }} className={`desk-sheet project-${project.color}`} aria-hidden={index !== active} inert={index !== active} aria-label={`${index + 1} of ${projects.length}: ${project.name}`}>
            <div className="sheet-meta"><span><b>FIELD NOTES</b> / PROJECT {project.number}</span><span>{project.id === "ride-sharing" ? "DEMO PROJECT" : "SELECTED PROJECT"}</span></div>
            <div className="sheet-body">
              <div className="desk-art"><span className="desk-tape" aria-hidden="true"/><div className={`desk-browser browser-${project.id}`} aria-hidden="true"><div className="desk-browser-toolbar"><i/><i/><i/><span>{project.name} / illustrated preview</span><b>↗</b></div><div className="desk-preview"><div className="preview-nav"><b>{project.name.toLowerCase()}<sup>®</sup></b><span>Web & mobile development</span></div><h4>{project.headline}</h4>{project.id === "ride-sharing" ? <div className="preview-finance"><span>LIVE RIDE STATUS</span><strong>On the way<small>Live tracking ↗</small></strong><div className="finance-bars">{[30,45,40,65,55,80,95].map((height,i)=><i key={i} style={{height:`${height}%`}}/>)}</div></div> : project.id === "casa" ? <div className="preview-brand-art"><span>C.</span><i>✳</i><small>RESPONSIVE / CONTENT / COMMERCE</small></div> : <div className="preview-planner"><span>CONNECTED EXPERIENCES <b>☀</b></span><p>✓ Connected interfaces</p><p>○ Application workflows</p><p>○ Mobile & web access</p></div>}</div></div><div className="desk-handnote">{project.note} <span aria-hidden="true">↗</span></div><div className="desk-swatches" aria-hidden="true"><i/><i/><i/><span>the little details.</span></div></div>
              <div className="desk-story"><div className="desk-project-kind">{project.kind}</div><h3>{project.name}<span>↗</span></h3><dl>{(["problem","role","result"] as const).map((key,i)=><div key={key}><dt><span>0{i+1}</span>{key === "role" ? "My role" : key}</dt><dd>{project[key]}</dd></div>)}</dl><div className="desk-tools">{project.tools.map(tool=><span key={tool}>{tool}</span>)}</div><button className="desk-open" onClick={()=>onOpen(project.id)}>Open project notes <span>↗</span></button></div>
            </div>
            <footer className="sheet-footer"><span>ILLUSTRATED PREVIEW · PROJECT DETAILS FROM MY CV</span><span>{project.number} / {String(projects.length).padStart(2,"0")}</span></footer>
          </article>)}
        </div>
      </div>
      <div className="desk-controls"><div className="desk-folders" role="group" aria-label="Choose a project">{projects.map((project,index)=><button key={project.id} className={`desk-folder project-${project.color}`} aria-pressed={active === index} onClick={()=>goTo(index)}><span>{project.number}</span>{project.name}<i aria-hidden="true">↗</i></button>)}</div><div className="desk-arrows"><button disabled={active===0} onClick={()=>goTo(active-1)} aria-label="Previous project">←</button><span aria-live="polite">{String(active+1).padStart(2,"0")} / {String(projects.length).padStart(2,"0")}</span><button disabled={active===projects.length-1} onClick={()=>goTo(active+1)} aria-label="Next project">→</button></div></div>
    </div>
  </section>;
}
