// import { AiPersonality } from "@shared/schema";
import { CoachonCueScenarioAttributes } from '@/lib/schema.ts';

interface AiProfileBarProps {
  aiPersonality: CoachonCueScenarioAttributes['persona'];
  interactionMode: "voice" | "text";
  onModeChange: (mode: "voice" | "text") => void;
}

export default function AiProfileBar({ 
  aiPersonality, 
  interactionMode, 
  onModeChange 
}: AiProfileBarProps) {
  return (
    <div className="bg-white border-b border-neutral-200 p-3 flex items-center">
      <div className="flex items-center">
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              // src={aiPersonality.avatarUrl}
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
              alt={`${aiPersonality.name} avatar`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-white">
            {interactionMode === "voice" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="text-[10px]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="text-[10px]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            )}
          </div>
        </div>
        <div className="ml-3">
          <div className="font-medium text-sm">{aiPersonality.name}</div>
          <div className="text-xs text-neutral-500">{aiPersonality.role}</div>
        </div>
      </div>
      
      <div className="ml-auto flex items-center bg-neutral-100 rounded-full p-1">
        <button 
          onClick={() => onModeChange("text")}
          className={`py-1 px-3 text-xs rounded-full transition-colors ${
            interactionMode === "text" ? "bg-primary text-white" : ""
          }`}
          aria-pressed={interactionMode === "text"}
        >
          Text
        </button>
        <button 
          onClick={() => onModeChange("voice")}
          className={`py-1 px-3 text-xs rounded-full transition-colors ${
            interactionMode === "voice" ? "bg-primary text-white" : ""
          }`}
          aria-pressed={interactionMode === "voice"}
        >
          Voice
        </button>
      </div>
    </div>
  );
}
