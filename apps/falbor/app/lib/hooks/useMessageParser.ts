import type { Message } from 'ai';
import { useCallback, useState, useRef } from 'react';
import { EnhancedStreamingMessageParser } from '~/lib/runtime/enhanced-message-parser';
import { workbenchStore } from '~/lib/stores/workbench';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('useMessageParser');

const messageParser = new EnhancedStreamingMessageParser({
  callbacks: {
    onArtifactOpen: (data) => {
      logger.trace('onArtifactOpen', data);

      workbenchStore.showWorkbench.set(true);
      workbenchStore.addArtifact(data);
    },
    onArtifactClose: (data) => {
      logger.trace('onArtifactClose');

      workbenchStore.updateArtifact(data, { closed: true });
    },
    onActionOpen: (data) => {
      logger.trace('onActionOpen', data.action);

      /*
       * File actions are streamed, so we add them immediately to show progress
       * Shell actions are complete when created by enhanced parser, so we wait for close
       */
      if (data.action.type === 'file') {
        workbenchStore.addAction(data);
      }
    },
    onActionClose: (data) => {
      logger.trace('onActionClose', data.action);

      /*
       * Add non-file actions (shell, build, start, etc.) when they close
       * Enhanced parser creates complete shell actions, so they're ready to execute
       */
      if (data.action.type !== 'file') {
        workbenchStore.addAction(data);
      }

      workbenchStore.runAction(data);
    },
    onActionStream: (data) => {
      logger.trace('onActionStream', data.action);
      workbenchStore.runAction(data, true);
    },
  },
});
const extractTextContent = (message: Message) =>
  (Array.isArray(message.content)
    ? (message.content.find((item) => item.type === 'text')?.text as string) || ''
    : message.content) || '';

export function useMessageParser() {
  const [parsedMessages, setParsedMessages] = useState<{ [key: string]: string }>({});
  const parsedMessagesRef = useRef<{ [key: string]: string }>({});

  const parseMessages = useCallback((messages: Message[], isLoading: boolean) => {
    let didGlobalReset = false;

    // Removed development-only global reset logic that was causing message truncation and flickering.
    
    let hasUpdates = false;

    for (const message of messages) {
      if (message.role === 'assistant' || message.role === 'user') {
        const newParsedContent = messageParser.parse(message.id, extractTextContent(message));

        // wasReset is true when the enhanced parser detected code blocks and re-parsed from scratch.
        // In that case, newParsedContent is the full output and we must replace, not append.
        const shouldReplace = messageParser.wasReset;

        if (newParsedContent || shouldReplace) {
          parsedMessagesRef.current[message.id] = !shouldReplace 
            ? (parsedMessagesRef.current[message.id] || '') + newParsedContent 
            : newParsedContent;
          hasUpdates = true;
        }

        if (!isLoading) {
          messageParser.complete(message.id);
        }
      }
    }
    
    if (hasUpdates) {
      setParsedMessages({ ...parsedMessagesRef.current });
    }
  }, []);

  return { parsedMessages, parseMessages };
}