"use client";
import React from 'react';
import Link from 'next/link';

export default function FeatureWebsiteBuilder() {
    return (
        <div className="relative w-full h-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="absolute right-[-20px] bottom-[-40px] text-[280px] font-black leading-none select-none pointer-events-none" style={{ color: 'rgba(255,255,255,0.025)' }}>01</div>
            <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16 z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="flex items-center justify-start relative w-full lg:col-span-8">
                    <div className="absolute inset-0 rounded-md blur-2xl opacity-25" style={{ background: '#FF5800', transform: 'scale(0.95) translateY(10px)' }} />
                    <div className="relative w-full aspect-video border border-zinc-800 bg-zinc-900/50 rounded-md overflow-hidden shadow-2xl">
                        <img src="/landing/FeatureWebsiteBuilder.png" alt="Website Builder" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="flex flex-col items-start justify-center lg:col-span-4">
                    <h2 className="leading-[1.15] font-bold text-white mb-5 tracking-tight text-[2rem] md:text-[2.5rem]">
                        Build stunning websites with AI.
                    </h2>
                    <p className="text-zinc-400 text-base md:text-lg mb-10 leading-relaxed font-light">
                        Transform your ideas into fully functional, responsive websites instantly.
                        Our agentic AI writes production-ready code so you can focus on growing your business.
                    </p>
                    <Link href="/docs/builder" className="bg-white hover:bg-zinc-200 text-black font-semibold px-8 py-4 rounded-md transition-colors flex items-center gap-2 text-base w-fit">
                        Start Building
                        <div className="i-ph:arrow-right w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
