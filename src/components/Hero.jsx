import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';

export default function Hero() {
    const containerRef = useRef(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isHeartHovered, setIsHeartHovered] = useState(false);
    const [heartBurst, setHeartBurst] = useState(false);

    // Scroll Parallax
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
    const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Cursor Tracking Physics
    const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
    const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

    // Smooth spring physics for cursor tracking to avoid jitter
    const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    // Repel effect for shapes (moves away from cursor)
    // We map window coords (0 to width) to a small translation (-20px to 20px)
    const repelX1 = useTransform(smoothMouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [30, -30]);
    const repelY1 = useTransform(smoothMouseY, [0, typeof window !== "undefined" ? window.innerHeight : 800], [30, -30]);

    const repelX2 = useTransform(smoothMouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [-40, 40]);
    const repelY2 = useTransform(smoothMouseY, [0, typeof window !== "undefined" ? window.innerHeight : 800], [-40, 40]);

    // Gentle pull for the background glow (follows cursor slightly)
    const pullX = useTransform(smoothMouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1000], ["-60%", "-40%"]);
    const pullY = useTransform(smoothMouseY, [0, typeof window !== "undefined" ? window.innerHeight : 800], ["-60%", "-40%"]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Handle Heart Hover Easter Egg (2s hold)
    useEffect(() => {
        let hoverTimer;
        if (isHeartHovered) {
            hoverTimer = setTimeout(() => {
                setHeartBurst(true);
                setTimeout(() => setHeartBurst(false), 1000); // Reset burst
            }, 2000);
        }
        return () => clearTimeout(hoverTimer);
    }, [isHeartHovered]);

    const handleTapUnlock = (e) => {
        if (!isUnlocked) {
            setIsUnlocked({ x: e.clientX, y: e.clientY });
            setTimeout(() => {
                setIsUnlocked(false);
            }, 5000);
        }
    };

    const titleChars = "Happy birthday Rashiii".split("");

    return (
        <section
            ref={containerRef}
            className="hero"
            id="hero"
            onClick={handleTapUnlock}
            style={{ overflow: 'hidden', position: 'relative', cursor: isUnlocked ? 'default' : 'pointer' }}
        >

            {/* V3 Breathing Glow (8s loop) + Cursor Pull */}
            <motion.div
                className="hero-glow-interactive"
                style={{ x: pullX, y: pullY }}
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.12, 0.18, 0.12]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating Shapes with Repel Physics */}
            <motion.div
                className="floating-shape shape-1"
                style={{ x: repelX1, y: repelY1 }}
            />
            <motion.div
                className="floating-shape shape-2"
                style={{ x: repelX2, y: repelY2 }}
            />

            <motion.div
                style={{ y: yText, opacity: opacityText }}
                className="hero-content"
            >
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="hero-date"
                >
                    17 March
                </motion.p>

                {/* Main Title - Happy birthday Rashiii */}
                <h1 className="hero-title">
                    {titleChars.map((char, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                ease: [0.22, 0.61, 0.36, 1],
                                delay: 0.4 + index * 0.03
                            }}
                            style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                        >
                            {char}
                        </motion.span>
                    ))}

                    {/* Interactive Doodle Heart */}
                    <motion.span
                        initial={{ opacity: 0, scale: 0, rotate: -20 }}
                        animate={{
                            opacity: 1,
                            scale: heartBurst ? 1.15 : 1,
                            rotate: 10,
                            filter: heartBurst ? "drop-shadow(0 0 10px rgba(184, 156, 230, 0.8))" : "drop-shadow(0 0 0px rgba(0,0,0,0))"
                        }}
                        transition={{ type: "spring", bounce: 0.6, duration: heartBurst ? 0.3 : 1.5, delay: 1.2 }}
                        className="hero-doodle-heart"
                        onMouseEnter={() => setIsHeartHovered(true)}
                        onMouseLeave={() => { setIsHeartHovered(false); setHeartBurst(false); }}
                        style={{ cursor: 'pointer', display: 'inline-block' }}
                    >
                        <Heart size={36} strokeWidth={1.5} fill="var(--color-pink)" color="var(--color-pink)" />

                        {/* Heart 2s Hover Easter Egg Particle Burst */}
                        <AnimatePresence>
                            {heartBurst && (
                                <motion.div className="heart-particles-container">
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={`hp-${i}`}
                                            className="heart-particle"
                                            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                            animate={{
                                                scale: [0, 1.5, 0],
                                                x: Math.cos(i * 60 * (Math.PI / 180)) * 40,
                                                y: Math.sin(i * 60 * (Math.PI / 180)) * 40,
                                                opacity: 0
                                            }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.span>
                </h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.75 }}
                    transition={{ duration: 1.5, delay: 1.4 }}
                    className="hero-subtitle"
                >
                    The day standards were raised.
                    <motion.span
                        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                        className="hero-sparkle"
                    >
                        <Sparkles size={16} strokeWidth={1.5} color="var(--color-accent)" />
                    </motion.span>
                </motion.p>

                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 40, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 2, ease: "easeInOut" }}
                    className="hero-divider-animated"
                />
            </motion.div>

            {/* V3 Achaa Tap Unlock Easter Egg */}
            <AnimatePresence>
                {isUnlocked && (
                    <>
                        <motion.div
                            className="achaa-backdrop"
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            style={{ position: 'fixed', inset: 0, zIndex: 9, pointerEvents: 'none', background: 'rgba(245, 242, 251, 0.4)' }}
                            transition={{ duration: 1 }}
                        />
                        <motion.div
                            className="achaa-container"
                            style={{
                                left: isUnlocked.x,
                                top: isUnlocked.y,
                                position: 'fixed',
                                zIndex: 10,
                                x: '-50%',
                                y: '-100%'
                            }}
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="achaa-bubble-wrapper"
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: [0, 1, 1, 0], y: -50, scale: 1 }}
                                transition={{ duration: 4, ease: "easeOut", times: [0, 0.1, 0.8, 1] }}
                            >
                                {/* Speech Bubble SVG */}
                                <svg width="120" height="60" viewBox="0 0 120 60" style={{ position: 'absolute', inset: 0, zIndex: -1, overflow: 'visible' }}>
                                    <motion.path
                                        d="M 10 10 C 10 0, 110 0, 110 10 C 110 40, 70 40, 60 55 C 50 40, 10 40, 10 10 Z"
                                        fill="white"
                                        stroke="var(--color-accent)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, fillOpacity: 0 }}
                                        animate={{ pathLength: 1, fillOpacity: 0.9 }}
                                        transition={{ duration: 1.2, ease: "easeInOut" }}
                                    />
                                </svg>

                                <span style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.4rem', color: 'var(--color-primary)', display: 'block', padding: '12px 0 0 0', textAlign: 'center' }}>
                                    Achaa.
                                </span>
                            </motion.div>

                            {/* Dissolving Particles at the end of the animation (Starts around 3s) */}
                            <motion.div className="achaa-particles" style={{ position: 'absolute', top: '-20px', left: '50%' }}>
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={`ap-${i}`}
                                        className="achaa-particle"
                                        initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                                        animate={{
                                            scale: [0, Math.random() + 0.5, 0],
                                            x: (Math.random() - 0.5) * 100,
                                            y: (Math.random() - 0.5) * 100 - 40,
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 3.2 }}
                                        style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--color-accent)', borderRadius: '50%' }}
                                    />
                                ))}
                            </motion.div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
