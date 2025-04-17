import { useState, useRef, useEffect } from "react";
// import { AiPersonality } from "@shared/schema";
import { CoachonCueScenarioAttributes } from '@/lib/schema.ts';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '@/lib/schema.ts';

interface TextModeProps {
  messages: Array<ChatMessage>;
  // aiPersonality: AiPersonality;
  aiPersonality: CoachonCueScenarioAttributes['persona'];
  onSendMessage: (message: string) => void;
  isAiLoading: boolean;
}

export default function TextMode({
  messages,
  aiPersonality,
  onSendMessage,
  isAiLoading,
}: TextModeProps) {
  const [inputValue, setInputValue] = useState("");
  // const [isAiTyping, setIsAiTyping] = useState(false);
  // const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling

  const fallbackAvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200";
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    // if (chatContainerRef.current) {
    //   chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    // }
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
      
      // // Simulate AI typing indicator
      // setIsAiTyping(true);
      // setTimeout(() => {
      //   setIsAiTyping(false);
      // }, 1500);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div 
        // ref={chatContainerRef}
        className="chat-container flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message, index) => {
          if (message.sender === "system") {
            return (
              <div 
                key={index}
                className="bg-neutral-100 text-neutral-600 text-sm py-2 px-3 rounded-md mx-auto max-w-xs text-center fade-in"
              >{message.text}</div>
            );
          } else if (message.sender === "user") {
            return (
              <div key={index} className="flex items-start flex-row-reverse mb-4 fade-in">
                <div className="bg-primary text-white rounded-lg rounded-tr-none py-2 px-3 max-w-[80%]">
                  <p className="text-sm m-0">{message.text}</p>
                </div>
              </div>
            );
          } else {
            return (
              <div key={index} className="flex items-start mb-4 fade-in">
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img 
                    src={aiPersonality.avatarUrl || fallbackAvatarUrl}
                    alt={`${aiPersonality.name} avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white border border-neutral-200 rounded-lg rounded-tl-none py-2 px-3 max-w-[80%] shadow-sm">
                  <p className="text-sm m-0">
                    <ReactMarkdown>
                      {message.text}
                    </ReactMarkdown>
                  </p>
                </div>
              </div>
            );
          }
        })}
        
        {isAiLoading && (
          <div className="flex items-start mb-4 fade-in">
            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mr-2">
              <img
                src={aiPersonality.avatarUrl || fallbackAvatarUrl}
                alt={`${aiPersonality.name} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg rounded-tl-none py-2 px-3 inline-flex space-x-1">
              <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
              <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
            </div>
          </div>
        )}
      </div>
      
      <div ref={messagesEndRef} className="p-3 border-t border-neutral-200 bg-white">
        <form className="flex items-center" onSubmit={handleSubmit}>
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="w-full py-2 px-3 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="ml-2 flex-shrink-0 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
