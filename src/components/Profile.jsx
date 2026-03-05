import React from 'react';
import { motion } from 'framer-motion';

const OBSERVATIONS = [
    { text: "you make people feel like they said something smart, even when they didn't", delay: 0.1 },
    { text: "you raise the standard of a room just by having one yourself", delay: 0.3 },
    { text: "you never ask for things twice", delay: 0.5 },
    { text: "when you actually laugh — really laugh — everyone notices", delay: 0.7 },
    { text: "you don't realise how much people remember the things you say", delay: 0.9 },
    { text: "you forgive quietly. without making it a moment.", delay: 1.1 },
    { text: "you don't know you do any of this. that's the whole point.", delay: 1.5, special: true },
];

export default function Profile() {
    return (
        <section id="profile" style={{ padding: '6rem 2rem' }}>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                position: 'relative',
                background: '#fffdf9',
                padding: '48px 52px 52px 64px',
                boxShadow: '4px 4px 20px rgba(0,0,0,0.06), -2px 0 0 rgba(184,156,230,0.15)',
            }}>
                {/* RULED LINES background */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: 'none',
                    background: `repeating-linear-gradient(
                        transparent,
                        transparent calc(1.9rem - 1px),
                        rgba(184,156,230,0.06) calc(1.9rem - 1px),
                        rgba(184,156,230,0.06) 1.9rem
                    )`,
                    backgroundSize: '100% 1.9rem',
                    backgroundPosition: '0 3.8rem',
                }} />

                {/* TORN LEFT EDGE (spiral notebook feel) */}
                <svg
                    style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '24px', zIndex: 1, overflow: 'hidden' }}
                    preserveAspectRatio="none"
                >
                    <path
                        d="M12,0 C10,30 14,60 11,90 C8,120 13,150 10,180 C7,210 12,240 9,270 C6,300 11,330 8,360 C5,390 10,420 8,450 C9,480 12,510 11,540 C8,570 13,600 10,630 C7,660 12,690 9,720 C6,750 11,780 8,810 C5,840 10,870 8,900 C9,930 12,960 11,990 C8,1020 13,1050 10,1080 C7,1110 12,1140 9,1170 C6,1200 11,1230 8,1260 C5,1290 10,1320 8,1350 C9,1380 12,1410 11,1440 C8,1470 13,1500 10,1530 C7,1560 12,1590 9,1620 C6,1650 11,1680 8,1710 C5,1740 10,1770 8,1800 C9,1830 12,1860 11,1890 C8,1920 13,1950 10,1980 C7,2010 12,2040 9,2070 C6,2100 11,2130 8,2160 C5,2190 10,2220 8,2250 C9,2280 12,2310 11,2340 C8,2370 13,2400 10,2430 C7,2460 12,2490 9,2520 C6,2550 11,2580 8,2610 C5,2640 10,2670 8,2700 L8,3000"
                        stroke="rgba(184,156,230,0.25)"
                        strokeWidth="1"
                        fill="none"
                    />
                    {Array.from({ length: 40 }, (_, i) => (
                        <circle
                            key={`hole-${i}`}
                            cx="12"
                            cy={40 + i * 40}
                            r="5"
                            fill="none"
                            stroke="rgba(184,156,230,0.2)"
                            strokeWidth="1"
                        />
                    ))}
                </svg>

                {/* PRESSED FLOWER (top right corner) - Inline simple lavender sprig SVG */}
                <svg
                    viewBox="0 0 100 200"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        width: '70px',
                        opacity: 0.18,
                        transform: 'rotate(20deg)',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                >
                    <path d="M50 200 C40 150 60 100 50 0" stroke="#b89ce6" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M50 120 Q30 110 40 90 Q50 100 50 120 Z" fill="#b89ce6" />
                    <path d="M50 100 Q70 90 60 70 Q50 80 50 100 Z" fill="#b89ce6" />
                    <path d="M50 80 Q30 70 40 50 Q50 60 50 80 Z" fill="#b89ce6" />
                    <path d="M50 60 Q70 50 60 30 Q50 40 50 60 Z" fill="#b89ce6" />
                    <path d="M50 40 Q30 30 40 10 Q50 20 50 40 Z" fill="#b89ce6" />
                </svg>

                {/* DATE */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    fontFamily: "'Caveat', cursive",
                    fontSize: '0.85rem',
                    color: '#b89ce6',
                    opacity: 0.5,
                    marginBottom: '2rem',
                }}>
                    17 March
                </div>

                {/* SECTION TITLE */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    fontFamily: "'Caveat', cursive",
                    fontSize: '1rem',
                    color: '#b89ce6',
                    opacity: 0.6,
                    marginBottom: '2rem',
                }}>
                    things you don't know you do —
                </div>

                {/* OBSERVATIONS */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    {OBSERVATIONS.map((item, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.6, delay: item.delay }}
                            style={{
                                fontFamily: "'Caveat', cursive",
                                fontSize: item.special ? '1.08rem' : '1rem',
                                color: item.special ? '#b89ce6' : '#3e3552',
                                lineHeight: 1.7,
                                marginBottom: '1.8rem',
                            }}
                        >
                            <span style={{ color: '#b89ce6', opacity: 0.4, fontSize: '0.85rem', marginRight: '8px' }}>
                                —
                            </span>
                            {item.text}
                        </motion.p>
                    ))}
                </div>

                {/* FOOTER */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    marginTop: '3rem',
                    textAlign: 'right',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: '0.8rem',
                    color: '#3e3552',
                    opacity: 0.35,
                }}>
                    observed. not imagined.
                </div>
            </div>
        </section>
    );
}
