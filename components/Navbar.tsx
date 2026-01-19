import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, LogOut, Shield, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

interface NavbarProps {
  onLogin: () => void;
  onLogout: () => void;
  user: any;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin, onLogout, user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash scrolling on page load/navigation
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Features', href: '#features' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Staff', href: '#staff' },
    { name: 'Rules', href: '#rules' },
  ];

  const handleNavClick = (href: string, name: string) => {
    setIsOpen(false);
    setActiveTab(name);

    if (location.pathname !== '/') {
      navigate('/' + href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Social Media Links
  const socialLinks = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/rushhourrp',
      color: 'hover:text-[#1DA1F2]',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      )
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@rushhourrp',
      color: 'hover:text-[#ff0050]',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@RushHourRP',
      color: 'hover:text-[#FF0000]',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-rush-950/90 backdrop-blur-2xl border-white/10 py-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]' : 'bg-transparent border-transparent py-4'}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center text-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNavClick('#hero', 'Home')}>
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={logo}
            alt="Rush Hour RP"
            className="h-10 md:h-12 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300"
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          <ul className="flex gap-6">
            {navLinks.map((link) => (
              <motion.li key={link.name} className="relative group">
                <button
                  onClick={() => handleNavClick(link.href, link.name)}
                  className={`relative px-2 py-1 font-sans text-xs uppercase font-bold tracking-widest transition-all duration-300 z-10 ${activeTab === link.name ? 'text-neon-cyan' : 'text-gray-400 hover:text-white'}`}
                >
                  {link.name}
                  {activeTab === link.name && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-neon-pink shadow-[0_0_10px_rgba(217,70,239,1)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              </motion.li>
            ))}
          </ul>

          {/* Separator & Socials */}
          <div className="flex items-center gap-4 pl-6 border-l border-white/10">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 transition-colors ${social.color} hover:scale-110 transform`}
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pl-2">

            {/* Store Button */}
            <a
              href="https://store.rushhourroleplay.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:scale-105"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              Store
            </a>

            {/* Discord Button */}
            <a
              href="https://discord.gg/6zpQn9hESh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-[#5865F2]/10 border border-[#5865F2]/50 text-[#5865F2] rounded-lg hover:bg-[#5865F2]/20 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:scale-105"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-2.313-9.117-6.04-13.682a.074.074 0 00-.038-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.42-2.157 2.42zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.42-2.157 2.42z" /></svg>
              Discord
            </a>

            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-1.5 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:border-white/30"
                >
                  <User size={14} />
                </button>

                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-1.5 bg-rush-900/50 border border-neon-cyan/30 text-neon-cyan rounded-lg hover:bg-neon-cyan/10 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <Shield size={14} />
                </button>

                <button
                  onClick={onLogout}
                  className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={onLogin}
                  className="px-4 py-1.5 bg-gradient-to-r from-neon-pink to-rush-600 rounded-lg text-white font-bold uppercase text-[11px] tracking-wider shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:shadow-[0_0_25px_rgba(217,70,239,0.6)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <LogIn size={14} />
                  <span>Join</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button - KEEP EXISTING LOGIC BUT ADD ICONS TO MOBILE MENU LIST IF NEEDED (Omitted for brevity to save lines, but can add) */}
        <button className="lg:hidden text-white hover:text-neon-pink transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-rush-950/95 backdrop-blur-xl border-b border-rush-500/20 overflow-hidden"
          >
            <ul className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavClick(link.href, link.name)}
                    className={`block w-full text-left font-display text-xl uppercase tracking-widest ${activeTab === link.name ? 'text-neon-pink' : 'text-gray-300'}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}

              <hr className="border-white/10 my-2" />

              {/* Mobile Socials */}
              <div className="flex justify-center gap-6 py-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 transition-colors ${social.color} transform scale-125`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a href="https://store.rushhourroleplay.com/" target="_blank" className="flex items-center justify-center gap-2 px-4 py-3 border border-yellow-500/30 text-yellow-500 rounded-xl font-bold uppercase text-xs">
                  Store
                </a>
                <a href="https://discord.gg/6zpQn9hESh" target="_blank" className="flex items-center justify-center gap-2 px-4 py-3 border border-[#5865F2]/30 text-[#5865F2] rounded-xl font-bold uppercase text-xs">
                  Discord
                </a>
              </div>

              <hr className="border-white/10 my-2" />

              {user ? (
                <>
                  <li>
                    <button onClick={() => { navigate('/admin'); setIsOpen(false); }} className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
                      <User size={18} /> My Profile
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { navigate('/admin'); setIsOpen(false); }} className="flex items-center gap-2 text-neon-cyan font-bold uppercase tracking-wider">
                      <Shield size={18} /> Admin Panel
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { onLogout(); setIsOpen(false); }} className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-wider">
                      <LogOut size={18} /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button onClick={() => { onLogin(); setIsOpen(false); }} className="flex items-center gap-2 text-neon-pink font-bold uppercase tracking-wider w-full bg-white/5 p-4 rounded-lg justify-center">
                    <LogIn size={18} /> Login / Join City
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
export default Navbar;
