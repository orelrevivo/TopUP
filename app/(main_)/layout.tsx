'use client';
import { Menu } from '~/components/sidebar/Menu.client';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { usePathname } from 'next/navigation';
import { useAuth } from '~/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import styles from '~/components/chat/BaseChat.module.scss';
import { settingsOpenStore } from '~/lib/stores/settings';
import { InlineSettingsContent } from '~/components/@settings/core/InlineSettingsContent';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const chat = useStore(chatStore);
  const isSettingsOpen = useStore(settingsOpenStore);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to square layout, unless it's /chat/[id], or / (logged out)
  let layoutVariant: 'full' | 'square' = 'square';

  if (pathname?.startsWith('/chat/')) {
    layoutVariant = 'full';
  } else if (pathname?.startsWith('/u/')) {
    layoutVariant = 'full';
  } else if (pathname === '/') {
    // If logged out, or if the user started chatting (which will eventually transition to /chat/[id])
    layoutVariant = (user && !chat.started) ? 'square' : 'full';
  }

  const isProfilePage = pathname?.startsWith('/u/');

  // To prevent hydration mismatch with user state, wait until mounted
  if (!mounted) {
    return <div className="h-screen w-full bg-white dark:bg-[#111114]" />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-transparent dark:bg-[#111114]">
      {/* Sidebar handles its own transitions internally based on the variant prop */}
      {user && !isProfilePage && (
        <ClientOnly>{() => <Menu variant={layoutVariant} />}</ClientOnly>
      )}

      {/* The main container animates its padding to smoothly transition between square and full layouts */}
      <main className={classNames(
        "flex-1 flex flex-col overflow-hidden h-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] min-h-0",
        layoutVariant === 'square' ? "p-2 sm:p-4 md:p-6 lg:p-4" : "p-0"
      )}>
        <div className="flex-1 relative flex flex-col min-h-0 overflow-hidden">
          {/* The inner square animates its border radius, shadow, and borders */}
          <div className={classNames(
            "flex-1 overflow-hidden relative flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] w-full h-full",
            layoutVariant === 'square'
              ? "bg-white dark:bg-gray-950 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800"
              : "bg-white dark:bg-gray-950 rounded-none shadow-none border-transparent"
          )}>
            {isSettingsOpen ? <InlineSettingsContent /> : children}
          </div>
        </div>
      </main>
    </div>
  );
}
