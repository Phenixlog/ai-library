import React, { useState } from 'react';
import { Search, Compass, Sparkles, Flame, ArrowsUpFromLine, ArrowRight, Download, X, Copy, Check, Users, Database, Globe, Shield, Code, TrendingUp, Presentation, Briefcase, Pencil, Microscope, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExplorationPrompt {
    id: string;
    title: string;
    description: string;
    content: string;
    author: string;
    downloads: string;
    tags: string[];
    category: string;
    icon?: React.ReactNode;
}

const EXPLORATION_PROMPTS: ExplorationPrompt[] = [
    {
        id: '1',
        title: 'Architecte Cloud & Sécurité',
        description: 'Conception d\'architectures résilientes avec focus sur la sécurité Zero-Trust.',
        content: `### Rôle
Tu es un Architecte Cloud Principal spécialisé dans les infrastructures à haute disponibilité.

### Ta Mission
1. Propose un schéma d'architecture complet (Mermaid) incluant VPC, ELB, et DB.
2. Justifie le choix des services managés vs auto-hébergés.
3. Détaille une stratégie Blue/Green pour zéro downtime.
4. Établis une checklist de sécurité Zero-Trust.

### Contraintes
- Latence utilisateur < 100ms.
- Conformité RGPD stricte.`,
        author: 'CloudMaster',
        downloads: '1.2k',
        tags: ['Cloud', 'DevOps', 'Security'],
        category: 'Coding'
    },
    {
        id: '2',
        title: 'Stratège Growth Master',
        description: 'Optimisez votre entonnoir avec la psychologie comportementale.',
        content: `### Profil
Expert en Growth Hacking adepte du Fogg Behavior Model.

### Objectif
Optimiser l'entonnoir : [URL/PRODUIT].

### Travail
1. Identifie 3 points de friction majeurs.
2. Propose 3 variantes de copy CTA utilisant la preuve sociale.
3. Définis un A/B test à fort impact (Framework ICE).`,
        author: 'GrowthNinja',
        downloads: '2.5k',
        tags: ['Marketing', 'Conversion', 'Psychology'],
        category: 'Marketing'
    },
    {
        id: '3',
        title: 'Mentor Staff Engineer',
        description: 'Revues de code pédagogiques axées SOLID et Clean Code.',
        content: `### Identité
Senior Staff Engineer exigeant mais pédagogue.

### Instructions de Revue
1. Analyse la complexité cyclomatique du code fourni.
2. Identifie les "Code Smells" flagrants.
3. Vérifie le respect des principes SOLID.
4. Propose une implémentation alternative en programmation fonctionnelle.
5. Explique le "Pourquoi" pédagogique.`,
        author: 'CleanCodeKing',
        downloads: '3.8k',
        tags: ['Quality', 'Teaching', 'Refactoring'],
        category: 'Coding'
    },
    {
        id: '4',
        title: 'Consultant Innovation',
        description: 'Disruptez les marchés avec la Blue Ocean Strategy.',
        content: `### Rôle
Consultant en stratégie d'innovation disruptive.

### Mission
Secteur : [SECTEUR].
1. Identifie "l'Injustice de Marché" actuelle.
2. Crée un concept "Blue Ocean" éliminant les coûts inutiles.
3. Détaille le Business Model Canva.
4. Plan Go-To-Market pour les 100 premiers clients.`,
        author: 'StrategyGuru',
        downloads: '1.9k',
        tags: ['Business', 'Innovation', 'Startup'],
        category: 'Business'
    },
    {
        id: '5',
        title: 'SEO & Content Strategist',
        description: 'Dominez les SERP avec une stratégie sémantique avancée.',
        content: `### Rôle
Expert SEO sémantique.

### Mission
Sujet : [SUJET].
1. Liste 10 grappes de mots-clés (Clusters) à fort potentiel.
2. Rédige un plan de contenu optimisé pour l'intention de recherche (Search Intent).
3. Définis la structure Hn pour l'article pilier.
4. Propose une stratégie de maillage interne (Siloting).`,
        author: 'SearchMaster',
        downloads: '2.1k',
        tags: ['SEO', 'Content', 'Ranking'],
        category: 'Marketing'
    },
    {
        id: '6',
        title: 'UX/UI Designer Critic',
        description: 'Critique d\'interface basée sur les lois de la Gestalt.',
        content: `### Rôle
Lead UX Designer spécialisé en accessibilité et ergonomie.

### Mission
Interface : [DESCRIPTION/LIEN].
1. Applique les 10 heuristiques de Nielsen pour critiquer l'interface.
2. Analyse le respect des lois de la Gestalt (Proximité, Similarité).
3. Suggère 3 modifications pour améliorer la clarté visuelle.
4. Checklist d'accessibilité WCAG.`,
        author: 'DesignWizard',
        downloads: '1.7k',
        tags: ['UX', 'UI', 'Accessibility'],
        category: 'Creative'
    },
    {
        id: '7',
        title: 'Expert en Négociation',
        description: 'Appliquez la méthode de Harvard pour vos deals.',
        content: `### Profil
Négociateur de haut niveau formé à la méthode de Harvard (Gagnant-Gagnant).

### Mission
Situation : [DESCRIPTION].
1. Identifie la BATNA (Meilleure solution de rechange) des deux parties.
2. Liste les intérêts réels derrière les positions affichées.
3. Propose 3 options créatives pour agrandir le gâteau.
4. Rédige le script d'ouverture pour la prochaine session.`,
        author: 'DealMaker',
        downloads: '1.4k',
        tags: ['Business', 'Deal', 'Negotiation'],
        category: 'Business'
    },
    {
        id: '8',
        title: 'Data Scientist & ML Consultant',
        description: 'De l\'analyse exploratoire au déploiement de modèles.',
        content: `### Rôle
Data Scientist senior spécialisé en Python et Scikit-Learn.

### Mission
Dataset : [DESCRIPTION_DONNEES].
1. Plan d'analyse exploratoire (EDA) pour détecter les biais.
2. Stratégie de Feature Engineering pertinente pour le problème.
3. Sélection d'algorithmes (Random Forest vs XGBoost vs Transformer).
4. Métriques d'évaluation adaptées (F1-score, AUC, etc.).`,
        author: 'DataGenius',
        downloads: '2.2k',
        tags: ['Data', 'ML', 'Python'],
        category: 'Coding'
    },
    {
        id: '9',
        title: 'Prompt Engineer Expert',
        description: 'L\'art de parler aux LLMs pour des résultats parfaits.',
        content: `### Rôle
Prompt Engineer spécialisé dans les techniques Few-shot et Chain-of-Thought (CoT).

### Mission
Prompt initial : [PROMPT_SIMPLE].
1. Réécris ce prompt en utilisant le framework PERSONA-TASK-CONTEXT-FORMAT.
2. Ajoute des exemples Few-shot pour guider le modèle.
3. Intègre des instructions de réflexion étape par étape (CoT).
4. Définis des contraintes négatives pour éviter les hallucinations.`,
        author: 'PromptWizard',
        downloads: '4.5k',
        tags: ['AI', 'Engineering', 'LLM'],
        category: 'Tech'
    },
    {
        id: '10',
        title: 'Scénariste Vidéo Viral',
        description: 'Maximisez la rétention sur TikTok, Reels et Shorts.',
        content: `### Profil
Scénariste spécialisé dans l'économie de l'attention.

### Mission
Sujet : [SUJET].
1. Crée 5 "Hooks" visuels et sonores pour les 3 premières secondes.
2. Rédige un script rythmée avec une boucle narrative (Loop).
3. Inclus des moments de "pattern interrupt" pour relancer l'attention.
4. CTA final pour maximiser le partage.`,
        author: 'ViralStory',
        downloads: '3.9k',
        tags: ['Video', 'Viral', 'Creative'],
        category: 'Creative'
    },
    {
        id: '11',
        title: 'Legal Expert (Corporate)',
        description: 'Analyse et rédaction de contrats sans jargon inutile.',
        content: `### Rôle
Juriste d'affaires spécialisé en droit des contrats technologiques.

### Mission
Document : [TEXTE_CONTRAT].
1. Identifie les clauses léonines ou risquées pour le client.
2. Propose des reformulations simplifiées (Plain English/French).
3. Vérifie la conformité avec la juridiction : [PAYS].
4. Liste les 3 points à négocier en priorité.`,
        author: 'LegalTech',
        downloads: '950',
        tags: ['Legal', 'Tech', 'Risk'],
        category: 'Business'
    },
    {
        id: '12',
        title: 'Executive Productivity Coach',
        description: 'Systèmes de gestion du temps pour leaders occupés.',
        content: `### Profil
Coach de performance utilisant les méthodes PARA et GTD.

### Mission
Flux de travail : [DESCRIPTION].
1. Applique la matrice d'Eisenhower sur la liste de tâches fournie.
2. Configure un système de "Deep Work" adapté à l'agenda.
3. Propose une structure de revue hebdomadaire.
4. Optimise l'organisation Notion selon le système PARA.`,
        author: 'PeakPerf',
        downloads: '2.8k',
        tags: ['Productivity', 'Self-Help', 'GTD'],
        category: 'Productivity'
    }
];

interface ExplorationProps {
    onClone: (prompt: { title: string, content: string, tags: string[], category: string }) => void;
}

export const Exploration: React.FC<ExplorationProps> = ({ onClone }) => {
    const [selectedPrompt, setSelectedPrompt] = useState<ExplorationPrompt | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Tous');
    const [clonedId, setClonedId] = useState<string | null>(null);

    const filteredPrompts = EXPLORATION_PROMPTS.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = activeCategory === 'Tous' || p.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['Tous', ...Array.from(new Set(EXPLORATION_PROMPTS.map(p => p.category)))];

    const handleCloneClick = (e: React.MouseEvent, prompt: ExplorationPrompt) => {
        e.stopPropagation();
        onClone({
            title: prompt.title,
            content: prompt.content,
            tags: prompt.tags,
            category: prompt.category
        });
        setClonedId(prompt.id);
        setTimeout(() => setClonedId(null), 2000);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#020617] relative">
            {/* Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>

            <header className="p-10 pb-6 z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-px w-10 bg-blue-500"></span>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Communauté</span>
                        </div>
                        <h2 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
                            Explorez le <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Savoir Collectif</span>
                        </h2>
                        <p className="text-slate-400 max-w-lg font-medium text-lg">
                            Découvrez les meilleurs prompts créés par la communauté PromptOzer.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 w-full md:w-80 shadow-2xl backdrop-blur-xl">
                            <Search className="w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Chercher un prompt..."
                                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-600 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white text-black border-white shadow-xl shadow-white/10 scale-105' : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20 hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <main className="flex-1 p-10 pt-4 overflow-y-auto z-10 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
                    {filteredPrompts.map((prompt, idx) => (
                        <motion.div
                            key={prompt.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.5 }}
                            onClick={() => setSelectedPrompt(prompt)}
                            className="group relative bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 shadow-2xl overflow-hidden hover:border-blue-500/40 transition-all cursor-pointer"
                        >
                            {/* Decorative Pattern */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="w-full md:w-32 h-32 premium-gradient rounded-3xl flex items-center justify-center shrink-0 shadow-2xl transition-transform">
                                <Compass className="w-12 h-12 text-white" />
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                        {prompt.category}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
                                        <Download size={14} /> {prompt.downloads}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors tracking-tight">
                                    {prompt.title}
                                </h3>

                                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium line-clamp-2">
                                    {prompt.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-black">
                                            {prompt.author[0]}
                                        </div>
                                        <span className="text-xs font-bold text-slate-500">par {prompt.author}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleCloneClick(e, prompt)}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 ${clonedId === prompt.id ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-blue-500 hover:text-white'}`}
                                    >
                                        {clonedId === prompt.id ? (
                                            <>Copié ! <Check size={14} /></>
                                        ) : (
                                            <>Cloner <Download size={14} /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Preview Modal */}
            <AnimatePresence>
                {selectedPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60"
                        onClick={() => setSelectedPrompt(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative flex-1 overflow-y-auto custom-scrollbar p-10 pt-14">
                                <button
                                    onClick={() => setSelectedPrompt(null)}
                                    className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all z-20"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex items-center gap-4 mb-6">
                                    <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                                        {selectedPrompt.category}
                                    </span>
                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                                        <Users size={14} /> par {selectedPrompt.author}
                                    </div>
                                </div>

                                <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">
                                    {selectedPrompt.title}
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Description</p>
                                        <p className="text-slate-300 font-medium leading-relaxed">
                                            {selectedPrompt.description}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Le Prompt</p>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedPrompt.content);
                                                }}
                                                className="flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                <Copy size={12} /> Copier le texte
                                            </button>
                                        </div>
                                        <div className="p-6 bg-black/40 border border-white/5 rounded-3xl text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                            {selectedPrompt.content}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex gap-4">
                                    <button
                                        onClick={(e) => {
                                            handleCloneClick(e as any, selectedPrompt);
                                            setSelectedPrompt(null);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-white text-black hover:bg-blue-600 hover:text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                                    >
                                        Télécharger dans ma bibliothèque <Download size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
