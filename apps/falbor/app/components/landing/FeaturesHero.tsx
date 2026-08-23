"use client";
import React from 'react';
import { Chat } from '~/components/chat/Chat.client';
import { getUserCount } from '~/lib/actions/get-user-count';

export default function FeaturesHero() {
    const [userCount, setUserCount] = React.useState<number | null>(null);

    React.useEffect(() => {
        getUserCount().then(setUserCount);
    }, []);
    return (
        <div className="relative w-full flex flex-col items-center justify-center bg-black overflow-hidden pb-20 md:pb-40 min-h-[60vh] md:min-h-[65vh]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,88,0,0.12) 0%, transparent 70%)' }} />
            {/* <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                    src="/background/speedBG-smaller.png"
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-80"
                />
            </div> */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6 pt-24 md:pt-36 pb-6 flex flex-col items-center text-center">
                <div className="relative z-10 mb-10 flex flex-col items-center">
                    <div className="flex items-center gap-2 bg-white/5 px-6 py-2 rounded-full backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-white/80 font-medium">
                            Join <span className="text-white font-bold">{userCount !== null ? userCount.toLocaleString() : '...'}</span> innovators building with Falbor
                        </span>
                    </div>
                </div>
                <h1
                    className="text-2xl sm:text-3xl md:text-5xl leading-tight w-full"
                    style={{ textShadow: '0 0 80px rgba(255,88,0,0.2)' }}
                >
                    <span className="block mb-2 md:inline md:mb-0">
                        Don't just build your idea.
                    </span>
                    <br className="hidden md:block" />
                    <span
                        className="block md:inline"
                        style={{
                            background: 'linear-gradient(90deg, #FF5800 0%, #ff8c42 60%, #ffffff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Find out if it's worth building.
                    </span>
                </h1>
            </div>
            <div data-theme="dark" className="dark -mt-8 relative z-10 w-full">
                <div className="flex-1 overflow-hidden">
                    <Chat hideIntro={true} isCompact={true} />
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
                <img src="/landing/divider-bar.svg" alt="Divider" className="w-full h-auto object-cover" />
            </div>
        </div>
    );
}
