import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // 여기서 '서버 주소'는 실제 서버의 주소로 변경해야 합니다.

export default function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', (message) => {
      const newMessage = { id: Date.now(), text: message };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setTimeout(() => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== newMessage.id));
      }, 10000); // 메시지가 10초 후에 사라지도록 설정
    });
  }, []);

  return (
    <Container>
      {messages.map((msg) => (
        <MessageBubble key={msg.id}>{msg.text}</MessageBubble>

      ))}
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 20px;
  display: flex;
  flex-direction: column-reverse; // 메시지를 아래에서 위로 쌓도록 설정
  align-items: flex-end;
`;

const slideUp = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
`;

const MessageBubble = styled.div`
  max-width: 300px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: white;
  border : 1px solid black;
  color: white;
  border-radius: 20px;
  font-size: 1rem;
  word-wrap: break-word;
  animation: ${slideUp} 0.5s forwards;
  animation-delay: 9.5s; // 메시지가 사라지기 직전에 애니메이션 시작
`;
