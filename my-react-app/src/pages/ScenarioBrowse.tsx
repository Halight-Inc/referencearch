import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import ScenarioCard from "@/components/ScenarioCard.tsx";
import ScenarioCardSkeleton from "@/components/ScenarioCardSkeleton.tsx";
import { getAllScenarios } from '@/api';
import { CoachonCueScenarioAttributes } from '@/lib/schema.ts';

export default function ScenarioBrowse() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [scenarios, setScenarios] = useState<Array<CoachonCueScenarioAttributes>>([]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken') as string;
    const fetchScenarios = async () => {
      try {
        setScenarios(await getAllScenarios(token));
      } catch (error) {
        console.error('Error fetching scenarios:', error);
        // @ts-ignore
        if (('response' in error) && error.response && ('status' in error.response) && error.response.status === 403) {
          // probably an invalid token, so just remove it and redirect to login
          localStorage.removeItem('jwtToken');
          window.location.href = '/'; // Redirect to the root path
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchScenarios();
  }, []);

  return (
    <div className="max-w-4xl mx-auto min-h-screen flex flex-col">
      <header className="py-4 px-4 bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="w-8"></div> {/* Spacer for alignment */}
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

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Select a Simulation Scenario</h2>
          <p className="text-neutral-500">Choose a scenario to practice your skills with an AI personality.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            // Show skeleton cards while loading
            Array.from({ length: 4 }).map((_, index) => (
              <ScenarioCardSkeleton key={index} />
            ))
          ) : scenarios && scenarios.length > 0 && (
            // Show actual scenarios if available
            scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onClick={() => navigate(`/simulation/${scenario.id}`)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
