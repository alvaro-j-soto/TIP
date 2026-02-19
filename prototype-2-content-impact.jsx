import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";

const contentUpdates = [
  {
    id: 1,
    topic: "PTO / Time Off Policy",
    updatedBy: "Stacy M.",
    updatedDate: "Jan 15, 2026",
    daysSince: 35,
    before: { questions: 847, quality: 42, fallbackRate: 58 },
    after: { questions: 518, quality: 89, fallbackRate: 11 },
    status: "improved",
    details: "Added site-specific accrual rules for Aurora, Newark, and Irving. Added blackout date calendar. Added rollover policy FAQ.",
    trendData: [
      { week: "Dec 23", questions: 210, quality: 41 },
      { week: "Dec 30", questions: 225, quality: 40 },
      { week: "Jan 6", questions: 198, quality: 43 },
      { week: "Jan 13", questions: 215, quality: 42 },
      { week: "Jan 20", questions: 156, quality: 72 },
      { week: "Jan 27", questions: 138, quality: 84 },
      { week: "Feb 3", questions: 125, quality: 88 },
      { week: "Feb 10", questions: 130, quality: 89 },
      { week: "Feb 17", questions: 127, quality: 89 },
    ],
  },
  {
    id: 2,
    topic: "Safety Protocols",
    updatedBy: "Marcus J.",
    updatedDate: "Feb 3, 2026",
    daysSince: 16,
    before: { questions: 412, quality: 34, fallbackRate: 66 },
    after: { questions: 380, quality: 61, fallbackRate: 39 },
    status: "improving",
    details: "Updated PPE requirements for cold storage. Added new chemical handling procedures per Jan 2026 OSHA update. Still missing: forklift certification renewal process.",
    trendData: [
      { week: "Jan 6", questions: 95, quality: 33 },
      { week: "Jan 13", questions: 108, quality: 35 },
      { week: "Jan 20", questions: 112, quality: 34 },
      { week: "Jan 27", questions: 98, quality: 33 },
      { week: "Feb 3", questions: 102, quality: 35 },
      { week: "Feb 10", questions: 94, quality: 55 },
      { week: "Feb 17", questions: 88, quality: 61 },
    ],
  },
  {
    id: 3,
    topic: "Benefits & Insurance",
    updatedBy: null,
    updatedDate: null,
    daysSince: null,
    before: { questions: 541, quality: 45, fallbackRate: 55 },
    after: null,
    status: "no_update",
    details: "No content update made. Gap identified 45 days ago. Life event and eligibility change content still missing.",
    trendData: [
      { week: "Jan 6", questions: 130, quality: 46 },
      { week: "Jan 13", questions: 138, quality: 44 },
      { week: "Jan 20", questions: 142, quality: 45 },
      { week: "Jan 27", questions: 135, quality: 44 },
      { week: "Feb 3", questions: 148, quality: 43 },
      { week: "Feb 10", questions: 140, quality: 45 },
      { week: "Feb 17", questions: 145, quality: 45 },
    ],
  },
];

const ImpactCard = ({ label, before, after, unit, inverse }) => {
  if (after === null) return (
    <div style={{
      flex: 1, backgroundColor: "#f9fafb", borderRadius: 8, padding: 16, textAlign: "center",
    }}>
      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#9ca3af" }}>—</div>
      <div style={{ fontSize: 11, color: "#9ca3af" }}>No update yet</div>
    </div>
  );

  const improved = inverse ? after < before : after > before;
  const changePercent = Math.round(Math.abs(after - before) / before * 100);
  const changeDir = (inverse ? after < before : after > before) ? "improvement" : "regression";

  return (
    <div style={{
      flex: 1, backgroundColor: improved ? "#f0fdf4" : "#fff7ed", borderRadius: 8, padding: 16, textAlign: "center",
    }}>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4, fontWeight: 500 }}>{label}</div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <span style={{ fontSize: 18, color: "#9ca3af", textDecoration: "line-through" }}>{before}{unit}</span>
        <span style={{ fontSize: 14, color: "#6b7280" }}>→</span>
        <span style={{ fontSize: 24, fontWeight: 700, color: improved ? "#16a34a" : "#BF4B08" }}>{after}{unit}</span>
      </div>
      <div style={{
        fontSize: 12, fontWeight: 600,
        color: improved ? "#16a34a" : "#BF4B08",
      }}>
        {improved ? "↓" : "↑"} {changePercent}% {changeDir}
      </div>
    </div>
  );
};

export default function ContentImpactDashboard() {
  const [selectedUpdate, setSelectedUpdate] = useState(0);
  const current = contentUpdates[selectedUpdate];

  const statusColors = {
    improved: { bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a", label: "✓ Significant Improvement" },
    improving: { bg: "#fefce8", border: "#fde68a", text: "#92400e", label: "↗ Improving — Monitor" },
    no_update: { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", label: "⚠ No Action Taken" },
  };
  const status = statusColors[current.status];

  return (
    <div style={{
      fontFamily: "'Urbanist', 'Inter', system-ui, sans-serif",
      backgroundColor: "#F5FAF8", minHeight: "100vh",
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#263D39", color: "white", padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4, letterSpacing: 0.5 }}>TEAMSENSE INSIGHTS</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Content Improvement Impact</div>
        </div>
        <div style={{
          backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 16px",
          fontSize: 13, fontWeight: 500,
        }}>
          Showing: All Sites · Last 90 Days
        </div>
      </div>

      {/* Summary Banner */}
      <div style={{
        margin: "24px 32px 0", backgroundColor: "white", borderRadius: 12,
        padding: 20, display: "flex", gap: 24, alignItems: "center",
        border: "1px solid #e5e7eb",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginBottom: 2 }}>Content Updates This Quarter</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#263D39" }}>2 <span style={{ fontSize: 16, fontWeight: 400, color: "#6b7280" }}>of 4 gaps addressed</span></div>
        </div>
        <div style={{ width: 1, height: 48, backgroundColor: "#e5e7eb" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginBottom: 2 }}>Questions Reduced</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#16a34a" }}>-361 <span style={{ fontSize: 16, fontWeight: 400, color: "#6b7280" }}>/month from updates</span></div>
        </div>
        <div style={{ width: 1, height: 48, backgroundColor: "#e5e7eb" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginBottom: 2 }}>HR Time Saved (est.)</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#6DAEA2" }}>~18 hrs <span style={{ fontSize: 16, fontWeight: 400, color: "#6b7280" }}>/month</span></div>
        </div>
      </div>

      {/* Update Selector */}
      <div style={{ padding: "24px 32px 0", display: "flex", gap: 12 }}>
        {contentUpdates.map((u, i) => (
          <button key={u.id} onClick={() => setSelectedUpdate(i)}
            style={{
              flex: 1, padding: 16, borderRadius: 12, cursor: "pointer",
              border: selectedUpdate === i ? "2px solid #263D39" : "1px solid #e5e7eb",
              backgroundColor: selectedUpdate === i ? "white" : "#f9fafb",
              textAlign: "left",
            }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#263D39", marginBottom: 4 }}>{u.topic}</div>
            <div style={{
              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10, display: "inline-block",
              backgroundColor: statusColors[u.status].bg, color: statusColors[u.status].text,
              border: `1px solid ${statusColors[u.status].border}`,
            }}>
              {statusColors[u.status].label}
            </div>
            {u.updatedDate && (
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>Updated {u.updatedDate} by {u.updatedBy}</div>
            )}
          </button>
        ))}
      </div>

      {/* Detail View */}
      <div style={{ padding: "24px 32px" }}>
        <div style={{ backgroundColor: "white", borderRadius: 12, padding: 24, border: "1px solid #e5e7eb" }}>

          {/* Status Header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20,
            padding: 16, borderRadius: 8,
            backgroundColor: status.bg, border: `1px solid ${status.border}`,
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#263D39" }}>{current.topic}</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{current.details}</div>
            </div>
            <div style={{
              fontSize: 14, fontWeight: 700, color: status.text,
              backgroundColor: "white", padding: "6px 14px", borderRadius: 8,
              border: `1px solid ${status.border}`,
            }}>
              {status.label}
            </div>
          </div>

          {/* Before/After Metrics */}
          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            <ImpactCard
              label="Questions / Month"
              before={current.before.questions}
              after={current.after?.questions ?? null}
              unit="" inverse={true}
            />
            <ImpactCard
              label="Resolution Quality"
              before={current.before.quality}
              after={current.after?.quality ?? null}
              unit="%" inverse={false}
            />
            <ImpactCard
              label="Fallback-to-HR Rate"
              before={current.before.fallbackRate}
              after={current.after?.fallbackRate ?? null}
              unit="%" inverse={true}
            />
          </div>

          {/* Trend Chart */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#263D39", marginBottom: 4 }}>Weekly Trend</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>
              {current.updatedDate
                ? `Content updated on ${current.updatedDate} (dashed line)`
                : "No content update — flat trend indicates stagnant quality"}
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={current.trendData}>
                  <defs>
                    <linearGradient id="qualityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6DAEA2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6DAEA2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  {current.updatedDate && (
                    <ReferenceLine
                      x={current.id === 1 ? "Jan 13" : "Feb 3"}
                      stroke="#F6B725" strokeWidth={2} strokeDasharray="5 5"
                      label={{ value: "Content Updated", position: "top", fontSize: 11, fill: "#92400e" }}
                    />
                  )}
                  <Area type="monotone" dataKey="quality" stroke="#6DAEA2" strokeWidth={2}
                    fill="url(#qualityGrad)" name="Resolution Quality %" dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* What Changed callout */}
          {current.status === "no_update" && (
            <div style={{
              backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
              padding: 16, marginTop: 16,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#991b1b", marginBottom: 4 }}>
                ⚠ This gap was identified 45 days ago
              </div>
              <div style={{ fontSize: 13, color: "#7f1d1d", lineHeight: 1.5 }}>
                ~298 employees per month are not getting the answers they need about Benefits & Insurance.
                The recommended fix: add life event and eligibility change content.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prototype Label */}
      <div style={{
        textAlign: "center", padding: "8px 32px 32px",
        fontSize: 12, color: "#9ca3af", fontStyle: "italic",
      }}>
        TIP v1.5 — Content Improvement Impact Prototype · TeamSense Research Session · Not final design
      </div>
    </div>
  );
}
