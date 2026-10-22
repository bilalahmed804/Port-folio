"use client";

import { useEffect, useRef, useState } from "react";
import { experience, education, certifications } from "@/lib/experience";
import { profile } from "@/lib/portfolio";

export function Experience() {
  const section = useRef<HTMLElement>(null);
  const entries = useRef<(HTMLElement | null)[]>([]);
  const progress = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(experience[0].id);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const anchor = window.innerHeight * .45;
      let nearest = 0;
      let distance = Infinity;
      entries.current.forEach((entry, index) => {
        if (!entry) return;
        const rect = entry.getBoundingClientRect();
        const delta = Math.abs(rect.top + Math.min(rect.height / 2, 100) - anchor);
        if (delta < distance) { distance = delta; nearest = index; }
      });
      setActive(nearest);
      const first = entries.current[0]?.getBoundingClientRect();
      const last = entries.current.at(-1)?.getBoundingClientRect();
      if (first && last && progress.current) {
        const value = Math.max(0, Math.min(1, (anchor - first.top) / Math.max(1, last.bottom - first.top)));
        progress.current.style.transform = `scaleY(${value})`;
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    entries.current.forEach(entry => { if (entry) observer.observe(entry); });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  const navigate = (index: number) => {
    setActive(index);
    entries.current[index]?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return <section id="experience" ref={section} className="career-chapters" aria-labelledby="career-title">
    <div className="career-layout">
      <aside className="career-intro">
        <span className="career-eyebrow">03 / THE CAREER PASSPORT</span>
        <h2 id="career-title">Places I’ve built.<br/><em>Things I’ve learned.</em></h2>
        <p>A few stops along the way. Each one bringing a new perspective to the work I do today.</p>
        <div className="passport-cover">
          <div className="passport-cover-border">
            <div className="passport-cover-top"><span>CREATIVE PROFESSIONAL</span><span>NO. 003</span></div>
            <svg className="passport-emblem" viewBox="0 0 100 100" fill="none" aria-hidden="true"><circle cx="50" cy="50" r="36"/><ellipse cx="50" cy="50" rx="17" ry="36"/><path d="M14 50h72M20 30h60M20 70h60M50 14v72"/><path d="m35 92 15-7 15 7M28 8l-6 7m50-7 6 7"/></svg>
            <span className="passport-cover-title">CAREER<br/>PASSPORT</span>
            <div className="passport-holder"><small>NAME OF HOLDER</small><strong>{profile.name}</strong><span>WEB & MOBILE DEVELOPER</span></div>
            <div className="passport-available"><i/>KARACHI, PAKISTAN · PKT</div>
          </div>
        </div>
        <nav className="career-years" aria-label="Career destinations">{experience.map((item,index)=><button key={item.id} aria-current={index === active ? "step" : undefined} onClick={()=>navigate(index)}><span className="year-marker"/><span>{item.year}</span><small>0{index+1}</small></button>)}</nav>
        <p className="passport-caption">Good work takes you places. ↗</p>
      </aside>
      <div className="career-entries"><div className="career-track" aria-hidden="true"><div ref={progress}/></div>{experience.map((item,index)=>{
        const open = expanded === item.id;
        return <article id={`chapter-${item.id}`} ref={element=>{entries.current[index]=element;}} key={item.id} className={`career-entry entry-${index} ${index===active ? "is-current" : ""}`}>
          <span className="career-node" aria-hidden="true"/>
          <div className="chapter-top"><span className="chapter-date">{item.period}</span><span className="chapter-number">ENTRY / 0{index+1}</span></div>
          <div className="passport-stamp" aria-hidden="true"><span>{index === 0 ? "IN PROGRESS" : index === 1 ? "EXPERIENCE" : "LIFELONG"}</span><strong>{item.year.toUpperCase()}</strong><small>{index === 0 ? "BUILD · CREATE · REPEAT" : index === 1 ? "LEARNED THROUGH DOING" : "CURIOSITY HAS NO EXPIRY"}</small></div>
          <p className="chapter-label">{item.label}{index===0 && <span className="chapter-current">CURRENT</span>}</p>
          <h3>{item.title}</h3><p className="chapter-company">{item.company}</p><p className="chapter-summary">{item.summary}</p>
          <div className={`chapter-impact impact-${item.color}`}><span className="impact-pin" aria-hidden="true"/><small>A NOTE FROM THIS STOP</small><p>{item.impact}</p></div>
          <button className="chapter-toggle" aria-expanded={open} aria-controls={`details-${item.id}`} onClick={()=>setExpanded(open ? null : item.id)}><span>{open ? "Close entry" : "Inside this chapter"}</span><span className="chapter-toggle-icon" aria-hidden="true">{open ? "−" : "+"}</span></button>
          <div id={`details-${item.id}`} className="chapter-details" hidden={!open}><ul>{item.responsibilities.map(line=><li key={line}>{line}</li>)}</ul><div className="chapter-tools">{item.tools.map(tool=><span key={tool}>{tool}</span>)}</div><a href={item.href}>{item.project} <span aria-hidden="true">↗</span></a></div>
        </article>;
      })}
        <section className="passport-education" aria-labelledby="education-title">
          <span className="career-eyebrow">THE FOUNDATION</span><h3 id="education-title">Education & training</h3>
          {education.map(item=><article key={item.institution}><div className="education-icon" aria-hidden="true">✎</div><div>{item.period && <span className="education-period">{item.period}</span>}<h4>{item.qualification}</h4><p>{item.institution}</p><span className="education-detail">{item.detail}</span></div></article>)}
          <h3 className="certification-title">Certifications</h3>
          {certifications.map(item=><article key={item.name}><div className="education-icon" aria-hidden="true">✓</div><div><h4>{item.name}</h4><p>{item.issuer}</p></div></article>)}
        </section>
        <div className="career-next"><span className="next-destination" aria-hidden="true">↗</span><div><small>NEXT DESTINATION</small><p>Somewhere we build together.</p><a href="#contact">Make it your team ↗</a></div></div></div>
    </div>
  </section>;
}
