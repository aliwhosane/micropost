import React from 'react';
import { Composition } from 'remotion';
import { ShortsComposition, ShortsCompositionSchema } from './Composition';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="ShortsMaker"
                component={ShortsComposition}
                durationInFrames={30 * 10} // Default duration, overridden by props
                fps={30}
                width={1080}
                height={1920}
                schema={ShortsCompositionSchema}
                defaultProps={{
                    scenes: [
                        {
                            text: "Welcome",
                            imageUrl: "https://via.placeholder.com/1080x1920",
                            durationInFrames: 90,
                        }
                    ],
                    audioUrl: ""
                }}
            />
        </>
    );
};
