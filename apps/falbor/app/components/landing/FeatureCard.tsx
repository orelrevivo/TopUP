import React from 'react';
import Link from 'next/link';

export type StatPill = {
    text: string;
    className?: string;
};

export type SubFeature = {
    icon: React.ReactNode;
    label: string;
    desc: string;
};

export type FeatureData = {
    id: string;
    number: string;
    backgroundColor: string;
    glowColor: string;
    title: React.ReactNode;
    description: string;
    imageSrc: string;
    imageAlt: string;
    primaryCta: { text: string; href: string };

    // Optional legacy fields if some cards still need them
    badgeText?: string;
    badgePulse?: boolean;
    badgeContainerClass?: string;
    badgeDotClass?: string;
    statPills?: StatPill[];
    subFeatures?: SubFeature[];
    subFeatureIconClass?: string;
    secondaryCta?: { text: string; href: string };
    customEffect?: React.ReactNode;
};

export default function FeatureCard({ data }: { data: FeatureData }) {
    return (
        <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${data.backgroundColor}`}>
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.25] pointer-events-none"
                style={{ backgroundImage: "url('/background/bg.png')" }}
            />
            {data.customEffect}
            {/* <div className="absolute right-[-20px] bottom-[-40px] text-[280px] font-black leading-none select-none pointer-events-none" style={{ color: 'rgba(255,255,255,0.025)' }}>
                {data.number}
            </div> */}
            <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16 z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="flex items-center justify-start relative w-full lg:col-span-8">
                    <div className="absolute inset-0 rounded-md blur-2xl opacity-25" style={{ background: 'white', transform: 'scale(0.95) translateY(10px)' }} />
                    <div className="relative w-full aspect-video border border-zinc-800 bg-zinc-900/50 rounded-md overflow-hidden shadow-2xl">
                        <img src={data.imageSrc} alt={data.imageAlt} className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="flex flex-col items-start justify-center lg:col-span-4">
                    {/* {data.badgeText && (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 mb-6 rounded-full text-[11px] font-bold tracking-widest uppercase border ${data.badgeContainerClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full inline-block ${data.badgeDotClass} ${data.badgePulse ? 'animate-pulse' : ''}`} />
                            {data.badgeText}
                        </span>
                    )} */}
                    <h2 className="leading-[1.15] text-white mb-3 tracking-tight text-[2rem] md:text-[2.5rem]">
                        {data.title}
                    </h2>
                    <p className="text-zinc-400 text-base md:text-lg mb-6 leading-relaxed font-light">
                        {data.description}
                    </p>
                    {/* {data.subFeatures && data.subFeatures.length > 0 && (
                        <div className="w-full grid grid-cols-1 gap-2 mt-1 mb-6">
                            {data.subFeatures.map((f, i) => (
                                <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-lg border border-zinc-800 bg-[#0A0A0A]/80">
                                    <div className={`mt-0.5 flex-shrink-0 ${data.subFeatureIconClass}`}>{f.icon}</div>
                                    <div>
                                        <div className="text-white text-sm font-semibold mb-0.5">{f.label}</div>
                                        <div className="text-zinc-500 text-xs leading-relaxed">{f.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )} */}
                    <div className="flex items-center gap-3 mt-2">
                        <Link href="/signup" className="bg-white hover:bg-zinc-200 text-black font-semibold px-8 py-4 rounded-md transition-colors flex items-center gap-2 text-base w-fit">
                            Start Building with Falbor
                            <div className="i-ph:arrow-right w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
