import React, { useState, useEffect } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';

interface MigrationBannerProps {
    userId: string;
    onMigrationComplete: () => void;
}

const STORAGE_KEY = 'promptozer_prompts';
const MIGRATION_DONE_KEY = 'promptozer_migration_done';

export const MigrationBanner: React.FC<MigrationBannerProps> = ({ userId, onMigrationComplete }) => {
    const [show, setShow] = useState(false);
    const [migrating, setMigrating] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [localPromptsCount, setLocalPromptsCount] = useState(0);

    useEffect(() => {
        // Check if migration was already done
        const migrationDone = localStorage.getItem(MIGRATION_DONE_KEY);
        if (migrationDone) {
            setShow(false);
            return;
        }

        // Check if there are local prompts to migrate (check ALL prompts, not just for current user)
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            try {
                const allPrompts = JSON.parse(data);
                // Show migration for ANY prompts in localStorage (userId may have changed after PostgreSQL migration)
                if (allPrompts.length > 0) {
                    setLocalPromptsCount(allPrompts.length);
                    setShow(true);
                }
            } catch {
                setShow(false);
            }
        }
    }, [userId]);

    const handleMigrate = async () => {
        setMigrating(true);
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) throw new Error('No local data');

            // Migrate ALL prompts from localStorage, reassigning them to the current logged-in user
            const allPrompts = JSON.parse(data);

            const response = await fetch('/api/prompts/migrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompts: allPrompts, userId })
            });

            const result = await response.json();

            if (response.ok) {
                setResult({ success: true, message: result.message });
                // Mark migration as done
                localStorage.setItem(MIGRATION_DONE_KEY, 'true');
                // Refresh prompts list
                setTimeout(() => {
                    onMigrationComplete();
                    setShow(false);
                }, 2000);
            } else {
                setResult({ success: false, message: result.error || 'Erreur lors de la migration' });
            }
        } catch (error) {
            setResult({ success: false, message: 'Erreur lors de la migration' });
        } finally {
            setMigrating(false);
        }
    };

    const handleDismiss = () => {
        localStorage.setItem(MIGRATION_DONE_KEY, 'skipped');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Upload className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">
                        {localPromptsCount} prompt{localPromptsCount > 1 ? 's' : ''} trouvé{localPromptsCount > 1 ? 's' : ''} localement
                    </h3>
                    <p className="text-sm text-slate-400 mb-3">
                        Vous avez des prompts stockés sur cet appareil. Migrez-les vers le cloud pour y accéder depuis tous vos appareils.
                    </p>

                    {result ? (
                        <div className={`flex items-center gap-2 text-sm ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                            {result.success ? <Check size={16} /> : <AlertCircle size={16} />}
                            {result.message}
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={handleMigrate}
                                disabled={migrating}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                            >
                                {migrating ? 'Migration...' : 'Migrer vers le cloud'}
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                            >
                                Ignorer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
