import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Briefcase, Zap, Users, Radio, Banknote, Shield, Crown, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
}

const IconMap: Record<string, React.ReactNode> = {
    car: <Car size={32} />,
    bank: <Banknote size={32} />,
    briefcase: <Briefcase size={32} />,
    zap: <Zap size={32} />,
    radio: <Radio size={32} />,
    users: <Users size={32} />,
    shield: <Shield size={32} />,
    crown: <Crown size={32} />,
    link: <LinkIcon size={32} />
};

const Features: React.FC = () => {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'server_features'));
                const featureList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feature));
                setFeatures(featureList);
            } catch (error) {
                console.error("Error fetching features:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatures();
    }, []);

    return (
        <section id="features" className="py-32 bg-rush-950 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-neon-pink/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-neon-cyan/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-neon-cyan font-bold uppercase tracking-[0.3em] text-sm mb-4">Why Choose Us</h2>
                        <h3 className="text-5xl md:text-6xl font-display font-bold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                            Server <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Features</span>
                        </h3>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 animate-pulse">Loading features...</div>
                ) : features.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 flex flex-col items-center">
                        <AlertTriangle className="mb-2 opacity-50" size={32} />
                        <p>No features listed yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
                                className="group relative bg-rush-900/40 backdrop-blur-md p-[1px] rounded-2xl overflow-hidden shadow-lg hover:shadow-neon-cyan/20 transition-all duration-500 perspective-1000"
                            >
                                {/* Gradient Border on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-100 rounded-2xl p-[1px] group-hover:from-neon-pink group-hover:via-purple-500 group-hover:to-neon-cyan transition-colors duration-500"></div>

                                <div className="relative h-full bg-rush-900/90 rounded-2xl p-8 overflow-hidden z-20">
                                    {/* Hover Glow */}
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-purple/20 blur-[60px] group-hover:bg-neon-pink/30 transition-all duration-700 rounded-full"></div>
                                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-neon-cyan/10 blur-[60px] group-hover:bg-neon-cyan/20 transition-all duration-700 rounded-full"></div>

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-rush-800 to-rush-900 border border-white/10 rounded-2xl flex items-center justify-center text-neon-cyan mb-6 group-hover:scale-110 group-hover:rotate-6 group-hover:border-neon-cyan/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-500">
                                            {IconMap[feature.icon] || <Zap size={32} />}
                                        </div>

                                        <h4 className="text-2xl font-bold text-white mb-4 font-display tracking-wide group-hover:text-neon-cyan transition-colors duration-300">{feature.title}</h4>
                                        <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-200 transition-colors">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Features;
