import React, { useEffect, useRef, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { faker } from "@faker-js/faker/locale/ko";

const ROOM_SEQ = 1;

const App = () => {
  const client = useRef({});
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userNickname] = useState(faker.person.lastName() + faker.person.firstName());

  const isMyMessage = (sender) => sender === userNickname;

  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  const connect = () => {
    client.current = new StompJs.Client({
      webSocketFactory: () => new SockJS("/ws-stomp"),
      connectHeaders: {
        "auth-token": "spring-chat-auth-token",
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        subscribe();
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });

    client.current.activate();
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const subscribe = () => {
    client.current.subscribe(`/sub/chat/${ROOM_SEQ}`, (message) => {
      const receivedMessage = JSON.parse(message.body);
      const sender = receivedMessage.sender;
      const messageText = receivedMessage.message;
      setChatMessages((chatMessages) => [
        ...chatMessages,
        { message: messageText, sender: sender },
      ]);
    });
  };

  const publish = (message) => {
    if (!client.current.connected) {
      return;
    }

    client.current.publish({
      destination: "/pub/chat",
      body: JSON.stringify({ roomId: ROOM_SEQ, sender: userNickname, message }),
    });

    setMessage("");
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f4f4f4",
  };

  const chatContainerStyle = {
    width: "400px",
    backgroundColor: "white",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
    overflow: "hidden",
  };

  const chatMessagesStyle = {
    maxHeight: "300px",
    padding: "16px",
    overflowY: "auto",
  };

  const messageStyle = (sender) => ({
    backgroundColor: isMyMessage(sender) ? "#0078d4" : "#f0f0f0",
    color: isMyMessage(sender) ? "white" : "black",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "8px",
    wordWrap: "break-word",
  });

  const inputContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderTop: "1px solid #e0e0e0",
  };

  const inputStyle = {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    marginRight: "8px",
    outline: "none",
  };

  const sendButtonStyle = {
    backgroundColor: "#0078d4",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h2>Your Nickname: {userNickname}</h2>
      <div style={chatContainerStyle}>
        <div style={chatMessagesStyle}>
          {chatMessages && chatMessages.length > 0 && (
            <ul>
              {chatMessages.map((chatMessage, index) => (
                <li key={index} style={messageStyle(chatMessage.sender)}>
                  <strong>{chatMessage.sender}:</strong> {chatMessage.message}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={inputContainerStyle}>
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.which === 13 && publish(message)}
            style={inputStyle}
          />
          <button onClick={() => publish(message)} style={sendButtonStyle}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
