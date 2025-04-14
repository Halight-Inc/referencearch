import { JSX } from "react";
import { CoachonCueScenarioAttributes } from '@/lib/schema.ts';

interface ScenarioCardProps {
  scenario: CoachonCueScenarioAttributes;
  onClick: () => void;
}

const iconMap: Record<string, JSX.Element> = {
  "user-voice": (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  ),
  "store": (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-store">
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
    </svg>
  ),
  "discuss": (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  "team": (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
};

export default function ScenarioCard({ scenario, onClick }: ScenarioCardProps) {
  return (
    <div 
      className="bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {/* {iconMap[scenario.iconName] || ( */}
            {iconMap['user-voice'] || (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            )}
          </div>
          {/* <h3 className="ml-3 font-medium">{scenario.title}</h3> */}
          <h3 style={{
              fontSize: '16px',
          }} className="ml-3 font-medium">{scenario.scenarioType}</h3>
        </div>
        <p className="text-sm text-neutral-600 mb-3">{scenario.keyTopics && scenario.keyTopics.length > 0 ? scenario.keyTopics.join(', ') : ''}</p>
        <div className="flex items-center text-sm text-neutral-500">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock mr-1">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {/* {scenario.duration} */}
              ~10 min
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star mr-1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {/* {scenario.level} */}
              Intermediate
          </span>
        </div>
      </div>
    </div>
  );
}
