"use client";

import Link from 'next/link'
import { Button } from '~/components/ui/Button'
import { Check, X } from 'lucide-react'

export default function PricingSection() {
    return (
        <section className="py-16 md:py-32 bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05]"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="mx-auto max-w-5xl px-6 relative z-10">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h1 className="text-center text-4xl lg:text-5xl tracking-tight">Pricing that Scales with You</h1>
                    <p className="text-zinc-400 text-lg">
                        Upgrade your account to unlock premium features and add balance for AI operations.
                        No subscriptions, just pay once and top up when needed.
                    </p>
                </div>
                <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
                    <div className="flex flex-col justify-between space-y-8 border border-zinc-800 bg-zinc-900/30 p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10 rounded-l-xl rounded-r-xl md:rounded-r-none">
                        <div className="space-y-4">
                            <div>
                                <h2 className="font-medium text-white">Free</h2>
                                <span className="my-3 block text-4xl font-black text-white">$0</span>
                                <p className="text-zinc-500 text-sm">Forever</p>
                            </div>
                            <Link href="/signup" className="block w-full">
                                <button className="w-full bg-transparent border border-zinc-700 hover:bg-zinc-800 text-white font-semibold py-2.5 rounded-md transition-colors">
                                    Current Plan
                                </button>
                            </Link>
                            <hr className="border-dashed border-zinc-800 my-6" />
                            <ul className="list-outside space-y-4 text-sm text-zinc-400">
                                <li className="flex items-start gap-3">
                                    <Check className="size-4 text-green-500 mt-0.5" />
                                    Website deployment to Falbor
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="size-4 text-green-500 mt-0.5" />
                                    Short Screen Recordings (up to 20 mins)
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="size-4 text-green-500 mt-0.5" />
                                    $1 initial AI credit balance
                                </li>
                                <li className="flex items-start gap-3 opacity-50">
                                    <X className="size-4 text-red-500 mt-0.5" />
                                    Custom Supabase Databases
                                </li>
                                <li className="flex items-start gap-3 opacity-50">
                                    <X className="size-4 text-red-500 mt-0.5" />
                                    Website deployment to Netlify & Vercel
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="relative bg-[#0A0A0A]/80 border border-[#FF5800]/50 p-6 md:col-span-3 lg:p-10 rounded-xl overflow-hidden">
                        <div className="absolute top-0 right-6 -translate-y-0 bg-[#FF5800] text-white text-xs px-3 py-1 rounded-b-md font-semibold shadow-md">
                            Recommended
                        </div>
                        <div className="grid gap-8 sm:grid-cols-2 h-full">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="font-medium text-white flex items-center gap-2">
                                        Pro
                                        <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded uppercase tracking-wider font-bold">One-time</span>
                                    </h2>
                                    <span className="my-3 block text-4xl font-black text-white">$20</span>
                                    <p className="text-zinc-500 text-sm">Pay once, no recurring fees</p>
                                </div>
                                <Link href="/signup?plan=pro" className="block w-full">
                                    <button className="w-full bg-[#FF5800] hover:bg-[#e04e00] text-white font-bold py-2.5 rounded-md transition-colors shadow-lg">
                                        Get Started
                                    </button>
                                </Link>
                                <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
                                    Need more AI credits? You can top up your balance at any time inside your dashboard. ($1 = $1 AI Balance)
                                </p>
                            </div>
                            <div className="border-t border-zinc-800 pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
                                <div className="text-sm font-semibold text-white mb-4">Everything in free, plus:</div>
                                <ul className="list-outside space-y-4 text-sm text-zinc-300">
                                    <li className="flex items-start gap-3">
                                        <Check className="size-4 text-[#FF5800] mt-0.5 flex-shrink-0" />
                                        Website deployment to Netlify & Vercel
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="size-4 text-[#FF5800] mt-0.5 flex-shrink-0" />
                                        Long Screen Recordings (up to 3 hours)
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="size-4 text-[#FF5800] mt-0.5 flex-shrink-0" />
                                        Custom Supabase Databases
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="size-4 text-[#FF5800] mt-0.5 flex-shrink-0" />
                                        <span className="font-medium text-white">$20.00 AI credit balance included</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="size-4 text-[#FF5800] mt-0.5 flex-shrink-0" />
                                        Priority Support (Coming soon)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}