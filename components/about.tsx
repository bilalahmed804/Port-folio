import { profile } from "@/lib/portfolio";

const skills = [
  { name: "React & Next.js", color: "yellow" },
  { name: "TypeScript", color: "pink" },
  { name: "React Native", color: "mint" },
  { name: "Android & iOS", color: "blue" },
  { name: "MERN stack", color: "purple" },
  { name: "REST APIs", color: "yellow" },
];
const notes = [
  { title: "3+", text: "years of hands-on experience across web and mobile development", color: "yellow" },
  { title: "MERN", text: "React interfaces with Node.js, Express.js, and MongoDB", color: "pink" },
  { title: "iOS + ANDROID", text: "production mobile development and release support at Cybertron Labs", color: "mint" },
];

export function About() {
  return (
    <section id="about" className="about scrapbook-about stack-section" aria-labelledby="about-title">
      <div className="scrapbook-layout">
        <figure className="about-polaroid">
          <span className="photo-tape" aria-hidden="true" />
          <div className="portrait-placeholder" role="img" aria-label={`Portrait placeholder for ${profile.name}`}>
            <span className="portrait-initials">{profile.initials}</span>
            <span className="portrait-placeholder-label">KARACHI · PAKISTAN</span>
          </div>
          <figcaption className="hand">Bilal — building one detail at a time</figcaption>
        </figure>

        <article className="about-notebook">
          <div className="notebook-holes" aria-hidden="true">
            {Array.from({ length: 14 }, (_, index) => <i key={index} />)}
          </div>
          <h2 id="about-title">A bit about me</h2>
          <div className="notebook-copy">
            <p>I’m Bilal Ahmed, a Karachi-based developer with 3+ years of hands-on experience building web and mobile applications with React.js and React Native. I build responsive interfaces with Next.js and TypeScript, backed by practical experience with the MERN stack.</p>
            <p>At Cybertron Labs, I develop and maintain production Android and iOS apps. My work spans REST API integration, authentication, maps, real-time communication, bug fixes, dependency upgrades, and release support. I’ve also contributed to e-commerce, learning management, and ride-sharing projects.</p>
          </div>
          <ul className="notebook-skills" aria-label="Skills">
            {skills.map((skill) => <li key={skill.name} className={`skill-sticker sticky-${skill.color}`}>{skill.name}</li>)}
          </ul>
          <p className="notebook-now hand">Currently building and improving production mobile apps at Cybertron Labs.</p>
        </article>

        <aside className="about-sticky-notes" aria-label="Career highlights">
          {notes.map((note) => (
            <div key={note.title} className={`about-sticky-note sticky-${note.color}`}>
              <strong>{note.title}</strong>
              <p>{note.text}</p>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
