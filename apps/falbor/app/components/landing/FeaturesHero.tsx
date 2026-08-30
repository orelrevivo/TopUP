"use client";

import React from "react";
import { Chat } from "~/components/chat/core/Chat.client";
import { getUserCount } from "~/lib/actions/get-user-count";

export default function FeaturesHero() {
    const [userCount, setUserCount] = React.useState<number | null>(null);

    React.useEffect(() => {
        getUserCount().then(setUserCount);
    }, []);

    return (
        <div className="relative flex min-h-[60vh] w-full flex-col items-center justify-center overflow-hidden bg-white pb-20 transition-colors duration-200 dark:bg-black md:min-h-[65vh] md:pb-40">
            <div
                aria-hidden="true"
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat dark:hidden"
                style={{
                    backgroundImage: "url('/background/forest_bg.png')",
                }}
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 z-0 hidden bg-cover bg-center bg-no-repeat dark:block"
                style={{
                    backgroundImage: "url('/background/speedBG-smaller.png')",
                }}
            />
            <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 pb-6 pt-24 text-center md:px-6 md:pt-36">
                <div className="relative z-10 mb-10 flex flex-col items-center">
                    <div className="flex items-center gap-2 rounded-full border border-zinc-200/50 bg-zinc-100/80 px-6 py-2 backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        <span className="font-medium text-zinc-700 dark:text-white/80">
                            <span className="font-bold text-zinc-900 dark:text-white">
                                {userCount !== null ? userCount.toLocaleString() : "..."}
                            </span>{" "} Builders are in Falbor
                        </span>
                    </div>
                </div>
                <h1
                    className="w-full text-2xl leading-tight text-zinc-900 sm:text-3xl md:text-5xl dark:text-white"
                    style={{ textShadow: "0 0 80px rgba(255,88,0,0.2)" }}
                >
                    <span className="mb-2 block md:mb-0 md:inline">
                        Don&apos;t just build your idea.
                    </span>
                    <br className="hidden md:block" />
                    <span
                        className="block md:inline"
                        style={{
                            background:
                                "linear-gradient(90deg, #FF5800 0%, #ff8c42 60%, currentColor 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Find out if it&apos;s worth building.
                    </span>
                </h1>
            </div>
            <div className="relative z-10 -mt-8 w-full">
                <div className="flex-1 overflow-hidden">
                    <Chat hideIntro={true} isCompact={true} />
                </div>
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full hidden dark:block">
                <img
                    src="/landing/divider-bar.svg"
                    alt="Divider"
                    className="h-auto w-full object-cover invert transition-all duration-200 dark:invert-0"
                />
            </div>
        </div>
    );
}
