'use client';
import { BaseChat } from '~/components/chat/BaseChat';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { Chat } from '~/components/chat/Chat.client';
import { useAuth } from '~/hooks/useAuth';
import { Button } from '~/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/Card';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
        <BackgroundRays />
        <Header />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
        <BackgroundRays />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <img src="/logo-light-styled.png" alt="Bolt" className="w-32 inline-block dark:hidden" />
                <img src="/logo-dark-styled.png" alt="Bolt" className="w-32 inline-block hidden dark:block" />
              </div>
              <CardTitle>Welcome to Bolt</CardTitle>
              <CardDescription>Log in or create an account to start building with AI</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                className="w-full bg-accent-500 text-white hover:bg-accent-600"
                onClick={() => router.push('/signup')}
              >
                Create account
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push('/login')}>
                Log in
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <ClientOnly fallback={<BaseChat />}>
        {() => <Chat />}
      </ClientOnly>
    </div>
  );
}
