// filepath: /C:/code/referencearch/my-react-app/src/ItemList.tsx
import React, { useState, useEffect } from 'react';
import { getItems, createItem } from './api';

const ItemList: React.FC<{ token: string }> = ({ token }) => {
    const [items, setItems] = useState<{ name: string; description: string }[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getItems(token);
                setItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, [token]);

    const handleCreateItem = async () => {
        try {
            const newItem = await createItem({ name, description }, token);
            setItems([...items, newItem]);
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    return (
        <div>
            <h1>Items</h1>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        <strong>{item.name}</strong>: {item.description}
                    </li>
                ))}
            </ul>
            <h2>Create Item</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleCreateItem}>Create</button>
        </div>
    );
};

export default ItemList;