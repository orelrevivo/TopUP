"use client";
import React from 'react';
import { Chat } from '~/components/chat/Chat.client';

export default function FeaturesHero() {
    return (
        <div className="relative w-full flex flex-col items-center justify-center bg-black overflow-hidden pb-40 min-h-[65vh]">
            {/* Ambient gradient top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,88,0,0.12) 0%, transparent 70%)' }} />

            {/* Background Image */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                    src="/background/speedBG-smaller.png"
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-80"
                />
            </div>

            {/* Hero headline */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-36 pb-6 flex flex-col items-center text-center">

                <h1 className="text-4xl md:text-5xl"
                    style={{ textShadow: '0 0 80px rgba(255,88,0,0.2)' }}>
                    Build, Deploy, and Automate<br />
                    <span style={{ background: 'linear-gradient(90deg, #FF5800 0%, #ff8c42 60%, #ffffff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        at the speed of thought.
                    </span>
                </h1>
            </div>

            {/* Chat widget */}
            <div data-theme="dark" className="dark -mt-8 relative z-10 w-full">
                <Chat hideIntro={true} />
            </div>

            {/* Character Image positioned at the bottom left */}
            <div className="absolute -bottom-60 left-[5%] z-0 pointer-events-none">
                <img
                    src="/background/character3-none-bg.png"
                    alt="Second Hero Character"
                    className="max-h-[700px] w-auto object-contain object-bottom"
                />
            </div>

            {/* Divider Bar at the bottom of the hero section */}
            <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
                <img src="/landing/divider-bar.svg" alt="Divider" className="w-full h-auto object-cover" />
            </div>
        </div>
    );
}
