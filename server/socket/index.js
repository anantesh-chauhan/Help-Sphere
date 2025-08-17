// socket.js
const { Server } = require('socket.io');

let onlineUsers = new Map();

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 A user connected:', socket.id);

    socket.on('userConnected', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      console.log(`🟢 ${userId} is online`);
    });

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`🟢 Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on('chatMessage', ({ roomId, message, sender }) => {
      io.to(roomId).emit('message', {
        message,
        sender,
        createdAt: new Date()
      });
    });

    socket.on('typing', ({ roomId, sender }) => {
      socket.to(roomId).emit('typing', { sender });
    });

    socket.on('seen', ({ roomId, messageId }) => {
      io.to(roomId).emit('seen', { messageId });
    });

    socket.on('callUser', ({ to, signal, from }) => {
      if (onlineUsers.has(to)) {
        io.to(onlineUsers.get(to)).emit('callUser', { signal, from });
      }
    });

    socket.on('answerCall', ({ to, signal }) => {
      if (onlineUsers.has(to)) {
        io.to(onlineUsers.get(to)).emit('callAccepted', { signal });
      }
    });

    socket.on('disconnect', () => {
      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          io.emit('onlineUsers', Array.from(onlineUsers.keys()));
          console.log(`❌ ${userId} went offline`);
          break;
        }
      }
      console.log('❌ A user disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = initSocket;
