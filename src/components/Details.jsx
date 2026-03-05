import React, { useRef, useState } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Star, ArrowUpRight, MessageCircle, Smile, Zap, Flower2 } from 'lucide-react';

export default function Details() {
    const sectionRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [showEasterEgg, setShowEasterEgg] = useState(false);

    // Array of memories with pre-calculated randomized imperfection offsets (Rotation max ±2°)
    const memories = [
        {
            id: 1,
            chipText: "Achaa.",
            caption: "5 distinct meanings, depending on tone.",
            icon: <MessageCircle size={18} fill="var(--color-divider)" color="transparent" />,
            pos: { top: '0%', left: '5%' },
            animProps: { lift: true, zoom: true },
            offset: { rotate: (Math.random() - 0.5) * 4, scale: 1 + (Math.random() * 0.03) }
        },
        {
            id: 2,
            chipText: "Aye bade.",
            caption: "The ultimate shutdown.",
            icon: <Zap size={18} fill="var(--color-accent)" color="transparent" />,
            pos: { top: '15%', left: '25%' },
            animProps: { shake: true },
            offset: { rotate: (Math.random() - 0.5) * 4, scale: 1 + (Math.random() * 0.03) }
        },
        {
            id: 3,
            chipText: "Irritating.",
            caption: "Always said with a straight face.",
            icon: <ArrowUpRight size={20} color="var(--color-text)" strokeWidth={2.5} />,
            pos: { top: '30%', left: '0%' },
            animProps: { rotate: true },
            offset: { rotate: (Math.random() - 0.5) * 4, scale: 1 + (Math.random() * 0.03) }
        },
        {
            id: 4,
            chipText: "Happy dance + kick",
            caption: "The rarest, cutest sight.",
            icon: <Star size={18} fill="var(--color-pink)" color="var(--color-pink)" />,
            pos: { top: '45%', left: '20%' },
            animProps: { bounce: true },
            offset: { rotate: (Math.random() - 0.5) * 4, scale: 1 + (Math.random() * 0.03) }
        },
        {
            id: 5,
            chipText: "so gyiii 🥲",
            caption: "Mid-conversation vanish trick.",
            icon: <span style={{ fontSize: '1.2rem', transform: 'rotate(-15deg)', display: 'inline-block' }}>🥲</span>,
            pos: { top: '60%', left: '10%' },
            animProps: { fade: true, slideUp: true },
            offset: { rotate: (Math.random() - 0.5) * 4, scale: 1 + (Math.random() * 0.03) }
        },
        {
            id: 6,
            chipText: "Door rhoo, chipko nhii",
            caption: "Personal space firmly enforced.",
            icon: <Smile size={18} />,
            pos: { top: '75%', left: '15%' },
            animProps: { shake: true },
            offset: { rotate: (Math.random() - 0.5) * 4, scale: 1 + (Math.random() * 0.03) }
        }
    ];

    return (
        <section ref={sectionRef} className="details-section" id="details">
            <div className="details-bg-gradient" />

            {/* Hidden Space Easter Egg Trigger Zone */}
            <div
                className="details-easter-egg-zone"
                onMouseEnter={() => setShowEasterEgg(true)}
                onMouseLeave={() => setShowEasterEgg(false)}
            />

            <AnimatePresence>
                {showEasterEgg && (
                    <motion.div
                        className="details-hidden-text"
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                        animate={{ opacity: 0.25, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)", transition: { duration: 1.5 } }}
                        transition={{ duration: 0.8 }}
                    >
                        Standards. Always.
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="details-container">

                {/* Left Column: Chips Stack */}
                <div className="phrases-column z-elevated">
                    <h2 className="section-title">The Details</h2>
                    <div className="chips-list">
                        {memories.map((mem, i) => {
                            const isActive = activeIndex === i;
                            return (
                                <div
                                    key={mem.id}
                                    className="chip-wrapper"
                                    onMouseEnter={() => setActiveIndex(i)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                    // onClick handles mobile tap
                                    onClick={() => setActiveIndex(isActive ? null : i)}
                                >
                                    <motion.div
                                        className={`phrase-chip ${isActive ? 'active' : ''}`}
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        layout
                                    >
                                        <span className="chip-text">{mem.chipText}</span>
                                        {isActive && (
                                            <motion.div
                                                className="chip-doodle"
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: 10 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                            >
                                                {mem.icon}
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    {/* Hover Caption Mini-Card */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                className="chip-caption-card"
                                                initial={{ opacity: 0, y: 5, scale: 0.95, rotate: -2 }}
                                                animate={{ opacity: 1, y: -5, scale: 1, rotate: Math.random() * 4 - 2 }}
                                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                            >
                                                {mem.caption}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Anchored Collage Stack */}
                <div className="photos-column">
                    <div className="collage-wrapper">
                        {memories.map((mem, i) => { // Render all 6 photos
                            const isActive = activeIndex === i;
                            const hasActive = activeIndex !== null;

                            // Base imperfection state
                            let baseRotate = mem.offset.rotate;
                            let baseScale = mem.offset.scale;

                            // V3.0 Draggable Polaroids
                            const isDraggable = i === 0 || i === 2;

                            // Active state animation properties
                            let animateState = {
                                scale: baseScale,
                                rotate: baseRotate,
                                y: 0,
                                x: 0,
                                zIndex: isActive ? 50 : (mem.id),
                                opacity: (hasActive && !isActive) ? 0.7 : 1,
                                filter: (hasActive && !isActive) ? "blur(3px) grayscale(20%) brightness(0.9)" : "blur(0px) grayscale(0%) brightness(1)",
                                boxShadow: isActive ? "var(--shadow-scrapbook)" : "0 4px 12px rgba(0,0,0,0.05)"
                            };

                            if (isActive) {
                                if (mem.animProps.lift) { animateState.y = -15; animateState.scale = baseScale * 1.08; }
                                if (mem.animProps.zoom) { animateState.scale = baseScale * 1.12; }
                                if (mem.animProps.shake) { animateState.rotate = [baseRotate - 5, baseRotate + 5, baseRotate - 3, baseRotate + 3, baseRotate]; }
                                if (mem.animProps.rotate) { animateState.rotate = baseRotate + 15; }
                                if (mem.animProps.bounce) { animateState.y = [-10, 0, -5, 0]; }
                                if (mem.animProps.slideUp) { animateState.y = -20; animateState.x = 10; }
                            }

                            return (
                                <motion.div
                                    key={`photo-${mem.id}`}
                                    className={`collage-polaroid ${isActive ? 'active-polaroid' : ''} ${isDraggable ? 'is-draggable' : ''}`}
                                    style={{ ...mem.pos }}
                                    animate={animateState}
                                    transition={{
                                        duration: mem.animProps.shake ? 0.4 : 0.6,
                                        type: "spring",
                                        bounce: mem.animProps.bounce ? 0.7 : 0.4
                                    }}
                                    drag={isDraggable}
                                    dragSnapToOrigin={isDraggable}
                                    dragConstraints={isDraggable ? { top: -40, bottom: 40, left: -40, right: 40 } : false}
                                    dragElastic={0.2}
                                    whileDrag={isDraggable ? { scale: 1.1, zIndex: 99, rotate: 0, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", cursor: 'grabbing' } : {}}
                                >
                                    <div className="polaroid-inner">
                                        <div
                                            className="polaroid-image-placeholder"
                                            style={{
                                                backgroundImage: `url('/collage_photo_${(mem.id % 3) + 1}_1772561726663.png')`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        />

                                        {/* Washi tape with peel effect */}
                                        {mem.id % 2 === 0 && (
                                            <div className="polaroid-tape-container" style={{ transform: `rotate(${mem.id * 5}deg)` }}>
                                                <div className="polaroid-tape" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}
