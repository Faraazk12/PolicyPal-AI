import React from "react";
import { DB } from "../data/policyData";

function SourcePanel({ policyKey, sources }) {
  const db = DB[policyKey];

  return (
    <div className="panel right-panel">
      <div className="ph">
        <div className="dot" /> Source Reference
      </div>

      <div className="src-list">
        {sources.length === 0 ? (
          <div className="empty-src">
            <div className="ei">🔎</div>
            <strong className="empty-title">No references yet</strong>
            <span>Ask a question to see the policy source used.</span>
          </div>
        ) : (
          sources.map((s, i) => (
            <div className="src-card" key={i}>
              <div className="src-title">📌 {db.name}</div>
              <div className="src-sec">{s.sec}</div>
              <div className="src-text">"{s.ex}"</div>
              <div className="conf-row">
                <span className="conf-lbl">{s.c}%</span>
                <div className="conf-bar">
                  <div className="conf-fill" style={{ width: `${s.c}%` }} />
                </div>
                <span className="conf-lbl">match</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="ins-block">
        <div className="ins-title">⚡ Policy Insights</div>
        <div>
          {db.insights.map(([cls, txt], i) => (
            <div className={`ins-item ${cls}`} key={i}>
              {txt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SourcePanel;
