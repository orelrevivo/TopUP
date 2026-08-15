'use client';
/*
 * @ts-nocheck
 * Preventing TS checks with files presented in the video for a better presentation.
 */
import type { JSONValue, Message } from 'ai';
import React, { type RefCallback, useEffect, useState } from 'react';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { HackingWorkbench } from './HackingWorkbench.client';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';
import { HackingMessages } from './HackingMessages.client';
import { getApiKeysFromCookies } from '~/components/chat/APIKeyManager';
import Cookies from 'js-cookie';
import * as Tooltip from '@radix-ui/react-tooltip';
import styles from '~/components/chat/BaseChat.module.scss';
import type { ProviderInfo } from '~/types/model';
import type { ActionAlert, SupabaseAlert, DeployAlert, LlmErrorAlertType } from '~/types/actions';
import DeployChatAlert from '~/components/deploy/DeployAlert';
import ChatAlert from '~/components/chat/ChatAlert';
import type { ModelInfo } from '~/lib/modules/llm/types';
import ProgressCompilation from '~/components/chat/ProgressCompilation';
import type { ProgressAnnotation } from '~/types/context';
import { SupabaseChatAlert } from '~/components/chat/SupabaseAlert';
import { expoUrlAtom } from '~/lib/stores/qrCodeStore';
import { useStore } from '@nanostores/react';
import { StickToBottom, useStickToBottomContext } from '~/lib/hooks';
import { HackingChatBox } from './HackingChatBox';
import type { DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';
import LlmErrorAlert from '~/components/chat/LLMApiAlert';
import ViewErrorAlert from '~/components/chat/ViewErrorAlert';
import { useDesignSystem } from '~/lib/hooks/useDesignSystem';
import { workbenchStore } from '~/lib/stores/workbench';
import Link from 'next/link';

const TEXTAREA_MIN_HEIGHT = 76;

interface HackingBaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  onStreamingChange?: (streaming: boolean) => void;
  messages?: Message[];
  description?: string;
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  model?: string;
  setModel?: (model: string) => void;
  provider?: ProviderInfo;
  setProvider?: (provider: ProviderInfo) => void;
  providerList?: ProviderInfo[];
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
  importChat?: (description: string, messages: Message[]) => Promise<void>;
  exportChat?: () => void;
  uploadedFiles?: File[];
  setUploadedFiles?: (files: File[]) => void;
  imageDataList?: string[];
  setImageDataList?: (dataList: string[]) => void;
  actionAlert?: ActionAlert;
  clearAlert?: () => void;
  supabaseAlert?: SupabaseAlert;
  clearSupabaseAlert?: () => void;
  deployAlert?: DeployAlert;
  clearDeployAlert?: () => void;
  llmErrorAlert?: LlmErrorAlertType;
  clearLlmErrorAlert?: () => void;
  data?: JSONValue[] | undefined;
  chatMode?: 'discuss' | 'build' | 'troubleshoot' | 'idea';
  setChatMode?: (mode: 'discuss' | 'build' | 'troubleshoot' | 'idea') => void;
  append?: (message: Message) => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  selectedElement?: ElementInfo | null;
  setSelectedElement?: (element: ElementInfo | null) => void;
  cloneUrl?: string | null;
  setCloneUrl?: (url: string | null) => void;
  addToolResult?: ({ toolCallId, result }: { toolCallId: string; result: any }) => void;
  onWebSearchResult?: (result: string) => void;
}

export const HackingBaseChat = React.forwardRef<HTMLDivElement, HackingBaseChatProps>(
  (
    {
      textareaRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      onStreamingChange,
      model,
      setModel,
      provider,
      setProvider,
      providerList,
      input = '',
      enhancingPrompt,
      handleInputChange,

      // promptEnhanced,
      enhancePrompt,
      sendMessage,
      handleStop,
      importChat,
      exportChat,
      uploadedFiles = [],
      setUploadedFiles,
      imageDataList = [],
      setImageDataList,
      messages,
      actionAlert,
      clearAlert,
      deployAlert,
      clearDeployAlert,
      supabaseAlert,
      clearSupabaseAlert,
      llmErrorAlert,
      clearLlmErrorAlert,
      data,
      chatMode,
      setChatMode,
      append,
      designScheme,
      setDesignScheme,
      selectedElement,
      setSelectedElement,
      cloneUrl,
      setCloneUrl,
      addToolResult = () => {
        throw new Error('addToolResult not implemented');
      },
      onWebSearchResult,
    },
    ref,
  ) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;
    const [apiKeys, setApiKeys] = useState<Record<string, string>>(getApiKeysFromCookies());
    const [modelList, setModelList] = useState<ModelInfo[]>([]);
    const [isModelSettingsCollapsed, setIsModelSettingsCollapsed] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [transcript, setTranscript] = useState('');
    const [isModelLoading, setIsModelLoading] = useState<string | undefined>('all');
    const [progressAnnotations, setProgressAnnotations] = useState<ProgressAnnotation[]>([]);
    const expoUrl = useStore(expoUrlAtom);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const showMainChatBox = !chatStarted;
    const { handleDesignSystemSave, handleLiveUpdate } = useDesignSystem();
    const isDesignSystemMode = useStore(workbenchStore.isDesignSystemMode);

    useEffect(() => {
      if (expoUrl) {
        setQrModalOpen(true);
      }
    }, [expoUrl]);

    useEffect(() => {
      import('~/lib/webcontainer').then(({ startWebContainer }) => {
        startWebContainer();
      });
    }, []);

    useEffect(() => {
      if (data) {
        const progressList = data.filter(
          (x) => typeof x === 'object' && (x as any).type === 'progress',
        ) as ProgressAnnotation[];
        setProgressAnnotations(progressList);
      }
    }, [data]);
    useEffect(() => {
      console.log(transcript);
    }, [transcript]);

    useEffect(() => {
      onStreamingChange?.(isStreaming);
    }, [isStreaming, onStreamingChange]);

    useEffect(() => {
      if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');

          setTranscript(transcript);

          if (handleInputChange) {
            const syntheticEvent = {
              target: { value: transcript },
            } as React.ChangeEvent<HTMLTextAreaElement>;
            handleInputChange(syntheticEvent);
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }, []);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        let parsedApiKeys: Record<string, string> | undefined = {};

        try {
          parsedApiKeys = getApiKeysFromCookies();
          setApiKeys(parsedApiKeys);
        } catch (error) {
          console.error('Error loading API keys from cookies:', error);
          Cookies.remove('apiKeys');
        }

        setIsModelLoading('all');
        fetch('/api/models')
          .then((response) => response.json())
          .then((data) => {
            const typedData = data as { modelList: ModelInfo[] };
            setModelList(typedData.modelList);
          })
          .catch((error) => {
            console.error('Error fetching model list:', error);
          })
          .finally(() => {
            setIsModelLoading(undefined);
          });
      }
    }, [providerList, provider]);

    const onApiKeysChange = async (providerName: string, apiKey: string) => {
      const newApiKeys = { ...apiKeys, [providerName]: apiKey };
      setApiKeys(newApiKeys);
      Cookies.set('apiKeys', JSON.stringify(newApiKeys));

      setIsModelLoading(providerName);

      let providerModels: ModelInfo[] = [];

      try {
        const response = await fetch(`/api/models/${encodeURIComponent(providerName)}`);
        const data = await response.json();
        providerModels = (data as { modelList: ModelInfo[] }).modelList;
      } catch (error) {
        console.error('Error loading dynamic models for:', providerName, error);
      }

      // Only update models for the specific provider
      setModelList((prevModels) => {
        const otherModels = prevModels.filter((model) => model.provider !== providerName);
        return [...otherModels, ...providerModels];
      });
      setIsModelLoading(undefined);
    };

    const startListening = () => {
      if (recognition) {
        recognition.start();
        setIsListening(true);
      }
    };

    const stopListening = () => {
      if (recognition) {
        recognition.stop();
        setIsListening(false);
      }
    };

    const handleSendMessage = (event: React.UIEvent, messageInput?: string) => {
      if (sendMessage) {
        sendMessage(event, messageInput);
        setSelectedElement?.(null);

        if (recognition) {
          recognition.abort(); // Stop current recognition
          setTranscript(''); // Clear transcript
          setIsListening(false);

          // Clear the input by triggering handleInputChange with empty value
          if (handleInputChange) {
            const syntheticEvent = {
              target: { value: '' },
            } as React.ChangeEvent<HTMLTextAreaElement>;
            handleInputChange(syntheticEvent);
          }
        }
      }
    };

    const handleFileUpload = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];

        if (file) {
          const reader = new FileReader();

          reader.onload = (e) => {
            const base64Image = e.target?.result as string;
            setUploadedFiles?.([...uploadedFiles, file]);
            setImageDataList?.([...imageDataList, base64Image]);
          };
          reader.readAsDataURL(file);
        }
      };

      input.click();
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;

      if (!items) {
        return;
      }

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();

          const file = item.getAsFile();

          if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
              const base64Image = e.target?.result as string;
              setUploadedFiles?.([...uploadedFiles, file]);
              setImageDataList?.([...imageDataList, base64Image]);
            };
            reader.readAsDataURL(file);
          }

          break;
        }
      }
    };

    const baseChat = (
      <div
        ref={ref}
        className={classNames(styles.BaseChat, 'relative flex flex-1 min-h-0 h-full w-full overflow-hidden')}
        data-chat-visible={showChat}
      >
        <div className="flex flex-col lg:flex-row overflow-hidden w-full h-full">
          <div className={classNames(styles.Chat, 'flex flex-col flex-grow lg:min-w-[var(--chat-min-width)] h-full relative')}>
            {!chatStarted && (
              <div id="intro" className="mt-[10vh] w-full max-w-3xl mx-auto flex flex-col items-center justify-center px-4 lg:px-0 font-medium tracking-tight animate-fade-in">
                {/* Container for alignment */}
                <div className="flex flex-col">
                  {/* Top line */}
                  <div className="text-5xl lg:text-[64px] text-[#1A1A1A] dark:text-white mb-2 ml-[80px]">
                    Give your
                  </div>
                  {/* Bottom line */}
                  <div className="flex items-center gap-6">
                    {/* Asterisk */}
                    <img className="text-[#2792f5] text-[80px] -mt-4 w-20 h-20" src="/favicon.ico" alt="" />
                    {/* Security agent (stacked) */}
                    <div className="flex flex-col text-5xl lg:text-[64px] text-[#2792f5] leading-[1.1]">
                      <span>Super</span>
                      <span>agent</span>
                    </div>

                    {/* its first task (stacked) */}
                    <div className="flex flex-col text-5xl lg:text-[64px] text-[#1A1A1A] dark:text-white leading-[1.1]">
                      <span>its first</span>
                      <span>task.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <StickToBottom
              data-scrollable="true"
              className={classNames('pt-2 px-2 sm:px-6 relative mr-10', {
                'h-full flex flex-col': chatStarted,
              })}
            >
              <StickToBottom.Content className="flex flex-col gap-4 relative">
                <ClientOnly>
                  {() => {
                    return chatStarted ? (
                      <HackingMessages
                        className="flex flex-col w-full flex-1 max-w-chat pb-4 mx-auto z-1 px-4"
                        messages={messages}
                        isStreaming={isStreaming}
                        append={append}
                        chatMode={chatMode}
                        setChatMode={setChatMode}
                        provider={provider}
                        model={model}
                        addToolResult={addToolResult}
                        onNavigate={(url, screenshotUrl) => {
                          workbenchStore.currentAiUrl.set(url);
                          if (screenshotUrl) workbenchStore.currentAiScreenshot.set(screenshotUrl);
                        }}
                      />
                    ) : null;
                  }}
                </ClientOnly>
                <ScrollToBottom />
              </StickToBottom.Content>
              <div
                className={classNames('flex flex-col gap-2 w-full mx-auto z-prompt mb-6 px-4', {
                  'max-w-chat sticky bottom-2 mt-auto': chatStarted,
                  'max-w-chat mt-12': !chatStarted,
                })}
              >
                <div className="flex flex-col gap-2">
                  {supabaseAlert && (
                    <SupabaseChatAlert
                      alert={supabaseAlert}
                      clearAlert={() => clearSupabaseAlert?.()}
                      postMessage={(message) => {
                        sendMessage?.({} as any, message);
                        clearSupabaseAlert?.();
                      }}
                    />
                  )}
                  {actionAlert && (
                    <ChatAlert
                      alert={actionAlert}
                      clearAlert={() => clearAlert?.()}
                      postMessage={(message) => {
                        sendMessage?.({} as any, message);
                        clearAlert?.();
                      }}
                    />
                  )}
                  {llmErrorAlert && <LlmErrorAlert alert={llmErrorAlert} clearAlert={() => clearLlmErrorAlert?.()} />}
                  <ViewErrorAlert
                    postMessage={(message) => {
                      sendMessage?.({} as any, message);
                    }}
                  />
                </div>
                <div className={classNames({ '': !chatStarted })}>
                  {deployAlert && (
                    <DeployChatAlert
                      alert={deployAlert}
                      clearAlert={() => clearDeployAlert?.()}
                      postMessage={(message: string | undefined) => {
                        sendMessage?.({} as any, message);
                        clearSupabaseAlert?.();
                      }}
                    />
                  )}
                  {progressAnnotations && <ProgressCompilation data={progressAnnotations} />}
                  <HackingChatBox
                    isModelSettingsCollapsed={isModelSettingsCollapsed}
                    setIsModelSettingsCollapsed={setIsModelSettingsCollapsed}
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}
                    imageDataList={imageDataList}
                    setImageDataList={setImageDataList}
                    textareaRef={textareaRef}
                    input={input}
                    handleInputChange={handleInputChange}
                    handlePaste={handlePaste}
                    TEXTAREA_MIN_HEIGHT={TEXTAREA_MIN_HEIGHT}
                    TEXTAREA_MAX_HEIGHT={TEXTAREA_MAX_HEIGHT}
                    isStreaming={isStreaming}
                    handleStop={handleStop}
                    handleSendMessage={handleSendMessage}
                    enhancingPrompt={enhancingPrompt}
                    enhancePrompt={enhancePrompt}
                    isListening={isListening}
                    startListening={startListening}
                    stopListening={stopListening}
                    chatStarted={chatStarted}
                    exportChat={exportChat}
                    qrModalOpen={qrModalOpen}
                    setQrModalOpen={setQrModalOpen}
                    handleFileUpload={handleFileUpload}
                    chatMode={chatMode}
                    setChatMode={setChatMode}
                    designScheme={designScheme}
                    setDesignScheme={setDesignScheme}
                    selectedElement={selectedElement}
                    setSelectedElement={setSelectedElement}
                    cloneUrl={cloneUrl}
                    setCloneUrl={setCloneUrl}
                    onWebSearchResult={onWebSearchResult}
                  />
                  <span className='text-black dark:text-white'>
                    We're building our AI model from scratch. It takes time to get everything right,
                    so we're currently opening it only for limited testing with a select group of users.
                    if you want test it, please contact us <Link href="mailto:orelrevivo4000@gmail.com" className='text-[#2792f5]'>here.</Link>
                  </span>
                </div>
              </div>
            </StickToBottom>
          </div>
          <ClientOnly>
            {() => (
              /* Hacking Workspace */
              <HackingWorkbench />
            )}
          </ClientOnly>
        </div>
      </div>
    );

    return <Tooltip.Provider delayDuration={200}>{baseChat}</Tooltip.Provider>;
  },
);

function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    !isAtBottom && (
      <>
        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-falbor-elements-background-depth-1 to-transparent h-20 z-10" />
        <button
          className="sticky z-50 bottom-0 left-0 right-0 text-4xl rounded-lg px-1.5 py-0.5 flex items-center justify-center mx-auto gap-2 bg-falbor-elements-background-depth-2 border border-falbor-elements-borderColor text-falbor-elements-textPrimary text-sm"
          onClick={() => scrollToBottom()}
        >
          Latest messages
          <span className="i-ph:arrow-down-bold" />
        </button>
      </>
    )
  );
}
