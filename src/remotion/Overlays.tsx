import React, { useMemo } from 'react';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate, spring, Easing, random, Video, staticFile } from 'remotion';
import { Heart, Bell, MousePointer2, ArrowDown, ArrowUp } from 'lucide-react';

// 1. Progress Bar (Global or Local)
export const ProgressBar: React.FC<{ color?: string }> = ({ color = "#eab308" }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();
    const progress = interpolate(frame, [0, durationInFrames], [0, 100]);

    return (
        <AbsoluteFill style={{ justifyContent: 'flex-end' }}>
            <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '40px' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
            </div>
        </AbsoluteFill>
    );
};

// 2. Vignette
export const Vignette: React.FC = () => {
    return (
        <AbsoluteFill style={{
            background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%)',
            pointerEvents: 'none'
        }} />
    );
};

// 3. Film Grain
export const FilmGrain: React.FC = () => {
    // Uses GPU accelerated video decode instead of expensive SVG filter
    return (
        <AbsoluteFill style={{ mixBlendMode: 'overlay', opacity: 0.3, pointerEvents: 'none' }}>
            <Video
                src={staticFile("overlays/film-grain.mp4")}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loop
                muted
            />
        </AbsoluteFill>
    );
};

// 4. Clean Watermark
export const Watermark: React.FC<{ handle?: string }> = ({ handle = "@micropost_ai" }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 60,
            right: 40,
            padding: '8px 16px',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            borderRadius: '20px',
            color: 'white',
            fontFamily: 'Inter',
            fontSize: '24px',
            fontWeight: 600,
            opacity: 0.8
        }}>
            {handle}
        </div>
    );
};

// 5. Subscribe Pill
export const SubscribeInternal: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Slide up spring
    const slide = spring({ frame, fps, from: 100, to: 0 });

    return (
        <div style={{
            position: 'absolute',
            bottom: 200,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            transform: `translateY(${slide}px)`
        }}>
            <div style={{
                background: '#ff0000',
                color: 'white',
                padding: '15px 40px',
                borderRadius: '50px',
                fontSize: '32px',
                fontWeight: 'bold',
                fontFamily: 'Inter',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
                <Bell size={32} fill="white" />
                SUBSCRIBE
                <MousePointer2 size={32} fill="white" style={{ marginLeft: 10 }} />
            </div>
        </div>
    );
};
// Export wrapper to use in composition
export const SubscribePill = () => <SubscribeInternal />;


// 6. Like Explosion
const HeartParticle: React.FC<{ delay: number; x: number }> = ({ delay, x }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const netFrame = frame - delay;

    if (netFrame < 0) return null;

    const op = interpolate(netFrame, [0, 20, 40], [0, 1, 0]);
    const y = interpolate(netFrame, [0, 40], [0, -400]);
    const scale = interpolate(netFrame, [0, 10], [0, 1]);

    return (
        <div style={{
            position: 'absolute',
            bottom: 300,
            right: 50 + x,
            transform: `translateY(${y}px) scale(${scale})`,
            opacity: op
        }}>
            <Heart size={64} fill="#ec4899" color="#ec4899" />
        </div>
    );
};

export const LikeExplosion: React.FC = () => {
    // Generate 10 hearts
    const hearts = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        delay: i * 3, // Stagger frames
        x: (Math.random() - 0.5) * 100
    })), []);

    return (
        <>
            {hearts.map(h => <HeartParticle key={h.id} {...h} />)}
        </>
    );
};

// 7. Confetti Cannon
export const ConfettiCannon: React.FC = () => {
    // Uses GPU accelerated transparent video
    return (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
            <Video
                src={staticFile("overlays/confetti.webm")}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loop={false} // One shot
                muted
            />
        </AbsoluteFill>
    );
};

// 8. Link in Bio
export const LinkInBio: React.FC<{ position?: 'TOP' | 'BOTTOM' }> = ({ position = 'BOTTOM' }) => {
    const frame = useCurrentFrame();
    const bounce = Math.sin(frame / 5) * 20;

    return (
        <div style={{
            position: 'absolute',
            [position === 'TOP' ? 'top' : 'bottom']: 300,
            left: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20
        }}>
            {position === 'TOP' && <ArrowUp size={80} color="white" style={{ transform: `translateY(${-bounce}px)` }} />}
            <div style={{
                background: 'white',
                color: 'black',
                padding: '10px 30px',
                borderRadius: '20px',
                fontSize: '32px',
                fontWeight: 'bold',
                fontFamily: 'Inter',
            }}>
                LINK IN BIO
            </div>
            {position === 'BOTTOM' && <ArrowDown size={80} color="white" style={{ transform: `translateY(${bounce}px)` }} />}
        </div>
    );
};

// 9. Wait for it...
export const WaitForIt: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = Math.abs(Math.sin(frame / 10)); // Pulse

    return (
        <div style={{
            position: 'absolute',
            top: 200,
            width: '100%',
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: '48px',
            fontWeight: 800,
            color: '#fbbf24', // Amber
            textShadow: '0 4px 12px rgba(0,0,0,0.5)',
            opacity
        }}>
            WAIT FOR IT...
        </div>
    );
};

// 10. Flash Effect
export const FlashEffect: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 5, 10], [0, 1, 0], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: 'white', mixBlendMode: 'overlay', opacity, pointerEvents: 'none' }} />
    );
};
