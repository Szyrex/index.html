import React, { useState, useMemo } from "react";
import { AlertTriangle, MapPin, Users, Droplets, Wind, Activity, ChevronRight, X, Zap, Radio, TrendingUp, Navigation, CheckCircle2 } from "lucide-react";

const INCIDENTS = [
  {
    id: "INC-0417",
    title: "Flooding near Ashok Bus Stand",
    area: "Sector 12, Riverside District",
    severity: 89,
    severityLabel: "CRITICAL",
    confidence: 86,
    peopleAtRisk: 70,
    status: "unassigned",
    x: 34, y: 42,
    sources: [
      { type: "Citizen SOS", text: "Water rising fast near bus stand, families stuck on roof", verified: true },
      { type: "Social Media", text: "3 independent posts, same location, flood photos", verified: true },
      { type: "Weather API", text: "142mm rainfall in 3hrs, river 2.1m above danger mark", verified: true },
      { type: "Govt Alert", text: "IMD red alert issued for Riverside District", verified: true },
    ],
    reasoning: [
      "4 independent sources confirm same location within 200m radius",
      "Water level sensor data confirms rapid rise (0.4m/hr)",
      "Photo evidence timestamp matches report window",
      "70 people estimated at risk based on residential density + reports",
    ],
    recommendedAction: "Deploy water rescue team immediately",
    factors: { vulnerable: 82, waterRise: 91, access: 45, weather: 88 },
  },
  {
    id: "INC-0418",
    title: "Building collapse risk, Old Quarter",
    area: "Heritage Lane, Ward 7",
    severity: 71,
    severityLabel: "HIGH",
    confidence: 64,
    peopleAtRisk: 25,
    status: "unassigned",
    x: 62, y: 58,
    sources: [
      { type: "Citizen Report", text: "Visible cracks in 3-storey building wall, residents evacuating", verified: true },
      { type: "News", text: "Local news crew on site, unconfirmed structural assessment", verified: false },
    ],
    reasoning: [
      "Only 2 sources reporting — moderate confidence",
      "No engineering assessment yet available",
      "Elderly residents in building per prior civic records",
    ],
    recommendedAction: "Send structural assessment team, precautionary evacuation",
    factors: { vulnerable: 70, waterRise: 0, access: 80, weather: 20 },
  },
  {
    id: "INC-0419",
    title: "Road washout, Highway 9 bridge approach",
    area: "North Corridor",
    severity: 55,
    severityLabel: "MEDIUM",
    confidence: 92,
    peopleAtRisk: 0,
    status: "unassigned",
    x: 20, y: 20,
    sources: [
      { type: "Govt Alert", text: "PWD confirms road washout, bridge access compromised", verified: true },
      { type: "IoT Sensor", text: "Road sensor offline since 04:12, consistent with washout", verified: true },
      { type: "Citizen Report", text: "Photo of washed-out approach road", verified: true },
    ],
    reasoning: [
      "Official PWD confirmation — highest trust source",
      "Sensor data corroborates timeline",
      "No casualties reported, infrastructure-only incident",
    ],
    recommendedAction: "Close route, redirect traffic, no rescue team needed",
    factors: { vulnerable: 10, waterRise: 60, access: 95, weather: 40 },
  },
];

const TEAMS = [
  { id: "T1", name: "Water Rescue Alpha", skill: "Flood/Water", status: "available", x: 15, y: 55 },
  { id: "T2", name: "Structural Response Bravo", skill: "Building Collapse", status: "available", x: 75, y: 30 },
  { id: "T3", name: "Medical Rapid Charlie", skill: "Medical/Evac", status: "en-route", x: 50, y: 70 },
];

function Gauge({ value, label, color, size = 72 }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 72 72" className="-rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#1E2A42" strokeWidth="6" />
          <circle
            cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold" style={{ color }}>
          {value}
        </div>
      </div>
      <span className="text-[10px] tracking-wider uppercase text-slate-500 font-medium">{label}</span>
    </div>
  );
}

function severityColor(sev) {
  if (sev >= 80) return "#E5484D";
  if (sev >= 60) return "#F0A93A";
  if (sev >= 40) return "#E5C93A";
  return "#3FA9A0";
}

export default function RESQNetPrototype() {
  const [selectedId, setSelectedId] = useState(INCIDENTS[0].id);
  const [showWhy, setShowWhy] = useState(false);
  const [whatIfActive, setWhatIfActive] = useState(false);
  const [assignedIncidents, setAssignedIncidents] = useState({});

  const selected = useMemo(() => INCIDENTS.find(i => i.id === selectedId), [selectedId]);

  const handleAssign = (teamId) => {
    setAssignedIncidents(prev => ({ ...prev, [selectedId]: teamId }));
  };

  return (
    <div className="w-full h-screen bg-[#0B1120] text-slate-200 flex flex-col overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1E2A42] bg-[#0D1526] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Radio size={16} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight text-sm">RESQ-NET</div>
            <div className="text-[10px] text-slate-500 -mt-0.5">Disaster Intelligence Console</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            {INCIDENTS.length} ACTIVE INCIDENTS
          </div>
          <div className="text-slate-500 font-mono">Riverside District · Live</div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Incident feed */}
        <div className="w-[300px] border-r border-[#1E2A42] flex flex-col shrink-0 bg-[#0D1526]/50">
          <div className="px-4 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-[#1E2A42]">
            Incident Feed
          </div>
          <div className="flex-1 overflow-y-auto">
            {INCIDENTS.map(inc => (
              <button
                key={inc.id}
                onClick={() => { setSelectedId(inc.id); setShowWhy(false); }}
                className={`w-full text-left px-4 py-3 border-b border-[#1E2A42]/60 transition-colors ${selectedId === inc.id ? "bg-[#16213B]" : "hover:bg-[#121A2E]"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-slate-500">{inc.id}</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ color: severityColor(inc.severity), background: `${severityColor(inc.severity)}1A` }}
                  >
                    {inc.severityLabel}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-100 leading-snug">{inc.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{inc.area}</div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Users size={11} />{inc.peopleAtRisk}</span>
                  <span className="flex items-center gap-1"><TrendingUp size={11} />{inc.confidence}%</span>
                  {assignedIncidents[inc.id] && (
                    <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={11} />Assigned</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative bg-[#0A0F1D] min-w-0">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: "linear-gradient(#2A3B5C 1px, transparent 1px), linear-gradient(90deg, #2A3B5C 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {whatIfActive && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[3px] h-40 bg-red-500/70" style={{ transform: "translateX(-50%) rotate(15deg)" }} />
          )}

          {/* Bridge marker for what-if */}
          <div className="absolute" style={{ left: "48%", top: "35%" }}>
            <div className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${whatIfActive ? "border-red-500 text-red-400 bg-red-500/10" : "border-slate-700 text-slate-500"}`}>
              Bridge B {whatIfActive && "· CLOSED"}
            </div>
          </div>

          {INCIDENTS.map(inc => (
            <button
              key={inc.id}
              onClick={() => { setSelectedId(inc.id); setShowWhy(false); }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${inc.x}%`, top: `${inc.y}%` }}
            >
              <div
                className={`rounded-full flex items-center justify-center transition-all ${selectedId === inc.id ? "w-10 h-10 ring-2 ring-white/40" : "w-7 h-7"}`}
                style={{ background: severityColor(inc.severity) }}
              >
                <AlertTriangle size={selectedId === inc.id ? 18 : 14} className="text-white" />
              </div>
              {selectedId === inc.id && (
                <span className="absolute inset-0 rounded-full animate-ping" style={{ background: severityColor(inc.severity), opacity: 0.4 }} />
              )}
            </button>
          ))}

          {TEAMS.map(team => (
            <div
              key={team.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
              style={{ left: `${team.x}%`, top: `${team.y}%` }}
            >
              <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
                <Navigation size={12} className="text-cyan-300" />
              </div>
              <span className="text-[9px] font-mono text-cyan-300/80 bg-[#0A0F1D]/80 px-1 rounded whitespace-nowrap">{team.name.split(" ")[0]}</span>
            </div>
          ))}

          {/* What-if toggle */}
          <div className="absolute bottom-4 left-4">
            <button
              onClick={() => setWhatIfActive(v => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                whatIfActive ? "bg-red-500/15 border-red-500 text-red-300" : "bg-[#131B2E] border-[#2A3B5C] text-slate-300 hover:border-slate-500"
              }`}
            >
              <Zap size={13} />
              {whatIfActive ? "Simulating: Bridge B closed" : "What-if: Close Bridge B"}
            </button>
          </div>
        </div>

        {/* Detail panel */}
        <div className="w-[380px] border-l border-[#1E2A42] flex flex-col shrink-0 bg-[#0D1526]/50 overflow-y-auto">
          <div className="p-5">
            <div className="flex items-start justify-between mb-1">
              <span className="font-mono text-[11px] text-slate-500">{selected.id}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ color: severityColor(selected.severity), background: `${severityColor(selected.severity)}1A` }}>
                {selected.severityLabel}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-tight mb-1">{selected.title}</h2>
            <div className="flex items-center gap-1 text-xs text-slate-400 mb-4">
              <MapPin size={12} /> {selected.area}
            </div>

            <div className="flex justify-around bg-[#131B2E] rounded-xl py-4 mb-4 border border-[#1E2A42]">
              <Gauge value={selected.severity} label="Severity" color={severityColor(selected.severity)} />
              <Gauge value={selected.confidence} label="Confidence" color="#4F8FE8" />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-[#131B2E] rounded-lg p-3 border border-[#1E2A42]">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wide mb-1"><Users size={11} />People at Risk</div>
                <div className="text-xl font-bold text-white font-mono">{selected.peopleAtRisk}</div>
              </div>
              <div className="bg-[#131B2E] rounded-lg p-3 border border-[#1E2A42]">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wide mb-1"><Activity size={11} />Sources</div>
                <div className="text-xl font-bold text-white font-mono">{selected.sources.length}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2 font-semibold">Recommended Action</div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2.5 text-sm text-emerald-300 font-medium">
                {selected.recommendedAction}
              </div>
            </div>

            {/* Sources */}
            <div className="mb-4">
              <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2 font-semibold">Merged Sources</div>
              <div className="space-y-1.5">
                {selected.sources.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs bg-[#131B2E] rounded-md px-2.5 py-2 border border-[#1E2A42]">
                    {s.verified ? <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" /> : <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />}
                    <div>
                      <span className="text-slate-400 font-medium">{s.type}: </span>
                      <span className="text-slate-300">{s.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WHY button */}
            <button
              onClick={() => setShowWhy(v => !v)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#16213B] border border-[#2A3B5C] hover:border-slate-500 text-sm font-medium text-slate-200 mb-4 transition-colors"
            >
              <span className="flex items-center gap-2"><Zap size={14} className="text-amber-400" /> Why this recommendation?</span>
              <ChevronRight size={16} className={`transition-transform ${showWhy ? "rotate-90" : ""}`} />
            </button>

            {showWhy && (
              <div className="mb-4 space-y-2 border-l-2 border-amber-500/40 pl-3">
                {selected.reasoning.map((r, i) => (
                  <div key={i} className="text-xs text-slate-300 leading-relaxed">{r}</div>
                ))}
              </div>
            )}

            {/* Severity factors */}
            <div className="mb-5">
              <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2 font-semibold">Severity Breakdown</div>
              <div className="space-y-2">
                {Object.entries(selected.factors).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-0.5 capitalize">
                      <span>{k === "waterRise" ? "Water Rise Rate" : k}</span>
                      <span className="font-mono">{v}</span>
                    </div>
                    <div className="h-1.5 bg-[#1E2A42] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${v}%`, background: severityColor(v) }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team assignment */}
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2 font-semibold">Assign Team</div>
              <div className="space-y-1.5">
                {TEAMS.map(team => {
                  const isAssigned = assignedIncidents[selectedId] === team.id;
                  return (
                    <button
                      key={team.id}
                      onClick={() => handleAssign(team.id)}
                      disabled={team.status === "en-route"}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-colors ${
                        isAssigned ? "bg-emerald-500/10 border-emerald-500 text-emerald-300" :
                        team.status === "en-route" ? "opacity-40 border-[#1E2A42] cursor-not-allowed" :
                        "bg-[#131B2E] border-[#1E2A42] hover:border-slate-500 text-slate-300"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Navigation size={12} />
                        {team.name}
                      </span>
                      <span className="text-[10px] text-slate-500">{isAssigned ? "Assigned" : team.status}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
