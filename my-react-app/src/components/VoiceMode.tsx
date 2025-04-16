import { useState } from "react";
// import { AiPersonality } from "@shared/schema";
import { CoachonCueScenarioAttributes } from '@/lib/schema.ts';

interface VoiceModeProps {
  // aiPersonality: AiPersonality;
  aiPersonality: CoachonCueScenarioAttributes['persona'];
  onSendMessage: (message: string) => void;
}

export default function VoiceMode({ aiPersonality, onSendMessage }: VoiceModeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(true);
  // const [progress, setProgress] = useState(66); // Mock progress for UI demonstration
  const progress = 66;

  const toggleRecording = () => {
    const newRecordingState = !isRecording;
    setIsRecording(newRecordingState);
    
    if (!newRecordingState) {
      // Simulate sending a voice message when recording stops
      onSendMessage("Voice message placeholder");
      
      // Simulate AI speaking in response
      setAiSpeaking(true);
      setTimeout(() => {
        setAiSpeaking(false);
      }, 3000);
    }
  };

  const fallbackAvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200";

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
          <img 
            src={aiPersonality.avatarUrl || fallbackAvatarUrl}
            alt={`${aiPersonality.name} avatar`}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-medium mb-1">{aiPersonality.name}</h3>
        <p className="text-neutral-500 text-sm mb-4">{aiPersonality.role}</p>
        
        <div className="text-neutral-600 mb-8">
          {aiSpeaking && (
            <>
              <div className="mb-2">AI is speaking...</div>
              <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </>
          )}
        </div>
        
        <button 
          onClick={toggleRecording}
          className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-md cursor-pointer ${
            isRecording 
              ? "bg-red-500" 
              : "bg-primary pulse"
          }`}
        >
          {isRecording ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <rect width="4" height="16" x="6" y="4" rx="1" />
              <rect width="4" height="16" x="14" y="4" rx="1" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          )}
        </button>
        <p className="text-sm text-neutral-500 mt-3">
          {isRecording ? "Tap to stop" : "Tap to speak"}
        </p>
      </div>
    </div>
  );
}
