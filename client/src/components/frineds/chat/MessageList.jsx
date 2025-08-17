import React from "react";

export default function MessageList({ messages, user }) {
  return (
    <div>
      {messages.map((msg, idx) => (
        <div key={idx} className={`my-2 ${msg.sender === user._id ? "text-right" : "text-left"}`}>
          <span className={`inline-block px-3 py-1 rounded-lg ${msg.sender === user._id ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
            {msg.message}
          </span>
        </div>
      ))}
    </div>
  );
}
