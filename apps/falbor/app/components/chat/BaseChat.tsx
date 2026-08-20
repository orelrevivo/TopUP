'use client';
/*
 * @ts-nocheck
 * Preventing TS checks with files presented in the video for a better presentation.
 */
import type { JSONValue, Message } from 'ai';
import React, { type RefCallback, useEffect, useState } from 'react';
import { ClientOnly } from '~/components/ui/ClientOnly';


import { Workbench } from '~/components/workbench/Workbench.client';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';
import { Messages } from './Messages.client';
import { getApiKeysFromCookies } from './APIKeyManager';
import Cookies from 'js-cookie';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Popover from '@radix-ui/react-popover';
import styles from './BaseChat.module.scss';
import { ImportButtons } from '~/components/chat/chatExportAndImport/ImportButtons';
import { ExamplePrompts } from '~/components/chat/ExamplePrompts';
import GitCloneButton from './GitCloneButton';
import type { ProviderInfo } from '~/types/model';
import StarterTemplates from './StarterTemplates';
import type { ActionAlert, SupabaseAlert, DeployAlert, LlmErrorAlertType } from '~/types/actions';
import DeployChatAlert from '~/components/deploy/DeployAlert';
import ChatAlert from './ChatAlert';
import { Button } from '~/components/ui/Button';
import type { ModelInfo } from '~/lib/modules/llm/types';
import ProgressCompilation from './ProgressCompilation';
import type { ProgressAnnotation } from '~/types/context';
import { SupabaseChatAlert } from '~/components/chat/SupabaseAlert';
import { expoUrlAtom } from '~/lib/stores/qrCodeStore';
import { useStore } from '@nanostores/react';
import { StickToBottom, useStickToBottomContext } from '~/lib/hooks';
import { toast } from 'react-toastify';
import { Slider } from '~/components/ui/Slider';
import { ChatBox } from './ChatBox';
import type { DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';
import LlmErrorAlert from './LLMApiAlert';
import ViewErrorAlert from './ViewErrorAlert';
import { DesignSystemPanel } from './DesignSystemPanel';
import { useDesignSystem } from '~/lib/hooks/useDesignSystem';
import { workbenchStore } from '~/lib/stores/workbench';
import { useMCPStore } from '~/lib/stores/mcp';
import { RainbowTextEffect } from '../ui/textUIrgb';
import { TextShimmer } from '../ui/text-shimmer';
import { FeedbackWidget } from '~/components/ui/FeedbackWidget';
import { HistoryPanel } from './HistoryPanel';
import { getImagesForChat, removeBackgroundFromBase64, saveImageToStore } from '~/lib/utils/imageStore';
import { chatId } from '~/lib/persistence';

const TEXTAREA_MIN_HEIGHT = 76;

interface BaseChatProps {
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
  chatMode?: 'discuss' | 'build' | 'troubleshoot' | 'idea' | 'mvp_research' | 'mvp_research';
  setChatMode?: (mode: 'discuss' | 'build' | 'troubleshoot' | 'idea' | 'mvp_research' | 'mvp_research') => void;
  append?: (message: Message) => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  selectedElement?: ElementInfo | null;
  setSelectedElement?: (element: ElementInfo | null) => void;
  hideIntro?: boolean;
  cloneUrl?: string | null;
  setCloneUrl?: (url: string | null) => void;
  addToolResult?: ({ toolCallId, result }: { toolCallId: string; result: any }) => void;
  onWebSearchResult?: (result: string) => void;
  hideSlider?: boolean;
  isCompact?: boolean;
}

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
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
      hideIntro,
      hideSlider,
      isCompact,
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
    const processedFiles = React.useRef(new Set<string>());
    const currentChatId = useStore(chatId);
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
      import('~/lib/webcontainer').then(({ startWebContainer, webcontainer }) => {
        startWebContainer();

        // Restore persistent images on mount
        if (currentChatId) {
          getImagesForChat(currentChatId).then(images => {
            if (images && images.length > 0) {
              webcontainer.then(async (wc) => {
                for (const img of images) {
                  try {
                    const pathParts = img.filePath.split('/');
                    if (pathParts.length > 1) {
                      pathParts.pop();
                      const dir = pathParts.join('/');
                      await wc.fs.mkdir(dir, { recursive: true });
                    }
                    const binaryString = atob(img.base64Data);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                      bytes[i] = binaryString.charCodeAt(i);
                    }
                    await wc.fs.writeFile(img.filePath, bytes);
                  } catch (e) {
                    console.error(`Failed to restore image ${img.filePath}`, e);
                  }
                }
              });
            }
          });
        }
      });
    }, [currentChatId]);

    useEffect(() => {
      if (data) {
        const progressList = data.filter(
          (x) => typeof x === 'object' && (x as any).type === 'progress',
        ) as ProgressAnnotation[];
        setProgressAnnotations(progressList);

        const fileWrites = data.filter(
          (x) => typeof x === 'object' && (x as any).type === 'file-write',
        );

        fileWrites.forEach((item: any) => {
          if (!processedFiles.current.has(item.filePath)) {
            processedFiles.current.add(item.filePath);
            import('~/lib/webcontainer').then(({ webcontainer }) => {
              webcontainer.then(async (wc) => {
                try {
                  const pathParts = item.filePath.split('/');
                  if (pathParts.length > 1) {
                    pathParts.pop();
                    const dir = pathParts.join('/');
                    await wc.fs.mkdir(dir, { recursive: true });
                  }

                  const base64Data = item.content;
                  // Remove background
                  const processedBase64 = await removeBackgroundFromBase64(base64Data);

                  const binaryString = atob(processedBase64);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  await wc.fs.writeFile(item.filePath, bytes);
                  console.log(`Successfully wrote generated image to ${item.filePath}`);

                  // Save to indexedDB
                  if (currentChatId) {
                    await saveImageToStore(currentChatId, item.filePath, processedBase64);
                  }
                } catch (e) {
                  console.error(`Failed to write image ${item.filePath}`, e);
                }
              });
            });
          }
        });
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

    const pendingQuestions = React.useMemo(() => {
      if (!messages || messages.length === 0) return [];
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role !== 'assistant') return [];

      const content = lastMessage.content;
      if (!content) return [];

      const regex = /<falborAction\s+[^>]*type="question"[^>]*>([\s\S]*?)<\/falborAction>/g;
      const questions = [];
      let match;
      while ((match = regex.exec(content)) !== null) {
        try {
          let jsonStr = match[1].trim();
          if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
          } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim();
          }
          const data = JSON.parse(jsonStr);
          questions.push(data);
        } catch (e) {
          console.error("Failed to parse question action", e);
        }
      }
      return questions;
    }, [messages]);

    const baseChat = (
      <div
        ref={ref}
        className={classNames(styles.BaseChat, 'relative flex flex-1 min-h-0 h-full w-full overflow-hidden')}
        data-chat-visible={showChat}
      >

        <div className="flex flex-col lg:flex-row overflow-hidden w-full h-full">
          <div className={classNames(styles.Chat, 'flex flex-col flex-grow h-full relative', {
            'lg:min-w-[var(--chat-min-width)]': !isCompact
          })}>
            {!chatStarted && !hideIntro && (
              <div id="intro" className="mt-[23vh] max-w-md mx-auto text-center px-4 lg:px-0">
                <h1 className="text-falbor-elements-textPrimary ml-[-50px] text-5xl lg:text-3xl animate-fade-in flex items-center justify-center gap-2">
                  Don’t just build.
                  <img
                    src="/icons/verified.png"
                    alt="Verified"
                    className="w-8 h-8 inline-block"
                  />
                  first.
                </h1>
              </div>
            )}
            <FeedbackWidget hasMessages={(messages?.length || 0) > 1} />
            <HistoryPanel messages={messages || []} />
            <StickToBottom
              data-scrollable="true"
              className={classNames('pt-2 px-2 relative', {
                'h-full flex flex-col': chatStarted,
              })}
            >
              <StickToBottom.Content className="flex flex-col gap-4 mt-2.5 relative">
                <ClientOnly>
                  {() => {
                    return chatStarted ? (
                      <Messages
                        className="flex flex-col w-full flex-1 max-w-chat pb-4 mx-auto z-1"
                        messages={messages}
                        isStreaming={isStreaming}
                        append={append}
                        chatMode={chatMode}
                        setChatMode={setChatMode}
                        provider={provider}
                        model={model}
                        addToolResult={addToolResult}
                      />
                    ) : null;
                  }}
                </ClientOnly>
                <ScrollToBottom />
              </StickToBottom.Content>
              <div
                className={classNames('my-auto flex flex-col gap-2 w-full max-w-chat mx-auto z-prompt mb-6', {
                  'sticky bottom-2': chatStarted,
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
                  <ChatBox
                    isModelSettingsCollapsed={isModelSettingsCollapsed}
                    setIsModelSettingsCollapsed={setIsModelSettingsCollapsed}
                    provider={provider}
                    setProvider={setProvider}
                    providerList={providerList && providerList.length > 0 ? providerList : (PROVIDER_LIST as ProviderInfo[])}
                    model={model}
                    setModel={setModel}
                    modelList={modelList}
                    apiKeys={apiKeys}
                    isModelLoading={isModelLoading}
                    onApiKeysChange={onApiKeysChange}
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
                    // chatMode={chatMode}
                    setChatMode={setChatMode}
                    designScheme={designScheme}
                    setDesignScheme={setDesignScheme}
                    selectedElement={selectedElement}
                    setSelectedElement={setSelectedElement}
                    cloneUrl={cloneUrl}
                    setCloneUrl={setCloneUrl}
                    onWebSearchResult={onWebSearchResult}
                    pendingQuestions={pendingQuestions}
                  />
                  {!hideSlider && !chatStarted && setChatMode && chatMode && (
                    <div className="flex justify-start mt-3 max-w-chat mx-auto">
                      <Slider
                        selected={chatMode}
                        options={{
                          left: { value: 'build', text: 'MVP', icon: 'i-ph:rocket-launch-duotone' },
                          middle: { value: 'troubleshoot', text: 'Troubleshoot', icon: 'i-ph:wrench-duotone' },
                          right: { value: 'discuss', text: 'Chat', icon: 'i-ph:chats-duotone' },
                          extra: { value: 'idea', text: 'Idea', icon: 'i-ph:lightbulb-duotone' },
                          extra2: { value: 'mvp_research', text: 'MVP & Research', icon: 'i-ph:flask-duotone' },
                        }}
                        setSelected={setChatMode as any}
                      />
                    </div>
                  )}
                  {/* <div
                    className={classNames({
                      'flex flex-col justify-center mb-2 mt-2': !chatStarted,
                      '': chatStarted,
                    })}
                  >
                    {!chatStarted && (
                      <>
                        <div className="flex justify-center gap-2">
                          {ImportButtons(importChat)}
                          <GitCloneButton importChat={importChat} />
                          <Button
                            title="Starter Templates"
                            variant="default"
                            size="default"
                            onClick={() => setShowTemplates(!showTemplates)}
                            className={classNames(
                              'gap-2 bg-falbor-elements-background-depth-1 w-fit rounded-md',
                              'text-[#444444] dark:text-falbor-elements-textPrimary',
                              'border border-falbor-elements-borderColor',
                              'h-10 px-4 py-2 min-w-[120px] justify-center',
                              'transition-all duration-200 ease-in-out font-medium',
                              showTemplates && 'bg-falbor-elements-background-depth-2'
                            )}
                          >
                            <div className="i-ph:files text-lg"></div>
                            Templates
                          </Button>
                          <Button
                            title="Create a Presentation"
                            variant="default"
                            size="default"
                            onClick={() => {
                              workbenchStore.isSlidesMode.set(true);
                              if (textareaRef?.current) {
                                textareaRef.current.focus();
                              }
                            }}
                            className={classNames(
                              'gap-2 bg-falbor-elements-background-depth-1 w-fit rounded-md',
                              'text-[#444444] dark:text-falbor-elements-textPrimary',
                              'border border-falbor-elements-borderColor',
                              'h-10 px-4 py-2 min-w-[120px] justify-center',
                              'transition-all duration-200 ease-in-out font-medium hover:bg-falbor-elements-background-depth-2'
                            )}
                          >
                            <div className="i-ph:presentation-chart text-lg"></div>
                            Slides
                          </Button>
                        </div>
                        {showTemplates && <StarterTemplates />}
                      </>
                    )}
                    <div className="flex flex-col gap-5">
                      {!chatStarted &&
                  ExamplePrompts((event, messageInput) => {
                    if (isStreaming) {
                      handleStop?.();
                      return;
                    }

                    handleSendMessage?.(event, messageInput);
                  })}
                    </div>
                  </div> */}
                </div>
              </div>
            </StickToBottom>
          </div>
          <ClientOnly>
            {() => (
              <Workbench chatStarted={chatStarted} isStreaming={isStreaming} setSelectedElement={setSelectedElement} sendMessage={sendMessage} />
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