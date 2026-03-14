import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useSound } from '../App';

const LETTER_PHOTO = '/photo_letter.png';

/* ═══════════════════════════════════════════
   CASSETTE TAPE SVG (Part 7)
   ═══════════════════════════════════════════ */
function CassetteTape() {
    const [isHovered, setIsHovered] = useState(false);
    const [notes, setNotes] = useState([]);
    const noteIdRef = useRef(0);

    const handleClick = () => {
        // Spawn floating notes
        const newNotes = Array.from({ length: 4 }, (_, i) => ({
            id: noteIdRef.current++,
            x: (Math.random() - 0.5) * 60,
            delay: i * 0.1,
        }));
        setNotes(prev => [...prev, ...newNotes]);
        setTimeout(() => {
            setNotes(prev => prev.filter(n => !newNotes.find(nn => nn.id === n.id)));
        }, 1200);

        // Open link
        window.open('https://open.spotify.com/', '_blank');
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '2.5rem',
            position: 'relative',
        }}>
            {/* Tooltip on hover */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: -8 }}
                        exit={{ opacity: 0, y: 5 }}
                        style={{
                            fontFamily: 'var(--font-handwriting)',
                            fontSize: '0.85rem',
                            color: '#3e3552',
                            opacity: 0.7,
                            marginBottom: 8,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        a song for you →
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating notes */}
            <AnimatePresence>
                {notes.map(note => (
                    <motion.span
                        key={note.id}
                        initial={{ opacity: 1, y: 0, x: 0 }}
                        animate={{ opacity: 0, y: -60, x: note.x }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, delay: note.delay, ease: "easeOut" }}
                        style={{
                            position: 'absolute',
                            top: -10,
                            fontSize: '1.1rem',
                            pointerEvents: 'none',
                            zIndex: 10,
                        }}
                    >
                        ♪
                    </motion.span>
                ))}
            </AnimatePresence>

            {/* Cassette SVG */}
            <svg
                width="160"
                height="100"
                viewBox="0 0 160 100"
                fill="none"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
            >
                {/* Outer shell */}
                <rect x="5" y="5" width="150" height="90" rx="8" ry="8"
                    fill="#f0ebfa"
                    stroke="rgba(184,156,230,0.3)"
                    strokeWidth="1"
                />

                {/* Label strip */}
                <rect x="20" y="35" width="120" height="22" rx="3" ry="3"
                    fill="#fffdf9"
                    stroke="rgba(184,156,230,0.2)"
                    strokeWidth="0.5"
                />
                <text x="80" y="50" textAnchor="middle"
                    style={{
                        fontFamily: "'Caveat', cursive",
                        fontSize: '11px',
                        fill: '#3e3552',
                    }}
                >
                    Rashiii's tape ✦
                </text>

                {/* Reels */}
                <g>
                    <motion.circle
                        cx="50" cy="25" r="12"
                        fill="#dcd2f0"
                        stroke="rgba(184,156,230,0.4)"
                        strokeWidth="0.5"
                        animate={isHovered ? { rotate: 360 } : {}}
                        transition={isHovered ? { duration: 1.5, repeat: Infinity, ease: "linear" } : {}}
                        style={{ transformOrigin: '50px 25px' }}
                    />
                    <circle cx="50" cy="25" r="3" fill="#f0ebfa" />

                    <motion.circle
                        cx="110" cy="25" r="12"
                        fill="#dcd2f0"
                        stroke="rgba(184,156,230,0.4)"
                        strokeWidth="0.5"
                        animate={isHovered ? { rotate: 360 } : {}}
                        transition={isHovered ? { duration: 1.5, repeat: Infinity, ease: "linear" } : {}}
                        style={{ transformOrigin: '110px 25px' }}
                    />
                    <circle cx="110" cy="25" r="3" fill="#f0ebfa" />
                </g>

                {/* Bottom tape windows */}
                <rect x="30" y="65" width="100" height="20" rx="4" ry="4"
                    fill="rgba(184,156,230,0.08)"
                    stroke="rgba(184,156,230,0.15)"
                    strokeWidth="0.5"
                />
            </svg>

            <p style={{
                fontFamily: 'var(--font-handwriting)',
                fontSize: '0.8rem',
                color: '#3e3552',
                opacity: 0.45,
                marginTop: 8,
            }}>
                something to listen to ✦
            </p>
        </div>
    );
}

/* ═══════════════════════════════════════════
   ENVELOPE (Hold to Open Interaction)
   ═══════════════════════════════════════════ */
function Envelope({ onOpen }) {
    const { playEnvelopeHold, playWaxCrack, playEnvelopeSlide } = useSound();
    const ref = useRef(null);
    const [holdPhase, setHoldPhase] = useState('idle'); // 'idle' | 'holding' | 'cracking' | 'opening' | 'done'
    const holdTimerRef = useRef(null);
    const [ringProgress, setRingProgress] = useState(0);
    const holdOscRef = useRef(null);

    const handlePointerDown = (e) => {
        if (holdPhase !== 'idle' && holdPhase !== 'holding') return;
        setHoldPhase('holding');
        setRingProgress(1); // Framer Motion will animate this from 0 to 1 over 0.6s

        holdOscRef.current = playEnvelopeHold();

        holdTimerRef.current = setTimeout(() => {
            setHoldPhase('cracking');
            playWaxCrack();

            // 400ms later: seal shattered, open flap
            setTimeout(() => {
                setHoldPhase('opening');
                setTimeout(() => playEnvelopeSlide(), 100);

                // 1000ms after opening starts: done, show letter
                setTimeout(() => {
                    setHoldPhase('done');
                    onOpen();
                }, 1000);
            }, 400);

        }, 600);
    };

    const handlePointerUp = () => {
        if (holdPhase === 'holding') {
            clearTimeout(holdTimerRef.current);
            setHoldPhase('idle');
            setRingProgress(0); // Reverse ring animation cleanly
            if (holdOscRef.current) {
                try { holdOscRef.current.stop(); } catch (e) { }
                holdOscRef.current = null;
            }
        }
    };

    if (holdPhase === 'done') return null;

    const flapOpen = holdPhase === 'opening';
    const letterRising = holdPhase === 'opening';

    return (
        <div ref={ref} style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem 0',
            marginTop: '2rem' // space for the hold indicator
        }}>
            <motion.div
                animate={holdPhase === 'done' ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                    width: 340,
                    height: 220,
                    position: 'relative',
                    perspective: '800px',
                }}
            >
                {/* Envelope body */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: '#fffdf9',
                    borderRadius: 8,
                    border: '1px solid rgba(184,156,230,0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '2px 4px 12px rgba(0,0,0,0.06)',
                }}>
                    {/* Letter peeking up */}
                    <motion.div
                        animate={letterRising ? { y: -80, opacity: 1 } : { y: 0, opacity: 0.3 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '85%',
                            height: 140,
                            background: 'white',
                            borderRadius: '4px 4px 0 0',
                            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
                        }}
                    >
                        {/* Fake letter lines */}
                        {[...Array(5)].map((_, i) => (
                            <div key={i} style={{
                                height: 1,
                                width: `${60 + Math.random() * 30}%`,
                                background: 'rgba(184,156,230,0.1)',
                                margin: `${12 + i * 2}px auto 0`,
                                borderRadius: 1,
                            }} />
                        ))}
                    </motion.div>
                </div>

                {/* Flap (triangle) */}
                <motion.div
                    animate={flapOpen ? { rotateX: -160 } : { rotateX: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '50%',
                        transformOrigin: 'top center',
                        zIndex: 2,
                    }}
                >
                    <svg width="100%" height="100%" viewBox="0 0 340 110" preserveAspectRatio="none">
                        <polygon
                            points="0,0 340,0 170,110"
                            fill="#fffdf9"
                            stroke="rgba(184,156,230,0.2)"
                            strokeWidth="1"
                        />
                    </svg>

                    {/* Wax seal logic */}
                    {holdPhase !== 'cracking' && holdPhase !== 'opening' && (
                        <motion.div
                            onPointerDown={handlePointerDown}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                            animate={
                                holdPhase === 'holding'
                                    ? { scale: 0.95 }
                                    : { scale: [1, 1.05, 1] }
                            }
                            transition={
                                holdPhase === 'holding'
                                    ? { duration: 0.1 }
                                    : { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }
                            style={{
                                position: 'absolute',
                                bottom: -26,
                                left: '50%',
                                x: '-50%', // explicitly set translation via motion
                                cursor: 'pointer',
                                touchAction: 'none', // Prevent scrolling while holding
                                zIndex: 10,
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                            }}
                        >
                            <div style={{
                                width: 52,
                                height: 52,
                                borderRadius: '50%',
                                background: '#b89ce6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 3px 0 1px #a385d6, 0 -2px 0 1px #c4aff0, 0 4px 12px rgba(184,156,230,0.4)',
                                position: 'relative'
                            }}>
                                {/* Progress Ring */}
                                <svg width="60" height="60" style={{ position: 'absolute', top: -4, left: -4, pointerEvents: 'none' }}>
                                    <motion.circle
                                        cx="30" cy="30" r="28"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.6)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: ringProgress }}
                                        transition={
                                            holdPhase === 'holding'
                                                ? { duration: 0.6, ease: "linear" }
                                                : { duration: 0.2, ease: "easeOut" }
                                        }
                                        style={{ rotate: -90, transformOrigin: '50% 50%' }}
                                    />
                                </svg>
                                <span style={{ color: 'white', fontSize: '1.2rem' }}>✦</span>
                            </div>

                            <p style={{
                                fontFamily: 'var(--font-handwriting)',
                                fontSize: '0.8rem',
                                color: '#b89ce6',
                                opacity: 0.5,
                                textAlign: 'center',
                                marginTop: 12,
                                pointerEvents: 'none'
                            }}>
                                hold to open
                            </p>
                        </motion.div>
                    )}

                    {/* Cracking fragments */}
                    {(holdPhase === 'cracking' || holdPhase === 'opening') && (
                        <div style={{ position: 'absolute', bottom: -26, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
                            {[
                                { x: -30, y: -30 },
                                { x: 30, y: -30 },
                                { x: -30, y: 30 },
                                { x: 30, y: 30 }
                            ].map((dir, i) => (
                                <motion.div
                                    key={`frag-${i}`}
                                    initial={{ scale: 1.3, x: 0, y: 0, opacity: 1, rotate: 0 }}
                                    animate={{ x: dir.x, y: dir.y, opacity: 0, rotate: 45 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    style={{
                                        position: 'absolute',
                                        width: 26,
                                        height: 26,
                                        background: '#b89ce6',
                                        borderRadius: '4px', // rough fragment, slightly sharp
                                        top: 13,
                                        left: 13,
                                        marginLeft: -13,
                                        marginTop: -13,
                                        boxShadow: '0 2px 0 1px #a385d6',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   LETTER COMPONENT
   ═══════════════════════════════════════════ */
export default function Letter() {
    const [hearts, setHearts] = useState([]);
    const [sparkleActive, setSparkleActive] = useState(false);
    const [envelopeOpened, setEnvelopeOpened] = useState(false);
    const envelopePlayedRef = useRef(false);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleDoubleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setHearts(prev => [...prev, { id: Date.now(), x, y }]);
    };

    const handleEnvelopeOpen = () => {
        if (!envelopePlayedRef.current) {
            envelopePlayedRef.current = true;
            setEnvelopeOpened(true);
        }
    };

    // If envelope already played, show letter directly
    const showLetter = envelopeOpened || envelopePlayedRef.current;

    return (
        <section className="letter-section" id="note" style={{ position: "relative" }}>

            {/* Envelope (Part 4) — only show if not yet opened */}
            {!showLetter && (
                <Envelope onOpen={handleEnvelopeOpen} />
            )}

            {/* Letter wrapper */}
            {showLetter && (
                <>
                    <motion.div
                        className="letter-wrapper"
                        onDoubleClick={handleDoubleClick}
                        style={{
                            cursor: "cell",
                            position: "relative",
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Part 12: Ruled lines background */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            zIndex: 0,
                            background: `repeating-linear-gradient(
                                transparent,
                                transparent calc(1.9rem - 1px),
                                rgba(184,156,230,0.07) calc(1.9rem - 1px),
                                rgba(184,156,230,0.07) 1.9rem
                            )`,
                            backgroundSize: '100% 1.9rem',
                            backgroundPosition: '0 3.8rem',
                            borderRadius: 'inherit',
                        }} />

                        {/* Polaroid Photo */}
                        {!isMobile && (
                            <motion.div
                                initial={{ opacity: 0, y: -40, rotate: 8, x: -20 }}
                                animate={{ opacity: 1, y: 0, rotate: 4, x: 0 }}
                                transition={{ delay: 0.8, type: 'spring', stiffness: 100, damping: 12 }}
                                whileHover={{ y: -6, rotate: 5, boxShadow: '4px 12px 28px rgba(0,0,0,0.18)' }}
                                style={{
                                    position: 'absolute',
                                    top: -30,
                                    left: -20,
                                    width: 160,
                                    background: '#fff',
                                    padding: '8px 8px 36px 8px',
                                    boxShadow: '3px 8px 20px rgba(0,0,0,0.12)',
                                    borderRadius: 2,
                                    zIndex: 10,
                                    cursor: 'default',
                                    transformOrigin: 'center center',
                                }}
                            >
                                {/* Photo */}
                                <motion.img
                                    src={LETTER_PHOTO}
                                    alt=""
                                    initial={{ filter: 'saturate(0) brightness(1.8)' }}
                                    animate={{ filter: 'saturate(1) brightness(1)' }}
                                    transition={{ duration: 1.2, delay: 1.0 }}
                                    style={{
                                        width: '100%',
                                        height: 130,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        display: 'block',
                                    }}
                                />

                                {/* Caption strip */}
                                <p style={{
                                    position: 'absolute',
                                    bottom: 8,
                                    left: 0,
                                    right: 0,
                                    textAlign: 'center',
                                    fontFamily: "'Caveat', cursive",
                                    fontSize: '0.78rem',
                                    color: '#3e3552',
                                    opacity: 0.6,
                                    pointerEvents: 'none',
                                }}>
                                    still my favourite ✦
                                </p>

                                {/* Washi tape at top */}
                                <div style={{
                                    position: 'absolute',
                                    top: -7,
                                    left: '50%',
                                    marginLeft: -18,
                                    width: 36,
                                    height: 12,
                                    background: 'rgba(220,210,240,0.8)',
                                    borderRadius: 2,
                                    transform: 'rotate(-5deg)',
                                    zIndex: 5,
                                }} />
                            </motion.div>
                        )}

                        {/* Hearts particle system (Double Click) */}
                        <AnimatePresence>
                            {hearts.map(h => (
                                <motion.div
                                    key={h.id}
                                    initial={{ opacity: 1, y: h.y, x: h.x, scale: 0 }}
                                    animate={{ opacity: 0, y: h.y - 120, scale: 1.5, rotate: (Math.random() - 0.5) * 45 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    style={{ position: 'absolute', pointerEvents: 'none', zIndex: 50, color: 'var(--color-pink)' }}
                                    onAnimationComplete={() => setHearts(prev => prev.filter(heart => heart.id !== h.id))}
                                >
                                    <Heart size={24} fill="currentColor" />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Subtle Watermark */}
                        <div className="letter-watermark">17 March</div>

                        <div className="letter-pressed-flower">🌸
                            <div className="tape-corner" />
                        </div>

                        <h2 className="section-title letter-title">A Proper Note</h2>

                        {/* Thin divider */}
                        <div className="letter-divider" />

                        <div className="letter-content" style={{ lineHeight: 1.9, position: 'relative', zIndex: 2 }}>
                            <p style={{ marginBottom: "1.2rem" }}>
                                <span className="drop-cap">Y</span>
                                ou're honestly the most chaotic, dramatic, and real person I've ever met — and I mean that in the most respectful way possible 😭✨
                            </p>
                            <p style={{ marginBottom: "1.2rem" }}>
                                We started off as just classmates. A few group talks. Some random jokes. Okay fine — <span className="hover-underline">straight-up roasts</span>. 🔥 And somehow, in the middle of this messy college life, you became my constant. Not by announcing it. Not with some big moment. Just... gradually, and then completely.
                            </p>
                            <p style={{ marginBottom: "1.2rem" }}>
                                Here's the thing about you that most people probably don't say out loud — you feel everything deeply, but you never make it anyone else's problem. 🌿 You're the kind of person who notices the small stuff, remembers what others forget, and cares way more than you let on. On the outside you're all composed and "I don't care," but inside? You're paying attention to <span className="hover-underline">everything</span>.
                            </p>
                            <p style={{ marginBottom: "1.2rem" }}>
                                I've quietly filed some things away over time. The way <em>"Achaa"</em> means five completely different things depending on your tone — and how I now know which one is which. The happy dance that only comes out when something actually good happens, the one you probably don't even realize I've noticed. The complete mid-conversation disappearing act 🥲. And <em>"Door rhoo, chipko nhii"</em> — which I've slowly figured out isn't a warning. It's your way of saying you're comfortable enough to just be yourself.
                            </p>
                            <p style={{ marginBottom: "1.2rem" }}>
                                You roast me like it's your full-time profession 😂, but the way you defend me? That's a different level. You can see me dead but never against you — and that's just facts. That mix of soft and fierce? Genuinely rare. 💜
                            </p>
                            <p style={{ marginBottom: "1.2rem" }}>
                                You've called me out when I was wrong. You've told me harsh truths no one else would 🗣️. You've forced me to grow up when I was acting like a kid. And you didn't do it to be mean — you did it because you actually <span className="hover-underline">gave a damn</span>. There's a version of me that would still be confused and going around in circles if you hadn't showed up and simply refused to let that happen.
                            </p>
                            <p style={{ marginBottom: "1.2rem" }}>
                                Lowkey… you did help turn a confused boy into someone a little more sorted. (Yes, even the "how to behave around the other gender" lessons — <em>shuttlecock</em> will forever be remembered. 🏸 Never. Living. That. Down.)
                            </p>
                            <p style={{ marginBottom: "1.2rem" }}>
                                You're not just someone I laugh with. You're someone I <span className="hover-underline">respect</span>. 🫂 The kind of person who doesn't need loud gestures to feel valued — just sincerity, effort, and someone who genuinely tries to understand them. I hope this whole website counts as trying.
                            </p>
                            <p style={{ marginBottom: "1.2rem" }}>
                                Thank you for not giving up on me — especially during the times I made it hard 🥹. I don't say it enough. But I notice it. Every single time. And I appreciate it more than I know how to put into words.
                            </p>
                            <p style={{ marginBottom: "1.2rem" }}>
                                I don't know how we went from classmates to this. But whatever <em>this</em> is — 🌸 I'm really, really glad we did.
                            </p>

                            <p
                                className="sparkle-sentence"
                                onClick={() => setSparkleActive(true)}
                                onMouseLeave={() => setSparkleActive(false)}
                            >
                                And relax — I'm not letting you disappear again.
                                <AnimatePresence>
                                    {sparkleActive && (
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1, rotate: 15 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            transition={{ type: "spring", bounce: 0.6 }}
                                            style={{ position: "absolute", top: -12, right: -28, color: "var(--color-accent)" }}
                                        >
                                            <Sparkles size={20} fill="var(--color-accent)" />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </p>
                        </div>

                        {/* Sign-off block */}
                        <div style={{
                            marginTop: '2rem',
                            textAlign: 'right',
                            paddingRight: '1rem',
                            position: 'relative',
                            zIndex: 2,
                        }}>
                            <p style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontStyle: 'italic',
                                fontSize: '1rem',
                                opacity: 0.65,
                                color: '#3e3552',
                                marginBottom: '0.3rem',
                            }}>
                                Happy Birthday to my favorite chaos, my personal reality check,
                                and one of the best things college gave me. ✦
                            </p>
                            <p style={{
                                fontFamily: 'var(--font-handwriting)',
                                fontSize: '1.6rem',
                                color: '#3e3552',
                                marginBottom: '0.3rem',
                            }}>
                                bhondu 💜
                            </p>
                            <p style={{
                                fontFamily: 'var(--font-handwriting)',
                                fontSize: '0.85rem',
                                color: '#b89ce6',
                                opacity: 0.6,
                            }}>
                                17 March 2026
                            </p>
                        </div>

                        {/* Thin divider */}
                        <div className="letter-divider" />
                    </motion.div>

                    {/* Part 5: Double-click hint */}
                    <p style={{
                        fontFamily: 'var(--font-handwriting)',
                        fontSize: '0.8rem',
                        opacity: 0.35,
                        textAlign: 'center',
                        marginTop: '1.5rem',
                        color: '#3e3552',
                    }}>
                        ( psst — try double clicking anywhere on the letter )
                    </p>

                    {/* Part 7: Cassette Tape */}
                    <CassetteTape />
                </>
            )}
        </section>
    );
}
