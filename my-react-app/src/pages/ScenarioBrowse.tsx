import { useEffect, useState } from 'react';
import ScenarioCard from "@/components/ScenarioCard.tsx";
import ScenarioCardSkeleton from "@/components/ScenarioCardSkeleton.tsx";
import { getAllScenarios } from '@/api';
import { CoachonCueScenarioAttributes } from '@/lib/schema.ts';

export default function ScenarioBrowse() {
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
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            </div>
            <h1 className="text-xl font-semibold">CoachOnCue</h1>
          </div>
          {/* <div className="hidden md:flex space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
              Templates
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>
              Help
            </Button>
          </div> */}
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
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
