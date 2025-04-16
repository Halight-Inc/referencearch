import { useState } from "react";
// import { useLocation, useRoute } from "wouter";
// import { scenarios } from "@/lib/data";
// import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CheckCircle, Clock, ArrowRight, MessageSquare } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Define performance categories and their scores
interface CoachingNote {
  title: string;
  description: string;
  replay?: {
    title: string;
    duration: string;
    question: string;
  };
}

interface PerformanceCategory {
  name: string;
  score: 1 | 2 | 3 | 4 | 5; // 1-5 scale where 5 is best
  feedback: string;
  coachingNotes: CoachingNote[];
}

export default function Results() {
  const navigate = useNavigate();

  // const { id } = useParams();
  // const simulationId = id ? parseInt(id) : 1;
  
  // const scenario = simulationId ? scenarios.find(s => s.id === simulationId) : null;
  
  // Track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(name => name !== categoryName) 
        : [...prev, categoryName]
    );
  };
  
  // Check if a category is expanded
  const isCategoryExpanded = (categoryName: string) => {
    return expandedCategories.includes(categoryName);
  };
  
  // Track which coaching notes are expanded
  const [expandedNotes, setExpandedNotes] = useState<string[]>([]);
  
  // Toggle note expansion
  const toggleNote = (noteName: string) => {
    setExpandedNotes(prev => 
      prev.includes(noteName) 
        ? prev.filter(name => name !== noteName) 
        : [...prev, noteName]
    );
  };
  
  // Check if a note is expanded
  const isNoteExpanded = (noteName: string) => {
    return expandedNotes.includes(noteName);
  };
  
  // Mock performance data - in a real app, this would come from an API
  const performanceData: PerformanceCategory[] = [
    {
      name: "Conflict Resolution Strategies",
      score: 4,
      feedback: "You handled the conflict with professionalism and composure—there's an opportunity to be even more proactive in diffusing tension and finding common ground.",
      coachingNotes: [
        {
          title: "Validate First",
          description: "Use language that shows you understand the customer's frustration.",
          replay: {
            title: "Customer Escalation",
            duration: "0:28",
            question: "How could you have added a phrase like \"That's a fair concern\" or \"I can see where you're coming from\"?"
          }
        },
        {
          title: "Reframe the Issue",
          description: "Transform complaints into opportunities to find solutions together.",
          replay: {
            title: "Customer Complaint",
            duration: "0:45",
            question: "What words could you use to shift the conversation from problem to solution?"
          }
        },
        {
          title: "Lead to Resolution",
          description: "Guide the conversation toward a positive outcome that addresses concerns.",
          replay: {
            title: "Solution Finding",
            duration: "1:15",
            question: "How could you have involved the customer more in finding the solution?"
          }
        }
      ]
    },
    {
      name: "Active Listening",
      score: 5,
      feedback: "Excellent active listening skills demonstrated throughout the conversation. You consistently paraphrased to confirm understanding and asked thoughtful follow-up questions.",
      coachingNotes: [
        {
          title: "Maintain Eye Contact",
          description: "Keeping consistent eye contact shows you're fully engaged with the speaker.",
          replay: {
            title: "Customer Interaction",
            duration: "0:52",
            question: "How did maintaining eye contact help build rapport in this interaction?"
          }
        },
        {
          title: "Use Verbal Affirmations",
          description: "Small verbal cues like 'I see' and 'I understand' show active engagement.",
          replay: {
            title: "Customer Explanation",
            duration: "1:10",
            question: "What verbal affirmations did you use to show you were listening?"
          }
        },
        {
          title: "Ask Clarifying Questions",
          description: "Thoughtful questions demonstrate understanding and desire for complete clarity.",
          replay: {
            title: "Customer Needs",
            duration: "1:35",
            question: "Which clarifying question was most effective in this conversation?"
          }
        }
      ]
    },
    {
      name: "Empathy and Understanding",
      score: 2,
      feedback: "There were several moments where empathy could have been shown more explicitly. Try acknowledging emotions before moving to solutions.",
      coachingNotes: [
        {
          title: "Recognize Emotions",
          description: "Identify and acknowledge the emotions the customer is expressing.",
          replay: {
            title: "Emotional Response",
            duration: "0:40",
            question: "What emotion was the customer displaying here that went unacknowledged?"
          }
        },
        {
          title: "Validate Feelings",
          description: "Let customers know their feelings are valid and understandable.",
          replay: {
            title: "Customer Frustration",
            duration: "1:05",
            question: "How could you have validated the customer's frustration more effectively?"
          }
        },
        {
          title: "Show Genuine Care",
          description: "Demonstrate authentic concern for the customer's situation and needs.",
          replay: {
            title: "Customer Concern",
            duration: "1:30",
            question: "What phrases could show more genuine care in this interaction?"
          }
        }
      ]
    }
  ];
  
  // Helper function to render emoji based on score
  const renderScoreEmoji = (selectedScore: number, currentScore: number) => {
    const isSelected = selectedScore === currentScore;
    
    // Common classes for all emojis - increased by 30%
    const baseClasses = "w-16 h-16 rounded-full flex items-center justify-center";
    
    // Determine color based on whether this is the selected score
    const colorClasses = isSelected 
      ? currentScore <= 2 
        ? "bg-orange-500 text-white" 
        : "bg-green-500 text-white"
      : "bg-gray-200 text-gray-400";
    
    return (
      <div key={currentScore} className={`${baseClasses} ${colorClasses}`}>
        {currentScore === 1 && (
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-frown">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
        )}
        {currentScore === 2 && (
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-meh">
            <circle cx="12" cy="12" r="10" />
            <line x1="8" x2="16" y1="15" y2="15" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
        )}
        {currentScore === 3 && (
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
        )}
        {currentScore === 4 && (
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smile">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
        )}
        {currentScore === 5 && (
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 13a1.5 1.5 0 0 0 4 2" />
            <path d="M12 15a1.5 1.5 0 0 0 4-2" />
            <path d="M9 9h.01" />
            <path d="M15 9h.01" />
          </svg>
        )}
      </div>
    );
  };
  
  // if (!scenario) {
  //   return <div className="p-4">Scenario not found</div>;
  // }
  
  return (
    <div className="w-full min-h-screen flex flex-col bg-neutral-50">
      <main className="flex-1 p-4 overflow-y-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
              <path d="M3 3v18h18" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">Evaluation Report</h1>
        </div>
        
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="text-sm text-neutral-500 mb-1">Scenario</div>
          <div className="text-lg font-medium mb-3">Sales Conversion</div>
          
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1.5">
              <CheckCircle size={16} />
              <span>Completed</span>
            </div>
            
            <div className="text-neutral-600 text-sm flex items-center gap-1.5">
              <Clock size={16} />
              <span>9m 57s</span>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-100 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Performance Breakdown</h2>
          
          <div className="space-y-3">
            {performanceData.map((category) => {
              const isExpanded = isCategoryExpanded(category.name);
              return (
                <div key={category.name} className="bg-white rounded-lg p-4 shadow-sm">
                  <button 
                    className="flex justify-between items-center w-full mb-3"
                    onClick={() => toggleCategory(category.name)}
                  >
                    <h3 className="font-medium">{category.name}</h3>
                    {isExpanded ? (
                      <ChevronUp size={20} className="text-neutral-400" />
                    ) : (
                      <ChevronDown size={20} className="text-neutral-400" />
                    )}
                  </button>
                  
                  <div className="flex mb-3 justify-center" style={{ gap: '15px' }}>
                    {[1, 2, 3, 4, 5].map((score) => renderScoreEmoji(category.score, score))}
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4">
                      <p className="text-sm text-neutral-600 mb-4">{category.feedback}</p>
                      
                      <div className="mb-2 flex items-center gap-2">
                        <MessageSquare size={16} className="text-blue-600" />
                        <span className="font-medium text-sm">Coaching Notes</span>
                      </div>
                      
                      <div className="space-y-2">
                        {category.coachingNotes.map((note, index) => {
                          const isNoteOpen = isNoteExpanded(note.title);
                          return (
                            <div key={index} className="bg-blue-50 rounded-md overflow-hidden">
                              <button 
                                className="w-full text-neutral-700 p-3 flex items-center justify-between"
                                onClick={() => toggleNote(note.title)}
                              >
                                <span>{note.title}</span>
                                {isNoteOpen ? (
                                  <ChevronUp size={16} className="text-neutral-400" />
                                ) : (
                                  <ChevronDown size={16} className="text-neutral-400" />
                                )}
                              </button>
                              
                              {isNoteOpen && (
                                <div className="px-3 pb-3">
                                  <p className="text-sm text-neutral-600 mb-3">{note.description}</p>
                                  
                                  {note.replay && (
                                    <div>
                                      <div className="text-xs text-neutral-500 mb-1">Replay: {note.replay.title}</div>
                                      <div className="flex items-center justify-between mb-2">
                                        <button className="flex items-center gap-1 bg-blue-600 text-white py-1 px-2 rounded-md text-xs">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                          </svg>
                                          <span>{note.replay.duration}</span>
                                        </button>
                                      </div>
                                      <p className="text-sm text-neutral-600 mt-3">{note.replay.question}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <Button 
          onClick={() => navigate("/")}
          className="w-full h-14 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg flex items-center justify-center gap-2"
        >
          <span>Return Home</span>
          <ArrowRight size={18} />
        </Button>
      </main>
    </div>
  );
}
