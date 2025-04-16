import React, { useState } from "react";
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

interface SimulationHistoryItem {
  id: number;
  score: number;
  date: string;
}

interface SimulationDrawerProps {
  scenario: CoachonCueScenarioAttributes;
  children: React.ReactNode;
}

export default function SimulationDrawer({ 
  scenario, 
  children 
}: SimulationDrawerProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  // Mock history data - in a real app, this would come from an API
  const historyItems: SimulationHistoryItem[] = [
    {
      id: 1,
      score: 100,
      date: "Feb 12, 2025, 12:32 PM"
    }
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto flex flex-col px-4">
        <div className="flex-1 py-4">
          <h2 className="text-lg font-semibold">{scenario.scenarioType}</h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
            <div>1h</div>
            <div>15</div>
          </div>
          
          <Separator className="my-4" />
          
          <h3 className="text-base font-medium mb-4">History</h3>
          
          <div className="space-y-3">
            {historyItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-neutral-50 p-3 rounded-md">
                <div>
                  <div className="font-medium">Passed</div>
                  <div className="text-xs text-neutral-500">{item.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{item.score}%</div>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/results/${scenario.id}`);
                      setOpen(false);
                    }}
                  >
                    View Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <SheetFooter className="pt-2 pb-4 flex flex-col">
          <Button 
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium"
            onClick={() => {
              navigate(`/simulation/${scenario.id}`);
              setOpen(false);
            }}
          >
            Launch
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
