import { Plus, LayoutGrid, Tag, Database, Star, Compass, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Prompt } from '../lib/storage';
import type { User } from '../lib/auth';

interface SidebarProps {
    user: User;
    onLogout: () => void;
    prompts: Prompt[];
    currentView: 'library' | 'exploration' | 'favorites';
    onViewChange: (view: 'library' | 'exploration' | 'favorites') => void;
    onNewPrompt: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, prompts, currentView, onViewChange, onNewPrompt }) => {
    const categories = Array.from(new Set(prompts.map((p) => p.category))).filter(Boolean);

    return (
        <aside className="w-72 glass-sidebar h-full flex flex-col p-6 z-20">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-lg opacity-40 animate-pulse"></div>
                    <div className="relative w-10 h-10 premium-gradient rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                        <Database className="text-white w-5 h-5" />
                    </div>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-gradient">PromptOzer</h1>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNewPrompt}
                className="btn-premium flex items-center justify-center gap-2 mb-10"
            >
                <Plus className="w-5 h-5" />
                Nouveau Prompt
            </motion.button>

            <nav className="flex-1 space-y-8 overflow-y-auto pr-2">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-3 mb-3">Principal</p>
                    <NavItem
                        icon={<LayoutGrid size={18} />}
                        label="Ma Bibliothèque"
                        active={currentView === 'library'}
                        onClick={() => onViewChange('library')}
                        count={prompts.length}
                    />
                    <NavItem
                        icon={<Compass size={18} />}
                        label="Exploration"
                        active={currentView === 'exploration'}
                        onClick={() => onViewChange('exploration')}
                    />
                    <NavItem
                        icon={<Star size={18} />}
                        label="Favoris"
                        active={currentView === 'favorites'}
                        onClick={() => onViewChange('favorites')}
                    />
                </div>

                {categories.length > 0 && (
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-3 mb-3">Catégories</p>
                        {categories.map(cat => (
                            <NavItem key={cat} icon={<Tag size={16} />} label={cat} onClick={() => { }} />
                        ))}
                    </div>
                )}
            </nav>

            {/* Profile / Stats */}
            <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                <div className="p-4 glass-card rounded-2xl flex items-center gap-4 border-none shadow-none bg-white/5">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            {user.email}
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all font-bold text-xs"
                >
                    <LogOut size={16} />
                    Se déconnecter
                </motion.button>
            </div>
        </aside>
    );
};

const NavItem = ({ icon, label, active = false, count, onClick }: { icon: React.ReactNode, label: string, active?: boolean, count?: number, onClick: () => void }) => (
    <motion.button
        whileHover={{ x: 4 }}
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${active ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <div className="flex items-center gap-3">
            <span className={active ? 'text-purple-400' : ''}>{icon}</span>
            <span className="text-sm font-medium capitalize">{label}</span>
        </div>
        {count !== undefined && (
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                {count}
            </span>
        )}
    </motion.button>
);
