import { useState, useEffect, useRef } from "react";
import { loadData, saveData } from "./data";
import Admin from "./Admin";

// ─────────────────────────────────────────────────────────────
//  MECHANICAL ENGINEERING PORTFOLIO — CONTENT
// ─────────────────────────────────────────────────────────────
const DEFAULT_ME = {
  name: "Juan D. Cruz",
  role: "Mechanical Engineer",
  subtitle: "Design & Manufacturing Specialist",
  tagline: "Engineering precision-crafted solutions from concept to production.",
  location: "Manila, Philippines",
  email: "juan@mecheng.com",
  github: "https://github.com/",
  linkedin: "https://linkedin.com/",
  bio: "I am a Mechanical Engineer with a passion for design, thermodynamics, and manufacturing systems. I combine analytical thinking with hands-on fabrication experience to deliver reliable, efficient, and cost-effective engineering solutions. Whether designing machine components or optimizing thermal systems, I bring precision and ingenuity to every project.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MechEng&backgroundColor=b6e3f4",
  aboutPhoto: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80",
};

const DEFAULT_PROJECTS = [
  { id: 1, title: "Turbine Blade Stress Analysis", year: "2024", desc: "FEA simulation of a high-pressure turbine blade under thermal and centrifugal loading. Optimized blade geometry to reduce peak von Mises stress by 18% while maintaining aerodynamic efficiency.", tags: ["ANSYS", "SolidWorks", "FEA", "CFD"], img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80", color: "#E8520A", link: "" },
  { id: 2, title: "Heat Exchanger Design", year: "2024", desc: "Shell-and-tube heat exchanger designed for an industrial cooling application. Achieved 94% thermal efficiency using LMTD method and TEMA standards. Full P&ID documentation and material specification included.", tags: ["Thermal Design", "AutoCAD", "ASME", "TEMA"], img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", color: "#2563EB", link: "" },
  { id: 3, title: "Robotic Arm Linkage System", year: "2023", desc: "6-DOF robotic arm designed for precision pick-and-place operations. Kinematic and dynamic analysis performed. Designed all machined components to tight GD&T tolerances for accurate end-effector positioning.", tags: ["SolidWorks", "GD&T", "Kinematics", "CNC"], img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80", color: "#059669", link: "" },
  { id: 4, title: "Pneumatic Press Machine", year: "2023", desc: "Designed and fabricated a 10-ton pneumatic press for sheet metal forming. Includes custom die set, safety interlock system, and PLC control logic. Reduces cycle time by 35% versus manual operation.", tags: ["Pneumatics", "PLC", "Fabrication", "Sheet Metal"], img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80", color: "#7C3AED", link: "" },
  { id: 5, title: "Structural Frame Analysis", year: "2022", desc: "Static and dynamic structural analysis of a steel support frame for industrial conveyor belt. Verified against AISC standards. Optimized weld joint design to eliminate fatigue crack propagation sites.", tags: ["ANSYS", "Structural", "AISC", "Weld Design"], img: "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=600&q=80", color: "#DC2626", link: "" },
  { id: 6, title: "HVAC Ductwork Layout", year: "2022", desc: "Complete HVAC ductwork design for a 3-storey commercial building. Performed psychrometric calculations, duct sizing per ASHRAE standards, and energy load analysis to optimize system efficiency.", tags: ["HVAC", "ASHRAE", "AutoCAD MEP", "Load Calc"], img: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&q=80", color: "#0891B2", link: "" },
];

const DEFAULT_SKILLS = [
  { id: 1, name: "SolidWorks / CAD", icon: "⚙️", level: 92 },
  { id: 2, name: "ANSYS / FEA", icon: "🔬", level: 85 },
  { id: 3, name: "AutoCAD", icon: "📐", level: 90 },
  { id: 4, name: "Thermodynamics", icon: "🌡️", level: 88 },
  { id: 5, name: "GD&T / Tolerancing", icon: "📏", level: 82 },
  { id: 6, name: "Manufacturing Proc.", icon: "🏭", level: 80 },
  { id: 7, name: "Fluid Mechanics", icon: "💧", level: 78 },
  { id: 8, name: "Welding / Fabrication", icon: "🔧", level: 75 },
];

const DEFAULT_EXPERIENCE = [
  { id: 1, role: "Junior Mechanical Engineer", company: "PhilMech Industries", period: "2023 – Present", desc: "Design and analysis of machine components using SolidWorks. Performed FEA simulations for stress, fatigue, and thermal analysis. Coordinated with manufacturing team for DFM reviews." },
  { id: 2, role: "CAD Design Intern", company: "DOST – MIRDC", period: "2022 – 2023", desc: "Produced detailed engineering drawings and 3D models for agricultural machinery prototypes. Assisted in tolerance analysis and GD&T annotations per ASME Y14.5 standard." },
  { id: 3, role: "Engineering Thesis Researcher", company: "University – Mech Dept.", period: "2021 – 2022", desc: "Conducted thermal and CFD analysis on a biomass gasifier reactor. Published research on heat transfer optimization in fixed-bed combustion chambers." },
];
// ─────────────────────────────────────────────────────────────

const NAV = ["Home", "About", "Work", "Skills", "Experience", "Contact"];

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function useVisible(ref, threshold = 0.1) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSeen(true); }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return seen;
}

function Reveal({ children, delay = 0, from = "bottom" }) {
  const ref = useRef(null);
  const v = useVisible(ref);
  const t = { bottom: "translateY(28px)", left: "translateX(-28px)", right: "translateX(28px)" };
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translate(0,0)" : t[from], transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── SVG Gear ──
function Gear({ size = 100, color = "#e8e8e8", speed = 20, reverse = false, style = {} }) {
  const teeth = 12, r = 38, ri = 30, ro = 44;
  const pts = Array.from({ length: teeth * 2 }, (_, i) => {
    const a = (i / (teeth * 2)) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? ro : r;
    return `${size / 2 + rad * Math.cos(a) * (size / 100)},${size / 2 + rad * Math.sin(a) * (size / 100)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ animation: `${reverse ? "gear-rev" : "gear-fwd"} ${speed}s linear infinite`, ...style }}>
      <polygon points={pts} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={size / 2} cy={size / 2} r={ri * size / 100} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={size / 2} cy={size / 2} r={8 * size / 100} fill={color} />
      {[0, 60, 120, 180, 240, 300].map(a => {
        const rad = a * Math.PI / 180;
        return <line key={a} x1={size / 2 + 10 * size / 100 * Math.cos(rad)} y1={size / 2 + 10 * size / 100 * Math.sin(rad)} x2={size / 2 + 26 * size / 100 * Math.cos(rad)} y2={size / 2 + 26 * size / 100 * Math.sin(rad)} stroke={color} strokeWidth="1" />;
      })}
    </svg>
  );
}

// ── Technical dimension line ──
function DimLine({ style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, ...style }}>
      <div style={{ width: 1, height: 10, background: "#E8520A" }} />
      <div style={{ flex: 1, height: 1, background: "#E8520A" }} />
      <div style={{ width: 1, height: 10, background: "#E8520A" }} />
    </div>
  );
}

// ── Typewriter ──
function Typewriter({ words }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[idx];
    const t = setTimeout(() => {
      if (!del) { setText(w.slice(0, text.length + 1)); if (text.length + 1 === w.length) setTimeout(() => setDel(true), 1800); }
      else { setText(w.slice(0, text.length - 1)); if (text.length - 1 === 0) { setDel(false); setIdx((idx + 1) % words.length); } }
    }, del ? 55 : 110);
    return () => clearTimeout(t);
  }, [text, del, idx, words]);
  return <span style={{ color: "#E8520A" }}>{text}<span style={{ animation: "blink 1s infinite" }}>_</span></span>;
}

// ── Skill Bar — precision measurement style ──
function SkillBar({ skill, delay }) {
  const ref = useRef(null);
  const v = useVisible(ref);
  const segs = 10;
  const filled = Math.round(skill.level / segs);
  return (
    <div ref={ref} style={{ marginBottom: 16, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(16px)", transition: `all 0.65s ease ${delay}ms` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span>{skill.icon}</span>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 600, color: "#1a1a1a", letterSpacing: 0.3 }}>{skill.name}</span>
        </div>
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: "#E8520A", fontWeight: 700 }}>{skill.level}%</span>
      </div>
      {/* Segmented gauge */}
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        {Array.from({ length: segs }, (_, i) => (
          <div key={i} style={{ flex: 1, height: 8, borderRadius: 1, background: i < filled ? (i < 4 ? "#E8520A" : i < 7 ? "#F59E0B" : "#22C55E") : "#e8e8e8", transition: `background 0.05s ease ${delay + i * 80}ms`, border: "1px solid " + (i < filled ? "transparent" : "#d8d8d8") }} />
        ))}
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#aaa", marginLeft: 6, letterSpacing: 0.5, flexShrink: 0 }}>
          {filled}/{segs}
        </span>
      </div>
      {/* Tolerance note */}
      <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#bbb", marginTop: 3, letterSpacing: 0.3 }}>
        ±2% · PROFICIENCY LEVEL {filled >= 9 ? "EXPERT" : filled >= 7 ? "ADVANCED" : filled >= 5 ? "COMPETENT" : "DEVELOPING"}
      </div>
    </div>
  );
}

// ── Project Card — technical drawing style ──
function ProjectCard({ project, index }) {
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  const v = useVisible(ref);
  const isMobile = useIsMobile();
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(24px)", transition: `all 0.75s ease ${index * 80}ms`, marginBottom: 2 }}>
      <a href={project.link || "#"} target={project.link ? "_blank" : "_self"} rel="noreferrer"
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", border: `1px solid ${hov ? project.color : "#e0e0e0"}`, transition: "all 0.3s ease", textDecoration: "none", background: "#fff", boxShadow: hov ? `4px 4px 0 ${project.color}` : "2px 2px 0 #e0e0e0", transform: hov ? "translate(-2px,-2px)" : "translate(0,0)" }}>

        {/* Image */}
        <div style={{ order: isMobile ? 0 : isEven ? 0 : 1, position: "relative", overflow: "hidden", minHeight: isMobile ? 200 : 280 }}>
          <img src={project.img} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s", transform: hov ? "scale(1.05)" : "scale(1)", filter: "grayscale(15%) contrast(1.05)" }} />
          <div style={{ position: "absolute", inset: 0, background: hov ? `${project.color}18` : "transparent", transition: "background 0.3s" }} />
          {/* Drawing title block */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.93)", borderTop: `2px solid ${project.color}`, padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#888", letterSpacing: 1 }}>DWG NO. {String(index + 1).padStart(3,"0")}</span>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: project.color, fontWeight: 700, letterSpacing: 1 }}>REV {project.year}</span>
          </div>
        </div>

        {/* Text — technical spec sheet */}
        <div style={{ order: isMobile ? 1 : isEven ? 1 : 0, padding: isMobile ? "24px 20px" : "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: !isMobile && isEven ? `1px solid #e8e8e8` : "none", borderRight: !isMobile && !isEven ? `1px solid #e8e8e8` : "none", background: "#fafafa" }}>
          <div>
            {/* Spec header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 10, borderBottom: "1px dashed #e0e0e0" }}>
              <div style={{ width: 3, height: 22, background: project.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase" }}>Engineering Project</div>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 18 : 21, fontWeight: 800, color: "#111", letterSpacing: 0.3, textTransform: "uppercase", lineHeight: 1.1 }}>{project.title}</h3>
              </div>
            </div>

            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#666", lineHeight: 1.75, marginBottom: 18 }}>{project.desc}</p>

            {/* Tags styled as spec fields */}
            <div style={{ background: "#f0f0f0", border: "1px solid #e0e0e0", padding: "10px 12px", marginBottom: 18 }}>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#aaa", letterSpacing: 2, marginBottom: 6 }}>TOOLS / STANDARDS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {project.tags?.map(t => (
                  <span key={t} style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: project.color, background: "#fff", border: `1px solid ${project.color}40`, padding: "2px 9px", letterSpacing: 0.5 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ height: 1, width: hov ? 36 : 18, background: project.color, transition: "width 0.3s" }} />
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: project.color, fontWeight: 700, letterSpacing: 1 }}>VIEW SPECIFICATIONS</span>
          </div>
        </div>
      </a>
    </div>
  );
}

// ── Mobile Menu ──
function MobileMenu({ active, go, open, setOpen, email }) {
  return (
    <>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 1100 }} />}
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "75vw", maxWidth: 290, background: "#fff", borderLeft: "3px solid #111", zIndex: 1200, padding: "80px 24px 40px", transform: open ? "translateX(0)" : "translateX(110%)", transition: "transform 0.35s cubic-bezier(.16,1,.3,1)", display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Gear decoration */}
        <Gear size={60} color="#f0f0f0" speed={30} style={{ position: "absolute", top: 16, right: 16 }} />
        {NAV.map(n => (
          <button key={n} onClick={() => { go(n); setOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: active === n ? "#E8520A" : "#333", fontSize: 18, fontWeight: 700, textAlign: "left", padding: "12px 0", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid #f0f0f0", transition: "color 0.2s" }}>{n}</button>
        ))}
        <div style={{ marginTop: "auto" }}>
          <a href={`mailto:${email}`} style={{ display: "block", textAlign: "center", background: "#E8520A", padding: "13px", color: "#fff", fontFamily: "'Courier Prime', monospace", fontWeight: 700, fontSize: 12, letterSpacing: 2 }}>HIRE ME</a>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [ME, setME] = useState(DEFAULT_ME);
  const [PROJECTS, setProjects] = useState(DEFAULT_PROJECTS);
  const [SKILLS, setSkills] = useState(DEFAULT_SKILLS);
  const [EXPERIENCE, setExperience] = useState(DEFAULT_EXPERIENCE);
  const [showAdmin, setShowAdmin] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    loadData().then(saved => {
      if (saved) {
        if (saved.me) setME(saved.me);
        if (saved.projects) setProjects(saved.projects);
        if (saved.skills) setSkills(saved.skills);
        if (saved.experience) setExperience(saved.experience);
      }
    }).catch(() => {});
  }, []);

  const handleAdminSave = async (data) => {
    setME(data.me); setProjects(data.projects); setSkills(data.skills); setExperience(data.experience);
    await saveData(data);
  };

  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 120);
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function go(id) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setActive(id); }

  if (showAdmin) return <Admin data={{ me: ME, projects: PROJECTS, skills: SKILLS, experience: EXPERIENCE }} onSave={handleAdminSave} onClose={() => setShowAdmin(false)} />;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=Lato:wght@300;400;700&family=Courier+Prime:wght@400;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { overflow-x: hidden; background: #fff; }
    ::selection { background: #E8520A; color: #fff; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #f5f5f5; }
    ::-webkit-scrollbar-thumb { background: #E8520A; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes gear-fwd { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes gear-rev { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
    @keyframes float-photo { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes dash-draw { from{stroke-dashoffset:200} to{stroke-dashoffset:0} }
    .nav-btn:hover { color: #E8520A !important; }
    .hire-btn:hover { background: #c43e00 !important; }
    .social-btn:hover { background: #111 !important; color: #fff !important; border-color: #111 !important; }
    .exp-card:hover { border-left-color: #E8520A !important; padding-left: 22px !important; background: #fafafa !important; }
    button { font-family: inherit; }
    a { text-decoration: none; }
    @media(max-width:768px) {
      .hero-grid { grid-template-columns: 1fr !important; }
      .about-grid { grid-template-columns: 1fr !important; }
      .skills-grid { grid-template-columns: 1fr !important; }
      .nav-desktop { display: none !important; }
    }
  `;

  const secPad = isMobile ? "64px 22px" : "88px 60px";

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "#fff", color: "#111", minHeight: "100vh" }}>
      <style>{css}</style>

      {/* ── Ticker tape ── */}
      <div style={{ background: "#111", padding: "7px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", animation: "marquee 22s linear infinite", whiteSpace: "nowrap" }}>
          {[1, 2].map(k => (
            <span key={k} style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#888", letterSpacing: 2 }}>
              {["MECHANICAL ENGINEERING", "CAD · FEA · CFD", "DESIGN & MANUFACTURING", "THERMODYNAMICS", "ASME · GD&T · ANSYS", "PRECISION ENGINEERING"].map(w => (
                <span key={w} style={{ marginRight: 0 }}>&nbsp;&nbsp;⚙&nbsp;&nbsp;<span style={{ color: w === "MECHANICAL ENGINEERING" ? "#E8520A" : "#888" }}>{w}</span></span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 1000, background: "#fff", borderBottom: "2px solid #111", padding: `0 ${isMobile ? "20px" : "60px"}`, display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, animation: "slideDown 0.5s ease", boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.08)" : "none", transition: "box-shadow 0.3s" }}>
        {/* Logo */}
        <div onClick={() => go("Home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative", width: 36, height: 36, flexShrink: 0 }}>
            <img src={ME.avatar} alt="logo" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #111" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, fontWeight: 800, color: "#111", letterSpacing: 1, textTransform: "uppercase", lineHeight: 1 }}>{ME.name.split(" ")[0]}<span style={{ color: "#E8520A" }}>.eng</span></div>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#aaa", letterSpacing: 2 }}>MECH ENGINEER</div>
          </div>
        </div>

        {/* Desktop nav */}
        {!isMobile && (
          <div className="nav-desktop" style={{ display: "flex", gap: 0 }}>
            {NAV.map(n => (
              <button key={n} className="nav-btn" onClick={() => go(n)} style={{ background: "none", border: "none", cursor: "pointer", color: active === n ? "#E8520A" : "#555", fontSize: 12, fontWeight: 700, padding: "0 15px", height: 60, borderBottom: active === n ? "3px solid #E8520A" : "3px solid transparent", marginBottom: -2, transition: "all 0.2s", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>{n}</button>
            ))}
          </div>
        )}

        {isMobile ? (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "2px solid #111", cursor: "pointer", padding: "6px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
            {[0,1,2].map(i => (<span key={i} style={{ width: 18, height: 1.5, background: "#111", display: "block", transition: "all 0.3s", transform: menuOpen && i===0 ? "translateY(5.5px) rotate(45deg)" : menuOpen && i===2 ? "translateY(-5.5px) rotate(-45deg)" : "none", opacity: menuOpen && i===1 ? 0 : 1 }} />))}
          </button>
        ) : (
          <button className="hire-btn" onClick={() => go("Contact")} style={{ background: "#E8520A", border: "none", cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 11, padding: "10px 22px", transition: "all 0.2s", fontFamily: "'Courier Prime', monospace", letterSpacing: 2 }}>HIRE ME</button>
        )}
      </nav>

      {isMobile && <MobileMenu active={active} go={go} open={menuOpen} setOpen={setMenuOpen} email={ME.email} />}

      {/* ── HERO ── */}
      <section id="Home" style={{ padding: isMobile ? "56px 22px 52px" : "72px 60px 60px", maxWidth: 1200, margin: "0 auto", position: "relative", overflow: "hidden" }}>

        {/* Background gear decorations */}
        <Gear size={300} color="#f5f5f5" speed={60} style={{ position: "absolute", top: -80, right: -60, zIndex: 0, pointerEvents: "none" }} />
        <Gear size={180} color="#f2f2f2" speed={40} reverse style={{ position: "absolute", bottom: 0, left: -50, zIndex: 0, pointerEvents: "none" }} />

        {/* Hatching pattern strip */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 6, bottom: 0, background: "repeating-linear-gradient(-45deg, #E8520A 0, #E8520A 2px, transparent 2px, transparent 8px)", zIndex: 0 }} />

        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 52 : 80, alignItems: "center", position: "relative", zIndex: 1, paddingLeft: isMobile ? 12 : 20 }}>

          {/* Left */}
          <div>
            <div style={{ opacity: heroLoaded ? 1 : 0, transition: "all 0.7s ease 80ms" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid #E8520A", padding: "5px 14px", marginBottom: 24 }}>
                <div style={{ width: 6, height: 6, background: "#22c55e" }} />
                <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#E8520A", letterSpacing: 2 }}>STATUS: AVAILABLE · {ME.location}</span>
              </div>
            </div>

            <div style={{ opacity: heroLoaded ? 1 : 0, transition: "all 0.8s ease 160ms" }}>
              {/* Technical designation tag */}
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#bbb", letterSpacing: 2, marginBottom: 6 }}>ENG-ID / {ME.name.toUpperCase().replace(/ /g, "-")}</div>
              <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 54 : 80, fontWeight: 900, color: "#111", lineHeight: 0.9, letterSpacing: -1, textTransform: "uppercase", marginBottom: 2 }}>
                {ME.name.split(" ")[0]}
              </h1>
              <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 54 : 80, fontWeight: 900, color: "#E8520A", lineHeight: 0.9, letterSpacing: -1, textTransform: "uppercase", marginBottom: 22 }}>
                {ME.name.split(" ").slice(1).join(" ")}
              </h1>
              {/* Dimension line under name */}
              <DimLine style={{ marginBottom: 18 }} />
            </div>

            <div style={{ opacity: heroLoaded ? 1 : 0, transition: "all 0.8s ease 240ms" }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 20 : 24, color: "#777", marginBottom: 18, letterSpacing: 1, fontStyle: "italic", fontWeight: 600 }}>
                <Typewriter words={["Mechanical Engineer"]} />
              </div>
            </div>

            <div style={{ opacity: heroLoaded ? 1 : 0, transition: "all 0.8s ease 300ms" }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, color: "#777", lineHeight: 1.85, maxWidth: 420, marginBottom: 34 }}>{ME.tagline}</p>
            </div>

            <div style={{ opacity: heroLoaded ? 1 : 0, transition: "opacity 0.8s ease 380ms", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
              <button onClick={() => go("Work")} style={{ background: "#E8520A", border: "2px solid #E8520A", cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 11, padding: "12px 26px", transition: "all 0.2s", fontFamily: "'Courier Prime', monospace", letterSpacing: 2 }}
                onMouseEnter={e => e.target.style.background = "#c43e00"}
                onMouseLeave={e => e.target.style.background = "#E8520A"}>
                VIEW PROJECTS →
              </button>
              <button onClick={() => go("Contact")} style={{ background: "transparent", border: "2px solid #ccc", cursor: "pointer", color: "#888", fontWeight: 600, fontSize: 11, padding: "12px 26px", transition: "all 0.2s", fontFamily: "'Courier Prime', monospace", letterSpacing: 2 }}
                onMouseEnter={e => { e.target.style.borderColor = "#111"; e.target.style.color = "#111"; }}
                onMouseLeave={e => { e.target.style.borderColor = "#ccc"; e.target.style.color = "#888"; }}>
                CONTACT ME
              </button>
            </div>

            {/* Engineering stats */}
            <div style={{ display: "flex", gap: 0, marginTop: 44, borderTop: "1px solid #eee", paddingTop: 24, opacity: heroLoaded ? 1 : 0, transition: "opacity 0.8s ease 500ms" }}>
              {[["3+", "Years\nExperience"], ["15+", "Engineering\nProjects"], ["5+", "Industry\nStandards"]].map(([n, l], i) => (
                <div key={l} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid #eee" : "none" }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 900, color: "#E8520A", lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#bbb", marginTop: 4, lineHeight: 1.5, whiteSpace: "pre-line", letterSpacing: 0.5 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Technical drawing frame */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", opacity: heroLoaded ? 1 : 0, transition: "opacity 0.9s ease 320ms" }}>
            <div style={{ position: "relative" }}>
              {/* Technical drawing title block */}
              <div style={{ position: "absolute", bottom: -40, left: 0, right: 0, border: "1px solid #111", borderTop: "2px solid #E8520A", background: "#fff", padding: "8px 12px", zIndex: 3, display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px auto", gap: "0 8px", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 8, color: "#bbb", letterSpacing: 1 }}>NAME</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, color: "#111", letterSpacing: 0.5 }}>{ME.name.toUpperCase()}</div>
                </div>
                <div style={{ width: 1, height: "100%", background: "#e0e0e0" }} />
                <div>
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 8, color: "#bbb", letterSpacing: 1 }}>TITLE</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, color: "#E8520A", letterSpacing: 0.5 }}>{ME.role.toUpperCase()}</div>
                </div>
                <div style={{ width: 1, height: "100%", background: "#e0e0e0" }} />
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 8, color: "#bbb", letterSpacing: 1 }}>SCALE</div>
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#111", fontWeight: 700 }}>1:1</div>
                </div>
              </div>

              {/* Corner bracket marks */}
              {[{top:0,left:0},{top:0,right:0},{bottom:0,left:0},{bottom:0,right:0}].map((pos,i) => {
                const isRight = pos.right !== undefined, isBottom = pos.bottom !== undefined;
                return <div key={i} style={{ position: "absolute", ...pos, width: 20, height: 20, zIndex: 4, borderTop: !isBottom ? "2px solid #E8520A" : "none", borderBottom: isBottom ? "2px solid #E8520A" : "none", borderLeft: !isRight ? "2px solid #E8520A" : "none", borderRight: isRight ? "2px solid #E8520A" : "none" }} />;
              })}

              {/* Cross-hair lines */}
              <div style={{ position: "absolute", top: "50%", left: -16, right: -16, height: 1, background: "rgba(232,82,10,0.15)", zIndex: 2, pointerEvents: "none" }} />
              <div style={{ position: "absolute", left: "50%", top: -16, bottom: -16, width: 1, background: "rgba(232,82,10,0.15)", zIndex: 2, pointerEvents: "none" }} />

              {/* Photo */}
              <div style={{ width: isMobile ? 250 : 320, height: isMobile ? 300 : 400, overflow: "hidden", border: "2px solid #111", position: "relative", zIndex: 1, animation: "float-photo 5s ease-in-out infinite" }}>
                <img src={ME.avatar} alt={ME.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {/* Subtle hatch overlay on photo edges */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(255,255,255,0.2) 100%)" }} />
              </div>

              {/* Dimension arrows */}
              {!isMobile && <>
                <div style={{ position: "absolute", right: -90, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 1, height: isMobile ? 150 : 200, background: "#ddd", position: "relative" }}>
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translate(-50%,-100%)", borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderBottom: "6px solid #ddd" }} />
                    <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translate(-50%,100%)", borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "6px solid #ddd" }} />
                  </div>
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#ccc", writingMode: "vertical-rl", letterSpacing: 1 }}>HEIGHT ±0.5mm</span>
                </div>
                {/* Floating spec badges */}
                <div style={{ position: "absolute", top: -18, right: -60, background: "#fff", border: "1px solid #E8520A", padding: "7px 12px", zIndex: 5 }}>
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#bbb", letterSpacing: 1 }}>SPEC</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, color: "#E8520A" }}>PE-2026</div>
                </div>
                <div style={{ position: "absolute", top: 60, left: -68, background: "#fff", border: "1px solid #111", padding: "7px 12px", zIndex: 5 }}>
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#bbb", letterSpacing: 1 }}>TOLERANCE</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, color: "#111" }}>±0.01mm</div>
                </div>
              </>}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="About" style={{ background: "#f8f8f8", borderTop: "2px solid #111", borderBottom: "2px solid #111", padding: secPad, position: "relative", overflow: "hidden" }}>
        {/* BG hatching */}
        <div style={{ position: "absolute", top: 0, right: 0, width: 6, bottom: 0, background: "repeating-linear-gradient(-45deg, #E8520A 0, #E8520A 2px, transparent 2px, transparent 8px)", opacity: 0.5 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 80 : 120, fontWeight: 900, color: "#ebebeb", lineHeight: 1, flexShrink: 0 }}>02</div>
            <div>
              <Reveal><span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#E8520A", letterSpacing: 3, display: "block", marginBottom: 4 }}>ABOUT THE ENGINEER</span></Reveal>
              <Reveal delay={80}><h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 30 : 42, fontWeight: 900, color: "#111", textTransform: "uppercase", letterSpacing: 0.5 }}>Operator Profile</h2></Reveal>
            </div>
          </div>

          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 60, alignItems: "start" }}>
            <Reveal from="left">
              <div style={{ position: "relative" }}>
                <div style={{ overflow: "hidden", aspectRatio: isMobile ? "1/1" : "3/4", border: "2px solid #111", position: "relative" }}>
                  <img src={ME.aboutPhoto} alt="About" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(25%) contrast(1.08)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.65) 100%)" }} />
                  {/* Engineer badge at bottom */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 20px" }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>{ME.name}</div>
                    <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#E8520A", marginTop: 2, letterSpacing: 1 }}>{ME.role} · {ME.subtitle}</div>
                  </div>
                  {/* Corner marks */}
                  {[{top:8,left:8},{top:8,right:8},{bottom:8,left:8},{bottom:8,right:8}].map((pos,i)=>{
                    const iR=pos.right!==undefined, iB=pos.bottom!==undefined;
                    return <div key={i} style={{ position:"absolute",...pos,width:18,height:18,borderTop:!iB?"1px solid #E8520A":"none",borderBottom:iB?"1px solid #E8520A":"none",borderLeft:!iR?"1px solid #E8520A":"none",borderRight:iR?"1px solid #E8520A":"none" }} />;
                  })}
                </div>
                {/* Offset shadow border */}
                <div style={{ position: "absolute", top: 10, left: 10, right: -10, bottom: -10, border: "1px solid #E8520A", zIndex: -1, opacity: 0.4 }} />
              </div>
            </Reveal>

            <Reveal from="right" delay={120}>
              <div>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 15, color: "#555", lineHeight: 1.9, marginBottom: 28 }}>{ME.bio}</p>
                {/* Technical spec table */}
                <div style={{ border: "1px solid #ddd", marginBottom: 28, overflow: "hidden" }}>
                  <div style={{ background: "#111", padding: "8px 14px" }}>
                    <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#E8520A", letterSpacing: 2 }}>ENGINEER DATA SHEET</span>
                  </div>
                  {[["EMAIL", ME.email], ["LOCATION", ME.location], ["STATUS", "AVAILABLE FOR HIRE"], ["EDUCATION", "B.S. Mechanical Eng."]].map(([k, v], i) => (
                    <div key={k} style={{ display: "flex", borderBottom: i < 3 ? "1px solid #eee" : "none" }}>
                      <div style={{ background: "#f5f5f5", padding: "10px 14px", fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#888", letterSpacing: 1.5, borderRight: "1px solid #eee", width: 110, flexShrink: 0 }}>{k}</div>
                      <div style={{ padding: "10px 14px", fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#555", wordBreak: "break-word" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[[ME.github, "LinkedIn"], [ME.linkedin, "Resume"], [`mailto:${ME.email}`, "Email"]].map(([href, label]) => (
                    <a key={label} href={href} target="_blank" rel="noreferrer" className="social-btn" style={{ flex: 1, textAlign: "center", padding: "10px 14px", border: "2px solid #111", fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#111", letterSpacing: 1.5, fontWeight: 700, transition: "all 0.2s", minWidth: 80 }}>{label} ↗</a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="Work" style={{ padding: secPad }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 80 : 120, fontWeight: 900, color: "#ebebeb", lineHeight: 1, flexShrink: 0 }}>03</div>
            <div>
              <Reveal><span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#E8520A", letterSpacing: 3, display: "block", marginBottom: 4 }}>ENGINEERING PROJECTS</span></Reveal>
              <Reveal delay={80}><h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 30 : 42, fontWeight: 900, color: "#111", textTransform: "uppercase", letterSpacing: 0.5 }}>Design Schematics</h2></Reveal>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {PROJECTS.map((p, i) => <ProjectCard key={p.id || p.title} project={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="Skills" style={{ background: "#f8f8f8", borderTop: "2px solid #111", borderBottom: "2px solid #111", padding: secPad }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 80 : 120, fontWeight: 900, color: "#ebebeb", lineHeight: 1, flexShrink: 0 }}>04</div>
            <div>
              <Reveal><span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#E8520A", letterSpacing: 3, display: "block", marginBottom: 4 }}>TECHNICAL CAPABILITIES</span></Reveal>
              <Reveal delay={80}><h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 30 : 42, fontWeight: 900, color: "#111", textTransform: "uppercase", letterSpacing: 0.5 }}>Skills & Tools</h2></Reveal>
            </div>
          </div>
          <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0 64px" }}>
            {SKILLS.map((s, i) => <SkillBar key={s.id || s.name} skill={s} delay={i * 70} />)}
          </div>

          {/* Standards & Certifications row */}
          <Reveal delay={300}>
            <div style={{ marginTop: 40, padding: "20px 24px", border: "1px solid #ddd", background: "#fff" }}>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#E8520A", letterSpacing: 2, marginBottom: 14 }}>STANDARDS & CERTIFICATIONS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["ASME Y14.5 GD&T", "ISO 2768 Tolerances", "TEMA Heat Exchangers", "AISC Steel Design", "ASHRAE HVAC", "AWS Welding D1.1", "PEC Licensed Engineer", "OSHA Safety"].map(s => (
                  <span key={s} style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#555", background: "#f5f5f5", border: "1px solid #e0e0e0", padding: "5px 12px", letterSpacing: 0.5 }}>✓ {s}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="Experience" style={{ padding: secPad }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 80 : 120, fontWeight: 900, color: "#ebebeb", lineHeight: 1, flexShrink: 0 }}>05</div>
            <div>
              <Reveal><span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#E8520A", letterSpacing: 3, display: "block", marginBottom: 4 }}>WORK HISTORY</span></Reveal>
              <Reveal delay={80}><h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 30 : 42, fontWeight: 900, color: "#111", textTransform: "uppercase", letterSpacing: 0.5 }}>Experience</h2></Reveal>
            </div>
          </div>
          <div style={{ maxWidth: 780 }}>
            {EXPERIENCE.map((e, i) => (
              <Reveal key={e.id || e.role} delay={i * 100}>
                <div className="exp-card" style={{ borderLeft: "3px solid #ddd", paddingLeft: 22, marginBottom: 32, transition: "all 0.3s ease" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    <div>
                      <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 20 : 24, fontWeight: 800, color: "#111", letterSpacing: 0.5, textTransform: "uppercase" }}>{e.role}</h3>
                      {e.company?.trim() && <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: "#E8520A", letterSpacing: 0.5, marginTop: 2 }}>{e.company}</div>}
                    </div>
                    <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#aaa", border: "1px solid #eee", padding: "3px 12px", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{e.period}</span>
                  </div>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#777", lineHeight: 1.75 }}>{e.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="Contact" style={{ background: "#111", padding: secPad, position: "relative", overflow: "hidden" }}>
        {/* Gear decoration */}
        <Gear size={isMobile ? 180 : 280} color="rgba(255,255,255,0.03)" speed={80} style={{ position: "absolute", bottom: -60, right: -60, pointerEvents: "none" }} />
        <Gear size={140} color="rgba(255,255,255,0.03)" speed={50} reverse style={{ position: "absolute", top: -40, left: -40, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 6, bottom: 0, background: "repeating-linear-gradient(-45deg, #E8520A 0, #E8520A 2px, transparent 2px, transparent 8px)" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <Reveal><span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#E8520A", letterSpacing: 3 }}>SECTION 06 / INITIATE CONTACT</span></Reveal>
          <Reveal delay={100}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 48 : 72, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: -1, lineHeight: 1, marginTop: 16, marginBottom: 14 }}>
              LET'S BUILD<br /><span style={{ color: "#E8520A" }}>SOMETHING.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, color: "#666", lineHeight: 1.85, maxWidth: 420, margin: "0 auto 44px" }}>
              Open to engineering roles, consulting projects, and technical collaborations. Let's engineer solutions together.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={`mailto:${ME.email}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#E8520A", padding: isMobile ? "13px 24px" : "14px 34px", color: "#fff", fontWeight: 700, fontSize: 12, transition: "all 0.25s", fontFamily: "'Courier Prime', monospace", letterSpacing: 2, width: isMobile ? "100%" : "auto", justifyContent: "center" }}
                onMouseEnter={e => e.currentTarget.style.background = "#c43e00"}
                onMouseLeave={e => e.currentTarget.style.background = "#E8520A"}>
                ✉ SEND EMAIL
              </a>
              <div style={{ display: "flex", gap: 12, width: isMobile ? "100%" : "auto" }}>
                <a href={ME.github} target="_blank" rel="noreferrer" style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "13px 16px" : "14px 24px", border: "2px solid #333", color: "#666", fontFamily: "'Courier Prime', monospace", fontSize: 11, letterSpacing: 1.5, transition: "all 0.25s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#666"; }}>LinkedIn ↗</a>
                <a href={ME.linkedin} target="_blank" rel="noreferrer" style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "13px 16px" : "14px 24px", border: "2px solid #333", color: "#666", fontFamily: "'Courier Prime', monospace", fontSize: 11, letterSpacing: 1.5, transition: "all 0.25s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#666"; }}>Resume ↗</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#fff", borderTop: "2px solid #111", padding: isMobile ? "18px 22px" : "18px 60px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: 8, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Gear size={20} color="#ddd" speed={15} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#bbb", letterSpacing: 1 }}>
            © 2026 <span style={{ color: "#111", fontWeight: 700 }}>{ME.name.toUpperCase()}</span> · ALL RIGHTS RESERVED
          </span>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#ddd", letterSpacing: 1 }}>BUILT WITH REACT · DEPLOYED ON VERCEL</span>
          <button onClick={() => setShowAdmin(true)} style={{ background: "none", border: "1px solid #eee", padding: "4px 10px", cursor: "pointer", color: "#ccc", fontSize: 10, fontFamily: "'Courier Prime', monospace", letterSpacing: 1, transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.borderColor = "#E8520A"; e.target.style.color = "#E8520A"; }}
            onMouseLeave={e => { e.target.style.borderColor = "#eee"; e.target.style.color = "#ccc"; }}>
            ⚙ ADMIN
          </button>
        </div>
      </footer>
    </div>
  );
}