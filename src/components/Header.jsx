import React from "react";

function Header({ queries, terms, isOnline }) {
  return (
    <header className="app-header">
      <div className="logo">
        <div className="logo-icon">🛡️</div>
        PolicyPal AI
      </div>
      <div className="header-right">
        <div className="stat-pill">
          Queries: <strong>{queries}</strong>
        </div>
        <div className="stat-pill hide-on-mobile">
          Terms: <strong>{terms}</strong>
        </div>
        <span className={`badge ${isOnline ? "green" : "red"}`}>
          {isOnline ? "● ACTIVE" : "● OFFLINE"}
        </span>
        <span className="badge blue hide-on-mobile">v1.0</span>
      </div>
    </header>
  );
}

export default Header;
