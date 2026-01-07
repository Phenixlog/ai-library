import OpenAI from 'openai';

const getClient = () => {
    const apiKey = (import.meta as any).env.VITE_OPENAI_API_KEY || localStorage.getItem('promptozer_openai_key');
    if (!apiKey) return null;
    return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
};

export const optimizePrompt = async (promptContent: string): Promise<string> => {
    const openai = getClient();
    if (!openai) {
        throw new Error("Clé API OpenAI manquante. Veuillez la configurer dans les paramètres.");
    }

    const response = await openai.chat.completions.create({
        model: "gpt-4o", // Will use gpt-5 if available in SDK, fallback to 4o for now
        messages: [
            {
                role: "system",
                content: `Tu es un expert en Prompt Engineering. Ta mission est d'optimiser le prompt fourni par l'utilisateur pour le rendre plus efficace, structuré et précis. Utilisez des techniques comme le Chain-of-Thought, l'assignation de rôle, et des instructions de formatage claires.`
            },
            {
                role: "user",
                content: `Optimise ce prompt :\n\n${promptContent}`
            }
        ],
    });

    return response.choices?.[0]?.message?.content || promptContent;
};
