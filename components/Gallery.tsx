import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash, Edit2, MapPin, Camera } from 'lucide-react';
import { GalleryItem } from '../types';

// Mock Data for initial state
const initialGallery: GalleryItem[] = [
    { id: '1', title: 'Midnight Race', imageUrl: 'https://picsum.photos/800/600?random=1', location: 'Vinewood Hills', tags: ['Racing', 'Night'], photographer: 'SpeedDemon' },
    { id: '2', title: 'LSPD Briefing', imageUrl: 'https://picsum.photos/800/800?random=2', location: 'Mission Row', tags: ['Police', 'RP'], photographer: 'Chief_W' },
    { id: '3', title: 'Sunset Blvd', imageUrl: 'https://picsum.photos/800/500?random=3', location: 'Del Perro', tags: ['Scenery'], photographer: 'VibeCheck' },
    { id: '4', title: 'Bank Heist', imageUrl: 'https://picsum.photos/800/700?random=4', location: 'Pacific Standard', tags: ['Criminal'], photographer: 'HeistMaster' },
    { id: '5', title: 'Car Meet', imageUrl: 'https://picsum.photos/800/600?random=5', location: 'Terminal', tags: ['Cars', 'Community'], photographer: 'JDM_Lover' },
];

interface GalleryProps {
    isAdmin: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ isAdmin }) => {
    const [items, setItems] = useState<GalleryItem[]>(initialGallery);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<GalleryItem>>({});

    // In a real app, use Firestore onSnapshot here

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure?')) return;
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.id) {
            // Edit
            setItems(prev => prev.map(item => item.id === formData.id ? { ...item, ...formData } as GalleryItem : item));
        } else {
            // Create
            const newItem: GalleryItem = {
                id: Date.now().toString(),
                title: formData.title || 'Untitled',
                imageUrl: formData.imageUrl || `https://picsum.photos/800/600?random=${Date.now()}`,
                location: formData.location || 'Unknown',
                tags: formData.tags || [],
                photographer: formData.photographer || 'Admin'
            };
            setItems([newItem, ...items]);
        }
        setIsModalOpen(false);
        setFormData({});
    };

    const openEdit = (item: GalleryItem) => {
        setFormData(item);
        setIsModalOpen(true);
    };

    const openCreate = () => {
        setFormData({});
        setIsModalOpen(true);
    };

    return (
        <section id="gallery" className="py-32 bg-rush-950 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/4 left-0 w-1/3 h-1/3 bg-neon-pink/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-0 w-1/3 h-1/3 bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <div>
                        <h2 className="text-neon-cyan font-bold uppercase tracking-[0.3em] text-sm mb-3">Moments</h2>
                        <h3 className="text-5xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">City Gallery</h3>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={openCreate}
                            className="flex items-center gap-2 bg-rush-900 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                        >
                            <Plus size={18} /> Add Photo
                        </button>
                    )}
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-rush-900/40 backdrop-blur-md border border-white/5 hover:border-neon-pink/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.15)]"
                        >
                            <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-rush-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <h4 className="text-white font-bold text-2xl font-display tracking-wide drop-shadow-md">{item.title}</h4>
                                <div className="flex items-center gap-4 text-gray-300 text-xs font-bold uppercase tracking-wider mt-2">
                                    <span className="flex items-center gap-1 text-neon-cyan"><MapPin size={14} /> {item.location}</span>
                                    <span className="flex items-center gap-1 text-neon-pink"><Camera size={14} /> {item.photographer}</span>
                                </div>
                                <div className="flex gap-2 mt-4 flex-wrap">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-white/10 border border-white/10 px-3 py-1 rounded-full text-white">{tag}</span>
                                    ))}
                                </div>

                                {isAdmin && (
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button onClick={() => openEdit(item)} className="p-2 bg-rush-900/80 backdrop-blur text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all border border-white/10">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-rush-900/80 backdrop-blur text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-white/10">
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Edit/Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-rush-900 border border-white/10 rounded-xl p-6 w-full max-w-lg"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6">{formData.id ? 'Edit Photo' : 'Add Photo'}</h3>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title || ''}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-rush-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.imageUrl || ''}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-rush-500 outline-none"
                                        placeholder="https://..."
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={formData.location || ''}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-rush-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Photographer</label>
                                        <input
                                            type="text"
                                            value={formData.photographer || ''}
                                            onChange={e => setFormData({ ...formData, photographer: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-rush-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-rush-500 text-black font-bold rounded hover:bg-rush-600">Save</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
