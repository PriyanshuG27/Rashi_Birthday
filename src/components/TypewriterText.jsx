import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/*
  TypewriterText — Act 4 typewriter effect.
  Variable char delay (42–88ms), extra 180ms after punctuation.
  Blinking cursor disappears 600ms after last character.
*/

export default function TypewriterText({ text, onComplete }) {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        if (!text) return;

        let i = 0;
        let cancelled = false;
        setDisplayedText('');
        setIsTyping(true);
        setShowCursor(true);

        const typeNext = () => {
            if (cancelled) return;
            if (i < text.length) {
                const char = text[i];
                i++;
                setDisplayedText(text.slice(0, i));

                // Variable delay
                let delay = 42 + Math.random() * 46; // 42–88ms
                // Extra pause after punctuation
                if ('.,!?'.includes(char)) {
                    delay += 180;
                }
                setTimeout(typeNext, delay);
            } else {
                setIsTyping(false);
                // Hide cursor 600ms after done
                setTimeout(() => {
                    if (!cancelled) {
                        setShowCursor(false);
                        onComplete?.();
                    }
                }, 600);
            }
        };

        // Small initial delay before first char
        const startTimer = setTimeout(typeNext, 100);

        return () => {
            cancelled = true;
            clearTimeout(startTimer);
        };
    }, [text]);

    return (
        <div
            style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: 'italic',
                fontSize: '1.05rem',
                color: '#3e3552',
                opacity: 0.82,
                textAlign: 'center',
                maxWidth: 280,
                margin: '16px auto 0',
                lineHeight: 1.6,
                minHeight: 32,
            }}
        >
            {displayedText}
            <AnimatePresence>
                {showCursor && (
                    <motion.span
                        key="cursor"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        style={{
                            display: 'inline-block',
                            width: 1,
                            height: '1em',
                            background: '#b89ce6',
                            marginLeft: 2,
                            verticalAlign: 'text-bottom',
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
