import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useSound } from '../App';

const RECEIPT_LINES = [
    { text: 'RASHIII & CO.', type: 'header', delay: 0 },
    { text: 'emotional repair services', type: 'subheader', delay: 0.12 },
    { text: '─────────────────', type: 'divider', delay: 0.22 },
    { text: 'what she fixed', type: 'section', delay: 0.32 },
    { text: '(without making it a thing)', type: 'note', delay: 0.40 },
    { text: '─────────────────', type: 'divider', delay: 0.50 },
    { text: 'when I went quiet —          ✓', type: 'item', delay: 0.60 },
    { text: 'she just knew.', type: 'item', delay: 0.66 },
    { text: '(bina bataye. every time.)', type: 'note', delay: 0.74 },
    { text: '', type: 'spacer', delay: 0.80 },
    { text: 'apologizing badly            ✓', type: 'item', delay: 0.90 },
    { text: 'she showed me how.', type: 'item', delay: 0.96 },
    { text: '(by doing it first. always.)', type: 'note', delay: 1.04 },
    { text: '', type: 'spacer', delay: 1.10 },
    { text: '"irritating." — took me way  ✓', type: 'item', delay: 1.20 },
    { text: 'too long to understand.', type: 'item', delay: 1.26 },
    { text: '(it was concern, not anger)', type: 'note', delay: 1.34 },
    { text: '', type: 'spacer', delay: 1.40 },
    { text: 'the hard part. she stayed.   ✓', type: 'item', delay: 1.50 },
    { text: "didn't have to. did anyway.", type: 'item', delay: 1.56 },
    { text: "(that one I won't forget.)", type: 'note', delay: 1.64 },
    { text: '', type: 'spacer', delay: 1.70 },
    { text: "patience I didn't deserve    ✓", type: 'item', delay: 1.80 },
    { text: 'given anyway.', type: 'item', delay: 1.86 },
    { text: '(no conditions attached)', type: 'note', delay: 1.94 },
    { text: '', type: 'spacer', delay: 2.00 },
    { text: 'late night overthinking       ✓', type: 'item', delay: 2.10 },
    { text: 'she listened anyway.', type: 'item', delay: 2.16 },
    { text: "(didn't even complain)", type: 'note', delay: 2.24 },
    { text: '─────────────────', type: 'divider', delay: 2.34 },
    { text: 'TODAY:       her birthday', type: 'total', delay: 2.44 },
    { text: 'STILL OWE:   bahut kuch', type: 'total', delay: 2.52 },
    { text: 'DUE DATE:    ongoing', type: 'total', delay: 2.60 },
    { text: 'WORTH IT:    obviously.', type: 'total', delay: 2.68 },
    { text: '─────────────────', type: 'divider', delay: 2.78 },
    { text: 'VOID IF: she ever thinks', type: 'final', delay: 2.90 },
    { text: "         she wasn't worth it.", type: 'final', delay: 2.98 },
    { text: '─────────────────', type: 'divider', delay: 3.08 },
    { text: 'achaa.', type: 'closing', delay: 3.20 },
    { text: '(no explanation needed)', type: 'note', delay: 3.28 },
    { text: '─────────────────', type: 'divider', delay: 3.38 },
    { text: '* keep this one.', type: 'footer', delay: 3.48 },
    { text: '  17 March.', type: 'footer', delay: 3.56 },
    { text: '─────────────────', type: 'divider', delay: 3.64 },
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

        if (info.offset.x > 120 || info.velocity.x > 600) {
            setIsTornOff(true);
            receiptControls.start({
                x: "110vw",
                opacity: 0,
                rotate: 8,
                y: 30,
                transition: { duration: 0.45, ease: "easeIn" }
            }).then(() => {
                setShowThanks(true);
            });
        } else {
            // Snap back if not torn far enough
            receiptControls.start({
                x: 0,
                rotate: 0,
                transition: { type: 'spring', stiffness: 300, damping: 25 }
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

        if (item.type === 'item' && item.text.includes('✓')) {
            const mainText = item.text.replace('✓', '');
            return (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -4 }}
                    animate={isPrinted ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.2, delay: item.delay }}
                    style={{
                        fontFamily: "'Courier New', Courier, monospace",
                        fontSize: '0.82rem',
                        color: '#3e3552',
                        whiteSpace: 'pre',
                        lineHeight: 1.4,
                    }}
                >
                    {mainText}
                    <motion.span
                        initial={{ scale: 0, rotate: -20, opacity: 0 }}
                        animate={isPrinted ? { scale: 1, rotate: 0, opacity: 1 } : {}}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 12,
                            delay: item.delay + 0.18,
                        }}
                        style={{
                            display: 'inline-block',
                            color: '#b89ce6',
                            transformOrigin: 'center',
                            fontWeight: 600,
                        }}
                    >
                        ✓
                    </motion.span>
                </motion.div>
            );
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
                            transition={{ duration: 1 }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                paddingTop: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                paddingBottom: 64,
                                gap: 12,
                                zIndex: 0,
                            }}
                        >
                            <div style={{
                                width: 48,
                                height: 14,
                                background: 'rgba(220,210,240,0.75)',
                                borderRadius: 2,
                                transform: 'rotate(-3deg)',
                                marginBottom: 8,
                            }} />

                            <p style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontStyle: 'italic',
                                fontSize: '1.15rem',
                                color: '#3e3552',
                                textAlign: 'center',
                                lineHeight: 1.7,
                                maxWidth: 240,
                            }}>
                                you kept it.
                            </p>

                            <p style={{
                                fontFamily: "'Caveat', cursive",
                                fontSize: '1rem',
                                color: '#b89ce6',
                                textAlign: 'center',
                                opacity: 0.7,
                            }}>
                                that's very you. ✦
                            </p>

                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                style={{
                                    height: 1,
                                    width: 80,
                                    background: 'linear-gradient(90deg, transparent, #b89ce6, transparent)',
                                    marginTop: 8,
                                }}
                            />

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.4 }}
                                transition={{ delay: 1.4, duration: 0.8 }}
                                style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontStyle: 'italic',
                                    fontSize: '0.82rem',
                                    color: '#3e3552',
                                    textAlign: 'center',
                                }}
                            >
                                17 March matters.
                            </motion.p>
                        </motion.div>
                    )}

                    {/* Receipt Wrapper */}
                    <motion.div
                        initial={{ y: "-101%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true, margin: "-300px" }}
                        transition={{ duration: 0.8, ease: "linear" }}
                        onAnimationComplete={() => setIsPrinted(true)}
                        drag={isPrinted && !isTornOff ? "x" : false}
                        dragConstraints={{ left: 0 }}
                        dragElastic={{ left: 0.05, right: 0 }}
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
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4, delay: 0.5 }}
                                        style={{
                                            marginTop: '1.5rem',
                                            borderTop: '1px dashed rgba(62,53,82,0.15)',
                                            paddingTop: '8px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <motion.span
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{
                                                duration: 1.8,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: 0.8
                                            }}
                                            style={{
                                                display: 'inline-block',
                                                fontFamily: "'Caveat', cursive",
                                                fontSize: '0.8rem',
                                                color: '#b89ce6',
                                                opacity: 0.5,
                                            }}
                                        >
                                            drag → to tear
                                        </motion.span>
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
