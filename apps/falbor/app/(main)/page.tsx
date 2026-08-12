'use client';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { BaseChat } from '~/components/chat/BaseChat';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { Menu } from '~/components/sidebar/Menu.client';
import { Chat } from '~/components/chat/Chat.client';
import { useAuth } from '~/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { LandingScrollHandler } from "~/components/landing/landing-scroll-handler";
import { ThemeHandler } from "~/components/landing/ThemeHandler";
import FeaturesHero from "~/components/landing/FeaturesHero";
import FeatureWebsiteBuilder from "~/components/landing/FeatureWebsiteBuilder";
import FeatureOrganizations from "~/components/landing/FeatureOrganizations";
import FeatureDarknet from "~/components/landing/FeatureDarknet";
import FeatureDatabase from "~/components/landing/FeatureDatabase";
import FeatureWorkflow from "~/components/landing/FeatureWorkflow";
import DefaultDemo from "~/components/landing/Navbar";

const SECTIONS = ["Builder", "Database", "Organizations", "Workflow", "Darknet"];
const TOTAL = SECTIONS.length; // 5 sections
const SECTION_SPAN = 1 / TOTAL; // each section gets 0.2 of progress
const FADE_SPAN = 0.08; // how fast each fades in

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function getOpacity(progress: number, sectionIndex: number): number {
  // sectionIndex 0 = always visible (WebsiteBuilder)
  // sectionIndex 1..4 = Database, Organizations, Workflow, Darknet
  const start = sectionIndex * SECTION_SPAN;
  const end = start + FADE_SPAN;
  return lerp(0, 1, (progress - start) / FADE_SPAN);
}

function getBlur(progress: number, sectionIndex: number): string {
  const start = sectionIndex * SECTION_SPAN;
  const end = start + FADE_SPAN;
  const t = Math.max(0, Math.min(1, (progress - start) / FADE_SPAN));
  const blur = lerp(16, 0, t);
  return `blur(${blur.toFixed(1)}px)`;
}

import { Suspense } from 'react';

function PageContent() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);

  // DOM refs for each card layer
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const card5Ref = useRef<HTMLDivElement>(null);

  // Dot refs for nav
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (user) return; // only run for landing page

    // Refs live inside the !user branch — poll briefly until they mount
    let attempts = 0;
    const attach = () => {
      const container = scrollContainerRef.current;
      const track = bookContainerRef.current;

      if (!container || !track) {
        if (attempts++ < 20) setTimeout(attach, 50);
        return;
      }

      const cards = [card2Ref, card3Ref, card4Ref, card5Ref];

      const onScroll = () => {
        const scrollTop = container.scrollTop;
        const trackTop = track.offsetTop;
        const trackHeight = track.offsetHeight;
        const containerH = container.clientHeight;

        const raw = (scrollTop - trackTop) / (trackHeight - containerH);
        const progress = Math.max(0, Math.min(1, raw));

        cards.forEach((ref, i) => {
          if (!ref.current) return;
          const sectionIndex = i + 1;
          const op = getOpacity(progress, sectionIndex);
          const bl = getBlur(progress, sectionIndex);
          ref.current.style.opacity = op.toString();
          ref.current.style.filter = bl;
        });

        const section = Math.min(TOTAL - 1, Math.floor(progress * TOTAL));
        setActiveSection(section);
      };

      container.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // run once immediately
      return () => container.removeEventListener('scroll', onScroll);
    };

    const cleanup = attach();
    return () => { if (cleanup) cleanup(); };
  }, [user, loading]);

  const scrollToSection = (i: number) => {
    const container = scrollContainerRef.current;
    const track = bookContainerRef.current;
    if (!container || !track) return;
    const trackTop = track.offsetTop;
    const trackHeight = track.offsetHeight;
    const containerH = container.clientHeight;
    const fraction = (i * SECTION_SPAN) + 0.01;
    container.scrollTo({
      top: trackTop + fraction * (trackHeight - containerH),
      behavior: 'smooth',
    });
  };

  const isChatIdPage = pathname.startsWith('/chat/');

  if (loading) {
    return (
      <div className={`flex flex-col h-full w-full relative ${isChatIdPage ? 'bg-[#F7FAFB] dark:bg-[#080808]' : ''}`}>
        {!isChatIdPage && <BackgroundRays key={pathname} />}
        <Header />
      </div>
    );
  }

  if (!user) {
    return (
      <div ref={scrollContainerRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-black text-white">
        <ThemeHandler force="dark" />
        <LandingScrollHandler />
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-48px)] max-w-5xl pointer-events-auto">
          <div className="w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 [&_.backdrop-blur-md]:bg-transparent [&_.border-b]:border-white/10 [&_.text-black]:text-white [&_.text-black\/80]:text-white/80 [&_.hover\\:text-black\/70]:hover:text-white/70 [&_.border-zinc-200]:border-white/10" style={{ backdropFilter: 'blur(20px)', background: 'rgba(10,10,10,0.8)' }}>
            <DefaultDemo />
          </div>
        </div>

        <div className="relative w-full flex flex-col items-center z-20">
          <div className="relative w-full flex items-center bg-black z-0">
            <FeaturesHero />
          </div>

          {/* 900vh scroll track */}
          <div ref={bookContainerRef} className="h-[900vh] w-full relative bg-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden">

              {/* Ambient glow orbs */}
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div
                  className="absolute w-[800px] h-[800px] rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(255,88,0,0.07) 0%, transparent 70%)", top: "10%", left: "15%" }}
                  animate={{ x: [0, 60, -30, 0], y: [0, -40, 30, 0] }}
                  transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute w-[500px] h-[500px] rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(10,53,241,0.05) 0%, transparent 70%)", bottom: "10%", right: "10%" }}
                  animate={{ x: [0, -50, 40, 0], y: [0, 30, -20, 0] }}
                  transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                />
              </div>

              {/* Card 1: always visible base */}
              <div className="absolute inset-0 w-full h-full z-[1]">
                <FeatureWebsiteBuilder />
              </div>

              {/* Card 2: Database */}
              <div ref={card2Ref} className="absolute inset-0 w-full h-full z-[2]" style={{ opacity: 0, filter: 'blur(16px)', willChange: 'opacity, filter', transition: 'none' }}>
                <FeatureDatabase />
              </div>

              {/* Card 3: Organizations */}
              <div ref={card3Ref} className="absolute inset-0 w-full h-full z-[3]" style={{ opacity: 0, filter: 'blur(16px)', willChange: 'opacity, filter', transition: 'none' }}>
                <FeatureOrganizations />
              </div>

              {/* Card 4: Workflow */}
              <div ref={card4Ref} className="absolute inset-0 w-full h-full z-[4]" style={{ opacity: 0, filter: 'blur(16px)', willChange: 'opacity, filter', transition: 'none' }}>
                <FeatureWorkflow />
              </div>

              {/* Card 5: Darknet */}
              <div ref={card5Ref} className="absolute inset-0 w-full h-full z-[5]" style={{ opacity: 0, filter: 'blur(16px)', willChange: 'opacity, filter', transition: 'none' }}>
                <FeatureDarknet />
              </div>

              {/* Nav dots */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4 items-center">
                {SECTIONS.map((label, i) => (
                  <div key={label} className="relative flex items-center group">
                    <div className="absolute right-7 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-zinc-900 text-zinc-200 text-xs px-2 py-1 rounded whitespace-nowrap border border-zinc-800">
                      {label}
                    </div>
                    <button
                      onClick={() => scrollToSection(i)}
                      className="w-2 h-2 rounded-full cursor-pointer transition-all duration-300"
                      style={{
                        background: '#FF5800',
                        opacity: activeSection === i ? 1 : 0.3,
                        transform: activeSection === i ? 'scale(1.6)' : 'scale(1)',
                      }}
                    />
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-[100dvh] w-full overflow-hidden bg-[#f0eded5c] dark:bg-[#080808]">
      {!isChatIdPage && <ClientOnly>{() => <Menu />}</ClientOnly>}
      <div className={`flex flex-col flex-1 min-w-0 h-full w-full relative ${isChatIdPage ? 'bg-[#f0eded5c] dark:bg-[#080808]' : ''}`}>
        {!isChatIdPage && <BackgroundRays key={pathname} />}
        <Header />
        <ClientOnly fallback={<BaseChat />}>
          {() => <Chat />}
        </ClientOnly>
      </div>
    </div>
  );
}
export default function Page() { return <Suspense fallback={null}><PageContent /></Suspense>; }
