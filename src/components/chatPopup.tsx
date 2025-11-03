import { useState, useEffect, FC, useRef } from "react";
import { Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  sender: string;
  receiver?: string;
  message: string;
  time?: string;
}

interface ChatPopupProps {
  open: boolean;
  onClose: () => void;
  sender: string;
  receiver: string;
}

const ChatPopup: FC<ChatPopupProps> = ({ open, onClose, sender, receiver }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [suggestion, setSuggestion] = useState<string>("");
  const [loadingSuggestion, setLoadingSuggestion] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"chat" | "ai">("chat");
  const [aiMessage, setAiMessage] = useState<string>("");
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "ai"; message: string; time: string }>>([]);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const aiMessagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    aiMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
  
    import("socket.io-client").then(({ io }) => {
      const s: Socket = io(process.env.NEXT_PUBLIC_API_BACKEND_URL as string);
      setSocket(s);
    });
  
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open || !sender || !receiver || !socket) return;
    const roomKey =
      sender < receiver
        ? `room_${sender}_${receiver}`
        : `room_${receiver}_${sender}`;
    socket.emit("joinRoom", roomKey);

    const handleMessageHistory = (history: Message[]) => setMessages(history);
    const handleReceiveMessage = (data: Message) =>
      setMessages((prev) => [...prev, data]);

    socket.off("messageHistory");
    socket.off("receiveMessage");
    socket.on("messageHistory", handleMessageHistory);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("messageHistory", handleMessageHistory);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [open, sender, receiver, socket]);

  useEffect(() => {
    if (message.trim().length < 3) {
      setSuggestion("");
      setLoadingSuggestion(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setLoadingSuggestion(true);
        const res = await fetch("/api/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: message, history: messages.slice(-5) }),
          signal: controller.signal,
        });
        const data = await res.json();
        setSuggestion(data.suggestion || "");
      } catch {
        setSuggestion("");
      } finally {
        setLoadingSuggestion(false);
      }
    }, 600);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [message]);

  const sendMessage = () => {
    if (!message.trim() || !socket) return;
    const roomKey =
      sender < receiver
        ? `room_${sender}_${receiver}`
        : `room_${receiver}_${sender}`;
    const newMsg: Message = {
      sender,
      receiver,
      message,
      time: new Date().toISOString(),
    };
    socket.emit("sendMessage", { roomId: roomKey, sender, receiver, message });
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
    setSuggestion("");
  };

  const acceptSuggestion = () => {
    if (!suggestion) return;
    setMessage((prev) => prev + " " + suggestion);
    setSuggestion("");
  };

  const sendAiMessage = async () => {
    if (!aiMessage.trim()) return;
    
    const userMsg = {
      role: "user" as const,
      message: aiMessage,
      time: new Date().toISOString(),
    };
    
    setAiMessages((prev) => [...prev, userMsg]);
    setAiMessage("");
    setLoadingAi(true);
    
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: aiMessage, 
          history: aiMessages.slice(-10) 
        }),
      });
      const data = await res.json();
      
      const aiMsg = {
        role: "ai" as const,
        message: data.response || "Sorry, I couldn't process that.",
        time: new Date().toISOString(),
      };
      
      setAiMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = {
        role: "ai" as const,
        message: "Sorry, I'm having trouble connecting right now.",
        time: new Date().toISOString(),
      };
      setAiMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoadingAi(false);
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: "24px",
        width: "380px",
        height: "600px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: 9999,
        backdropFilter: "blur(20px)",
        border: "2px solid white",
      }}
    >
      {/* Animated Background Gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background:
            "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        style={{
          background: "#052034",
          color: "white",
          padding: "1.25rem 1.5rem",
          fontWeight: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: activeTab === "chat" ? "#10b981" : "#f59e0b",
              boxShadow: `0 0 12px ${activeTab === "chat" ? "rgba(16, 185, 129, 0.6)" : "rgba(245, 158, 11, 0.6)"}`,
              animation: "pulse 2s infinite",
            }}
          />
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 600 }}>
              {activeTab === "chat" ? "User Chat" : "AI Assistant"}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                opacity: 0.9,
                fontWeight: 400,
                marginTop: "2px",
              }}
            >
              {activeTab === "chat" ? "Online" : "Always available"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(activeTab === "chat" ? "ai" : "chat")}
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              padding: "0.5rem 0.85rem",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: "1rem" }}>
              {activeTab === "chat" ? "" : ""}
            </span>
            {activeTab === "chat" ? "Chat with AI" : "User Chat"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
              transition: "all 0.2s",
            }}
          >
            ✕
          </motion.button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "1.5rem",
          background: "transparent",
          position: "relative",
          zIndex: 1,
          maxHeight: "100%",
        }}
      >
        {activeTab === "chat" ? (
          <AnimatePresence initial={false}>
            {messages.map((m, i) => {
              const isSender = m.sender === sender;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  style={{
                    margin: "0.75rem 0",
                    display: "flex",
                    justifyContent: isSender ? "flex-end" : "flex-start",
                    alignItems: "flex-end",
                    gap: "0.5rem",
                  }}
                >
                  {!isSender && (
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "#052034",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                      }}
                    >
                      {receiver.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    style={{
                      background: isSender
                        ? "#052034"
                        : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                      color: isSender ? "white" : "#1f2937",
                      padding: "0.85rem 1.1rem",
                      borderRadius: isSender
                        ? "20px 20px 4px 20px"
                        : "20px 20px 20px 4px",
                      maxWidth: "70%",
                      wordWrap: "break-word",
                      boxShadow: isSender
                        ? "0 8px 20px rgba(102, 126, 234, 0.25)"
                        : "0 4px 12px rgba(0, 0, 0, 0.08)",
                      border: isSender ? "none" : "1px solid rgba(0,0,0,0.05)",
                      fontSize: "0.95rem",
                      lineHeight: "1.5",
                      position: "relative",
                    }}
                  >
                    {m.message}
                    {m.time && (
                      <div
                        style={{
                          fontSize: "0.65rem",
                          opacity: 0.7,
                          marginTop: "0.35rem",
                          textAlign: "right",
                        }}
                      >
                        {new Date(m.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </motion.div>
                  {isSender && (
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      {sender.charAt(0).toUpperCase()}
                    </div>
                  )}
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        ) : (
          <AnimatePresence initial={false}>
            {aiMessages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  textAlign: "center",
                  gap: "1rem",
                }}
              >
                <div style={{ fontSize: "3rem" }}>🤖</div>
                <div style={{ color: "#6b7280", fontSize: "0.95rem", maxWidth: "80%" }}>
                  Start a conversation with AI Assistant. Ask anything!
                </div>
              </motion.div>
            ) : (
              <>
                {aiMessages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    style={{
                      margin: "0.75rem 0",
                      display: "flex",
                      justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                      alignItems: "flex-end",
                      gap: "0.5rem",
                    }}
                  >
                    {m.role === "ai" && (
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #f59e0b, #d97706)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          flexShrink: 0,
                          boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                        }}
                      >
                        🤖
                      </div>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      style={{
                        background: m.role === "user"
                          ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                          : "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                        color: m.role === "user" ? "white" : "#1f2937",
                        padding: "0.85rem 1.1rem",
                        borderRadius: m.role === "user"
                          ? "20px 20px 4px 20px"
                          : "20px 20px 20px 4px",
                        maxWidth: "70%",
                        wordWrap: "break-word",
                        boxShadow: m.role === "user"
                          ? "0 8px 20px rgba(16, 185, 129, 0.25)"
                          : "0 4px 12px rgba(245, 158, 11, 0.15)",
                        border: m.role === "user" ? "none" : "1px solid #fbbf24",
                        fontSize: "0.95rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {m.message}
                      <div
                        style={{
                          fontSize: "0.65rem",
                          opacity: 0.7,
                          marginTop: "0.35rem",
                          textAlign: "right",
                        }}
                      >
                        {new Date(m.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </motion.div>
                    {m.role === "user" && (
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #10b981, #059669)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          flexShrink: 0,
                          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        {sender.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </motion.div>
                ))}
                {loadingAi && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      margin: "0.75rem 0",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "flex-end",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #f59e0b, #d97706)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1rem",
                        flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                      }}
                    >
                      🤖
                    </div>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                        padding: "0.85rem 1.1rem",
                        borderRadius: "20px 20px 20px 4px",
                        border: "1px solid #fbbf24",
                        display: "flex",
                        gap: "0.4rem",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#f59e0b",
                          animation: "bounce 1.4s infinite ease-in-out both",
                        }}
                      />
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#f59e0b",
                          animation: "bounce 1.4s infinite ease-in-out both 0.2s",
                        }}
                      />
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#f59e0b",
                          animation: "bounce 1.4s infinite ease-in-out both 0.4s",
                        }}
                      />
                    </div>
                  </motion.div>
                )}
                <div ref={aiMessagesEndRef} />
              </>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Input Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          padding: "1rem 1.25rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* AI Suggestion - Only show in chat tab */}
        {activeTab === "chat" && (
          <AnimatePresence>
            {loadingSuggestion ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1rem",
                  marginBottom: "0.75rem",
                  background: "linear-gradient(90deg, #f3f4f6, #e5e7eb, #f3f4f6)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s linear infinite",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: "2px solid #9ca3af",
                    borderTopColor: "transparent",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                  }}
                >
                  AI is thinking...
                </span>
              </motion.div>
            ) : (
              suggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={acceptSuggestion}
                  style={{
                    fontSize: "0.85rem",
                    color: "#4b5563",
                    marginBottom: "0.75rem",
                    cursor: "pointer",
                    padding: "0.75rem 1rem",
                    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                    borderRadius: "12px",
                    border: "1px solid #fbbf24",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 2px 8px rgba(251, 191, 36, 0.15)",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>💡</span>
                  <span style={{ flex: 1, fontStyle: "italic" }}>
                    {suggestion}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "#92400e",
                      background: "rgba(255,255,255,0.5)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "6px",
                      fontWeight: 600,
                    }}
                  >
                    TAB
                  </span>
                </motion.div>
              )
            )}
          </AnimatePresence>
        )}

        {/* Input Field */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "#f9fafb",
            borderRadius: "24px",
            padding: "0.5rem",
            border: "1px solid #052034",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)",
          }}
        >
          <input
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              padding: "0.75rem 1rem",
              outline: "none",
              fontSize: "0.95rem",
              color: "#052034",
            }}
            value={activeTab === "chat" ? message : aiMessage}
            onChange={(e) => activeTab === "chat" ? setMessage(e.target.value) : setAiMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                activeTab === "chat" ? sendMessage() : sendAiMessage();
              }
              if (e.key === "Tab" && suggestion && activeTab === "chat") {
                e.preventDefault();
                acceptSuggestion();
              }
            }}
            placeholder={activeTab === "chat" ? "Type your message..." : "Ask AI anything..."}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={activeTab === "chat" ? sendMessage : sendAiMessage}
            disabled={activeTab === "chat" ? !message.trim() : !aiMessage.trim()}
            style={{
              background: (activeTab === "chat" ? message.trim() : aiMessage.trim())
                ? activeTab === "chat" 
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                : "#e5e7eb",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              cursor: (activeTab === "chat" ? message.trim() : aiMessage.trim()) ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              boxShadow: (activeTab === "chat" ? message.trim() : aiMessage.trim())
                ? activeTab === "chat"
                  ? "0 4px 12px rgba(102, 126, 234, 0.3)"
                  : "0 4px 12px rgba(245, 158, 11, 0.3)"
                : "none",
              transition: "all 0.2s",
            }}
          >
            <span style={{ transform: "translateX(1px)" }}>➤</span>
          </motion.button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 
          40% { 
            transform: scale(1);
          }
        }
        
        /* Custom Scrollbar */
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.3);
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.5);
        }
      `}</style>
    </motion.div>
  );
};

export default ChatPopup;