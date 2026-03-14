import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../App';
import GooeyText from './GooeyText';

const Frosting = ({ id }) => (
    <svg width="100%" height="15" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.8, pointerEvents: 'none' }}>
        <defs>
            <pattern id={`frosting-pattern-${id}`} width="20" height="15" patternUnits="userSpaceOnUse">
                <path d="M 0 0 Q 10 15 20 0 Z" fill="white" />
            </pattern>
        </defs>
        <rect width="100%" height="15" fill={`url(#frosting-pattern-${id})`} />
    </svg>
);

export default function Final() {
    const { playCakeCandles, playBirthdayChime } = useSound();
    const [stage, setStage] = useState(0); // 0=cake, 1=so-gyiii, 2=just-kidding, 3=final-message
    const [showEasterEgg, setShowEasterEgg] = useState(false);
    const [heartHoverStart, setHeartHoverStart] = useState(null);

    const [candlesLit, setCandlesLit] = useState(false);
    const [micStatus, setMicStatus] = useState('initial'); // 'initial' | 'prompt' | 'listening' | 'denied'
    const [phase, setPhase] = useState(0); // 0: idle, 1: flames out, 2: explode, 3: fade
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const reqFrameRef = useRef(null);

    const BLOW_THRESHOLD = 0.04;

    const handleSequence = () => {
        setStage(1);

        setTimeout(() => {
            setStage(2);

            setTimeout(() => {
                setStage(3);
                setTimeout(() => playBirthdayChime(), 800);
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
            }, 1500);
        } else {
            setShowEasterEgg(false);
        }
        return () => clearTimeout(timer);
    }, [heartHoverStart]);

    // Mic Detection Logic
    useEffect(() => {
        if (stage > 0) return;
        return () => {
            if (reqFrameRef.current) cancelAnimationFrame(reqFrameRef.current);
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(() => { });
            }
        };
    }, [stage]);

    // Mic Detection Logic - started on user gesture
    const startMic = async () => {
        let blowStartTime = null;

        const startListening = async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    alert('Mic access requires a secure connection (HTTPS) or is unsupported by this browser.');
                    setMicStatus('denied');
                    return;
                }

                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setMicStatus('listening');

                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === 'suspended') {
                    await audioCtx.resume();
                }
                audioContextRef.current = audioCtx;

                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.4;
                const source = audioCtx.createMediaStreamSource(stream);
                source.connect(analyser);
                analyserRef.current = analyser;

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                const checkVolume = () => {
                    analyser.getByteFrequencyData(dataArray);

                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    const average = sum / bufferLength;

                    if (average > 40) {
                        if (!blowStartTime) blowStartTime = performance.now();
                        else if (performance.now() - blowStartTime > 100) {
                            handleBlow();
                            return; // Stop polling
                        }
                    } else {
                        blowStartTime = null;
                    }

                    reqFrameRef.current = requestAnimationFrame(checkVolume);
                };

                reqFrameRef.current = requestAnimationFrame(checkVolume);
            } catch (err) {
                alert('Mic access denied or failed: ' + err.message);
                setMicStatus('denied');
            }
        };

        startListening();
    };

    const handleInitialLight = () => {
        setCandlesLit(true);
        setMicStatus('prompt');
        try { playBirthdayChime(); } catch (e) { }
        startMic();
    };

    const handleBlow = () => {
        if (phase > 0) return;
        playCakeCandles();
        setPhase(1); // Phase 1: flames out 0-400ms

        if (reqFrameRef.current) cancelAnimationFrame(reqFrameRef.current);
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(() => { });
        }

        setTimeout(() => setPhase(2), 300); // Phase 2: petal explosion
        setTimeout(() => setPhase(3), 600); // Phase 3: cake fades
        setTimeout(() => handleSequence(), 800); // Phase 4: Sequence
    };

    const petalsWave1 = useMemo(() => {
        const colors = ['#b89ce6', '#f4b6d2', '#fce4f0', '#fff'];
        return Array.from({ length: 80 }).map((_, i) => ({
            id: `w1-${i}`,
            size: 4 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            angle: Math.random() * 360,
            distance: 80 + Math.random() * 320,
            rotation: Math.random() * 720,
            duration: 1.2 + Math.random() * 1.2
        }));
    }, []);

    const petalsWave2 = useMemo(() => {
        const colors = ['#b89ce6', '#f4b6d2', '#fce4f0', '#fff'];
        return Array.from({ length: 40 }).map((_, i) => ({
            id: `w2-${i}`,
            size: 4 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            angle: -30 + Math.random() * 240,
            distance: 100 + Math.random() * 300,
            rotation: Math.random() * 720,
            duration: 2 + Math.random() * 2
        }));
    }, []);

    return (
        <section className="final-section" id="final" style={{ position: 'relative' }}>

            {/* Background Petal Explosion */}
            <AnimatePresence>
                {phase >= 2 && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, zIndex: 0 }}>
                        {petalsWave1.map(p => (
                            <motion.div
                                key={p.id}
                                initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0 }}
                                animate={{
                                    x: Math.cos(p.angle * Math.PI / 180) * p.distance,
                                    y: [
                                        0,
                                        Math.sin(p.angle * Math.PI / 180) * p.distance,
                                        Math.sin(p.angle * Math.PI / 180) * p.distance + 200
                                    ],
                                    rotate: p.rotation,
                                    scale: [0, 1, 1],
                                    opacity: [1, 1, 0]
                                }}
                                transition={{ duration: p.duration, times: [0, 0.4, 1], ease: "easeOut" }}
                                style={{
                                    position: 'absolute',
                                    width: p.size, height: p.size,
                                    backgroundColor: p.color,
                                    borderRadius: '50% 0 50% 50%',
                                    transformOrigin: 'center'
                                }}
                            />
                        ))}
                        {petalsWave2.map(p => (
                            <motion.div
                                key={p.id}
                                initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0 }}
                                animate={{
                                    x: Math.cos(p.angle * Math.PI / 180) * p.distance,
                                    y: [
                                        0,
                                        Math.sin(p.angle * Math.PI / 180) * p.distance,
                                        Math.sin(p.angle * Math.PI / 180) * p.distance - 150
                                    ],
                                    rotate: p.rotation,
                                    scale: [0, 1, 1],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{ delay: 0.3, duration: p.duration, times: [0, 0.3, 1], ease: "easeOut" }}
                                style={{
                                    position: 'absolute',
                                    width: p.size, height: p.size,
                                    backgroundColor: p.color,
                                    borderRadius: '50% 0 50% 50%',
                                    transformOrigin: 'center'
                                }}
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Cake Interaction replaces the open button */}
            {stage === 0 && (
                <div className="cake-interaction-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                    <AnimatePresence>
                        {phase < 3 && candlesLit && (
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.8 }}
                                style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontStyle: 'italic',
                                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                    color: '#3e3552',
                                    marginBottom: '3.5rem',
                                    fontWeight: 500,
                                    textAlign: 'center'
                                }}
                            >
                                Make a wish & blow the candles.
                            </motion.h2>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {phase < 3 && (
                            <motion.div
                                className="cake-wrapper"
                                initial={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4 }}
                                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                                onClick={handleBlow}
                            >
                                {/* Candles */}
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '-2px', position: 'relative', zIndex: 4 }}>
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} style={{ position: 'relative', width: 8, height: 28, background: i % 2 === 0 ? '#b89ce6' : '#f4b6d2', borderRadius: 3 }}>
                                            <AnimatePresence>
                                                {phase === 0 && candlesLit && (
                                                    <motion.div
                                                        initial={{ scale: 0.9, rotate: -3 }}
                                                        animate={{ scale: [0.9, 1.1, 0.9], rotate: [-3, 3, -3] }}
                                                        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                                                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.2, delay: i * 0.08 } }}
                                                        style={{ position: 'absolute', top: -14, left: -1, width: 10, height: 12, background: 'linear-gradient(#fff176, #ffb300)', borderRadius: '50% 0 50% 50%', transformOrigin: 'bottom center' }}
                                                    />
                                                )}
                                            </AnimatePresence>

                                            {/* Smoke */}
                                            {phase >= 1 && (
                                                <motion.svg
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: [0, 0.6, 0], y: -30 }}
                                                    transition={{ duration: 0.6, delay: i * 0.08 + 0.1 }}
                                                    viewBox="0 0 10 20"
                                                    style={{ position: 'absolute', top: -30, left: -1, width: 10, height: 20 }}
                                                >
                                                    <path d="M5 20 Q 10 15 5 10 T 5 0" fill="none" stroke="gray" strokeWidth="1" />
                                                </motion.svg>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Top Layer */}
                                <div style={{ width: 120, height: 40, backgroundColor: '#f3effe', position: 'relative', zIndex: 3, borderRadius: '6px 6px 0 0', overflow: 'hidden' }}>
                                    <Frosting id="top" />
                                </div>
                                {/* Middle Layer */}
                                <div style={{ width: 160, height: 50, backgroundColor: '#fce4f0', position: 'relative', zIndex: 2, borderRadius: '6px 6px 0 0', marginTop: -2, overflow: 'hidden' }}>
                                    <Frosting id="mid" />
                                </div>
                                {/* Base Layer */}
                                <div style={{ width: 200, height: 60, backgroundColor: '#f3effe', border: '2px solid #dcd2f0', position: 'relative', zIndex: 1, borderRadius: '6px 6px 12px 12px', marginTop: -2, overflow: 'hidden' }}>
                                    <Frosting id="base" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {phase < 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {micStatus === 'initial' ? (
                                <motion.div
                                    animate={{ opacity: [0.8, 1, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    style={{
                                        fontFamily: 'var(--font-handwriting)',
                                        fontSize: '1.2rem',
                                        color: '#3e3552',
                                        marginTop: '2rem',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        zIndex: 10,
                                        background: 'rgba(255,255,255,0.6)',
                                        padding: '4px 16px',
                                        borderRadius: '16px',
                                        fontWeight: 600
                                    }}
                                    onClick={handleInitialLight}
                                >
                                    Light the candles ✦
                                </motion.div>
                            ) : micStatus === 'denied' ? (
                                <motion.div
                                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    style={{
                                        fontFamily: 'var(--font-handwriting)',
                                        fontSize: '1rem',
                                        color: '#b89ce6',
                                        marginTop: '2rem',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        zIndex: 10
                                    }}
                                    onClick={handleBlow}
                                >
                                    tap to open instead ✦
                                </motion.div>
                            ) : (
                                <>
                                    <motion.div
                                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                        style={{
                                            fontFamily: 'var(--font-handwriting)',
                                            fontSize: '1rem',
                                            color: '#b89ce6',
                                            marginTop: '2rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            position: 'relative',
                                            zIndex: 10
                                        }}
                                    >
                                        blow out the candles ✦
                                        <div style={{
                                            width: 6, height: 6, borderRadius: '50%',
                                            backgroundColor: micStatus === 'listening' ? '#a8e6a3' : '#ccc',
                                            boxShadow: micStatus === 'listening' ? '0 0 6px #a8e6a3' : 'none',
                                            transition: 'all 0.3s ease'
                                        }} />
                                    </motion.div>
                                    <div style={{
                                        fontFamily: 'var(--font-handwriting)',
                                        fontSize: '0.8rem',
                                        color: '#b89ce6',
                                        opacity: 0.4,
                                        marginTop: '0.5rem',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        zIndex: 10
                                    }} onClick={handleBlow}>
                                        or tap the cake
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

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
                            {/* Stage 1: so gyiii — kept as is */}
                            {stage === 1 && (
                                <motion.div
                                    key="sogyiii"
                                    className="final-sogyiii"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                >
                                    Me so gyaaa abhhh 🥲
                                    <motion.div
                                        className="final-zzz"
                                        animate={{ y: [0, -20, -40], x: [0, 10, -5], opacity: [0, 1, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        Zzz
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Stage 2: Just kidding — kept as is */}
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

                            {/* Stage 3: New final message (Part 9D) */}
                            {stage === 3 && (
                                <motion.div
                                    key="true-final"
                                    className="true-final"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                >
                                    {/* Line 1 */}
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.6 }}
                                        transition={{ duration: 1, delay: 0 }}
                                        style={{
                                            fontFamily: 'var(--font-handwriting)',
                                            fontSize: '1rem',
                                            color: '#3e3552',
                                            marginBottom: '1.5rem',
                                            maxWidth: 400,
                                            textAlign: 'center',
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        for someone who fixed me when I didn't even know I was broken —
                                    </motion.p>

                                    {/* Line 2 */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 1.2, delay: 1.2 }}
                                        style={{ marginBottom: '1.5rem', position: 'relative' }}
                                    >
                                        <p style={{
                                            fontFamily: "'Playfair Display', Georgia, serif",
                                            fontStyle: 'italic',
                                            fontSize: 'clamp(2rem, 6vw, 3.2rem)',
                                            color: '#3e3552',
                                            fontWeight: 600,
                                            textAlign: 'center',
                                            marginBottom: '0.5rem',
                                        }}>
                                            Happy Birthday,
                                        </p>
                                        <GooeyText
                                            texts={["Rashiii.", "Kitkat.", "Rashuu."]}
                                            morphTime={1.2}
                                            cooldownTime={2}
                                            style={{ height: 'clamp(3rem, 8vw, 5rem)' }}
                                        />
                                    </motion.div>

                                    {/* Plain moment — ruled apart */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 1, delay: 2.0 }}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 10,
                                            marginBottom: '1.8rem',
                                            width: '100%',
                                            maxWidth: 320,
                                        }}
                                    >
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 0.6, delay: 2.2, ease: 'easeOut' }}
                                            style={{
                                                height: 1,
                                                width: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(184,156,230,0.35), transparent)',
                                                transformOrigin: 'center',
                                            }}
                                        />
                                        <p style={{
                                            fontFamily: "'Inter', system-ui, sans-serif",
                                            fontStyle: 'normal',
                                            fontWeight: 400,
                                            fontSize: '0.88rem',
                                            color: '#3e3552',
                                            opacity: 0.6,
                                            margin: 0,
                                            textAlign: 'center',
                                            letterSpacing: '0.03em',
                                        }}>
                                            I just wanted you to know that I notice.
                                        </p>
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 0.6, delay: 2.5, ease: 'easeOut' }}
                                            style={{
                                                height: 1,
                                                width: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(184,156,230,0.35), transparent)',
                                                transformOrigin: 'center',
                                            }}
                                        />
                                    </motion.div>

                                    {/* Line 3 */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 1, delay: 2.4 }}
                                        style={{
                                            fontFamily: 'var(--font-handwriting)',
                                            fontSize: '1.15rem',
                                            color: '#b89ce6',
                                            textAlign: 'center',
                                            marginBottom: '1.5rem',
                                            lineHeight: 1.8,
                                        }}
                                    >
                                        <p>thank you for every chance you gave me.</p>
                                        <p>I don't take a single one for granted.</p>
                                    </motion.div>

                                    {/* Line 4 */}
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.55 }}
                                        transition={{ duration: 1, delay: 3.6 }}
                                        style={{
                                            fontFamily: "'Playfair Display', Georgia, serif",
                                            fontStyle: 'italic',
                                            fontSize: '0.95rem',
                                            color: '#3e3552',
                                            marginBottom: '2rem',
                                        }}
                                    >
                                        — dumbo
                                    </motion.p>

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

                                        {/* Easter Egg */}
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

                                    {/* Fast Petals */}
                                    <div className="final-petals">
                                        {[...Array(15)].map((_, i) => (
                                            <motion.div
                                                key={`fast-${i}`}
                                                className="petal"
                                                initial={{ y: -50, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), opacity: 0, rotate: 0 }}
                                                animate={{
                                                    y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
                                                    x: `+=${(Math.random() - 0.5) * 300}`,
                                                    opacity: [0, 1, 0],
                                                    rotate: `+=${Math.random() * 360}`
                                                }}
                                                transition={{ duration: 2 + Math.random() * 2, delay: 1.5 + (i * 0.1), ease: "linear", times: [0, 0.5, 1] }}
                                                style={{ backgroundColor: 'var(--color-pink)' }}
                                            />
                                        ))}
                                    </div>

                                    {/* Slow Settled Petals */}
                                    <div className="final-petals-slow">
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={`slow-${i}`}
                                                className="petal"
                                                initial={{ y: -50, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), opacity: 0, rotate: 0 }}
                                                animate={{
                                                    y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
                                                    x: `+=${(Math.random() - 0.5) * 100}`,
                                                    opacity: [0, 0.5, 0],
                                                    rotate: `+=${Math.random() * 360}`
                                                }}
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

                                    {/* Line 5: Hidden final line */}
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.3 }}
                                        transition={{ duration: 1.5, delay: 6 }}
                                        style={{
                                            fontFamily: 'var(--font-handwriting)',
                                            fontSize: '0.8rem',
                                            color: '#3e3552',
                                            position: 'fixed',
                                            bottom: 20,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            textAlign: 'center',
                                            maxWidth: 400,
                                            zIndex: 10,
                                        }}
                                    >
                                        I know you're already planning what to say about this being too much. it was. you deserved it anyway. ✦
                                    </motion.p>

                                    {/* Quiet escape — appears late */}
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.2 }}
                                        whileHover={{ opacity: 0.6 }}
                                        transition={{ delay: 8, duration: 1.5 }}
                                        onClick={() => {
                                            document.body.style.overflow = 'auto';
                                            setStage(0);
                                            setPhase(0);
                                            setCandlesLit(false);
                                            setMicStatus('initial');
                                            setTimeout(() => {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }, 400);
                                        }}
                                        style={{
                                            position: 'fixed',
                                            top: 24,
                                            right: 24,
                                            background: 'none',
                                            border: 'none',
                                            fontFamily: "'Caveat', cursive",
                                            fontSize: '0.85rem',
                                            color: '#3e3552',
                                            cursor: 'none',
                                            zIndex: 10,
                                        }}
                                    >
                                        ← go back
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

