import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useSound } from '../App';

const RECEIPT_LINES = [
    { text: 'RASHIII & CO.', type: 'header', delay: 0 },
    { text: 'est. somewhere in 2024', type: 'subheader', delay: 0.15 },
    { text: '─────────────────', type: 'divider', delay: 0.25 },
    { text: 'what actually changed', type: 'section', delay: 0.35 },
    { text: '─────────────────', type: 'divider', delay: 0.45 },
    { text: 'started apologising     ✓', type: 'item', delay: 0.55 },
    { text: '(not just moving on)', type: 'note', delay: 0.65 },
    { text: '', type: 'spacer', delay: 0.7 },
    { text: 'stopped assuming worst  ✓', type: 'item', delay: 0.8 },
    { text: '(took a while. she helped.)', type: 'note', delay: 0.9 },
    { text: '', type: 'spacer', delay: 0.95 },
    { text: 'learned the difference', type: 'item', delay: 1.05 },
    { text: 'between forgiven        ✓', type: 'item', delay: 1.1 },
    { text: 'and understood', type: 'item', delay: 1.15 },
    { text: '(she gave both)', type: 'note', delay: 1.22 },
    { text: '', type: 'spacer', delay: 1.27 },
    { text: 'got better at staying   ✓', type: 'item', delay: 1.35 },
    { text: '(had a good example)', type: 'note', delay: 1.45 },
    { text: '─────────────────', type: 'divider', delay: 1.55 },
    { text: 'SUBTOTAL:    all of it', type: 'total', delay: 1.65 },
    { text: 'DISCOUNT:    none. ever.', type: 'total', delay: 1.72 },
    { text: 'TAX:         worth it', type: 'total', delay: 1.79 },
    { text: '─────────────────', type: 'divider', delay: 1.87 },
    { text: 'amount owed: unpayable', type: 'final', delay: 2.0 },
    { text: '', type: 'spacer', delay: 2.1 },
    { text: 'thank you for every', type: 'closing', delay: 2.2 },
    { text: 'chance you gave.', type: 'closing', delay: 2.3 },
    { text: '─────────────────', type: 'divider', delay: 2.4 },
    { text: '* keep receipt', type: 'footer', delay: 2.5 },
    { text: '  it matters.', type: 'footer', delay: 2.58 },
    { text: '─────────────────', type: 'divider', delay: 2.65 },
];

export default function Status() {
    const [isPrinted, setIsPrinted] = useState(false);
    const [isTornOff, setIsTornOff] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [showThanks, setShowThanks] = useState(false);
    const { playPrint } = useSound();

    // Track if we've already played the sound to prevent double-hits
    const soundPlayedRef = useRef(false);

    // Drag controls for tear-off
    const receiptControls = useAnimation();

    const handleDragEnd = (_, info) => {
        if (isTornOff) return;

        if (info.offset.y > 150 || info.velocity.y > 800) {
            setIsTornOff(true);
            receiptControls.start({
                y: "110vh",
                opacity: 0,
                rotate: 5,
                transition: { duration: 0.5, ease: "easeIn" }
            }).then(() => {
                setShowThanks(true);
            });
        }
    };

    const renderLine = (item, i) => {
        if (item.type === 'spacer') {
            return <div key={i} style={{ height: '0.8rem' }} />;
        }

        let style = {};
        switch (item.type) {
            case 'header':
                style = { fontFamily: "'Caveat', cursive", fontSize: '1.3rem', color: '#3e3552', fontWeight: 'bold', textAlign: 'center' };
                break;
            case 'subheader':
                style = { fontFamily: "'Caveat', cursive", fontSize: '0.85rem', color: '#3e3552', opacity: 0.5, textAlign: 'center' };
                break;
            case 'divider':
                style = { fontFamily: "'Courier New', Courier, monospace", fontSize: '0.75rem', color: 'rgba(62,53,82,0.2)', textAlign: 'center' };
                break;
            case 'section':
                style = { fontFamily: "'Caveat', cursive", fontSize: '0.9rem', color: '#b89ce6', textAlign: 'center' };
                break;
            case 'item':
                style = { fontFamily: "'Courier New', Courier, monospace", fontSize: '0.82rem', color: '#3e3552' };
                break;
            case 'note':
                style = { fontFamily: "'Caveat', cursive", fontSize: '0.85rem', color: '#3e3552', opacity: 0.45, paddingLeft: '12px', fontStyle: 'italic' };
                break;
            case 'total':
                style = { fontFamily: "'Courier New', Courier, monospace", fontSize: '0.82rem', color: '#3e3552' };
                break;
            case 'final':
                style = { fontFamily: "'Caveat', cursive", fontSize: '1.1rem', color: '#3e3552', textAlign: 'center', fontWeight: 600 };
                break;
            case 'closing':
                style = { fontFamily: "'Caveat', cursive", fontSize: '0.95rem', color: '#b89ce6', textAlign: 'center' };
                break;
            case 'footer':
                style = { fontFamily: "'Courier New', Courier, monospace", fontSize: '0.75rem', color: '#3e3552', opacity: 0.4 };
                break;
            default:
                break;
        }

        return (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: -4 }}
                animate={isPrinted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.2, delay: item.delay }}
                style={{ ...style, whiteSpace: 'pre', lineHeight: 1.4 }}
            >
                {item.text}
            </motion.div>
        );
    };

    return (
        <section id="status" style={{ padding: '6rem 2rem' }}>
            <div style={{
                maxWidth: '320px',
                margin: '0 auto',
                position: 'relative',
            }}>
                {/* Mini Printer SVG */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    opacity: 0.4
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b89ce6" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="10" y1="18" x2="14" y2="18" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {/* Printer Slot Wrapper */}
                <motion.div
                    onViewportEnter={() => {
                        if (!soundPlayedRef.current) {
                            playPrint();
                            soundPlayedRef.current = true;
                        }
                    }}
                    viewport={{ once: true, margin: "-300px" }}
                    style={{
                        position: 'relative',
                        minHeight: 500, // Enough height for the receipt
                        paddingTop: 14, // Room for the torn SVG top edge
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* The Thank You Message (Revealed after tear-off) */}
                    {showThanks && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                paddingTop: 40,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                zIndex: 0,
                            }}
                        >
                            <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.4rem', color: '#b89ce6', marginBottom: 6 }}>
                                receipt kept. ✦
                            </p>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: '0.85rem', opacity: 0.4, color: '#3e3552' }}>
                                it really does matter.
                            </p>
                        </motion.div>
                    )}

                    {/* Receipt Wrapper */}
                    <motion.div
                        initial={{ y: "-101%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true, margin: "-300px" }}
                        transition={{ duration: 0.8, ease: "linear" }}
                        onAnimationComplete={() => setIsPrinted(true)}
                        drag={isPrinted && !isTornOff ? "y" : false}
                        dragConstraints={{ top: 0 }}
                        dragElastic={{ top: 0.05, bottom: 0 }}
                        onDragStart={() => {
                            document.body.style.overflow = 'hidden';
                            setIsDragging(true);
                        }}
                        onDragEnd={(e, info) => {
                            document.body.style.overflow = 'auto';
                            setIsDragging(false);
                            handleDragEnd(e, info);
                        }}
                        animate={receiptControls}
                        style={{
                            background: '#fffdf9',
                            padding: '32px 28px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 20px 40px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(0,0,0,0.04)',
                            position: 'relative',
                            width: '100%',
                            zIndex: 1,
                            cursor: isPrinted && !isTornOff ? 'grab' : 'default',
                            display: showThanks ? 'none' : 'block',
                        }}
                        whileDrag={{ cursor: 'grabbing' }}
                    >
                        {/* Torn Edge Top */}
                        <svg width="100%" height="12"
                            style={{ position: 'absolute', top: -11, left: 0 }}
                            viewBox="0 0 320 12" preserveAspectRatio="none">
                            <path
                                d="M0,12 C20,4 40,10 60,6 C80,2 100,8 120,4 C140,0 160,8 180,5 C200,2 220,9 240,5 C260,1 280,7 300,4 C310,2 315,6 320,3 L320,12 Z"
                                fill="#fffdf9"
                            />
                        </svg>

                        {/* Receipt Content */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {RECEIPT_LINES.map((item, i) => renderLine(item, i))}

                            {/* Tear Indicator */}
                            <AnimatePresence>
                                {isPrinted && !isDragging && !isTornOff && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 }}
                                        style={{
                                            marginTop: '1.5rem',
                                            borderTop: '1px dashed rgba(62,53,82,0.15)',
                                            paddingTop: '8px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <span style={{
                                            fontFamily: "'Caveat', cursive",
                                            fontSize: '0.8rem',
                                            color: '#b89ce6',
                                            opacity: 0.5,
                                        }}>
                                            ↓ drag to tear
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Torn Edge Bottom */}
                        <svg width="100%" height="12"
                            style={{ position: 'absolute', bottom: -11, left: 0, transform: 'scaleY(-1)' }}
                            viewBox="0 0 320 12" preserveAspectRatio="none">
                            <path
                                d="M0,12 C20,4 40,10 60,6 C80,2 100,8 120,4 C140,0 160,8 180,5 C200,2 220,9 240,5 C260,1 280,7 300,4 C310,2 315,6 320,3 L320,12 Z"
                                fill="#fffdf9"
                            />
                        </svg>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
