"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AgentPaceSection() {
    // In a real scenario, these would be fetched from the database
    const activeUsersReal = 2;
    const websitesCreatedReal = 1;
    const mcpCountReal = 8; // Change based on actual MCP count

    const [activeUsers, setActiveUsers] = useState(1000);
    const [platformUsage, setPlatformUsage] = useState(1500);
    const [mcpCount, setMcpCount] = useState(0);

    useEffect(() => {
        // Simple count-up animation
        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepTime = duration / steps;

        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            // Easing out function for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setActiveUsers(Math.floor(1000 + (activeUsersReal * easeOut)));
            setPlatformUsage(Math.floor(1500 + (websitesCreatedReal * easeOut)));
            setMcpCount(Math.floor(mcpCountReal * easeOut));

            if (currentStep >= steps) {
                clearInterval(interval);
                setActiveUsers(1000 + activeUsersReal);
                setPlatformUsage(1500 + websitesCreatedReal);
                setMcpCount(mcpCountReal);
            }
        }, stepTime);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full min-h-[800px] flex items-start justify-start bg-white overflow-hidden pt-32 pb-72">
            {/* Background Image Wrapper for the user to upload their own image */}
            {/* The user can change the src below to their uploaded background image */}
            <div
                // Try bumping it up
                className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none opacity-100 h-[65%]"
                style={{
                    backgroundImage: "url('/landing/graph.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "bottom center",
                    backgroundRepeat: "no-repeat"
                }}
            />

            <div className="w-full max-w-5xl mx-auto px-12 z-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-3xl"
                >
                    <h2 className="text-[2.5rem] leading-[1.1] tracking-tight mb-16 font-medium">
                        <span className="text-[#1a1a1a] font-semibold">The hub for Agents.</span>{" "}
                        <span className="text-[#8c8c8c]">
                            platforms that people use to earn their time
                        </span>
                    </h2>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-12 max-w-lg">
                        {/* Stat 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="flex flex-col relative pl-6 border-l border-gray-200"
                        >
                            <span className="text-4xl font-semibold text-[#1a1a1a] mb-2">{platformUsage}k</span>
                            <span className="text-[13px] text-gray-400 font-medium tracking-wide">Platform usage per month</span>
                        </motion.div>

                        {/* Stat 2 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="flex flex-col relative pl-6 border-l border-gray-200"
                        >
                            <span className="text-4xl font-semibold text-[#1a1a1a] mb-2">{activeUsers}k</span>
                            <span className="text-[13px] text-gray-400 font-medium tracking-wide">Active users</span>
                        </motion.div>

                        {/* Stat 3 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="flex flex-col relative pl-6 border-l border-gray-200"
                        >
                            <span className="text-4xl font-semibold text-[#1a1a1a] mb-2">{mcpCount}+</span>
                            <span className="text-[13px] text-gray-400 font-medium tracking-wide">Active MCPs</span>
                        </motion.div>

                        {/* Stat 4 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="flex flex-col relative pl-6 border-l border-gray-200"
                        >
                            <span className="text-4xl font-semibold text-[#1a1a1a] mb-2">99.9%</span>
                            <span className="text-[13px] text-gray-400 font-medium tracking-wide">Uptime</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
