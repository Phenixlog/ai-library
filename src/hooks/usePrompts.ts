import { useState, useEffect } from 'react';
import type { Prompt } from '../lib/storage';
import { getPrompts, addPrompt, updatePrompt, deletePrompt } from '../lib/storage';

export const usePrompts = (userId: string | undefined) => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);

    const refresh = () => {
        if (userId) {
            setPrompts(getPrompts(userId));
        } else {
            setPrompts([]);
        }
    };

    useEffect(() => {
        refresh();
    }, [userId]);

    const handleAdd = (data: Omit<Prompt, 'id' | 'createdAt' | 'ownerId'>) => {
        if (!userId) return;
        const newPrompt = addPrompt(data, userId);
        setPrompts(prev => [newPrompt, ...prev]);
        return newPrompt;
    };

    const handleUpdate = (id: string, updates: Partial<Prompt>) => {
        if (!userId) return;
        updatePrompt(id, updates);
        setPrompts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    };

    const handleDelete = (id: string) => {
        deletePrompt(id);
        setPrompts(prev => prev.filter(p => p.id !== id));
    };

    return { prompts, handleAdd, handleUpdate, handleDelete };
};
