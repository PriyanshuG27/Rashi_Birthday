import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Final() {
    const [stage, setStage] = useState(0); // 0=btn, 1=so-gyiii, 2=just-kidding, 3=final-message
    const [showEasterEgg, setShowEasterEgg] = useState(false);
    const [heartHoverStart, setHeartHoverStart] = useState(null);

    const handleSequence = () => {
        setStage(1);

        setTimeout(() => {
            setStage(2);

            setTimeout(() => {
                setStage(3);
            }, 2500);

        }, 3000);
    };

    useEffect(() => {
        document.body.style.overflow = stage > 0 ? 'hidden' : 'auto';
    }, [stage]);

    // Handle 3s Heart Hover Easter Egg
    useEffect(() => {
        let timer;
        if (heartHoverStart) {
            timer = setTimeout(() => {
                setShowEasterEgg(true);
            }, 3000);
        } else {
            setShowEasterEgg(false);
        }
        return () => clearTimeout(timer);
    }, [heartHoverStart]);

    return (
        <section className="final-section" id="final">
            <motion.button
                className="final-btn"
                onClick={handleSequence}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{
                    default: { duration: 0.8 },
                    scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                <span className="final-btn-text">Confirm Friendship Renewal</span>
                <motion.span
                    className="final-btn-sparkle"
                    animate={{ rotate: 180, scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    ✨
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {stage > 0 && (
                    <motion.div
                        className="final-overlay"
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                        <div className="final-vignette-overlay" />
                        <AnimatePresence mode="wait">
                            {stage === 1 && (
                                <motion.div
                                    key="sogyiii"
                                    className="final-sogyiii"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                >
                                    so gyiii 🥲
                                    <motion.div
                                        className="final-zzz"
                                        animate={{ y: [0, -20, -40], x: [0, 10, -5], opacity: [0, 1, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        Zzz
                                    </motion.div>
                                </motion.div>
                            )}

                            {stage === 2 && (
                                <motion.h3
                                    key="kidding"
                                    className="final-kidding"
                                    initial={{ opacity: 0, filter: "blur(8px)", scale: 0.9 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                >
                                    Just kidding.
                                </motion.h3>
                            )}

                            {stage === 3 && (
                                <motion.div
                                    key="true-final"
                                    className="true-final"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                >
                                    <p className="final-bday-title">Happy Birthday.</p>
                                    <p className="final-bday-sub">Stay exactly the way you are.</p>

                                    {/* Animated Heart Outline Draw */}
                                    <motion.div
                                        className="final-heart-wrapper"
                                        onMouseEnter={() => setHeartHoverStart(Date.now())}
                                        onMouseLeave={() => setHeartHoverStart(null)}
                                        style={{ position: 'relative', display: 'inline-block', zIndex: 10, cursor: 'pointer' }}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-pink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="final-heart-svg">
                                            <motion.path
                                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1, fill: "rgba(244, 182, 210, 0.6)" }}
                                                transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                                            />
                                        </svg>

                                        {/* Easter Egg Triggered */}
                                        <AnimatePresence>
                                            {showEasterEgg && (
                                                <motion.div
                                                    className="easter-egg-text"
                                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 30, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                                    style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--color-text)', opacity: 0.7 }}
                                                >
                                                    Still reading? Of course you are.
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Fast Petals (Intensified for 2s) */}
                                    <div className="final-petals">
                                        {[...Array(15)].map((_, i) => (
                                            <motion.div
                                                key={`fast-${i}`}
                                                className="petal"
                                                initial={{ y: -50, x: Math.random() * innerWidth, opacity: 0, rotate: 0 }}
                                                animate={{
                                                    y: innerHeight + 50,
                                                    x: `+=${(Math.random() - 0.5) * 300}`,
                                                    opacity: [0, 1, 0],
                                                    rotate: `+=${Math.random() * 360}`
                                                }}
                                                // Short duration, delayed start to match heart draw, stops repeating quickly
                                                transition={{ duration: 2 + Math.random() * 2, delay: 1.5 + (i * 0.1), ease: "linear", times: [0, 0.5, 1] }}
                                                style={{ backgroundColor: 'var(--color-pink)' }}
                                            />
                                        ))}
                                    </div>

                                    {/* Slow Settled Petals (Infinite) */}
                                    <div className="final-petals-slow">
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={`slow-${i}`}
                                                className="petal"
                                                initial={{ y: -50, x: Math.random() * innerWidth, opacity: 0, rotate: 0 }}
                                                animate={{
                                                    y: innerHeight + 50,
                                                    x: `+=${(Math.random() - 0.5) * 100}`,
                                                    opacity: [0, 0.5, 0],
                                                    rotate: `+=${Math.random() * 360}`
                                                }}
                                                // Long duration, starts after fast petals
                                                transition={{ duration: 10 + Math.random() * 5, delay: 3.5 + (i * 1.5), repeat: Infinity, ease: "linear" }}
                                                style={{ backgroundColor: 'var(--color-accent)' }}
                                            />
                                        ))}
                                    </div>

                                    {/* Radial Glow Pulse */}
                                    <motion.div
                                        className="final-glow"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: [0, 3, 2.5],
                                            opacity: [0, 0.4, 0.15]
                                        }}
                                        transition={{ duration: 4, delay: 1.2, times: [0, 0.3, 1], ease: "easeOut" }}
                                    />

                                    {/* V3 Handwritten Signature */}
                                    <motion.div
                                        className="final-signature"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 0.8, x: 0 }}
                                        transition={{ duration: 1.5, delay: 2.5 }}
                                    >
                                        — 17 March
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
