import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Sparkles, Moon } from 'lucide-react';

const CARD_STYLES = [
    { bg: '#fef9f0', radius: '3px 12px 8px 14px', rotation: -1.5, tapeRotate: -3 },
    { bg: '#f3effe', radius: '12px 4px 14px 6px', rotation: 1.2, tapeRotate: 2 },
    { bg: '#fef0f5', radius: '6px 14px 3px 10px', rotation: -0.8, tapeRotate: -5 },
    { bg: '#f0fef4', radius: '14px 6px 12px 4px', rotation: 1.8, tapeRotate: 4 },
];

export default function Status() {
    const list = [
        { label: "Vibe Match", value: "Rare", delay: 0, icon: <Heart size={24} fill="var(--color-pink)" color="var(--color-pink)" /> },
        { label: "Patience", value: "Selective", delay: 0.6, icon: <Shield size={24} color="var(--color-text)" strokeWidth={1.5} /> },
        { label: "Humor", value: "Dry / Sarcastic", delay: 1.2, icon: <Sparkles size={24} color="var(--color-accent)" /> },
        { label: "Current Status", value: "Sleep Mode", delay: 1.8, icon: <Moon size={24} color="var(--color-accent)" /> }
    ];

    return (
        <section className="status-section" id="status">
            <div className="status-inner">
                {/* Handwritten title instead of "System Diagnostics" */}
                <p style={{
                    fontFamily: 'var(--font-handwriting)',
                    fontSize: '1.3rem',
                    color: '#b89ce6',
                    textAlign: 'center',
                    marginBottom: '2.5rem',
                }}>
                    ✦ a few things about her ✦
                </p>

                <div className="status-grid">
                    {list.map((item, i) => {
                        const isLast = i === list.length - 1;
                        const style = CARD_STYLES[i];

                        return (
                            <motion.div
                                key={i}
                                className="status-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: item.delay, ease: "easeOut" }}
                                style={{
                                    background: style.bg,
                                    borderRadius: style.radius,
                                    transform: `rotate(${style.rotation}deg)`,
                                    overflow: 'visible',
                                    position: 'relative',
                                }}
                            >
                                {/* Tape piece at top */}
                                <div style={{
                                    position: 'absolute',
                                    top: -7,
                                    left: '50%',
                                    marginLeft: -20,
                                    width: 40,
                                    height: 14,
                                    background: 'rgba(220,210,240,0.65)',
                                    borderRadius: 2,
                                    transform: `rotate(${style.tapeRotate}deg)`,
                                    zIndex: 5,
                                }} />

                                <div className="status-card-inner">
                                    <div className="status-header">
                                        <motion.div
                                            className="status-icon-wrap"
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                        >
                                            {item.icon}
                                        </motion.div>

                                        <div className="status-check-wrap">
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
                                        <span className="status-label" style={{
                                            fontFamily: 'var(--font-handwriting)',
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            letterSpacing: 'normal',
                                        }}>
                                            {item.label}
                                        </span>
                                        <span className={`status-detail ${isLast ? 'status-active-color' : ''}`} style={{
                                            fontFamily: "'Playfair Display', Georgia, serif",
                                            fontStyle: 'italic',
                                            fontSize: '1.3rem',
                                        }}>
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
