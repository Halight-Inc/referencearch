// filepath: c:\code\referencearch\my-react-app\src\components\chat\SidebarChat.tsx
import React, { useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

import './SidebarChat.css';

// Define a type for chat messages for better structure
interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

const SidebarChat: React.FC = () => {
  // Update state to hold ChatMessage objects
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [token] = useState(localStorage.getItem("jwtToken") || "");
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Optional: Add loading state

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessageText = input.trim();
    if (!userMessageText || isLoading) return; // Prevent sending empty messages or during loading

    // Add user's message immediately
    const userMessage: ChatMessage = { sender: 'user', text: userMessageText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput(''); // Clear input field
    setIsLoading(true); // Set loading state

    try {
      // Hardcoded request for now, consider making sessionId dynamic
      const request = {
        "systemContext": "you are a helpful assistant", // Example context
        "prompt": userMessageText, // Use the actual user input
        "sessionId": "chat-session-123", // Generate or manage session IDs properly
        "agentType": "azure"
      };

      const response = await axios.post<{ sessionId: string; completion: string }>(
        `${API_URL}/v1/ai/run-prompt`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' // Good practice to set Content-Type
          },
        }
      );

      console.log("API Response:", response);

      if (response.data && response.data.completion) {
        // Add AI's response
        const aiMessage: ChatMessage = { sender: 'ai', text: response.data.completion };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } else {
        console.error("Invalid response structure:", response.data);
        // Optionally add an error message to the chat
        const errorMessage: ChatMessage = { sender: 'ai', text: "Sorry, I couldn't get a response." };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally add an error message to the chat
      const errorMessage: ChatMessage = { sender: 'ai', text: "Sorry, something went wrong." };
      // Use functional update to ensure you're updating based on the latest state
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="sidebar-chat">
      <div className="chat-header">
        <h2>Chat</h2>
      </div>
      <div className="chat-messages">
        {/* Update map to handle ChatMessage objects */}
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender}`}>
            {/* Optionally add sender label or style differently */}
            {/* <strong>{message.sender === 'user' ? 'You' : 'AI'}:</strong> */}
            {message.text}
          </div>
        ))}
        {isLoading && <div className="chat-message ai">Thinking...</div>} {/* Show loading indicator */}
      </div>
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading} // Disable input while loading
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

export default SidebarChat;
