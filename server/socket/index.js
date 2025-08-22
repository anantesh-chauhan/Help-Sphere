const { Server } = require('socket.io');
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
function initSocket(httpServer, app) {
  const io = new Server(httpServer, {
    cors: {
      origin: [frontendUrl, "http://localhost:5174"],
      credentials: true
    }
  });

  const onlineUsers = new Map();
  app.set('io', io);
  app.set('onlineUsers', onlineUsers);

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

    // -------------------------
    // Chat messages
    // -------------------------
    socket.on('chatMessage', ({ roomId, message, sender }) => {
      io.to(roomId).emit('message', { message, sender, createdAt: new Date() });
    });

    socket.on('typing', ({ roomId, sender }) => {
      socket.to(roomId).emit('typing', { sender });
    });

    socket.on('seen', ({ roomId, messageId }) => {
      io.to(roomId).emit('seen', { messageId });
    });

    // -------------------------
    // Video/Audio call signaling
    // -------------------------
    socket.on('callUser', ({ to, signalData, from, callType }) => {
      if (onlineUsers.has(to)) {
        io.to(onlineUsers.get(to)).emit('incomingCall', { from, signalData, callType });
      }
    });

    socket.on('answerCall', ({ to, signalData }) => {
      if (onlineUsers.has(to)) {
        io.to(onlineUsers.get(to)).emit('callAccepted', { signalData });
      }
    });

    socket.on('endCall', ({ to }) => {
      if (onlineUsers.has(to)) {
        io.to(onlineUsers.get(to)).emit('callEnded');
      }
    });

    // -------------------------
    // Disconnect
    // -------------------------
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
