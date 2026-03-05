import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, animate } from 'framer-motion';
import { Heart } from 'lucide-react';

/* ═════════════════════════════════════════════════════════════
   LETTER TIMING DATA
   ═════════════════════════════════════════════════════════════ */
const LETTER_DATA = [
  { char: 'R', delay: 500,  dur: 380, blur: 5 },
  { char: 'a', delay: 820,  dur: 280, blur: 3 },
  { char: 's', delay: 1060, dur: 320, blur: 4 },
  { char: 'h', delay: 1340, dur: 300, blur: 3 },
  { char: 'i', delay: 1580, dur: 160, blur: 2 },
  { char: 'i', delay: 1720, dur: 160, blur: 2 },
  { char: 'i', delay: 1860, dur: 160, blur: 2 },
];

/* ═════════════════════════════════════════════════════════════
   INK LETTER — per-letter clip reveal with blur + pressure
   ═════════════════════════════════════════════════════════════ */
function InkLetter({ char, delay, dur, blur }) {
  const progress = useMotionValue(0);

  const clipPath = useTransform(
    progress,
    [0, 1],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
  );
  const filter = useTransform(
    progress,
    [0, 0.35, 1],
    [`blur(${blur}px)`, `blur(${blur * 0.4}px)`, 'blur(0px)']
  );
  const scale = useTransform(
    progress,
    [0, 0.25, 0.85, 1],
    [0.9, 1.05, 1.02, 1]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      animate(progress, 1, {
        duration: dur / 1000,
        ease: [0.2, 0, 0.3, 1],
      });
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const sharedStyle = {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontStyle: 'italic',
    fontWeight: 500,
    fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
    letterSpacing: '-0.01em',
    lineHeight: 1,
    display: 'inline-block',
  };

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {/* Ghost — holds space, invisible */}
      <span style={{ ...sharedStyle, color: 'transparent' }}>
        {char}
      </span>
      {/* Ink layer — clips and blurs in */}
      <motion.span
        style={{
          ...sharedStyle,
          color: '#3e3552',
          position: 'absolute',
          top: 0,
          left: 0,
          clipPath,
          filter,
          scale,
          transformOrigin: 'left center',
        }}
      >
        {char}
      </motion.span>
    </span>
  );
}

/* ═════════════════════════════════════════════════════════════
   INK NIB — moves across the text as letters form
   ═════════════════════════════════════════════════════════════ */
function InkNib() {
  const x = useMotionValue(0);
  const opacity = useMotionValue(0);

  useEffect(() => {
    setTimeout(() => {
      animate(opacity, 1, { duration: 0.15 });
      animate(x, 100, {
        duration: 1.56,
        ease: 'linear',
      });
      setTimeout(() => {
        animate(opacity, 0, { duration: 0.25 });
      }, 1550);
    }, 500);
  }, []);

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '12%',
        left: 0,
        translateX: useTransform(x, v => `${v}%`),
        opacity,
        pointerEvents: 'none',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{
        width: 5,
        height: 9,
        background: 'radial-gradient(ellipse at 35% 25%, rgba(62,53,82,0.55), rgba(184,156,230,0.25))',
        borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
        transform: 'rotate(-12deg)',
        filter: 'blur(0.5px)',
        flexShrink: 0,
      }} />
    </motion.div>
  );
}

/* ═════════════════════════════════════════════════════════════
   RASHIII CALLIGRAPHY — per-letter ink formation
   ═════════════════════════════════════════════════════════════ */
const RashiiiCalligraphy = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Letter row with nib */}
      <div style={{
        position: 'relative',
        display: 'inline-block',
        lineHeight: 1.1,
      }}>
        <InkNib />
        {LETTER_DATA.map((l, i) => (
          <InkLetter key={i} {...l} />
        ))}
      </div>

      {/* Underline draws left to right after all letters settle */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{
          duration: 0.75,
          delay: 2.25,
          ease: [0.2, 0, 0.2, 1],
        }}
        style={{
          height: 2,
          width: 'clamp(220px, 40vw, 340px)',
          background: 'linear-gradient(90deg, #b89ce6, rgba(184,156,230,0.1))',
          borderRadius: 2,
          marginTop: 8,
          transformOrigin: 'left center',
        }}
      />
    </div>
  );
};

export default function Hero() {
    const containerRef = useRef(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isHeartHovered, setIsHeartHovered] = useState(false);
    const [heartBurst, setHeartBurst] = useState(false);

    // Scroll Parallax
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
    const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Cursor Tracking Physics
    const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
    const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

    const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    const repelX1 = useTransform(smoothMouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [30, -30]);
    const repelY1 = useTransform(smoothMouseY, [0, typeof window !== "undefined" ? window.innerHeight : 800], [30, -30]);

    const repelX2 = useTransform(smoothMouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [-40, 40]);
    const repelY2 = useTransform(smoothMouseY, [0, typeof window !== "undefined" ? window.innerHeight : 800], [-40, 40]);

    const pullX = useTransform(smoothMouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1000], ["-60%", "-40%"]);
    const pullY = useTransform(smoothMouseY, [0, typeof window !== "undefined" ? window.innerHeight : 800], ["-60%", "-40%"]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Heart Hover Easter Egg (2s hold)
    useEffect(() => {
        let hoverTimer;
        if (isHeartHovered) {
            hoverTimer = setTimeout(() => {
                setHeartBurst(true);
                setTimeout(() => setHeartBurst(false), 1000);
            }, 2000);
        }
        return () => clearTimeout(hoverTimer);
    }, [isHeartHovered]);

    const handleTapUnlock = (e) => {
        if (!isUnlocked) {
            setIsUnlocked({ x: e.clientX, y: e.clientY });
            setTimeout(() => {
                setIsUnlocked(false);
            }, 5000);
        }
    };

    return (
        <section
            ref={containerRef}
            className="hero"
            id="hero"
            onClick={handleTapUnlock}
            style={{ overflow: 'hidden', position: 'relative', cursor: isUnlocked ? 'default' : 'pointer' }}
        >
            {/* V3 Breathing Glow + Cursor Pull */}
            <motion.div
                className="hero-glow-interactive"
                style={{ x: pullX, y: pullY }}
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.12, 0.18, 0.12]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating Shapes with Repel Physics */}
            <motion.div
                className="floating-shape shape-1"
                style={{ x: repelX1, y: repelY1 }}
            />
            <motion.div
                className="floating-shape shape-2"
                style={{ x: repelX2, y: repelY2 }}
            />

            {/* Section fades in from white */}
            <motion.div
                initial={{ opacity: 0, backgroundColor: 'rgba(255,255,255,1)' }}
                animate={{ opacity: 1, backgroundColor: 'rgba(255,255,255,0)' }}
                transition={{ duration: 0.4 }}
                style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
            />

            <motion.div
                style={{ y: yText, opacity: opacityText }}
                className="hero-content"
            >
                {/* "Happy Birthday" fades in */}
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0, ease: "easeOut" }}
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontStyle: 'italic',
                        fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                        fontWeight: 400,
                        color: '#3e3552',
                        letterSpacing: '-0.01em',
                        marginBottom: '0.5rem',
                    }}
                >
                    Happy Birthday

                    {/* Interactive Doodle Heart */}
                    <motion.span
                        initial={{ opacity: 0, scale: 0, rotate: -20 }}
                        animate={{
                            opacity: 1,
                            scale: heartBurst ? 1.15 : 1,
                            rotate: 10,
                            filter: heartBurst ? "drop-shadow(0 0 10px rgba(184, 156, 230, 0.8))" : "drop-shadow(0 0 0px rgba(0,0,0,0))"
                        }}
                        transition={{ type: "spring", bounce: 0.6, duration: heartBurst ? 0.3 : 1.5, delay: 1.2 }}
                        className="hero-doodle-heart"
                        onMouseEnter={() => setIsHeartHovered(true)}
                        onMouseLeave={() => { setIsHeartHovered(false); setHeartBurst(false); }}
                        style={{ cursor: 'pointer', display: 'inline-block' }}
                    >
                        <Heart size={28} strokeWidth={1.5} fill="var(--color-pink)" color="var(--color-pink)" />

                        {/* Heart 2s Hover Easter Egg Particle Burst */}
                        <AnimatePresence>
                            {heartBurst && (
                                <motion.div className="heart-particles-container">
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={`hp-${i}`}
                                            className="heart-particle"
                                            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                            animate={{
                                                scale: [0, 1.5, 0],
                                                x: Math.cos(i * 60 * (Math.PI / 180)) * 40,
                                                y: Math.sin(i * 60 * (Math.PI / 180)) * 40,
                                                opacity: 0
                                            }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.span>
                </motion.h2>

                {/* Rashiii calligraphy — per-letter ink formation */}
                <RashiiiCalligraphy />

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 0.72, y: 0 }}
                    transition={{ duration: 0.6, delay: 3.2 }}
                    style={{
                        fontFamily: "var(--font-handwriting)",
                        fontSize: '1.05rem',
                        color: '#b89ce6',
                        marginBottom: '1.2rem',
                        marginTop: '1.5rem',
                    }}
                >
                    the day you became someone's favourite person.
                </motion.p>

                {/* Pulsing ✦ */}
                <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{
                        opacity: { duration: 3, delay: 3.6, repeat: Infinity, ease: "easeInOut" },
                        scale: { duration: 3, delay: 3.6, repeat: Infinity, ease: "easeInOut" }
                    }}
                    style={{
                        fontSize: '10px',
                        color: '#b89ce6',
                        display: 'block',
                        marginBottom: '2rem',
                    }}
                >
                    ✦
                </motion.span>

                {/* Animated divider */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 40, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 4.2, ease: "easeInOut" }}
                    className="hero-divider-animated"
                />

                {/* Date as postmark */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 1, delay: 4.5 }}
                    style={{
                        fontFamily: "var(--font-handwriting)",
                        fontSize: '0.9rem',
                        color: '#3e3552',
                        marginTop: '1.5rem',
                        letterSpacing: '0.05em',
                    }}
                >
                    17 March
                </motion.p>
            </motion.div>

            {/* V3 Achaa Tap Unlock Easter Egg */}
            <AnimatePresence>
                {isUnlocked && (
                    <>
                        <motion.div
                            className="achaa-backdrop"
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            style={{ position: 'fixed', inset: 0, zIndex: 9, pointerEvents: 'none', background: 'rgba(245, 242, 251, 0.4)' }}
                            transition={{ duration: 1 }}
                        />
                        <motion.div
                            className="achaa-container"
                            style={{
                                left: isUnlocked.x,
                                top: isUnlocked.y,
                                position: 'fixed',
                                zIndex: 10,
                                x: '-50%',
                                y: '-100%'
                            }}
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="achaa-bubble-wrapper"
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: [0, 1, 1, 0], y: -50, scale: 1 }}
                                transition={{ duration: 4, ease: "easeOut", times: [0, 0.1, 0.8, 1] }}
                            >
                                <svg width="120" height="60" viewBox="0 0 120 60" style={{ position: 'absolute', inset: 0, zIndex: -1, overflow: 'visible' }}>
                                    <motion.path
                                        d="M 10 10 C 10 0, 110 0, 110 10 C 110 40, 70 40, 60 55 C 50 40, 10 40, 10 10 Z"
                                        fill="white"
                                        stroke="var(--color-accent)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, fillOpacity: 0 }}
                                        animate={{ pathLength: 1, fillOpacity: 0.9 }}
                                        transition={{ duration: 1.2, ease: "easeInOut" }}
                                    />
                                </svg>
                                <span style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.4rem', color: 'var(--color-text)', display: 'block', padding: '12px 0 0 0', textAlign: 'center' }}>
                                    Achaa.
                                </span>
                            </motion.div>

                            <motion.div className="achaa-particles" style={{ position: 'absolute', top: '-20px', left: '50%' }}>
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={`ap-${i}`}
                                        className="achaa-particle"
                                        initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                                        animate={{
                                            scale: [0, Math.random() + 0.5, 0],
                                            x: (Math.random() - 0.5) * 100,
                                            y: (Math.random() - 0.5) * 100 - 40,
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 3.2 }}
                                        style={{ position: 'absolute', width: '4px', height: '4px', background: 'var(--color-accent)', borderRadius: '50%' }}
                                    />
                                ))}
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}