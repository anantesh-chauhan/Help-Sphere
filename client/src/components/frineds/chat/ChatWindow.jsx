import React, { useEffect, useState } from "react";
import axios from "axios";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import CallModal from "./CallModal";
import { useContext } from "react";
import {AppContent} from "../../../context/AppContext";
export default function ChatWindow({ user, friend, socket }) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(null);
  const [call, setCall] = useState(null);
  const backendUrl = useContext(AppContent);
  const roomId = [user._id, friend._id].sort().join("_");

  // load old messages
  useEffect(() => {
    axios.get(`${backendUrl}/messages/${roomId}`).then(res => setMessages(res.data));
    socket.emit("joinRoom", roomId);
  }, [roomId]);

  // listen for socket events
  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", ({ sender }) => {
      if (sender === friend._id) setTyping(sender);
      setTimeout(() => setTyping(null), 2000);
    });

    socket.on("callUser", (data) => {
      setCall(data);
    });

    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("callUser");
    };
  }, [friend]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-2 border-b flex justify-between items-center">
        <h3 className="font-semibold">{friend.name}</h3>
        <button
          onClick={() => socket.emit("callUser", { to: friend._id, from: user._id })}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          📞 Call
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2">
        <MessageList messages={messages} user={user} />
        {typing && <div className="text-gray-500 italic">Typing...</div>}
      </div>

      {/* Input */}
      <MessageInput socket={socket} roomId={roomId} sender={user._id} />
      
      {/* Call Modal */}
      {call && <CallModal call={call} socket={socket} user={user} />}
    </div>
  );
}
