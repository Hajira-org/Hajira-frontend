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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // --- Scroll to bottom whenever messages change ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Initialize socket client-side ---
  useEffect(() => {
    if (typeof window === "undefined") return; // only run on client

    const io = require("socket.io-client");
    const s: Socket = io(process.env.NEXT_PUBLIC_API_BACKEND_URL);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // --- Join room & listen for messages ---
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

  const sendMessage = () => {
    if (!message.trim() || !socket) return;

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

  const messageVariants = {
    hidden: { y: -20, rotate: -5, opacity: 0 },
    visible: {
      y: 0,
      rotate: [5, -3, 2, 0],
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
