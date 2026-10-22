"use client";

import { useEffect, useRef } from "react";
import { toolkit } from "@/lib/toolkit";

export function Toolkit({ onOpen }: { onOpen: (id: string) => void }) {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!section.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("tool-arrived");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .15 });
    section.current.querySelectorAll(".tool-compartment").forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return <section id="toolkit" ref={section} className="toolkit-section" aria-labelledby="toolkit-title">
    <div className="toolkit-inner">
      <header className="toolkit-heading"><div><span className="toolkit-eyebrow">04 / MY EVERYDAY TOOLKIT</span><h2 id="toolkit-title">Good ideas.<br/><em>The right tools.</em></h2></div><div className="toolkit-header-note"><span aria-hidden="true">✎</span><p>A little code. A little craft.<br/>A lot of making things work.</p></div></header>
      <div className="toolbox"><div className="toolbox-rail"><span><i aria-hidden="true"/> THE MAKER’S ESSENTIALS</span><span>06 COMPARTMENTS / ALWAYS EVOLVING</span></div><div className="toolkit-grid">{toolkit.map((item,index)=><article key={item.id} className={`tool-compartment tool-${item.color}`} style={{ animationDelay: `${index % 3 * 75}ms` }}><div className="tool-card-top"><span className="tool-symbol" aria-hidden="true">{item.symbol}</span><span className="tool-number">0{index+1}</span></div><h3>{item.title}</h3><p>{item.description}</p><ul className="tool-chips" aria-label={`${item.title} tools`}>{item.tools.map(tool=><li key={tool}>{tool}</li>)}</ul>{item.project ? <button className="tool-project-link" onClick={()=>onOpen(item.project!)}>Explore a related project <span aria-hidden="true">↗</span></button> : <span className="tool-card-caption">{item.id === "backend" ? "Behind every good experience." : item.id === "payments" ? "Details that deserve extra care." : "Ready for the real world."}</span>}</article>)}</div><footer className="toolbox-footer"><span className="toolkit-pencil" aria-hidden="true">↗</span><p>The tools change. <strong>The curiosity stays.</strong></p><a href="#contact">Have something in mind? Let’s talk ↗</a></footer></div>
    </div>
  </section>;
}
