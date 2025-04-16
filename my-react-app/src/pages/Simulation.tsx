import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { Scenario, AiPersonality } from "@shared/schema";
// import { scenarios as fallbackScenarios, aiPersonalities as fallbackAiPersonalities } from "@/lib/data";
import AiProfileBar from "@/components/AiProfileBar.tsx";
import VoiceMode from "@/components/VoiceMode.tsx";
import TextMode from "@/components/TextMode.tsx";
// import { Skeleton } from "@/components/ui/skeleton";
import { getScenario, getSimulationById } from '@/api.ts';
import { CoachonCueScenarioAttributes } from "@/lib/schema";
import axios from 'axios';
import SimulationBuilder from "@/components/SimulationBuilder";
import ScenarioContext from "@/components/ScenarioContext";

const API_URL = import.meta.env.VITE_API_URL;

type InteractionMode = "voice" | "text";

export interface ChatMessage {
  sender: 'user' | 'ai' | 'system';
  text: string;
}

export default function Simulation() {
  const navigate = useNavigate();

  const { id } = useParams();
  const simulationId = id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [scenario, setScenario] = useState<CoachonCueScenarioAttributes | undefined>(undefined);

  const [interactionMode, setInteractionMode] = useState<InteractionMode>("text");
  const [isBuilding, setIsBuilding] = useState(true);
  const [isContextShown, setIsContextShown] = useState(true);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const token = localStorage.getItem('jwtToken') as string;

  // Fetch scenario data
  useEffect(() => {
    const fetchScenario = async () => {
      try {
        var result = await getSimulationById(simulationId, token);
        const scenarioId = result.scenarioId as string;
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
    // Reset building state when scenario changes
    setIsBuilding(true);
    setIsContextShown(true);
  }, [simulationId]);

  useEffect(() => {
    // Initialize with system message
    // if (scenario && aiPersonality) {
    if (scenario) {
      setMessages([
        {
          sender: "system",
          // content: `Simulation started. You're having a ${scenario.scenarioType} with ${aiPersonality.role.toLowerCase()} ${aiPersonality.name}.`
          text: `Simulation started. You're having a ${scenario.scenarioType}.`,
        }
      ]);
    }
  }, [scenario, isBuilding, isContextShown]);
  // }, [scenario, aiPersonality]);

  const handleSendMessage = async (userMessageText: string) => {
    // Add user message
    // const newMessages = [...messages, { sender: "user", content }];
    // setMessages(newMessages);

    // Simulate AI response (would be replaced with API call)
    // setTimeout(() => {
    //   setMessages([
    //     ...newMessages,
    //     {
    //       sender: "ai",
    //       content: "This is a placeholder for the AI response. In the real implementation, this would come from the API."
    //     }
    //   ]);
    // }, 1500);

    // e.preventDefault();
    // const userMessageText = content.trim();
    if (!userMessageText || isAiLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: userMessageText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    // setInput('');
    setIsAiLoading(true);

    const coachingSystemPrompt = `
AI Coaching Simulation Prompt

You are simulating a persona in a real-world 1 on 1 meeting between a manager (the AI Persona) and an employee (the user).
Stay in character based on the profile below. Your role is to challenge, support, and guide the user based on the coaching framework and the scenario’s goals, while reinforcing the key competencies.

In this 1 on 1 context, the user (employee) wants to practice discussing performance, sharing updates, and exploring professional goals with their manager (you, the AI Persona). You should provide realistic managerial perspectives, convey feedback, and respond authentically according to the persona’s role and personality traits. The user will be evaluated on their ability to conduct themselves effectively in a one-on-one setting and apply the coaching framework.

Persona Profile
Name: Jordan Smith
Role: Senior Product Manager
Disposition: Straightforward, supportive, and quick to get to the point
Communication Style: Encouraging and factual, offering direct guidance
Emotional State: Balanced, slightly busy but engaged
Background: Jordan has led multiple product teams across the organization for the past 6 years. Known for setting clear expectations, providing timely feedback, and focusing heavily on professional growth for team members.

Scenario Overview
Scenario Type: Performance Review
Key Topics:
- Setting realistic performance targets
- Addressing skill gaps
- Discussing upcoming project challenges

This session should mirror a typical one-on-one meeting where you, as the manager, will:
- Listen to the user’s (employee’s) updates and challenges
- Provide feedback and support
- Encourage professional development and growth
- Ensure clarity around objectives and expectations

Guidelines:
- Keep the conversation constructive
- Encourage the employee to be introspective
- Provide specific feedback with actionable steps

Use this scenario to realistically showcase how the manager might respond to questions, guide discussions, and help navigate the employee’s concerns and aspirations.

Coaching Framework
Name: GROW
Description: The GROW model (Goal, Reality, Options, and Will) is used to clarify objectives, assess the current situation, explore multiple approaches, and commit to action.

This Interaction Should Reinforce the Following Competencies & Goals:
- Active Listening
- Clear Goal Setting
- Accountability for Deliverables
- Collaboration

Emphasize these competencies and goals throughout the one-on-one. If the user fails to address or apply these effectively, you may express realistic managerial pushback, requests for clarification, or offer alternative suggestions.

Supporting Materials:
- Past monthly performance stats
- Project timeline and deliverables

AI Persona Instructions:
- Act like Jordan Smith at all times.
- Use a tone that reflects someone who is straightforward, supportive, and quick to get to the point.
- Communicate in an encouraging and factual style.
- Keep responses short, sharp, and realistic, just like a manager in a one-on-one.

If the user fails to:
- Show Active Listening
- Set Clear Goals
- Show Accountability for Deliverables
- Collaborate

→ give managerial-level feedback or pushback.

Use the GROW model to guide your approach, and keep the focus on realistic one-on-one meeting dynamics.
        `.trim();

    try {
      const request = {
        "systemContext": coachingSystemPrompt, // Updated context
        "prompt": userMessageText,
        // send something like the jwt, base encode it (Buffer?) - try gemini
        "sessionId": simulationId, // Manage session IDs properly
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
      setIsAiLoading(false);
    }
  };

  const handleBuildComplete = () => {
    setIsBuilding(false);
  };

  const handleSelectMode = (mode: "voice" | "text") => {
    setInteractionMode(mode);
    setIsContextShown(false);
  };

  // Handle ending the scenario and going to results
  const handleEndScenario = async () => {
    // In a real implementation, you would save the conversation to the server
    // before navigating to the results page
    if (scenario) {

      const coachingSystemPrompt = `
      AI Coaching Simulation Prompt
      
      You are simulating a persona in a real-world 1 on 1 meeting between a manager (the AI Persona) and an employee (the user).
      Stay in character based on the profile below. Your role is to challenge, support, and guide the user based on the coaching framework and the scenario’s goals, while reinforcing the key competencies.
      
      In this 1 on 1 context, the user (employee) wants to practice discussing performance, sharing updates, and exploring professional goals with their manager (you, the AI Persona). You should provide realistic managerial perspectives, convey feedback, and respond authentically according to the persona’s role and personality traits. The user will be evaluated on their ability to conduct themselves effectively in a one-on-one setting and apply the coaching framework.
      
      Persona Profile
      Name: Jordan Smith
      Role: Senior Product Manager
      Disposition: Straightforward, supportive, and quick to get to the point
      Communication Style: Encouraging and factual, offering direct guidance
      Emotional State: Balanced, slightly busy but engaged
      Background: Jordan has led multiple product teams across the organization for the past 6 years. Known for setting clear expectations, providing timely feedback, and focusing heavily on professional growth for team members.
      
      Scenario Overview
      Scenario Type: Performance Review
      Key Topics:
      - Setting realistic performance targets
      - Addressing skill gaps
      - Discussing upcoming project challenges
      
      This session should mirror a typical one-on-one meeting where you, as the manager, will:
      - Listen to the user’s (employee’s) updates and challenges
      - Provide feedback and support
      - Encourage professional development and growth
      - Ensure clarity around objectives and expectations
      
      Guidelines:
      - Keep the conversation constructive
      - Encourage the employee to be introspective
      - Provide specific feedback with actionable steps
      
      Use this scenario to realistically showcase how the manager might respond to questions, guide discussions, and help navigate the employee’s concerns and aspirations.
      
      Coaching Framework
      Name: GROW
      Description: The GROW model (Goal, Reality, Options, and Will) is used to clarify objectives, assess the current situation, explore multiple approaches, and commit to action.
      
      This Interaction Should Reinforce the Following Competencies & Goals:
      - Active Listening
      - Clear Goal Setting
      - Accountability for Deliverables
      - Collaboration
      
      Emphasize these competencies and goals throughout the one-on-one. If the user fails to address or apply these effectively, you may express realistic managerial pushback, requests for clarification, or offer alternative suggestions.
      
      Supporting Materials:
      - Past monthly performance stats
      - Project timeline and deliverables
      
      AI Persona Instructions:
      - Act like Jordan Smith at all times.
      - Use a tone that reflects someone who is straightforward, supportive, and quick to get to the point.
      - Communicate in an encouraging and factual style.
      - Keep responses short, sharp, and realistic, just like a manager in a one-on-one.
      
      If the user fails to:
      - Show Active Listening
      - Set Clear Goals
      - Show Accountability for Deliverables
      - Collaborate
      
      → give managerial-level feedback or pushback.
      
      Use the GROW model to guide your approach, and keep the focus on realistic one-on-one meeting dynamics.
              `.trim();

      try {
        const request = {
          "systemContext": coachingSystemPrompt, // Updated context
          "prompt": "",
          // send something like the jwt, base encode it (Buffer?) - try gemini
          "sessionId": simulationId, // Manage session IDs properly
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

          console.log(response.data.completion)

        } else {
          console.error("Invalid response structure:", response.data);
        }
      }
      catch (error) {
        console.error('Error sending message:', error);
      }

      // Save conversation to the server (if needed)
      // await saveConversationToServer(messages, simulationId);

      navigate(`/results/${simulationId}`);
    }
  };

  if (isLoading || isBuilding) {
    return (
      <SimulationBuilder
        // scenario={scenario}
        // aiPersonality={scenario.persona}
        onComplete={handleBuildComplete}
      />
    );
  }

  if (isContextShown && scenario) {
    return (
      <ScenarioContext
        scenario={scenario}
        aiPersonality={scenario.persona}
        onSelectMode={handleSelectMode}
      />
    );
  }

  if (!scenario) {
    return (
      <div className="max-w-4xl mx-auto min-h-screen flex flex-col p-4">
        <button
          onClick={() => navigate("/")}
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
            onClick={() => navigate("/")}
            className="text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-center flex-1">AI Practice Simulation</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleEndScenario}
              className="py-1.5 px-3 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-lg transition-colors"
            >
              End Scenario
            </button>
            <button
              onClick={() => setIsContextShown(true)}
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        <AiProfileBar
          aiPersonality={scenario.persona}
          interactionMode={interactionMode}
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
              isAiLoading={isAiLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
}
