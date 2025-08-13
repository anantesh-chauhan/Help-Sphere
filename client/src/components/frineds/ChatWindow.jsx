import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function ChatWindow({ friend }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const s = io(import.meta.env.VITE_API_URL, {
      auth: { token: localStorage.getItem('token') }
    });
    s.on('message:new', msg => {
      if (msg.sender === friend._id || msg.receiver === friend._id) {
        setMessages(prev => [...prev, msg]);
      }
    });
    setSocket(s);
    return () => s.disconnect();
  }, [friend]);

  const send = () => {
    socket.emit('message:send', { toUserId: friend._id, body: text });
    setMessages(prev => [...prev, { sender: 'me', body: text }]);
    setText('');
  };

  return (
    <div className="flex flex-col h-full border rounded">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded max-w-xs ${m.sender === 'me' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200'}`}>
            {m.body}
          </div>
        ))}
      </div>
      <div className="flex border-t">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 p-2"
          placeholder="Type a message..."
        />
        <button onClick={send} className="bg-blue-500 text-white px-4">Send</button>
      </div>
    </div>
  );
}
