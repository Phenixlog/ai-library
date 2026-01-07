import React, { useState } from 'react';
import { Save, X, Sparkles, Loader2, Key, ChevronLeft, Eye, Edit3, Wand2, Terminal, Tag, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Prompt } from '../lib/storage';
import { optimizePrompt } from '../lib/ai';
import ReactMarkdown from 'react-markdown';

interface EditorProps {
    prompt?: Prompt | null;
    onSave: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'ownerId'>) => void;
    onCancel: () => void;
}

export const Editor: React.FC<EditorProps> = ({ prompt, onSave, onCancel }) => {
    const [title, setTitle] = useState(prompt?.title || '');
    const [content, setContent] = useState(prompt?.content || '');
    const [category, setCategory] = useState(prompt?.category || '');
    const [tags, setTags] = useState(prompt?.tags.join(', ') || '');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [apiKey, setApiKey] = useState(localStorage.getItem('promptozer_openai_key') || '');
    const [viewMode, setViewMode] = useState<'split' | 'preview'>('split');

    const handleOptimize = async () => {
        if (!content) return;
        setIsOptimizing(true);
        try {
            const optimized = await optimizePrompt(content);
            setContent(optimized);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsOptimizing(false);
        }
    };

    const saveApiKey = () => {
        localStorage.setItem('promptozer_openai_key', apiKey);
        setShowSettings(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col h-full bg-[#020617] relative z-10"
        >
            <header className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-slate-950/20 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onCancel}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Retour</span>
                    </button>
                    <div className="h-4 w-px bg-white/10"></div>
                    <h2 className="text-xl font-extrabold text-white">
                        {prompt ? 'Édition' : 'Création'} <span className="text-purple-500 text-sm ml-2 font-mono">/ {title || 'Brouillon'}</span>
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 mr-4">
                        <button
                            onClick={() => setViewMode('split')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'split' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Édition
                        </button>
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Aperçu
                        </button>
                    </div>

                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2.5 rounded-xl transition-all ${showSettings ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        <Key size={18} />
                    </button>

                    <button
                        onClick={handleOptimize}
                        disabled={isOptimizing || !content}
                        className="relative group overflow-hidden px-5 py-2.5 bg-white/5 hover:bg-white/10 text-purple-400 rounded-xl border border-purple-500/20 transition-all disabled:opacity-50 font-bold text-sm flex items-center gap-2"
                    >
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        {isOptimizing ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                        Ozer-it
                    </button>

                    <button
                        onClick={() => onSave({
                            title: title || 'Sans titre',
                            content,
                            category,
                            tags: tags.split(',').map(s => s.trim()).filter(Boolean)
                        })}
                        className="btn-premium flex items-center gap-2 shadow-purple-500/20"
                    >
                        <Save size={18} />
                        Sauvegarder
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-purple-950/20 border-b border-purple-500/20"
                    >
                        <div className="p-8 flex items-center gap-6 max-w-4xl mx-auto">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <Terminal size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-white mb-1">OpenAI API Configuration</h3>
                                <p className="text-xs text-slate-500 mb-3 font-medium">Votre clé est stockée localement dans votre navigateur.</p>
                                <div className="flex gap-3">
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="input-premium py-2 text-xs flex-1"
                                        placeholder="sk-..."
                                    />
                                    <button onClick={saveApiKey} className="btn-premium py-2 text-xs">Appliquer</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex overflow-hidden">
                {/* Editor Area */}
                <div className={`${viewMode === 'split' ? 'w-3/5' : 'hidden'} flex flex-col border-r border-white/5 bg-slate-950/10`}>
                    <div className="p-10 pb-0 space-y-8">
                        <input
                            type="text"
                            placeholder="Nom du Workflow..."
                            className="w-full bg-transparent border-none text-6xl font-black focus:outline-none placeholder:text-slate-800 text-white tracking-tighter"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="flex gap-4">
                            <div className="flex-1 group">
                                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-2 mb-2 block">Catégorie</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Ex: Coding, Marketing..."
                                        className="input-premium w-full pl-12 text-sm"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex-1 group">
                                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-2 mb-2 block">Tags</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Séparez par des virgules..."
                                        className="input-premium w-full pl-12 text-sm"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-10 pt-12">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-2 mb-3 block">Prompt Core</label>
                        <textarea
                            placeholder="Définissez votre prompt ici..."
                            className="w-full h-full bg-transparent border-none outline-none resize-none text-slate-200 leading-relaxed text-xl font-medium placeholder:text-slate-800"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                </div>

                {/* Preview Area */}
                <div className={`${viewMode === 'split' ? 'w-2/5' : 'flex-1'} bg-slate-950/40 p-12 overflow-y-auto relative`}>
                    <div className="max-w-3xl mx-auto">
                        <header className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                    <Edit3 size={16} />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Rendu Documentaire</h3>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] uppercase font-black text-slate-600">Markdown Live</div>
                        </header>

                        <article className="prose prose-invert prose-purple max-w-none">
                            <div className="text-slate-300 leading-relaxed font-medium">
                                <ReactMarkdown>
                                    {content || "_Écrivez pour prévisualiser..._"}
                                </ReactMarkdown>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
