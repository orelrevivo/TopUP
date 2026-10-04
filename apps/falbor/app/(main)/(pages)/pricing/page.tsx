import { LandingScrollHandler } from '~/components/landing/landing-scroll-handler';
import DefaultDemo from '~/components/landing/Navbar';
import PricingSection from '~/components/landing/PricingSection';
import { ThemeHandler } from '~/components/landing/ThemeHandler';

export default function Pricing() {
    return (
        <div>
            <ThemeHandler />
            <LandingScrollHandler />
            <div className="fixed top-2 md:top-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-16px)] md:w-[calc(100%-48px)] max-w-5xl pointer-events-auto">
                <div className="w-full rounded-xl border border-zinc-200 dark:border-white/10" style={{ backdropFilter: 'blur(20px)' }}>
                    <DefaultDemo />
                </div>
            </div>
            <PricingSection />
        </div>
    )
}