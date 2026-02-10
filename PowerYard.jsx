import { useEffect, useMemo, useState } from "react";

const T = {
  bg: "#070F1C",
  panel: "#0E1A2E",
  panelHi: "#13233D",
  border: "#243B5D",
  text: "#EAF2FF",
  textDim: "#8DA6C4",
  blue: "#4EA1FF",
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
};

const STATUS = {
  available: { label: "Available", color: T.green },
  loaded: { label: "Loaded", color: T.blue },
  pending: { label: "Pending", color: T.amber },
  urgent: { label: "Urgent", color: T.red },
};

const TRAILERS = [
  { id: "t01", num: "TRL-4821", zone: "Zone A", status: "loaded", task: "pending", dest: "Memphis" },
  { id: "t02", num: "TRL-3305", zone: "Zone A", status: "available", task: "none", dest: "—" },
  { id: "t03", num: "TRL-7741", zone: "Zone A", status: "urgent", task: "urgent", dest: "Chicago" },
  { id: "t04", num: "TRL-2209", zone: "Zone B", status: "loaded", task: "complete", dest: "Dallas" },
  { id: "t05", num: "TRL-5514", zone: "Zone B", status: "pending", task: "pending", dest: "Atlanta" },
  { id: "t06", num: "TRL-8847", zone: "Zone C", status: "available", task: "none", dest: "—" },
  { id: "t07", num: "TRL-4473", zone: "Zone C", status: "urgent", task: "urgent", dest: "Denver" },
  { id: "t08", num: "TRL-1147", zone: "Zone D", status: "loaded", task: "complete", dest: "Nashville" },
  { id: "t09", num: "TRL-8823", zone: "Zone D", status: "urgent", task: "urgent", dest: "Kansas City" },
];

const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D"];

function Card({ trailer, onOpen }) {
  const s = STATUS[trailer.status];
  return (
    <button
      onClick={() => onOpen(trailer)}
      style={{
        background: "linear-gradient(180deg, #13233D 0%, #0E1A2E 100%)",
        border: `1px solid ${T.border}`,
        borderTop: `3px solid ${s.color}`,
        borderRadius: 12,
        color: T.text,
        padding: 12,
        textAlign: "left",
        display: "grid",
        gap: 6,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{trailer.num}</strong>
        <span style={{ fontSize: 11, color: s.color, fontWeight: 700 }}>{s.label}</span>
      </div>
      <div style={{ color: T.textDim, fontSize: 12 }}>{trailer.zone}</div>
      <div style={{ fontSize: 12 }}>
        Destination: <span style={{ color: "#BFE0FF" }}>{trailer.dest}</span>
      </div>
    </button>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 12px",
        borderRadius: 999,
        border: `1px solid ${active ? T.blue : T.border}`,
        background: active ? "rgba(78,161,255,0.15)" : "transparent",
        color: active ? "#CFE6FF" : T.textDim,
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

export default function PowerYard() {
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState("All Zones");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showCmdHint, setShowCmdHint] = useState(true);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("yard-search")?.focus();
      }
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    return TRAILERS.filter((t) => {
      const q = query.toLowerCase().trim();
      const matchesQuery = !q || [t.num, t.dest, t.zone, t.status].join(" ").toLowerCase().includes(q);
      const matchesZone = zone === "All Zones" || t.zone === zone;
      const matchesStatus = status === "all" || t.status === status;
      return matchesQuery && matchesZone && matchesStatus;
    });
  }, [query, zone, status]);

  const kpis = useMemo(() => {
    const urgent = TRAILERS.filter((t) => t.status === "urgent").length;
    const pending = TRAILERS.filter((t) => t.status === "pending" || t.task === "urgent").length;
    return { total: TRAILERS.length, urgent, pending };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
        }
      `}</style>

      <header style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(10px)", background: "rgba(7,15,28,.85)", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ padding: "14px 20px", display: "grid", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: 18 }}>⚡ PowerYard Control Center</h1>
            <div style={{ display: "flex", gap: 8 }}>
              <small style={{ color: T.textDim }}>Total: {kpis.total}</small>
              <small style={{ color: T.amber }}>Pending: {kpis.pending}</small>
              <small style={{ color: T.red }}>Urgent: {kpis.urgent}</small>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10 }}>
            <input
              id="yard-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowCmdHint(false)}
              placeholder="Search trailer, destination, zone, status…"
              style={{
                width: "100%",
                background: T.panel,
                border: `1px solid ${T.border}`,
                color: T.text,
                borderRadius: 10,
                padding: "10px 12px",
                outline: "none",
              }}
            />
            <select value={zone} onChange={(e) => setZone(e.target.value)} style={{ background: T.panel, color: T.text, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px" }}>
              <option>All Zones</option>
              {ZONES.map((z) => <option key={z}>{z}</option>)}
            </select>
            <button onClick={() => { setQuery(""); setZone("All Zones"); setStatus("all"); }} style={{ background: "transparent", color: T.textDim, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>Reset</button>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["all", ...Object.keys(STATUS)].map((s) => (
              <FilterChip key={s} label={s === "all" ? "All" : STATUS[s].label} active={status === s} onClick={() => setStatus(s)} />
            ))}
            {showCmdHint && <span style={{ marginLeft: "auto", fontSize: 12, color: T.textDim }}>Tip: Press ⌘/Ctrl + K to jump to search</span>}
          </div>
        </div>
      </header>

      <main style={{ padding: 20 }}>
        {filtered.length === 0 ? (
          <div style={{ background: T.panel, border: `1px dashed ${T.border}`, borderRadius: 12, padding: 24, textAlign: "center", color: T.textDim }}>
            No trailers match your filters. Try clearing search or selecting “All”.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {filtered.map((t) => <Card key={t.id} trailer={t} onOpen={setSelected} />)}
          </div>
        )}
      </main>

      {selected && (
        <aside style={{ position: "fixed", right: 16, bottom: 16, width: 360, maxWidth: "calc(100vw - 32px)", background: T.panelHi, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16 }}>{selected.num}</h2>
              <div style={{ color: T.textDim, fontSize: 12 }}>{selected.zone}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8, color: T.textDim, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ marginTop: 10, display: "grid", gap: 6, fontSize: 13 }}>
            <div>Status: <b style={{ color: STATUS[selected.status].color }}>{STATUS[selected.status].label}</b></div>
            <div>Task: <b>{selected.task}</b></div>
            <div>Destination: <b>{selected.dest}</b></div>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button style={{ borderRadius: 9, border: `1px solid ${T.border}`, background: "#173054", color: "#BFE0FF", padding: 10, cursor: "pointer" }}>Move</button>
            <button style={{ borderRadius: 9, border: "1px solid #7F1D1D", background: "#2A1111", color: "#FCA5A5", padding: 10, cursor: "pointer" }}>Depart</button>
          </div>
        </aside>
      )}
    </div>
  );
}
