import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, ChevronDown, Monitor } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { HeroSettings } from '../types';

const Hero: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);
  const serverIp = "cfx.re/join/rushhour";

  // smooth scroll physics
  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityScroll = useTransform(scrollY, [0, 200], [1, 0]);
  const scaleBackground = useTransform(scrollY, [0, 1000], [1.05, 1.15]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'site_settings', 'hero'));
        if (docSnap.exists()) {
          setHeroSettings(docSnap.data() as HeroSettings);
        }
      } catch (error) {
        console.error("Error fetching hero settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(serverIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    // Robust regex for YouTube IDs (standard, shorts, embed, live)
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|live\/|watch\?v=|watch\?.+&v=))([^#&?]+)/);
    const videoId = match ? match[1] : null;

    if (videoId && videoId.length >= 11) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&loop=1&playlist=${videoId}`;
    }
    return '';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const isVideoVisible = heroSettings?.isVisible && heroSettings?.videoUrl;

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-rush-950 pt-20 lg:pt-0">

      {/* 1. Cinematic Background Layer */}
      <motion.div
        style={{ y: yBackground, scale: scaleBackground }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605218427306-0223e9a15f07?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-rush-950/90 via-rush-900/60 to-rush-950"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10 [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]"></div>
        </div>
      </motion.div>

      {/* 2. Ambient Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-rush-500/20 rounded-full blur-[150px] mix-blend-screen"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-20 -left-20 w-[800px] h-[800px] bg-neon-cyan/20 rounded-full blur-[150px] mix-blend-screen"
        />
      </div>

      {/* 3. Main Content Layer */}
      <div className="container mx-auto px-6 relative z-10 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`flex flex-col ${isVideoVisible ? 'lg:flex-row lg:items-center lg:justify-between' : 'items-center justify-center text-center'} gap-12 lg:gap-20`}
        >
          {/* Left Content (Text) */}
          <div className={`flex flex-col ${isVideoVisible ? 'lg:flex-1 lg:items-start text-left' : 'items-center text-center max-w-4xl'}`}>

            {/* Version Badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(217,70,239,0.15)] hover:border-neon-pink/50 transition-colors">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green/80 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-rush-100">2.0 LIVE NOW</span>
              </div>
            </motion.div>

            {/* Logo */}
            <motion.div variants={itemVariants} className="mb-10 relative group max-w-[500px]">
              <div className="absolute inset-0 bg-neon-pink/20 blur-[80px] rounded-full scale-75 group-hover:scale-100 transition-all duration-700"></div>
              <img
                src={logo}
                alt="Rush Hour RP"
                className="relative w-full object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Text */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                Where your story <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-purple-600">writes the rules.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 font-light mb-10 leading-relaxed max-w-2xl">
                Experience immersive roleplay driven by a serious community.
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <button className="group relative px-8 py-4 bg-rush-600 hover:bg-rush-500 text-white font-display font-bold text-lg uppercase tracking-wider rounded-xl overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(217,70,239,0.5)] active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <span className="flex items-center gap-3 relative z-10">
                  <Play fill="currentColor" size={20} /> Play Now
                </span>
              </button>

              <button
                onClick={handleCopy}
                className="group px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-display font-bold text-lg uppercase tracking-wider rounded-xl hover:bg-white/10 hover:border-cyan-400/50 hover:text-cyan-400 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                <span>{copied ? 'IP Copied' : 'Copy IP Address'}</span>
              </button>
            </motion.div>
          </div>

          {/* Right Content (Video) */}
          {isVideoVisible && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="lg:flex-1 w-full max-w-2xl relative z-20 perspective-1000"
            >
              {/* ANIMATED BORDER CONTAINER */}
              <div className="relative p-[2px] rounded-3xl overflow-hidden group shadow-2xl shadow-neon-cyan/10">

                {/* Rotating Border Gradients */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#00fff2_360deg)] opacity-70 will-change-transform"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#d946ef_360deg)] opacity-70 will-change-transform mix-blend-screen"
                />

                {/* MAIN INNER CARD */}
                <div className="relative rounded-[22px] bg-rush-950/90 backdrop-blur-xl overflow-hidden h-full border border-white/5">



                  {/* Scanline Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] will-change-transform from-transparent to-black bg-[length:100%_4px,3px_100%] pointer-events-none z-10 opacity-20"></div>

                  {/* Video Container */}
                  <div className="aspect-video w-full relative bg-black/50">
                    {getEmbedUrl(heroSettings.videoUrl) ? (
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={getEmbedUrl(heroSettings.videoUrl)}
                        title={heroSettings.videoTitle}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                        <Monitor size={48} className="mb-4 opacity-50" />
                        <p className="font-bold text-white mb-1">Video Unavailable</p>
                        <p className="text-xs">Invalid URL or ID. Please check Admin settings.</p>
                      </div>
                    )}
                  </div>

                  {/* Bottom Info Bar */}
                  <div className="bg-black/90 backdrop-blur border-t border-white/5 p-5 flex items-center gap-4 relative z-20">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 flex items-center justify-center text-neon-cyan shrink-0 border border-neon-cyan/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                      <Monitor size={22} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-bold text-lg leading-tight truncate font-display tracking-wide">{heroSettings.videoTitle || 'Featured Video'}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">Live Transmission</p>
                      </div>
                    </div>

                    {/* Audio Visualizer Effect */}
                    <div className="ml-auto flex gap-1 items-end h-6 opacity-60">
                      <motion.div animate={{ height: [8, 16, 6, 12] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-neon-pink rounded-full"></motion.div>
                      <motion.div animate={{ height: [12, 6, 18, 8] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-neon-cyan rounded-full"></motion.div>
                      <motion.div animate={{ height: [6, 14, 8, 16] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-neon-purple rounded-full"></motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* 4. Scroll Indicator */}
      <motion.div
        style={{ opacity: opacityScroll }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={24} className="text-neon-cyan" />
        </motion.div>
      </motion.div>

    </section>
  );
};

export default Hero;
