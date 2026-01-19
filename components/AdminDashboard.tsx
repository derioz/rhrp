import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, Image as ImageIcon, Settings, LogOut, Save, Trash2, Plus, Edit2, X, Check, FileText, Shield, Gavel, Heart, AlertTriangle, MessageSquare, User, Upload, Camera, LayoutDashboard, ChevronRight, Bell, Zap, Radio, Banknote, Car, Crown, Home } from 'lucide-react';
import { auth, db, storage } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { HeroSettings } from '../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

// --- TYPES ---

interface StaffMember {
    id: string;
    name: string;
    order: number;
    bio?: string;
    category: 'Management' | 'Staff' | 'Developer' | 'Head of Administration';
    discord?: string;
    avatarUrl: string;
    color: string;
}

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

interface GalleryItem {
    id: string;
    title: string;
    imageUrl: string;
    location: string;
    photographer: string;
}

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
}

// --- CATEGORIES ---
const CATEGORIES = ['Management', 'Head of Administration', 'Developer', 'Staff'];

const AVAILABLE_ICONS = [
    { label: 'Message', value: 'MessageSquare', icon: MessageSquare },
    { label: 'Book', value: 'BookOpen', icon: BookOpen },
    { label: 'Heart', value: 'Heart', icon: Heart },
    { label: 'Warning', value: 'AlertTriangle', icon: AlertTriangle },
    { label: 'Shield', value: 'Shield', icon: Shield },
    { label: 'Users', value: 'Users', icon: Users },
    { label: 'Gavel', value: 'Gavel', icon: Gavel },
    { label: 'Car', value: 'car', icon: Car },
    { label: 'Briefcase', value: 'briefcase', icon: Users }, // Using Users as generic Briefcase
    { label: 'Zap', value: 'zap', icon: Zap },
    { label: 'Radio', value: 'radio', icon: Radio },
    { label: 'Bank', value: 'bank', icon: Banknote },
    { label: 'Crown', value: 'crown', icon: Crown },
];

const AdminDashboard: React.FC<{ isDemo?: boolean }> = ({ isDemo = false }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

    // Data State
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [rules, setRules] = useState<Rule[]>([]);
    const [guidelines, setGuidelines] = useState<Guideline[]>([]);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [features, setFeatures] = useState<Feature[]>([]);

    // Profile State
    const [profileData, setProfileData] = useState({ displayName: '', photoURL: '' });
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'staff' | 'rule' | 'guideline' | 'gallery' | 'feature' | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Hero Settings State
    const [heroSettings, setHeroSettings] = useState<HeroSettings>({ videoUrl: '', videoTitle: '', isVisible: false });
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (auth.currentUser || isDemo) {
                    const currentUser = auth.currentUser || { displayName: 'Demo Admin', photoURL: 'https://via.placeholder.com/150' };
                    setProfileData({
                        displayName: currentUser.displayName || '',
                        photoURL: currentUser.photoURL || ''
                    });
                }

                // Fetch data from Firestore
                const rulesSnap = await getDocs(collection(db, 'server_rules'));
                setRules(rulesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rule)));

                const guideSnap = await getDocs(collection(db, 'rp_guidelines'));
                setGuidelines(guideSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guideline)));

                const featSnap = await getDocs(collection(db, 'server_features'));
                setFeatures(featSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feature)));

                const staffSnap = await getDocs(collection(db, 'staff_members'));
                setStaff(staffSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as StaffMember)));

                const gallerySnap = await getDocs(collection(db, 'gallery_items'));
                setGallery(gallerySnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem)));

                // Fetch Hero Settings
                const heroSnap = await getDoc(doc(db, 'site_settings', 'hero'));
                if (heroSnap.exists()) {
                    setHeroSettings(heroSnap.data() as HeroSettings);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (auth.currentUser || isDemo) fetchData();
    }, [auth.currentUser, isDemo]);

    useEffect(() => {
        if (!auth.currentUser && !isDemo) navigate('/');
    }, [navigate, isDemo]);

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/');
    };

    const handleReturnToSite = () => {
        navigate('/');
    };

    const handleFileUpload = async (file: File, path: string): Promise<string> => {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    };

    const handleSeedData = async () => {
        if (!confirm("This will populate default server data. Existing duplicates might be created. Continue?")) return;

        const DEFAULT_RULES = [
            { category: 'General', title: 'Respect & Toxicity', description: 'Treat everyone with respect. Toxicity, harassment, and hate speech are strictly prohibited.' },
            { category: 'Combat', title: 'No RDM (Random Deathmatch)', description: 'Attacking another player without a valid roleplay reason is forbidden.' },
        ];

        const DEFAULT_FEATURES = [
            { title: 'Custom Vehicles', description: 'Over 300+ custom imported vehicles with realistic handling files, custom sounds, and modifications.', icon: 'car' },
            { title: 'Player Economy', description: 'A deeply immersive, player-driven economy. Own businesses, manage stock, set prices, and dominate the market.', icon: 'bank' },
            { title: 'Whitelisted Jobs', description: 'Join the LSPD, EMS, or DOJ. Rise through the ranks with realistic SOPs and progression systems.', icon: 'briefcase' },
            { title: 'Optimized Core', description: 'Experience silky smooth gameplay with our custom-built core, ensuring high FPS and low latency.', icon: 'zap' },
            { title: 'Immersive Audio', description: 'High fidelity 3D voice chat with radio filters, phone integration, and spatially accurate sound.', icon: 'radio' },
            { title: 'Active Community', description: 'Daily events, friendly staff, and a welcoming community dedicated to serious roleplay.', icon: 'users' }
        ];

        try {
            // Seed Rules only if empty
            if (rules.length === 0) {
                const rulesCollection = collection(db, 'server_rules');
                for (const rule of DEFAULT_RULES) await addDoc(rulesCollection, rule);
            }

            // Seed Features only if empty
            if (features.length === 0) {
                const featuresCollection = collection(db, 'server_features');
                for (const feat of DEFAULT_FEATURES) await addDoc(featuresCollection, feat);
            }

            alert("Data seeding complete! Refreshing...");
            window.location.reload();

        } catch (error) {
            console.error("Error seeding data:", error);
            alert("Failed to seed data. Check console.");
        }
    };

    // --- CRUD HANDLERS ---
    const openModal = (type: any, item?: any) => {
        setModalType(type);
        setEditingItem(item || null);
        setFormData(item || {});
        setUploadFile(null);
        setUploadPreview(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
        setEditingItem(null);
        setFormData({});
        setUploadFile(null);
        setUploadPreview(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let itemData = { ...formData };

            // Handle Gallery Image Upload
            if (modalType === 'gallery' && uploadFile) {
                const imageUrl = await handleFileUpload(uploadFile, `gallery/${Date.now()}_${uploadFile.name}`);
                itemData.imageUrl = imageUrl;
            }

            // Handle Staff Avatar Upload
            if (modalType === 'staff' && uploadFile) {
                const avatarUrl = await handleFileUpload(uploadFile, `staff/${Date.now()}_${uploadFile.name}`);
                itemData.avatarUrl = avatarUrl;
            }

            const collectionName =
                modalType === 'rule' ? 'server_rules' :
                    modalType === 'guideline' ? 'rp_guidelines' :
                        modalType === 'feature' ? 'server_features' :
                            modalType === 'staff' ? 'staff_members' :
                                modalType === 'gallery' ? 'gallery_items' : null;

            if (collectionName) {
                if (editingItem) {
                    await updateDoc(doc(db, collectionName, editingItem.id), itemData);
                    if (modalType === 'rule') setRules(prev => prev.map(i => i.id === editingItem.id ? { ...itemData, id: i.id } : i));
                    if (modalType === 'guideline') setGuidelines(prev => prev.map(i => i.id === editingItem.id ? { ...itemData, id: i.id } : i));
                    if (modalType === 'feature') setFeatures(prev => prev.map(i => i.id === editingItem.id ? { ...itemData, id: i.id } : i));
                    if (modalType === 'staff') setStaff(prev => prev.map(i => i.id === editingItem.id ? { ...itemData, id: i.id } : i));
                    if (modalType === 'gallery') setGallery(prev => prev.map(i => i.id === editingItem.id ? { ...itemData, id: i.id } : i));
                } else {
                    const docRef = await addDoc(collection(db, collectionName), itemData);
                    if (modalType === 'rule') setRules(prev => [...prev, { ...itemData, id: docRef.id }]);
                    if (modalType === 'guideline') setGuidelines(prev => [...prev, { ...itemData, id: docRef.id }]);
                    if (modalType === 'feature') setFeatures(prev => [...prev, { ...itemData, id: docRef.id }]);
                    if (modalType === 'staff') setStaff(prev => [...prev, { ...itemData, id: docRef.id }]);
                    if (modalType === 'gallery') setGallery(prev => [...prev, { ...itemData, id: docRef.id }]);
                }
            }
            closeModal();
        } catch (e) {
            console.error("Error saving item:", e);
            alert("Failed to save item. See console for details.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (type: any, id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            if (type === 'rule') {
                await deleteDoc(doc(db, 'server_rules', id));
                setRules(prev => prev.filter(r => r.id !== id));
            } else if (type === 'guideline') {
                await deleteDoc(doc(db, 'rp_guidelines', id));
                setGuidelines(prev => prev.filter(g => g.id !== id));
            } else if (type === 'feature') {
                await deleteDoc(doc(db, 'server_features', id));
                setFeatures(prev => prev.filter(f => f.id !== id));
            } else if (type === 'staff') {
                await deleteDoc(doc(db, 'staff_members', id));
                setStaff(prev => prev.filter(s => s.id !== id));
            } else if (type === 'gallery') {
                await deleteDoc(doc(db, 'gallery_items', id));
                setGallery(prev => prev.filter(g => g.id !== id));
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item.");
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;
        setIsSavingProfile(true);

        try {
            let photoURL = profileData.photoURL;
            if (profileImageFile) {
                photoURL = await handleFileUpload(profileImageFile, `profiles/${auth.currentUser.uid}_${Date.now()}`);
            }
            await updateProfile(auth.currentUser, { displayName: profileData.displayName, photoURL: photoURL });
            setProfileData(prev => ({ ...prev, photoURL }));
            alert('Profile updated successfully!');
            setProfileImageFile(null);
            setImagePreview(null);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadFile(file);
            setUploadPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveHeroSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingSettings(true);
        try {
            await setDoc(doc(db, 'site_settings', 'hero'), heroSettings);
            alert('Hero settings saved successfully!');
        } catch (error) {
            console.error("Error saving hero settings:", error);
            alert("Failed to save settings.");
        } finally {
            setIsSavingSettings(false);
        }
    };

    // --- RENDERERS ---
    const tabs = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { id: 'settings', label: 'Site Settings', icon: <Settings size={20} /> },
        { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
        { id: 'features', label: 'Features', icon: <Zap size={20} /> },
        { id: 'staff', label: 'Staff Team', icon: <Users size={20} /> },
        { id: 'rules', label: 'Server Rules', icon: <BookOpen size={20} /> },
        { id: 'guidelines', label: 'RP Guidelines', icon: <FileText size={20} /> },
        { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-rush-950 flex font-sans text-white bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            {/* Sidebar */}
            <aside className="w-80 bg-rush-900/90 backdrop-blur-xl border-r border-white/5 flex flex-col fixed h-full z-30 shadow-2xl">
                <div className="p-8 border-b border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-pink to-purple-600 flex items-center justify-center shadow-lg shadow-neon-pink/20">
                        <Shield className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-2xl tracking-wide text-white leading-none">RUSH HOUR</h1>
                        <span className="text-neon-cyan text-xs font-bold uppercase tracking-[0.2em]">Admin Panel</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 px-4 py-2 mt-4 mb-2">Menu</div>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeTab === tab.id ? 'bg-white/5 text-white shadow-inner' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                <span className={`${activeTab === tab.id ? 'text-neon-pink' : 'text-gray-500 group-hover:text-white transition-colors'}`}>{tab.icon}</span>
                                <span className="font-medium tracking-wide">{tab.label}</span>
                            </div>
                            {activeTab === tab.id && <motion.div layoutId="activeTabIndicator" className="w-1 h-6 bg-neon-pink rounded-full absolute left-0 top-1/2 -translate-y-1/2" />}
                            {activeTab === tab.id && <ChevronRight size={16} className="text-gray-500" />}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-2">
                    <button onClick={handleReturnToSite} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all group">
                        <Home size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold tracking-wide text-sm">Return to Website</span>
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20 group">
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold tracking-wide text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-80 relative overflow-hidden flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="h-20 bg-rush-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab('overview')}>Admin</span>
                        <ChevronRight size={14} />
                        <span className="text-white font-medium capitalize">{tabs.find(t => t.id === activeTab)?.label}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white leading-tight">{profileData.displayName || 'Admin User'}</p>
                                <p className="text-xs text-neon-cyan font-medium">Logged In</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden relative">
                                <img src={profileData.photoURL || 'https://via.placeholder.com/150'} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 md:p-12 overflow-y-auto relative">
                    {/* Background Glows */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-cyan/5 blur-[150px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-pink/5 blur-[150px] rounded-full pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* OVERVIEW TAB */}
                                {activeTab === 'overview' && (
                                    <>
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-display font-bold text-white mb-2">Welcome Back, {profileData.displayName.split(' ')[0] || 'Admin'}</h2>
                                            <p className="text-gray-400">Here's what's happening in your city today.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                            {[
                                                { label: 'Total Features', value: features.length, icon: Zap, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
                                                { label: 'Active Rules', value: rules.length, icon: BookOpen, color: 'text-neon-cyan', bg: 'bg-neon-cyan/10', border: 'border-neon-cyan/20' },
                                                { label: 'Guidelines', value: guidelines.length, icon: FileText, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
                                                { label: 'Gallery Items', value: gallery.length, icon: ImageIcon, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
                                            ].map((stat, i) => (
                                                <div key={i} className={`bg-rush-900/60 backdrop-blur border ${stat.border} p-6 rounded-2xl relative overflow-hidden group hover:bg-white/5 transition-all`}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                                            <stat.icon size={24} />
                                                        </div>
                                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-black/20 px-2 py-1 rounded-lg">Live</span>
                                                    </div>
                                                    <p className="text-4xl font-display font-bold text-white mb-1">{stat.value}</p>
                                                    <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-gradient-to-r from-rush-900/80 to-rush-800/80 backdrop-blur border border-white/10 rounded-2xl p-8 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">Quick Actions</h3>
                                                <p className="text-gray-400 text-sm max-w-lg">Need to reset the server data efficiently? Use the seeder below to populate default rules and guidelines.</p>
                                            </div>
                                            <button
                                                onClick={handleSeedData}
                                                className="px-6 py-3 bg-white hover:bg-gray-200 border border-transparent rounded-xl text-black transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-white/5"
                                            >
                                                <Settings size={18} /> Populate Default Data
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* FEATURES TAB */}
                                {activeTab === 'features' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">Server Features</h3>
                                                <p className="text-gray-400 text-sm">Manage the features displayed on the main page.</p>
                                            </div>
                                            <button onClick={() => openModal('feature')} className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-white/10">
                                                <Plus size={18} /> Add Feature
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {features.map(feature => {
                                                const Icon = AVAILABLE_ICONS.find(i => i.value === feature.icon)?.icon || Zap;
                                                return (
                                                    <div key={feature.id} className="bg-rush-900/60 backdrop-blur border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all group relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                                                            <Icon size={100} />
                                                        </div>
                                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rush-800 to-black border border-white/10 text-neon-cyan flex items-center justify-center shadow-lg">
                                                                    <Icon size={24} />
                                                                </div>
                                                                <h3 className="text-xl font-bold text-white trim">{feature.title}</h3>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => openModal('feature', feature)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"><Edit2 size={16} /></button>
                                                                <button onClick={() => handleDelete('feature', feature.id)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-400 text-sm leading-relaxed relative z-10">{feature.description}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* HERO SETTINGS TAB */}
                                {activeTab === 'settings' && (
                                    <div className="max-w-3xl mx-auto">
                                        <div className="bg-rush-900/60 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-md">
                                            <div className="mb-8">
                                                <h3 className="text-3xl font-bold text-white mb-2">Hero Section Settings</h3>
                                                <p className="text-gray-400">Manage the main video display on your landing page. Can be hidden if not relevant.</p>
                                            </div>

                                            <form onSubmit={handleSaveHeroSettings} className="space-y-8">
                                                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-6">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="text-white font-bold text-lg">Video Visibility</h4>
                                                            <p className="text-xs text-gray-500">Show or hide the video on the main page.</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setHeroSettings(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                                                            className={`w-14 h-8 rounded-full transition-colors relative ${heroSettings.isVisible ? 'bg-neon-cyan' : 'bg-gray-700'}`}
                                                        >
                                                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${heroSettings.isVisible ? 'left-7' : 'left-1'}`}></div>
                                                        </button>
                                                    </div>

                                                    <div className={`transition-opacity duration-300 ${heroSettings.isVisible ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                                        <div className="grid grid-cols-1 gap-6">
                                                            <div>
                                                                <label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">YouTube Video URL</label>
                                                                <input
                                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-cyan outline-none transition-all font-mono text-sm"
                                                                    value={heroSettings.videoUrl}
                                                                    onChange={e => setHeroSettings({ ...heroSettings, videoUrl: e.target.value })}
                                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Video Title / Caption</label>
                                                                <input
                                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-cyan outline-none transition-all"
                                                                    value={heroSettings.videoTitle}
                                                                    onChange={e => setHeroSettings({ ...heroSettings, videoTitle: e.target.value })}
                                                                    placeholder="e.g. Official Server Trailer v3.0"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4 border-t border-white/5">
                                                    <button type="submit" disabled={isSavingSettings} className="px-8 py-3 bg-white text-black font-bold uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50">
                                                        {isSavingSettings ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <Save size={18} />}
                                                        <span>{isSavingSettings ? 'Saving...' : 'Save Configuration'}</span>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {/* PROFILE TAB */}
                                {activeTab === 'profile' && (
                                    <div className="max-w-3xl mx-auto">
                                        <div className="bg-rush-900/60 border border-white/10 p-8 md:p-12 rounded-3xl relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-neon-pink/20 to-purple-600/20"></div>
                                            <div className="relative flex flex-col md:flex-row gap-8 items-start">
                                                <div className="relative group">
                                                    <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-rush-900 shadow-2xl relative">
                                                        <img src={imagePreview || profileData.photoURL || 'https://via.placeholder.com/150'} alt="Profile" className="w-full h-full object-cover" />
                                                        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                                            <Camera className="text-white" size={32} />
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleProfileImageChange} />
                                                        </label>
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-rush-900 flex items-center justify-center">
                                                        <Check size={14} className="text-black font-bold" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 w-full">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <h3 className="text-3xl font-bold text-white mb-1">{profileData.displayName || 'Admin User'}</h3>
                                                            <p className="text-neon-cyan text-sm font-bold uppercase tracking-wider">Super Administrator</p>
                                                        </div>
                                                        <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-green-500/20">Active Session</span>
                                                    </div>
                                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Display Name</label><input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-pink outline-none transition-all focus:bg-black/60" value={profileData.displayName} onChange={e => setProfileData({ ...profileData, displayName: e.target.value })} placeholder="Enter your display name" /></div>
                                                            <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Email Address</label><input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-500 cursor-not-allowed" value={auth.currentUser?.email || ''} disabled /></div>
                                                        </div>
                                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                                            <p className="text-xs text-gray-500">Last login: Just now</p>
                                                            <button type="submit" disabled={isSavingProfile} className="px-8 py-3 bg-white text-black font-bold uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50">
                                                                {isSavingProfile ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <Save size={18} />}
                                                                <span>{isSavingProfile ? 'Saving...' : 'Save Changes'}</span>
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* OTHER TABS (Staff, Rules, Guidelines, Gallery) are dynamically rendered or hidden based on activeTab */}
                                {/* STAFF TAB */}
                                {activeTab === 'staff' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div><h3 className="text-2xl font-bold text-white">Staff Management</h3><p className="text-gray-400 text-sm">Manage staff profiles and permissions.</p></div>
                                            <button onClick={() => openModal('staff')} className="flex items-center gap-2 px-6 py-3 bg-neon-pink hover:bg-neon-pink/90 text-black font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-neon-pink/20"><Plus size={18} /> Add Staff</button>
                                        </div>
                                        <div className="bg-rush-900/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                                            <table className="w-full text-left">
                                                <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-widest font-bold border-b border-white/5">
                                                    <tr>
                                                        <th className="p-5">User</th><th className="p-5">Role</th><th className="p-5">Category</th><th className="p-5">Discord</th><th className="p-5 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {staff.sort((a, b) => (a.order || 99) - (b.order || 99)).map(member => (
                                                        <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                                                            <td className="p-5">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 rounded-full p-[2px] shadow-lg" style={{ background: `linear-gradient(135deg, ${member.color}, transparent)` }}>
                                                                        <img src={member.avatarUrl || 'https://via.placeholder.com/100'} alt={member.name} className="w-full h-full rounded-full object-cover border-2 border-rush-900" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-bold text-white block">{member.name}</span>
                                                                        {member.bio && <span className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{member.bio}</span>}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-5"><span className="text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg bg-black/30 border" style={{ color: member.color, borderColor: `${member.color}40` }}>{member.role}</span></td>
                                                            <td className="p-5 text-gray-400 text-sm">{member.category || 'Management'}</td>
                                                            <td className="p-5 text-gray-500 text-sm font-mono">{member.discord || '-'}</td>
                                                            <td className="p-5 text-right space-x-2">
                                                                <button onClick={() => openModal('staff', member)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><Edit2 size={16} /></button>
                                                                <button onClick={() => handleDelete('staff', member.id)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {staff.length === 0 && (
                                                <div className="text-center py-12 text-gray-500">
                                                    <Users className="mx-auto mb-3 opacity-50" size={40} />
                                                    <p>No staff members yet. Click "Add Staff" to get started.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'guidelines' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div><h3 className="text-2xl font-bold text-white">RP Guidelines</h3><p className="text-gray-400 text-sm">Set the standards for roleplay quality.</p></div>
                                            <button onClick={() => openModal('guideline')} className="flex items-center gap-2 px-6 py-3 bg-neon-cyan hover:bg-neon-cyan/90 text-black font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-neon-cyan/20"><Plus size={18} /> Add Guideline</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {guidelines.map(guide => {
                                                const Icon = AVAILABLE_ICONS.find(i => i.value === guide.icon)?.icon || MessageSquare;
                                                return (
                                                    <div key={guide.id} className="bg-rush-900/60 backdrop-blur border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all group relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all"><Icon size={100} /></div>
                                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                                            <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rush-800 to-black border border-white/10 text-neon-cyan flex items-center justify-center shadow-lg"><Icon size={24} /></div><h3 className="text-xl font-bold text-white">{guide.title}</h3></div>
                                                            <div className="flex gap-2"><button onClick={() => openModal('guideline', guide)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"><Edit2 size={16} /></button><button onClick={() => handleDelete('guideline', guide.id)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={16} /></button></div>
                                                        </div>
                                                        <p className="text-gray-400 text-sm leading-relaxed relative z-10">{guide.text}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'rules' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div><h3 className="text-2xl font-bold text-white">Server Rules</h3><p className="text-gray-400 text-sm">Define non-negotiable server laws.</p></div>
                                            <button onClick={() => openModal('rule')} className="flex items-center gap-2 px-6 py-3 bg-neon-pink hover:bg-neon-pink/90 text-black font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-neon-pink/20"><Plus size={18} /> Add Rule</button>
                                        </div>
                                        <div className="grid gap-4">
                                            {rules.map(rule => (
                                                <div key={rule.id} className="bg-rush-900/60 backdrop-blur border border-white/10 p-6 rounded-2xl hover:bg-white/5 transition-all flex justify-between items-start group">
                                                    <div><span className="text-xs font-bold uppercase tracking-widest text-neon-pink mb-2 block bg-neon-pink/10 w-fit px-2 py-1 rounded">{rule.category}</span><h3 className="text-xl font-bold text-white mb-2">{rule.title}</h3><p className="text-gray-400 text-sm max-w-2xl">{rule.description}</p></div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => openModal('rule', rule)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"><Edit2 size={16} /></button><button onClick={() => handleDelete('rule', rule.id)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={16} /></button></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'gallery' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div><h3 className="text-2xl font-bold text-white">Media Gallery</h3><p className="text-gray-400 text-sm">Curate showcase images.</p></div>
                                            <button onClick={() => openModal('gallery')} className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-white/10"><Plus size={18} /> Add Photo</button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            {gallery.map(item => (
                                                <div key={item.id} className="group relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                                                        <div className="absolute bottom-0 left-0 p-4 w-full"><h4 className="text-white font-bold truncate">{item.title}</h4><p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><ImageIcon size={12} /> {item.photographer}</p></div>
                                                    </div>
                                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                                        <button onClick={() => openModal('gallery', item)} className="p-2 bg-black/60 backdrop-blur rounded-lg hover:bg-white hover:text-black text-white transition-colors"><Edit2 size={14} /></button>
                                                        <button onClick={() => handleDelete('gallery', item.id)} className="p-2 bg-black/60 backdrop-blur rounded-lg hover:bg-red-500 hover:text-white text-white transition-colors"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-rush-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-pink to-purple-600"></div>
                            <button onClick={closeModal} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
                            <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-wide">{editingItem ? 'Edit' : 'Add'} {modalType === 'feature' ? 'Feature' : modalType === 'staff' ? 'Staff' : modalType === 'rule' ? 'Rule' : modalType === 'guideline' ? 'Guideline' : 'Photo'}</h3>
                            <p className="text-gray-400 text-sm mb-8">Fill in the details below.</p>

                            <form onSubmit={handleSave} className="space-y-5">
                                {modalType === 'feature' && (
                                    <>
                                        <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Title</label><input className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-neon-pink outline-none" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required placeholder="Feature Title" /></div>
                                        <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Description</label><textarea className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-neon-pink outline-none min-h-[100px]" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} required placeholder="Feature details..." /></div>
                                        <div>
                                            <label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Icon</label>
                                            <div className="grid grid-cols-7 gap-2">
                                                {AVAILABLE_ICONS.map(i => (
                                                    <button type="button" key={i.value} onClick={() => setFormData({ ...formData, icon: i.value })} className={`p-2 rounded-lg flex items-center justify-center border transition-all ${formData.icon === i.value ? 'bg-neon-pink text-black border-neon-pink' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`} title={i.label}>
                                                        <i.icon size={20} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {modalType === 'staff' && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Name</label><input className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-neon-pink outline-none transition-all" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="Username" /></div>
                                            <div>
                                                <label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Category</label>
                                                <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-neon-pink outline-none transition-all appearance-none cursor-pointer" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                    <option value="" disabled>Select Category</option>
                                                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-rush-900 text-white">{c}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Avatar Image</label>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-4">
                                                    <label className="flex-1 cursor-pointer bg-black/40 border border-white/10 border-dashed rounded-xl p-6 hover:border-white/30 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-white">
                                                        <Upload size={24} className="mb-2" />
                                                        <span className="text-xs font-bold uppercase">Click to Upload Avatar</span>
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleUploadFileChange} />
                                                    </label>
                                                </div>
                                                {uploadPreview && (
                                                    <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden border border-white/10">
                                                        <img src={uploadPreview} className="w-full h-full object-cover" alt="Preview" />
                                                        <button type="button" onClick={() => { setUploadFile(null); setUploadPreview(null); }} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500"><X size={14} /></button>
                                                    </div>
                                                )}
                                                {!uploadFile && (
                                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-neon-pink outline-none" value={formData.avatarUrl || ''} onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })} placeholder="Or paste URL..." />
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Order Priority</label><input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-neon-pink outline-none transition-all" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} placeholder="1 (Highest)" /></div>
                                            <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Discord Username</label><input className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-neon-pink outline-none transition-all" value={formData.discord || ''} onChange={e => setFormData({ ...formData, discord: e.target.value })} placeholder="username" /></div>
                                        </div>

                                        <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Bio</label><textarea className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-neon-pink outline-none min-h-[100px] transition-all" value={formData.bio || ''} onChange={e => setFormData({ ...formData, bio: e.target.value })} placeholder="Short bio or description..." /></div>

                                        <div>
                                            <label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Name Color</label>
                                            <div className="flex items-center gap-4">
                                                <input type="color" className="w-16 h-12 bg-transparent border border-white/10 rounded-xl cursor-pointer p-1" value={formData.color || '#06b6d4'} onChange={e => setFormData({ ...formData, color: e.target.value })} />
                                                <span className="text-sm text-gray-400">{formData.color || '#06b6d4'}</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* ... other modals (guideline, rule, gallery) ... */}
                                {modalType === 'guideline' && (
                                    <>
                                        <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Title</label><input className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-neon-pink outline-none" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required placeholder="Stay In Character" /></div>
                                        <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Description</label><textarea className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-neon-pink outline-none min-h-[100px]" value={formData.text || ''} onChange={e => setFormData({ ...formData, text: e.target.value })} required placeholder="Guideline details..." /></div>
                                        <div>
                                            <label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Icon</label>
                                            <div className="grid grid-cols-7 gap-2">
                                                {AVAILABLE_ICONS.map(i => (
                                                    <button type="button" key={i.value} onClick={() => setFormData({ ...formData, icon: i.value })} className={`p-2 rounded-lg flex items-center justify-center border transition-all ${formData.icon === i.value ? 'bg-neon-pink text-black border-neon-pink' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}>
                                                        <i.icon size={20} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {modalType === 'rule' && (
                                    <>
                                        <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Title</label><input className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-neon-cyan outline-none" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required placeholder="Rule 1: No RDM" /></div>
                                        <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Description</label><textarea className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-neon-cyan outline-none min-h-[100px]" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} required placeholder="Rule details..." /></div>
                                        <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Category</label><input className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-neon-cyan outline-none" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} required placeholder="General, Combat, etc." /></div>
                                    </>
                                )}
                                {modalType === 'gallery' && (
                                    <>
                                        <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Title</label><input className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-rush-500 outline-none" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required placeholder="Photo Title" /></div>
                                        <div>
                                            <label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Image Source</label>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-4">
                                                    <label className="flex-1 cursor-pointer bg-black/40 border border-white/10 border-dashed rounded-xl p-6 hover:border-white/30 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-white">
                                                        <Upload size={24} className="mb-2" />
                                                        <span className="text-xs font-bold uppercase">Click to Upload</span>
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleUploadFileChange} />
                                                    </label>
                                                </div>
                                                {uploadPreview && (
                                                    <div className="relative h-32 rounded-xl overflow-hidden border border-white/10">
                                                        <img src={uploadPreview} className="w-full h-full object-cover" alt="Preview" />
                                                        <button type="button" onClick={() => { setUploadFile(null); setUploadPreview(null); }} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500"><X size={14} /></button>
                                                    </div>
                                                )}
                                                {!uploadFile && (
                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-rush-900 px-2 text-gray-500">Or use URL</span></div>
                                                    </div>
                                                )}
                                                {!uploadFile && (
                                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-rush-500 outline-none" value={formData.imageUrl || ''} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Location</label><input className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-rush-500 outline-none" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} /></div>
                                            <div><label className="text-gray-400 text-xs font-bold uppercase mb-2 block ml-1">Photographer</label><input className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-rush-500 outline-none" value={formData.photographer || ''} onChange={e => setFormData({ ...formData, photographer: e.target.value })} /></div>
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/5">
                                    <button type="button" onClick={closeModal} className="px-6 py-3 text-gray-400 hover:text-white font-bold uppercase tracking-wide text-sm rounded-xl hover:bg-white/5 transition-all">Cancel</button>
                                    <button type="submit" disabled={isUploading} className="px-8 py-3 bg-white text-black font-bold uppercase tracking-wide text-sm rounded-xl hover:bg-gray-200 transition-colors shadow-lg flex items-center gap-2">
                                        {isUploading && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>}
                                        {isUploading ? 'Uploading...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
