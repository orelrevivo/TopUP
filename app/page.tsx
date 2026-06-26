'use client';
import { BaseChat } from '~/components/chat/BaseChat';

export default function Page() {
  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BaseChat />
    </div>
  );
}
