const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // 모든 도메인에서의 접근을 허용합니다. 보안상의 이유로 적절한 도메인으로 제한하는 것이 좋습니다.
    methods: ["GET", "POST"]
  }
});

// 클라이언트가 연결되었을 때의 이벤트 핸들러
io.on('connection', (socket) => {
  console.log('A user connected');

  // 메시지를 받으면 모든 클라이언트에게 그 메시지를 전달
  socket.on('message', (message) => {
    io.emit('message', message);
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
