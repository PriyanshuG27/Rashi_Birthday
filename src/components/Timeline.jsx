import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ENTRIES = [
    {
        year: "2024",
        label: "first year, first hello.",
        memory: "didn't know yet. but something stayed.",
    },
    {
        year: "a few months in",
        label: "started talking properly.",
        memory: "the kind of talking where you lose track of time.",
    },
    {
        year: "2025",
        label: "next semester.",
        memory: "this is when it became real.",
    },
    {
        year: "the hard part",
        label: "fights. mistakes. distance.",
        memory: "she stayed anyway. that says everything.",
    },
    {
        year: "now",
        label: "still here.",
        memory: "the best decision either of us made.",
    },
];

/* Typewriter that fires when visible */
function TypewriterMemory({ text, isVisible }) {
    const [displayed, setDisplayed] = useState('');
    const hasStarted = useRef(false);

    useEffect(() => {
        if (!isVisible || hasStarted.current) return;
        hasStarted.current = true;

        let i = 0;
        let cancelled = false;

        const typeNext = () => {
            if (cancelled || i >= text.length) return;
            i++;
            setDisplayed(text.slice(0, i));
            const delay = 45 + Math.random() * 40;
            setTimeout(typeNext, '.,!?'.includes(text[i - 1]) ? delay + 160 : delay);
        };

        setTimeout(typeNext, 300);
        return () => { cancelled = true; };
    }, [isVisible, text]);

    return (
        <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: '0.95rem',
            color: '#3e3552',
            opacity: 0.75,
        }}>
            {displayed}
            {displayed.length < text.length && isVisible && (
                <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    style={{
                        display: 'inline-block',
                        width: 1,
                        height: '1em',
                        background: '#b89ce6',
                        marginLeft: 2,
                        verticalAlign: 'text-bottom',
                    }}
                />
            )}
        </span>
    );
}

function TimelineCard({ entry, index }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const isLeft = index % 2 === 0;
    const rotation = isLeft ? -1.5 : 1.2;
    const tapeRotation = isLeft ? -3 : 2;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30, x: isLeft ? -20 : 20 }}
            animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            style={{
                position: 'relative',
                width: '280px',
                background: '#fffdf9',
                border: '1px solid rgba(184,156,230,0.25)',
                boxShadow: '2px 4px 12px rgba(0,0,0,0.06)',
                borderRadius: 6,
                padding: '28px 22px 22px',
                transform: `rotate(${rotation}deg)`,
                alignSelf: isLeft ? 'flex-end' : 'flex-start',
                marginRight: isLeft ? '2rem' : 'auto',
                marginLeft: isLeft ? 'auto' : '2rem',
            }}
        >
            {/* Washi tape at top */}
            <div style={{
                position: 'absolute',
                top: -7,
                left: '50%',
                marginLeft: -22,
                width: 44,
                height: 14,
                background: 'rgba(220,210,240,0.7)',
                borderRadius: 2,
                transform: `rotate(${tapeRotation}deg)`,
            }} />

            {/* Year */}
            <p style={{
                fontFamily: "var(--font-handwriting)",
                fontSize: '1.2rem',
                color: '#b89ce6',
                marginBottom: 6,
                fontWeight: 600,
            }}>
                {entry.year}
            </p>

            {/* Label */}
            <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: 'italic',
                fontSize: '1rem',
                color: '#3e3552',
                marginBottom: 10,
                fontWeight: 500,
            }}>
                {entry.label}
            </p>

            {/* Typewriter memory */}
            <TypewriterMemory text={entry.memory} isVisible={isInView} />
        </motion.div>
    );
}

export default function Timeline() {
    return (
        <section id="timeline" style={{
            padding: '5rem 2rem',
            position: 'relative',
            maxWidth: 800,
            margin: '0 auto',
        }}>
            {/* Section title */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                }}
            >
                <p style={{
                    fontFamily: "var(--font-handwriting)",
                    fontSize: '1.4rem',
                    color: '#b89ce6',
                }}>
                    ✦ how we got here ✦
                </p>
            </motion.div>

            {/* Timeline container */}
            <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2.5rem',
            }}>
                {/* Vertical spine line */}
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        width: 1,
                        background: 'linear-gradient(to bottom, transparent, rgba(184,156,230,0.3), rgba(184,156,230,0.3), transparent)',
                        transform: 'translateX(-50%)',
                        zIndex: 0,
                    }}
                />

                {ENTRIES.map((entry, i) => (
                    <TimelineCard key={i} entry={entry} index={i} />
                ))}
            </div>
        </section>
    );
}
