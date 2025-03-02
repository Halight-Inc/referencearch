// filepath: /C:/code/referencearch/my-react-app/src/api.ts
import axios from 'axios';

const API_URL = typeof process !== 'undefined' && process.env.VITE_API_URL ? process.env.VITE_API_URL : 'http://localhost:3000';

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