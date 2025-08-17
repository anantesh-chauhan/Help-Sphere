import React, { useState } from "react";
import Picker from "emoji-picker-react";

export default function MessageInput({ socket, roomId, sender }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("chatMessage", { roomId, message: text, sender });
    setText("");
  };

  return (
    <div className="p-2 border-t flex items-center gap-2">
      <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>
      {showEmoji && (
        <Picker
          onEmojiClick={(e, emojiObj) => setText(text + emojiObj.emoji)}
        />
      )}

      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          socket.emit("typing", { roomId, sender });
        }}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        className="flex-1 border rounded px-2 py-1"
      />
      <button onClick={sendMessage} className="bg-green-500 text-white px-3 py-1 rounded">
        Send
      </button>
    </div>
  );
}
