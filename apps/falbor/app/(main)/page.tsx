'use client';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { BaseChat } from '~/components/chat/core/BaseChat';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { Menu } from '~/components/sidebar/Menu.client';
import { Chat } from '~/components/chat/core/Chat.client';
import { useAuth } from '~/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { LandingScrollHandler } from "~/components/landing/landing-scroll-handler";
import { ThemeHandler } from "~/components/landing/ThemeHandler";
import FeaturesHero from "~/components/landing/FeaturesHero";
import BuilderJourneySection from "~/components/landing/BuilderJourneySection";
import IdeaToMVPSection from "~/components/landing/IdeaToMVPSection";
import Footer from "~/components/landing/Footer";
import FeatureCard from '~/components/landing/FeatureCard';
import { featuresData } from '~/components/landing/FeatureData';
import DefaultDemo from "~/components/landing/Navbar";
import TestimonialsSection from "~/components/landing/TestimonialsSection";
import AgentPaceSection from "~/components/landing/AgentPaceSection";
import FalborRoadSection from "~/components/landing/FalborRoadSection";
import HowItWorksSection from "~/components/landing/HowItWorksSection";
import IntegrationsSection from "~/components/landing/IntegrationsSection";
import PricingSection from "~/components/landing/PricingSection";
import StartFreeSection from "~/components/landing/StartFreeSection";
import AgentFeaturesSection from "~/components/landing/AgentFeaturesSection";

const SECTIONS = ["Builder", "Database", "Organizations", "Workflow", "Darknet"];
const TOTAL = SECTIONS.length;
const SECTION_SPAN = 1 / TOTAL;
const FADE_SPAN = 0.08;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function getOpacity(progress: number, sectionIndex: number): number {


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
import { useStore } from '@nanostores/react';
import { chatStore } from '~/lib/stores/chat';

function PageContent() {
  const { started } = useStore(chatStore);
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);


  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const card5Ref = useRef<HTMLDivElement>(null);


  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (user) return;


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
      onScroll();
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
      <div ref={scrollContainerRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-white text-zinc-900 dark:bg-black dark:text-white transition-colors duration-200">
        <ThemeHandler />
        <LandingScrollHandler />
        <div className="fixed top-2 md:top-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-16px)] md:w-[calc(100%-48px)] max-w-5xl pointer-events-auto">
          <div className="w-full rounded-xl border border-zinc-200 dark:border-white/10" style={{ backdropFilter: 'blur(20px)' }}>
            <DefaultDemo />
          </div>
        </div>
        <div className="relative w-full flex flex-col items-center z-20">
          <div className="relative w-full flex items-center bg-white dark:bg-black z-0">
            <FeaturesHero />
          </div>
          { }
          <AgentFeaturesSection />
          {/* <BuilderJourneySection /> */}
          <div ref={bookContainerRef} className="h-[900vh] w-full relative bg-white dark:bg-black transition-colors duration-200">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
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
              <div className="absolute inset-0 w-full h-full z-[1]">
                <FeatureCard data={featuresData[0]} />
              </div>
              <div ref={card2Ref} className="absolute inset-0 w-full h-full z-[2]" style={{ opacity: 0, filter: 'blur(16px)', willChange: 'opacity, filter', transition: 'none' }}>
                <FeatureCard data={featuresData[1]} />
              </div>
              <div ref={card3Ref} className="absolute inset-0 w-full h-full z-[3]" style={{ opacity: 0, filter: 'blur(16px)', willChange: 'opacity, filter', transition: 'none' }}>
                <FeatureCard data={featuresData[2]} />
              </div>
              <div ref={card4Ref} className="absolute inset-0 w-full h-full z-[4]" style={{ opacity: 0, filter: 'blur(16px)', willChange: 'opacity, filter', transition: 'none' }}>
                <FeatureCard data={featuresData[3]} />
              </div>
              { }
              { }
              <div className="absolute right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4 items-center">
                {SECTIONS.map((label, i) => (
                  <div key={label} className="relative flex items-center group">
                    <div className="absolute right-7 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs px-2 py-1 rounded whitespace-nowrap border border-zinc-200 dark:border-zinc-800">
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
        { }
        <IntegrationsSection />
        <PricingSection />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-row h-[100dvh] w-full overflow-hidden bg-[#f0eded5c] dark:bg-[#080808]">
      {!isChatIdPage && <ClientOnly>{() => <Menu />}</ClientOnly>}
      <div className={`flex flex-col flex-1 min-w-0 h-full w-full relative ${isChatIdPage ? 'bg-[#f0eded5c] dark:bg-[#080808]' : ''}`}>
        {!isChatIdPage && !started && <BackgroundRays key={pathname} />}
        <Header />
        <ClientOnly fallback={<BaseChat />}>
          {() => <Chat />}
        </ClientOnly>
      </div>
    </div>
  );
}
export default function Page() { return <Suspense fallback={null}><PageContent /></Suspense>; }
