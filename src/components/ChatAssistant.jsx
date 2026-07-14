import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { getResponse, countTerms } from "../utils/chatEngine";
import { DB } from "../data/policyData";

const MAX_LEN = 300;

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function ChatAssistant({ policyKey, messages, setMessages, onAnswer, askSignal }) {
  const [input, setInput] = useState("");
  const [validationError, setValidationError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sendError, setSendError] = useState(null);
  const chatWinRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatWinRef.current) {
      chatWinRef.current.scrollTop = chatWinRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Quick-question buttons in the sidebar set askSignal to a question string;
  // we watch for changes and submit it as if the user typed it.
  useEffect(() => {
    if (askSignal?.q) {
      submitMessage(askSignal.q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askSignal]);

  function validate(text) {
    const trimmed = text.trim();
    if (!trimmed) return "Please enter a question before sending.";
    if (trimmed.length < 2) return "That's too short — try a full question.";
    if (trimmed.length > MAX_LEN) return `Keep it under ${MAX_LEN} characters.`;
    return null;
  }

  function submitMessage(rawText) {
    const text = rawText.trim();
    const error = validate(text);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    setSendError(null);

    setMessages((prev) => [...prev, { role: "user", text: escapeHtml(text) }]);
    setInput("");
    setIsTyping(true);

    const delay = 700 + Math.random() * 300;
    setTimeout(() => {
      try {
        const result = getResponse(text, policyKey);
        setMessages((prev) => [...prev, { role: "bot", text: result.a }]);
        onAnswer(result, countTerms(result.a));
      } catch (err) {
        console.error("Chat response failed:", err);
        setSendError("Something went wrong generating a response. Please try again.");
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "⚠️ Sorry, I hit an error answering that. Please rephrase or try again.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }, delay);
  }

  function handleSend() {
    submitMessage(input);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend();
  }

  function handleClear() {
    setMessages([
      {
        role: "bot",
        text: `Chat cleared! Ask me anything about your <strong>${DB[policyKey].name}</strong> 😊`,
      },
    ]);
    setValidationError(null);
    setSendError(null);
  }

  return (
    <div className="panel center-panel">
      <div className="ph">
        <div className="dot" /> Chat Assistant
      </div>

      <div className="chat-win" ref={chatWinRef}>
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} text={m.text} />
        ))}
      </div>

      <div className={`typing-row ${isTyping ? "" : "hidden"}`}>
        <div className="av bot">🛡️</div>
        <div className="bubble bot typing-bubble">
          <div className="tdots">
            <div className="td" />
            <div className="td" />
            <div className="td" />
          </div>
        </div>
      </div>

      {(validationError || sendError) && (
        <div className="inline-error" role="alert">
          ⚠️ {validationError || sendError}
        </div>
      )}

      <div className="input-bar">
        <button className="clr-btn" onClick={handleClear} title="Clear" aria-label="Clear chat">
          🗑️
        </button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          maxLength={MAX_LEN}
          placeholder="Ask about your policy… e.g. What is covered?"
          onChange={(e) => {
            setInput(e.target.value);
            if (validationError) setValidationError(null);
          }}
          onKeyDown={handleKeyDown}
          aria-invalid={!!validationError}
        />
        <button className="send-btn" onClick={handleSend} disabled={isTyping}>
          Send ➤
        </button>
      </div>
    </div>
  );
}

export default ChatAssistant;