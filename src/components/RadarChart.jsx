import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useSound } from '../App';

const axisData = [
    { label: "patience with me", tip: "even when I deserved none of it." },
    { label: "knowing when I'm off", tip: "before I even said anything." },
    { label: "saying the right thing", tip: "which is sometimes saying nothing." },
    { label: "staying anyway", tip: "that one matters most." },
    { label: "making it look easy", tip: "it isn't. you just make it seem that way." },
];

const terminalConfig = [
    { text: "> INITIALISING ASSESSMENT..." },
    { text: "> SUBJECT: Rashiii" },
    { text: "> DATE: 17 March" },
    { text: "> CALCULATING...", progress: { target: '83%', duration: 1.2, label: '83%' }, delayAfter: 1600 },
    { text: "> RECALCULATING...", progress: { target: '100%', duration: 0.6, label: '100%' }, delayAfter: 800 },
    { text: "> RESULT: off the charts." }
];
const TearEdge = () => (
    <svg viewBox="0 0 100 4" preserveAspectRatio="none" style={{ position: 'absolute', bottom: -3.5, left: -0.5, right: -0.5, width: 'calc(100% + 1px)', height: 4, fill: '#fffdf9' }}>
        <path d="M0,0 L0,4 L2,1 L4,3 L6,0 L8,3 L10,1 L12,4 L14,0 L16,2 L18,0 L20,3 L22,1 L24,4 L26,0 L28,2 L30,0 L32,3 L34,1 L36,4 L38,0 L40,2 L42,0 L44,3 L46,1 L48,4 L50,0 L52,2 L54,0 L56,3 L58,1 L60,4 L62,0 L64,2 L66,0 L68,3 L70,1 L72,4 L74,0 L76,2 L78,0 L80,3 L82,1 L84,4 L86,0 L88,2 L90,0 L92,3 L94,1 L96,4 L98,0 L100,3 L100,0 Z" />
        <path d="M0,0 L0,4 L2,1 L4,3 L6,0 L8,3 L10,1 L12,4 L14,0 L16,2 L18,0 L20,3 L22,1 L24,4 L26,0 L28,2 L30,0 L32,3 L34,1 L36,4 L38,0 L40,2 L42,0 L44,3 L46,1 L48,4 L50,0 L52,2 L54,0 L56,3 L58,1 L60,4 L62,0 L64,2 L66,0 L68,3 L70,1 L72,4 L74,0 L76,2 L78,0 L80,3 L82,1 L84,4 L86,0 L88,2 L90,0 L92,3 L94,1 L96,4 L98,0 L100,3 L100,0" style={{ fill: 'none', stroke: 'rgba(184,156,230,0.15)', strokeWidth: 0.2 }} />
    </svg>
);

const TerminalLines = ({ lines, isFast, onComplete }) => {
    const [visibleLines, setVisibleLines] = useState([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [showFinalStar, setShowFinalStar] = useState(false);

    useEffect(() => {
        let cancel = false;

        if (currentLineIndex >= lines.length) {
            const t = setTimeout(() => {
                if (!cancel) {
                    setShowFinalStar(true);
                    setTimeout(() => !cancel && onComplete(), 700);
                }
            }, isFast ? 100 : 300);
            return () => clearTimeout(t);
        }

        const line = lines[currentLineIndex];

        if (currentCharIndex < line.text.length) {
            const delay = isFast ? 5 : 42 + Math.random() * 46;
            const t = setTimeout(() => {
                if (!cancel) setCurrentCharIndex(c => c + 1);
            }, delay);
            return () => clearTimeout(t);
        } else {
            const delay = isFast ? 50 : (line.delayAfter || 200);
            const t = setTimeout(() => {
                if (!cancel) {
                    setVisibleLines(v => [...v, line]);
                    setCurrentLineIndex(i => i + 1);
                    setCurrentCharIndex(0);
                }
            }, delay);
            return () => clearTimeout(t);
        }
    }, [currentLineIndex, currentCharIndex, lines, isFast, onComplete]);

    useEffect(() => {
        setVisibleLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
        setShowFinalStar(false);
    }, [isFast, lines]);

    return (
        <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '0.85rem', color: '#3e3552', lineHeight: 2.0, textAlign: 'left' }}>
            {visibleLines.map((line, i) => {
                const isResult = line.text.includes("RESULT:");
                return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, fontWeight: isResult ? 'bold' : 'normal', color: isResult ? '#b89ce6' : '#3e3552' }}>
                        <span style={{ color: '#b89ce6', opacity: 0.7 }}>❯ </span>
                        <span>{line.text.replace(/^> /, '')}</span>
                        {isResult && showFinalStar && (
                            <motion.span
                                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                                style={{ color: '#b89ce6', display: 'inline-block', marginLeft: 4 }}
                            >
                                ✦
                            </motion.span>
                        )}
                        {line.progress && (
                            <React.Fragment>
                                <div style={{ height: 4, width: 120, background: 'rgba(184,156,230,0.12)', borderRadius: 2, marginTop: 2, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: line.progress.target, background: 'linear-gradient(90deg, #b89ce6, #f4b6d2)', boxShadow: '0 0 8px rgba(184,156,230,0.5)', borderRadius: 2 }} />
                                </div>
                                <span style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '0.8rem', color: '#b89ce6', marginLeft: 8 }}>{line.progress.label}</span>
                            </React.Fragment>
                        )}
                    </div>
                );
            })}
            {currentLineIndex < lines.length && (
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ color: '#b89ce6', opacity: 0.7 }}>❯ </span>
                    <span>{lines[currentLineIndex].text.replace(/^> /, '').slice(0, currentCharIndex)}</span>
                    {currentCharIndex === lines[currentLineIndex].text.length && lines[currentLineIndex].progress && (
                        <React.Fragment>
                            <div style={{ height: 4, width: 120, background: 'rgba(184,156,230,0.12)', borderRadius: 2, marginTop: 2, overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: lines[currentLineIndex].progress.target }}
                                    transition={{ duration: isFast ? 0.1 : lines[currentLineIndex].progress.duration, ease: "linear" }}
                                    style={{ height: '100%', background: 'linear-gradient(90deg, #b89ce6, #f4b6d2)', boxShadow: '0 0 8px rgba(184,156,230,0.5)', borderRadius: 2 }}
                                />
                            </div>
                            <span style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '0.8rem', color: '#b89ce6', marginLeft: 8 }}>{lines[currentLineIndex].progress.label}</span>
                        </React.Fragment>
                    )}
                    <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ width: 1, height: '0.9em', background: '#b89ce6', opacity: 0.7, marginLeft: 2 }} />
                </div>
            )}
        </div>
    );
};

export default function RadarChart() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-30% 0px" });
    const sounds = useSound();

    const [phase, setPhase] = useState('idle');
    const [isRecalibrating, setIsRecalibrating] = useState(false);
    const [hoveredAxis, setHoveredAxis] = useState(null);
    const [lockedErrors, setLockedErrors] = useState({});
    const [scoresRevealed, setScoresRevealed] = useState(0);
    const [shiveringIndex, setShiveringIndex] = useState(-1);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const headingText = "a completely objective assessment";
    const headingVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.018 } }
    };
    const charVariants = {
        hidden: { opacity: 0, y: 5 },
        visible: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        if (isInView && phase === 'idle') {
            setPhase('gate-init');
        }
    }, [isInView, phase]);

    useEffect(() => {
        if (phase === 'gate-init') {
            const t = setTimeout(() => setPhase('gate-line'), 100);
            return () => clearTimeout(t);
        } else if (phase === 'gate-line') {
            const t = setTimeout(() => setPhase('gate-typing'), 800);
            return () => clearTimeout(t);
        } else if (phase === 'gate-typing') {
            const t = setTimeout(() => setPhase('gate-underline'), headingText.length * 18 + 100);
            return () => clearTimeout(t);
        } else if (phase === 'gate-underline') {
            const t = setTimeout(() => setPhase('terminal'), 400);
            return () => clearTimeout(t);
        }
    }, [phase]);

    const handleTerminalComplete = () => {
        setPhase('chart-entering');
        setTimeout(() => {
            // chart drawing phase effectively starts
        }, 600);
    };

    useEffect(() => {
        if (phase === 'chart-entering') {
            // Wait for 1.6s draw + 0.4s pause + 2.0s scribble + 0.5s pause
            const t = setTimeout(() => setPhase('scoring'), 4500);
            return () => clearTimeout(t);
        }
    }, [phase]);

    useEffect(() => {
        if (phase === 'scoring') {
            let cancel = false;
            const revealNext = (count) => {
                if (cancel) return;
                if (count > 5) {
                    setTimeout(() => !cancel && setPhase('annotating'), 500);
                    return;
                }
                setShiveringIndex(count - 1);
                setTimeout(() => {
                    if (cancel) return;
                    setScoresRevealed(count);
                    sounds.playChime();
                }, 150);
                setTimeout(() => revealNext(count + 1), 400);
            };
            setTimeout(() => revealNext(1), 200);
            return () => { cancel = true; };
        }
    }, [phase, sounds]);

    useEffect(() => {
        if (phase === 'annotating') {
            const t = setTimeout(() => setPhase('stamping'), 1900);
            return () => clearTimeout(t);
        }
    }, [phase]);

    useEffect(() => {
        if (phase === 'stamping') {
            sounds.playWaxCrack();
            const t = setTimeout(() => setPhase('done'), 500);
            return () => clearTimeout(t);
        }
    }, [phase, sounds]);

    const handleRecalibrate = () => {
        setIsRecalibrating(true);
        setScoresRevealed(0);
        setLockedErrors({});
        setHoveredAxis(null);
        setPhase('terminal');
    };

    const handleDragEnd = (i) => {
        setLockedErrors(prev => ({ ...prev, [i]: true }));
        setTimeout(() => {
            setLockedErrors(prev => ({ ...prev, [i]: false }));
        }, 1800);
    };

    const radius = isMobile ? 108 : 150;
    const svgSize = isMobile ? 260 : 360;
    const vBox = `-${svgSize / 2} -${svgSize / 2} ${svgSize} ${svgSize}`;

    const getAxisPos = (i, r = radius) => {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
    };

    const polygonPoints = Array.from({ length: 5 }).map((_, i) => `${getAxisPos(i).x},${getAxisPos(i).y}`).join(' ');
    const rings = [0.25, 0.5, 0.75, 1.0];

    const getScribblePath = () => {
        const startY = -radius + 5;
        const endY = radius;
        const width = radius - 5;
        let path = `M -${width} ${startY} `;
        for (let y = startY + 5; y <= endY; y += 5) {
            const x = ((Math.round((y - startY) / 5)) % 2 === 0) ? width : -width;
            path += `L ${x} ${y} `;
        }
        return path;
    };

    const showGrid = phase !== 'idle' && phase !== 'gate-init' && phase !== 'gate-line' && phase !== 'gate-typing';
    const showGateLine = phase !== 'idle' && phase !== 'gate-init';
    const showTyping = phase !== 'idle' && phase !== 'gate-init' && phase !== 'gate-line';
    const showUnderline = phase !== 'idle' && phase !== 'gate-init' && phase !== 'gate-line' && phase !== 'gate-typing';

    // Using string includes to determine chart state
    const isChartVisible = ['chart-entering', 'scoring', 'annotating', 'stamping', 'done'].includes(phase);

    return (
        <section ref={ref} className="radar-section" style={{
            position: 'relative',
            padding: '80px 20px',
            minHeight: '100vh',
            background: phase === 'idle' ? 'transparent' : '#fffdf9',
            transition: 'background 0.8s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {/* Grid background */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                backgroundImage: `linear-gradient(rgba(184,156,230,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(184,156,230,0.035) 1px, transparent 1px)`,
                backgroundSize: '44px 44px',
                opacity: showGrid ? 1 : 0,
                transition: 'opacity 0.4s ease'
            }} />

            {/* Radial glow */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 500px 400px at center, rgba(184,156,230,0.06) 0%, transparent 70%)',
                opacity: isChartVisible ? 1 : 0,
                transition: 'opacity 0.6s ease'
            }} />

            {/* Background DRAFT */}
            <div style={{
                position: 'absolute', fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                fontSize: '6rem', color: '#b89ce6', opacity: 0.018, transform: 'rotate(-30deg)',
                pointerEvents: 'none', zIndex: 0
            }}>
                DRAFT
            </div>

            {/* Horizontal Gate Line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, width: '100%' }}>
                {showGateLine && (
                    <svg preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                        <motion.line
                            x1="0" y1="0.5" x2="100%" y2="0.5"
                            stroke="#b89ce6" strokeWidth="1"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </svg>
                )}
            </div>

            <div style={{ position: 'relative', marginBottom: '2rem', zIndex: 1, display: showTyping ? 'inline-block' : 'none' }}>
                <motion.h2
                    variants={headingVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ fontFamily: "'Caveat', cursive", fontSize: '1.1rem', color: '#b89ce6', opacity: 0.55, margin: 0, position: 'relative', zIndex: 1 }}
                >
                    {headingText.split('').map((char, i) => (
                        <motion.span key={i} variants={charVariants}>{char}</motion.span>
                    ))}
                </motion.h2>
                {showUnderline && (
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        style={{ height: 1, background: 'rgba(184,156,230,0.5)', width: '100%', transformOrigin: 'left', marginTop: 4, position: 'absolute', bottom: -4 }}
                    />
                )}
            </div>

            <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
                <AnimatePresence mode="wait">
                    {(phase === 'terminal' || phase === 'chart-entering' || phase === 'idle') && (
                        <AnimatePresence>
                            {phase === 'terminal' && (
                                <motion.div
                                    key="terminal"
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 60, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    style={{
                                        background: '#fffdf9',
                                        border: '1px solid rgba(184,156,230,0.2)',
                                        boxShadow: '2px 6px 20px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(184,156,230,0.08)',
                                        borderRadius: '8px 8px 0 0',
                                        padding: '52px 36px 28px', // Increased top padding because 32px absolute header
                                        maxWidth: 460,
                                        width: '100%',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, height: 32,
                                        background: 'rgba(184,156,230,0.08)',
                                        borderBottom: '1px solid rgba(184,156,230,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderRadius: '8px 8px 0 0'
                                    }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(184,156,230,0.3)' }} />
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(244,182,210,0.3)' }} />
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(184,156,230,0.2)' }} />
                                        </div>
                                        <div style={{ fontFamily: "'Caveat', cursive", fontSize: '0.72rem', color: '#3e3552', opacity: 0.35 }}>
                                            DIAGNOSTIC_REPORT.exe
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 8 }}>
                                        <TerminalLines lines={terminalConfig} isFast={isRecalibrating} onComplete={handleTerminalComplete} />
                                    </div>
                                    <TearEdge />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}

                    {isChartVisible && (
                        <motion.div key="chart" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}>
                            <div style={{ position: 'relative', width: svgSize, height: svgSize }}>
                                <svg width={svgSize} height={svgSize} viewBox={vBox} style={{ overflow: 'visible' }}>
                                    <defs>
                                        <filter id="rough">
                                            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="5" />
                                            <feDisplacementMap in="SourceGraphic" scale="1.5" />
                                        </filter>
                                        <clipPath id="polygon-clip">
                                            <polygon points={polygonPoints} />
                                        </clipPath>
                                    </defs>

                                    {rings.map((scale, i) => (
                                        <motion.polygon
                                            key={`ring-${i}`}
                                            points={polygonPoints}
                                            initial={{ opacity: 0, scale: scale * 0.9 }}
                                            animate={{ opacity: 1, scale: scale }}
                                            transition={{ duration: 0.4, delay: i * 0.12 }}
                                            style={{
                                                stroke: 'rgba(184,156,230,0.12)', strokeDasharray: '3 5', fill: 'none', filter: 'url(#rough)', transformOrigin: '0px 0px'
                                            }}
                                        />
                                    ))}

                                    {axisData.map((_, i) => (
                                        <motion.line
                                            key={`axis-${i}`}
                                            x1={0} y1={0} x2={getAxisPos(i).x} y2={getAxisPos(i).y}
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.6, delay: rings.length * 0.12 + i * 0.15 }}
                                            style={{ stroke: 'rgba(184,156,230,0.25)', strokeWidth: 1, filter: 'url(#rough)' }}
                                        />
                                    ))}

                                    {/* Base Fill */}
                                    <motion.polygon
                                        points={polygonPoints}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 1.6 }}
                                        style={{ fill: "rgba(184,156,230,0.10)" }}
                                    />

                                    <g clipPath="url(#polygon-clip)">
                                        <motion.path
                                            d={getScribblePath()}
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ pathLength: { duration: 2.0, delay: 2.0, ease: 'easeOut' }, opacity: { duration: 0.3, delay: 2.0 } }}
                                            style={{ stroke: 'rgba(184,156,230,0.09)', strokeWidth: 16, strokeLinecap: 'round', fill: 'none' }}
                                        />
                                        <motion.path
                                            d={getScribblePath()}
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ pathLength: { duration: 2.0, delay: 2.3, ease: 'easeOut' }, opacity: { duration: 0.3, delay: 2.3 } }}
                                            style={{ stroke: 'rgba(184,156,230,0.05)', strokeWidth: 16, strokeLinecap: 'round', fill: 'none', rotate: 30, transformOrigin: '0px 0px' }}
                                        />
                                    </g>

                                    {['scoring', 'annotating', 'stamping', 'done'].includes(phase) ? (
                                        axisData.map((_, i) => {
                                            const { x, y } = getAxisPos(i);
                                            const labelOffset = getAxisPos(i, radius + (isMobile ? 15 : 25));
                                            const isRevealed = scoresRevealed > i;
                                            const scorePos = getAxisPos(i, radius - 28);

                                            return (
                                                <g key={`score-${i}`}>
                                                    <text
                                                        x={labelOffset.x} y={labelOffset.y}
                                                        textAnchor="middle" dominantBaseline="middle"
                                                        onMouseEnter={() => !isMobile && setHoveredAxis(i)}
                                                        onMouseLeave={() => !isMobile && setHoveredAxis(null)}
                                                        style={{
                                                            fontFamily: 'Inter', fontSize: isMobile ? '0.65rem' : '0.8rem',
                                                            fill: '#3e3552', cursor: !isMobile ? 'pointer' : 'default', opacity: 0.8
                                                        }}
                                                    >
                                                        {axisData[i].label}
                                                    </text>

                                                    <AnimatePresence>
                                                        {!isRevealed ? (
                                                            <motion.text
                                                                key={`q-${i}`}
                                                                x={scorePos.x}
                                                                y={scorePos.y}
                                                                textAnchor="middle" dominantBaseline="middle"
                                                                animate={shiveringIndex === i ? { rotate: [-5, 5, -5, 5, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                                                                transition={{ duration: 0.15 }}
                                                                exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
                                                                style={{ fontFamily: "'Caveat', cursive", fontSize: '0.9rem', fill: '#b89ce6', opacity: 0.5, transformOrigin: 'center' }}
                                                            >
                                                                ?
                                                            </motion.text>
                                                        ) : (
                                                            <motion.text
                                                                key={`10-${i}`}
                                                                x={scorePos.x}
                                                                y={scorePos.y}
                                                                textAnchor="middle" dominantBaseline="middle"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: [0, 1.4, 1] }}
                                                                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                                                                style={{ fontFamily: "'Caveat', cursive", fontSize: '1.2rem', fill: '#b89ce6', fontWeight: 600, transformOrigin: 'center' }}
                                                            >
                                                                10
                                                            </motion.text>
                                                        )}
                                                    </AnimatePresence>

                                                    {isRevealed && (
                                                        <motion.g initial={{ x, y }} style={{ x, y }}>
                                                            <motion.circle
                                                                r="5" cx={0} cy={0} fill="#b89ce6"
                                                                drag
                                                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                                                dragElastic={0.25}
                                                                onDragEnd={() => handleDragEnd(i)}
                                                                style={{ cursor: 'grab' }}
                                                                whileDrag={{ cursor: 'grabbing', scale: 1.2 }}
                                                            />
                                                        </motion.g>
                                                    )}
                                                </g>
                                            );
                                        })
                                    ) : null}

                                    {!isMobile && ['annotating', 'stamping', 'done'].includes(phase) && (
                                        <g className="annotations">
                                            {/* Note from user: don't ask how long this took --> escaped nicely here */}
                                            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.3 }}>
                                                <text x="-165" y="105" textAnchor="end" style={{ fontFamily: "'Caveat', cursive", fontSize: '0.78rem', fill: '#b89ce6' }}>this one especially.</text>
                                                <polygon points="-120,135 -125,130 -125,140" fill="rgba(184,156,230,0.5)" />
                                            </motion.g>
                                            <motion.path d="M -160 110 Q -170 140 -120 135" stroke="rgba(184,156,230,0.5)" strokeWidth="1" fill="none" filter="url(#rough)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0 }} />

                                            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + 0.5, duration: 0.3 }}>
                                                <text x="55" y="30" style={{ fontFamily: "'Caveat', cursive", fontSize: '0.78rem', fill: '#b89ce6' }}>yes I measured this properly.</text>
                                                <polygon points="10,5 15,10 15,0" fill="rgba(184,156,230,0.5)" />
                                            </motion.g>
                                            <motion.path d="M 50 30 Q 30 10 10 5" stroke="rgba(184,156,230,0.5)" strokeWidth="1" fill="none" filter="url(#rough)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5 }} />

                                            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + 1.0, duration: 0.3 }}>
                                                <text x="65" y="-160" style={{ fontFamily: "'Caveat', cursive", fontSize: '0.78rem', fill: '#b89ce6' }}>don't ask how long this took.</text>
                                                <polygon points="10,-130 15,-135 15,-125" fill="rgba(184,156,230,0.5)" />
                                            </motion.g>
                                            <motion.path d="M 60 -160 Q 30 -140 10 -130" stroke="rgba(184,156,230,0.5)" strokeWidth="1" fill="none" filter="url(#rough)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 1.0 }} />
                                        </g>
                                    )}

                                    {['stamping', 'done'].includes(phase) && (
                                        <motion.g
                                            initial={{ scale: 2, rotate: -25, opacity: 0 }}
                                            animate={{
                                                scale: [2, 1, 1.04, 1],
                                                rotate: [-25, -12, -12, -12],
                                                opacity: [0, 0.65, 0.65, 0.65]
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                times: [0, 0.4, 0.7, 1],
                                                ease: ["easeIn", "easeOut", "easeInOut"]
                                            }}
                                            style={{ transformOrigin: '0px 0px', x: isMobile ? 30 : 60, y: isMobile ? 30 : 60 }}
                                        >
                                            <filter id="bleed"><feGaussianBlur stdDeviation="0.4" /></filter>
                                            <g filter="url(#bleed)">
                                                <circle r={isMobile ? "35" : "45"} fill="none" stroke="rgba(184,156,230,0.6)" strokeWidth="2" strokeDasharray="4 3" />
                                                <circle r={isMobile ? "30" : "40"} fill="none" stroke="rgba(184,156,230,0.6)" strokeWidth="1" />
                                                <text textAnchor="middle" dominantBaseline="middle" y="2" style={{ fontFamily: "'Caveat', cursive", fontSize: isMobile ? '0.8rem' : '1.1rem', fill: 'rgba(184,156,230,0.7)', fontWeight: 'bold' }}>VERIFIED ✓</text>
                                            </g>
                                        </motion.g>
                                    )}
                                </svg>

                                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                                    <AnimatePresence>
                                        {hoveredAxis !== null && !isMobile && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                style={{
                                                    position: 'absolute',
                                                    left: `calc(50% + ${getAxisPos(hoveredAxis, radius + 40).x}px)`,
                                                    top: `calc(50% + ${getAxisPos(hoveredAxis, radius + 40).y}px)`,
                                                    transform: 'translate(-50%, -50%)',
                                                    background: '#fffdf9',
                                                    padding: '10px 14px',
                                                    borderRadius: 6,
                                                    boxShadow: '2px 4px 12px rgba(0,0,0,0.08)',
                                                    width: 'max-content',
                                                    maxWidth: 200,
                                                    zIndex: 20
                                                }}
                                            >
                                                <div style={{
                                                    position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%) rotate(-3deg)',
                                                    width: 36, height: 12, background: 'rgba(220,210,240,0.8)',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                }} />
                                                <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '0.8rem', color: '#3e3552' }}>
                                                    {axisData[hoveredAxis].tip}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <AnimatePresence>
                                        {Object.keys(lockedErrors).map(i => lockedErrors[i] && (
                                            <motion.div
                                                key={`error-${i}`}
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                style={{
                                                    position: 'absolute',
                                                    left: `calc(50% + ${getAxisPos(i).x + 15}px)`,
                                                    top: `calc(50% + ${getAxisPos(i).y - 20}px)`,
                                                    fontFamily: "'Courier New', Courier, monospace",
                                                    fontSize: '0.7rem',
                                                    color: '#e85d75',
                                                    background: 'white',
                                                    border: '1px solid rgba(232,93,117,0.3)',
                                                    padding: '2px 6px',
                                                    borderRadius: 4,
                                                    pointerEvents: 'none',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                Error: Variable locked.
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {phase === 'done' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', zIndex: 10 }}
                    >
                        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '0.9rem', opacity: 0.45, color: '#3e3552' }}>
                            sample size: one. results: conclusive.
                        </div>
                        <button
                            onClick={handleRecalibrate}
                            style={{
                                marginTop: '1.5rem', fontFamily: "'Courier New', Courier, monospace", fontSize: '0.75rem',
                                opacity: 0.4, background: 'none', border: 'none', color: '#3e3552',
                                cursor: 'pointer', transition: 'opacity 0.2s', padding: '8px 16px'
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                            onMouseLeave={e => e.currentTarget.style.opacity = 0.4}
                        >
                            recalculate →
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
