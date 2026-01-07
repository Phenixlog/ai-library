import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Exploration } from './components/Exploration';
import { Editor } from './components/Editor';
import { Login } from './components/Login';
import type { Prompt } from './lib/storage';
import { usePrompts } from './hooks/usePrompts';
import { getCurrentUser, logout, type User } from './lib/auth';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(getCurrentUser());
    const { prompts, handleAdd, handleUpdate, handleDelete } = usePrompts(user?.id);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentView, setCurrentView] = useState<'library' | 'exploration' | 'favorites'>('library');

    if (!user) {
        return <Login onLogin={setUser} />;
    }

    const filteredPrompts = prompts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesSearch;
    });

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <Sidebar
                user={user}
                onLogout={logout}
                prompts={prompts}
                currentView={currentView}
                onViewChange={setCurrentView}
                onNewPrompt={() => {
                    setSelectedPrompt(null);
                    setIsEditing(true);
                }}
            />

            <main className="flex-1 flex flex-col overflow-hidden">
                {isEditing ? (
                    <Editor
                        prompt={selectedPrompt}
                        onSave={(data: Omit<Prompt, 'id' | 'createdAt' | 'ownerId'>) => {
                            if (selectedPrompt) {
                                handleUpdate(selectedPrompt.id, data);
                            } else {
                                handleAdd(data);
                            }
                            setIsEditing(false);
                        }}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <>
                        {currentView === 'library' && (
                            <Dashboard
                                prompts={filteredPrompts}
                                onSelect={(p: Prompt) => {
                                    setSelectedPrompt(p);
                                    setIsEditing(true);
                                }}
                                onSearch={setSearchQuery}
                                onDelete={handleDelete}
                            />
                        )}
                        {currentView === 'exploration' && (
                            <Exploration onClone={(data: Omit<Prompt, 'id' | 'createdAt' | 'ownerId'>) => {
                                handleAdd(data);
                            }} />
                        )}
                        {currentView === 'favorites' && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                                <h2 className="text-3xl font-bold text-white mb-4">Favoris</h2>
                                <p className="text-slate-400">Vos prompts coup de cœur s'afficheront ici.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default App;
