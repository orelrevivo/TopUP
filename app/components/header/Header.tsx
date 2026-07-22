'use client';
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { chatStore } from '~/lib/stores/chat';
import { settingsOpenStore, settingsTabStore } from '~/lib/stores/settings';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { AuthButtons } from '~/components/auth/AuthButtons';
import { UserAvatar } from '~/components/auth/UserAvatar';
import type { TabType } from '~/components/@settings/core/types';

import { sidebarOpen, sidebarPinned } from '~/lib/stores/sidebar';

import { useChatHistory } from '~/lib/persistence';
import { ExportChatButton } from '~/components/chat/chatExportAndImport/ExportChatButton';

export function Header() {
  const { exportChat } = useChatHistory();
  const chat = useStore(chatStore);

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
    settingsTabStore.set(tab ?? 'settings');
    settingsOpenStore.set(true);
    sidebarOpen.set(true);
  };

  return (
    <>
      <header
        className={classNames('relative flex items-center px-4 border-b h-[var(--header-height)]', {
          'border-transparent': !chat.started,
          'border-falbor-elements-borderColor': chat.started,
        })}
      >
        {!chat.started && (
          <button
            onClick={toggleSidebar}
            className="md:hidden flex items-center justify-center p-2 -ml-2 text-falbor-elements-textPrimary"
            title="Toggle Sidebar"
          >
            <div className="i-ph:list w-6 h-6" />
          </button>
        )}
        {chat.started && (
          <div
            className="flex items-center gap-2 z-logo text-falbor-elements-textPrimary cursor-pointer"
            onClick={toggleSidebar}
          >
            <a href="/" className="text-2xl font-semibold text-accent-500 flex items-center" onClick={(e) => e.stopPropagation()}>
              <img src="/logo-light-styled.png" alt="logo" className="w-[130px] inline-block dark:hidden" />
              <img src="/logo-dark-styled.png" alt="logo" className="w-[130px] inline-block hidden dark:block" />
            </a>
          </div>
        )}
        <span className="flex-1" />
        {chat.started && (
          <>
            <span className="absolute left-1/2 -translate-x-1/2 max-w-[50%] truncate text-center text-falbor-elements-textPrimary hidden md:block">
              <ClientOnly>{() => <ChatDescription />}</ClientOnly>
            </span>
            <ClientOnly>
              {() => (
                <div className="flex items-center gap-2">
                  <ExportChatButton exportChat={exportChat} />
                  <HeaderActionButtons chatStarted={chat.started} />
                </div>
              )}
            </ClientOnly>
          </>
        )}
        {!chat.started && (
          <ClientOnly>
            {() => (
              <div className="flex items-center gap-2">
                <AuthButtons />
                <UserAvatar
                  onOpenProfile={() => handleOpenPanel('profile')}
                  onOpenSettings={() => handleOpenPanel('settings')}
                />
              </div>
            )}
          </ClientOnly>
        )}
      </header>

    </>
  );
}