"use client";

import { useEffect, useRef } from "react";
import type { projects } from "@/lib/portfolio";

export function ProjectDialog({ project, onClose }: {
  project: (typeof projects)[number];
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog ref={dialogRef} className={`project-modal project-${project.color}`} aria-labelledby="modal-title" aria-describedby="modal-description" onCancel={(event) => {
      event.preventDefault();
      onClose();
    }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
      <button type="button" className="modal-close" onClick={onClose} aria-label="Close project details" autoFocus>×</button>
      <div className="modal-kicker">{project.number} / {project.kind}</div>
      <h2 id="modal-title">{project.name}</h2>
      <p id="modal-description" className="modal-lead">{project.description}</p>
      <p className="modal-detail">{project.detail}</p>
      <div className="modal-tools">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
      <p className="modal-footnote">
        {project.url ? <a href={project.url} target="_blank" rel="noreferrer">Visit the live project ↗</a> : project.id === "ride-sharing" ? "Personal demo project · No public link available." : "Contributed to development and deployment on Android and iOS."}
      </p>
    </dialog>
  );
}
