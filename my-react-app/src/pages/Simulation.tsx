import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { Scenario, AiPersonality } from "@shared/schema";
// import { scenarios as fallbackScenarios, aiPersonalities as fallbackAiPersonalities } from "@/lib/data";
import AiProfileBar from "@/components/AiProfileBar.tsx";
import VoiceMode from "@/components/VoiceMode.tsx";
import TextMode from "@/components/TextMode.tsx";
import { Skeleton } from "@/components/ui/skeleton";
import { getScenario } from '@/api.ts';
import { CoachonCueScenarioAttributes } from "@/lib/schema";

type InteractionMode = "voice" | "text";

export default function Simulation() {
  const navigate = useNavigate();

  const { id } = useParams();
  const scenarioId = id ? parseInt(id) : 1;

  const [isLoading, setIsLoading] = useState(true);
  const [scenario, setScenario] = useState<CoachonCueScenarioAttributes | undefined>(undefined);

  const [interactionMode, setInteractionMode] = useState<InteractionMode>("text");
  const [messages, setMessages] = useState<Array<{sender: string, content: string}>>([]);

  // Fetch scenario data
  useEffect(() => {
    const token = localStorage.getItem('jwtToken') as string;
    const fetchScenario = async () => {
      try {
        setScenario(await getScenario(scenarioId, token));
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchScenario();
  }, []);


  // Fetch AI personality for this scenario
  // const {
  //   data: aiPersonalities,
  //   isLoading: isLoadingPersonality,
  //   error: personalityError
  // } = useQuery<AiPersonality[]>({
  //   queryKey: [`/api/ai-personalities/scenario/${scenarioId}`],
  //   enabled: !!scenarioId, // Only run this query if we have a scenario ID
  // });

  // const scenario = scenarios?.find(s => s.id === scenarioId) ||
  //   fallbackScenarios.find(s => s.id === scenarioId);

  // const aiPersonality = aiPersonalities?.[0] ||
  //   fallbackAiPersonalities.find(ai => ai.scenarioId === scenarioId);

  // const isLoading = isLoadingScenarios || isLoadingPersonality;

  useEffect(() => {
    // Initialize with system message
    // if (scenario && aiPersonality) {
    if (scenario) {
      setMessages([
        {
          sender: "system",
          // content: `Simulation started. You're having a ${scenario.scenarioType} with ${aiPersonality.role.toLowerCase()} ${aiPersonality.name}.`
          content: `Simulation started. You're having a ${scenario.scenarioType}.`,
        }
      ]);
    }
  }, [scenario]);
  // }, [scenario, aiPersonality]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const newMessages = [...messages, { sender: "user", content }];
    setMessages(newMessages);

    // Simulate AI response (would be replaced with API call)
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          sender: "ai",
          content: "This is a placeholder for the AI response. In the real implementation, this would come from the API."
        }
      ]);
    }, 1500);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto min-h-screen flex flex-col">
        <header className="py-4 px-4 bg-white border-b border-neutral-200 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/browse")}
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-center flex-1">AI Practice Simulation</h1>
            <div className="w-6"></div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-48 w-full rounded-md" />
            <Skeleton className="h-48 w-full rounded-md" />
          </div>
        </main>
      </div>
    );
  }

  // Show error state if data is missing
  // if (!scenario || !aiPersonality) {
  if (!scenario) {
    return (
      <div className="max-w-4xl mx-auto min-h-screen flex flex-col p-4">
        <button
          onClick={() => navigate("/browse")}
          className="text-neutral-600 hover:text-neutral-900 transition-colors self-start mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>
        <div className="text-red-500 text-center font-medium">Scenario not found or failed to load</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto min-h-screen flex flex-col">
      <header className="py-4 px-4 bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/browse")}
            className="text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-center flex-1">AI Practice Simulation</h1>
          <button className="text-neutral-600 hover:text-neutral-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        <AiProfileBar
          aiPersonality={scenario.persona}
          interactionMode={interactionMode}
          onModeChange={setInteractionMode}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {interactionMode === "voice" ? (
            <VoiceMode
              aiPersonality={scenario.persona}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <TextMode
              messages={messages}
              aiPersonality={scenario.persona}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </main>
    </div>
  );
}
