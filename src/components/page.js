"use client"

import { useState, useEffect } from "react"
import io from "socket.io-client"
import "../style/global.css"

const socket = io("http://localhost:5000")

export default function ChatApp() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [username, setUsername] = useState(localStorage.getItem("username") || "")

  useEffect(() => {
    fetch("http://localhost:5000/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data.reverse()))

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]) // Append instead of replacing
    })

    return () => socket.off("message")
  }, [])

  const sendMessage = (e) => {
    e.preventDefault()
    if (inputMessage && username) {
      socket.emit("sendMessage", { content: inputMessage, sender: username })
      setInputMessage("")
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h1>Chat App</h1>
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === username ? "sent" : "received"}`}
            >
              <strong>{message.sender}: </strong>
              {message.content}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="message-form">
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              localStorage.setItem("username", e.target.value)
            }}
            placeholder="Your name"
            className="name-input"
          />
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message"
            className="message-input"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
    </div>
  )
}
