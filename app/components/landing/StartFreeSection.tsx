"use client";
import HeroButtons from "./HeroButtons";
import { TextShimmer } from "~/components/ui/text-shimmer";

export default function StartFreeSection() {
    return (
        <div className="relative w-full py-32 flex items-center justify-center bg-[#FAFAFB] overflow-hidden border-t border-zinc-200">
            <div className="w-full max-w-5xl mx-auto px-12 z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left side: Text and Buttons */}
                <div className="flex flex-col items-start justify-center pr-8">
                    <h2 className="leading-[1.2] font-semibold text-[#1a1a1a] mb-10 tracking-tight">
                        <span className="text-[2rem]">Start with 1$ in your balance</span>
                        <br /><span className="text-[1.5rem]"><TextShimmer>per month for free.</TextShimmer></span>
                    </h2>

                    <div className="flex items-center gap-4">
                        <HeroButtons />
                    </div>
                </div>

                {/* Right side: Graphic/Image Placeholder */}
                <div className="flex items-center justify-end relative h-full min-h-[300px]">
                    {/* 
            User Instructions:
            Replace the src below with your actual graphic image path (e.g., '/images/my-graphic.png').
            You can also adjust the width/height classes as needed for your specific image.
          */}
                    <img
                        src="/landing/Gradient3D.png"
                        alt="Feature Graphic"
                        className="object-contain w-full max-w-[800px] opacity-90"
                        onError={(e) => {
                            // Fallback styling so you can clearly see where the image goes before uploading it
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `
                <div class="w-full max-w-[400px] h-[250px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                  <span class="text-sm font-medium text-gray-400">Replace with your graphic</span>
                </div>
              `;
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
