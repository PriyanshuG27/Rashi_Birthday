import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../App';

const Corner = ({ c, i, isExit, isMobile }) => {
    if (isMobile && !c.mobile) return null;
    const [arrived, setArrived] = useState(false);
    return (
        <motion.img
            src="/lavender_branch.png"
            initial={{ opacity: 0, y: 40, rotate: c.rotate }}
            animate={isExit
                ? { opacity: 0, y: -60, rotate: c.rotate }
                : (arrived ? { opacity: c.o, y: [0, -5, 0], rotate: c.rotate } : { opacity: c.o, y: 0, rotate: c.rotate })}
            transition={isExit
                ? { duration: 0.3, delay: 0.4 }
                : (arrived
                    ? { y: { duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } }
                    : { type: 'spring', stiffness: 60, damping: 14, delay: 0.1 + (i * 0.1) }
                )
            }
            onAnimationComplete={() => { if (!arrived && !isExit) setArrived(true); }}
            style={{
                position: 'absolute',
                top: c.top, bottom: c.bottom, left: c.left, right: c.right,
                width: isMobile ? '120px' : '180px',
                pointerEvents: 'none',
                zIndex: 1
            }}
            alt=""
        />
    )
};

export default function Gate({ onPass }) {
    const { playChime, playRustle } = useSound();
    const onPassRef = useRef(onPass);
    useEffect(() => { onPassRef.current = onPass; }, [onPass]);

    // State Machine: 'arriving', 'idle', 'wrong-1', 'wrong-2', 'wrong-many', 'correct', 'skipped'
    const [gateState, setGateState] = useState('arriving');
    const [wrongCount, setWrongCount] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [isErrorFlash, setIsErrorFlash] = useState(false);
    const [showCorrect, setShowCorrect] = useState(false);

    const [hasArrived, setHasArrived] = useState(false);
    const [typedMessage, setTypedMessage] = useState('');
    const [isTypingDone, setIsTypingDone] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);
    const [showInput, setShowInput] = useState(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const isExit = gateState === 'correct' || gateState === 'skipped';

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Stars generation
    const stars = useMemo(() => Array.from({ length: 10 }).map(() => ({
        x: 5 + Math.random() * 90, // vw
        y: 5 + Math.random() * 90, // vh
        rot: Math.random() * 360,
        dur: 20 + Math.random() * 20,
        dir: Math.random() > 0.5 ? 1 : -1
    })), []);

    // Entrance and Exit Sequences
    useEffect(() => {
        if (gateState === 'arriving') {
            // play rustle when card arrives at t=400ms
            const rustleTimer = setTimeout(() => {
                playRustle();
            }, 400);

            // start typewriter at t=900ms
            const startTimer = setTimeout(() => {
                const message = "a website for someone very specific.";
                let i = 0;
                const typeChar = () => {
                    if (i <= message.length) {
                        setTypedMessage(message.substring(0, i));
                        i++;
                        if (i <= message.length) {
                            setTimeout(typeChar, 30);
                        } else {
                            setIsTypingDone(true);
                        }
                    }
                };
                typeChar();
            }, 900);

            return () => {
                clearTimeout(startTimer);
                clearTimeout(rustleTimer);
            }
        }
    }, [gateState, playRustle]);

    // Question & Input appearing
    useEffect(() => {
        if (isTypingDone && gateState === 'arriving') {
            setShowQuestion(true);
            const inputTimer = setTimeout(() => {
                setShowInput(true);
                // After sequence finishes, transition to idle
                setGateState('idle');
            }, 600);
            return () => clearTimeout(inputTimer);
        }
    }, [isTypingDone, gateState]);

    // Exit Sequence (Correct / Skip)
    useEffect(() => {
        if (isExit) {
            let charTimer;
            if (gateState === 'correct') {
                setShowCorrect(true);
                playChime();
                const len = inputValue.length || 10;
                let i = 0;
                const replaceNext = () => {
                    if (i < len) {
                        setInputValue(prev => '✦'.repeat(i + 1) + prev.substring(i + 1));
                        i++;
                        charTimer = setTimeout(replaceNext, 40);
                    }
                };
                replaceNext();
            }

            const unmountTimer = setTimeout(() => {
                onPassRef.current();
            }, 2600);

            return () => {
                clearTimeout(charTimer);
                clearTimeout(unmountTimer);
            }
        }
    }, [gateState]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isExit || gateState === 'arriving') return;

        const val = inputValue.trim().toLowerCase();
        if (['irritating', 'irritating.', 'irritaing'].includes(val)) {
            setGateState('correct');
        } else {
            const newCount = wrongCount + 1;
            setWrongCount(newCount);
            if (newCount === 1) setGateState('wrong-1');
            else if (newCount === 2) setGateState('wrong-2');
            else setGateState('wrong-many');

            setIsShaking(true);
            setIsErrorFlash(true);
            setTimeout(() => setIsShaking(false), 500);
            setTimeout(() => setIsErrorFlash(false), 300);
        }
    };

    const handleSkip = () => {
        setGateState('skipped');
    };

    // Card Animation definitions
    const cardAnimate = isExit
        ? { y: -40, opacity: 0, filter: "blur(8px)" }
        : (hasArrived ? { y: [0, -4, 0], opacity: 1 } : { y: 0, opacity: 1 });
    const cardTransition = isExit
        ? { duration: 0.7, delay: 1.6 }
        : (hasArrived
            ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
            : { type: "spring", stiffness: 60, damping: 14, delay: 0.4 });

    const cornersData = [
        { id: 'tl', rotate: 135, top: -20, left: -20, o: 0.15, mobile: true },
        { id: 'tr', rotate: -135, top: -20, right: -20, o: 0.15, mobile: false },
        { id: 'bl', rotate: 45, bottom: -20, left: -20, o: 0.15, mobile: false },
        { id: 'br', rotate: -45, bottom: -20, right: -20, o: 0.15, mobile: true }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={isExit ? { opacity: 0 } : { opacity: 1 }}
            transition={isExit ? { duration: 0.3, delay: 2.2 } : { duration: 0.6 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 10000, backgroundColor: '#f5f2fb',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
            }}
        >
            {/* Layer 0: Pulsing gradient */}
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at center, rgba(184,156,230,0.08) 0%, transparent 60%)',
                    pointerEvents: 'none'
                }}
            />

            {/* Layer 1: Botanical Corners */}
            {cornersData.map((c, i) => (
                <Corner key={c.id} c={c} i={i} isExit={isExit} isMobile={isMobile} />
            ))}

            {/* Layer 2: Scattered Stars */}
            {stars.map((s, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={isExit ? { opacity: 0 } : { opacity: 0.15, rotate: s.rot + (360 * s.dir) }}
                    transition={isExit ? { duration: 0.2, delay: 0.5 } : {
                        opacity: { delay: 0.2 + (i * 0.08), duration: 0.8 },
                        rotate: { duration: s.dur, repeat: Infinity, ease: "linear" }
                    }}
                    style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, color: '#b89ce6', fontSize: '12px', zIndex: 2, pointerEvents: 'none' }}
                >
                    ✦
                </motion.div>
            ))}

            {/* Layer 3: The Card */}
            <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={cardAnimate}
                transition={cardTransition}
                onAnimationComplete={() => { if (!hasArrived && !isExit) setHasArrived(true); }}
                style={{
                    width: '90vw',
                    maxWidth: 480,
                    backgroundColor: '#fffdf9',
                    padding: isMobile ? '44px 28px 40px' : '56px 52px 48px',
                    border: '1px solid rgba(184,156,230,0.15)',
                    boxShadow: '0 40px 80px rgba(62,53,82,0.08), 0 8px 24px rgba(62,53,82,0.04)',
                    borderRadius: 4,
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent calc(1.9rem - 1px), rgba(184,156,230,0.06) calc(1.9rem - 1px), rgba(184,156,230,0.06) 1.9rem)',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                {/* Washi Tape */}
                <motion.div
                    initial={{ y: -20, opacity: 0, x: '-50%', rotate: -2 }}
                    animate={isExit ? { opacity: 0 } : { y: 0, opacity: 1, x: '-50%', rotate: -2 }}
                    transition={isExit ? { duration: 0.2 } : { type: 'spring', bounce: 0.6, delay: 0.6 }}
                    style={{
                        position: 'absolute', top: -10, left: '50%',
                        width: 72, height: 20, backgroundColor: 'rgba(220,210,240,0.75)',
                        borderRadius: 2
                    }}
                />

                {/* Postmark */}
                <motion.div
                    initial={{ opacity: 0, rotate: -8 }}
                    animate={isExit ? { opacity: 0 } : { opacity: 0.4, rotate: -8 }}
                    transition={isExit ? { duration: 0.2 } : { delay: 0.7, duration: 0.5 }}
                    style={{
                        position: 'absolute', top: 24, right: 24,
                        fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#b89ce6'
                    }}
                >
                    17 March
                </motion.div>

                {/* Content */}
                {/* Opening Line */}
                <div style={{
                    fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1.05rem',
                    color: '#3e3552', opacity: 0.5, minHeight: '1.5rem', marginBottom: '1.5rem'
                }}>
                    {typedMessage}
                </div>

                {/* Question */}
                <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={showQuestion ? { y: 0, opacity: 0.92 } : { y: 12, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                        position: 'relative',
                        fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                        fontSize: 'clamp(1.3rem, 3.5vw, 1.7rem)', color: '#3e3552', fontWeight: 500,
                        marginBottom: '2rem', display: 'inline-block'
                    }}
                >
                    what do you call me when I'm being annoying?
                    <svg
                        preserveAspectRatio="none"
                        viewBox="0 0 100 10"
                        style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', height: '10px', overflow: 'visible' }}
                    >
                        <motion.path
                            d="M 1 8 Q 30 2, 70 7 T 99 4"
                            vectorEffect="non-scaling-stroke"
                            stroke="#b89ce6" strokeWidth={1.5} fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={showQuestion ? { pathLength: 1, opacity: 0.35 } : { pathLength: 0, opacity: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        />
                    </svg>
                </motion.div>

                {/* Input Wrapper */}
                <motion.div
                    initial={{ y: 8, opacity: 0 }}
                    animate={showInput ? { y: 0, opacity: 1 } : { y: 8, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ position: 'relative', marginTop: 16 }}
                >
                    <motion.div
                        animate={isShaking ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => !isExit && setInputValue(e.target.value)}
                                disabled={isExit || gateState === 'arriving'}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    borderBottom: isErrorFlash ? '1px solid #f4b6d2' : `1px solid ${isFocused && !isExit ? 'rgba(184,156,230,0.7)' : 'rgba(184,156,230,0.3)'}`,
                                    background: 'transparent',
                                    fontFamily: "'Caveat', cursive",
                                    fontSize: '1.4rem',
                                    color: '#3e3552',
                                    padding: '4px 32px 4px 0',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    caretColor: '#b89ce6',
                                    transition: 'border-bottom-color 0.3s'
                                }}
                            />
                            <AnimatePresence>
                                {!isExit && showInput && gateState !== 'correct' && (
                                    <motion.button
                                        type="submit"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.5 }}
                                        whileHover={{ opacity: 0.9 }}
                                        exit={{ opacity: 0 }}
                                        style={{
                                            position: 'absolute', right: 0, bottom: 8,
                                            background: 'none', border: 'none',
                                            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                                            color: '#b89ce6', fontSize: '1.2rem', padding: '0 8px',
                                            cursor: 'none'
                                        }}
                                    >
                                        →
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </form>
                    </motion.div>
                    <AnimatePresence>
                        {wrongCount >= 2 && !isExit && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 0.55, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                style={{
                                    fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#b89ce6',
                                    marginTop: 12
                                }}
                            >
                                ~ it's what you always say.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Skip Link */}
                <AnimatePresence>
                    {((wrongCount >= 1 && isMobile) || wrongCount >= 3) && !isExit && (
                        <motion.button
                            onClick={handleSkip}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.25 }}
                            whileHover={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            style={{
                                background: 'none', border: 'none',
                                fontFamily: "'Caveat', cursive", fontSize: '0.85rem', color: '#3e3552',
                                display: 'block', margin: '32px auto 0',
                                cursor: 'none'
                            }}
                        >
                            skip →
                        </motion.button>
                    )}
                </AnimatePresence>
                {/* Correct answer overlay — appears over entire card */}
                <AnimatePresence>
                    {showCorrect && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: 4,
                                background: 'rgba(255,253,249,0.92)',
                                backdropFilter: 'blur(4px)',
                                WebkitBackdropFilter: 'blur(4px)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 14,
                                zIndex: 20,
                                pointerEvents: 'none',
                            }}
                        >
                            <motion.p
                                initial={{ opacity: 0, y: 18, scale: 0.94 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontStyle: 'italic',
                                    fontWeight: 500,
                                    fontSize: 'clamp(1.6rem, 4vw, 2rem)',
                                    color: '#3e3552',
                                    letterSpacing: '-0.02em',
                                    textAlign: 'center',
                                    margin: 0,
                                }}
                            >
                                of course you knew.
                            </motion.p>
                            <motion.div
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.35 }}
                                style={{
                                    height: 1,
                                    width: 80,
                                    background: 'linear-gradient(90deg, transparent, #b89ce6, transparent)',
                                }}
                            />
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.4 }}
                                transition={{ duration: 0.4, delay: 0.55 }}
                                style={{
                                    fontFamily: "'Caveat', cursive",
                                    fontSize: '1rem',
                                    color: '#b89ce6',
                                }}
                            >
                                ✦
                            </motion.span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
