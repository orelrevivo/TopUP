'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings } from 'lucide-react';
import { Badge } from "~/components/ui/Badge";
import { useRouter } from 'next/navigation';
import HeroButtons from '../HeroButtons';

interface MenuItem {
    type: 'item';
    label: React.ReactNode;
    action?: string;
    shortcut?: string;
    hasSubmenu?: boolean;
    icon?: React.ReactNode;
}

interface MenuSeparator {
    type: 'separator';
}

type MenuItemOption = MenuItem | MenuSeparator;

interface MenuConfig {
    label: string;
    items: MenuItemOption[];
}

interface MacOSMenuBarProps {
    appName?: string;
    menus?: MenuConfig[];
    onMenuAction?: (action: string) => void;
    className?: string;
}

const DEFAULT_MENUS: MenuConfig[] = [];

const APPLE_MENU_ITEMS: MenuItemOption[] = [
    { type: 'item', label: 'Return to home', action: '/' },
    { type: 'item', label: 'About This Website', action: '/about' },
    { type: 'separator' },
    { type: 'item', label: 'Restart...', action: 'restart' },
];

interface MenuDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    items: MenuItemOption[];
    left: number;
    onAction?: (action: string) => void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({ isOpen, onClose, items, left, onAction }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute backdrop-blur-md z-[9999]"
            style={{
                left: `${left}px`,
                top: '34px',
                background: 'rgba(40, 40, 40, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '8px',
                boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.4),
          0 2px 8px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `,
                minWidth: '220px',
                animation: 'menuFadeIn 0.15s cubic-bezier(0.23, 1, 0.32, 1) forwards',
            }}
        >
            <div className="py-1">
                {items.map((item, index) => {
                    if (item.type === 'separator') {
                        return <div key={index} className="h-px bg-white/15 mx-2 my-1" />;
                    }

                    return (
                        <div
                            key={index}
                            className="px-4 py-1 text-white text-sm cursor-pointer hover:bg-white/10 transition-colors duration-100 flex justify-between items-center"
                            onClick={() => {
                                if (item.action) onAction?.(item.action);
                                onClose();
                            }}
                        >
                            <span className="flex items-center">
                                {item.icon && <span className="mr-2">{item.icon}</span>}
                                {item.label}
                                {item.hasSubmenu && <span className="ml-2 text-xs opacity-70">▶</span>}
                            </span>
                            {item.shortcut && (
                                <span className="text-xs text-white/60 ml-4">{item.shortcut}</span>
                            )}
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
        @keyframes menuFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(-5px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
        </div>
    );
};

const MacOSMenuBar: React.FC<MacOSMenuBarProps> = ({
    appName = 'Pricing',
    menus = DEFAULT_MENUS,
    onMenuAction,
    className = '',
}) => {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState('');
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [dropdownLeft, setDropdownLeft] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const triggerRefs = useRef<{ [key: string]: HTMLElement | null }>({});

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(
                new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const openMenu = useCallback((menuKey: string) => {
        const triggerEl = triggerRefs.current[menuKey];
        if (!triggerEl) return;

        const rect = triggerEl.getBoundingClientRect();
        const parentRect = triggerEl.closest('.relative')?.getBoundingClientRect() || { left: 0 };

        const left =
            menuKey === 'user'
                ? rect.left - parentRect.left + rect.width / 2 - 110
                : rect.left - parentRect.left;

        setDropdownLeft(Math.max(8, left));
        setActiveMenu(menuKey);
    }, []);

    const toggleMenu = useCallback(
        (menuKey: string) => {
            if (activeMenu === menuKey) setActiveMenu(null);
            else openMenu(menuKey);
        },
        [activeMenu, openMenu],
    );

    const closeDropdown = useCallback(() => setActiveMenu(null), []);

    const handleMenuActionLocal = useCallback(
        (action: string) => {
            if (action === 'restart') {
                window.location.reload();
                return;
            }
            if (action === 'logout') {
                router.push('/sign-out');
                return;
            }
            if (action.startsWith('/')) {
                router.push(action);
                return;
            }
            onMenuAction?.(action);
        },
        [router, onMenuAction],
    );

    return (
        <div className="relative">
            {}
            <div
                className={`hidden md:block backdrop-blur-md bg-white border-b border-zinc-200 ${className}`}
                style={{ height: '50px' }}
            >
                <div className="w-full max-w-5xl mx-auto flex justify-between items-center h-full px-4 border-l border-r border-zinc-200">
                    {}
                    <div className="flex items-center space-x-4">
                        <div
                            ref={(el) => { triggerRefs.current['apple'] = el; }}
                            onClick={() => toggleMenu('apple')}
                            className="cursor-pointer hover:opacity-80 transition-opacity duration-150 mb-1"
                        >
                            <img src="/logo-dark-styled.png" width={120} alt="Logo" />
                        </div>

                        <Link href="/pricing">
                            <span className="text-black/80 hover:text-black/70 text-sm font-semibold">{appName}</span>
                        </Link>
                        <Link href="/privacy">
                            <span className="text-black/80 hover:text-black/70 text-sm font-semibold">Legal &amp; Privacy</span>
                        </Link>
                        {menus.map((menu) => (
                            <span
                                key={menu.label}
                                ref={(el) => { triggerRefs.current[menu.label] = el; }}
                                className="text-black text-sm cursor-pointer hover:opacity-80 transition-opacity duration-150 select-none"
                                onClick={() => toggleMenu(menu.label)}
                            >
                                {menu.label}
                            </span>
                        ))}
                    </div>

                    {}
                    <div className="flex items-center space-x-4">
                        <HeroButtons />
                    </div>
                </div>
            </div>

            {}
            <div className={`md:hidden backdrop-blur-md bg-white border-b border-zinc-200 ${className}`}>
                <div className="flex items-center justify-between h-14 px-4">
                    {}
                    <Link href="/">
                        <img src="/logo-dark-styled.png" width={110} alt="Logo" />
                    </Link>

                    {}
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <span className="text-sm font-medium text-black/80">Sign In</span>
                        </Link>
                        <Link href="/signup">
                            <button className="text-sm font-medium bg-[#e7e7e7] !text-black px-3 py-1.5 rounded-md">
                                Start free
                            </button>
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1.5 text-black/80 rounded-md transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            ) : (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {}
                {mobileMenuOpen && (
                    <div className="border-t border-zinc-200 backdrop-blur-md bg-white px-4 py-4 flex flex-col gap-3">
                        <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                            <div className="py-2 text-sm font-semibold text-black/80 border-b border-zinc-200">
                                {appName}
                            </div>
                        </Link>
                        <Link href="/privacy" onClick={() => setMobileMenuOpen(false)}>
                            <div className="py-2 text-sm font-semibold text-black/80 border-b border-zinc-200">
                                Legal &amp; Privacy
                            </div>
                        </Link>
                        <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                            <div className="py-2 text-sm font-semibold text-black/80 border-b border-zinc-200">
                                About
                            </div>
                        </Link>
                        {}
                        <div className="flex items-center gap-4 pt-1">
                            <a href="https://x.com/WrRbybw84381" target="_blank" rel="noopener noreferrer">
                                <img src="/landing/social/X.png" alt="X" className="w-5 h-5 object-contain" />
                            </a>
                            <a href="https://www.instagram.com/falbor.xyz" target="_blank" rel="noopener noreferrer">
                                <img src="/landing/social/instagram.png" alt="Instagram" className="w-5 h-5 object-contain" />
                            </a>
                            <a href="https://www.linkedin.com/company/falbor-xyz" target="_blank" rel="noopener noreferrer">
                                <img src="/landing/social/linkdin.png" alt="LinkedIn" className="w-8 h-8 object-contain" />
                            </a>
                            <a href="https://www.reddit.com/r/Falbor" target="_blank" rel="noopener noreferrer">
                                <img src="/landing/social/reddit.png" alt="Reddit" className="w-5 h-5 object-contain" />
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {}
            <div className="hidden md:block">
                <MenuDropdown
                    isOpen={activeMenu === 'apple'}
                    onClose={closeDropdown}
                    items={APPLE_MENU_ITEMS}
                    left={dropdownLeft}
                    onAction={handleMenuActionLocal}
                />

                {menus.map((menu) => (
                    <MenuDropdown
                        key={menu.label}
                        isOpen={activeMenu === menu.label}
                        onClose={closeDropdown}
                        items={menu.items}
                        left={dropdownLeft}
                        onAction={handleMenuActionLocal}
                    />
                ))}
            </div>
        </div>
    );
};

export default MacOSMenuBar;