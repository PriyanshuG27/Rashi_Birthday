import React, { useEffect, useState, useRef, useCallback, createContext, useContext } from 'react';
import './App.css';

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
// Feature Components
import Hero from './components/Hero';
import Profile from './components/Profile';
import Timeline from './components/Timeline';
import Details from './components/Details';
import Letter from './components/Letter';
import Status from './components/Status';
import Final from './components/Final';

/* ═══════════════════════════════════════════
   SOUND CONTEXT (Part 10)
   ═══════════════════════════════════════════ */
const SoundContext = createContext({
  isMuted: true,
  playChime: () => { },
  playRustle: () => { },
  playCakeCandles: () => { },
  playEnvelopeHold: () => { return null; },
  playWaxCrack: () => { },
  playEnvelopeSlide: () => { },
  playWordDissolve: () => { },
  playPolaroidSettle: () => { },
  playBirthdayChime: () => { },
  playPrint: () => { },
});

export function useSound() {
  return useContext(SoundContext);
}

function createSoundSystem() {
  let ctx = null;

  const getCtx = () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctx;
  };

  const playChime = () => {
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ac.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.38);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.4);
    } catch (e) { /* silent fail */ }
  };

  const playRustle = () => {
    try {
      const ac = getCtx();
      const bufferSize = ac.sampleRate * 0.08;
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.06;
      }
      const source = ac.createBufferSource();
      source.buffer = buffer;
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.08, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
      source.connect(gain);
      gain.connect(ac.destination);
      source.start(ac.currentTime);
    } catch (e) { /* silent fail */ }
  };

  const playCakeCandles = () => {
    try {
      const puff = (delay) => setTimeout(() => {
        const ac = getCtx();
        const buf = ac.createBuffer(1, ac.sampleRate * 0.04, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < buf.length; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / buf.length) * 0.15;
        }
        const src = ac.createBufferSource();
        src.buffer = buf;
        const filter = ac.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.12, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
        src.connect(filter);
        filter.connect(gain);
        gain.connect(ac.destination);
        src.start();
      }, delay);
      puff(0); puff(120); puff(240);
    } catch (e) { }
  };

  const playEnvelopeHold = () => {
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ac.currentTime);
      osc.frequency.linearRampToValueAtTime(320, ac.currentTime + 0.6);
      gain.gain.setValueAtTime(0.04, ac.currentTime);
      gain.gain.linearRampToValueAtTime(0.07, ac.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.65);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.7);
      return osc;
    } catch (e) { return null; }
  };

  const playWaxCrack = () => {
    try {
      const crack = (volume, duration) => {
        const ac = getCtx();
        const buf = ac.createBuffer(1, ac.sampleRate * duration, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < buf.length; i++) {
          const env = Math.pow(1 - i / buf.length, 1.5);
          data[i] = (Math.random() * 2 - 1) * volume * env;
        }
        const src = ac.createBufferSource();
        src.buffer = buf;
        const filter = ac.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 800;
        const gain = ac.createGain();
        gain.gain.setValueAtTime(volume, ac.currentTime);
        src.connect(filter);
        filter.connect(gain);
        gain.connect(ac.destination);
        src.start();
      };
      crack(0.35, 0.08);
      setTimeout(() => crack(0.15, 0.05), 45);
      setTimeout(() => crack(0.08, 0.04), 85);
    } catch (e) { }
  };

  const playEnvelopeSlide = () => {
    try {
      const ac = getCtx();
      const buf = ac.createBuffer(1, ac.sampleRate * 0.3, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < buf.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.08;
      }
      const src = ac.createBufferSource();
      src.buffer = buf;
      const filter = ac.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, ac.currentTime);
      filter.frequency.linearRampToValueAtTime(600, ac.currentTime + 0.3);
      filter.Q.value = 3;
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.08, ac.currentTime);
      gain.gain.setValueAtTime(0.06, ac.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.32);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);
      src.start();
    } catch (e) { }
  };

  const playWordDissolve = () => {
    try {
      const ac = getCtx();
      const buf = ac.createBuffer(1, ac.sampleRate * 0.2, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < buf.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.05;
      }
      const src = ac.createBufferSource();
      src.buffer = buf;
      const filter = ac.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, ac.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, ac.currentTime + 0.1);
      filter.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.2);
      filter.Q.value = 4;
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.1, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.22);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);
      src.start();
    } catch (e) { /* silent fail */ }
  };

  const playPolaroidSettle = () => {
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const og = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ac.currentTime + 0.08);
      og.gain.setValueAtTime(0.15, ac.currentTime);
      og.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
      osc.connect(og); og.connect(ac.destination);
      osc.start(); osc.stop(ac.currentTime + 0.12);

      const buf = ac.createBuffer(1, ac.sampleRate * 0.03, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < buf.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.1 * (1 - i / buf.length);
      }
      const src = ac.createBufferSource();
      src.buffer = buf;
      const ng = ac.createGain();
      ng.gain.setValueAtTime(0.08, ac.currentTime);
      src.connect(ng); ng.connect(ac.destination);
      src.start();
    } catch (e) { }
  };

  const playBirthdayChime = () => {
    try {
      const ac = getCtx();
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      freqs.forEach((freq, i) => {
        setTimeout(() => {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, ac.currentTime);
          gain.gain.linearRampToValueAtTime(0.1, ac.currentTime + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(ac.currentTime);
          osc.stop(ac.currentTime + 0.55);
        }, i * 180);
      });
    } catch (e) { }
  };

  const playPrint = () => {
    try {
      const ac = getCtx();
      const fireBurst = (delay) => {
        setTimeout(() => {
          const buf = ac.createBuffer(1, ac.sampleRate * 0.08, ac.sampleRate);
          const data = buf.getChannelData(0);
          for (let i = 0; i < buf.length; i++) {
            const env = Math.pow(1 - i / buf.length, 2);
            data[i] = (Math.random() * 2 - 1) * 0.12 * env;
          }
          const src = ac.createBufferSource();
          src.buffer = buf;
          const filter = ac.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.value = 1200;

          src.connect(filter);
          filter.connect(ac.destination);
          src.start();
        }, delay);
      };
      fireBurst(0);
      fireBurst(250);
      fireBurst(500);
    } catch (e) { }
  };

  return { playChime, playRustle, playCakeCandles, playEnvelopeHold, playWaxCrack, playEnvelopeSlide, playWordDissolve, playPolaroidSettle, playBirthdayChime, playPrint };
}

/* ═══════════════════════════════════════════
   CUSTOM CURSOR (Part 2)
   ═══════════════════════════════════════════ */
function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 200, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 200, damping: 20 });
  const [isPointer, setIsPointer] = useState(false);
  const [splatters, setSplatters] = useState([]);
  const splatterIdRef = useRef(0);

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Check if hovering clickable
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const computed = window.getComputedStyle(el);
        setIsPointer(
          computed.cursor === 'pointer' ||
          el.tagName === 'A' ||
          el.tagName === 'BUTTON' ||
          el.closest('a') !== null ||
          el.closest('button') !== null
        );
      }
    };

    const click = (e) => {
      const id = splatterIdRef.current++;
      const dots = Array.from({ length: 3 }, (_, i) => ({
        id: `${id}-${i}`,
        x: e.clientX,
        y: e.clientY,
        dx: (Math.random() - 0.5) * 2 * 70,
        dy: (Math.random() - 0.5) * 2 * 70,
      }));
      setSplatters(prev => [...prev, ...dots]);
      setTimeout(() => {
        setSplatters(prev => prev.filter(d => !dots.find(dd => dd.id === d.id)));
      }, 550);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('click', click);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('click', click);
    };
  }, [cursorX, cursorY]);

  // Check if device supports hover (skip cursor on touch devices)
  const [isTouchDevice] = useState(() =>
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          width: isPointer ? 14 : 8,
          height: isPointer ? 14 : 8,
          borderRadius: '50%',
          background: isPointer ? 'transparent' : '#b89ce6',
          border: isPointer ? '1.5px solid #b89ce6' : 'none',
          opacity: 0.85,
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.15s, height 0.15s, background 0.15s, border 0.15s',
        }}
      />

      {/* Click splatters */}
      <AnimatePresence>
        {splatters.map(dot => (
          <motion.div
            key={dot.id}
            initial={{ x: dot.x, y: dot.y, scale: 1, opacity: 0.8 }}
            animate={{
              x: dot.x + dot.dx,
              y: dot.y + dot.dy,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: 'fixed',
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: '#b89ce6',
              pointerEvents: 'none',
              zIndex: 9998,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════
   APP
   ═══════════════════════════════════════════ */
function App() {
  const { scrollYProgress } = useScroll();
  const [showIdleParticles, setShowIdleParticles] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const soundSystemRef = useRef(null);

  // Initialize sound system lazily
  const getSounds = useCallback(() => {
    if (!soundSystemRef.current) {
      soundSystemRef.current = createSoundSystem();
    }
    return soundSystemRef.current;
  }, []);

  const soundApi = {
    isMuted,
    playChime: () => { if (!isMuted) getSounds().playChime(); },
    playRustle: () => { if (!isMuted) getSounds().playRustle(); },
    playCakeCandles: () => { if (!isMuted) getSounds().playCakeCandles(); },
    playEnvelopeHold: () => { return !isMuted ? getSounds().playEnvelopeHold() : null; },
    playWaxCrack: () => { if (!isMuted) getSounds().playWaxCrack(); },
    playEnvelopeSlide: () => { if (!isMuted) getSounds().playEnvelopeSlide(); },
    playWordDissolve: () => { if (!isMuted) getSounds().playWordDissolve(); },
    playPolaroidSettle: () => { if (!isMuted) getSounds().playPolaroidSettle(); },
    playBirthdayChime: () => { if (!isMuted) getSounds().playBirthdayChime(); },
    playPrint: () => { if (!isMuted) getSounds().playPrint(); },
  };

  // Scroll idle detection
  useEffect(() => {
    let idleTimer;

    const handleScroll = () => {
      setShowIdleParticles(false);
      clearTimeout(idleTimer);

      if (window.scrollY > 150) {
        idleTimer = setTimeout(() => {
          setShowIdleParticles(true);
        }, 3000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(idleTimer);
    };
  }, []);

  // Subtle color progression
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#f5f2fb", "#f8f4fb", "#fcf5f7"]
  );

  return (
    <SoundContext.Provider value={soundApi}>
      <motion.div className="app-container" style={{ backgroundColor: bgColor }}>

        {/* Custom Cursor */}
        <CustomCursor />

        {/* GLOBAL FLORAL LAYERS */}
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
          <Timeline />
          <div className="spacer-wave" />
          <Details />
          <div className="spacer-wave" />
          <Letter />
          <div className="spacer-wave" />
          <Status />
          <div className="spacer-wave" />
          <Final />
        </div>

        {/* Sound Toggle (Part 10) */}
        <button
          onClick={() => setIsMuted(m => !m)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 999,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(184,156,230,0.3)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          title={isMuted ? "Unmute sounds" : "Mute sounds"}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </motion.div>
    </SoundContext.Provider>
  );
}

export default App;
