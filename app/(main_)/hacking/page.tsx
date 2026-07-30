'use client';
import { HackingBaseChat } from '~/components/hacking/HackingBaseChat';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { HackingChat } from '~/components/hacking/HackingChat.client';
import { useAuth } from '~/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function HackingPage() {
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
    <div className="flex flex-col h-full w-full bg-[#F7F6F2]dark:bg-[#0D0D0D]">
      <Header />
      <ClientOnly fallback={<HackingBaseChat />}>
        {() => <HackingChat />}
      </ClientOnly>
    </div>
  );
}
