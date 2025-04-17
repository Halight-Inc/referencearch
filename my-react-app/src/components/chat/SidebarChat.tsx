// filepath: c:\code\referencearch\my-react-app\src\components\chat\SidebarChat.tsx
import React, { useState, useEffect, useRef } from 'react'; // Added useEffect and useRef
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // Import react-markdown
const API_URL = import.meta.env.VITE_API_URL;

import './SidebarChat.css';

// Define a type for chat messages for better structure
interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

const SidebarChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [token] = useState(localStorage.getItem("jwtToken") || "");
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling

  // Function to scroll to the bottom of the chat messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessageText = input.trim();
    if (!userMessageText || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: userMessageText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const request = {
        "systemContext": "you are a helpful assistant, respond in markdown format", // Updated context
        "prompt": userMessageText,
        "sessionId": "chat-session-123", // Manage session IDs properly
        "agentType": "bedrock"
      };

      const response = await axios.post<{ sessionId: string; completion: string }>(
        `${API_URL}/v1/ai/run-prompt`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log("API Response:", response);

      if (response.data && response.data.completion) {
        const aiMessage: ChatMessage = { sender: 'ai', text: response.data.completion };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } else {
        console.error("Invalid response structure:", response.data);
        const errorMessage: ChatMessage = { sender: 'ai', text: "Sorry, I couldn't get a response." };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = { sender: 'ai', text: "Sorry, something went wrong." };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sidebar-chat">
      <div className="chat-header">
        <h2>Chat</h2>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender}`}>
            {/* Conditionally render using ReactMarkdown for AI messages */}
            {message.sender === 'ai' ? (
              <ReactMarkdown>{message.text}</ReactMarkdown>
            ) : (
              message.text // Render user text directly
            )}
          </div>
        ))}
        {/* Add a div at the end to scroll to */}
        <div ref={messagesEndRef} />
        {isLoading && <div className="chat-message ai">Thinking...</div>}
      </div>
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

export default SidebarChat;
