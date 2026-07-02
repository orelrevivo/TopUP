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
            <div
                className={`backdrop-blur-md bg-white border-b border-zinc-200 ${className}`}
                style={{ height: '50px' }}
            >
                <div className="w-full max-w-5xl mx-auto flex justify-between items-center h-full px-4 border-l border-r border-zinc-200">
                    {/* Left section */}
                    <div className="flex items-center space-x-4">
                        <div
                            ref={(el) => { triggerRefs.current['apple'] = el; }}
                            onClick={() => toggleMenu('apple')}
                            className="cursor-pointer hover:opacity-80 transition-opacity duration-150 mb-1"
                        >
                            <img src="/logo-light-styled.png" width={120} alt="Logo" />
                        </div>

                        <Link href="/pricing">
                            <span className="text-black/80 hover:text-black/70 text-sm font-semibold">{appName}</span>
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

                    {/* Right section */}
                    <div className="flex items-center space-x-4">
                        <HeroButtons />
                    </div>
                </div>
            </div>

            {/* Dropdowns */}
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
    );
};

export default MacOSMenuBar;