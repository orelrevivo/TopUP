'use client';
import { useStore } from '@nanostores/react';
import type { Message } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useAnimate } from 'framer-motion';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { usePromptEnhancer, useShortcuts } from '~/lib/hooks';
import { description } from '~/lib/persistence';
import { useHackingChatHistory } from '~/lib/persistence/useHackingChatHistory';
import { chatId } from '~/lib/persistence';
import { chatStore } from '~/lib/stores/chat';
import { PROMPT_COOKIE_KEY, PROVIDER_LIST } from '~/utils/constants';
import { cubicEasingFn } from '~/utils/easings';
import { createScopedLogger, renderLogger } from '~/utils/logger';
import { HackingBaseChat } from './HackingBaseChat';
import Cookies from 'js-cookie';
import { debounce } from '~/utils/debounce';
import { useSettings } from '~/lib/hooks/useSettings';
import type { ProviderInfo } from '~/types/model';
import { useSearchParams } from 'next/navigation';
import { createSampler } from '~/utils/sampler';
import { logStore } from '~/lib/stores/logs';
import { streamingState } from '~/lib/stores/streaming';
import type { LlmErrorAlertType } from '~/types/actions';
import type { TextUIPart, FileUIPart, Attachment } from '@ai-sdk/ui-utils';

const logger = createScopedLogger('HackingChat');

export function HackingChat() {
  renderLogger.trace('HackingChat');

  const { ready, initialMessages, storeMessageHistory, importChat, exportChat } = useHackingChatHistory();
  const title = useStore(description);

  return (
    <>
      {ready && (
        <HackingChatImpl
          description={title}
          initialMessages={initialMessages}
          exportChat={exportChat}
          storeMessageHistory={storeMessageHistory}
          importChat={importChat}
        />
      )}
    </>
  );
}

const processSampledMessages = createSampler(
  (options: {
    messages: Message[];
    initialMessages: Message[];
    isLoading: boolean;
    parseMessages: (messages: Message[], isLoading: boolean) => void;
    storeMessageHistory: (messages: Message[]) => Promise<void>;
  }) => {
    const { messages, initialMessages, isLoading, parseMessages, storeMessageHistory } = options;
    parseMessages(messages, isLoading);

    if (messages.length > initialMessages.length) {
      const lastMessage = messages[messages.length - 1];
      if (isLoading && lastMessage?.role === 'assistant') {
        // Only save up to the user message so we can auto-reconnect on refresh
        storeMessageHistory(messages.slice(0, -1)).catch((error) => toast.error(error.message));
      } else {
        // Save everything when finished
        storeMessageHistory(messages).catch((error) => toast.error(error.message));
      }
    }
  },
  50,
);

interface HackingChatProps {
  initialMessages: Message[];
  storeMessageHistory: (messages: Message[]) => Promise<void>;
  importChat: (description: string, messages: Message[]) => Promise<void>;
  exportChat: () => void;
  description?: string;
}

export const HackingChatImpl = memo(
  ({ description, initialMessages, storeMessageHistory, importChat, exportChat }: HackingChatProps) => {
    useShortcuts();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [chatStarted, setChatStarted] = useState(initialMessages.length > 0);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [imageDataList, setImageDataList] = useState<string[]>([]);
    const searchParams = useSearchParams();
    const [fakeLoading, setFakeLoading] = useState(false);
    const { activeProviders, promptId } = useSettings();
    const [llmErrorAlert, setLlmErrorAlert] = useState<LlmErrorAlertType | undefined>(undefined);
    const [model, setModel] = useState('deepseek-v4-pro');
    const [provider, setProvider] = useState(() => {
      return (PROVIDER_LIST.find((p) => p.name === 'Deepseek') || PROVIDER_LIST[0]) as ProviderInfo;
    });
    const { showChat } = useStore(chatStore);
    const [animationScope, animate] = useAnimate();
    const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
    const currentChatId = useStore(chatId);
    const [localChatId] = useState(() => {
      const uid =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      return `hacking-${uid}`;
    });

    const chatBody = {
      apiKeys,
      promptId,
      chatId: currentChatId || (initialMessages.length > 0 ? initialMessages[0].id : localChatId),
      model,
      provider: provider.name,
    };

    const handleChatError = useCallback((error: any) => handleError(error, 'chat'), []);
    const handleChatFinish = useCallback((message: Message, response: { usage?: any }) => {
      const usage = response.usage;
      setData(undefined);

      if (usage) {
        logStore.logProvider('HackingChat response completed', {
          component: 'HackingChat',
          action: 'response',
          model,
          provider: provider.name,
          usage,
          messageLength: message.content.length,
        });
      }

      logger.debug('Finished streaming');
    }, [model, provider.name]);

    const {
      messages,
      isLoading,
      input,
      handleInputChange,
      setInput,
      stop,
      append,
      setMessages,
      reload,
      error,
      data: chatData,
      setData,
      addToolResult,
    } = useChat({
      api: '/api/hacking-chat',
      body: chatBody,
      experimental_throttle: 50,
      sendExtraMessageFields: true,
      onError: handleChatError,
      onFinish: handleChatFinish,
      initialMessages,
      initialInput: Cookies.get(PROMPT_COOKIE_KEY) || '',
    });

    useEffect(() => {
      const prompt = searchParams.get('prompt');
      if (prompt) {
        window.history.replaceState(null, '', window.location.pathname);
        runAnimation();
        append({
          role: 'user',
          content: `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${prompt}`,
        });
      }
    }, [model, provider, searchParams]);

    const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } = usePromptEnhancer();

    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

    useEffect(() => {
      chatStore.setKey('started', initialMessages.length > 0);
    }, []);

    useEffect(() => {
      processSampledMessages({
        messages,
        initialMessages,
        isLoading,
        parseMessages: (_msgs: any, _loading: any) => { /* no-op: no artifact parsing needed */ },
        storeMessageHistory,
      });
    }, [messages, isLoading]);

    useEffect(() => {
      // If the chat loads from DB and the last message is from the user,
      // it means the assistant's reply was cut off by a page reload.
      // We automatically call reload() to reconnect to the persistent backend stream.
      if (messages.length > 0 && !isLoading && !fakeLoading) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'user') {
          reload();
        }
      }
    }, [messages, isLoading, fakeLoading, reload]);

    const scrollTextArea = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    };

    const abort = () => {
      stop();
      chatStore.setKey('aborted', true);

      logStore.logProvider('HackingChat response aborted', {
        component: 'HackingChat',
        action: 'abort',
        model,
        provider: provider.name,
      });
    };

    const handleError = useCallback(
      (error: any, context: 'chat' | 'template' | 'llmcall' = 'chat') => {
        logger.error(`${context} request failed`, error);
        stop();
        setFakeLoading(false);

        let errorInfo = {
          message: 'An unexpected error occurred',
          isRetryable: true,
          statusCode: 500,
          provider: provider.name,
          type: 'unknown' as const,
          retryDelay: 0,
        };

        if (error.message) {
          try {
            const parsed = JSON.parse(error.message);
            if (parsed.error || parsed.message) {
              errorInfo = { ...errorInfo, ...parsed };
            } else {
              errorInfo.message = error.message;
            }
          } catch {
            errorInfo.message = error.message;
          }
        }

        let errorType: LlmErrorAlertType['errorType'] = 'unknown';
        let title = 'Request Failed';

        if (errorInfo.statusCode === 401 || errorInfo.message.toLowerCase().includes('api key')) {
          errorType = 'authentication';
          title = 'Authentication Error';
        } else if (errorInfo.statusCode === 429 || errorInfo.message.toLowerCase().includes('rate limit')) {
          errorType = 'rate_limit';
          title = 'Rate Limit Exceeded';
        } else if (errorInfo.message.toLowerCase().includes('quota')) {
          errorType = 'quota';
          title = 'Quota Exceeded';
        } else if (errorInfo.statusCode >= 500) {
          errorType = 'network';
          title = 'Server Error';
        }

        logStore.logError(`${context} request failed`, error, {
          component: 'HackingChat',
          action: 'request',
          error: errorInfo.message,
          context,
          retryable: errorInfo.isRetryable,
          errorType,
          provider: provider.name,
        });

        setLlmErrorAlert({
          type: 'error',
          title,
          description: errorInfo.message,
          provider: provider.name,
          errorType,
        });
        setData([]);
      },
      [provider.name, stop],
    );

    const clearApiErrorAlert = useCallback(() => {
      setLlmErrorAlert(undefined);
    }, []);

    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        textarea.style.height = `${Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
        textarea.style.overflowY = scrollHeight > TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden';
      }
    }, [input, textareaRef]);

    const runAnimation = async () => {
      if (chatStarted) return;

      const animations: any[] = [];

      if (document.querySelector('#hacking-intro')) {
        animations.push(animate('#hacking-intro', { opacity: 0, flex: 1 }, { duration: 0.2, ease: cubicEasingFn }));
      }

      await Promise.all(animations);

      chatStore.setKey('started', true);
      setChatStarted(true);
    };

    // Helper function to create message parts array from text and images
    const createMessageParts = (text: string, images: string[] = []): Array<TextUIPart | FileUIPart> => {
      const parts: Array<TextUIPart | FileUIPart> = [{ type: 'text', text }];
      images.forEach((imageData) => {
        const mimeType = imageData.split(';')[0].split(':')[1] || 'image/jpeg';
        parts.push({
          type: 'file',
          mimeType,
          data: imageData.replace(/^data:image\/[^;]+;base64,/, ''),
        });
      });
      return parts;
    };

    const filesToAttachments = async (files: File[]): Promise<Attachment[] | undefined> => {
      if (files.length === 0) return undefined;
      const attachments = await Promise.all(
        files.map(
          (file) =>
            new Promise<Attachment>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({
                  name: file.name,
                  contentType: file.type,
                  url: reader.result as string,
                });
              };
              reader.readAsDataURL(file);
            }),
        ),
      );
      return attachments;
    };

    const sendMessage = async (_event: React.UIEvent, messageInput?: string) => {
      const messageContent = messageInput || input;
      if (!messageContent?.trim()) return;
      if (isLoading) {
        abort();
        return;
      }

      runAnimation();

      if (!chatStarted) {
        setFakeLoading(true);
        if (!currentChatId) {
          chatId.set(localChatId);
        }

        const userMessageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${messageContent}`;
        const attachments = uploadedFiles.length > 0 ? await filesToAttachments(uploadedFiles) : undefined;

        setMessages([
          {
            id: `${new Date().getTime()}`,
            role: 'user',
            content: userMessageText,
            parts: createMessageParts(userMessageText, imageDataList),
            experimental_attachments: attachments,
          },
        ]);
        reload(attachments ? { experimental_attachments: attachments } : undefined);
        setFakeLoading(false);
        setInput('');
        Cookies.remove(PROMPT_COOKIE_KEY);
        setUploadedFiles([]);
        setImageDataList([]);
        resetEnhancer();
        textareaRef.current?.blur();
        return;
      }

      if (error != null) {
        setMessages(messages.slice(0, -1));
      }

      chatStore.setKey('aborted', false);

      const messageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${messageContent}`;
      const attachmentOptions =
        uploadedFiles.length > 0 ? { experimental_attachments: await filesToAttachments(uploadedFiles) } : undefined;

      append(
        {
          role: 'user',
          content: messageText,
          parts: createMessageParts(messageText, imageDataList),
        },
        attachmentOptions,
      );

      setInput('');
      Cookies.remove(PROMPT_COOKIE_KEY);
      setUploadedFiles([]);
      setImageDataList([]);
      resetEnhancer();
      textareaRef.current?.blur();
    };

    const onTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleInputChange(event);
    };

    const debouncedCachePrompt = useCallback(
      debounce((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const trimmedValue = event.target.value.trim();
        Cookies.set(PROMPT_COOKIE_KEY, trimmedValue, { expires: 30 });
      }, 1000),
      [],
    );

    useEffect(() => {
      const storedApiKeys = Cookies.get('apiKeys');
      if (storedApiKeys) {
        setApiKeys(JSON.parse(storedApiKeys));
      }
    }, []);

    return (
      <HackingBaseChat
        ref={animationScope}
        textareaRef={textareaRef}
        input={input}
        showChat={showChat}
        chatStarted={chatStarted}
        isStreaming={isLoading || fakeLoading}
        onStreamingChange={(streaming: boolean) => {
          streamingState.set(streaming);
        }}
        enhancingPrompt={enhancingPrompt}
        sendMessage={sendMessage}
        handleInputChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          onTextareaChange(e);
          debouncedCachePrompt(e);
        }}
        handleStop={abort}
        description={description}
        messages={messages.map((message) => {
          const initMsg = initialMessages.find((m) => m.id === message.id);
          const annotations = message.annotations || initMsg?.annotations;
          // Use message.content directly — no artifact parsing needed for hacking chat
          const content = Array.isArray(message.content)
            ? (message.content.find((p: any) => p.type === 'text') as any)?.text || ''
            : message.content || '';
          return { ...message, annotations, content };
        })}
        enhancePrompt={() => {
          enhancePrompt(
            input,
            (input) => {
              setInput(input);
              scrollTextArea();
            },
            model,
            provider,
            apiKeys,
          );
        }}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        imageDataList={imageDataList}
        setImageDataList={setImageDataList}
        llmErrorAlert={llmErrorAlert}
        clearLlmErrorAlert={clearApiErrorAlert}
        data={chatData}
        append={append}
        addToolResult={addToolResult}
      />
    );
  },
);

HackingChatImpl.displayName = 'HackingChatImpl';
