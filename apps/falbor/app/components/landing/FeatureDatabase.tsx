"use client";
import React from 'react';
import Link from 'next/link';

export default function FeatureDatabase() {
    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="absolute right-[-20px] bottom-[-40px] text-[280px] font-black leading-none select-none pointer-events-none" style={{ color: 'rgba(255,255,255,0.025)' }}>02</div>
            <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16 z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="flex items-center justify-start relative w-full lg:col-span-8">
                    <div className="absolute inset-0 rounded-md blur-2xl opacity-25" style={{ background: '#0A35F1', transform: 'scale(0.95) translateY(10px)' }} />
                    <div className="relative w-full aspect-video border border-zinc-800 bg-zinc-900/30 rounded-md overflow-hidden shadow-2xl">
                        <img src="/landing/FeatureDatabase.png" alt="Integrated Database" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="flex flex-col items-start justify-center lg:col-span-4">
                    <h2 className="leading-[1.15] font-bold text-white mb-5 tracking-tight text-[2rem] md:text-[2.5rem]">
                        Every site gets a powerful database.
                    </h2>
                    <p className="text-zinc-400 text-base md:text-lg mb-10 leading-relaxed font-light">
                        No need to configure external storage. Every chat and site automatically provisions a secure, scalable database instantly.
                    </p>
                    <Link href="/docs/database" className="bg-white hover:bg-zinc-200 text-black font-semibold px-8 py-4 rounded-md transition-colors flex items-center gap-2 text-base w-fit">
                        Explore Database
                        <div className="i-ph:arrow-right w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
