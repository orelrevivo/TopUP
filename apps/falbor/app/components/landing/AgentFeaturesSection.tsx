'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { agentFeaturesData } from './AgentFeaturesData';
import { Chat } from '~/components/chat/core/Chat.client';
import { getUserCount } from '~/lib/actions/get-user-count';

export default function AgentFeaturesSection() {
  const [activeId, setActiveId] = useState<string>(agentFeaturesData[0].id);
  const [activeModal, setActiveModal] = useState<React.ReactNode | null>(null);
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [userCount, setUserCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    getUserCount().then(setUserCount);
  }, []);
  useEffect(() => {
    const observers = new Map<string, IntersectionObserver>();

    agentFeaturesData.forEach((feature) => {
      const el = containerRefs.current[feature.id];
      if (el) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
              setActiveId(feature.id);
            }
          },
          { threshold: [0.4, 0.6] }
        );
        observer.observe(el);
        observers.set(feature.id, observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const activeFeature = agentFeaturesData.find(f => f.id === activeId) || agentFeaturesData[0];

  return (
    <div className="relative w-full bg-black text-white py-12">
      <div className="mb-5 max-w-[1147px] mx-auto w-full px-6 lg:px-0 flex items-center justify-between">
        <h2 className="text-4xl lg:text-5xl">Explore Falbor Works.</h2>
        <a href="/signup" className="z-50 px-5 py-2.5 bg-[#1A1A1A] rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
          Start with Falbor
        </a>
      </div>
      <div className="max-w-[1147px] mx-auto w-full flex flex-col lg:flex-row justify-between gap-[7px] px-6 lg:px-0 relative">
        <div className="w-full lg:max-w-[800px] relative z-10">
          {agentFeaturesData.map((feature) => (
            <div
              key={feature.id}
              ref={el => { containerRefs.current[feature.id] = el; }}
              className="flex flex-col mb-[20vh] last:mb-0 w-full lg:w-[800px] h-[70vh] min-h-[500px] max-h-[800px] border border-white/10 rounded-3xl p-4 bg-[#0A0A0A]/60 backdrop-blur-md shadow-2xl"
            >
              <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden mb-5 flex-1 relative">
                {feature.imageSrc ? (
                  <img src={feature.imageSrc} alt={feature.title} className="w-full h-full" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center">
                    <span className="text-white/20 text-sm font-medium tracking-wider">PREVIEW: {feature.title.toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="px-2 pb-2">
                <h2 className="text-xl lg:text-3xl mb-3 tracking-tight">{feature.title}</h2>
                <p className="text-zinc-400 text-base lg:text-sm mb-5 leading-relaxed">
                  {feature.description}
                </p>
                <div>
                  <a
                    href={feature.buttonLink}
                    className="inline-flex items-center text-white hover:text-[#FF5800] transition-colors font-medium group text-base"
                  >
                    {feature.buttonText}
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden lg:flex w-full lg:max-w-[340px] sticky top-[15vh] items-start justify-start relative z-20 h-fit">
          <div className="w-full bg-[#0A0A0A] border border-[#333333] rounded-3xl h-[70vh] min-h-[500px] max-h-[800px] flex flex-col overflow-hidden shadow-[0_0_80px_rgba(255,88,0,0.05)] relative">
            <div className="flex-1 p-2 overflow-y-auto flex flex-col gap-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-col gap-2"
                >
                  {activeFeature.chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      {msg.role === 'assistant' && msg.thought && (
                        <div>
                          {msg.thought}
                        </div>
                      )}
                      {msg.content && (
                        <div className={`px-4 py-3 w-full text-[13px] leading-relaxed shadow-sm ${msg.role === 'user'
                          ? 'bg-[#242424] border border-[#333333] text-white rounded-2xl'
                          : 'text-white/90 rounded-md'
                          }`}>
                          {msg.content}
                        </div>
                      )}
                      {msg.customUI && (
                        <div className="w-full mt-2">
                          {React.isValidElement(msg.customUI)
                            ? React.cloneElement(msg.customUI as any, { onOpenModal: setActiveModal })
                            : msg.customUI}
                        </div>
                      )}
                      {msg.contentAfterUI && (
                        <div className={`px-4 py-3 w-full mt-2 text-sm leading-relaxed shadow-sm text-white/90 border border-white/5 rounded-md`}>
                          {msg.contentAfterUI}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="border-t border-white/5 bg-[#0A0A0A]/80 backdrop-blur-sm z-10">
              <Chat hideIntro={true} hideSlider={true} isCompact={true} />
            </div>
          </div>
        </div>
      </div>
      {}
      <AnimatePresence>
        {activeModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ boxShadow: '0px 0px 5px #b3b1b1ff' }}
              className="bg-white dark:bg-[#141414] border border-[#D6D6D6] dark:border-[#353538] rounded-lg p-8 max-w-3xl w-full max-h-[50vh] overflow-y-auto relative custom-scrollbar"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-falbor-elements-textSecondary hover:text-falbor-elements-textPrimary transition-colors"
              >
                <div className="i-ph:x-bold w-5 h-5" />
              </button>
              <div className="text-falbor-elements-textPrimary prose dark:prose-invert prose-p:leading-relaxed max-w-none">
                {activeModal}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
