import axios from 'axios';
import { Simulation, SimulationAttributes } from '@/lib/schema';

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

export const getScenarioFiles = async (scenarioId: string, token: string) => {
  const response = await axios.get(`${API_URL}/v1/scenarios/${scenarioId}/files`, {
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

/**
 * Creates a new simulation record for the given scenario.
 * The backend should associate it with the logged-in user via the token.
 * @param data - Object containing the scenarioId.
 * @param token - The JWT authentication token.
 * @returns A promise that resolves to the newly created Simulation object.
 */
export const createSimulation = async (data: Simulation, token: string): Promise<Simulation> => {
    const response = await axios.post<Simulation>(`${API_URL}/v1/simulation`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

/**
* Updates an existing simulation record.
* @param simulationId - The ID (UUID) of the simulation to update.
* @param updateData - An object containing the fields to update (e.g., { score: '85' }).
* @param token - The JWT authentication token.
* @returns A promise that resolves to the updated Simulation object.
*/
export const updateSimulation = async (simulationId: string, updateData: SimulationAttributes, token: string): Promise<Simulation> => {
    const response = await axios.patch<Simulation>(`${API_URL}/v1/simulation/${simulationId}`, updateData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};