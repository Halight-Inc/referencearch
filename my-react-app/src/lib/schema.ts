import { z } from "zod";
import { scenarioTypes, keyTopics, competenciesAndGoals, coachingFrameworks, personas } from "./data";

// Export data for components
export const ScenarioTypes = scenarioTypes;
export const KeyTopics = keyTopics;
export const CompetenciesAndGoals = competenciesAndGoals;
export const CoachingFrameworks = coachingFrameworks;
export const Personas = personas;

// Define the Zod schema
export const scenarioSchema = z.object({
  scenarioType: z.string().min(1, "Please select a scenario type"),
  keyTopics: z.array(z.string()).min(1, "Please select at least one key topic"),
  competenciesAndGoals: z.array(z.string()).min(1, "Please select at least one competency or goal"),
  guidelines: z.string().min(10, "Please enter at least one guideline"),
  coachingFramework: z.object({
    name: z.string().min(1, "Please select a coaching framework"),
    description: z.string().min(1, "Framework description is required"),
  }),
  supportingMaterials: z.array(
    z.object({
      title: z.string(),
      parsedContent: z.string(),
    })
  ).optional(),
  persona: z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    disposition: z.string().min(1, "Disposition is required"),
    background: z.string().min(1, "Background is required"),
    communicationStyle: z.string().min(1, "Communication style is required"),
    emotionalState: z.string().min(1, "Emotional state is required"),
    // --- Add avatar fields ---
    avatar: z.string().optional(), // Store filename or identifier
    avatarUrl: z.string().url("Please enter a valid URL or leave empty").optional(), // Store the actual URL (could be data URL initially)
    // --- End avatar fields ---

  }),
});

// Infer the type
export type ScenarioFormValues = z.infer<typeof scenarioSchema>;

// TODO: use the same one from the api
export interface CoachonCueScenarioAttributes {
  id?: number;

  // --- Scenario fields ---
  scenarioType: string;
  keyTopics: string[];
  competenciesAndGoals: string[];
  guidelines?: string[];
  coachingFramework: {
    name: string;
    description: string;
  };
  supportingMaterials?: string[];

  persona: {
    name: string;
    role: string;
    disposition: string;
    background: string;
    communicationStyle: string;
    emotionalState: string;
    avatar: string;
    avatarUrl: string;
  }
}
