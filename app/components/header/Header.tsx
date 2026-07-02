'use client';
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { AuthButtons } from '~/components/auth/AuthButtons';
import { UserAvatar } from '~/components/auth/UserAvatar';
import { ControlPanel } from '~/components/@settings/core/ControlPanel';
import type { TabType } from '~/components/@settings/core/types';

import { sidebarOpen, sidebarPinned } from '~/lib/stores/sidebar';

export function Header() {
  const chat = useStore(chatStore);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<TabType | null>(null);

  const isPinned = useStore(sidebarPinned);
  const isOpen = useStore(sidebarOpen);

  const toggleSidebar = () => {
    if (chat.started) {
      sidebarOpen.set(!isOpen);
    } else {
      sidebarPinned.set(!isPinned);
      sidebarOpen.set(!isPinned);
    }
  };

  const handleOpenPanel = (tab?: TabType) => {
    setInitialTab(tab ?? null);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setInitialTab(null);
  };

  return (
    <>
      <header
        className={classNames('flex items-center px-4 border-b h-[var(--header-height)]', {
          'border-transparent': !chat.started,
          'border-falbor-elements-borderColor': chat.started,
        })}
      >
        <div
          className="flex items-center gap-2 z-logo text-falbor-elements-textPrimary cursor-pointer"
          onClick={toggleSidebar}
        >
          <div className={classNames("text-xl", isPinned && !chat.started ? "i-ph:sidebar-simple-duotone" : "i-ph:sidebar-simple-duotone bg-falbor-elements-background-depth-3")} />
          <a href="/" className="text-2xl font-semibold text-accent-500 flex items-center" onClick={(e) => e.stopPropagation()}>
            <img src="/logo-light-styled.png" alt="logo" className="w-[130px] inline-block dark:hidden" />
            <img src="/logo-dark-styled.png" alt="logo" className="w-[130px] inline-block hidden dark:block" />
          </a>
        </div>
        <span className="flex-1" />
        {chat.started && (
          <>
            <span className="flex-1 px-4 truncate text-center text-falbor-elements-textPrimary">
              <ClientOnly>{() => <ChatDescription />}</ClientOnly>
            </span>
            <ClientOnly>
              {() => (
                <div className="">
                  <HeaderActionButtons chatStarted={chat.started} />
                </div>
              )}
            </ClientOnly>
            <ClientOnly>
              {() => (
                <>
                  <AuthButtons />
                  <UserAvatar
                    onOpenProfile={() => handleOpenPanel('profile')}
                    onOpenSettings={() => handleOpenPanel('settings')}
                  />
                </>
              )}
            </ClientOnly>          </>
        )}
      </header>

      {/* Settings panel — rendered outside the header so it overlays everything */}
      <ClientOnly>
        {() => (
          <ControlPanel
            open={isPanelOpen}
            onClose={handleClosePanel}
            initialTab={initialTab}
          />
        )}
      </ClientOnly>
    </>
  );
}