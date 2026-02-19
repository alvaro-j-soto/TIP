import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from "recharts";

const topicData = [
  { topic: "PTO / Time Off Policy", questions: 847, trend: "+28%", quality: 62, gap: true, priority: 1 },
  { topic: "Shift Schedule & Hours", questions: 623, trend: "+12%", quality: 78, gap: false, priority: null },
  { topic: "Benefits & Insurance", questions: 541, trend: "+5%", quality: 45, gap: true, priority: 2 },
  { topic: "Pay & Direct Deposit", questions: 498, trend: "-3%", quality: 88, gap: false, priority: null },
  { topic: "Safety Protocols", questions: 412, trend: "+41%", quality: 34, gap: true, priority: 3 },
  { topic: "Meal Kit Assembly Process", questions: 387, trend: "+8%", quality: 71, gap: false, priority: null },
  { topic: "Attendance Points", questions: 356, trend: "+15%", quality: 52, gap: true, priority: 4 },
  { topic: "Holiday Schedule", questions: 298, trend: "-12%", quality: 91, gap: false, priority: null },
  { topic: "Parking & Transportation", questions: 187, trend: "+2%", quality: 83, gap: false, priority: null },
  { topic: "Uniform & Dress Code", questions: 134, trend: "-5%", quality: 89, gap: false, priority: null },
];

const trendData = [
  { month: "Sep", total: 2890, resolved: 2340 },
  { month: "Oct", total: 3120, resolved: 2510 },
  { month: "Nov", total: 3450, resolved: 2680 },
  { month: "Dec", total: 2980, resolved: 2390 },
  { month: "Jan", total: 3680, resolved: 2870 },
  { month: "Feb", total: 4283, resolved: 3210 },
];

const barChartData = topicData.map(d => ({
  name: d.topic.length > 20 ? d.topic.substring(0, 18) + "..." : d.topic,
  fullName: d.topic,
  questions: d.questions,
  quality: d.quality,
  gap: d.gap,
}));

const QualityBadge = ({ score }) => {
  const color = score >= 80 ? "#16a34a" : score >= 60 ? "#F6B725" : "#BF4B08";
  const bg = score >= 80 ? "#f0fdf4" : score >= 60 ? "#fefce8" : "#fff7ed";
  const label = score >= 80 ? "Strong" : score >= 60 ? "Fair" : "Needs Work";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "2px 10px", borderRadius: 12,
      backgroundColor: bg, color: color, fontSize: 13, fontWeight: 600,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%", backgroundColor: color,
      }} />
      {score}% — {label}
    </span>
  );
};

const TrendBadge = ({ trend }) => {
  const isUp = trend.startsWith("+");
  const val = parseInt(trend);
  const color = Math.abs(val) > 20 ? "#BF4B08" : isUp ? "#263D39" : "#16a34a";
  return (
    <span style={{ color, fontSize: 13, fontWeight: 600 }}>
      {isUp ? "↑" : "↓"} {trend}
    </span>
  );
};

export default function ContentInsightsDashboard() {
  const [activeView, setActiveView] = useState("topics");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const gaps = topicData.filter(d => d.gap).sort((a, b) => a.priority - b.priority);

  return (
    <div style={{
      fontFamily: "'Urbanist', 'Inter', system-ui, sans-serif",
      backgroundColor: "#F5FAF8", minHeight: "100vh", padding: 0,
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#263D39", color: "white", padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4, letterSpacing: 0.5 }}>
            TEAMSENSE INSIGHTS
          </div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Content Insights</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["All Sites", "Aurora, CO", "Newark, NJ", "Irving, TX"].map(site => (
            <button key={site} onClick={() => setSelectedFilter(site === "All Sites" ? "all" : site)}
              style={{
                padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.3)",
                backgroundColor: (selectedFilter === "all" && site === "All Sites") || selectedFilter === site
                  ? "rgba(255,255,255,0.2)" : "transparent",
                color: "white", cursor: "pointer", fontSize: 13, fontWeight: 500,
              }}>
              {site}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        backgroundColor: "white", padding: "12px 32px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>Filters:</span>
        {["Last 30 Days", "All Shifts", "All Departments", "All Languages"].map(f => (
          <button key={f} style={{
            padding: "5px 12px", borderRadius: 6, border: "1px solid #d1d5db",
            backgroundColor: "white", fontSize: 13, cursor: "pointer", color: "#374151",
          }}>
            {f} ▾
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={{
          padding: "6px 16px", borderRadius: 6, border: "none",
          backgroundColor: "#F6B725", color: "#263D39", fontSize: 13,
          fontWeight: 600, cursor: "pointer",
        }}>
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ padding: "24px 32px 0", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Total Questions", value: "4,283", sub: "Last 30 days", accent: false },
          { label: "Avg Resolution Quality", value: "69%", sub: "↑ 3% from last month", accent: false },
          { label: "Content Gaps Found", value: "4", sub: "Topics needing attention", accent: true },
          { label: "Top Trending Topic", value: "Safety Protocols", sub: "↑ 41% this month", accent: true },
        ].map((card, i) => (
          <div key={i} style={{
            backgroundColor: "white", borderRadius: 12, padding: 20,
            border: card.accent ? "2px solid #F6B725" : "1px solid #e5e7eb",
          }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4, fontWeight: 500 }}>{card.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#263D39" }}>{card.value}</div>
            <div style={{ fontSize: 12, color: "#6DAEA2", marginTop: 4, fontWeight: 500 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div style={{ padding: "24px 32px 0", display: "flex", gap: 4 }}>
        {[
          { id: "topics", label: "Topic Demand" },
          { id: "gaps", label: "Content Gaps" },
          { id: "recommendations", label: "What to Fix Next" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveView(tab.id)}
            style={{
              padding: "10px 20px", borderRadius: "8px 8px 0 0",
              border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
              backgroundColor: activeView === tab.id ? "white" : "transparent",
              color: activeView === tab.id ? "#263D39" : "#6b7280",
              borderBottom: activeView === tab.id ? "2px solid #F6B725" : "2px solid transparent",
            }}>
            {tab.label}
            {tab.id === "gaps" && (
              <span style={{
                marginLeft: 8, backgroundColor: "#BF4B08", color: "white",
                borderRadius: 10, padding: "1px 8px", fontSize: 11, fontWeight: 700,
              }}>4</span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ padding: "0 32px 32px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "0 12px 12px 12px", padding: 24, minHeight: 400 }}>

          {activeView === "topics" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#263D39" }}>What Employees Are Asking About</div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Ranked by question volume — last 30 days</div>
                </div>
              </div>

              <div style={{ height: 280, marginBottom: 24 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} layout="vertical" margin={{ left: 140, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={140} />
                    <Tooltip
                      formatter={(val) => [val, "Questions"]}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                    />
                    <Bar dataKey="questions" radius={[0, 4, 4, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.gap ? "#BF4B08" : "#6DAEA2"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: "flex", gap: 16, marginBottom: 20, fontSize: 13 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: "#BF4B08" }} /> Content gap (needs attention)
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: "#6DAEA2" }} /> Healthy resolution
                </span>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12 }}>TOPIC</th>
                    <th style={{ textAlign: "right", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12 }}>QUESTIONS</th>
                    <th style={{ textAlign: "center", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12 }}>TREND</th>
                    <th style={{ textAlign: "center", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12 }}>RESOLUTION QUALITY</th>
                  </tr>
                </thead>
                <tbody>
                  {topicData.map((row, i) => (
                    <tr key={i} style={{
                      borderBottom: "1px solid #f3f4f6",
                      backgroundColor: row.gap ? "#fff7ed" : "transparent",
                    }}>
                      <td style={{ padding: "12px 12px", fontWeight: 500, color: "#263D39" }}>
                        {row.gap && <span style={{ color: "#BF4B08", marginRight: 6 }}>⚠</span>}
                        {row.topic}
                      </td>
                      <td style={{ textAlign: "right", padding: "12px 12px", fontWeight: 600, color: "#263D39" }}>
                        {row.questions.toLocaleString()}
                      </td>
                      <td style={{ textAlign: "center", padding: "12px 12px" }}>
                        <TrendBadge trend={row.trend} />
                      </td>
                      <td style={{ textAlign: "center", padding: "12px 12px" }}>
                        <QualityBadge score={row.quality} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeView === "gaps" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#263D39" }}>Content Gaps</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                  Topics where employees ask frequently but the EA can't answer well
                </div>
              </div>

              {gaps.map((gap, i) => (
                <div key={i} style={{
                  border: "1px solid #fed7aa", borderRadius: 12, padding: 20, marginBottom: 16,
                  backgroundColor: i === 0 ? "#fff7ed" : "white",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{
                          backgroundColor: "#BF4B08", color: "white", borderRadius: 12,
                          padding: "2px 10px", fontSize: 11, fontWeight: 700,
                        }}>
                          Priority #{gap.priority}
                        </span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "#263D39" }}>{gap.topic}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
                        {gap.questions.toLocaleString()} questions this month ({gap.trend} vs. last month) · Resolution quality: {gap.quality}%
                      </div>
                      <div style={{
                        fontSize: 13, color: "#263D39", backgroundColor: "#F5FAF8",
                        padding: 12, borderRadius: 8, lineHeight: 1.5,
                      }}>
                        {gap.topic === "PTO / Time Off Policy" && "Employees frequently ask about PTO accrual rates, rollover policies, and blackout dates. Many questions go unresolved or get routed to HR. Content exists but doesn't cover site-specific rules."}
                        {gap.topic === "Benefits & Insurance" && "Open enrollment questions spike seasonally. Current EA content covers basic plan info but can't answer questions about eligibility changes, life events, or HSA details."}
                        {gap.topic === "Safety Protocols" && "Sharp increase tied to new OSHA requirements. EA has outdated safety content that doesn't reflect January 2026 policy updates. High volume of repeat questions about PPE requirements."}
                        {gap.topic === "Attendance Points" && "Employees ask about their current balance, how points are calculated, and when points expire. EA cannot pull live points data — routes all questions to HR."}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    marginTop: 12, display: "flex", gap: 8,
                  }}>
                    <div style={{
                      flex: 1, backgroundColor: "#fef3c7", borderRadius: 8, padding: 10,
                      fontSize: 12, color: "#92400e", fontWeight: 500,
                    }}>
                      <strong>Employee Impact:</strong> ~{Math.round(gap.questions * (1 - gap.quality / 100))} employees/month not getting answers they need
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeView === "recommendations" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#263D39" }}>What to Fix Next</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                  Prioritized by employee impact (question volume × low resolution quality)
                </div>
              </div>

              {gaps.map((gap, i) => (
                <div key={i} style={{
                  border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 16,
                  borderLeft: `4px solid ${i === 0 ? "#BF4B08" : i === 1 ? "#F6B725" : "#6DAEA2"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: "50%",
                        backgroundColor: i === 0 ? "#BF4B08" : i === 1 ? "#F6B725" : "#6DAEA2",
                        color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700,
                      }}>{i + 1}</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#263D39" }}>{gap.topic}</span>
                    </div>
                    <QualityBadge score={gap.quality} />
                  </div>

                  <div style={{
                    backgroundColor: "#F5FAF8", borderRadius: 8, padding: 16,
                    fontSize: 13, lineHeight: 1.6, color: "#263D39",
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: "#6DAEA2" }}>💡 Recommended Action</div>
                    {gap.topic === "PTO / Time Off Policy" && (
                      <div>
                        <p style={{ margin: "0 0 8px" }}>Update EA knowledge base with site-specific PTO rules for Aurora, Newark, and Irving. Current content is generic — employees at each site have different accrual rates and blackout periods.</p>
                        <p style={{ margin: 0, fontWeight: 600 }}>Expected impact: Could resolve ~320 questions/month that currently go to HR.</p>
                      </div>
                    )}
                    {gap.topic === "Benefits & Insurance" && (
                      <div>
                        <p style={{ margin: "0 0 8px" }}>Add life event and eligibility change content. Most unresolved questions are about mid-year changes (marriage, new child, address change) — not basic plan info.</p>
                        <p style={{ margin: 0, fontWeight: 600 }}>Expected impact: Could resolve ~298 questions/month during non-enrollment periods.</p>
                      </div>
                    )}
                    {gap.topic === "Safety Protocols" && (
                      <div>
                        <p style={{ margin: "0 0 8px" }}>Replace outdated safety content with January 2026 OSHA updates. Specific gap: PPE requirements for cold storage areas and new chemical handling procedures.</p>
                        <p style={{ margin: 0, fontWeight: 600 }}>Expected impact: Could resolve ~272 questions/month. Also a compliance risk — employees may be following outdated procedures.</p>
                      </div>
                    )}
                    {gap.topic === "Attendance Points" && (
                      <div>
                        <p style={{ margin: "0 0 8px" }}>Add FAQ content explaining points calculation, expiration timelines, and threshold consequences. Note: Live balance lookup requires integration work (future roadmap).</p>
                        <p style={{ margin: 0, fontWeight: 600 }}>Expected impact: Could resolve ~171 questions/month. Remaining gap (live balance) requires product work.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Question Volume Trend */}
      <div style={{ padding: "0 32px 32px" }}>
        <div style={{ backgroundColor: "white", borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#263D39", marginBottom: 4 }}>Question Volume Trend</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Total questions vs. resolved — last 6 months</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#263D39" strokeWidth={2} name="Total Questions" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="resolved" stroke="#6DAEA2" strokeWidth={2} name="Resolved" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Prototype Label */}
      <div style={{
        textAlign: "center", padding: "16px 32px 32px",
        fontSize: 12, color: "#9ca3af", fontStyle: "italic",
      }}>
        TIP v1 — Content Insights Dashboard Prototype · TeamSense Research Session · Not final design
      </div>
    </div>
  );
}
