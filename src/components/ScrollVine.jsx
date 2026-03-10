import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

function BloomDot({ bloom, scrollYProgress }) {
    const start = Math.max(0, bloom.threshold - 0.02);
    const end = Math.min(1, bloom.threshold + 0.02);
    const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
    const scaleRaw = useTransform(scrollYProgress, [start, end], [0, 1]);
    const scale = useSpring(scaleRaw, { stiffness: 300, damping: 20 });

    return (
        <motion.div
            style={{
                position: 'absolute',
                top: bloom.top,
                left: bloom.left,
                opacity,
                scale,
                transformOrigin: 'center center',
            }}
        >
            <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="#b89ce6"
                opacity="0.6"
                style={{ transform: 'translate(-50%, -50%)' }}
            >
                <path d="M12 2C12 2 15 6 15 10C15 13 12 14 12 14C12 14 9 13 9 10C9 6 12 2 12 2Z" />
                <path d="M12 22C12 22 15 18 15 14C15 11 12 10 12 10C12 10 9 11 9 14C9 18 12 22 12 22Z" />
                <path d="M22 12C22 18 18 22 14 22C11 22 10 18 10 18C10 18 11 15 14 15C18 15 22 18 22 18Z" transform="translate(12, 12) rotate(-90) translate(-12, -12)" />
                <path d="M2 12C2 18 6 22 10 22C13 22 14 18 14 18C14 18 13 15 10 15C6 15 2 18 2 18Z" transform="translate(12, 12) rotate(90) translate(-12, -12)" />
                <circle cx="12" cy="12" r="2" fill="#fff" opacity="0.8" />
            </svg>
        </motion.div>
    );
}

export default function ScrollVine() {
    const { scrollYProgress } = useScroll();

    // Directly map scroll context to vine completion
    const vinePathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

    // Bloom appearance points
    const blooms = [
        { threshold: 0.15, top: "15%", left: "20px" },
        { threshold: 0.30, top: "30%", left: "15px" },
        { threshold: 0.50, top: "50%", left: "24px" },
        { threshold: 0.70, top: "70%", left: "12px" },
        { threshold: 0.85, top: "85%", left: "20px" },
    ];

    return (
        <div
            className="scroll-vine-container"
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                height: '100vh',
                width: '40px',
                pointerEvents: 'none',
                zIndex: 10
            }}
        >
            <style>{`
        @media (max-width: 639px) {
          .scroll-vine-container {
            display: none !important;
          }
        }
      `}</style>

            <svg
                width="40"
                height="100%"
                viewBox="0 0 40 1000"
                preserveAspectRatio="none"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            >
                <motion.path
                    d="M 20 0 C 15 100 25 200 18 300 C 12 400 22 500 16 600 C 10 700 25 800 20 900 C 15 950 28 980 20 1000"
                    stroke="#b89ce6"
                    strokeWidth="1.2"
                    opacity="0.35"
                    fill="none"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ pathLength: vinePathLength }}
                />
            </svg>

            {/* Blooms */}
            {blooms.map((bloom, index) => (
                <BloomDot key={index} bloom={bloom} scrollYProgress={scrollYProgress} />
            ))}
        </div>
    );
}
