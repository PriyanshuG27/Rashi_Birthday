import React, { useEffect, useState } from 'react';
import './App.css';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
// Feature Components
import Hero from './components/Hero';
import Profile from './components/Profile';
import Details from './components/Details';
import Letter from './components/Letter';
import Status from './components/Status';
import Final from './components/Final';

function App() {
  const { scrollYProgress } = useScroll();
  const [showIdleParticles, setShowIdleParticles] = useState(false);

  // Scroll idle detection (V3.0)
  useEffect(() => {
    let idleTimer;

    const handleScroll = () => {
      setShowIdleParticles(false);
      clearTimeout(idleTimer);

      if (window.scrollY > 150) {
        idleTimer = setTimeout(() => {
          setShowIdleParticles(true);
        }, 3000); // 3 seconds idle
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(idleTimer);
    };
  }, []);

  // Subtle color progression (Global Polish #2)
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#f5f2fb", "#f8f4fb", "#fcf5f7"]
  );

  return (
    <motion.div className="app-container" style={{ backgroundColor: bgColor }}>

      {/* GLOBAL FLORAL LAYERS (V3.0) */}
      <div className="global-floral-layer far-bg">
        <img src="/lavender_branch.png" className="floral-sprig sprig-1" alt="" />
        <img src="/lavender_branch.png" className="floral-sprig sprig-2" alt="" />
        <img src="/lavender_branch.png" className="floral-sprig sprig-3" alt="" />
      </div>

      <div className="global-floral-layer mid-depth">
        <motion.img
          src="/lavender_flower.png"
          className="floral-bloom bloom-1"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -150]) }}
          alt=""
        />
        <motion.img
          src="/lavender_flower.png"
          className="floral-bloom bloom-2"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -300]) }}
          alt=""
        />
      </div>

      {/* Foreground Idle Particles */}
      <AnimatePresence>
        {showIdleParticles && (
          <motion.div
            className="idle-particles-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="idle-particle"
                initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
                animate={{
                  y: '-20vh',
                  x: `${Math.random() * 100}vw`,
                  opacity: [0, 0.6, 0],
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  ease: "easeOut",
                  delay: Math.random() * 0.8
                }}
              >
                ✿
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="content-layers-wrapper">
        <Hero />
        <div className="spacer-wave" />
        <Profile />
        <div className="spacer-wave" />
        <Details />
        <div className="spacer-wave" />
        <Letter />
        <div className="spacer-wave" />
        <Status />
        <div className="spacer-wave" />
        <Final />
      </div>
    </motion.div>
  );
}

export default App;
