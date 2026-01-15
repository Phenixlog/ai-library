import React from 'react';
import { Search, Trash2, Clock, Sparkles, Filter, ChevronRight } from 'lucide-react';
import type { Prompt } from '../lib/storage';
import { MigrationBanner } from './MigrationBanner';

interface DashboardProps {
    prompts: Prompt[];
    onSelect: (p: Prompt) => void;
    onSearch: (query: string) => void;
    onDelete: (id: string) => void;
    userId?: string;
    userEmail?: string;
    onRefresh?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ prompts, onSelect, onSearch, onDelete, userId, userEmail, onRefresh }) => {
    return (
        <div className="flex-1 flex flex-col h-full bg-[#020617] relative">
            {/* Dynamic Background Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <header className="p-10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="h-px w-8 bg-purple-500"></span>
                        <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Library</span>
                    </div>
                    <h2 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Ma <span className="text-gradient">Bibliothèque</span>
                    </h2>
                    <p className="text-slate-400 max-w-md font-medium">
                        Gérez vos workflows et prompts optimisés avec l'élite de l'IA.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center gap-3 bg-slate-900 border border-white/5 rounded-2xl px-5 py-3.5 w-80 shadow-2xl transition-all">
                            <Search className="w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Rechercher un workflow..."
                                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-600 font-medium"
                                onChange={(e) => onSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="p-3.5 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors border border-white/5">
                        <Filter size={20} />
                    </button>
                </div>
            </header>

            <main className="flex-1 p-10 pt-4 overflow-y-auto z-10">
                {/* Migration Banner for users with localStorage data */}
                {userId && userEmail && onRefresh && (
                    <MigrationBanner userId={userId} userEmail={userEmail} onMigrationComplete={onRefresh} />
                )}

                {prompts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"></div>
                            <div className="relative w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10">
                                <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Votre coffre-fort est vide</h3>
                        <p className="text-slate-500 max-w-xs font-medium">
                            Commencez par créer votre premier prompt pour booster votre productivité.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
                        {prompts.map((prompt, idx) => (
                            <PromptCard key={prompt.id} prompt={prompt} onSelect={onSelect} onDelete={onDelete} index={idx} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

const PromptCard = ({ prompt, onSelect, onDelete, index }: { prompt: Prompt, onSelect: any, onDelete: any, index: number }) => (
    <div
        onClick={() => onSelect(prompt)}
        className="relative group bg-[#1e293b] border border-white/20 p-8 rounded-[2rem] cursor-pointer transition-all duration-300 shadow-2xl hover:border-purple-500/50 hover:bg-[#25334a]"
    >
        <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.1em] rounded-lg shadow-lg">
                        {prompt.category || 'Global'}
                    </span>
                    {prompt.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-3 py-1 bg-[#0f172a] text-[10px] text-emerald-400 font-bold rounded-lg border border-white/10 uppercase tracking-wider">
                            #{tag}
                        </span>
                    ))}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(prompt.id);
                    }}
                    className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors tracking-tight leading-tight">
                {prompt.title}
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-8 min-h-[4.5rem] font-medium opacity-100">
                {prompt.content}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex items-center gap-2.5 text-slate-400">
                    <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                        <Clock size={14} className="text-purple-400" />
                    </div>
                    <span className="text-[11px] font-bold tracking-wide">{new Date(prompt.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400 font-extrabold text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    Ouvrir <ChevronRight size={14} />
                </div>
            </div>
        </div>
    </div>
);
