import { useState } from "react";

const categories = [
  {
    id: "prayer",
    icon: "🙏",
    title: "Prayer & Spiritual Disciplines",
    description: "Daily time with God, Scripture study, worship, and fasting",
    questions: [
      "I consistently spend time in prayer and Bible reading each day.",
      "I rely on God's guidance before making decisions.",
      "My spiritual disciplines are deepening my relationship with Christ.",
    ],
    resources: ["Pray Without Ceasing by Paul Miller", "Celebration of Discipline by Richard Foster", "Daily devotional journal", "Accountability partner for quiet time"],
    tip: "Consider a Bible reading plan, a prayer journal, or committing to a consistent morning routine with God.",
  },
  {
    id: "servant",
    icon: "🤝",
    title: "Servant Leadership",
    description: "Humility, putting others first, leading like Jesus",
    questions: [
      "I actively look for ways to serve others without recognition.",
      "I lead with humility and make others feel valued.",
      "I model Christ-like selflessness in my leadership roles.",
    ],
    resources: ["Servant Leadership by Robert Greenleaf", "Lead Like Jesus by Ken Blanchard", "Volunteering in a ministry or service team", "Finding a mentorship or discipleship role"],
    tip: "Look for practical ways to serve — lead a small group, volunteer for a ministry, or mentor a younger student.",
  },
  {
    id: "integrity",
    icon: "⚖️",
    title: "Integrity & Character",
    description: "Living out Christian values consistently in all areas of life",
    questions: [
      "My private life reflects the same values as my public life.",
      "I take responsibility for my mistakes and pursue reconciliation.",
      "People who know me closely would say I am trustworthy and consistent.",
    ],
    resources: ["Integrity by Henry Cloud", "The Ruthless Elimination of Hurry by John Mark Comer", "Finding a confession/accountability partner", "Character journaling"],
    tip: "Identify one area where your private and public life are misaligned, and bring it to God and a trusted mentor.",
  },
  {
    id: "discipleship",
    icon: "📖",
    title: "Discipling Others",
    description: "Investing in others' spiritual growth, making disciples",
    questions: [
      "I am intentionally investing in the spiritual growth of someone else.",
      "I know how to share my faith clearly and confidently.",
      "I help others grow by pointing them toward Scripture and prayer.",
    ],
    resources: ["The Master Plan of Evangelism by Robert Coleman", "2 Timothy 2:2 discipleship model", "Leading a small group or Bible study", "1-on-1 discipleship meetings"],
    tip: "Find one person you can meet with regularly to read Scripture, pray, and do life together.",
  },
  {
    id: "communication",
    icon: "🎤",
    title: "Communication & Influence",
    description: "Sharing faith boldly, speaking truth, influencing others for Christ",
    questions: [
      "I communicate clearly and confidently when speaking about my faith.",
      "I know how to speak truth with grace, especially in difficult conversations.",
      "Others are drawn toward Christ through the way I communicate and carry myself.",
    ],
    resources: ["Speak by Nils Smith", "The Art of Communication by Thich Nhat Hanh", "Joining a speech or debate club", "Practicing sharing your testimony"],
    tip: "Practice writing out your testimony and sharing it with one new person this quarter.",
  },
  {
    id: "vision",
    icon: "🔭",
    title: "Vision & Initiative",
    description: "Taking ownership, casting vision, and leading with purpose",
    questions: [
      "I have a clear sense of what God is calling me to build or pursue.",
      "I take initiative without waiting to be told what to do.",
      "I help others see and believe in a God-honoring vision.",
    ],
    resources: ["The Dream Giver by Bruce Wilkinson", "Visioneering by Andy Stanley", "Prayer journaling about your calling", "Starting a faith-based project or initiative"],
    tip: "Write a one-page personal mission statement rooted in Scripture and prayer.",
  },
  {
    id: "community",
    icon: "🏘️",
    title: "Community & Relationships",
    description: "Building deep, Christ-centered relationships and belonging",
    questions: [
      "I am deeply invested in a Christian community (church, small group, etc.).",
      "I resolve conflict in relationships biblically and quickly.",
      "People around me feel genuinely cared for and known by me.",
    ],
    resources: ["Life Together by Dietrich Bonhoeffer", "The Emotionally Healthy Leader by Pete Scazzero", "Joining or leading a small group", "Weekly check-ins with close Christian friends"],
    tip: "Commit to a weekly gathering with other believers where you are fully known and held accountable.",
  },
  {
    id: "emotional",
    icon: "💡",
    title: "Emotional Intelligence",
    description: "Self-awareness, empathy, and emotional maturity as a leader",
    questions: [
      "I understand my emotional triggers and respond rather than react.",
      "I am empathetic and can see situations through others' perspectives.",
      "My emotions support my leadership rather than undermine it.",
    ],
    resources: ["Emotional Intelligence 2.0 by Bradberry & Greaves", "The Emotionally Healthy Leader by Peter Scazzero", "Therapy or Christian counseling", "Regular check-ins with a trusted mentor"],
    tip: "Take the EQ-i assessment and discuss results with a mentor or counselor.",
  },
];

const TRAC_QUESTIONS = {
  T: { label: "TARGET", prompt: "What is my Christian leadership growth goal for Q2?", placeholder: "e.g. I want to grow in discipling others by investing consistently in one person's spiritual journey..." },
  R: { label: "ROADMAP", prompt: "What training, resources, relationships & experiences will I use?", placeholder: "e.g. Reading The Master Plan of Evangelism, meeting weekly with a younger student, attending a discipleship training..." },
  A: { label: "ACCOUNTABILITY", prompt: "Who will hold me accountable for this growth?", placeholder: "e.g. My dad, my youth pastor, a close friend from church..." },
  C: { label: "CHECK-UP", prompt: "When and how will I evaluate my growth progress?", placeholder: "e.g. Monthly reflection journal, end-of-quarter conversation with my mentor, tracking actions weekly..." },
};

export default function App() {
  const [step, setStep] = useState("intro"); // intro | assess | results | trac
  const [ratings, setRatings] = useState({});
  const [currentCat, setCurrentCat] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [trac, setTrac] = useState({ T: "", R: "", A: "", C: "" });
  const [tracDone, setTracDone] = useState(false);

  const setRating = (catId, qIdx, val) => {
    setRatings((prev) => ({
      ...prev,
      [catId]: { ...(prev[catId] || {}), [qIdx]: val },
    }));
  };

  const catAvg = (catId) => {
    const r = ratings[catId] || {};
    const vals = Object.values(r);
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const allAnswered = (catId) => {
    const r = ratings[catId] || {};
    return categories.find((c) => c.id === catId).questions.every((_, i) => r[i] !== undefined);
  };

  const currentCategory = categories[currentCat];
  const canProceed = allAnswered(currentCategory.id);

  const sorted = [...categories].sort((a, b) => (catAvg(a.id) ?? 5) - (catAvg(b.id) ?? 5));
  const topOpportunities = sorted.slice(0, 3);

  const chosenCat = categories.find((c) => c.id === chosen);

  const tracComplete = Object.values(trac).every((v) => v.trim().length > 0);

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: "100vh", background: "#0f1a2e", color: "#e8dcc8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f1a2e; }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sans { font-family: 'Lato', sans-serif; }
        .gold { color: #c9a84c; }
        .cream { color: #e8dcc8; }
        .muted { color: #8a7f6e; }
        .btn-primary {
          background: linear-gradient(135deg, #c9a84c, #a8872e);
          color: #0f1a2e;
          border: none;
          padding: 14px 32px;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .btn-ghost {
          background: transparent;
          color: #c9a84c;
          border: 1px solid #c9a84c;
          padding: 10px 24px;
          font-family: 'Lato', sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-ghost:hover { background: rgba(201,168,76,0.1); }
        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 2px;
          padding: 28px;
        }
        .pip { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        textarea {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(201,168,76,0.25);
          color: #e8dcc8;
          padding: 14px;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          resize: vertical;
          outline: none;
          border-radius: 2px;
          min-height: 90px;
        }
        textarea:focus { border-color: #c9a84c; }
        textarea::placeholder { color: #4a4535; }
        input[type=range] {
          -webkit-appearance: none;
          width: 100%;
          height: 3px;
          background: rgba(201,168,76,0.2);
          outline: none;
          cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #c9a84c;
          cursor: pointer;
        }
        .divider { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); margin: 16px auto; }
      `}</style>

      {/* ─── INTRO ─────────────────────────────────────────────────────── */}
      {step === "intro" && (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 13, letterSpacing: 4, fontFamily: "Lato", color: "#c9a84c", marginBottom: 24, textTransform: "uppercase" }}>Q2 Growth TRAC</div>
          <h1 className="serif" style={{ fontSize: "clamp(38px, 6vw, 60px)", fontWeight: 600, lineHeight: 1.1, marginBottom: 16 }}>
            Christian Leadership<br /><em style={{ color: "#c9a84c" }}>Self-Assessment</em>
          </h1>
          <div className="divider" />
          <p className="sans" style={{ fontSize: 16, lineHeight: 1.8, color: "#b0a48e", maxWidth: 520, margin: "20px auto 12px" }}>
            "For we are His workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them."
          </p>
          <p className="sans muted" style={{ fontSize: 13, marginBottom: 48, letterSpacing: 1 }}>— Ephesians 2:10</p>

          <div className="card" style={{ textAlign: "left", marginBottom: 40 }}>
            <h3 className="serif gold" style={{ fontSize: 22, marginBottom: 12 }}>How This Works</h3>
            <div className="sans" style={{ fontSize: 14, lineHeight: 1.9, color: "#b0a48e" }}>
              <p style={{ marginBottom: 8 }}>① <strong style={{ color: "#e8dcc8" }}>Rate yourself</strong> honestly across 8 areas of Christian leadership</p>
              <p style={{ marginBottom: 8 }}>② <strong style={{ color: "#e8dcc8" }}>See your results</strong> and identify where God may be calling you to grow</p>
              <p>③ <strong style={{ color: "#e8dcc8" }}>Fill out your Q2 Growth TRAC</strong> with a clear target, roadmap, accountability, and check-up</p>
            </div>
          </div>

          <button className="btn-primary" onClick={() => setStep("assess")}>Begin Assessment →</button>
        </div>
      )}

      {/* ─── ASSESSMENT ────────────────────────────────────────────────── */}
      {step === "assess" && (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px" }}>
          {/* Progress bar */}
          <div className="sans" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, letterSpacing: 2, color: "#c9a84c", textTransform: "uppercase" }}>Area {currentCat + 1} of {categories.length}</span>
            <span style={{ fontSize: 12, color: "#5a5040" }}>{Math.round(((currentCat) / categories.length) * 100)}% complete</span>
          </div>
          <div style={{ height: 2, background: "rgba(255,255,255,0.06)", marginBottom: 40, borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${((currentCat) / categories.length) * 100}%`, background: "linear-gradient(90deg, #c9a84c, #a8872e)", transition: "width 0.4s" }} />
          </div>

          <div style={{ marginBottom: 8, fontSize: 32 }}>{currentCategory.icon}</div>
          <h2 className="serif" style={{ fontSize: 32, marginBottom: 8 }}>{currentCategory.title}</h2>
          <p className="sans" style={{ color: "#8a7f6e", fontSize: 14, marginBottom: 36, lineHeight: 1.6 }}>{currentCategory.description}</p>

          {currentCategory.questions.map((q, i) => {
            const val = (ratings[currentCategory.id] || {})[i];
            return (
              <div key={i} className="card" style={{ marginBottom: 20 }}>
                <p className="sans" style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20, color: "#d4c9b0" }}>{q}</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRating(currentCategory.id, i, n)}
                      style={{
                        width: 44, height: 44, borderRadius: "50%",
                        border: val === n ? "2px solid #c9a84c" : "1px solid rgba(201,168,76,0.3)",
                        background: val === n ? "rgba(201,168,76,0.2)" : "transparent",
                        color: val === n ? "#c9a84c" : "#6a6050",
                        fontFamily: "Lato", fontWeight: 700, fontSize: 15,
                        cursor: "pointer", transition: "all 0.15s"
                      }}
                    >{n}</button>
                  ))}
                </div>
                <div className="sans" style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5a5040", letterSpacing: 0.5 }}>
                  <span>Not yet</span>
                  <span>Strongly agree</span>
                </div>
              </div>
            );
          })}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
            <button className="btn-ghost" onClick={() => setCurrentCat(Math.max(0, currentCat - 1))} style={{ visibility: currentCat === 0 ? "hidden" : "visible" }}>← Back</button>
            <button
              className="btn-primary"
              disabled={!canProceed}
              onClick={() => {
                if (currentCat < categories.length - 1) setCurrentCat(currentCat + 1);
                else setStep("results");
              }}
            >{currentCat < categories.length - 1 ? "Next Area →" : "See My Results →"}</button>
          </div>
        </div>
      )}

      {/* ─── RESULTS ───────────────────────────────────────────────────── */}
      {step === "results" && (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="sans" style={{ fontSize: 12, letterSpacing: 4, color: "#c9a84c", textTransform: "uppercase", marginBottom: 16 }}>Your Results</div>
            <h2 className="serif" style={{ fontSize: 40, marginBottom: 12 }}>Where God May Be<br /><em className="gold">Calling You to Grow</em></h2>
            <div className="divider" />
            <p className="sans" style={{ color: "#8a7f6e", fontSize: 14, marginTop: 16 }}>Lower scores reveal your greatest growth opportunities. Be encouraged — this is where transformation happens.</p>
          </div>

          {/* Score bars */}
          <div style={{ marginBottom: 48 }}>
            {[...categories].sort((a, b) => (catAvg(a.id) ?? 0) - (catAvg(b.id) ?? 0)).map((cat) => {
              const avg = catAvg(cat.id) ?? 0;
              const pct = (avg / 5) * 100;
              const isLow = avg < 3;
              return (
                <div key={cat.id} style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{cat.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span className="sans" style={{ fontSize: 13, color: isLow ? "#c9a84c" : "#8a7f6e" }}>{cat.title}</span>
                      <span className="sans" style={{ fontSize: 13, color: isLow ? "#c9a84c" : "#5a5040" }}>{avg.toFixed(1)}</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: isLow ? "linear-gradient(90deg,#c9a84c,#a8872e)" : "rgba(201,168,76,0.25)", borderRadius: 2, transition: "width 0.5s" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top 3 opportunities */}
          <h3 className="serif" style={{ fontSize: 26, marginBottom: 24, textAlign: "center" }}>Your Top Growth <span className="gold">Opportunities</span></h3>
          <p className="sans" style={{ fontSize: 14, color: "#8a7f6e", textAlign: "center", marginBottom: 32 }}>Select one to focus on for your Q2 Growth TRAC:</p>

          {topOpportunities.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setChosen(cat.id)}
              className="card"
              style={{
                marginBottom: 16, cursor: "pointer",
                border: chosen === cat.id ? "1px solid #c9a84c" : "1px solid rgba(201,168,76,0.15)",
                background: chosen === cat.id ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{cat.icon}</span>
                    <span className="serif" style={{ fontSize: 20, color: chosen === cat.id ? "#c9a84c" : "#e8dcc8" }}>{cat.title}</span>
                  </div>
                  <p className="sans" style={{ fontSize: 13, color: "#8a7f6e", lineHeight: 1.6 }}>{cat.tip}</p>
                </div>
                <div style={{ width: 24, height: 24, borderRadius: "50%", border: chosen === cat.id ? "none" : "1px solid #3a3525", background: chosen === cat.id ? "#c9a84c" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 16 }}>
                  {chosen === cat.id && <span style={{ color: "#0f1a2e", fontSize: 14, fontWeight: 900 }}>✓</span>}
                </div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <button className="btn-primary" disabled={!chosen} onClick={() => setStep("trac")}>Build My Growth TRAC →</button>
          </div>
        </div>
      )}

      {/* ─── GROWTH TRAC ───────────────────────────────────────────────── */}
      {step === "trac" && !tracDone && (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="sans" style={{ fontSize: 12, letterSpacing: 4, color: "#c9a84c", textTransform: "uppercase", marginBottom: 16 }}>Q2 Growth TRAC</div>
            <h2 className="serif" style={{ fontSize: 40, marginBottom: 12 }}>Build Your <em className="gold">Growth Plan</em></h2>
            <div className="divider" />
          </div>

          {/* Focus area reminder */}
          {chosenCat && (
            <div className="card" style={{ marginBottom: 40, borderColor: "rgba(201,168,76,0.4)", background: "rgba(201,168,76,0.07)", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{chosenCat.icon}</div>
              <p className="sans" style={{ fontSize: 12, letterSpacing: 3, color: "#c9a84c", textTransform: "uppercase", marginBottom: 4 }}>Focus Area</p>
              <h3 className="serif" style={{ fontSize: 26 }}>{chosenCat.title}</h3>
              <p className="sans" style={{ fontSize: 13, color: "#8a7f6e", marginTop: 8 }}>{chosenCat.tip}</p>
              <details style={{ marginTop: 16 }}>
                <summary className="sans" style={{ fontSize: 12, color: "#c9a84c", cursor: "pointer", letterSpacing: 1 }}>Suggested Resources ▾</summary>
                <ul style={{ marginTop: 12, listStyle: "none", textAlign: "left" }}>
                  {chosenCat.resources.map((r, i) => (
                    <li key={i} className="sans" style={{ fontSize: 13, color: "#8a7f6e", marginBottom: 6, paddingLeft: 16, position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "#c9a84c" }}>·</span>{r}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )}

          {Object.entries(TRAC_QUESTIONS).map(([key, q]) => (
            <div key={key} style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#c9a84c,#a8872e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="sans" style={{ fontWeight: 900, color: "#0f1a2e", fontSize: 18 }}>{key}</span>
                </div>
                <div>
                  <div className="sans" style={{ fontSize: 11, letterSpacing: 3, color: "#c9a84c", textTransform: "uppercase" }}>{q.label}</div>
                  <div className="sans" style={{ fontSize: 14, color: "#d4c9b0" }}>{q.prompt}</div>
                </div>
              </div>
              <textarea
                value={trac[key]}
                onChange={(e) => setTrac((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={q.placeholder}
              />
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button className="btn-primary" disabled={!tracComplete} onClick={() => setTracDone(true)}>Complete My Growth TRAC ✓</button>
          </div>
        </div>
      )}

      {/* ─── TRAC COMPLETE ─────────────────────────────────────────────── */}
      {step === "trac" && tracDone && (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
            <div className="sans" style={{ fontSize: 12, letterSpacing: 4, color: "#c9a84c", textTransform: "uppercase", marginBottom: 16 }}>Q2 Growth TRAC Complete</div>
            <h2 className="serif" style={{ fontSize: 40, marginBottom: 12 }}>Well Done — <em className="gold">Now Walk It Out</em></h2>
            <div className="divider" />
            <p className="sans" style={{ color: "#8a7f6e", fontSize: 14, marginTop: 20, lineHeight: 1.8 }}>
              "The plans of the diligent lead surely to abundance." — Proverbs 21:5
            </p>
          </div>

          <div className="card" style={{ marginBottom: 20, borderColor: "rgba(201,168,76,0.3)" }}>
            <p className="sans" style={{ fontSize: 11, letterSpacing: 3, color: "#c9a84c", textTransform: "uppercase", marginBottom: 6 }}>Focus Area</p>
            {chosenCat && <p className="serif" style={{ fontSize: 22 }}>{chosenCat.icon} {chosenCat.title}</p>}
          </div>

          {Object.entries(TRAC_QUESTIONS).map(([key, q]) => (
            <div key={key} className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="sans" style={{ fontWeight: 900, color: "#c9a84c", fontSize: 15 }}>{key}</span>
                </div>
                <span className="sans" style={{ fontSize: 12, letterSpacing: 2, color: "#c9a84c", textTransform: "uppercase" }}>{q.label}</span>
              </div>
              <p className="sans" style={{ fontSize: 14, lineHeight: 1.8, color: "#d4c9b0" }}>{trac[key]}</p>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: 40, padding: "32px 20px", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 2 }}>
            <p className="serif" style={{ fontSize: 22, color: "#c9a84c", marginBottom: 8 }}>Share This With Your Accountability Partner</p>
            <p className="sans" style={{ fontSize: 14, color: "#8a7f6e", lineHeight: 1.8 }}>Screenshot this page or write your answers into your Growth TRAC spreadsheet. Then share it with whoever you listed under Accountability.</p>
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button className="btn-ghost" onClick={() => { setStep("intro"); setRatings({}); setCurrentCat(0); setChosen(null); setTrac({ T:"",R:"",A:"",C:"" }); setTracDone(false); }}>Start Over</button>
          </div>
        </div>
      )}
    </div>
  );
}
