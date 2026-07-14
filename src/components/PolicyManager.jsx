import React, { useState } from "react";
import { POLICY_TYPES, DB } from "../data/policyData";
import { highlightPolicyText } from "../utils/chatEngine";

function PolicyManager({ policyKey, onPolicyChange, onAsk, stats }) {
  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  const db = DB[policyKey];

  function handlePolicyChange(e) {
    const next = e.target.value;
    if (!POLICY_TYPES.some((p) => p.value === next)) {
      setPreviewError("That policy type isn't recognized.");
      return;
    }
    setPreview(null);
    setPreviewError(null);
    onPolicyChange(next);
  }

  function handleLoadSample() {
    setLoadingPreview(true);
    setPreviewError(null);
    // Simulate a brief load so the loading state is visible/testable, and so
    // this is easy to swap for a real fetch() later without changing the UI.
    setTimeout(() => {
      try {
        const html = highlightPolicyText(db.sample);
        setPreview(html);
      } catch (err) {
        console.error(err);
        setPreviewError("Couldn't load the sample policy text. Please try again.");
      } finally {
        setLoadingPreview(false);
      }
    }, 350);
  }

  return (
    <div className="panel left-panel">
      <div className="ph">
        <div className="dot" /> Policy Manager
      </div>

      <div className="policy-block">
        <label className="lbl" htmlFor="policyType">
          Policy Type
        </label>
        <select id="policyType" value={policyKey} onChange={handlePolicyChange}>
          {POLICY_TYPES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <button className="load-btn" onClick={handleLoadSample} disabled={loadingPreview}>
          {loadingPreview ? "Loading…" : "📋 Load Sample Policy Text"}
        </button>
      </div>

      <div className="policy-preview">
        <label className="lbl">Policy Preview</label>
        <div className="preview-box">
          {previewError ? (
            <span className="preview-error">⚠️ {previewError}</span>
          ) : loadingPreview ? (
            <span className="preview-muted">Loading sample policy…</span>
          ) : preview ? (
            <span dangerouslySetInnerHTML={{ __html: preview }} />
          ) : (
            <span className="preview-muted">Select a policy and click Load Sample Policy Text.</span>
          )}
        </div>
      </div>

      <div className="quick-block">
        <label className="lbl">Quick Questions</label>
        <div>
          {db.questions.map((q) => (
            <button key={q} className="qbtn" onClick={() => onAsk(q)}>
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="dash-block">
        <label className="lbl">Dashboard</label>
        <div className="stat-row">
          <div className="stat-box">
            <div className="sv">{stats.answered}</div>
            <div className="sl">Answered</div>
          </div>
          <div className="stat-box">
            <div className="sv">{stats.terms}</div>
            <div className="sl">Terms ID'd</div>
          </div>
          <div className="stat-box">
            <div className="sv">{db.coverage}</div>
            <div className="sl">Coverage</div>
          </div>
          <div className="stat-box">
            <div className="sv">4</div>
            <div className="sl">Sections</div>
          </div>
        </div>
        <div className="status-row">
          <div className="pulse" /> Policy Active &amp; Valid
        </div>
      </div>
    </div>
  );
}

export default PolicyManager;
