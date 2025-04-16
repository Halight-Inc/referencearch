import { useEffect, useState } from "react";
// import { CoachonCueScenarioAttributes } from "@/lib/schema";
import { cn } from "@/lib/utils";

interface SimulationBuilderProps {
  // scenario: CoachonCueScenarioAttributes;
  // aiPersonality: CoachonCueScenarioAttributes['persona'];
  onComplete: () => void;
}

export default function SimulationBuilder({
  // scenario,
  // aiPersonality,
  onComplete,
}: SimulationBuilderProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Initializing environment...",
    `Preparing...`,
    `Loading personal profile...`,
    "Building scenario context...",
    "Configuring AI personality...",
    "Finalizing simulation..."
  ];

  useEffect(() => {
    // Simulate the building process with increasing progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 500); // Short delay before completing
          return 100;
        }
        return prev + 2; // Increment by 2% each time
      });
    }, 70); // Update every 70ms for smooth animation

    // Update the current step based on progress
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = Math.min(prev + 1, steps.length - 1);
        if (nextStep === steps.length - 1) {
          clearInterval(stepInterval);
        }
        return nextStep;
      });
    }, 1000); // Change step message every second

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [onComplete, steps.length]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 z-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
            >
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-semibold">Building Your Simulation</h2>
        <p className="text-neutral-500 mb-4">
          We're personalizing this experience for you
        </p>

        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="h-6 mt-2">
          <p className="text-sm text-neutral-600">{steps[currentStep]}</p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-start space-x-3">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center",
              progress >= 30 ? "bg-primary text-white" : "bg-neutral-200"
            )}>
              {progress >= 30 && (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">Scenario Setup</p>
              <p className="text-xs text-neutral-500">Preparing your learning environment</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center",
              progress >= 60 ? "bg-primary text-white" : "bg-neutral-200"
            )}>
              {progress >= 60 && (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">AI Personality</p>
              <p className="text-xs text-neutral-500">Configuring AI behavior and knowledge</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center",
              progress >= 90 ? "bg-primary text-white" : "bg-neutral-200"
            )}>
              {progress >= 90 && (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">Final Preparations</p>
              <p className="text-xs text-neutral-500">Setting up your interaction environment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <p className="text-xs text-neutral-400">
          {progress < 100 ? "Please wait while we build your simulation..." : "Ready!"}
        </p>
      </div>
    </div>
  );
}
