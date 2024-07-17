import { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
type User = {
  message: string;
  nick: string;
};

function App() {
  const [messages, setMessages] = useState<User[]>([]);
  const [input, setInput] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [isNicknameSet, setIsNicknameSet] = useState<boolean>(false);
  const socketRef = useRef<any>(null);

  // Função para inicializar o socket
  const initializeSocket = () => {
    socketRef.current = socketIOClient(ENDPOINT);

    // Mensagens recebidas armazenadas em um array
    socketRef.current.on("message", (message: User) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  };

  // Gerenciar conexões
  useEffect(() => {
    initializeSocket();
  }, []);

  // Envio de mensagens
  const sendMessage = () => {
    if (socketRef.current && input) {
      const messageToSend = { nick: nickname, message: input };

      socketRef.current.emit("message", messageToSend);
      setInput("");
    }
  };

  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname) {
      setIsNicknameSet(true);
    }
  };

  return (
    <div>
      <h1>Chat</h1>

      {!isNicknameSet ? (
        <form onSubmit={handleNicknameSubmit}>
          <input
            type="text"
            placeholder="Escolha um nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button type="submit">Definir Nickname</button>
        </form>
      ) : (
        <>
          <div>
            {messages.map((message, index) => (
              <div key={index} className="message">
                <span className="nickname">{message.nick}:</span>{" "}
                {message.message}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem"
          />
          <button onClick={sendMessage}>Enviar</button>
        </>
      )}
    </div>
  );
}

export default App;
