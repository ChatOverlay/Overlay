import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import io from 'socket.io-client';
const socket = io('http://localhost:4000'); // 실제 서버 주소로 변경해야 합니다.

export default function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const titleName = "room2"; // 예시 ID

    socket.emit('joinRoom', titleName);

    socket.on('message', (message) => {
      const expireTime = Date.now() + 10000;
      // 서버로부터 받은 메시지가 객체 형태인 경우 message.text를 사용
      // 문자열인 경우 바로 message를 사용
      const text = message.text ? message.text : message;
      const newMessage = { id: Date.now(), text: text, expire: expireTime };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // 1초마다 만료된 메시지 제거
    const interval = setInterval(() => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.expire > Date.now()));
    }, 1000);

    return () => {
      clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
      socket.off('message');
    };
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
  flex-direction: column; // 메시지를 아래에서 위로 쌓도록 설정
  align-items: flex-end;
`;

const slideInAndUp = keyframes`
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  10% {
    transform: translateY(0);
    opacity: 1;
  }
  90% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const MessageBubble = styled.div`
  max-width: 300px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: white;
  border: 1px solid black;
  color: black;
  border-radius: 10px;
  font-size: 1rem;
  word-wrap: break-word;
  animation: ${slideInAndUp} 10s forwards; // 총 애니메이션 시간을 10초로 설정
`;
