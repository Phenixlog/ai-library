export interface Prompt {
    id: string;
    title: string;
    content: string;
    tags: string[];
    category: string;
    ownerId: string;
    createdAt: number;
}

const API_BASE = '/api';

export const getPrompts = async (userId: string): Promise<Prompt[]> => {
    try {
        const response = await fetch(`${API_BASE}/prompts/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch prompts');
        return await response.json();
    } catch (error) {
        console.error('Error fetching prompts:', error);
        return [];
    }
};

export const addPrompt = async (prompt: Omit<Prompt, 'id' | 'createdAt' | 'ownerId'>, userId: string): Promise<Prompt | null> => {
    try {
        const response = await fetch(`${API_BASE}/prompts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...prompt, ownerId: userId })
        });
        if (!response.ok) throw new Error('Failed to add prompt');
        return await response.json();
    } catch (error) {
        console.error('Error adding prompt:', error);
        return null;
    }
};

export const updatePrompt = async (id: string, updates: Partial<Prompt>): Promise<Prompt | null> => {
    try {
        const response = await fetch(`${API_BASE}/prompts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update prompt');
        return await response.json();
    } catch (error) {
        console.error('Error updating prompt:', error);
        return null;
    }
};

export const deletePrompt = async (id: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE}/prompts/${id}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error('Error deleting prompt:', error);
        return false;
    }
};
