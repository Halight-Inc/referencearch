import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CoachonCueScenarioAttributes } from '@/lib/schema.ts';
import { useNavigate } from 'react-router-dom';
import { Simulation } from '@/lib/schema'; // Import Simulation type
// Import createSimulation and Simulation type
import { getSimulations, createSimulation } from '@/api';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast"; // Import useToast for feedback

interface SimulationDrawerProps {
  scenario: CoachonCueScenarioAttributes;
  children: React.ReactNode;
}

export default function SimulationDrawer({
  scenario,
  children
}: SimulationDrawerProps) {
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize toast
  const [open, setOpen] = useState(false);
  // Use the imported Simulation type for historyItems state
  const [historyItems, setHistoryItems] = useState<Simulation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false); // Specific loading state for history
  const [isLoadingLaunch, setIsLoadingLaunch] = useState(false); // Specific loading state for launch button
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('jwtToken');

  // Fetch simulation history when the drawer opens or scenario changes
  useEffect(() => {
    // Only fetch if the drawer is open, we have a scenario ID, and a token
    if (open && scenario.id && token) {
      const fetchHistory = async () => {
        setIsLoadingHistory(true); // Use history loading state
        setError(null);
        try {
          // Call the API function, passing the token and scenario ID
          const simulations = await getSimulations(token, scenario.id);
          setHistoryItems(simulations);
        } catch (err) {
          console.error("Error fetching simulation history:", err);
          setError("Failed to load simulation history. Please try again.");
          setHistoryItems([]); // Clear history on error
        } finally {
          setIsLoadingHistory(false); // Use history loading state
        }
      };

      void fetchHistory(); // Execute the async function
    } else {
      // Reset state if drawer is closed or prerequisites aren't met
      setHistoryItems([]);
      setError(null);
    }
    // Dependencies: Re-run effect if 'open', 'scenario.id', or 'token' changes
  }, [open, scenario.id, token]);

  // Helper function to determine status based on score (example logic)
  // const getStatus = (score: string): string => {
  //   const numericScore = parseInt(score, 10);
  //   if (isNaN(numericScore)) return "Unknown";
  //   // Adjust the threshold as needed
  //   return numericScore >= 80 ? "Passed" : "Needs Improvement";
  // };

  // Helper function to format date string
  const formatDate = (dateString: string): string => {
    try {
      // Example format: Feb 12, 2025, 12:32 PM
      return format(new Date(dateString), "MMM d, yyyy, h:mm a");
    } catch {
      // Fallback for invalid date strings
      return "Invalid Date";
    }
  };

  // --- Handler for Launch Simulation Button ---
  const handleLaunchSimulation = async () => {
    // Ensure we have necessary data
    if (!scenario.id || !token) {
      toast({
        title: "Error",
        description: "Cannot launch simulation. Missing scenario ID or authentication.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingLaunch(true); // Indicate loading state for the button
    try {
      // Call the API to create a new simulation record
      // The backend should associate the current user based on the token
      const newSimulation = await createSimulation({ scenarioId: scenario.id } as Simulation, token);

      // Check if we got a valid simulation ID back
      if (newSimulation && newSimulation.id) {
        // Navigate to the simulation page using the NEW simulation ID
        navigate(`/simulation/${newSimulation.id}`);
        setOpen(false); // Close the drawer on successful navigation
      } else {
        // Handle case where API might not return the expected object
        throw new Error("Invalid response received after creating simulation.");
      }

    } catch (err) {
      console.error("Error creating simulation:", err);
      toast({
        title: "Failed to Start Simulation",
        // Provide a more specific message if possible from the error (err.message)
        description: "Could not create a new simulation record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLaunch(false); // Reset loading state regardless of success/failure
    }
  };
  // --- End Handler ---

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto flex flex-col px-4">
        {/* Content Area */}
        <div className="flex-1 py-4">
          {/* Scenario Info */}
          <h2 className="text-lg font-semibold">{scenario.scenarioType}</h2>
          {/* Placeholder for duration/attempts - requires data */}
          {/* <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
            <div>1h</div>
            <div>15</div>
          </div> */}

          <Separator className="my-4" />

          <h3 className="text-base font-medium mb-4">History</h3>

          {/* Loading State for History */}
          {isLoadingHistory && ( // Use specific loading state
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          )}

          {/* Error State */}
          {error && !isLoadingHistory && ( // Check specific loading state
            <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {/* History Items List */}
          {!isLoadingHistory && !error && historyItems.length > 0 && ( // Check specific loading state
            <div className="space-y-3">
              {historyItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-neutral-50 p-3 rounded-md border border-neutral-200">
                  <div>
                    {/* <div className="font-medium">{item.simulationResult.generalFeedback}</div> */}
                    <div className="text-xs text-neutral-500">{formatDate(item.createdAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{item.status}</div>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent sheet from closing if clicked inside trigger
                        // Navigate to the results page using the specific simulation ID
                        navigate(`/results/${item.id}`); // Use item.id (simulation ID)
                        setOpen(false); // Close the drawer on navigation
                      }}
                    >
                      View Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No History State */}
          {!isLoadingHistory && !error && historyItems.length === 0 && ( // Check specific loading state
             <div className="text-center text-sm text-neutral-500 py-6">
               No simulation history found for this scenario.
             </div>
          )}
        </div>

        {/* Footer */}
        <SheetFooter className="pt-2 pb-4 mt-auto border-t border-neutral-200">
          <Button
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium"
            onClick={handleLaunchSimulation} // Use the new async handler
            disabled={isLoadingLaunch} // Disable button while API call is in progress
          >
            {/* Show loading text */}
            {isLoadingLaunch ? "Starting..." : "Launch Simulation"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
