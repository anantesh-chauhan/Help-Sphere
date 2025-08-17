import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ userId, children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:5050", { withCredentials: true });
    setSocket(newSocket);

    newSocket.emit("userConnected", userId);

    newSocket.on("onlineUsers", (users) => setOnlineUsers(users));

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
