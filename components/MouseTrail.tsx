import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const MouseTrail: React.FC = () => {
    const [trail, setTrail] = useState<{ x: number, y: number, id: number }[]>([]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const newPoint = { x: e.clientX, y: e.clientY, id: Date.now() };
            setTrail(prev => [...prev.slice(-20), newPoint]); // Keep last 20 points
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Cleanup old trail points
    useEffect(() => {
        const interval = setInterval(() => {
            setTrail(prev => prev.filter(p => Date.now() - p.id < 500)); // Remove points older than 500ms
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
            {trail.map((point, index) => (
                <motion.div
                    key={point.id}
                    initial={{ opacity: 0.4, scale: 1 }}
                    animate={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute w-4 h-4 bg-neon-cyan/40 rounded-full blur-[4px]"
                    style={{
                        left: point.x,
                        top: point.y,
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            ))}
        </div>
    );
};

export default MouseTrail;
