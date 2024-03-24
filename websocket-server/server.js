const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' <URL>;");
  next();
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 클라이언트가 연결되었을 때의 이벤트 핸들러
io.on('connection', (socket) => {
  console.log('A user connected');

  // 클라이언트가 방에 조인하려고 할 때
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`A user joined room: ${roomId}`);
  });

  // 특정 방에 메시지 보내기
  socket.on('message', (message, roomId) => {
    // roomId 방에 있는 클라이언트들에게만 메시지 전송
    io.to(roomId).emit('message', message);
  });

  // 클라이언트가 연결을 끊었을 때의 이벤트 핸들러
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
