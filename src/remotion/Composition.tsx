import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, useVideoConfig, useCurrentFrame, interpolate, Easing } from 'remotion';
import { z } from 'zod';
import {
    ProgressBar, Vignette, FilmGrain, Watermark,
    SubscribePill, LikeExplosion, ConfettiCannon,
    LinkInBio, WaitForIt, FlashEffect
} from './Overlays';

export const ShortsCompositionSchema = z.object({
    scenes: z.array(
        z.object({
            text: z.string(),
            imageUrl: z.string(),
            durationInFrames: z.number(),
            overlays: z.array(z.string()).optional(), // List of overlay IDs
        })
    ),
    audioUrl: z.string().optional(),
});

const Scene: React.FC<{ imageUrl: string; index: number; durationInFrames: number; overlays?: string[] }> = ({ imageUrl, index, durationInFrames, overlays = [] }) => {
    const frame = useCurrentFrame();

    // Ken Burns Effect: Zoom & Pan
    // Alternate direction based on index to keep it interesting
    const isEven = index % 2 === 0;

    // Zoom: 1.0 -> 1.15 (or reverse)
    const scale = interpolate(
        frame,
        [0, durationInFrames],
        isEven ? [1, 1.15] : [1.15, 1],
        { easing: Easing.linear, extrapolateRight: "clamp" }
    );

    // Pan: Slight horizontal movement
    // Even: Left to Right, Odd: Right to Left
    const translateX = interpolate(
        frame,
        [0, durationInFrames],
        isEven ? [-20, 0] : [0, -20],
        { easing: Easing.linear, extrapolateRight: "clamp" }
    );

    // Fade In Transition (15 frames = 0.5s)
    const opacity = interpolate(
        frame,
        [0, 15],
        [0, 1],
        { extrapolateRight: "clamp" }
    );

    return (
        <AbsoluteFill style={{ opacity }}>
            <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${translateX}px)` }}>
                <Img
                    src={imageUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </AbsoluteFill>

            {/* Scoped Overlays */}
            {overlays.includes("VIGNETTE") && <Vignette />}
            {overlays.includes("FILM_GRAIN") && <FilmGrain />}
            {overlays.includes("FLASH") && <FlashEffect />}
            {overlays.includes("WAIT_FOR_IT") && <WaitForIt />}
            {overlays.includes("SUBSCRIBE") && <SubscribePill />}
            {overlays.includes("LIKE_EXPLOSION") && <LikeExplosion />}
            {overlays.includes("CONFETTI") && <ConfettiCannon />}
            {overlays.includes("LINK_IN_BIO") && <LinkInBio />}
            {overlays.includes("WATERMARK") && <Watermark />}
        </AbsoluteFill>
    );
};

export const ShortsComposition: React.FC<z.infer<typeof ShortsCompositionSchema>> = ({
    scenes,
    audioUrl,
}) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    // Global Overlays Logic (Check if any scene requests global overlays, or just pass purely per scene)
    // For now, we assume overlays are passed PER SCENE to allow granular control.
    // If we want a global overlay (like Progress Bar), we render it outside the map.

    const hasGlobalProgressBar = scenes.some(s => s.overlays?.includes("PROGRESS_BAR"));

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {scenes.map((scene, index) => {
                // Calculate start based on accumulation
                const start = scenes.slice(0, index).reduce((acc, s) => acc + s.durationInFrames, 0);
                return (
                    <Sequence
                        key={index}
                        from={start}
                        durationInFrames={scene.durationInFrames}
                    >
                        <Scene
                            imageUrl={scene.imageUrl}
                            index={index}
                            durationInFrames={scene.durationInFrames}
                            overlays={scene.overlays}
                        />
                    </Sequence>
                );
            })}

            {audioUrl && <Audio src={audioUrl} />}

            {/* Always show progress bar if requested globally or by default logic?
                Let's make it always visible for now as requested in previous step,
                OR control via overlay flag "PROGRESS_BAR" passed in first scene?
                Let's default to VISIBLE for now unless we add a specific toggle.
                Actually, let's look for "PROGRESS_BAR" in the FIRST scene's overlays as a "Global Config" proxy.
            */}
            {/* Hardcoded for now as per previous plan, or use flag if desired. Keeping hardcoded as "Retention Bar" feature. */}
            <ProgressBar />
        </AbsoluteFill>
    );
};
