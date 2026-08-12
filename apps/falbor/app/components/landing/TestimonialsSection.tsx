"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
    {
        id: 0,
        imagePlaceholder: "/landing/about/profileImages2.png",
        logoPlaceholder: "Falbor",
        quote: "We completely rebuilt our GTM stack with Falbor in under 90 days while growing pipeline 500%. The difference in operational clarity is incredible.",
        author: "Gabriel Shalmayev",
        title: "CEO & CMO ",
    },
    {
        id: 1,
        imagePlaceholder: "/landing/about/profileImages1.png",
        logoPlaceholder: "Falbor",
        quote: "As someone who worked in development, I can say that before Falbor it was much harder for me to create things and explain my ideas.",
        author: "Orel Revivo",
        title: "CTO, CEO & Founder",
    }
];

export default function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(1);

    return (
        <div className="relative w-full flex flex-col items-center justify-center bg-[#FAFAFB] border-t border-zinc-200">
            <div className="w-full z-10">
                <div className="w-full flex flex-row h-[400px] overflow-y-scroll bg-white shadow-sm">
                    {testimonials.map((t, i) => {
                        const isActive = activeIndex === i;

                        return (
                            <motion.div
                                key={t.id}
                                layout
                                onClick={() => setActiveIndex(i)}
                                animate={{
                                    flexGrow: isActive ? 1 : 0,
                                    width: isActive ? "auto" : "140px"
                                }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className={`
                  relative flex flex-row items-center h-full cursor-pointer overflow-hidden
                  ${!isActive ? "border-r border-zinc-200 bg-gray-50 hover:bg-gray-100" : ""}
                  ${i !== testimonials.length - 1 && !isActive ? "border-r border-zinc-200" : ""}
                `}
                            >
                                {/* The Picture Container */}
                                <motion.div
                                    layout
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className={`
                    flex items-center justify-center h-full min-w-[140px]
                    ${isActive ? "w-[250px] border-r border-zinc-100" : "w-full"}
                  `}
                                >
                                    <motion.img
                                        layout
                                        src={t.imagePlaceholder}
                                        alt={t.author}
                                        className={`
                      object-contain
                      ${isActive ? "w-[180px] h-[180px]" : "w-[100px] h-[100px] grayscale opacity-70"}
                    `}
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                            e.currentTarget.parentElement!.innerHTML = `
                        <div class="flex flex-col items-center justify-center text-center px-2">
                          <div class="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 mb-2 flex items-center justify-center">
                            <span class="text-xs text-gray-400">IMG</span>
                          </div>
                          <span class="text-[10px] text-gray-500 uppercase tracking-wider">Person ${i + 1}</span>
                        </div>
                      `;
                                        }}
                                    />
                                </motion.div>

                                {/* The Content */}
                                <AnimatePresence mode="wait">
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3, delay: 0.2 }}
                                            className="flex flex-col justify-center px-12 min-w-[500px] h-full"
                                        >
                                            <div className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                                                <img src="/favicon.ico" className="w-8 h-8" alt="falbor" />
                                                {t.logoPlaceholder}
                                            </div>

                                            <h3 className="text-2xl md:text-[26px] leading-[1.4] font-medium text-[#1a1a1a] mb-8 font-serif">
                                                "{t.quote}"
                                            </h3>

                                            <div className="text-[13px] text-gray-800">
                                                <span className="font-bold">{t.author}</span>, <span className="text-gray-500">{t.title}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}