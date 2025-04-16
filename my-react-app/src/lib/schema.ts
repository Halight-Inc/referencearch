import { z } from "zod";
import { scenarioTypes, keyTopics, competenciesAndGoals, coachingFrameworks, personas } from "./data";

// Export data for components
export const ScenarioTypes = scenarioTypes;
export const KeyTopics = keyTopics;
export const CompetenciesAndGoals = competenciesAndGoals;
export const CoachingFrameworks = coachingFrameworks;
export const Personas = personas;

// Define schema for a single supporting material item
const supportingMaterialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  contentType: z.string().min(1, "Content type is required"), // e.g., 'text/plain', 'application/pdf'
  content: z.string().min(1, "Content is required"), // Text content or Base64 Data URL
});

// Define the main scenario schema
export const scenarioSchema = z.object({
  scenarioType: z.string().min(1, "Scenario type is required"),
  title: z.string().min(1, "Title is required"),
  keyTopics: z.array(z.string()).min(1, "At least one key topic is required"),
  competenciesAndGoals: z.array(z.string()).min(1, "At least one competency or goal is required"),
  guidelines: z.string().min(10, "Guidelines must be at least 10 characters long")
    .refine(value => value.split('\n').filter(line => line.trim() !== '').length >= 1, { // Example: Ensure at least 1 line
      message: "At least one guideline is required",
    }),
  coachingFramework: z.object({
    name: z.string().min(1, "Framework name is required"),
    description: z.string().min(1, "Framework description is required"),
  }),
  // Use the supportingMaterialSchema here
  supportingMaterials: z.array(supportingMaterialSchema).max(2, "Maximum of 2 supporting materials allowed").optional(),
  persona: z.object({
    name: z.string().min(1, "Persona name is required"),
    role: z.string().min(1, "Persona role is required"),
    disposition: z.string().min(1, "Persona disposition is required"),
    background: z.string().min(1, "Persona background is required"),
    communicationStyle: z.string().min(1, "Persona communication style is required"),
    emotionalState: z.string().min(1, "Persona emotional state is required"),
    avatar: z.string().optional(), // Store filename or identifier
    avatarUrl: z.string().url("Please enter a valid URL or leave empty").optional(), // Store the actual URL (could be data URL initially)
  }),
});

// Infer the type
export type ScenarioFormValues = z.infer<typeof scenarioSchema>;

// TODO: use the same one from the api
export interface CoachonCueScenarioAttributes {
  id?: string;

  title: string;
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

export interface CoachonCueScenarioAttributes {
  id?: string;

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

// Define input type for creating a simulation
export interface CreateSimulationInput {
  scenarioId: string;
  score?: string; // Optional score, backend might default it
}

export interface ChatMessage {
  sender: 'user' | 'ai' | 'system';
  text: string;
}

export interface SimulationAttributes {
  id?: string;
  status: string;
  interactionMode: string;
  scenarioId: string;
  userId: string;
  simulationResult: {
    competencyEvaluation: {
      competency: string;
      rating: string;
      notes: string;
    }[],
    generalFeedback: string;
  }
}

// Define Simulation type based on backend model (adjust if necessary)
export interface Simulation extends SimulationAttributes {

  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}