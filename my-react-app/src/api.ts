import axios from 'axios';
import { CoachonCueScenarioAttributes } from './../../my-nodejs-api/src/database/models/coachoncue_scenarios';

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

export const createScenario = async (scenario: CoachonCueScenarioAttributes, token: string) => {
    const response = await axios.post(`${API_URL}/v1/scenarios`, scenario, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};