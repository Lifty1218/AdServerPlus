import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { RiSendPlaneFill } from "react-icons/ri";
import { createUseStyles } from "react-jss";
import axios from "axios";
import { FiHelpCircle } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import adminAvatar from "../../assets/avatar.jpg";

const socket = io("http://localhost:5000");

const AdvertiserAssistance = () => {
  const location = useLocation();
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [advertiser, setAdvertiser] = useState({});

  useEffect(() => {
    if (!location.state) {
      navigate("/admin/advertiser_assistance");
    } else {
      setAdvertiser(location.state.advertiser);
    }
  }, []);

  useEffect(() => {
    if (advertiser.id) {
      socket.emit("join", advertiser.id);

      axios
        .get(`http://localhost:5000/advertiser/messages/${advertiser.id}`)
        .then((response) => setMessages(response.data))
        .catch((error) => console.error(error));

      socket.on("message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off("message");
      };
    }
  }, [advertiser]);

  const handleSendMessage = () => {
    if (message) {
      socket.emit("message", {
        advertiserId: advertiser.id,
        message,
        sender: "admin",
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: message,
          timestamp: Date.now(),
          sender: "admin",
        },
      ]);
      setMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.messagesContainer}>
        <h2 className={classes.messageHeading}>
          <span style={{ marginRight: "1rem", marginTop: ".5rem" }}>
            <FiHelpCircle />
          </span>
          User Assistance
        </h2>
        <div className={classes.messagesInnerContainer}>
          {messages.map((message, index) => {
            const date = new Date(message.timestamp);
            const options = { hour: "numeric", minute: "numeric" };
            const time = date.toLocaleTimeString([], options);
            return (
              <div
                key={index}
                className={`${classes.messageBox}  ${
                  message.sender === "admin"
                    ? classes.rightMessage
                    : classes.leftMessage
                }`}
              >
                {message.sender == "advertiser" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={advertiser.imageURL}
                      alt={advertiser.name}
                      className={classes.image}
                    />
                    <p
                      style={{
                        fontSize: "1.4rem",
                        textAlign: "center",
                        marginTop: ".2rem",
                      }}
                    >
                      {advertiser.name}
                    </p>
                  </div>
                )}
                <p className={`${classes.message}`}>
                  {message.text}
                  <span className={classes.timestamp}>{time}</span>
                </p>
                {message.sender == "admin" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={adminAvatar}
                      alt="Admin"
                      className={classes.image}
                    />
                    <p
                      style={{
                        fontSize: "1.3rem",
                        maxWidth: "8rem",
                        textAlign: "center",
                        marginTop: ".5rem",
                      }}
                    >
                      Admin
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className={classes.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className={classes.input}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage} className={classes.button}>
          <RiSendPlaneFill className={classes.sendIcon} />
          Send
        </button>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    padding: ".5rem 3%",
    borderRadius: "5px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  messagesContainer: {
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "0 0 1.6rem",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#eeeeee",
    boxShadow: "0 .4rem .8rem rgba(0,0,0,0.2)",
  },
  messageHeading: {
    fontSize: "3rem",
    textTransform: "uppercase",
    textAlign: "center",
    backgroundColor: "#374151",
    padding: "1.6rem 0",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  messagesInnerContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "3rem 2rem 1rem",
    flex: "1",
    maxHeight: "58vh",
    minHeight: "58vh",
    overflow: "auto",
  },
  message: {
    backgroundColor: "#ffffff",
    borderRadius: "5px",
    padding: ".8rem 2rem",
    fontSize: "1.6rem",
    display: "inline-block",
  },
  messageBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1.6rem",
    gap: "1.5rem",
  },
  leftMessage: {
    alignSelf: "flex-start",
  },
  rightMessage: {
    alignSelf: "flex-end",
  },
  timestamp: { fontSize: "1.2rem", display: "block", color: "#777777" },
  inputContainer: {
    display: "flex",
    marginBottom: "20px",
  },
  input: {
    flex: "1",
    marginRight: "1.5rem",
    padding: "1.4rem 2.4rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
    fontSize: "1.8rem",
  },
  button: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#374151",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "1.6rem",
    padding: "0 2.5rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#6d7787",
    },
  },
  sendIcon: {
    marginRight: "5px",
  },
  image: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
  },
});

export default AdvertiserAssistance;
