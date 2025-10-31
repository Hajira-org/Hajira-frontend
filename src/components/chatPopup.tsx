import { useState, useEffect, FC, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

const socket: Socket = io("http://localhost:4000");

interface Message {
  sender: string;
  receiver?: string;
  message: string;
  time?: string;
}

interface ChatPopupProps {
  open: boolean;
  onClose: () => void;
  roomId?: string;
  sender: string;
  receiver: string;
}

const ChatPopup: FC<ChatPopupProps> = ({ open, onClose, sender, receiver }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // --- Scroll to bottom whenever messages change ---
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!open || !sender || !receiver) return;

    const roomKey =
      sender < receiver
        ? `room_${sender}_${receiver}`
        : `room_${receiver}_${sender}`;

    socket.emit("joinRoom", roomKey);

    const handleMessageHistory = (history: Message[]) => {
      setMessages(history);
    };

    const handleReceiveMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.off("messageHistory");
    socket.off("receiveMessage");

    socket.on("messageHistory", handleMessageHistory);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("messageHistory", handleMessageHistory);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [open, sender, receiver]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const roomKey =
      sender < receiver
        ? `room_${sender}_${receiver}`
        : `room_${receiver}_${sender}`;

    const newMsg: Message = { sender, receiver, message, time: new Date().toISOString() };

    socket.emit("sendMessage", {
      roomId: roomKey,
      sender,
      receiver,
      message,
    });

    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  if (!open) return null;

  // Framer motion variants for shake/pop
  const messageVariants = {
    hidden: { y: -20, rotate: -5, opacity: 0 },
    visible: {
      y: 0,
      rotate: [5, -3, 2, 0], // wiggly effect
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 12 },
    },
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "1rem",
        width: "320px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#3b82f6",
          color: "white",
          padding: "0.5rem",
        }}
      >
        <strong>Chat</strong>
        <button
          onClick={onClose}
          style={{
            float: "right",
            color: "white",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✖
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          height: "250px",
          overflowY: "auto",
          padding: "0.5rem",
          background: "#f9fafb",
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => {
            const isSender = m.sender === sender;
            return (
              <motion.div
                key={i}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                style={{
                  margin: "0.5rem 0",
                  textAlign: isSender ? "right" : "left",
                }}
              >
                <strong>{isSender ? "You" : "Them"}</strong>
                <div
                  style={{
                    background: isSender ? "#22c55e" : "#a855f7",
                    color: "black",
                    borderRadius: "10px",
                    padding: "0.5rem",
                    marginTop: "0.2rem",
                    display: "inline-block",
                    maxWidth: "80%",
                    wordWrap: "break-word",
                  }}
                >
                  {m.message}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
        <input
          style={{
            flex: 1,
            border: "none",
            padding: "0.5rem",
            outline: "none",
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;
