const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 각 방별 메시지 저장
const roomMessages = {
  room1: [],
  room2: [],
  // 추가 방이 있다면 계속 추가
};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (titleName) => {
    socket.join(titleName);
    console.log(`A user joined room: ${titleName}`);
    // 방에 조인할 때 해당 방의 메시지를 클라이언트에 전송
    roomMessages[titleName].forEach((message) => {
      socket.emit('message', message);
    });
  });

  socket.on('message', (message, titleName) => {
    // 메시지를 해당 방의 메시지 목록에 추가
    if (!roomMessages[titleName]) {
      roomMessages[titleName] = []; // 방이 존재하지 않으면 생성
    }
    roomMessages[titleName].push(message);

    // roomId 방에 있는 클라이언트들에게만 메시지 전송
    io.to(titleName).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
