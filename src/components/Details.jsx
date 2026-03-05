import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import WatercolorReveal from './WatercolorReveal';
import TypewriterText from './TypewriterText';

/* ─── WORD DATA ─── */
const WORDS = [
    {
        word: "Achaa.",
        position: { top: "10%", left: "8%" },
        fontSize: "2.1rem",
        baseOpacity: 0.82,
        baseRotate: -1.5,
        decorator: { symbol: "✦", size: "4px", color: "#b89ce6" },
        pullStrength: 0.08,
        photo: "/collage_photo_1_1772561726663.png",
        message: "5 distinct meanings. Depending entirely on the tone.",
        polaroidTilt: -2,
        ambientColor: "#f5e6c8",
        path: {
            x: [0, 8, 15, 5, -3, 10, 0],
            y: [0, 6, 18, 30, 20, 10, 0],
            duration: 28,
            ease: "easeInOut",
            delay: 0,
        },
    },
    {
        word: "Aye bade.",
        position: { top: "25%", left: "60%" },
        fontSize: "1.75rem",
        baseOpacity: 0.70,
        baseRotate: 0.8,
        decorator: { symbol: "· ·", size: "6px", color: "#b89ce6" },
        pullStrength: 0.12,
        photo: "/collage_photo_2_1772561749045.png",
        message: "The ultimate shutdown. No further questions.",
        polaroidTilt: 3,
        ambientColor: "#e8e0f7",
        path: {
            x: [0, -10, -5, 8, 15, 5, 0],
            y: [0, 10, 25, 15, -5, 8, 0],
            duration: 22,
            ease: "easeInOut",
            delay: 3,
        },
    },
    {
        word: "Irritating.",
        position: { top: "50%", left: "20%" },
        fontSize: "2.4rem",
        baseOpacity: 0.88,
        baseRotate: -0.5,
        decorator: { symbol: "!", size: "0.6rem", color: "#f4b6d2" },
        pullStrength: -0.10,
        photo: "/collage_photo_3_1772561775503.png",
        message: "Always said with a completely straight face.",
        polaroidTilt: -4,
        ambientColor: "#f7e8e8",
        microJitter: true,
        path: {
            x: [0, 4, -2, 12, 6, -4, 0],
            y: [0, -8, 5, -3, 12, 8, 0],
            duration: 18,
            ease: "linear",
            delay: 1.5,
        },
    },
    {
        word: "Happy dance + kick",
        position: { top: "20%", left: "35%" },
        fontSize: "1.5rem",
        baseOpacity: 0.65,
        baseRotate: 1.2,
        decorator: { symbol: "♡", size: "10px", color: "#f4b6d2" },
        pullStrength: 0.20,
        photo: "/collage_photo_1_1772561726663.png",
        message: "The rarest sight. Completely worth waiting for.",
        polaroidTilt: 2,
        ambientColor: "#fce4f0",
        path: {
            x: [0, 6, -4, 10, 2, -8, 0],
            y: [0, -10, 5, 15, -5, 8, 0],
            duration: 20,
            ease: [0.34, 1.56, 0.64, 1],
            delay: 2,
        },
    },
    {
        word: "so gyiii 🥲",
        position: { top: "65%", left: "45%" },
        fontSize: "2.0rem",
        baseOpacity: 0.78,
        baseRotate: -2.0,
        decorator: { symbol: "~", size: "inherit", color: "#b89ce6" },
        pullStrength: 0.03,
        photo: "/collage_photo_2_1772561749045.png",
        message: "Mid-conversation. No warning. Just gone.",
        polaroidTilt: -3,
        ambientColor: "#dde8f5",
        opacityDip: true,
        path: {
            x: [0, -8, -18, -10, -22, -12, 0],
            y: [0, 8, 5, 15, 8, 12, 0],
            duration: 26,
            ease: "easeInOut",
            delay: 4,
        },
    },
    {
        word: "Door rhoo, chipko nhii",
        position: { top: "40%", left: "68%" },
        fontSize: "1.35rem",
        baseOpacity: 0.55,
        baseRotate: 0.6,
        decorator: { symbol: "—", size: "inherit", color: "#b89ce6" },
        pullStrength: -0.06,
        photo: "/collage_photo_3_1772561775503.png",
        message: "Personal space. Firmly enforced. Deeply respected.",
        polaroidTilt: 4,
        ambientColor: "#e8f5ee",
        path: {
            x: [0, -12, -6, 5, 8, 2, 0],
            y: [0, -12, 8, 20, 10, -6, 0],
            duration: 30,
            ease: "easeInOut",
            delay: 1,
        },
    },
    {
        word: "Still here.",
        position: { bottom: "8%", right: "6%" },
        fontSize: "1.1rem",
        baseOpacity: 0.08,
        baseRotate: -1.0,
        decorator: null,
        pullStrength: 0,
        photo: "/collage_photo_1_1772561726663.png",
        message: "Still reading? Of course you are.",
        polaroidTilt: 0,
        ambientColor: "#f5f2fb",
        secret: true,
        path: null,
    },
];

/* ─── CONVERT VW/VH PATH TO PIXELS ─── */
function convertPathToPixels(path, isMobile) {
    if (!path) return null;
    const scale = isMobile ? 0.4 : 1.0;
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
        x: path.x.map(v => Math.round(v * 0.01 * w * scale)),
        y: path.y.map(v => Math.round(v * 0.01 * h * scale)),
        duration: path.duration,
        ease: path.ease,
        delay: path.delay,
    };
}

/* ═════════════════════════════════════════════════════════════
   BACKGROUND ELEMENT DATA
   ═════════════════════════════════════════════════════════════ */

/* Scattered dot clusters */
const DOT_POSITIONS = Array.from({ length: 18 }, (_, i) => ({
    top: `${5 + Math.sin(i * 1.7) * 40 + 45}%`,
    left: `${5 + Math.cos(i * 2.3) * 40 + 45}%`,
    size: 2 + (i % 3),
    opacity: 0.06 + (i % 4) * 0.02,
    delay: i * 0.3,
}));

/* Tiny floating accents (original) */
const ACCENT_POSITIONS = [
    { top: "15%", left: "75%", delay: 0 },
    { top: "35%", left: "12%", delay: 2 },
    { top: "60%", left: "85%", delay: 4 },
    { top: "80%", left: "30%", delay: 6 },
];

/* SVG arc data */
const ARC_PATHS = [
    { d: "M 30 80 Q 150 10, 270 80", top: "20%", left: "5%", width: 300 },
    { d: "M 20 60 Q 130 0, 240 60", top: "55%", left: "55%", width: 260 },
    { d: "M 10 50 Q 100 -10, 190 50", top: "75%", left: "25%", width: 200 },
];

/* Radial glow blobs */
const GLOW_BLOBS = [
    { top: "10%", left: "20%", size: 300, color: "rgba(184,156,230,0.06)" },
    { top: "50%", left: "70%", size: 350, color: "rgba(244,182,210,0.05)" },
    { top: "75%", left: "35%", size: 280, color: "rgba(184,156,230,0.04)" },
];

/* NEW — Pressed flower corner accents */
const CORNER_SPRIGS = [
    { pos: { top: 16, left: 16 }, rotate: 15 },
    { pos: { top: 16, right: 16 }, rotate: -20 },
    { pos: { bottom: 16, left: 16 }, rotate: 35 },
    { pos: { bottom: 16, right: 16 }, rotate: -10 },
];

/* NEW — Watercolor stain blobs (SVG ellipses) */
const STAIN_BLOBS = [
    { cx: "15%", cy: "35%", rx: 120, ry: 80, fill: "rgba(244,182,210,0.06)" },
    { cx: "78%", cy: "60%", rx: 150, ry: 100, fill: "rgba(184,156,230,0.07)" },
    { cx: "45%", cy: "82%", rx: 100, ry: 70, fill: "rgba(244,182,210,0.05)" },
];

/* NEW — Scattered tiny stars */
const SCATTERED_STARS = Array.from({ length: 12 }, (_, i) => {
    // Distribute across empty zones
    const positions = [
        { top: "12%", left: "22%" }, { top: "8%", left: "52%" },
        { top: "18%", left: "82%" }, { top: "32%", left: "6%" },
        { top: "38%", left: "48%" }, { top: "28%", left: "90%" },
        { top: "55%", left: "14%" }, { top: "58%", left: "72%" },
        { top: "70%", left: "38%" }, { top: "75%", left: "88%" },
        { top: "85%", left: "18%" }, { top: "90%", left: "62%" },
    ];
    return {
        ...positions[i],
        size: 8 + (i % 4) * 2, // 8, 10, 12, 14
        color: i % 2 === 0 ? "#b89ce6" : "#f4b6d2",
        opacity: 0.15 + (i % 5) * 0.05, // 0.15–0.35
        duration: 18 + i * 1.5, // 18–34.5s
        delay: i * 1.2,
        direction: i % 2 === 0 ? 360 : -360,
    };
});

/* ═════════════════════════════════════════════════════════════
   BOTANICAL SPRIG SVG — simple 4-5 line leaf drawing
   ═════════════════════════════════════════════════════════════ */
function BotanicalSprig({ rotate }) {
    return (
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none"
            style={{ overflow: 'visible' }}
        >
            {/* Main stem */}
            <path d="M30 75 Q28 50 30 10" stroke="#b89ce6" strokeWidth="1" opacity="0.12" />
            {/* Left leaf */}
            <path d="M30 55 Q15 45 12 30" stroke="#b89ce6" strokeWidth="0.8" opacity="0.12" />
            {/* Right leaf */}
            <path d="M30 42 Q42 35 48 22" stroke="#b89ce6" strokeWidth="0.8" opacity="0.12" />
            {/* Small bud left */}
            <path d="M30 28 Q22 22 18 15" stroke="#b89ce6" strokeWidth="0.6" opacity="0.12" />
            {/* Small bud right */}
            <path d="M30 18 Q36 12 40 8" stroke="#b89ce6" strokeWidth="0.6" opacity="0.12" />
        </svg>
    );
}

/* ═════════════════════════════════════════════════════════════
   FLOATING INK WORD COMPONENT
   Outer wrapper: magnetic offset (useMotionValue + useSpring)
   Inner wrapper: roaming path (animate keyframes)
   ═════════════════════════════════════════════════════════════ */
const FloatingInkWord = React.forwardRef(({ wordData, index, mouseX, mouseY, isBlurred, onSelect, isMobile, collisionDim, isExiting, isRestored }, externalRef) => {
    const internalOuterRef = useRef(null);

    const mergedRef = useCallback((el) => {
        internalOuterRef.current = el;
        if (typeof externalRef === 'function') {
            externalRef(el);
        } else if (externalRef) {
            externalRef.current = el;
        }
    }, [externalRef]);

    const jitterX = useMotionValue(0);

    // Magnetic offset values
    const magnetX = useMotionValue(0);
    const magnetY = useMotionValue(0);
    const springX = useSpring(magnetX, { stiffness: 150, damping: 18 });
    const springY = useSpring(magnetY, { stiffness: 150, damping: 18 });

    // Hover state
    const [hovered, setHovered] = useState(false);

    // Runtime pixel path
    const [pixelPath, setPixelPath] = useState(() => convertPathToPixels(wordData.path, isMobile));

    // Recalculate path on resize
    useEffect(() => {
        if (!wordData.path) return;
        let debounceTimer;
        const handleResize = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                setPixelPath(convertPathToPixels(wordData.path, isMobile));
            }, 150);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(debounceTimer);
        };
    }, [wordData.path, isMobile]);

    // Magnetic cursor pull (disabled on mobile)
    useEffect(() => {
        if (wordData.pullStrength === 0 || isBlurred || isMobile) return;

        const updateMagnet = () => {
            if (!internalOuterRef.current) return;
            const rect = internalOuterRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = mouseX.get() - cx;
            const dy = mouseY.get() - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 160) {
                magnetX.set(dx * wordData.pullStrength);
                magnetY.set(dy * wordData.pullStrength);
            } else {
                magnetX.set(0);
                magnetY.set(0);
            }
        };

        const unsub1 = mouseX.on("change", updateMagnet);
        const unsub2 = mouseY.on("change", updateMagnet);
        return () => { unsub1(); unsub2(); };
    }, [wordData.pullStrength, mouseX, mouseY, magnetX, magnetY, isBlurred, isMobile, internalOuterRef]);

    // Micro-jitter for "Irritating."
    useEffect(() => {
        if (!wordData.microJitter) return;
        const interval = setInterval(() => {
            const snap = (Math.random() > 0.5 ? 1 : -1) * 3;
            jitterX.set(snap);
            setTimeout(() => jitterX.set(0), 150);
        }, 3500);
        return () => clearInterval(interval);
    }, [wordData.microJitter, jitterX]);

    // Opacity dip for "so gyiii" at furthest path point
    const opacityKeyframes = wordData.opacityDip
        ? [wordData.baseOpacity, wordData.baseOpacity, wordData.baseOpacity, wordData.baseOpacity, wordData.baseOpacity - 0.15, wordData.baseOpacity, wordData.baseOpacity]
        : undefined;

    const collisionOpacity = collisionDim ? wordData.baseOpacity * 0.4 : wordData.baseOpacity;

    const isSecret = wordData.secret;

    return (
        /* OUTER: magnetic offset */
        <motion.span
            ref={mergedRef}
            onClick={(e) => onSelect(index, e)}
            style={{
                position: "absolute",
                ...wordData.position,
                x: springX,
                y: springY,
                willChange: "transform",
                zIndex: 10,
                cursor: "pointer",
                pointerEvents: isBlurred && !isRestored ? "none" : "auto",
                display: "inline-block",
            }}
            animate={
                isExiting ? { scale: 0, opacity: 0 }
                    : isBlurred && !isRestored ? { filter: "blur(3px)" }
                        : { filter: "blur(0px)" }
            }
            transition={
                isExiting ? { duration: 0.25, ease: "easeIn" }
                    : { filter: { duration: 0.3 } }
            }
        >
            {/* INNER: roaming path */}
            <motion.span
                animate={pixelPath && !isBlurred ? {
                    x: pixelPath.x,
                    y: pixelPath.y,
                    ...(opacityKeyframes ? { opacity: opacityKeyframes } : {}),
                } : {}}
                transition={pixelPath ? {
                    x: { duration: pixelPath.duration, repeat: Infinity, repeatType: "loop", ease: pixelPath.ease, delay: pixelPath.delay },
                    y: { duration: pixelPath.duration, repeat: Infinity, repeatType: "loop", ease: pixelPath.ease, delay: pixelPath.delay },
                    ...(opacityKeyframes ? {
                        opacity: { duration: pixelPath.duration, repeat: Infinity, repeatType: "loop", ease: pixelPath.ease, delay: pixelPath.delay },
                    } : {}),
                } : {}}
                style={{
                    display: "inline-block",
                    position: "relative",
                    x: wordData.microJitter ? jitterX : undefined,
                }}
                onMouseEnter={() => !isMobile && setHovered(true)}
                onMouseLeave={() => !isMobile && setHovered(false)}
                onTouchStart={() => isMobile && setHovered(true)}
                onTouchEnd={() => isMobile && setTimeout(() => setHovered(false), 1500)}
            >
                {/* The ink word */}
                <motion.span
                    animate={{
                        opacity: isBlurred && !isRestored ? 0.15
                            : hovered ? 1.0
                                : collisionDim ? wordData.baseOpacity * 0.4
                                    : wordData.baseOpacity,
                        textShadow: hovered
                            ? '1px 1.5px 0px rgba(62,53,82,0.2)'
                            : '0.5px 0.8px 0px rgba(62,53,82,0.15)',
                    }}
                    transition={{ opacity: hovered ? { duration: 0 } : { duration: 0.4 }, textShadow: { duration: 0.2 } }}
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontStyle: "italic",
                        fontWeight: 500,
                        fontSize: wordData.fontSize,
                        color: "#3e3552",
                        cursor: "pointer",
                        userSelect: "none",
                        letterSpacing: "-0.01em",
                        lineHeight: 1,
                        opacity: isSecret ? wordData.baseOpacity : undefined,
                        rotate: wordData.baseRotate,
                        whiteSpace: "nowrap",
                        position: "relative",
                        display: "inline-block",
                    }}
                    whileHover={isSecret ? { opacity: 0.9 } : {}}
                >
                    {wordData.word}

                    {/* Hover underline */}
                    <motion.span
                        animate={{ width: hovered ? "100%" : "0%" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{
                            position: "absolute",
                            bottom: -3,
                            left: 0,
                            height: 1,
                            background: "#b89ce6",
                            opacity: 0.4,
                            display: "block",
                        }}
                    />

                    {/* Hover decorator */}
                    {wordData.decorator && (
                        <motion.span
                            animate={hovered
                                ? { scale: 1, rotate: 0, opacity: 1 }
                                : { scale: 0, rotate: -45, opacity: 0 }
                            }
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            style={{
                                position: "absolute",
                                right: -18,
                                top: "50%",
                                translateY: "-50%",
                                fontSize: wordData.decorator.size,
                                color: wordData.decorator.color,
                                pointerEvents: "none",
                                lineHeight: 1,
                                display: "inline-block",
                                originX: 0.5,
                                originY: 0.5,
                            }}
                        >
                            {wordData.decorator.symbol}
                        </motion.span>
                    )}
                </motion.span>
            </motion.span>
        </motion.span>
    );
});

/* ═════════════════════════════════════════════════════════════
   DISSOLUTION PARTICLES (16 radial)
   ═════════════════════════════════════════════════════════════ */
function DissolutionParticles({ originX, originY }) {
    const count = 16;
    return (
        <div style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 100 }}>
            {[...Array(count)].map((_, i) => {
                const angle = (i / count) * 360 * (Math.PI / 180);
                const dist = 50 + Math.random() * 30;
                const tx = Math.cos(angle) * dist;
                const ty = Math.sin(angle) * dist;
                const dur = 0.6 + Math.random() * 0.2; // 600–800ms
                return (
                    <motion.div
                        key={i}
                        initial={{ x: originX, y: originY, scale: 0, opacity: 1, rotate: 0 }}
                        animate={{
                            x: originX + tx,
                            y: originY + ty,
                            scale: [0, 1.8, 0],
                            opacity: [1, 0.8, 0],
                            rotate: Math.random() * 720,
                        }}
                        transition={{ duration: dur, ease: "easeOut" }}
                        style={{
                            position: "absolute",
                            width: 3,
                            height: 3,
                            borderRadius: "50%",
                            background: "#b89ce6",
                        }}
                    />
                );
            })}
        </div>
    );
}

/* ═════════════════════════════════════════════════════════════
   ACTIVE CARD (POLAROID + TYPEWRITER + FLOATING PETALS)
   Callback-driven phase transitions (Fix #1)
   Absolute positioning throughout (Fix #3)
   Scroll-aware centering (Fix #5)
   ═════════════════════════════════════════════════════════════ */
function ActiveCard({ chip, phase, originX, originY, sectionRef, onPhaseChange }) {
    const isSecret = chip.secret;
    const cardWidth = isSecret ? 360 : 340;
    const cardHeight = isSecret ? 400 : 380;

    // Calculate section-relative center (Fix #5)
    const [center, setCenter] = useState({ x: originX, y: originY });
    useEffect(() => {
        if (!sectionRef.current) return;
        const sectionRect = sectionRef.current.getBoundingClientRect();
        const sectionTop = sectionRect.top + window.scrollY;
        const cx = sectionRect.width / 2 - cardWidth / 2;
        const cy = (window.scrollY - sectionTop) + window.innerHeight / 2 - cardHeight / 2;
        setCenter({ x: cx, y: cy });
    }, [sectionRef, cardWidth, cardHeight]);

    // When polaroid entrance completes → advance to typing
    const handlePolaroidSettled = useCallback(() => {
        onPhaseChange('typing');
    }, [onPhaseChange]);

    if (isSecret) {
        // ── "Still here." — flash-in behavior ──
        return (
            <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ left: originX - cardWidth / 2, top: originY - cardHeight / 2 }}
                animate={{ left: center.x, top: center.y }}
                transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                style={{
                    position: "absolute",
                    width: cardWidth,
                    zIndex: 30,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                    cursor: "default",
                }}
            >
                {/* Flash photo */}
                <motion.div
                    style={{ position: "relative", overflow: "hidden", borderRadius: 4 }}
                >
                    <motion.img
                        src={chip.photo}
                        alt={chip.word}
                        initial={{ opacity: 1, filter: "brightness(4)" }}
                        animate={{ filter: "brightness(1)" }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: cardWidth,
                            height: cardHeight,
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                    {/* Vignette overlay */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)",
                        pointerEvents: "none",
                    }} />
                </motion.div>

                {/* Instant message — no typewriter */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "0.9rem",
                        color: "#3e3552",
                        opacity: 0.82,
                        textAlign: "center",
                        maxWidth: 280,
                        lineHeight: 1.6,
                    }}
                >
                    {chip.message}
                </motion.div>
            </motion.div>
        );
    }

    // ── Normal word — full polaroid sequence ──
    const showPolaroid = phase === 'polaroid' || phase === 'typing' || phase === 'done';
    const showTyping = phase === 'typing' || phase === 'done';

    return (
        <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ left: originX - cardWidth / 2, top: originY - cardHeight / 2 }}
            animate={{ left: center.x, top: center.y }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
                position: "absolute",
                width: cardWidth,
                zIndex: 30,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                cursor: "default",
            }}
        >
            {/* Polaroid Frame */}
            {showPolaroid && (
                <motion.div
                    initial={{ y: -25, rotate: -10, scale: 0.92, opacity: 0 }}
                    animate={{ y: 0, rotate: chip.polaroidTilt, scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 160,
                        damping: 12,
                    }}
                    onAnimationComplete={handlePolaroidSettled}
                    style={{
                        background: "#fff",
                        padding: "12px 12px 48px 12px",
                        borderRadius: 3,
                        boxShadow: "3px 8px 24px rgba(0,0,0,0.14)",
                        position: "relative",
                        maxWidth: 320,
                    }}
                >
                    <motion.img
                        src={chip.photo}
                        alt={chip.word}
                        initial={{ filter: "saturate(0) brightness(2)" }}
                        animate={{ filter: "saturate(1) brightness(1)" }}
                        transition={{ duration: 0.9, delay: 0.3 }}
                        style={{
                            width: "100%",
                            height: 220,
                            objectFit: "cover",
                            borderRadius: 2,
                            display: "block",
                        }}
                    />

                    {/* Washi Tape — 200ms after polaroid settles */}
                    <motion.div
                        initial={{ y: -20, scale: 0, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 280,
                            damping: 18,
                            delay: 0.2,
                        }}
                        style={{
                            position: "absolute",
                            top: -9,
                            left: "50%",
                            marginLeft: -29,
                            width: 58,
                            height: 18,
                            background: "rgba(220,210,240,0.82)",
                            borderRadius: 2,
                            transform: "rotate(-18deg)",
                            zIndex: 5,
                        }}
                    />

                    {/* Lavender Sprig — 350ms after polaroid settles */}
                    <motion.img
                        src="/lavender_branch.png"
                        alt=""
                        initial={{ x: 40, y: -20, opacity: 0 }}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 14,
                            delay: 0.35,
                        }}
                        style={{
                            position: "absolute",
                            top: -30,
                            right: -20,
                            width: 85,
                            transform: "rotate(-38deg)",
                            filter: "drop-shadow(1px 3px 5px rgba(0,0,0,0.12))",
                            pointerEvents: "none",
                            zIndex: 6,
                        }}
                    />
                </motion.div>
            )}

            {/* Typewriter Message */}
            {showTyping && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <TypewriterText
                        text={chip.message}
                        onComplete={() => onPhaseChange('done')}
                    />
                </motion.div>
            )}
        </motion.div>
    );
}

/* ═════════════════════════════════════════════════════════════
   FLOATING PETALS (Act 4)
   ═════════════════════════════════════════════════════════════ */
function FloatingPetals({ originX, originY }) {
    const petals = useMemo(() => [
        { delay: 0, color: "#b89ce6", driftX: -40 },
        { delay: 0.12, color: "#f4b6d2", driftX: 35 },
        { delay: 0.24, color: "#b89ce6", driftX: -55 },
        { delay: 0.38, color: "#f4b6d2", driftX: 50 },
    ], []);

    return (
        <div style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 25 }}>
            {petals.map((p, i) => (
                <motion.div
                    key={i}
                    initial={{ x: originX, y: originY, opacity: 0, rotate: 0 }}
                    animate={{
                        x: originX + p.driftX,
                        y: originY - 180,
                        opacity: [0, 1, 1, 0],
                        rotate: (i % 2 === 0 ? 1 : -1) * 180,
                    }}
                    transition={{
                        duration: 2.2,
                        delay: p.delay,
                        ease: "easeOut",
                    }}
                    style={{
                        position: "absolute",
                        width: 5,
                        height: 7,
                        borderRadius: "50% 0 50% 50%",
                        background: p.color,
                    }}
                />
            ))}
        </div>
    );
}

/* ═════════════════════════════════════════════════════════════
   MAIN DETAILS COMPONENT
   ═════════════════════════════════════════════════════════════ */
export default function Details() {
    const sectionRef = useRef(null);
    const wordRefs = useRef([]);

    // Original state
    const [activeIndex, setActiveIndex] = useState(null);
    const [petals, setPetals] = useState([]);
    const petalIdRef = useRef(0);
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
    const [collisionDims, setCollisionDims] = useState(() => new Array(WORDS.length).fill(false));
    const frameCountRef = useRef(0);

    // New state for click reveal sequence
    const [activeWord, setActiveWord] = useState(null);
    const [phase, setPhase] = useState(null);
    const [dissolveOrigin, setDissolveOrigin] = useState(null);
    const [showParticles, setShowParticles] = useState(false);
    const [restoreIndex, setRestoreIndex] = useState(-1);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Parallax offsets for flower layers
    const farX = useSpring(useMotionValue(0), { stiffness: 50, damping: 30 });
    const farY = useSpring(useMotionValue(0), { stiffness: 50, damping: 30 });
    const nearX = useSpring(useMotionValue(0), { stiffness: 80, damping: 25 });
    const nearY = useSpring(useMotionValue(0), { stiffness: 80, damping: 25 });

    // Active ambient color
    const bgColor = activeWord ? activeWord.ambientColor : null;

    // Mobile detection on resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Collision awareness (opacity-based)
    useEffect(() => {
        let rafId;
        const check = () => {
            frameCountRef.current++;
            if (frameCountRef.current % 3 === 0 && wordRefs.current.length > 0) {
                const rects = wordRefs.current.map(ref => ref?.getBoundingClientRect?.() || null);
                const newDims = new Array(WORDS.length).fill(false);

                for (let i = 0; i < rects.length; i++) {
                    if (!rects[i]) continue;
                    for (let j = i + 1; j < rects.length; j++) {
                        if (!rects[j]) continue;
                        const cx1 = rects[i].left + rects[i].width / 2;
                        const cy1 = rects[i].top + rects[i].height / 2;
                        const cx2 = rects[j].left + rects[j].width / 2;
                        const cy2 = rects[j].top + rects[j].height / 2;
                        const dist = Math.sqrt((cx1 - cx2) ** 2 + (cy1 - cy2) ** 2);
                        if (dist < 80) {
                            newDims[j] = true;
                        }
                    }
                }
                setCollisionDims(prev => {
                    for (let k = 0; k < prev.length; k++) {
                        if (prev[k] !== newDims[k]) return newDims;
                    }
                    return prev;
                });
            }
            rafId = requestAnimationFrame(check);
        };
        rafId = requestAnimationFrame(check);
        return () => cancelAnimationFrame(rafId);
    }, []);

    // Mouse tracking + parallax + petal trail
    const handleMouseMove = useCallback(
        (e) => {
            const rect = sectionRef.current?.getBoundingClientRect();
            if (!rect) return;
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Parallax
            const dx = e.clientX - rect.left - rect.width / 2;
            const dy = e.clientY - rect.top - rect.height / 2;
            if (!activeWord) {
                farX.set(dx * -0.015);
                farY.set(dy * -0.015);
                nearX.set(dx * 0.03);
                nearY.set(dy * 0.03);
            }

            // Petal trail — throttle to max 18
            setPetals((prev) => {
                if (prev.length >= 18) return prev;
                const id = petalIdRef.current++;
                return [
                    ...prev,
                    {
                        id,
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        rotate: Math.random() * 360,
                    },
                ];
            });
        },
        [mouseX, mouseY, farX, farY, nearX, nearY, activeWord]
    );

    // Petal cleanup
    useEffect(() => {
        if (petals.length === 0) return;
        const timer = setTimeout(() => {
            setPetals((prev) => prev.slice(1));
        }, 800);
        return () => clearTimeout(timer);
    }, [petals]);

    // Word click handler — record coords, kick off dissolution
    const handleSelect = useCallback(
        (index, e) => {
            if (activeWord) return;
            const wordData = WORDS[index];
            const sectionRect = sectionRef.current?.getBoundingClientRect();
            if (!sectionRect) return;

            // Section-relative coords
            const originX = e.clientX - sectionRect.left;
            const originY = e.clientY - sectionRect.top;

            setActiveIndex(index);
            setActiveWord({ ...wordData, originX, originY, index });
            setDissolveOrigin({ x: originX, y: originY });

            if (wordData.secret) {
                // "Still here." — skip dissolution, go straight to done-like state
                setPhase('polaroid');
            } else {
                // Act 1: dissolution
                setPhase('dissolve');
                setShowParticles(true);

                // Only setTimeout in the chain: dissolution → bleeding (250ms)
                setTimeout(() => {
                    setPhase('bleeding');
                    setShowParticles(false);
                }, 250);
            }
        },
        [activeWord]
    );

    // Watercolor reveal complete → polaroid (callback-driven, Fix #1)
    const handleRevealComplete = useCallback(() => {
        setPhase('polaroid');
    }, []);

    // Phase change from ActiveCard (polaroid settled → typing, etc.)
    const handlePhaseChange = useCallback((newPhase) => {
        setPhase(newPhase);
    }, []);

    // Close handler
    const handleClose = useCallback(() => {
        setRestoreIndex(0);
    }, []);

    // Staggered restore
    useEffect(() => {
        if (restoreIndex < 0 || restoreIndex >= WORDS.length) return;

        if (restoreIndex === activeIndex) {
            if (restoreIndex >= WORDS.length - 1) {
                setActiveWord(null);
                setActiveIndex(null);
                setPhase(null);
                setDissolveOrigin(null);
                setShowParticles(false);
                setRestoreIndex(-1);
            } else {
                setRestoreIndex(r => r + 1);
            }
            return;
        }

        const timer = setTimeout(() => {
            if (restoreIndex === WORDS.length - 1) {
                setActiveWord(null);
                setActiveIndex(null);
                setPhase(null);
                setDissolveOrigin(null);
                setShowParticles(false);
                setRestoreIndex(-1);
            } else {
                setRestoreIndex(r => r + 1);
            }
        }, 80);
        return () => clearTimeout(timer);
    }, [restoreIndex, activeIndex]);

    const isActive = activeWord !== null;

    return (
        <section
            ref={sectionRef}
            id="details"
            onMouseMove={handleMouseMove}
            style={{
                position: "relative",
                minHeight: "100vh",
                width: "100%",
                overflow: "hidden",
                cursor: "default",
            }}
        >
            {/* ───── LAYER 0: BREATHING GRADIENT BACKGROUND ───── */}
            <motion.div
                animate={{
                    background: bgColor
                        ? `linear-gradient(135deg, ${bgColor}, #f5f2fb)`
                        : [
                            "linear-gradient(135deg, #f5f2fb, #fdf0f7)",
                            "linear-gradient(135deg, #fdf0f7, #f0edfb)",
                            "linear-gradient(135deg, #f0edfb, #f5f2fb)",
                        ],
                }}
                transition={
                    bgColor
                        ? { duration: 1.5, ease: "easeInOut" }
                        : { duration: 12, repeat: Infinity, ease: "easeInOut" }
                }
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                }}
            />

            {/* ───── ELEMENT 1: FAINT RULED LINES (notebook paper) ───── */}
            <svg
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                {[...Array(8)].map((_, i) => (
                    <line
                        key={`rule-${i}`}
                        x1="0"
                        y1={80 + i * 80}
                        x2="100%"
                        y2={80 + i * 80}
                        stroke="#b89ce6"
                        strokeWidth="0.4"
                        opacity="0.07"
                    />
                ))}
            </svg>

            {/* ───── ELEMENT 2: PRESSED FLOWER CORNER ACCENTS ───── */}
            {CORNER_SPRIGS.map((sprig, i) => (
                <motion.div
                    key={`sprig-${i}`}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        position: "absolute",
                        ...sprig.pos,
                        width: 60,
                        height: 80,
                        pointerEvents: "none",
                        zIndex: 1,
                        transform: `rotate(${sprig.rotate}deg)`,
                    }}
                >
                    <BotanicalSprig rotate={sprig.rotate} />
                </motion.div>
            ))}

            {/* ───── ELEMENT 3: WATERCOLOR STAIN BLOBS ───── */}
            <svg
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <defs>
                    <filter id="stain-blur">
                        <feGaussianBlur stdDeviation="25" />
                    </filter>
                </defs>
                {STAIN_BLOBS.map((blob, i) => (
                    <ellipse
                        key={`stain-${i}`}
                        cx={blob.cx}
                        cy={blob.cy}
                        rx={blob.rx}
                        ry={blob.ry}
                        fill={blob.fill}
                        filter="url(#stain-blur)"
                    />
                ))}
            </svg>

            {/* ───── ELEMENT 4: SCATTERED TINY STARS ───── */}
            {SCATTERED_STARS.map((star, i) => (
                <motion.span
                    key={`star-${i}`}
                    animate={{ rotate: star.direction }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: star.delay,
                    }}
                    style={{
                        position: "absolute",
                        top: star.top,
                        left: star.left,
                        fontSize: `${star.size}px`,
                        color: star.color,
                        opacity: star.opacity,
                        pointerEvents: "none",
                        zIndex: 1,
                        userSelect: "none",
                        display: "inline-block",
                    }}
                >
                    ✦
                </motion.span>
            ))}

            {/* ───── RADIAL GLOW BLOBS ───── */}
            {GLOW_BLOBS.map((blob, i) => (
                <motion.div
                    key={`glow-${i}`}
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [1, 0.7, 1],
                    }}
                    transition={{ duration: 8 + i * 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        position: "absolute",
                        top: blob.top,
                        left: blob.left,
                        width: blob.size,
                        height: blob.size,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
                        pointerEvents: "none",
                        zIndex: 1,
                    }}
                />
            ))}

            {/* ───── SCATTERED DOT CLUSTERS ───── */}
            {DOT_POSITIONS.map((dot, i) => (
                <motion.div
                    key={`dot-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: dot.opacity, scale: 1 }}
                    transition={{ duration: 0.6, delay: dot.delay * 0.1 }}
                    style={{
                        position: "absolute",
                        top: dot.top,
                        left: dot.left,
                        width: dot.size,
                        height: dot.size,
                        borderRadius: "50%",
                        background: "#b89ce6",
                        pointerEvents: "none",
                        zIndex: 1,
                    }}
                />
            ))}

            {/* ───── SVG DASHED ARC LINES ───── */}
            {ARC_PATHS.map((arc, i) => (
                <svg
                    key={`arc-${i}`}
                    style={{
                        position: "absolute",
                        top: arc.top,
                        left: arc.left,
                        width: arc.width,
                        height: 100,
                        pointerEvents: "none",
                        zIndex: 1,
                        opacity: 0.08,
                    }}
                    viewBox={`0 0 ${arc.width} 100`}
                    fill="none"
                >
                    <path
                        d={arc.d}
                        stroke="#b89ce6"
                        strokeWidth="1"
                        strokeDasharray="6 8"
                        fill="none"
                    />
                </svg>
            ))}

            {/* ───── TINY FLOATING ✦ ACCENTS (original) ───── */}
            {ACCENT_POSITIONS.map((acc, i) => (
                <motion.span
                    key={`accent-${i}`}
                    animate={{
                        y: [0, -8, 0, 8, 0],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut", delay: acc.delay }}
                    style={{
                        position: "absolute",
                        top: acc.top,
                        left: acc.left,
                        fontSize: "8px",
                        color: "#b89ce6",
                        pointerEvents: "none",
                        zIndex: 1,
                        userSelect: "none",
                    }}
                >
                    ✦
                </motion.span>
            ))}

            {/* ───── WATERCOLOR WASH ───── */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    height: 400,
                    background: "radial-gradient(ellipse, rgba(184,156,230,0.06) 0%, transparent 65%)",
                    filter: "blur(40px)",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />

            {/* ───── PARALLAX FLOWER: FAR LAYER ───── */}
            <motion.img
                src="/lavender_branch.png"
                alt=""
                style={{
                    position: "absolute",
                    top: "-5%",
                    right: "-8%",
                    width: "45%",
                    maxWidth: 500,
                    opacity: 0.07,
                    filter: "blur(18px)",
                    x: farX,
                    y: farY,
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />

            {/* ───── PARALLAX FLOWER: NEAR LAYER ───── */}
            <motion.img
                src="/lavender_flower.png"
                alt=""
                style={{
                    position: "absolute",
                    bottom: "-10%",
                    left: "-8%",
                    width: "40%",
                    maxWidth: 440,
                    opacity: 0.12,
                    filter: "blur(8px)",
                    x: nearX,
                    y: nearY,
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />

            {/* ───── PETAL TRAIL ───── */}
            <AnimatePresence>
                {petals.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ x: p.x, y: p.y, opacity: 0.7, scale: 1, rotate: p.rotate }}
                        animate={{ y: p.y + 30, opacity: 0, scale: 0.5, rotate: p.rotate + 120 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                            position: "absolute",
                            width: 4,
                            height: 6,
                            borderRadius: "50% 0 50% 50%",
                            background: "#b89ce6",
                            pointerEvents: "none",
                            zIndex: 2,
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* ───── SECTION TITLE ───── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                    position: "relative",
                    zIndex: 15,
                    textAlign: "center",
                    paddingTop: "6rem",
                    paddingBottom: "2rem",
                }}
            >
                <h2
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                        fontWeight: 500,
                        color: "#3e3552",
                        letterSpacing: "-0.02em",
                        opacity: isActive ? 0.15 : 1,
                        transition: "opacity 0.5s ease",
                    }}
                >
                    Memory Garden
                </h2>
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 60 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    style={{
                        height: 2,
                        background: "linear-gradient(90deg, transparent, #b89ce6, transparent)",
                        margin: "1rem auto 0",
                        opacity: isActive ? 0.1 : 0.6,
                        transition: "opacity 0.5s ease",
                    }}
                />
            </motion.div>

            {/* ───── FLOATING INK WORDS ───── */}
            {WORDS.map((wordData, i) => {
                const isExiting = isActive && activeWord?.index === i && phase === 'dissolve';
                const isGone = isActive && activeWord?.index === i && phase !== 'dissolve';

                return (
                    <AnimatePresence>
                        {!isGone && (
                            <FloatingInkWord
                                key={i}
                                ref={el => { wordRefs.current[i] = el; }}
                                wordData={wordData}
                                index={i}
                                mouseX={mouseX}
                                mouseY={mouseY}
                                isBlurred={isActive && activeWord?.index !== i}
                                onSelect={handleSelect}
                                isMobile={isMobile}
                                collisionDim={collisionDims[i]}
                                isExiting={isExiting}
                                isRestored={restoreIndex >= 0 && i <= restoreIndex}
                            />
                        )}
                    </AnimatePresence>
                );
            })}

            {/* ───── DISSOLUTION PARTICLES (Act 1) ───── */}
            <AnimatePresence>
                {showParticles && dissolveOrigin && !activeWord?.secret && (
                    <DissolutionParticles originX={dissolveOrigin.x} originY={dissolveOrigin.y} />
                )}
            </AnimatePresence>

            {/* ───── WATERCOLOR REVEAL (Act 2) ───── */}
            {activeWord && !activeWord.secret && (
                <WatercolorReveal
                    isTriggered={phase === 'bleeding' || phase === 'polaroid' || phase === 'typing' || phase === 'done'}
                    origin={{ x: activeWord.originX, y: activeWord.originY }}
                    photoSrc={activeWord.photo}
                    onRevealComplete={handleRevealComplete}
                    noiseSeed={activeWord.index || 1}
                />
            )}

            {/* ───── DARK BACKDROP ───── */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        onClick={handleClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 20,
                            background: "rgba(245,242,251,0.72)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            cursor: "pointer",
                        }}
                    />
                )}
            </AnimatePresence>

            {/* ───── ACTIVE CARD (Polaroid + Typewriter) ───── */}
            <AnimatePresence>
                {isActive && activeWord && (phase === 'polaroid' || phase === 'typing' || phase === 'done' || activeWord.secret) && (
                    <ActiveCard
                        key="active-card"
                        chip={activeWord}
                        phase={phase}
                        originX={activeWord.originX}
                        originY={activeWord.originY}
                        sectionRef={sectionRef}
                        onPhaseChange={handlePhaseChange}
                    />
                )}
            </AnimatePresence>

            {/* ───── FLOATING PETALS (Act 4) ───── */}
            <AnimatePresence>
                {dissolveOrigin && (phase === 'typing' || phase === 'done') && !activeWord?.secret && (
                    <FloatingPetals originX={dissolveOrigin.x} originY={dissolveOrigin.y} />
                )}
            </AnimatePresence>

            {/* ───── BOTTOM SPACER ───── */}
            <div style={{ height: "12rem" }} />
        </section>
    );
}
