import { useState, useEffect, useCallback } from 'react';
import type { Prompt } from '../lib/storage';
import { getPrompts, addPrompt, updatePrompt, deletePrompt } from '../lib/storage';

export const usePrompts = (userId: string | undefined) => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        if (userId) {
            setLoading(true);
            const data = await getPrompts(userId);
            setPrompts(data);
            setLoading(false);
        } else {
            setPrompts([]);
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const handleAdd = async (data: Omit<Prompt, 'id' | 'createdAt' | 'ownerId'>) => {
        if (!userId) return;
        const newPrompt = await addPrompt(data, userId);
        if (newPrompt) {
            setPrompts(prev => [newPrompt, ...prev]);
        }
        return newPrompt;
    };

    const handleUpdate = async (id: string, updates: Partial<Prompt>) => {
        if (!userId) return;
        const updated = await updatePrompt(id, updates);
        if (updated) {
            setPrompts(prev => prev.map(p => (p.id === id ? updated : p)));
        }
    };

    const handleDelete = async (id: string) => {
        const success = await deletePrompt(id);
        if (success) {
            setPrompts(prev => prev.filter(p => p.id !== id));
        }
    };

    return { prompts, loading, refresh, handleAdd, handleUpdate, handleDelete };
};
