'use client';
import { BaseChat } from '~/components/chat/BaseChat';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { Chat } from '~/components/chat/Chat.client';
import { useAuth } from '~/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import DefaultDemo from "~/components/landing/Navbar"
import { LandingScrollHandler } from "~/components/landing/landing-scroll-handler"
import { ThemeHandler } from "~/components/landing/ThemeHandler"
import AgentPaceSection from "~/components/landing/AgentPaceSection"
import StartFreeSection from "~/components/landing/StartFreeSection"
import FalborRoadSection from "~/components/landing/FalborRoadSection"
import TestimonialsSection from "~/components/landing/TestimonialsSection"

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isChatIdPage = pathname.startsWith('/chat/');

  if (loading) {
    return (
      <div
        className="flex flex-col h-full w-full relative"
        style={{ backgroundColor: isChatIdPage ? '#F7FAFB dark:bg-[#080808]' : undefined }}
      >
        {!isChatIdPage && <BackgroundRays key={pathname} />}
        <Header />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-950">
        <ThemeHandler force="light" />
        <LandingScrollHandler />

        {/* Global Sticky Navbar */}
        <div className="sticky top-0 left-0 right-0 w-full z-[100] bg-white/80 backdrop-blur-md">
          <DefaultDemo />
        </div>

        {/* Hero Section */}
        <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center z-10 overflow-hidden">

          <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center justify-center border-l border-r border-zinc-200 h-full">
            {/* Background Video (Muted, Looped, Behind elements, Constrained to this column) */}

            <div
              className="pointer-events-none absolute inset-0 w-full h-full z-0"
              style={{
                backgroundImage: "url('/background/bg__.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <div className="w-full flex flex-col items-center mt-[-400px] z-10 relative">
              <div className="w-full flex justify-center mt-6">
                <ClientOnly fallback={<BaseChat />}>
                  {() => <Chat />}
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Section 2: Agent Pace Section */}
        <div className="relative w-full flex flex-col items-center z-20 bg-white">
          <div className="w-full max-w-5xl border-l border-r border-zinc-200 flex flex-col">
            <AgentPaceSection />
            <FalborRoadSection />
            <TestimonialsSection />
            <StartFreeSection />
          </div>
        </div>

      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full w-full relative"
      style={{ backgroundColor: isChatIdPage ? '#F7FAFB dark:bg-[#080808]' : undefined }}
    >
      {!isChatIdPage && <BackgroundRays key={pathname} />}
      <Header />
      <ClientOnly fallback={<BaseChat />}>
        {() => <Chat />}
      </ClientOnly>
    </div>
  );
}
