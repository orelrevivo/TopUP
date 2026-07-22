/**
 * useHackingChatHistory
 *
 * Mirrors useChatHistory from ~/lib/persistence but talks exclusively to
 * /api/data/hacking-chats and the isolated hackingChats / hackingMessages DB tables.
 *
 * Key differences vs the main useChatHistory:
 *  - No workbench / snapshot restoration (hacking chats are pure text)
 *  - Navigates to /hacking/[id] instead of /chat/[id]
 *  - Uses hackingChatApi instead of chatApi
 */
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { atom } from 'nanostores';
import { type JSONValue, type Message } from 'ai';
import { toast } from 'react-toastify';
import { logStore } from '~/lib/stores/logs';
import * as hackingChatApi from '~/lib/api/data/hacking-chat';
import { description, chatId } from '~/lib/persistence';

// Shared atom — reuse the global description / chatId atoms so the sidebar
// description display works without changes.
export { description, chatId };

export function useHackingChatHistory() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const mixedId = params?.id as string | undefined;

  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [urlId, setUrlId] = useState<string | undefined>();

  useEffect(() => {
    if (mixedId) {
      let cancelled = false;

      hackingChatApi
        .getChat(mixedId)
        .then((storedChat) => {
          if (cancelled) return;
          if (storedChat && storedChat.messages.length > 0) {
            // Respect optional rewindTo param
            const rewindId = searchParams?.get('rewindTo');
            const endingIdx = rewindId
              ? storedChat.messages.findIndex((m: any) => m.id === rewindId) + 1
              : storedChat.messages.length;

            setInitialMessages(storedChat.messages.slice(0, endingIdx) as Message[]);
            setUrlId(storedChat.urlId ?? storedChat.id);
            description.set(storedChat.description);
            chatId.set(storedChat.id);
          }
        })
        .catch((error) => {
          if (cancelled) return;
          console.error(error);
          logStore.logError('Failed to load hacking chat messages', error);
          toast.error('Failed to load hacking chat: ' + error.message);
        })
        .finally(() => {
          if (!cancelled) setReady(true);
        });

      return () => {
        cancelled = true;
      };
    } else {
      setReady(true);
    }
  }, [mixedId, searchParams]);

  const storeMessageHistory = useCallback(
    async (messages: Message[]) => {
      if (messages.length === 0) return;

      // Strip messages that should not be persisted
      const filteredMessages = messages.filter(
        (m) => !m.annotations?.includes('no-store')
      );

      // Generate a chat ID if we don't have one yet
      if (!chatId.get()) {
        const nextId = await hackingChatApi.getNextId();
        chatId.set(nextId);
      }

      // Update URL to /hacking/[id] after the first message is saved
      if (initialMessages.length === 0 && !urlId) {
        const currentId = chatId.get()!;
        const nextUrlId = await hackingChatApi.getUrlId(currentId);
        setUrlId(nextUrlId);
        navigateHackingChat(currentId);
      }

      const finalChatId = chatId.get();
      if (!finalChatId) {
        console.error('[HackingChat] Cannot save messages — chat ID is not set.');
        toast.error('Failed to save hacking chat: Chat ID missing.');
        return;
      }

      await hackingChatApi.saveChat({
        id: finalChatId,
        messages: filteredMessages,
        urlId,
        description: description.get(),
        timestamp: new Date().toISOString(),
      });
    },
    [initialMessages.length, urlId]
  );

  const exportChat = useCallback(
    async (id = urlId) => {
      if (!id) return;
      const chat = await hackingChatApi.getChat(id);
      const chatData = {
        messages: chat?.messages || [],
        description: chat?.description,
        exportDate: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(chatData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hacking-chat-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [urlId]
  );

  const importChat = useCallback(
    async (desc: string, messages: Message[]) => {
      try {
        const newUrlId = await hackingChatApi.createChatFromMessages(desc, messages);
        window.location.href = `/hacking/${newUrlId}`;
        toast.success('Hacking chat imported successfully');
      } catch (error: any) {
        toast.error('Failed to import hacking chat: ' + error.message);
      }
    },
    []
  );

  const duplicateCurrentChat = useCallback(
    async (listItemId: string) => {
      if (!mixedId && !listItemId) return;
      try {
        const newUrlId = await hackingChatApi.duplicateChat(mixedId || listItemId);
        router.push(`/hacking/${newUrlId}`);
        toast.success('Hacking chat duplicated successfully');
      } catch (error) {
        toast.error('Failed to duplicate hacking chat');
        console.log(error);
      }
    },
    [mixedId, router]
  );

  return {
    ready: !mixedId || ready,
    initialMessages,
    storeMessageHistory,
    exportChat,
    importChat,
    duplicateCurrentChat,
  };
}

function navigateHackingChat(nextId: string) {
  const url = new URL(window.location.href);
  url.pathname = `/hacking/${nextId}`;
  window.history.replaceState({}, '', url);
}
