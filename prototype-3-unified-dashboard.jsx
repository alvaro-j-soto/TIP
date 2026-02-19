import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from "recharts";

const attendanceTrend = [
  { week: "Jan 6", calloffs: 42, pto: 28, ncns: 8, tardy: 15, eaQuestions: 890 },
  { week: "Jan 13", calloffs: 38, pto: 31, ncns: 6, tardy: 12, eaQuestions: 920 },
  { week: "Jan 20", calloffs: 51, pto: 45, ncns: 11, tardy: 18, eaQuestions: 1150 },
  { week: "Jan 27", calloffs: 44, pto: 35, ncns: 7, tardy: 14, eaQuestions: 980 },
  { week: "Feb 3", calloffs: 39, pto: 32, ncns: 5, tardy: 11, eaQuestions: 940 },
  { week: "Feb 10", calloffs: 47, pto: 52, ncns: 9, tardy: 16, eaQuestions: 1180 },
  { week: "Feb 17", calloffs: 43, pto: 38, ncns: 7, tardy: 13, eaQuestions: 1020 },
];

const dayOfWeek = [
  { day: "Mon", absences: 68, eaQuestions: 245 },
  { day: "Tue", absences: 42, eaQuestions: 180 },
  { day: "Wed", absences: 35, eaQuestions: 155 },
  { day: "Thu", absences: 38, eaQuestions: 160 },
  { day: "Fri", absences: 52, eaQuestions: 210 },
  { day: "Sat", absences: 24, eaQuestions: 85 },
  { day: "Sun", absences: 18, eaQuestions: 45 },
];

const shiftBreakdown = [
  { shift: "1st Shift (6a-2p)", absences: 89, absenceRate: "4.2%", eaUsage: 1840, topTopic: "PTO Policy", topTopicPct: "28%" },
  { shift: "2nd Shift (2p-10p)", absences: 112, absenceRate: "5.8%", eaUsage: 1620, topTopic: "Shift Schedule", topTopicPct: "34%" },
  { shift: "3rd Shift (10p-6a)", absences: 63, absenceRate: "6.1%", eaUsage: 823, topTopic: "Safety Protocols", topTopicPct: "41%" },
];

const correlationInsights = [
  {
    type: "spike",
    icon: "🔗",
    title: "PTO questions and PTO absences moving together",
    detail: "Week of Feb 10: PTO questions spiked 42% and PTO call-offs increased 49%. Employees may be researching policy before requesting time off.",
    action: "Review PTO content — are employees finding what they need, or calling off because they can't figure out the process?",
    confidence: "Strong correlation (r=0.84 over 8 weeks)",
  },
  {
    type: "pattern",
    icon: "📊",
    title: "Monday EA usage predicts Monday absences",
    detail: "Monday morning EA questions (6am-8am) correlate with same-day call-off volume. When pre-shift EA questions exceed 60, call-offs that day are 35% higher than average.",
    action: "Potential leading indicator — could enable proactive staffing adjustments.",
    confidence: "Moderate correlation (r=0.71 over 12 weeks)",
  },
  {
    type: "gap",
    icon: "⚠️",
    title: "3rd shift safety questions → no matching content",
    detail: "3rd shift employees ask about safety protocols 3.2x more than other shifts, but resolution quality for safety is only 34%. 3rd shift also has the highest absence rate (6.1%).",
    action: "Update safety content with 3rd-shift-specific procedures. Possible connection between content frustration and absenteeism.",
    confidence: "Exploratory — needs more data",
  },
];

const roiMetrics = [
  { metric: "Absenteeism Rate", before: "5.8%", current: "4.9%", change: "-15.5%", direction: "improved" },
  { metric: "NCNS Rate", before: "1.4%", current: "0.8%", change: "-43%", direction: "improved" },
  { metric: "Avg Time to Notification", before: "47 min", current: "8 min", change: "-83%", direction: "improved" },
  { metric: "HR Questions via EA (self-served)", before: "0", current: "4,283/mo", change: "New", direction: "new" },
];

export default function UnifiedDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

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
          <div style={{ fontSize: 24, fontWeight: 700 }}>HelloFresh — Workforce Analytics</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["All Sites", "Aurora, CO", "Newark, NJ", "Irving, TX"].map(site => (
            <button key={site} style={{
              padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.3)",
              backgroundColor: site === "All Sites" ? "rgba(255,255,255,0.2)" : "transparent",
              color: "white", cursor: "pointer", fontSize: 13, fontWeight: 500,
            }}>{site}</button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        backgroundColor: "white", padding: "12px 32px", borderBottom: "1px solid #e5e7eb",
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>Filters:</span>
        {["Last 30 Days", "All Shifts", "All Managers", "All Departments"].map(f => (
          <button key={f} style={{
            padding: "5px 12px", borderRadius: 6, border: "1px solid #d1d5db",
            backgroundColor: "white", fontSize: 13, cursor: "pointer", color: "#374151",
          }}>{f} ▾</button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={{
          padding: "6px 16px", borderRadius: 6, border: "none",
          backgroundColor: "#F6B725", color: "#263D39", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>Export Report</button>
      </div>

      {/* Section Nav */}
      <div style={{ padding: "16px 32px 0", display: "flex", gap: 4, borderBottom: "1px solid #e5e7eb" }}>
        {[
          { id: "overview", label: "Overview" },
          { id: "attendance", label: "Attendance" },
          { id: "content", label: "EA Content" },
          { id: "connections", label: "Connected Insights" },
          { id: "roi", label: "ROI" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveSection(tab.id)}
            style={{
              padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
              backgroundColor: "transparent",
              color: activeSection === tab.id ? "#263D39" : "#6b7280",
              borderBottom: activeSection === tab.id ? "3px solid #F6B725" : "3px solid transparent",
              marginBottom: -1,
            }}>{tab.label}
            {tab.id === "connections" && (
              <span style={{
                marginLeft: 6, backgroundColor: "#F6B725", color: "#263D39",
                borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700,
              }}>NEW</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px 32px" }}>

        {/* OVERVIEW */}
        {activeSection === "overview" && (
          <div>
            {/* Top Metrics Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Absences", value: "264", sub: "Last 30 days", color: "#263D39" },
                { label: "Absence Rate", value: "4.9%", sub: "↓ 0.3% from last month", color: "#16a34a" },
                { label: "EA Questions", value: "4,283", sub: "↑ 12% from last month", color: "#263D39" },
                { label: "Content Gaps", value: "4", sub: "Topics need attention", color: "#BF4B08" },
              ].map((m, i) => (
                <div key={i} style={{
                  backgroundColor: "white", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb",
                }}>
                  <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 12, color: "#6DAEA2", marginTop: 4, fontWeight: 500 }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Combined Trend Chart */}
            <div style={{ backgroundColor: "white", borderRadius: 12, padding: 24, border: "1px solid #e5e7eb", marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#263D39", marginBottom: 4 }}>Attendance & EA Activity — Weekly</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>See how employee questions and absences move together</div>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="calloffs" stroke="#BF4B08" strokeWidth={2} name="Call-offs" dot={{ r: 3 }} />
                    <Line yAxisId="left" type="monotone" dataKey="pto" stroke="#F6B725" strokeWidth={2} name="PTO" dot={{ r: 3 }} />
                    <Line yAxisId="left" type="monotone" dataKey="ncns" stroke="#991b1b" strokeWidth={2} name="NCNS" dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="eaQuestions" stroke="#6DAEA2" strokeWidth={2} strokeDasharray="5 5" name="EA Questions" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Shift Breakdown */}
            <div style={{ backgroundColor: "white", borderRadius: 12, padding: 24, border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#263D39", marginBottom: 16 }}>By Shift</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    {["SHIFT", "ABSENCES", "ABSENCE RATE", "EA QUESTIONS", "TOP EA TOPIC"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shiftBreakdown.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px", fontWeight: 600, color: "#263D39" }}>{row.shift}</td>
                      <td style={{ padding: "12px", color: "#263D39" }}>{row.absences}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          color: parseFloat(row.absenceRate) > 5.5 ? "#BF4B08" : "#263D39",
                          fontWeight: 600,
                        }}>{row.absenceRate}</span>
                      </td>
                      <td style={{ padding: "12px", color: "#263D39" }}>{row.eaUsage.toLocaleString()}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ color: "#6DAEA2", fontWeight: 500 }}>{row.topTopic}</span>
                        <span style={{ color: "#9ca3af", fontSize: 12, marginLeft: 6 }}>({row.topTopicPct})</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ATTENDANCE */}
        {activeSection === "attendance" && (
          <div>
            <div style={{ backgroundColor: "white", borderRadius: 12, padding: 24, border: "1px solid #e5e7eb", marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#263D39", marginBottom: 4 }}>Absence Breakdown — Last 30 Days</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>By type, weekly view</div>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="calloffs" stackId="a" fill="#BF4B08" name="Call-offs" radius={[0,0,0,0]} />
                    <Bar dataKey="pto" stackId="a" fill="#F6B725" name="PTO" />
                    <Bar dataKey="ncns" stackId="a" fill="#991b1b" name="NCNS" />
                    <Bar dataKey="tardy" stackId="a" fill="#6DAEA2" name="Tardy" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: "white", borderRadius: 12, padding: 24, border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#263D39", marginBottom: 16 }}>Day-of-Week Pattern</div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dayOfWeek}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="absences" fill="#263D39" radius={[4,4,0,0]} name="Absences" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{
                marginTop: 12, padding: 12, backgroundColor: "#fefce8", borderRadius: 8,
                fontSize: 13, color: "#92400e",
              }}>
                💡 <strong>Monday absences are 63% higher than mid-week average.</strong> This is consistent with industry patterns but worth monitoring — could indicate scheduling satisfaction issues.
              </div>
            </div>
          </div>
        )}

        {/* EA CONTENT */}
        {activeSection === "content" && (
          <div style={{
            backgroundColor: "white", borderRadius: 12, padding: 32, border: "1px solid #e5e7eb",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#263D39", marginBottom: 8 }}>Content Insights Dashboard</div>
            <div style={{ fontSize: 14, color: "#6b7280", maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
              This tab opens the full Content Insights experience — topic demand, content gaps, and recommendations.
              See <strong>Prototype 1</strong> for the complete content insights view.
            </div>
          </div>
        )}

        {/* CONNECTED INSIGHTS */}
        {activeSection === "connections" && (
          <div>
            <div style={{
              backgroundColor: "#fefce8", border: "1px solid #fde68a", borderRadius: 12,
              padding: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 20 }}>✨</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e" }}>Connected Insights</div>
                <div style={{ fontSize: 13, color: "#92400e" }}>
                  Patterns we found by looking at EA and Attendance data together — things neither dataset shows alone.
                </div>
              </div>
            </div>

            {correlationInsights.map((insight, i) => (
              <div key={i} style={{
                backgroundColor: "white", borderRadius: 12, padding: 24,
                border: "1px solid #e5e7eb", marginBottom: 16,
                borderLeft: `4px solid ${i === 0 ? "#F6B725" : i === 1 ? "#6DAEA2" : "#BF4B08"}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{insight.icon}</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#263D39" }}>{insight.title}</span>
                    </div>
                    <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, marginBottom: 12 }}>
                      {insight.detail}
                    </div>
                    <div style={{
                      backgroundColor: "#F5FAF8", borderRadius: 8, padding: 12,
                      fontSize: 13, lineHeight: 1.5, marginBottom: 8,
                    }}>
                      <span style={{ fontWeight: 700, color: "#6DAEA2" }}>💡 What this means: </span>
                      <span style={{ color: "#263D39" }}>{insight.action}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>
                      {insight.confidence}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ROI */}
        {activeSection === "roi" && (
          <div>
            <div style={{
              backgroundColor: "white", borderRadius: 12, padding: 24, border: "1px solid #e5e7eb", marginBottom: 24,
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#263D39", marginBottom: 4 }}>
                TeamSense ROI — HelloFresh
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
                Before TeamSense (baseline from first 30 days) vs. current performance
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {roiMetrics.map((m, i) => (
                  <div key={i} style={{
                    border: "1px solid #e5e7eb", borderRadius: 12, padding: 20,
                    backgroundColor: m.direction === "new" ? "#F5FAF8" : "white",
                  }}>
                    <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginBottom: 8 }}>{m.metric}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                      {m.direction !== "new" && (
                        <>
                          <span style={{ fontSize: 20, color: "#9ca3af", textDecoration: "line-through" }}>{m.before}</span>
                          <span style={{ color: "#6b7280" }}>→</span>
                        </>
                      )}
                      <span style={{ fontSize: 28, fontWeight: 700, color: m.direction === "new" ? "#6DAEA2" : "#16a34a" }}>
                        {m.current}
                      </span>
                    </div>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: m.direction === "new" ? "#6DAEA2" : "#16a34a",
                    }}>
                      {m.direction === "new" ? "New capability" : `${m.change} improvement`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              backgroundColor: "white", borderRadius: 12, padding: 24, border: "2px solid #F6B725",
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#263D39", marginBottom: 8 }}>
                📋 Ready for Your Next QBR
              </div>
              <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, marginBottom: 16 }}>
                Export a formatted report showing these metrics alongside your attendance trends and content insights. No CSM needed — self-serve anytime.
              </div>
              <button style={{
                padding: "10px 24px", borderRadius: 8, border: "none",
                backgroundColor: "#F6B725", color: "#263D39", fontSize: 14,
                fontWeight: 700, cursor: "pointer",
              }}>
                Export QBR Report
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center", padding: "8px 32px 32px",
        fontSize: 12, color: "#9ca3af", fontStyle: "italic",
      }}>
        TIP v1 — Unified Workforce Analytics Prototype · TeamSense Research Session · Not final design
      </div>
    </div>
  );
}
