import { useState } from "react";
import { resetData } from "./data";

const DEFAULT_PASSWORD = "christian2026";
const PW_KEY = "admin_password";
const getPassword = () => localStorage.getItem(PW_KEY) || DEFAULT_PASSWORD;
const savePassword = (pw) => localStorage.setItem(PW_KEY, pw);

// ── Mechanical Engineering themed Admin Panel ──
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Lato:wght@300;400;700&family=Courier+Prime:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #fff; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #f5f5f5; }
  ::-webkit-scrollbar-thumb { background: #E8520A; }

  .adm-input {
    width: 100%;
    background: #fafafa;
    border: 1px solid #ddd;
    border-left: 3px solid #ddd;
    padding: 10px 14px;
    color: #111;
    font-size: 13px;
    font-family: 'Lato', sans-serif;
    outline: none;
    transition: border 0.2s, box-shadow 0.2s;
    border-radius: 0;
  }
  .adm-input:focus {
    border-color: #ddd;
    border-left-color: #E8520A;
    box-shadow: 2px 2px 0 #E8520A20;
    background: #fff;
  }
  .adm-input::placeholder { color: #bbb; font-family: 'Courier Prime', monospace; font-size: 12px; letter-spacing: 0.5px; }

  .adm-btn {
    border: none;
    cursor: pointer;
    font-family: 'Courier Prime', monospace;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: all 0.2s;
    border-radius: 0;
    font-size: 11px;
  }
  .adm-btn:hover { opacity: 0.88; transform: translateY(-1px); }

  .adm-tab {
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 10px 16px;
    transition: all 0.2s;
    border-left: 3px solid transparent;
    display: block;
    width: 100%;
    text-align: left;
  }
  .adm-tab:hover { background: #f5f5f5 !important; }

  .adm-card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-left: 3px solid #e8e8e8;
    padding: 16px 18px;
    margin-bottom: 10px;
    transition: all 0.2s;
    position: relative;
  }
  .adm-card:hover { border-left-color: #E8520A; background: #fafafa; }
  .adm-card::before {
    content: '';
    position: absolute;
    top: 6px; left: 6px;
    width: 8px; height: 8px;
    border-top: 1px solid #E8520A40;
    border-left: 1px solid #E8520A40;
  }
  .adm-card::after {
    content: '';
    position: absolute;
    bottom: 6px; right: 6px;
    width: 8px; height: 8px;
    border-bottom: 1px solid #E8520A40;
    border-right: 1px solid #E8520A40;
  }

  .del-btn:hover { background: #fff0f0 !important; border-color: #ef4444 !important; color: #ef4444 !important; }

  .adm-label {
    font-family: 'Courier Prime', monospace;
    font-size: 10px;
    color: #999;
    letter-spacing: 2px;
    text-transform: uppercase;
    display: block;
    margin-bottom: 6px;
  }

  @keyframes gear-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes gear-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
`;

// ── Mini SVG gear ──
function Gear({ size = 40, color = "#e8e8e8", speed = 20, reverse = false, style = {} }) {
  const teeth = 10, r = 38, ro = 44;
  const pts = Array.from({ length: teeth * 2 }, (_, i) => {
    const a = (i / (teeth * 2)) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? ro : r;
    return `${size / 2 + rad * Math.cos(a) * (size / 100)},${size / 2 + rad * Math.sin(a) * (size / 100)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ animation: `${reverse ? "gear-rev" : "gear-spin"} ${speed}s linear infinite`, flexShrink: 0, ...style }}>
      <polygon points={pts} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={size/2} cy={size/2} r={28 * size / 100} fill="none" stroke={color} strokeWidth="1.2" />
      <circle cx={size/2} cy={size/2} r={7 * size / 100} fill={color} />
    </svg>
  );
}

// ── Section header ──
function SectionHead({ number, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, paddingBottom: 14, borderBottom: "1px solid #eee" }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 52, fontWeight: 900, color: "#ebebeb", lineHeight: 1, flexShrink: 0 }}>{number}</div>
      <div>
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#E8520A", letterSpacing: 3, display: "block", marginBottom: 2 }}>CONFIGURATION</span>
        <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: "#111", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</h3>
      </div>
    </div>
  );
}

// ── Login screen ──
function Login({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => {
    if (pw === getPassword()) { onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 1500); }
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", fontFamily: "'Lato', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>

      {/* Background gears */}
      <Gear size={200} color="#f5f5f5" speed={60} style={{ position: "absolute", top: -50, right: -50, pointerEvents: "none" }} />
      <Gear size={140} color="#f5f5f5" speed={40} reverse style={{ position: "absolute", bottom: -40, left: -40, pointerEvents: "none" }} />

      {/* Hatching strips */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 6, bottom: 0, background: "repeating-linear-gradient(-45deg, #E8520A 0, #E8520A 2px, transparent 2px, transparent 8px)" }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 6, bottom: 0, background: "repeating-linear-gradient(-45deg, #E8520A 0, #E8520A 2px, transparent 2px, transparent 8px)" }} />

      <div style={{ width: "100%", maxWidth: 380, textAlign: "center", padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Technical drawing border box */}
        <div style={{ border: "2px solid #111", padding: "40px 36px", position: "relative" }}>
          {/* Corner marks */}
          {[{top:-1,left:-1},{top:-1,right:-1},{bottom:-1,left:-1},{bottom:-1,right:-1}].map((pos,i)=>{
            const iR=pos.right!==undefined, iB=pos.bottom!==undefined;
            return <div key={i} style={{ position:"absolute",...pos,width:16,height:16,borderTop:!iB?"2px solid #E8520A":"none",borderBottom:iB?"2px solid #E8520A":"none",borderLeft:!iR?"2px solid #E8520A":"none",borderRight:iR?"2px solid #E8520A":"none" }} />;
          })}

          {/* Gear icon */}
          <div style={{ display: "flex", justifyContent: "center", gap: -8, marginBottom: 20 }}>
            <Gear size={44} color="#E8520A" speed={8} />
            <Gear size={30} color="#111" speed={5} reverse style={{ marginLeft: -6, marginTop: 7 }} />
          </div>

          {/* Title block */}
          <div style={{ borderTop: "1px solid #eee", borderBottom: "1px solid #eee", padding: "10px 0", marginBottom: 24 }}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#E8520A", letterSpacing: 3, marginBottom: 4 }}>SYSTEM ACCESS PANEL</div>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 900, color: "#111", textTransform: "uppercase", letterSpacing: 1 }}>Admin Dashboard</h2>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#bbb", marginTop: 2, letterSpacing: 1 }}>MECH-PORTFOLIO v1.0</div>
          </div>

          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#888", marginBottom: 22, lineHeight: 1.6 }}>
            Enter authorization code to access the control panel.
          </p>

          <div style={{ marginBottom: 6 }}>
            <label className="adm-label">AUTH CODE</label>
            <input className="adm-input" type="password" placeholder="Enter password..." value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{ border: err ? "1px solid #ef4444" : undefined, borderLeft: err ? "3px solid #ef4444" : "3px solid #E8520A" }}
            />
          </div>
          {err && (
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#ef4444", marginBottom: 10, letterSpacing: 1, textAlign: "left" }}>
              ✕ ACCESS DENIED · INVALID CODE
            </p>
          )}
          <button className="adm-btn" onClick={submit}
            style={{ width: "100%", background: "#E8520A", color: "#fff", padding: "13px", fontSize: 12, marginTop: 8 }}>
            ▶ INITIATE ACCESS
          </button>
        </div>

        {/* Drawing number below */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, borderTop: "1px solid #eee", paddingTop: 6 }}>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#ddd", letterSpacing: 1 }}>DWG: ADM-001</span>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#ddd", letterSpacing: 1 }}>SCALE: 1:1</span>
        </div>
      </div>
    </div>
  );
}

// ── Profile Tab ──
function ProfileTab({ me, setMe }) {
  const fields = [
    ["name", "Full Name"], ["role", "Role / Title"], ["subtitle", "Subtitle"],
    ["tagline", "Tagline"], ["location", "Location"], ["email", "Email"],
    ["github", "GitHub / LinkedIn URL"], ["linkedin", "LinkedIn URL"],
    ["avatar", "Hero Photo URL"], ["aboutPhoto", "About Photo URL"],
  ];
  return (
    <div>
      <SectionHead number="01" label="Profile Information" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {fields.map(([key, label]) => (
          <div key={key} style={{ gridColumn: ["bio","tagline","avatar","aboutPhoto"].includes(key) ? "1 / -1" : undefined }}>
            <label className="adm-label">{label}</label>
            {key === "bio" ? (
              <textarea className="adm-input" rows={4} value={me[key] || ""} onChange={e => setMe({ ...me, [key]: e.target.value })} style={{ resize: "vertical" }} />
            ) : (
              <input className="adm-input" value={me[key] || ""} onChange={e => setMe({ ...me, [key]: e.target.value })} />
            )}
          </div>
        ))}
        {/* Bio full width */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="adm-label">Bio</label>
          <textarea className="adm-input" rows={4} value={me.bio || ""} onChange={e => setMe({ ...me, bio: e.target.value })} style={{ resize: "vertical" }} />
        </div>
      </div>

      {/* Photo previews */}
      <div style={{ marginTop: 20, border: "1px solid #eee", borderLeft: "3px solid #E8520A", padding: 16 }}>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#E8520A", letterSpacing: 2, marginBottom: 12 }}>PHOTO PREVIEW</div>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <img src={me.avatar} alt="hero" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid #E8520A" }} onError={e => e.target.style.opacity = "0.2"} />
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#bbb", marginTop: 5, letterSpacing: 1 }}>HERO PHOTO</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <img src={me.aboutPhoto} alt="about" style={{ width: 72, height: 72, objectFit: "cover", border: "2px solid #111" }} onError={e => e.target.style.opacity = "0.2"} />
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#bbb", marginTop: 5, letterSpacing: 1 }}>ABOUT PHOTO</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Projects Tab ──
function ProjectsTab({ projects, setProjects }) {
  const [editing, setEditing] = useState(null);
  const blank = { id: Date.now(), title: "", year: new Date().getFullYear().toString(), desc: "", tags: [], img: "", color: "#E8520A", link: "" };

  const save = (proj) => {
    if (editing === "new") setProjects([...projects, proj]);
    else setProjects(projects.map(p => p.id === proj.id ? proj : p));
    setEditing(null);
  };
  const del = (id) => { if (window.confirm("Delete this project?")) setProjects(projects.filter(p => p.id !== id)); };

  if (editing !== null) return <ProjectForm proj={editing === "new" ? blank : { ...projects.find(p => p.id === editing) }} onSave={save} onCancel={() => setEditing(null)} />;

  return (
    <div>
      <SectionHead number="02" label="Engineering Projects" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#888", letterSpacing: 1 }}>{projects.length} PROJECTS ON FILE</span>
        <button className="adm-btn" onClick={() => setEditing("new")}
          style={{ background: "#E8520A", color: "#fff", padding: "9px 18px" }}>
          + ADD PROJECT
        </button>
      </div>
      {projects.map(p => (
        <div key={p.id} className="adm-card" style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <img src={p.img} alt="" style={{ width: 56, height: 46, objectFit: "cover", border: "1px solid #eee", flexShrink: 0, background: "#f5f5f5" }} onError={e => e.target.style.opacity = "0.2"} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <div style={{ width: 3, height: 16, background: p.color, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, color: "#111", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</span>
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#aaa", flexShrink: 0 }}>REV.{p.year}</span>
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {p.tags?.map(t => <span key={t} style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#888", background: "#f5f5f5", border: "1px solid #eee", padding: "1px 7px", letterSpacing: 0.5 }}>{t}</span>)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button className="adm-btn" onClick={() => setEditing(p.id)}
              style={{ background: "#fff", color: "#E8520A", border: "1px solid #E8520A", padding: "6px 13px" }}>EDIT</button>
            <button className="adm-btn del-btn" onClick={() => del(p.id)}
              style={{ background: "#fff", color: "#999", border: "1px solid #ddd", padding: "6px 13px" }}>DEL</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectForm({ proj, onSave, onCancel }) {
  const [form, setForm] = useState({ ...proj, tags: Array.isArray(proj.tags) ? proj.tags.join(", ") : "" });
  const submit = () => onSave({ ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) });

  const F = ({ label, k, rows }) => (
    <div>
      <label className="adm-label">{label}</label>
      {rows ? <textarea className="adm-input" rows={rows} value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })} style={{ resize: "vertical" }} />
        : <input className="adm-input" value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })} />}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <button className="adm-btn" onClick={onCancel} style={{ background: "#fff", color: "#888", border: "1px solid #ddd", padding: "7px 14px" }}>← BACK</button>
        <div>
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#E8520A", letterSpacing: 2 }}>PROJECT FILE</div>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 800, color: "#111", textTransform: "uppercase" }}>{proj.id ? "Edit Entry" : "New Project"}</h3>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ gridColumn: "1 / -1" }}><F label="Project Title" k="title" /></div>
        <F label="Year" k="year" />
        <div>
          <label className="adm-label">Accent Color</label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="color" value={form.color || "#E8520A"} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: 40, height: 38, border: "1px solid #ddd", cursor: "pointer", padding: 2 }} />
            <input className="adm-input" value={form.color || ""} onChange={e => setForm({ ...form, color: e.target.value })} style={{ flex: 1 }} />
          </div>
        </div>
        <div style={{ gridColumn: "1 / -1" }}><F label="Description" k="desc" rows={3} /></div>
        <div style={{ gridColumn: "1 / -1" }}><F label="Tools / Standards (comma separated)" k="tags" /></div>
        <div style={{ gridColumn: "1 / -1" }}><F label="Image URL" k="img" /></div>
        <div style={{ gridColumn: "1 / -1" }}><F label="Project Link (optional)" k="link" /></div>
      </div>
      {form.img && (
        <img src={form.img} alt="" style={{ width: "100%", height: 160, objectFit: "cover", marginTop: 14, border: "1px solid #eee" }} onError={e => e.target.style.display="none"} />
      )}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button className="adm-btn" onClick={submit} style={{ flex: 1, background: "#E8520A", color: "#fff", padding: "12px" }}>✓ SAVE PROJECT</button>
        <button className="adm-btn" onClick={onCancel} style={{ background: "#fff", color: "#888", border: "1px solid #ddd", padding: "12px 20px" }}>CANCEL</button>
      </div>
    </div>
  );
}

// ── Skills Tab ──
function SkillsTab({ skills, setSkills }) {
  const add = () => setSkills([...skills, { id: Date.now(), name: "New Skill", icon: "⚙️", level: 50 }]);
  const del = (id) => setSkills(skills.filter(s => s.id !== id));
  const upd = (id, key, val) => setSkills(skills.map(s => s.id === id ? { ...s, [key]: val } : s));

  return (
    <div>
      <SectionHead number="03" label="Skills & Capabilities" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#888", letterSpacing: 1 }}>{skills.length} SKILLS LOGGED</span>
        <button className="adm-btn" onClick={add} style={{ background: "#E8520A", color: "#fff", padding: "9px 18px" }}>+ ADD SKILL</button>
      </div>
      {skills.map((s, i) => (
        <div key={s.id} className="adm-card">
          <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 70px auto", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <input className="adm-input" value={s.icon} onChange={e => upd(s.id, "icon", e.target.value)} style={{ textAlign: "center", fontSize: 18, padding: "7px 4px" }} />
            <input className="adm-input" value={s.name} onChange={e => upd(s.id, "name", e.target.value)} placeholder="Skill name" />
            <div style={{ position: "relative" }}>
              <input className="adm-input" type="number" min={0} max={100} value={s.level} onChange={e => upd(s.id, "level", Number(e.target.value))} style={{ textAlign: "center", paddingRight: 20 }} />
              <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#aaa", pointerEvents: "none" }}>%</span>
            </div>
            <button className="adm-btn del-btn" onClick={() => del(s.id)} style={{ background: "#fff", color: "#aaa", border: "1px solid #ddd", padding: "9px 11px" }}>✕</button>
          </div>
          {/* Visual gauge */}
          <div>
            <input type="range" min={0} max={100} value={s.level} onChange={e => upd(s.id, "level", Number(e.target.value))} style={{ width: "100%", accentColor: "#E8520A", height: 4 }} />
            <div style={{ display: "flex", gap: 2, marginTop: 6 }}>
              {Array.from({ length: 10 }, (_, j) => (
                <div key={j} style={{ flex: 1, height: 5, background: j < Math.round(s.level / 10) ? (j < 4 ? "#E8520A" : j < 7 ? "#F59E0B" : "#22C55E") : "#eee", border: "1px solid " + (j < Math.round(s.level / 10) ? "transparent" : "#e0e0e0") }} />
              ))}
            </div>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#ccc", marginTop: 3, letterSpacing: 0.5 }}>
              PROFICIENCY: {Math.round(s.level / 10)}/10 · {s.level >= 90 ? "EXPERT" : s.level >= 70 ? "ADVANCED" : s.level >= 50 ? "COMPETENT" : "DEVELOPING"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Experience Tab ──
function ExperienceTab({ experience, setExperience }) {
  const add = () => setExperience([...experience, { id: Date.now(), role: "New Role", company: "", period: "Present", desc: "" }]);
  const del = (id) => { if (window.confirm("Delete?")) setExperience(experience.filter(e => e.id !== id)); };
  const upd = (id, key, val) => setExperience(experience.map(e => e.id === id ? { ...e, [key]: val } : e));

  return (
    <div>
      <SectionHead number="04" label="Work Experience" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#888", letterSpacing: 1 }}>{experience.length} ENTRIES</span>
        <button className="adm-btn" onClick={add} style={{ background: "#E8520A", color: "#fff", padding: "9px 18px" }}>+ ADD ENTRY</button>
      </div>
      {experience.map((e) => (
        <div key={e.id} className="adm-card">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            {[["Role", "role"], ["Company", "company"], ["Period", "period"]].map(([label, key]) => (
              <div key={key} style={{ gridColumn: key === "role" ? "1 / -1" : undefined }}>
                <label className="adm-label">{label}</label>
                <input className="adm-input" value={e[key] || ""} onChange={ev => upd(e.id, key, ev.target.value)} />
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="adm-label">Description</label>
              <textarea className="adm-input" rows={2} value={e.desc || ""} onChange={ev => upd(e.id, "desc", ev.target.value)} style={{ resize: "vertical" }} />
            </div>
          </div>
          <button className="adm-btn del-btn" onClick={() => del(e.id)} style={{ background: "#fff", color: "#999", border: "1px solid #ddd", padding: "6px 14px" }}>DELETE ENTRY</button>
        </div>
      ))}
    </div>
  );
}

// ── Main Admin Component ──

// ── Security Tab ──
function SecurityTab() {
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [msg, setMsg] = useState("");

  const handleChange = () => {
    if (!current || !newPw || !confirm) {
      setStatus("error"); setMsg("ALL FIELDS ARE REQUIRED"); return;
    }
    if (current !== getPassword()) {
      setStatus("error"); setMsg("CURRENT PASSWORD IS INCORRECT"); return;
    }
    if (newPw.length < 6) {
      setStatus("error"); setMsg("NEW PASSWORD MUST BE AT LEAST 6 CHARACTERS"); return;
    }
    if (newPw !== confirm) {
      setStatus("error"); setMsg("NEW PASSWORDS DO NOT MATCH"); return;
    }
    savePassword(newPw);
    setCurrent(""); setNewPw(""); setConfirm("");
    setStatus("success"); setMsg("PASSWORD UPDATED SUCCESSFULLY");
    setTimeout(() => setStatus(null), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Reset password back to default (christian2026)?")) {
      localStorage.removeItem("admin_password");
      setCurrent(""); setNewPw(""); setConfirm("");
      setStatus("success"); setMsg("PASSWORD RESET TO DEFAULT");
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div>
      <SectionHead number="05" label="Security Settings" />
      <div style={{ maxWidth: 480 }}>

        {/* Info box */}
        <div style={{ border: "1px solid #eee", borderLeft: "3px solid #111", padding: "14px 16px", marginBottom: 24, background: "#fafafa" }}>
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#E8520A", letterSpacing: 2, marginBottom: 6 }}>AUTHORIZATION NOTICE</div>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#777", lineHeight: 1.7 }}>
            Your password is stored in your browser's local storage. It is specific to this device and browser. Default password is <strong style={{ fontFamily: "'Courier Prime', monospace", color: "#111" }}>christian2026</strong>.
          </p>
        </div>

        {/* Password form */}
        <div style={{ border: "1px solid #eee", borderTop: "3px solid #E8520A", padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#E8520A", letterSpacing: 2, marginBottom: 18 }}>CHANGE ACCESS CODE</div>

          <div style={{ marginBottom: 14 }}>
            <label className="adm-label">Current Password</label>
            <input className="adm-input" type="password" placeholder="Enter current password..." value={current} onChange={e => setCurrent(e.target.value)} />
          </div>

          <div style={{ height: 1, background: "#f0f0f0", margin: "18px 0" }} />

          <div style={{ marginBottom: 14 }}>
            <label className="adm-label">New Password</label>
            <input className="adm-input" type="password" placeholder="Min. 6 characters..." value={newPw} onChange={e => setNewPw(e.target.value)} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="adm-label">Confirm New Password</label>
            <input className="adm-input" type="password" placeholder="Repeat new password..." value={confirm} onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleChange()} />
          </div>

          {/* Strength indicator */}
          {newPw.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#bbb", letterSpacing: 1, marginBottom: 5 }}>
                STRENGTH: {newPw.length < 6 ? "WEAK" : newPw.length < 10 ? "MODERATE" : "STRONG"}
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} style={{ flex: 1, height: 4, background: i < newPw.length ? (newPw.length < 6 ? "#ef4444" : newPw.length < 10 ? "#F59E0B" : "#22c55e") : "#eee" }} />
                ))}
              </div>
            </div>
          )}

          {/* Status message */}
          {status && (
            <div style={{ padding: "10px 14px", marginBottom: 14, border: `1px solid ${status === "success" ? "#22c55e" : "#ef4444"}`, borderLeft: `3px solid ${status === "success" ? "#22c55e" : "#ef4444"}`, background: status === "success" ? "#f0fdf4" : "#fef2f2" }}>
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: status === "success" ? "#22c55e" : "#ef4444", letterSpacing: 1 }}>
                {status === "success" ? "✓ " : "✕ "}{msg}
              </span>
            </div>
          )}

          <button className="adm-btn" onClick={handleChange}
            style={{ width: "100%", background: "#E8520A", color: "#fff", padding: "12px", fontSize: 11 }}>
            ▶ UPDATE PASSWORD
          </button>
        </div>

        {/* Reset to default */}
        <div style={{ border: "1px solid #fca5a5", borderLeft: "3px solid #ef4444", padding: 16, background: "#fff" }}>
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#ef4444", letterSpacing: 2, marginBottom: 8 }}>DANGER ZONE</div>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#999", marginBottom: 14, lineHeight: 1.6 }}>
            Reset your password back to the factory default: <strong style={{ fontFamily: "'Courier Prime', monospace", color: "#111" }}>christian2026</strong>
          </p>
          <button className="adm-btn del-btn" onClick={handleReset}
            style={{ background: "#fff", color: "#ef4444", border: "1px solid #fca5a5", padding: "9px 18px", fontSize: 10 }}>
            ↺ RESET TO DEFAULT
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Admin({ data, onSave, onClose }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("Profile");
  const [me, setMe] = useState({ ...data.me });
  const [projects, setProjects] = useState([...data.projects]);
  const [skills, setSkills] = useState([...data.skills]);
  const [experience, setExperience] = useState([...data.experience]);
  const [saved, setSaved] = useState(false);

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const handleSave = () => {
    onSave({ me, projects, skills, experience });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm("Reset ALL data to defaults? This cannot be undone.")) {
      resetData(); window.location.reload();
    }
  };

  const TABS = [
    { key: "Profile", label: "Profile", icon: "👤", num: "01" },
    { key: "Projects", label: "Projects", icon: "📐", num: "02" },
    { key: "Skills", label: "Skills", icon: "⚙️", num: "03" },
    { key: "Experience", label: "Experience", icon: "🔧", num: "04" },
    { key: "Security", label: "Security", icon: "🔐", num: "05" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Lato', sans-serif", color: "#111", position: "relative" }}>
      <style>{css}</style>

      {/* ── Sticky Header ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "2px solid #111", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: -4 }}>
            <Gear size={28} color="#E8520A" speed={8} />
            <Gear size={18} color="#111" speed={5} reverse style={{ marginLeft: -4, marginTop: 5 }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 900, color: "#111", textTransform: "uppercase", letterSpacing: 1, lineHeight: 1 }}>
              Admin<span style={{ color: "#E8520A" }}>.Panel</span>
            </div>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#bbb", letterSpacing: 2 }}>CONTROL SYSTEM</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="adm-btn" onClick={handleReset}
            style={{ background: "#fff", color: "#ef4444", border: "1px solid #fca5a5", padding: "7px 14px", fontSize: 10 }}>
            ↺ RESET
          </button>
          <button className="adm-btn" onClick={handleSave}
            style={{ background: saved ? "#22c55e" : "#E8520A", color: "#fff", padding: "7px 18px", fontSize: 11 }}>
            {saved ? "✓ SAVED" : "▶ SAVE"}
          </button>
          <button className="adm-btn" onClick={onClose}
            style={{ background: "#fff", color: "#888", border: "1px solid #ddd", padding: "7px 14px", fontSize: 10 }}>
            ← PORTFOLIO
          </button>
        </div>
      </div>

      <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto", padding: "28px 24px", gap: 24 }}>

        {/* ── Sidebar ── */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ border: "1px solid #eee", borderTop: "3px solid #E8520A", position: "sticky", top: 80 }}>
            {/* Sidebar header */}
            <div style={{ background: "#f8f8f8", padding: "10px 14px", borderBottom: "1px solid #eee" }}>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#E8520A", letterSpacing: 2 }}>NAVIGATION</div>
            </div>
            {TABS.map(t => (
              <button key={t.key} className="adm-tab" onClick={() => setTab(t.key)}
                style={{ color: tab === t.key ? "#E8520A" : "#555", background: tab === t.key ? "#fff8f5" : "transparent", borderLeft: tab === t.key ? "3px solid #E8520A" : "3px solid transparent", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ marginRight: 8 }}>{t.icon}</span>{t.label}
                <span style={{ float: "right", fontFamily: "'Courier Prime', monospace", fontSize: 10, color: tab === t.key ? "#E8520A" : "#ccc" }}>{t.num}</span>
              </button>
            ))}

            {/* Stats box */}
            <div style={{ padding: "12px 14px", borderTop: "1px solid #eee", background: "#fafafa" }}>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#E8520A", letterSpacing: 2, marginBottom: 8 }}>FILE SUMMARY</div>
              {[["PROJECTS", projects.length], ["SKILLS", skills.length], ["ROLES", experience.length]].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#bbb", letterSpacing: 1 }}>{label}</span>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: "#111" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ border: "1px solid #eee", borderTop: "3px solid #111", padding: 24 }}>
            {tab === "Profile" && <ProfileTab me={me} setMe={setMe} />}
            {tab === "Projects" && <ProjectsTab projects={projects} setProjects={setProjects} />}
            {tab === "Skills" && <SkillsTab skills={skills} setSkills={setSkills} />}
            {tab === "Experience" && <ExperienceTab experience={experience} setExperience={setExperience} />}
            {tab === "Security" && <SecurityTab />}
          </div>
          {/* Drawing footer */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, padding: "6px 0", borderTop: "1px solid #eee" }}>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#ddd", letterSpacing: 1 }}>MECH-PORTFOLIO · ADMIN CONTROL PANEL</span>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#ddd", letterSpacing: 1 }}>DWG: ADM-002 · REV A</span>
          </div>
        </div>
      </div>
    </div>
  );
}