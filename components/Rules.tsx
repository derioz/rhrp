import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, AlertTriangle, MessageSquare, Heart, Shield, Users, Gavel, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Rule {
    id: string;
    title: string;
    description: string;
    category: string;
}

interface Guideline {
    id: string;
    title: string;
    text: string;
    icon: string;
}

const IconMap: Record<string, React.ReactNode> = {
    MessageSquare: <MessageSquare />,
    BookOpen: <BookOpen />,
    Heart: <Heart />,
    AlertTriangle: <AlertTriangle />,
    Shield: <Shield />,
    Users: <Users />,
    Gavel: <Gavel />,
};

const Rules: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'rules' | 'guidelines'>('rules');
    const [rules, setRules] = useState<Rule[]>([]);
    const [guidelines, setGuidelines] = useState<Guideline[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rulesSnap = await getDocs(collection(db, 'server_rules'));
                setRules(rulesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rule)));

                const guideSnap = await getDocs(collection(db, 'rp_guidelines'));
                setGuidelines(guideSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guideline)));
            } catch (err: any) {
                console.error("Error fetching rules/guidelines:", err);
                setError(err.message || "Failed to load rules.");
            }
        };

        fetchData();
    }, []);

    const toggleRule = (id: string) => {
        if (expandedRuleId === id) {
            setExpandedRuleId(null);
        } else {
            setExpandedRuleId(id);
        }
    };

    const filteredRules = rules.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredGuidelines = guidelines.filter(g =>
        g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section id="rules" className="py-24 md:py-32 bg-rush-950 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-neon-pink/5 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute top-20 left-20 w-96 h-96 bg-neon-cyan/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-neon-cyan font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-3"
                    >
                        Rules & Standards
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-display font-bold text-white mb-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    >
                        City <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-purple-500">Rules</span>
                    </motion.h3>

                    {/* Tab Switcher */}
                    <div className="inline-flex bg-rush-900/80 backdrop-blur-sm p-1.5 rounded-xl border border-white/10 shadow-xl">
                        <button
                            onClick={() => setActiveTab('rules')}
                            className={`px-10 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'rules' ? 'bg-gradient-to-r from-neon-pink to-rush-600 text-white shadow-lg shadow-neon-pink/25' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Rules
                        </button>
                        <button
                            onClick={() => setActiveTab('guidelines')}
                            className={`px-10 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'guidelines' ? 'bg-gradient-to-r from-neon-cyan to-blue-600 text-white shadow-lg shadow-neon-cyan/25' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Guidelines
                        </button>
                    </div>
                </div>

                <div className="bg-rush-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-12 min-h-[500px] shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none rounded-3xl"></div>

                    <AnimatePresence mode="wait">
                        {error ? (
                            <div className="text-center text-red-400 py-20">
                                <AlertTriangle size={48} className="mb-4 mx-auto" />
                                <p className="text-xl font-bold">Error loading content</p>
                                <p className="text-sm opacity-70 mt-2">{error}</p>
                                <p className="text-sm mt-4 text-gray-400">Please check your database permissions.</p>
                            </div>
                        ) : activeTab === 'rules' ? (
                            <motion.div
                                key="rules"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                {filteredRules.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                        <Gavel size={48} className="mb-4 opacity-50" />
                                        <p>No rules established yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {filteredRules.map((rule, idx) => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, scale: 1 }}
                                                animate={{ opacity: 1 }}
                                                whileHover={{ scale: 1.01 }}
                                                onClick={() => toggleRule(rule.id)}
                                                key={rule.id}
                                                className={`cursor-pointer flex flex-col p-6 md:p-8 bg-black/20 border ${expandedRuleId === rule.id ? 'border-neon-pink bg-white/5' : 'border-white/5'} hover:bg-white/5 transition-all duration-300 rounded-2xl group relative overflow-hidden`}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-6">
                                                        <span className={`font-display font-bold text-3xl transition-all inline-block min-w-[3ch] ${expandedRuleId === rule.id ? 'text-neon-pink scale-110' : 'text-neon-pink/50 group-hover:text-neon-pink'}`}>
                                                            {idx < 9 ? `0${idx + 1}` : idx + 1}
                                                        </span>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <span className="text-[10px] uppercase tracking-widest font-bold bg-white/5 text-gray-300 px-3 py-1 rounded-full border border-white/10">
                                                                    {rule.category}
                                                                </span>
                                                            </div>
                                                            <h4 className="text-white font-bold text-xl">{rule.title}</h4>
                                                        </div>
                                                    </div>
                                                    <div className={`text-gray-400 transition-transform duration-300 ${expandedRuleId === rule.id ? 'rotate-180 text-neon-pink' : ''}`}>
                                                        {expandedRuleId === rule.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {expandedRuleId === rule.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pt-6 mt-6 border-t border-white/10">
                                                                <p className="text-gray-300 text-base leading-relaxed pl-[4.5rem]">
                                                                    {rule.description}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="guidelines"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {filteredGuidelines.length === 0 ? (
                                    <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-20 text-gray-500">
                                        <BookOpen size={48} className="mb-4 opacity-50" />
                                        <p>No guidelines established yet.</p>
                                    </div>
                                ) : (
                                    filteredGuidelines.map((guide, idx) => {
                                        const Icon = IconMap[guide.icon] || <MessageSquare />;
                                        return (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                whileHover={{ scale: 1.03, y: -5 }}
                                                transition={{ delay: idx * 0.05 }}
                                                key={guide.id}
                                                className="bg-black/30 p-8 rounded-2xl border border-white/5 hover:border-neon-cyan/50 transition-all duration-300 group shadow-lg hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.2)] relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-125 duration-500">
                                                    {React.cloneElement(Icon as React.ReactElement, { size: 100 })}
                                                </div>

                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rush-800 to-black text-neon-cyan flex items-center justify-center mb-6 border border-white/10 group-hover:border-neon-cyan group-hover:text-white group-hover:bg-neon-cyan transition-all duration-300 shadow-lg relative z-10">
                                                    {React.cloneElement(Icon as React.ReactElement, { size: 28 })}
                                                </div>
                                                <h4 className="text-xl font-bold text-white mb-3 font-display tracking-wide group-hover:text-neon-cyan transition-colors relative z-10">{guide.title}</h4>
                                                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 relative z-10">{guide.text}</p>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default Rules;
