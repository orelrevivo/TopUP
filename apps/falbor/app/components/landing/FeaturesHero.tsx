"use client";
import React from 'react';
import { Chat } from '~/components/chat/Chat.client';

export default function FeaturesHero() {
    return (
        <div
            className="relative w-full flex flex-col items-center justify-center bg-black overflow-hidden"
        // style={{
        //     backgroundImage: "url('/background/background_V2.png')",
        //     backgroundSize: 'cover',
        //     backgroundPosition: 'center',
        // }}
        >
            <div className='mt-10 mb-20 relative z-10 w-full'>
                <Chat />
            </div>

            {/* Character Image positioned at the bottom left */}
            <div className="absolute -bottom-30 left-[5%] z-0 pointer-events-none">
                <img
                    src="/background/character3.png"
                    alt="Second Hero Character"
                    className="max-h-[700px] w-auto object-contain object-bottom"
                />
            </div>

            {/* Character Image positioned at the bottom right */}
            {/* <div className="absolute -bottom-30 right-[5%] z-0 pointer-events-none">
                <img
                    src="/background/hero-eliza-2.png"
                    alt="Hero Character"
                    className="max-h-[700px] w-auto object-contain object-bottom"
                />
            </div> */}

            {/* Divider Bar at the bottom of the hero section */}
            <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
                <img src="/landing/divider-bar.svg" alt="Divider" className="w-full h-auto object-cover" />
            </div>
        </div>
    );
}
