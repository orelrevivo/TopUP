'use client';
import { useStore } from '@nanostores/react';
import type { Message } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useAnimate } from 'framer-motion';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useMessageParser, usePromptEnhancer, useShortcuts } from '~/lib/hooks';
import { description, useChatHistory, chatId } from '~/lib/persistence';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { DEFAULT_MODEL, DEFAULT_PROVIDER, MODEL_REGEX, PROMPT_COOKIE_KEY, PROVIDER_LIST, PROVIDER_REGEX } from '~/utils/constants';
import { cubicEasingFn } from '~/utils/easings';
import { createScopedLogger, renderLogger } from '~/utils/logger';
import { BaseChat } from './BaseChat';
import Cookies from 'js-cookie';
import { debounce } from '~/utils/debounce';
import { useSettings } from '~/lib/hooks/useSettings';
import type { ProviderInfo } from '~/types/model';
import { useSearchParams } from 'next/navigation';
import { createSampler } from '~/utils/sampler';
import { getTemplates, selectStarterTemplate } from '~/utils/selectStarterTemplate';
import { logStore } from '~/lib/stores/logs';
import { streamingState } from '~/lib/stores/streaming';
import { filesToArtifacts } from '~/utils/fileUtils';
import { supabaseConnection } from '~/lib/stores/supabase';
import { defaultDesignScheme, type DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';
import type { TextUIPart, FileUIPart, Attachment } from '@ai-sdk/ui-utils';
import { useMCPStore } from '~/lib/stores/mcp';
import type { LlmErrorAlertType } from '~/types/actions';
import { skillsStore } from '~/lib/stores/skills';

const logger = createScopedLogger('Chat');

export function Chat() {
  renderLogger.trace('Chat');

  const { ready, initialMessages, storeMessageHistory, importChat, exportChat } = useChatHistory();
  const title = useStore(description);
  useEffect(() => {
    workbenchStore.setReloadedMessages(initialMessages.map((m) => m.id));
  }, [initialMessages]);

  return (
    <>
      {ready && (
        <ChatImpl
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

    if (messages.length > initialMessages.length && !isLoading) {
      storeMessageHistory(messages).catch((error) => toast.error(error.message));
    }
  },
  50,
);

interface ChatProps {
  initialMessages: Message[];
  storeMessageHistory: (messages: Message[]) => Promise<void>;
  importChat: (description: string, messages: Message[]) => Promise<void>;
  exportChat: () => void;
  description?: string;
}

export const ChatImpl = memo(
  ({ description, initialMessages, storeMessageHistory, importChat, exportChat }: ChatProps) => {
    useShortcuts();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [chatStarted, setChatStarted] = useState(initialMessages.length > 0);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [imageDataList, setImageDataList] = useState<string[]>([]);
    const [cloneUrl, setCloneUrl] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const [fakeLoading, setFakeLoading] = useState(false);
    const files = useStore(workbenchStore.files);
    const [designScheme, setDesignScheme] = useState<DesignScheme>(defaultDesignScheme);
    const actionAlert = useStore(workbenchStore.alert);
    const deployAlert = useStore(workbenchStore.deployAlert);
    const supabaseConn = useStore(supabaseConnection);
    const selectedProject = supabaseConn.stats?.projects?.find(
      (project) => project.id === supabaseConn.selectedProjectId,
    );
    const supabaseAlert = useStore(workbenchStore.supabaseAlert);
    const { activeProviders, promptId, autoSelectTemplate, contextOptimizationEnabled } = useSettings();
    const [llmErrorAlert, setLlmErrorAlert] = useState<LlmErrorAlertType | undefined>(undefined);
    const currentChatId = useStore(chatId);
    const [localChatId] = useState(() =>
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    );
    const activeChatId = currentChatId || (initialMessages.length > 0 ? initialMessages[0].id : localChatId);

    const [provider, setProvider] = useState<ProviderInfo>(() => {
      let extractedProvider: ProviderInfo | undefined;
      let extractedModel: string | undefined;

      if (initialMessages && initialMessages.length > 0) {
        const lastUserMsg = [...initialMessages].reverse().find(m => m.role === 'user');
        if (lastUserMsg && typeof lastUserMsg.content === 'string') {
          const providerMatch = lastUserMsg.content.match(PROVIDER_REGEX);
          const modelMatch = lastUserMsg.content.match(MODEL_REGEX);

          extractedModel = modelMatch?.[1];
          extractedProvider = PROVIDER_LIST.find((p) => p.name === providerMatch?.[1]) as ProviderInfo | undefined;

          // Validation: Ensure the extracted provider actually supports the extracted model
          if (extractedModel && extractedProvider) {
            const providerHasModel = extractedProvider.staticModels?.some(m => m.name === extractedModel);
            if (!providerHasModel) {
              // Mismatch! Let's find the correct provider for this model
              const correctProvider = PROVIDER_LIST.find((p) => p.staticModels?.some(m => m.name === extractedModel));
              if (correctProvider) {
                extractedProvider = correctProvider as ProviderInfo;
              } else {
                extractedModel = undefined; // Model doesn't exist, ignore it
              }
            }
          } else if (extractedModel && !extractedProvider) {
            // No provider, but we have a model. Deduce provider.
            extractedProvider = PROVIDER_LIST.find((p) => p.staticModels?.some(m => m.name === extractedModel)) as ProviderInfo | undefined;
          }
        }
      }

      if (extractedProvider) return extractedProvider as ProviderInfo;

      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('chat_model_' + activeChatId);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const p = PROVIDER_LIST.find((p) => p.name === parsed.provider);
            if (p) return p as ProviderInfo;
          } catch(e) {}
        }
      }

      const defaultProviderName = Cookies.get('lastSelectedProvider') || Cookies.get('defaultProvider') || DEFAULT_PROVIDER.name;
      return (PROVIDER_LIST.find((p) => p.name === defaultProviderName) || DEFAULT_PROVIDER) as ProviderInfo;
    });

    const [model, setModel] = useState<string>(() => {
      if (initialMessages && initialMessages.length > 0) {
        const lastUserMsg = [...initialMessages].reverse().find(m => m.role === 'user');
        if (lastUserMsg && typeof lastUserMsg.content === 'string') {
          const modelMatch = lastUserMsg.content.match(MODEL_REGEX);
          const providerMatch = lastUserMsg.content.match(PROVIDER_REGEX);
          
          let extractedModel = modelMatch?.[1];
          const extractedProvider = PROVIDER_LIST.find((p) => p.name === providerMatch?.[1]);

          if (extractedModel && extractedProvider) {
            const providerHasModel = extractedProvider.staticModels?.some(m => m.name === extractedModel);
            if (!providerHasModel) {
              const correctProvider = PROVIDER_LIST.find((p) => p.staticModels?.some(m => m.name === extractedModel));
              // If we couldn't find a correct provider for the model, we shouldn't use this model.
              if (!correctProvider) extractedModel = undefined;
            }
          }
          if (extractedModel) return extractedModel;
        }
      }

      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('chat_model_' + activeChatId);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.model) return parsed.model;
          } catch(e) {}
        }
      }
      
      let providerInfo = DEFAULT_PROVIDER as ProviderInfo;
      const defaultProviderName = Cookies.get('lastSelectedProvider') || Cookies.get('defaultProvider') || DEFAULT_PROVIDER.name;
      providerInfo = (PROVIDER_LIST.find((p) => p.name === defaultProviderName) || DEFAULT_PROVIDER) as ProviderInfo;
      
      return Cookies.get('lastSelectedModel') || providerInfo.staticModels?.[0]?.name || DEFAULT_MODEL;
    });

    useEffect(() => {
      if (provider && model && typeof window !== 'undefined') {
        localStorage.setItem('chat_model_' + activeChatId, JSON.stringify({ provider: provider.name, model }));
        Cookies.set('lastSelectedProvider', provider.name, { expires: 365 });
        Cookies.set('lastSelectedModel', model, { expires: 365 });
      }
    }, [provider, model, activeChatId]);

    const { showChat } = useStore(chatStore);
    const [animationScope, animate] = useAnimate();
    const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
    const [chatMode, setChatMode] = useState<'discuss' | 'build'>('build');
    const [selectedElement, setSelectedElement] = useState<ElementInfo | null>(null);
    const mcpSettings = useMCPStore((state) => state.settings);

    const chatBody = useMemo(() => ({
      apiKeys,
      files,
      promptId,
      contextOptimization: contextOptimizationEnabled,
      chatMode,
      designScheme,
      supabase: {
        isConnected: supabaseConn.isConnected,
        hasSelectedProject: !!selectedProject,
        credentials: {
          supabaseUrl: supabaseConn?.credentials?.supabaseUrl,
          anonKey: supabaseConn?.credentials?.anonKey,
        },
      },
      maxLLMSteps: mcpSettings.maxLLMSteps,
      mcpEnabled: mcpSettings.mcpEnabled,
      chatId: currentChatId || (initialMessages.length > 0 ? initialMessages[0].id : localChatId),
    }), [
      apiKeys,
      files,
      promptId,
      contextOptimizationEnabled,
      chatMode,
      designScheme,
      supabaseConn.isConnected,
      selectedProject,
      supabaseConn?.credentials?.supabaseUrl,
      supabaseConn?.credentials?.anonKey,
      mcpSettings.maxLLMSteps,
      mcpSettings.mcpEnabled,
      currentChatId,
      initialMessages,
      localChatId
    ]);

    const handleChatError = useCallback((error: any) => handleError(error, 'chat'), []);
    const handleChatFinish = useCallback((message: Message, response: { usage?: any }) => {
      const usage = response.usage;
      setData(undefined);

      if (usage) {
        console.log('Token usage:', usage);
        logStore.logProvider('Chat response completed', {
          component: 'Chat',
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
      api: '/api/chat',
      body: chatBody,
      experimental_throttle: 50,
      sendExtraMessageFields: true,
      onError: handleChatError,
      onFinish: handleChatFinish,
      // DO NOT pass initialMessages here — @ai-sdk/react v1.x will auto-send to the API
      // if initialMessages ends with a user message ("resumable streams" feature).
      // We inject messages manually via setMessages() in a useEffect below.
      initialInput: Cookies.get(PROMPT_COOKIE_KEY) || '',
    });

    // Manually inject the conversation history after mount, WITHOUT triggering auto-resume.
    // Strip any trailing user message to prevent the SDK from trying to "complete" it.
    const _messagesInjected = useRef(false);
    useEffect(() => {
      if (_messagesInjected.current) return;
      _messagesInjected.current = true;

      const msgs = [...initialMessages];
      let inputFromLastMsg = '';

      if (msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg.role === 'user') {
          msgs.pop();
          if (typeof lastMsg.content === 'string' && !lastMsg.annotations?.includes('hidden')) {
            const cleaned = lastMsg.content.replace(MODEL_REGEX, '').replace(PROVIDER_REGEX, '').trim();
            if (cleaned) inputFromLastMsg = cleaned;
          }
        }
      }

      if (msgs.length > 0) {
        setMessages(msgs);
      }
      if (inputFromLastMsg) {
        setInput(inputFromLastMsg);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run exactly once on mount

    useEffect(() => {
      const prompt = searchParams.get('prompt');

      // console.log(prompt, searchParams, model, provider);

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
    const { parsedMessages, parseMessages } = useMessageParser();

    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

    useEffect(() => {
      chatStore.setKey('started', initialMessages.length > 0);
    }, []);

    useEffect(() => {
      processSampledMessages({
        messages,
        initialMessages,
        isLoading,
        parseMessages,
        storeMessageHistory,
      });
    }, [messages, isLoading, parseMessages]);

    const scrollTextArea = () => {
      const textarea = textareaRef.current;

      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    };

    const abort = () => {
      stop();
      chatStore.setKey('aborted', true);
      workbenchStore.abortAllActions();

      logStore.logProvider('Chat response aborted', {
        component: 'Chat',
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
          component: 'Chat',
          action: 'request',
          error: errorInfo.message,
          context,
          retryable: errorInfo.isRetryable,
          errorType,
          provider: provider.name,
        });

        // Create API error alert
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
      if (chatStarted) {
        return;
      }

      const animations: any[] = [];

      if (document.querySelector('#examples')) {
        animations.push(animate('#examples', { opacity: 0, display: 'none' }, { duration: 0.1 }));
      }

      if (document.querySelector('#intro')) {
        animations.push(animate('#intro', { opacity: 0, flex: 1 }, { duration: 0.2, ease: cubicEasingFn }));
      }

      await Promise.all(animations);

      chatStore.setKey('started', true);

      setChatStarted(true);
    };

    // Helper function to create message parts array from text and images
    const createMessageParts = (text: string, images: string[] = []): Array<TextUIPart | FileUIPart> => {
      // Create an array of properly typed message parts
      const parts: Array<TextUIPart | FileUIPart> = [
        {
          type: 'text',
          text,
        },
      ];

      // Add image parts if any
      images.forEach((imageData) => {
        // Extract correct MIME type from the data URL
        const mimeType = imageData.split(';')[0].split(':')[1] || 'image/jpeg';

        // Create file part according to AI SDK format
        parts.push({
          type: 'file',
          mimeType,
          data: imageData.replace(/^data:image\/[^;]+;base64,/, ''),
        });
      });

      return parts;
    };

    // Helper function to convert File[] to Attachment[] for AI SDK
    const filesToAttachments = async (files: File[]): Promise<Attachment[] | undefined> => {
      if (files.length === 0) {
        return undefined;
      }

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

      if (!messageContent?.trim()) {
        return;
      }

      if (isLoading) {
        abort();
        return;
      }

      let finalMessageContent = messageContent;

      if (cloneUrl) {
        finalMessageContent = `[Clone Website: ${cloneUrl}]\n\n${finalMessageContent}`;
      }

      if (selectedElement) {
        console.log('Selected Element:', selectedElement);

        const elementInfo = `<div class=\"__falborSelectedElement__\" data-element='${JSON.stringify(selectedElement)}'>${JSON.stringify(`${selectedElement.displayText}`)}</div>`;
        finalMessageContent = messageContent + elementInfo;
      }

      runAnimation();

      if (!chatStarted) {
        setFakeLoading(true);
        if (!currentChatId) {
          chatId.set(localChatId);
        }

        if (autoSelectTemplate) {
          const { template, title } = await selectStarterTemplate({
            message: finalMessageContent,
            model,
            provider,
          });

          if (template !== 'blank') {
            const temResp = await getTemplates(template, title).catch((e) => {
              if (e.message.includes('rate limit')) {
                toast.warning('Rate limit exceeded. Skipping starter template\n Continuing with blank template');
              } else {
                toast.warning('Failed to import starter template\n Continuing with blank template');
              }

              return null;
            });

            if (temResp) {
              const { assistantMessage, userMessage } = temResp;
              const userMessageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${finalMessageContent}`;

              const attachments = uploadedFiles.length > 0 ? await filesToAttachments(uploadedFiles) : undefined;
              setMessages([
                {
                  id: `1-${new Date().getTime()}`,
                  role: 'user',
                  content: userMessageText,
                  parts: createMessageParts(userMessageText, imageDataList),
                  experimental_attachments: attachments,
                },
                {
                  id: `2-${new Date().getTime()}`,
                  role: 'assistant',
                  content: assistantMessage,
                },
                {
                  id: `3-${new Date().getTime()}`,
                  role: 'user',
                  content: `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${userMessage}`,
                  annotations: ['hidden'],
                },
              ]);

              const reloadOptions =
                uploadedFiles.length > 0
                  ? { experimental_attachments: await filesToAttachments(uploadedFiles) }
                  : undefined;

              reload(reloadOptions);
              setInput('');
              setCloneUrl(null);
              Cookies.remove(PROMPT_COOKIE_KEY);

              setUploadedFiles([]);
              setImageDataList([]);

              resetEnhancer();

              textareaRef.current?.blur();
              setFakeLoading(false);

              return;
            }
          }
        }

        // If autoSelectTemplate is disabled or template selection failed, proceed with normal message
        const userMessageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${finalMessageContent}`;
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
        setCloneUrl(null);
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

      const modifiedFiles = workbenchStore.getModifiedFiles();

      chatStore.setKey('aborted', false);

      const activeSkills = skillsStore.get().filter(s => s.isActive);
      let skillsContext = '';
      if (activeSkills.length > 0) {
        skillsContext = "\n\n[ACTIVE SKILLS - The following instructions MUST be followed for this request]:\n" +
          activeSkills.map(s => `=== Skill: ${s.name} ===\n${s.content}\n`).join('\n') +
          "\n[CRITICAL INSTRUCTION: You MUST start your final text response (AFTER any <think> or reasoning blocks) with a <skill_usage name=\"SkillName\">Brief confirmation that you are applying this skill</skill_usage> tag for EACH active skill. Do NOT place this inside your thinking block. The UI requires these exact XML tags to activate the skill features.]\n[END ACTIVE SKILLS]\n\n";
      }

      if (modifiedFiles !== undefined) {
        const userUpdateArtifact = filesToArtifacts(modifiedFiles, `${Date.now()}`);
        const messageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${userUpdateArtifact}${skillsContext}${finalMessageContent}`;

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

        workbenchStore.resetAllFileModifications();
      } else {
        const messageText = `[Model: ${model}]\n\n[Provider: ${provider.name}]${skillsContext}\n\n${finalMessageContent}`;

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
      }

      setInput('');
      setCloneUrl(null);
      Cookies.remove(PROMPT_COOKIE_KEY);

      setUploadedFiles([]);
      setImageDataList([]);

      resetEnhancer();

      textareaRef.current?.blur();
    };

    /**
     * Handles the change event for the textarea and updates the input state.
     * @param event - The change event from the textarea.
     */
    const onTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleInputChange(event);
    };

    /**
     * Debounced function to cache the prompt in cookies.
     * Caches the trimmed value of the textarea input after a delay to optimize performance.
     */
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

    const handleModelChange = (newModel: string) => {
      setModel(newModel);
      Cookies.set('selectedModel', newModel, { expires: 30 });
    };

    const handleProviderChange = (newProvider: ProviderInfo) => {
      setProvider(newProvider);
      Cookies.set('selectedProvider', newProvider.name, { expires: 30 });
    };

    const handleWebSearchResult = useCallback(
      (result: string) => {
        const currentInput = input || '';
        const newInput = currentInput.length > 0 ? `${result}\n\n${currentInput}` : result;

        // Update the input via the same mechanism as handleInputChange
        const syntheticEvent = {
          target: { value: newInput },
        } as React.ChangeEvent<HTMLTextAreaElement>;
        handleInputChange(syntheticEvent);
      },
      [input, handleInputChange],
    );

    return (
      <BaseChat
        ref={animationScope}
        textareaRef={textareaRef}
        input={input}
        showChat={showChat}
        chatStarted={chatStarted}
        isStreaming={isLoading || fakeLoading}
        onStreamingChange={(streaming) => {
          streamingState.set(streaming);
        }}
        enhancingPrompt={enhancingPrompt}
        promptEnhanced={promptEnhanced}
        sendMessage={sendMessage}
        model={model}
        setModel={handleModelChange}
        provider={provider}
        setProvider={handleProviderChange}
        providerList={activeProviders}
        handleInputChange={(e) => {
          onTextareaChange(e);
          debouncedCachePrompt(e);
        }}
        handleStop={abort}
        description={description}
        importChat={importChat}
        exportChat={exportChat}
        messages={messages.map((message, i) => {
          const initMsg = initialMessages.find(m => m.id === message.id);
          const annotations = message.annotations || initMsg?.annotations;

          if (message.role === 'user') {
            return { ...message, annotations };
          }

          return {
            ...message,
            annotations,
            content: parsedMessages[i] || '',
          };
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
        actionAlert={actionAlert}
        clearAlert={() => workbenchStore.clearAlert()}
        supabaseAlert={supabaseAlert}
        clearSupabaseAlert={() => workbenchStore.clearSupabaseAlert()}
        deployAlert={deployAlert}
        clearDeployAlert={() => workbenchStore.clearDeployAlert()}
        llmErrorAlert={llmErrorAlert}
        clearLlmErrorAlert={clearApiErrorAlert}
        data={chatData}
        chatMode={chatMode}
        setChatMode={setChatMode}
        append={append}
        designScheme={designScheme}
        setDesignScheme={setDesignScheme}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
        cloneUrl={cloneUrl}
        setCloneUrl={setCloneUrl}
        addToolResult={addToolResult}
        onWebSearchResult={handleWebSearchResult}
      />
    );
  },
);
