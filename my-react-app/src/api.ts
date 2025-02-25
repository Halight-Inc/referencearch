// filepath: /C:/code/referencearch/my-react-app/src/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/v1';

export const getItems = async (token: string) => {
    const response = await axios.get(`${API_URL}/item`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const createItem = async (item: { name: string; description: string }, token: string) => {
    const response = await axios.post(`${API_URL}/item`, item, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};