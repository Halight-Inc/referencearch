import { CoachonCueScenarioAttributes } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mic } from "lucide-react";

interface ScenarioContextProps {
  scenario: CoachonCueScenarioAttributes;
  aiPersonality: CoachonCueScenarioAttributes['persona'];
  onSelectMode: (mode: "voice" | "text") => void;
}

export default function ScenarioContext({ 
  scenario, 
  aiPersonality, 
  onSelectMode 
}: ScenarioContextProps) {
  return (
    <div className="max-w-4xl mx-auto min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col p-6 items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-blue-600"
                >
                  <path d="M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1" />
                  <path d="M2 13h10" />
                  <path d="M5 13v-3" />
                  <path d="M9 13v-3" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">{scenario.scenarioType}</h2>
                <div className="text-sm text-neutral-500">AI Simulation</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Scenario Context</h3>
              <p className="text-neutral-600">
                {scenario.keyTopics && scenario.keyTopics.length > 0 ? scenario.keyTopics.join(', ') : ''}
              </p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-2">Your AI Conversation Partner</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-medium">
                    {aiPersonality.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{aiPersonality.name}</div>
                  <div className="text-sm text-neutral-500">{aiPersonality.role}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-neutral-600">
                {/* {aiPersonality.description} */}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium mb-3">How would you like to communicate?</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => onSelectMode("text")}
                  variant="outline"
                  className="h-14 border-2 border-neutral-200 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Text</span>
                </Button>
                <Button
                  onClick={() => onSelectMode("voice")}
                  variant="outline"
                  className="h-14 border-2 border-neutral-200 flex items-center justify-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  <span>Voice</span>
                </Button>
              </div>
            </div>

            <div className="text-xs text-center text-neutral-500">
              Choose your preferred communication method.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
