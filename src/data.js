// ─────────────────────────────────────────
//  Portfolio Data + Supabase storage
// ─────────────────────────────────────────
import { supabase } from "./supabase";

export const DEFAULT_ME = {
  name: " ",
  role: "Mechanical Engineer",
  subtitle: " ",
  tagline: " ",
  location: "Bohol, Philippines",
  email: " ",
  github: " ",
  linkedin: " ",
  bio: " ",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MechEng&backgroundColor=b6e3f4",
  aboutPhoto: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80",
};

export const DEFAULT_PROJECTS = [
  { id: 1, title: "Turbine Blade Stress Analysis", year: "2024", desc: "FEA simulation of a high-pressure turbine blade under thermal and centrifugal loading. Optimized blade geometry reducing peak von Mises stress by 18%.", tags: ["ANSYS", "SolidWorks", "FEA", "CFD"], img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80", color: "#E8520A", link: "" },
  { id: 2, title: "Heat Exchanger Design", year: "2024", desc: "Shell-and-tube heat exchanger for an industrial cooling application achieving 94% thermal efficiency using LMTD method and TEMA standards.", tags: ["Thermal Design", "AutoCAD", "ASME", "TEMA"], img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", color: "#2563EB", link: "" },
  { id: 3, title: "Robotic Arm Linkage System", year: "2023", desc: "6-DOF robotic arm for precision pick-and-place. Kinematic and dynamic analysis performed with all components designed to tight GD&T tolerances.", tags: ["SolidWorks", "GD&T", "Kinematics", "CNC"], img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80", color: "#059669", link: "" },
  { id: 4, title: "Pneumatic Press Machine", year: "2023", desc: "Designed and fabricated a 10-ton pneumatic press for sheet metal forming with custom die set, safety interlock, and PLC control. Reduces cycle time by 35%.", tags: ["Pneumatics", "PLC", "Fabrication", "Sheet Metal"], img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80", color: "#7C3AED", link: "" },
  { id: 5, title: "Structural Frame Analysis", year: "2022", desc: "Static and dynamic structural analysis of a steel support frame for industrial conveyor belt. Verified against AISC standards with optimized weld joint design.", tags: ["ANSYS", "Structural", "AISC", "Weld Design"], img: "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=600&q=80", color: "#DC2626", link: "" },
  { id: 6, title: "HVAC Ductwork Layout", year: "2022", desc: "Complete HVAC ductwork design for a 3-storey commercial building using psychrometric calculations and duct sizing per ASHRAE standards.", tags: ["HVAC", "ASHRAE", "AutoCAD MEP", "Load Calc"], img: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&q=80", color: "#0891B2", link: "" },
];

export const DEFAULT_SKILLS = [
  { id: 1, name: "SolidWorks / CAD", icon: "⚙️", level: 92 },
  { id: 2, name: "ANSYS / FEA", icon: "🔬", level: 85 },
  { id: 3, name: "AutoCAD", icon: "📐", level: 90 },
  { id: 4, name: "Thermodynamics", icon: "🌡️", level: 88 },
  { id: 5, name: "GD&T / Tolerancing", icon: "📏", level: 82 },
  { id: 6, name: "Manufacturing Proc.", icon: "🏭", level: 80 },
  { id: 7, name: "Fluid Mechanics", icon: "💧", level: 78 },
  { id: 8, name: "Welding / Fabrication", icon: "🔧", level: 75 },
];

export const DEFAULT_EXPERIENCE = [
  { id: 1, role: "Junior Mechanical Engineer", company: "PhilMech Industries", period: "2023 – Present", desc: "Design and analysis of machine components using SolidWorks. Performed FEA simulations for stress, fatigue, and thermal analysis. Coordinated with manufacturing team for DFM reviews." },
  { id: 2, role: "CAD Design Intern", company: "DOST – MIRDC", period: "2022 – 2023", desc: "Produced detailed engineering drawings and 3D models for agricultural machinery prototypes. Assisted in tolerance analysis and GD&T annotations per ASME Y14.5." },
  { id: 3, role: "Engineering Thesis Researcher", company: "University – Mech Dept.", period: "2021 – 2022", desc: "Conducted thermal and CFD analysis on a biomass gasifier reactor. Published research on heat transfer optimization in fixed-bed combustion chambers." },
];

// ── Supabase: Load portfolio data ──
export async function loadData() {
  try {
    const { data, error } = await supabase
      .from("portfolio_data")
      .select("key, value");
    if (error || !data?.length) return null;
    const result = {};
    data.forEach(row => { result[row.key] = row.value; });
    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
}

// ── Supabase: Save portfolio data ──
export async function saveData(payload) {
  const entries = [
    { key: "me",         value: payload.me },
    { key: "projects",   value: payload.projects },
    { key: "skills",     value: payload.skills },
    { key: "experience", value: payload.experience },
  ];
  for (const entry of entries) {
    await supabase
      .from("portfolio_data")
      .upsert(entry, { onConflict: "key" });
  }
}

// ── Keep resetData so Admin.js still compiles ──
export function resetData() {
  // No-op — data lives in Supabase now
  // To reset, go to Supabase → Table Editor → delete rows in portfolio_data
}