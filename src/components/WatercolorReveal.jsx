import React, { useEffect, useRef, useState } from 'react';

/*
  WatercolorReveal — Act 2 of the click reveal sequence.

  PERFORMANCE FIX: The wrapper is NOT full-section. Instead it's
  a bounded box around the origin point, sized to contain all
  bloom circles. This prevents the SVG filter from processing
  the entire viewport. Clip-path coords are relative to the
  wrapper's own coordinate space.
  
  Architecture:
  - Outer wrapper: bounded box, carries SVG displacement filter
  - 4 inner divs: each position absolute inset 0, each with own clipPath
  - Each inner div: duplicate <img> (absolute, inset 0, cover)
*/

// Padding around origin to contain all blooms
const PADDING = 480; // enough for main radius 420 + bloom offsets

export default function WatercolorReveal({
    isTriggered,
    origin,
    photoSrc,
    onRevealComplete,
    noiseSeed = 1,
}) {
    const seed = noiseSeed;
    const filterId = `wc-filter-${seed}`;
    const completedRef = useRef(false);
    const displacementRef = useRef(null);
    const mainClipRef = useRef(null);
    const bloom1ClipRef = useRef(null);
    const bloom2ClipRef = useRef(null);
    const bloom3ClipRef = useRef(null);
    const imgRefs = useRef([]);
    const [filterActive, setFilterActive] = useState(true);
    const [visible, setVisible] = useState(false);

    // Wrapper bounds: centered on origin, padded to contain all blooms
    const wrapperLeft = origin.x - PADDING;
    const wrapperTop = origin.y - PADDING;
    const wrapperSize = PADDING * 2;

    // Local coordinates (relative to wrapper)
    const localX = PADDING; // origin is at center of wrapper
    const localY = PADDING;

    useEffect(() => {
        if (!isTriggered || completedRef.current) return;
        setVisible(true);

        const lx = localX;
        const ly = localY;

        // Animate displacement scale via ref (no re-renders)
        const dispAnim = async () => {
            await animateValue(0, 45, 400, (v) => {
                if (displacementRef.current) {
                    displacementRef.current.setAttribute('scale', String(v));
                }
            });
            await new Promise(r => setTimeout(r, 500));
            await animateValue(45, 28, 500, (v) => {
                if (displacementRef.current) {
                    displacementRef.current.setAttribute('scale', String(v));
                }
            });
        };
        dispAnim();

        // Main circle: 0 → 420 over 1300ms
        animateValue(0, 420, 1300, (v) => {
            if (mainClipRef.current) {
                mainClipRef.current.style.clipPath = `circle(${v}px at ${lx}px ${ly}px)`;
            }
        }).then(() => {
            if (!completedRef.current) {
                completedRef.current = true;
                setFilterActive(false);
                onRevealComplete?.();
            }
        });

        // Bloom 1: 0 → 65, delay 180ms, 600ms
        const b1Timer = setTimeout(() => {
            animateValue(0, 65, 600, (v) => {
                if (bloom1ClipRef.current) {
                    bloom1ClipRef.current.style.clipPath = `circle(${v}px at ${lx + 85}px ${ly - 45}px)`;
                }
            });
        }, 180);

        // Bloom 2: 0 → 55, delay 310ms, 500ms
        const b2Timer = setTimeout(() => {
            animateValue(0, 55, 500, (v) => {
                if (bloom2ClipRef.current) {
                    bloom2ClipRef.current.style.clipPath = `circle(${v}px at ${lx - 65}px ${ly + 95}px)`;
                }
            });
        }, 310);

        // Bloom 3: 0 → 50, delay 430ms, 550ms
        const b3Timer = setTimeout(() => {
            animateValue(0, 50, 550, (v) => {
                if (bloom3ClipRef.current) {
                    bloom3ClipRef.current.style.clipPath = `circle(${v}px at ${lx + 115}px ${ly + 55}px)`;
                }
            });
        }, 430);

        // Color: saturate 0→1 (900ms, delay 300ms), brightness 2.5→1 (700ms, delay 300ms)
        const colorTimer = setTimeout(() => {
            const startTime = performance.now();
            const tick = (now) => {
                const elapsed = now - startTime;
                const satT = Math.min(elapsed / 900, 1);
                const briT = Math.min(elapsed / 700, 1);
                const filter = `saturate(${satT}) brightness(${2.5 - 1.5 * briT})`;
                imgRefs.current.forEach(img => {
                    if (img) img.style.filter = filter;
                });
                if (satT < 1 || briT < 1) {
                    requestAnimationFrame(tick);
                }
            };
            requestAnimationFrame(tick);
        }, 300);

        return () => {
            clearTimeout(b1Timer);
            clearTimeout(b2Timer);
            clearTimeout(b3Timer);
            clearTimeout(colorTimer);
        };
    }, [isTriggered]);

    if (!isTriggered && !visible) return null;

    const innerDivStyle = {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        clipPath: 'circle(0px at 0px 0px)',
    };

    const imgStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
        filter: 'saturate(0) brightness(2.5)',
    };

    return (
        <>
            {/* Hidden SVG filter */}
            <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
                <defs>
                    <filter
                        id={filterId}
                        x="-60%"
                        y="-60%"
                        width="220%"
                        height="220%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.012 0.008"
                            numOctaves="3"
                            seed={seed}
                            result="noise"
                        />
                        <feDisplacementMap
                            ref={displacementRef}
                            in="SourceGraphic"
                            in2="noise"
                            scale="0"
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>

            {/* Bounded wrapper: sized to contain main circle + blooms */}
            <div
                style={{
                    position: 'absolute',
                    left: wrapperLeft,
                    top: wrapperTop,
                    width: wrapperSize,
                    height: wrapperSize,
                    filter: filterActive ? `url(#${filterId})` : 'none',
                    pointerEvents: 'none',
                    zIndex: 15,
                    overflow: 'hidden',
                }}
            >
                {/* Main circle */}
                <div ref={mainClipRef} style={innerDivStyle}>
                    <img ref={el => { imgRefs.current[0] = el; }} src={photoSrc} alt="" style={imgStyle} />
                </div>
                {/* Bloom 1 */}
                <div ref={bloom1ClipRef} style={innerDivStyle}>
                    <img ref={el => { imgRefs.current[1] = el; }} src={photoSrc} alt="" style={imgStyle} />
                </div>
                {/* Bloom 2 */}
                <div ref={bloom2ClipRef} style={innerDivStyle}>
                    <img ref={el => { imgRefs.current[2] = el; }} src={photoSrc} alt="" style={imgStyle} />
                </div>
                {/* Bloom 3 */}
                <div ref={bloom3ClipRef} style={innerDivStyle}>
                    <img ref={el => { imgRefs.current[3] = el; }} src={photoSrc} alt="" style={imgStyle} />
                </div>
            </div>
        </>
    );
}

/*
  Simple rAF value animator — updates DOM directly, no React re-renders.
*/
function animateValue(from, to, durationMs, onUpdate) {
    return new Promise((resolve) => {
        const startTime = performance.now();
        const tick = (now) => {
            const elapsed = now - startTime;
            let t = Math.min(elapsed / durationMs, 1);
            // easeOut quad
            t = 1 - Math.pow(1 - t, 2);
            const value = from + (to - from) * t;
            onUpdate(value);
            if (t < 1) {
                requestAnimationFrame(tick);
            } else {
                resolve();
            }
        };
        requestAnimationFrame(tick);
    });
}
