'use client';
import type { Message } from 'ai';
import { toast } from 'react-toastify';
import * as Popover from '@radix-ui/react-popover';
import { IconButton } from '~/components/ui/IconButton';
import { ImportFolderButton } from '~/components/chat/ImportFolderButton';

type ChatData = {
  messages?: Message[]; // Standard Falbor format
  description?: string; // Optional description
};

export function ImportButtons(importChat: ((description: string, messages: Message[]) => Promise<void>) | undefined) {
  return (
    <>
      <input
        type="file"
        id="chat-import"
        className="hidden"
        accept=".json"
        onChange={async (e) => {
          const file = e.target.files?.[0];

          if (file && importChat) {
            try {
              const reader = new FileReader();

              reader.onload = async (e) => {
                try {
                  const content = e.target?.result as string;
                  const data = JSON.parse(content) as ChatData;

                  // Standard format
                  if (Array.isArray(data.messages)) {
                    await importChat(data.description || 'Imported Chat', data.messages);
                    toast.success('Chat imported successfully');

                    return;
                  }

                  toast.error('Invalid chat file format');
                } catch (error: unknown) {
                  if (error instanceof Error) {
                    toast.error('Failed to parse chat file: ' + error.message);
                  } else {
                    toast.error('Failed to parse chat file');
                  }
                }
              };
              reader.onerror = () => toast.error('Failed to read chat file');
              reader.readAsText(file);
            } catch (error) {
              toast.error(error instanceof Error ? error.message : 'Failed to import chat');
            }
            e.target.value = ''; // Reset file input
          } else {
            toast.error('Something went wrong');
          }
        }}
      />

      <Popover.Root>
        <Popover.Trigger asChild>
          <IconButton
            title="More Options"
            className="transition-all border border-falbor-elements-borderColor !bg-white dark:!bg-falbor-elements-background-depth-2"
          >
            <div className="i-ph:dots-three-vertical text-xl" />
          </IconButton>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={10}
            side="bottom"
            align="end"
            className="bg-falbor-elements-background-depth-2 text-falbor-elements-item-contentAccent rounded-md border border-falbor-elements-borderColor shadow-lg z-[100] overflow-hidden flex flex-col py-1 w-48"
          >
            <button
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-falbor-elements-background-depth-3 transition-colors text-falbor-elements-textPrimary"
              onClick={() => {
                const input = document.getElementById('chat-import');
                input?.click();
              }}
            >
              <div className="i-falbor:chat text-xl text-falbor-elements-textSecondary"></div>
              <span>Import Chat</span>
            </button>

            <ImportFolderButton importChat={importChat} asMenuItem />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}