import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { login } from '../lib/auth';

interface LoginProps {
    onLogin: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const user = await login(email);
            onLogin(user);
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/10 blur-[150px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                        Prompt<span className="text-blue-500">Ozer</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Votre coffre-fort à prompts intelligent.</p>
                </div>

                <div className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                                Adresse Email
                            </label>
                            <div className="group relative flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-5 py-4 focus-within:border-blue-500/50 transition-all">
                                <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="nom@exemple.com"
                                    className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-600 font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black hover:bg-blue-600 hover:text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>Continuer <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-slate-500">
                            <ShieldCheck size={16} className="text-emerald-500" />
                            <span className="text-xs font-medium">Authentification locale sécurisée.</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                            <UserPlus size={16} className="text-blue-500" />
                            <span className="text-xs font-medium">Multi-comptes gérés automatiquement.</span>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest px-10 leading-loose">
                    En continuant, vous acceptez les conditions d'utilisation et la politique de confidentialité de PromptOzer.
                </p>
            </motion.div>
        </div>
    );
};
