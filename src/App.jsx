import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import PolicyManager from "./components/PolicyManager";
import ChatAssistant from "./components/ChatAssistant";
import SourcePanel from "./components/SourcePanel";
import ErrorBoundary from "./components/ErrorBoundary";
import { usePersistentState } from "./hooks/usePersistentState";
import { DB } from "./data/policyData";
import "./styles/App.css";

const WELCOME_MESSAGE = {
  role: "bot",
  text:
    "Hi! I'm <strong>PolicyPal AI</strong> 👋 — your insurance policy interpreter.<br><br>" +
    "Ask me about <span class='term'>coverage</span>, <span class='term'>exclusions</span>, " +
    "<span class='term'>claims</span>, <span class='term'>premium</span>, or <span class='term'>deductibles</span>.<br><br>" +
    "Select a policy type on the left and start asking!",
};

function App() {
  // Persisted across refresh: active policy type, full chat log, and stats.
  const [policyKey, setPolicyKey, policyStorageError] = usePersistentState(
    "policypal:policyKey",
    "health"
  );
  const [messagesByPolicy, setMessagesByPolicy, msgStorageError] = usePersistentState(
    "policypal:messages",
    { health: [WELCOME_MESSAGE], motor: [WELCOME_MESSAGE], home: [WELCOME_MESSAGE], life: [WELCOME_MESSAGE] }
  );
  const [stats, setStats, statsStorageError] = usePersistentState("policypal:stats", {
    answered: 0,
    terms: 0,
  });
  const [sourcesByPolicy, setSourcesByPolicy, srcStorageError] = usePersistentState(
    "policypal:sources",
    { health: [], motor: [], home: [], life: [] }
  );

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [askSignal, setAskSignal] = useState(null);

  // Track connectivity so the chat can warn the user instead of just
  // silently "working" while actually unable to reach anything external
  // (useful once this is wired to a real backend/API).
  useEffect(() => {
    function goOnline() {
      setIsOnline(true);
    }
    function goOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Guard against corrupted/missing keys in persisted data (e.g. an old
  // localStorage payload from before a policy type existed). This must run
  // in an effect, not during render -- calling setState directly in the
  // render body can trigger "Cannot update state while rendering" errors
  // and, in edge cases, infinite render loops.
  useEffect(() => {
    if (!DB[policyKey]) {
      setPolicyKey("health");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyKey]);

  const safePolicyKey = DB[policyKey] ? policyKey : "health";
  const messages = messagesByPolicy[safePolicyKey] || [WELCOME_MESSAGE];
  const sources = sourcesByPolicy[safePolicyKey] || [];

  const MAX_MESSAGES_PER_POLICY = 200;

  const setMessages = useCallback(
    (updater) => {
      setMessagesByPolicy((prev) => {
        const current = prev[safePolicyKey] || [WELCOME_MESSAGE];
        const next = typeof updater === "function" ? updater(current) : updater;
        const trimmed = Array.isArray(next) ? next.slice(-MAX_MESSAGES_PER_POLICY) : next;
        return { ...prev, [safePolicyKey]: trimmed };
      });
    },
    [safePolicyKey, setMessagesByPolicy]
  );

  function handlePolicyChange(nextKey) {
    if (!DB[nextKey]) {
      console.warn(`Ignored invalid policy change request: "${nextKey}"`);
      return;
    }
    setPolicyKey(nextKey);
    setAskSignal(null);
  }

  function handleAsk(question) {
    // Use a fresh object every click so identical repeated questions still
    // trigger the effect in ChatAssistant.
    setAskSignal({ q: question, t: Date.now() });
  }

  function handleAnswer(result, termCount) {
    setStats((prev) => ({
      answered: prev.answered + 1,
      terms: prev.terms + termCount,
    }));
    if (result.found && result.c > 0) {
      setSourcesByPolicy((prev) => {
        const current = prev[safePolicyKey] || [];
        const next = [result, ...current].slice(0, 5);
        return { ...prev, [safePolicyKey]: next };
      });
    }
  }

  const storageWarning = policyStorageError || msgStorageError || statsStorageError || srcStorageError;

  return (
    <ErrorBoundary>
      <Header queries={stats.answered} terms={stats.terms} isOnline={isOnline} />

      {!isOnline && (
        <div className="banner banner-warning" role="status">
          ⚠️ You're offline. PolicyPal AI works fully offline for now, but answers may be limited
          in future versions that rely on live data.
        </div>
      )}
      {storageWarning && (
        <div className="banner banner-warning" role="status">
          ⚠️ {storageWarning}
        </div>
      )}

      <div className="app">
        <PolicyManager
          policyKey={safePolicyKey}
          onPolicyChange={handlePolicyChange}
          onAsk={handleAsk}
          stats={stats}
        />
        <ChatAssistant
          policyKey={safePolicyKey}
          messages={messages}
          setMessages={setMessages}
          onAnswer={handleAnswer}
          askSignal={askSignal}
        />
        <SourcePanel policyKey={safePolicyKey} sources={sources} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
