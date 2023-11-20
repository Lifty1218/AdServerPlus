import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socket = io.connect("http://localhost:3000"); // Replace with your server URL

  // Join the chat room upon component mount
  useEffect(() => {
    socket.emit("joinRoom", userId);

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // Handle incoming chat messages
  useEffect(() => {
    socket.on("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  // Handle sending chat messages
  const sendMessage = () => {
    socket.emit("chatMessage", { room: userId, message: messageInput });
    setMessageInput("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.messageContainer}>
        {messages.map((message, index) => (
          <p key={index} style={styles.message}>
            {message}
          </p>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          style={styles.messageInput}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "400px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
  },
  messageContainer: {
    height: "200px",
    overflowY: "scroll",
    marginBottom: "10px",
  },
  message: {
    margin: "5px 0",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
  },
  messageInput: {
    flexGrow: 1,
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginRight: "10px",
  },
  sendButton: {
    padding: "5px 10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Chat;
