import React,{ useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import { BotMessage } from "./ProductUtils";

const BACKEND_URL = "http://localhost:4000/api/chat";

const BotIcon = ({ size = 14, color = "#fff" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
  >
    <path d="M3 10.5C3 7 5.5 4 9 4h6c3.5 0 6 3 6 6.5v2C21 17 18.5 20 15 20H9c-3.5 0-6-3-6-6.5v-3z" />
  </svg>
);

const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#888"
    strokeWidth="1.8"
    strokeLinecap="round"
    width="14"
    height="14"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const SendIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="15"
    height="15"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const TypingIndicator = () => (
  <div className="sole-typing">
    <span />
    <span />
    <span />
  </div>
);

const QUICK_CHIPS = ["Track my order", "Sizing guide", "Return policy", "Sale & offers"];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hey there! 👟 Welcome to SoleSupport. I'm here to help with orders, sizing, returns, and anything else. What can I do for you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const messagesEndRef = useRef(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput("");
    setChipsVisible(false);
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg ,conversationHistory}),
      });
const data = await res.json();
const replyText = data.success 
  ? data.reply 
  : "Sorry, I couldn't get a response. Please try again.";

setMessages((prev) => [...prev, { role: "bot", text: replyText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Hmm, I'm having trouble connecting. Try again in a moment!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="sole-shell">
      {/* Header */}
      <div className="sole-header">
        <div className="sole-brand-mark">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="20"
            height="20"
          >
            <path d="M3 10.5C3 7 5.5 4 9 4h6c3.5 0 6 3 6 6.5v2C21 17 18.5 20 15 20H9c-3.5 0-6-3-6-6.5v-3z" />
            <path d="M7 14s1.5 2 5 2 5-2 5-2" />
            <circle cx="9" cy="10" r="1" fill="#fff" />
            <circle cx="15" cy="10" r="1" fill="#fff" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div className="sole-brand-name">SoleSupport</div>
          <div className="sole-status">
            <div className="sole-dot" />
            <span className="sole-status-text">Online — here to help</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="sole-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`sole-row ${msg.role}`}>
            <div className={`sole-avatar ${msg.role === "user" ? "user" : ""}`}>
              {msg.role === "user" ? <UserIcon /> : <BotIcon />}
            </div>
            {msg.role === "bot"
              ? <div>
    <BotMessage text={msg.text} />
  </div>

              : <div className="sole-bubble user">{msg.text}</div>
            }          </div>
        ))}

        {loading && (
          <div className="sole-row bot">
            <div className="sole-avatar">
              <BotIcon />
            </div>
            <div className="sole-bubble bot">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick chips */}
      {chipsVisible && (
        <div className="sole-chips">
          {QUICK_CHIPS.map((chip) => (
            <button key={chip} className="sole-chip" onClick={() => sendMessage(chip)}>
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="sole-inputbar">
        <input
          className="sole-input"
          type="text"
          placeholder="Ask me anything about your order..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="sole-send"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
