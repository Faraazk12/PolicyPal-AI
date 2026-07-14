import React from "react";

function ChatMessage({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`msg ${isUser ? "user" : ""}`}>
      <div className={`av ${isUser ? "user" : "bot"}`}>{isUser ? "👤" : "🛡️"}</div>
      <div
        className={`bubble ${isUser ? "user" : "bot"}`}
        // Content is either our own template strings or user input rendered
        // as plain text by the caller (see ChatAssistant) -- never raw user
        // HTML -- so this is safe.
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}

export default ChatMessage;
