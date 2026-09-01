'use client';
import { HackingBaseChat } from '~/components/hacking/HackingBaseChat';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { Menu } from '~/components/sidebar/Menu.client';
import { HackingChat } from '~/components/hacking/HackingChat.client';
import { useAuth } from '~/hooks/useAuth';
import { useRouter } from 'next/navigation';

import { Suspense } from 'react';

function HackingPageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full bg-[#F7F6F2] dark:bg-[#0D0D0D]">
        <Header />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex flex-row h-[100dvh] w-full overflow-hidden bg-[#F7F6F2] dark:bg-[#0D0D0D]">
      <ClientOnly>{() => <Menu />}</ClientOnly>
      <div className="flex flex-col flex-1 min-w-0 h-full w-full relative">
        <Header />
        <ClientOnly fallback={<HackingBaseChat />}>
          {() => <HackingChat />}
        </ClientOnly>
      </div>
    </div>
  );
}
export default function HackingPage() { return <Suspense fallback={null}><HackingPageContent /></Suspense>; }
