import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
    return (
        <footer className="bg-rush-950 border-t border-white/5 py-16 relative overflow-hidden">
            {/* Decorative Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"></div>

            {/* Background glow */}
            <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent opacity-80 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                <div className="mb-8">
                    <span className="font-display font-bold text-3xl tracking-tighter uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        Rush Hour <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-rush-500">RP</span>
                    </span>
                </div>

                <div className="flex justify-center flex-wrap gap-8 mb-10 text-gray-400 text-sm font-bold uppercase tracking-wider">
                    <a href="#" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">Discord</a>
                    <a href="#" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">Tebex Store</a>
                    <a href="#" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">Rules</a>
                    <a href="#" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">Ban Appeal</a>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-default">
                        Created by Vexel Studios
                    </div>

                    <p className="text-gray-600 text-xs tracking-wide">
                        &copy; {new Date().getFullYear()} Rush Hour Roleplay. All rights reserved.
                    </p>
                    <p className="text-gray-700 text-[10px] uppercase tracking-widest">
                        Not affiliated with Rockstar Games
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
