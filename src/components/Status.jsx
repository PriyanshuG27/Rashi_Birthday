import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Shield, Moon } from 'lucide-react';

export default function Status() {
    const list = [
        { label: "Vibe Match", value: "Rare", delay: 0, icon: <Heart size={24} fill="var(--color-pink)" color="var(--color-pink)" /> },
        { label: "Patience", value: "Selective", delay: 0.6, icon: <Shield size={24} color="var(--color-text)" strokeWidth={1.5} /> },
        { label: "Humor", value: "Dry / Sarcastic", delay: 1.2, icon: <Sparkles size={24} color="var(--color-accent)" /> },
        { label: "Current Status", value: "Sleep Mode", delay: 1.8, icon: <Moon size={24} color="var(--color-primary)" /> }
    ];

    return (
        <section className="status-section" id="status">
            <div className="status-inner">
                <h2 className="section-title">System Diagnostics</h2>

                <div className="status-grid">
                    {list.map((item, i) => {
                        const isLast = i === list.length - 1;

                        return (
                            <motion.div
                                key={i}
                                className="status-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: item.delay, ease: "easeOut" }}
                            >
                                {/* 11. Animated Ink Sweep */}
                                <motion.div
                                    className="status-highlight-sweep"
                                    initial={{ scaleY: 0 }}
                                    whileInView={{ scaleY: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: item.delay + 0.3, ease: "easeOut" }}
                                />

                                <div className="status-card-inner">
                                    <div className="status-header">
                                        <motion.div
                                            className="status-icon-wrap"
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                        >
                                            {item.icon}
                                        </motion.div>

                                        <div className="status-check-wrap">
                                            {/* Animated Checkmark hooks V3 style */}
                                            <svg viewBox="0 0 24 24" fill="none" className="check-mark">
                                                <motion.polyline
                                                    points="20 6 9 17 4 12"
                                                    stroke="var(--color-accent)"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    initial={{ pathLength: 0, opacity: 0 }}
                                                    whileInView={{ pathLength: 1, opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: item.delay + 1.0, ease: "easeOut" }}
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="status-content">
                                        <span className="status-label">{item.label}</span>
                                        <span className={`status-detail ${isLast ? 'status-active-color' : ''}`}>
                                            {item.value}
                                        </span>
                                    </div>

                                    {isLast && (
                                        <motion.span
                                            className="status-zzz-float"
                                            animate={{ opacity: [0, 1, 0], y: [0, -10, -20], x: [0, 5, -5] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            Zzz
                                        </motion.span>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}
