import React from 'react';
import { motion } from 'framer-motion';

export default function Profile() {
    const cards = [
        {
            icon: "🧠",
            title: "Intelligence",
            text: "Sees through manipulation. Prefers clarity over drama.",
            rotate: -1.5,
            tapeColor: "var(--color-pink)"
        },
        {
            icon: "⚖️",
            title: "Standards",
            text: "Doesn't allow raised voices. Rights are earned, not assumed.",
            rotate: 1.2,
            tapeColor: "var(--color-accent)"
        },
        {
            icon: "🤝",
            title: "Loyalty",
            text: "Takes friendship seriously. Gives fully. Expects consistency.",
            rotate: -0.8,
            tapeColor: "var(--color-divider)"
        },
        {
            icon: "💤",
            title: "Unexpected Feature",
            text: 'Randomly disappears with: "so gyiii 🥲"',
            rotate: 1.5,
            tapeColor: "var(--color-pink)"
        }
    ];

    return (
        <section className="profile-section" id="profile">
            {/* Break symmetry: slightly left-align section */}
            <div className="profile-section-inner">
                <motion.div
                    className="profile-title-container"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <h2 className="section-title">Who You Are <br />(from my POV)</h2>
                </motion.div>

                <div className="profile-grid">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30, rotate: 0 }}
                            whileInView={{ opacity: 1, y: 0, rotate: card.rotate }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.8,
                                delay: index * 0.15,
                                type: "spring",
                                bounce: 0.4
                            }}
                            whileHover={{
                                rotate: card.rotate + (index % 2 === 0 ? 2 : -2),
                                y: -8,
                                scale: 1.02,
                                transition: { type: "spring", bounce: 0.6 }
                            }}
                            className="scrapbook-card"
                        >
                            {/* Washi Tape graphic */}
                            <div className="washi-tape" style={{ background: card.tapeColor }} />

                            <div className="card-icon">{card.icon}</div>
                            <h3 className="card-title">{card.title}</h3>
                            <p className="card-text">{card.text}</p>

                            {/* Sparkle on hover (handled in CSS via group-hover or inline variants) */}
                            <div className="card-sparkle">✨</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
