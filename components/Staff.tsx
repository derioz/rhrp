import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Loader2, Terminal, User, X, Github, Twitter, MessageSquare } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query } from 'firebase/firestore';

interface StaffMember {
    id: string;
    name: string;
    avatarUrl: string;
    color: string;
    order: number;
    bio?: string;
    category: 'Management' | 'Staff' | 'Developer';
    discord?: string;
}

const Staff: React.FC = () => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const q = query(collection(db, 'staff_members'));
                const snapshot = await getDocs(q);
                const staffList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StaffMember));
                // Client-side sort
                staffList.sort((a, b) => (a.order || 99) - (b.order || 99));
                setStaff(staffList);
            } catch (error) {
                console.error("Error fetching staff:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    const groupedStaff = {
        'Head of Administration': staff.filter(s => s.category === 'Head of Administration'),
        'Management': staff.filter(s => s.category === 'Management'),
        'Developer': staff.filter(s => s.category === 'Developer'),
        'Staff': staff.filter(s => s.category === 'Staff' || !s.category),
    };

    const categories = ['Management', 'Head of Administration', 'Developer', 'Staff'] as const;

    return (
        <section id="staff" className="py-32 bg-rush-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-cyan/5 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-pink/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-neon-cyan font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Meet the Team</span>
                        <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Architects</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            The passionate individuals behind the scenes, dedicated to crafting the ultimate roleplay experience.
                        </p>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-neon-cyan" size={48} />
                    </div>
                ) : (
                    <div className="space-y-24">
                        {categories.map((category) => {
                            const group = groupedStaff[category];
                            if (group.length === 0) return null;

                            return (
                                <div key={category} className="relative">
                                    <h3 className="text-2xl font-display font-bold text-white mb-10 pl-6 border-l-4 border-neon-cyan/50 flex items-center gap-3">
                                        {category} <span className="text-sm font-sans font-normal text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{group.length}</span>
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {group.map((member) => (
                                            <motion.div
                                                key={member.id}
                                                whileHover={{ y: -5 }}
                                                onClick={() => setSelectedMember(member)}
                                                className="group relative bg-rush-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-white/20 transition-all duration-300 overflow-hidden"
                                            >
                                                {/* Gradient Hover Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/0 to-neon-cyan/0 group-hover:from-neon-pink/5 group-hover:to-neon-cyan/5 transition-all duration-500"></div>

                                                <div className="relative z-10 flex flex-col items-center text-center">
                                                    <div className="w-24 h-24 rounded-full p-1 mb-4 relative">
                                                        <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-neon-cyan/50 transition-colors duration-300"></div>
                                                        <img
                                                            src={member.avatarUrl || 'https://via.placeholder.com/150'}
                                                            alt={member.name}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                        {member.color && (
                                                            <div
                                                                className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-rush-950"
                                                                style={{ backgroundColor: member.color }}
                                                            ></div>
                                                        )}
                                                    </div>

                                                    <h4 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors">{member.name}</h4>
                                                    <p className="text-sm text-gray-400 mt-1 mb-4 flex-grow line-clamp-2 px-2">
                                                        {member.bio || `A valued member of the ${category} team.`}
                                                    </p>

                                                    {member.discord && (
                                                        <div className="mt-auto pt-4 w-full border-t border-white/5">
                                                            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-white transition-colors">
                                                                <MessageSquare size={12} />
                                                                <span>{member.discord}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Premium Detail Modal */}
            <AnimatePresence>
                {selectedMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setSelectedMember(null)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-2xl bg-rush-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-full h-48 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                            <button
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-20"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col md:flex-row">
                                {/* Left Side: Visuals */}
                                <div className="md:w-2/5 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 bg-black/20 relative">
                                    <div className="w-40 h-40 rounded-full p-2 border-2 border-white/5 shadow-2xl mb-6 relative group">
                                        <div className="absolute inset-0 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" style={{ backgroundColor: selectedMember.color || '#fff' }}></div>
                                        <img
                                            src={selectedMember.avatarUrl || 'https://via.placeholder.com/150'}
                                            alt={selectedMember.name}
                                            className="w-full h-full rounded-full object-cover relative z-10"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-white text-center">{selectedMember.name}</h3>
                                    <span
                                        className="mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10"
                                        style={{ color: selectedMember.color || 'white', borderColor: `${selectedMember.color}30` }}
                                    >
                                        {selectedMember.category}
                                    </span>
                                </div>

                                {/* Right Side: Info */}
                                <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                                                <User size={14} className="text-neon-cyan" /> Biography
                                            </h4>
                                            <p className="text-gray-300 leading-relaxed text-sm">
                                                {selectedMember.bio || "This staff member hasn't written a biography yet, but they are an essential part of our community operations."}
                                            </p>
                                        </div>

                                        {selectedMember.discord && (
                                            <div>
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                                                    <MessageSquare size={14} className="text-neon-pink" /> Contact
                                                </h4>
                                                <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                                                    <span className="text-white font-mono text-sm">{selectedMember.discord}</span>
                                                    <span className="text-xs text-gray-500 uppercase font-bold group-hover:text-white transition-colors">Discord</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-6 border-t border-white/5 flex gap-4">
                                            {/* Social placeholders if we had them */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Staff;
