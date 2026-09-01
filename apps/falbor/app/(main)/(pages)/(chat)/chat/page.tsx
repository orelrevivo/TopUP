'use client';
import { BaseChat } from '~/components/chat/core/BaseChat';
import { Header } from '~/components/header/Header';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { Menu } from '~/components/sidebar/Menu.client';
import { Chat } from '~/components/chat/core/Chat.client';
import { useAuth } from '~/hooks/useAuth';
import { usePathname } from 'next/navigation';

import { Suspense } from 'react';

function ChatPageContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full relative bg-[#f0eded5c] dark:bg-[#080808]">
        <Header />
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="flex flex-row h-[100dvh] w-full overflow-hidden bg-[#f0eded5c] dark:bg-[#080808]">
      <ClientOnly>{() => <Menu />}</ClientOnly>
      <div className="flex flex-col flex-1 min-w-0 h-full w-full relative">
        <Header />
        <ClientOnly fallback={<BaseChat />}>
          {() => <Chat />}
        </ClientOnly>
      </div>
    </div>
  );
}
export default function ChatPage() { return <Suspense fallback={null}><ChatPageContent /></Suspense>; }
