import { useEffect, useRef } from 'react';
import styles from './Background.module.css';


interface BackgroundProps {
    theme?: 'light' | 'dark';
}

// An ambient dot-grid that drifts on its own, plus a spotlight patch that follows the cursor and
// nudges the drift direction toward directiong the cursor is moving. Position is fixed and
// pointer-events is set to non. This can be dropped anywhere in the tree without affecting layout
// or intercepting any click/hover meant for real content.
function Background({ theme = 'light' }: BackgroundProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const spotlightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        const spotlight = spotlightRef.current;
        if (!root || !spotlight) return;

        // Skip the whole effect for anyone who's asked for less motion,
        // rather than just disabling one piece of it.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const baseVX = 0.07;
        const baseVY = 0.07;
        const tileW = 30;
        const tileH = 17.3205;
        let targetVX = baseVX;
        let targetVY = baseVY;
        let curVX = baseVX;
        let curVY = baseVY;
        let offX = 0;
        let offY = 0;
        let lastX: number | null = null;
        let lastY: number | null = null;
        let frameId: number;

        const handlePointerMove = (e: MouseEvent) => {
            // root is position: fixed and fills the viewport, so client
            // coordinates already are coordinates within it.
            const x = e.clientX;
            const y = e.clientY;
            if (lastX !== null && lastY !== null) {
                const dx = x - lastX;
                const dy = y - lastY;
                targetVX = baseVX + dx * 0.06;
                targetVY = baseVY + dy * 0.06;
            }
            lastX = x;
            lastY = y;
            root.style.setProperty('--mx', `${x}px`);
            root.style.setProperty('--my', `${y}px`);
            spotlight.style.opacity = '1';
        };

        const handlePointerLeave = () => {
            spotlight.style.opacity = '0';
            lastX = null;
            lastY = null;
        };

        const frame = () => {
            // Slowly relax back toward the ambient drift whenever the
            // cursor isn't actively pushing it somewhere else.
            targetVX += (baseVX - targetVX) * 0.01;
            targetVY += (baseVY - targetVY) * 0.01;
            curVX += (targetVX - curVX) * 0.04;
            curVY += (targetVY - curVY) * 0.04;
            offX = (((offX + curVX) % tileW) + tileW) % tileW;
            offY = (((offY + curVY) % tileH) + tileH) % tileH;
            root.style.setProperty('--ox', `${offX}px`);
            root.style.setProperty('--oy', `${offY}px`);
            frameId = requestAnimationFrame(frame);
        };

        // Listen on the document rather than the (pointer-events: none)
        // root, since this needs to track the cursor across the whole
        // page, including over real interactive content sitting above it.
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerleave', handlePointerLeave);
        frameId = requestAnimationFrame(frame);

        return () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerleave', handlePointerLeave);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <div
            ref={rootRef}
            className={styles.root}
            data-theme={theme}
            aria-hidden="true"
        >
            <div className={styles.dotGrid} />
            <div ref={spotlightRef} className={styles.dotGridSpotlight} />
        </div>
    );
}

export default Background;