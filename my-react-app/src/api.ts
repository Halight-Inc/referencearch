import axios from 'axios';

// Define Simulation type based on backend model (adjust if necessary)
export interface Simulation {
  id: string; // Assuming UUID from your model
  score: string;
  scenarioId: string; // Assuming UUID
  userId: string; // Assuming UUID
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

const API_URL = import.meta.env.VITE_API_URL;

export const getItems = async (token: string) => {
  const response = await axios.get(`${API_URL}/v1/items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createItem = async (item: { name: string; description: string }, token: string) => {
  const response = await axios.post(`${API_URL}/v1/items`, item, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createScenario = async (scenario: {
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
}, token: string) => {
  const response = await axios.post(`${API_URL}/v1/scenarios`, scenario, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addScenarioFile = async (scenario: {
  scenarioId: string;
  base64: string;
}, token: string) => {
  const response = await axios.post(`${API_URL}/v1/scenarios/${scenario.scenarioId}/files`, {
    base64: scenario.base64,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllScenarios = async (token: string) => {
  const response = await axios.get(`${API_URL}/v1/scenarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getScenario = async (scenarioId: string, token: string) => {
    const response = await axios.get(`${API_URL}/v1/scenarios/${scenarioId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getSimulationById = async (simulationId: string, token: string) => {
    const response = await axios.get(`${API_URL}/v1/simulation/${simulationId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

/**
 * Fetches simulation records, optionally filtered by scenarioId.
 * @param token - The JWT authentication token.
 * @param scenarioId - Optional scenario ID (UUID) to filter by.
 * @returns A promise that resolves to an array of Simulation objects.
 */
export const getSimulations = async (token: string, scenarioId?: string) => {
    const params = scenarioId ? { scenarioId } : {}; // Set query parameter if scenarioId is provided
    const response = await axios.get(`${API_URL}/v1/simulation`, { // Ensure the route is correct (/v1/simulation)
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params // Pass parameters to axios
    });
    return response.data;
  };

  // Define input type for creating a simulation
export interface CreateSimulationInput {
    scenarioId: string;
    score?: string; // Optional score, backend might default it
  }
  
  
  /**
   * Creates a new simulation record for the given scenario.
   * The backend should associate it with the logged-in user via the token.
   * @param data - Object containing the scenarioId.
   * @param token - The JWT authentication token.
   * @returns A promise that resolves to the newly created Simulation object.
   */
  export const createSimulation = async (data: CreateSimulationInput, token: string): Promise<Simulation> => {
    const response = await axios.post<Simulation>(`${API_URL}/v1/simulation`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  };