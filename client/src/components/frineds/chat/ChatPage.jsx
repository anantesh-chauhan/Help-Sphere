import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
// import ChatWindow from "./ChatWindow";
import OnlineUsers from "./OnlineUsers";
import { useContext } from "react";
import {AppContent} from "../../../context/AppContext";
const socket = io("http://localhost:5050", {
  withCredentials: true,
});

export default function ChatPage({ user }) {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const backendUrl = useContext(AppContent);
  // fetch friends
  useEffect(() => {
    axios.get(`${backendUrl}/friends/${user._id}/list`)
      .then(res => setFriends(res.data))
      .catch(err => console.error(err));
  }, [user]);

  // socket setup
  useEffect(() => {
    if (!user) return;
    socket.emit("userConnected", user._id);

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <div className="flex h-[80vh] border rounded-md shadow-md">
      {/* Sidebar */}
      <div className="w-1/4 border-r overflow-y-auto">
        <h2 className="p-2 font-semibold">Friends</h2>
        {friends.map(f => (
          <div
            key={f._id}
            className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedFriend?._id === f._id ? "bg-gray-200" : ""}`}
            onClick={() => setSelectedFriend(f)}
          >
            {f.name}
            {onlineUsers.includes(f._id) && <span className="ml-2 text-green-500">●</span>}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      {/* <div className="flex-1">
        {selectedFriend ? (
          <ChatWindow
            user={user}
            friend={selectedFriend}
            socket={socket}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a friend to start chatting
          </div>
        )}
      </div> */}

      {/* Online Users */}
      <div className="w-1/4 border-l">
        <OnlineUsers onlineUsers={onlineUsers} friends={friends} />
      </div>
    </div>
  );
}
