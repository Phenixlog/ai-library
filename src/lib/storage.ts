export interface Prompt {
    id: string;
    title: string;
    content: string;
    tags: string[];
    category: string;
    ownerId: string;
    createdAt: number;
}

export const STORAGE_KEY = 'promptozer_prompts';

export const getPrompts = (userId: string): Prompt[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    const allPrompts: Prompt[] = data ? JSON.parse(data) : [];
    return allPrompts.filter(p => p.ownerId === userId);
};

export const savePrompts = (prompts: Prompt[], userId: string): void => {
    const data = localStorage.getItem(STORAGE_KEY);
    let allPrompts: Prompt[] = data ? JSON.parse(data) : [];

    // Remove old prompts for this user and add new ones
    allPrompts = allPrompts.filter(p => p.ownerId !== userId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...allPrompts, ...prompts]));
};

export const addPrompt = (prompt: Omit<Prompt, 'id' | 'createdAt' | 'ownerId'>, userId: string): Prompt => {
    const data = localStorage.getItem(STORAGE_KEY);
    const allPrompts: Prompt[] = data ? JSON.parse(data) : [];

    const newPrompt: Prompt = {
        ...prompt,
        id: crypto.randomUUID(),
        ownerId: userId,
        createdAt: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([newPrompt, ...allPrompts]));
    return newPrompt;
};

export const updatePrompt = (id: string, updates: Partial<Prompt>): void => {
    const data = localStorage.getItem(STORAGE_KEY);
    let allPrompts: Prompt[] = data ? JSON.parse(data) : [];

    const index = allPrompts.findIndex(p => p.id === id);
    if (index !== -1) {
        allPrompts[index] = { ...allPrompts[index], ...updates } as Prompt;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allPrompts));
    }
};

export const deletePrompt = (id: string): void => {
    const data = localStorage.getItem(STORAGE_KEY);
    let allPrompts: Prompt[] = data ? JSON.parse(data) : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPrompts.filter(p => p.id !== id)));
};
