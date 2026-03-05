import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export default function Letter() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const [hearts, setHearts] = useState([]);
    const [sparkleActive, setSparkleActive] = useState(false);

    // 10. Paper Lift Depth (Subtle 3D transform on scroll)
    const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);
    const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-3, 0, 3]);
    const zIndex = useTransform(scrollYProgress, [0, 0.5, 1], [0, 10, 0]);

    // 9. Spotlight Focus Effect
    const bgBlur = useTransform(scrollYProgress, [0.3, 0.5, 0.7], ["blur(0px)", "blur(8px)", "blur(0px)"]);
    const shadowDepth = useTransform(
        scrollYProgress,
        [0.3, 0.5, 0.7],
        ["0 4px 12px rgba(62, 53, 82, 0.05)", "0 25px 50px rgba(62, 53, 82, 0.2)", "0 4px 12px rgba(62, 53, 82, 0.05)"]
    );
    const ambientGlow = useTransform(
        scrollYProgress,
        [0.3, 0.5, 0.7],
        ["rgba(184, 156, 230, 0)", "rgba(184, 156, 230, 0.15)", "rgba(184, 156, 230, 0)"]
    );

    const handleDoubleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setHearts(prev => [...prev, { id: Date.now(), x, y }]);
    };

    return (
        <section className="letter-section" id="note" ref={containerRef} style={{ perspective: "1000px", position: "relative" }}>

            {/* Spotlight Focus Background Blur Layer */}
            <motion.div
                className="letter-spotlight-bg"
                style={{
                    position: "absolute",
                    inset: "-50vw", // Cover a large area behind it
                    backdropFilter: bgBlur,
                    backgroundColor: ambientGlow,
                    zIndex: -1,
                    pointerEvents: "none"
                }}
            />

            <motion.div
                className="letter-wrapper"
                onDoubleClick={handleDoubleClick}
                style={{
                    rotateX,
                    rotateY,
                    zIndex,
                    boxShadow: shadowDepth,
                    transformStyle: "preserve-3d",
                    cursor: "cell" // Indicate interaction
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            >
                {/* Hearts particle system (V3.0 Double Click) */}
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

                <div className="letter-content" style={{ lineHeight: 1.9 }}>
                    <p style={{ marginBottom: "1.2rem" }}>
                        <span className="drop-cap">T</span>
                        his isn't a loud celebration. You don't like those anyway.
                    </p>
                    <p style={{ marginBottom: "1.2rem" }}>
                        Consider this a quiet acknowledgment of the space you occupy.
                    </p>
                    <p style={{ marginBottom: "1.2rem" }}>
                        You demand respect by simply existing, expect <span className="hover-underline">consistency</span> because
                        you offer it, and disappear when your social battery hits <span className="hover-underline">1%</span>.
                    </p>
                    <p style={{ marginBottom: "1.2rem" }}>
                        It is a very specific, slightly intimidating, incredibly <span className="hover-underline">genuine</span> way to be. I wouldn't recommend changing a single thing.
                    </p>

                    <p
                        className="sparkle-sentence"
                        onClick={() => setSparkleActive(true)}
                        onMouseLeave={() => setSparkleActive(false)}
                    >
                        And it's not going anywhere.
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

                {/* Thin divider */}
                <div className="letter-divider" />
            </motion.div>
        </section>
    );
}
