import React from 'react';
import { Composition } from 'remotion';
import { ShortsComposition, ShortsCompositionSchema } from './Composition';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="ShortsMaker"
                component={ShortsComposition}
                durationInFrames={30 * 10} // Default fallback
                fps={30}
                width={1080}
                height={1920}
                schema={ShortsCompositionSchema}
                calculateMetadata={async ({ props }) => {
                    const defaultDuration = 30 * 10;
                    try {
                        if (props.durationInFrames) {
                            return { durationInFrames: props.durationInFrames };
                        }
                        if (props.scenes) {
                            const total = props.scenes.reduce((acc: number, s: any) => acc + (s.durationInFrames || 90), 0);
                            return { durationInFrames: total || defaultDuration };
                        }
                        return { durationInFrames: defaultDuration };
                    } catch (e) {
                        return { durationInFrames: defaultDuration };
                    }
                }}
                defaultProps={{
                    scenes: [
                        {
                            text: "Welcome",
                            imageUrl: "https://via.placeholder.com/1080x1920",
                            durationInFrames: 90,
                        }
                    ],
                    audioUrl: "",
                    durationInFrames: 300 // Add to default props just in case
                }}
            />
        </>
    );
};
