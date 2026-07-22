import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';
import { ModelSelector } from '~/components/chat/ModelSelector';
import { APIKeyManager } from './APIKeyManager';
import { LOCAL_PROVIDERS } from '~/lib/stores/settings';
import FilePreview from './FilePreview';
import { ScreenshotStateManager } from './ScreenshotStateManager';
import { SendButton } from './SendButton.client';
import { IconButton } from '~/components/ui/IconButton';
import { toast } from 'react-toastify';
import { SpeechRecognitionButton } from '~/components/chat/SpeechRecognition';
import { useAuth } from '~/hooks/useAuth';
import { SupabaseConnection } from './SupabaseConnection';
import { ExpoQrModal } from '~/components/workbench/ExpoQrModal';
import styles from './BaseChat.module.scss';
import type { ProviderInfo } from '~/types/model';
import { ColorSchemeDialog } from '~/components/ui/ColorSchemeDialog';
import type { DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';
import { McpTools } from './MCPTools';
import { WebSearch } from './WebSearch.client';
import { ScreenRecorderButton } from './ScreenRecorderButton';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { webcontainer } from '~/lib/webcontainer';
import { DesignSystemPanel } from '../design-system/DesignSystemPanel';
import { DesignSystemToolbar } from '../design-system/DesignSystemToolbar';
import { useDesignSystem } from '~/lib/hooks/useDesignSystem';
import { SkillsDialog } from '../skills/SkillsDialog';
import StarterTemplates from './StarterTemplates';
import { ImageGeneratorDialog } from './ImageGeneratorDialog';
import { useSettings } from '~/lib/hooks/useSettings';

interface ChatBoxProps {
  isModelSettingsCollapsed: boolean;
  setIsModelSettingsCollapsed: (collapsed: boolean) => void;
  provider: any;
  providerList: any[];
  modelList: any[];
  apiKeys: Record<string, string>;
  isModelLoading: string | undefined;
  onApiKeysChange: (providerName: string, apiKey: string) => void;
  uploadedFiles: File[];
  imageDataList: string[];
  textareaRef: React.RefObject<HTMLTextAreaElement> | undefined;
  input: string;
  handlePaste: (e: React.ClipboardEvent) => void;
  TEXTAREA_MIN_HEIGHT: number;
  TEXTAREA_MAX_HEIGHT: number;
  isStreaming: boolean;
  handleSendMessage: (event: React.UIEvent, messageInput?: string) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  chatStarted: boolean;
  exportChat?: () => void;
  qrModalOpen: boolean;
  setQrModalOpen: (open: boolean) => void;
  handleFileUpload: () => void;
  setProvider?: ((provider: ProviderInfo) => void) | undefined;
  model?: string | undefined;
  setModel?: ((model: string) => void) | undefined;
  setUploadedFiles?: ((files: File[]) => void) | undefined;
  setImageDataList?: ((dataList: string[]) => void) | undefined;
  handleInputChange?: ((event: React.ChangeEvent<HTMLTextAreaElement>) => void) | undefined;
  handleStop?: (() => void) | undefined;
  enhancingPrompt?: boolean | undefined;
  enhancePrompt?: (() => void) | undefined;
  onWebSearchResult?: (result: string) => void;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  selectedElement?: ElementInfo | null;
  setSelectedElement?: ((element: ElementInfo | null) => void) | undefined;
  cloneUrl?: string | null;
  setCloneUrl?: ((url: string | null) => void) | undefined;
}

export const ChatBox: React.FC<ChatBoxProps> = (props) => {
  const hasFiles = props.uploadedFiles.length > 0;
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const isInspectorMode = useStore(workbenchStore.isInspectorMode);
  const isDesignSystemMode = useStore(workbenchStore.isDesignSystemMode);
  const { user } = useAuth();

  const { handleDesignSystemSave, handleLiveUpdate } = useDesignSystem();
  const [skillsDialogOpen, setSkillsDialogOpen] = React.useState(false);
  const [imageGeneratorOpen, setImageGeneratorOpen] = React.useState(false);
  const [cloneModalOpen, setCloneModalOpen] = React.useState(false);
  const [cloneUrlInput, setCloneUrlInput] = React.useState('');
  const [modelSelectorOpen, setModelSelectorOpen] = React.useState(false);
  const { imageGenerationEnabled } = useSettings();

  const claudeModel = props.modelList.find(m => m.name.toLowerCase().includes('sonnet') && m.provider === 'Anthropic');
  const deepseekModel = props.modelList.find(m => (m.name === 'deepseek-reasoner' || m.name === 'deepseek-chat') && m.provider === 'Deepseek');
  const gptSolModel = props.modelList.find(m => m.name === 'gpt-5.6-sol' && m.provider === 'OpenAI');
  const availableModels = [claudeModel, deepseekModel, gptSolModel].filter(Boolean);
  const selectedModelInfo = availableModels.find(m => m?.name === props.model);

  return (
    <div className="relative w-full max-w-chat mx-auto z-prompt flex flex-col">
      <div>
        <ClientOnly>
          {() => (
            <div className={props.isModelSettingsCollapsed ? 'hidden' : ''}>
              {/* Model selection removed — automatic model selection enforced */}
            </div>
          )}
        </ClientOnly>
      </div>

      <ClientOnly>
        {() => (
          <ScreenshotStateManager
            setUploadedFiles={props.setUploadedFiles}
            setImageDataList={props.setImageDataList}
            uploadedFiles={props.uploadedFiles}
            imageDataList={props.imageDataList}
          />
        )}
      </ClientOnly>

      {props.selectedElement && (
        isDesignSystemMode ? (
          <DesignSystemPanel
            selectedElement={props.selectedElement}
            onClear={() => props.setSelectedElement?.(null)}
            onSave={(changes) => {
              if (handleDesignSystemSave) {
                handleDesignSystemSave(props.selectedElement!, changes).then(() => {
                  props.setSelectedElement?.(null);
                });
              }
            }}
            onLiveUpdate={handleLiveUpdate}
          />
        ) : (
          <div className="flex mx-1.5 gap-2 items-center justify-between rounded-lg rounded-b-none border border-b-none border-falbor-elements-borderColor text-falbor-elements-textPrimary py-1 px-2.5 font-medium text-xs">
            <div className="flex gap-2 items-center lowercase">
              <code className="bg-accent-500 rounded-4px px-1.5 py-1 mr-0.5 text-white">
                {props?.selectedElement?.tagName}
              </code>
              selected for inspection
            </div>
            <button
              className="bg-transparent text-accent-500 pointer-auto"
              onClick={() => props.setSelectedElement?.(null)}
            >
              Clear
            </button>
          </div>
        )
      )}
      <div className={classNames('rounded-lg', { 'p-1.5 bg-[#E3E3E3] dark:bg-transparent': !props.chatStarted })}>
        <div className="relative bg-falbor-elements-background-depth-2 dark:bg-[#141414] backdrop-blur border border-[#BDBDBD] dark:border-[#353538] shadow-md rounded-lg">
          <svg className={classNames(styles.PromptEffectContainer)}>
            <defs>
              <linearGradient
                id="line-gradient"
                x1="20%"
                y1="0%"
                x2="-14%"
                y2="10%"
                gradientUnits="userSpaceOnUse"
                gradientTransform="rotate(-45)"
              >
                <stop offset="0%" className="[stop-color:#000000] dark:[stop-color:#777777]" stopOpacity="0%" />
                <stop offset="40%" className="[stop-color:#000000] dark:[stop-color:#ffffff]" stopOpacity="80%" />
                <stop offset="50%" className="[stop-color:#000000] dark:[stop-color:#9c9c9c]" stopOpacity="80%" />
                <stop offset="100%" className="[stop-color:#000000] dark:[stop-color:#777777]" stopOpacity="0%" />
              </linearGradient>

              <linearGradient id="shine-gradient">
                <stop offset="0%" className="[stop-color:#000000] dark:[stop-color:#ffffff]" stopOpacity="0%" />
                <stop offset="40%" className="[stop-color:#000000] dark:[stop-color:#ffffff]" stopOpacity="80%" />
                <stop offset="50%" className="[stop-color:#000000] dark:[stop-color:#ffffff]" stopOpacity="80%" />
                <stop offset="100%" className="[stop-color:#000000] dark:[stop-color:#ffffff]" stopOpacity="0%" />
              </linearGradient>
            </defs>
            <rect className={classNames(styles.PromptEffectLine)} pathLength="100" strokeLinecap="round"></rect>
            <rect className={classNames(styles.PromptShine)} x="48" y="24" width="70" height="1"></rect>
          </svg>

          {/* File previews — inside the chat box, above the textarea, neat grid */}
          {(hasFiles || props.cloneUrl) && (
            <div className="px-4 pt-3 pb-1">
              <div className="flex flex-wrap gap-2">
                {props.cloneUrl && (
                  <div className="relative group flex items-center gap-2 bg-falbor-elements-background-depth-3 border border-falbor-elements-borderColor rounded-full px-3 py-1.5 shadow-sm pr-6 flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <div className="i-ph:globe text-white text-xs" />
                    </div>
                    <div className="flex flex-col max-w-[200px]">
                      <span className="text-xs font-medium text-falbor-elements-textPrimary truncate">
                        {props.cloneUrl.replace(/^https?:\/\//, '')}
                      </span>
                    </div>
                    <div className="bg-falbor-elements-background-depth-1 px-1.5 py-0.5 rounded text-[10px] text-falbor-elements-textSecondary ml-1 border border-falbor-elements-borderColor">
                      Content & Design
                    </div>
                    <button
                      onClick={() => props.setCloneUrl?.(null)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-falbor-elements-background-depth-2 hover:bg-falbor-elements-background-depth-3 border border-falbor-elements-borderColor text-falbor-elements-textSecondary flex items-center justify-center transition-colors text-[10px] leading-none"
                      title="Remove"
                    >
                      <div className="i-ph:x text-[10px]" />
                    </button>
                  </div>
                )}
                {props.imageDataList.map((dataUrl, index) => (
                  <div key={index} className="relative group w-16 h-16 flex-shrink-0">
                    <img
                      src={dataUrl}
                      alt={props.uploadedFiles[index]?.name ?? `upload-${index}`}
                      className="w-full h-full object-cover rounded-md border border-falbor-elements-borderColor"
                    />
                    <button
                      onClick={() => {
                        props.setUploadedFiles?.(props.uploadedFiles.filter((_, i) => i !== index));
                        props.setImageDataList?.(props.imageDataList.filter((_, i) => i !== index));
                      }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-falbor-elements-background-depth-2 border border-falbor-elements-borderColor text-falbor-elements-textSecondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] leading-none"
                      title="Remove"
                    >
                      <div className="i-ph:x text-[10px]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <textarea
            ref={props.textareaRef}
            className={classNames(
              'w-full pl-4 pt-4 pr-16 outline-none resize-none',
              'text-falbor-elements-textPrimary placeholder-falbor-elements-textTertiary',
              'bg-transparent text-sm',
              'transition-all duration-200',
              'hover:border-falbor-elements-focus',
            )}
            onDragEnter={(e) => e.preventDefault()}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              files.forEach((file) => {
                if (file.type.startsWith('image/')) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const base64Image = e.target?.result as string;
                    props.setUploadedFiles?.([...props.uploadedFiles, file]);
                    props.setImageDataList?.([...props.imageDataList, base64Image]);
                  };
                  reader.readAsDataURL(file);
                }
              });
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                if (event.shiftKey) return;
                event.preventDefault();
                if (!user) return;
                if (props.isStreaming) {
                  props.handleStop?.();
                  return;
                }
                if (event.nativeEvent.isComposing) return;
                props.handleSendMessage?.(event);
              }
            }}
            value={props.input}
            onChange={(event) => props.handleInputChange?.(event)}
            onPaste={props.handlePaste}
            style={{
              minHeight: props.TEXTAREA_MIN_HEIGHT,
              maxHeight: props.TEXTAREA_MAX_HEIGHT,
            }}
            placeholder={
              props.chatMode === 'build'
                ? 'How can Falbor help you today?'
                : 'What would you like to discuss?'
            }
            translate="no"
          />

          <ClientOnly>
            {() => (
              <SendButton
                show={props.input.length > 0 || props.isStreaming || props.uploadedFiles.length > 0 || !!props.cloneUrl}
                isStreaming={props.isStreaming}
                disabled={(!props.providerList || props.providerList.length === 0) || !user}
                onClick={(event) => {
                  if (!user) return;
                  if (props.isStreaming) {
                    props.handleStop?.();
                    return;
                  }
                  if (props.input.length > 0 || props.uploadedFiles.length > 0 || props.cloneUrl) {
                    props.handleSendMessage?.(event);
                  }
                }}
              />
            )}
          </ClientOnly>

          <div className="flex justify-between items-center text-sm p-4 pt-2">
            <div className="flex gap-1 items-center">
              <Popover.Root>
                <Popover.Trigger asChild>
                  <IconButton
                    title="More actions"
                    className="!rounded-full transition-all border border-falbor-elements-borderColor"
                  >
                    <div className="i-ph:plus text-xl" />
                  </IconButton>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    sideOffset={10}
                    side="top"
                    align="start"
                    className="bg-falbor-elements-background-depth-2 text-falbor-elements-item-contentAccent rounded-md border border-falbor-elements-borderColor shadow-lg z-[100] overflow-hidden flex flex-col py-1 w-48"
                  >
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-falbor-elements-background-depth-3 transition-colors text-falbor-elements-textPrimary"
                      onClick={() => setSkillsDialogOpen(true)}
                    >
                      <div className="i-ph:puzzle-piece text-xl text-falbor-elements-textSecondary"></div>
                      <span>Using the skill</span>
                    </button>

                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-falbor-elements-background-depth-3 transition-colors text-falbor-elements-textPrimary"
                      onClick={() => props.handleFileUpload()}
                    >
                      <div className="i-ph:paperclip text-xl text-falbor-elements-textSecondary"></div>
                      <span>Upload file</span>
                    </button>


                    {imageGenerationEnabled && (
                      <button
                        disabled
                        className="cursor-not-allowed flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-falbor-elements-background-depth-3 transition-colors text-falbor-elements-textPrimary"
                        onClick={() => setImageGeneratorOpen(true)}
                      >
                        <div className="i-ph:image text-xl text-falbor-elements-textSecondary"></div>
                        <span>Image generator <span className="text-xs font-mono">(coming soon)</span></span>
                      </button>
                    )}

                    <ColorSchemeDialog designScheme={props.designScheme} setDesignScheme={props.setDesignScheme} asMenuItem={true} />
                    <McpTools asMenuItem={true} />

                    {/* <WebSearch
                      onSearchResult={(result) => props.onWebSearchResult?.(result)}
                      disabled={props.isStreaming}
                      asMenuItem={true}
                    /> */}

                    <ScreenRecorderButton
                      disabled={props.isStreaming}
                      asMenuItem={true}
                      onPromptGenerated={(prompt) => {
                        if (props.handleInputChange) {
                          const syntheticEvent = {
                            target: { value: props.input + (props.input ? '\\n' : '') + prompt }
                          } as React.ChangeEvent<HTMLTextAreaElement>;
                          props.handleInputChange(syntheticEvent);
                        }
                      }}
                    />
                    <button
                      disabled={props.input.length === 0 || props.enhancingPrompt}
                      className={classNames(
                        'flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-falbor-elements-background-depth-3 transition-colors disabled:opacity-50 text-falbor-elements-textPrimary'
                      )}
                      onClick={() => {
                        props.enhancePrompt?.();
                        toast.success('Prompt enhanced!');
                      }}
                    >
                      {props.enhancingPrompt ? (
                        <div className="i-svg-spinners:90-ring-with-bg text-falbor-elements-loader-progress text-xl animate-spin"></div>
                      ) : (
                        <div className="i-falbor:stars text-xl text-falbor-elements-textSecondary"></div>
                      )}
                      <span>Enhance prompt</span>
                    </button>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>

              <SpeechRecognitionButton
                isListening={props.isListening}
                onStart={props.startListening}
                onStop={props.stopListening}
                disabled={props.isStreaming}
              />


              {/* Moved Select Primarch to the right */}

              {props.chatStarted && (
                <IconButton
                  title="Discuss"
                  className={classNames(
                    'transition-all flex items-center gap-1 px-1.5',
                    props.chatMode === 'discuss'
                      ? '!bg-falbor-elements-item-backgroundAccent !text-falbor-elements-item-contentAccent'
                      : 'bg-falbor-elements-item-backgroundDefault text-falbor-elements-item-contentDefault',
                  )}
                  onClick={() => {
                    props.setChatMode?.(props.chatMode === 'discuss' ? 'build' : 'discuss');
                  }}
                >
                  <div className="i-ph:chats text-xl" />
                  {props.chatMode === 'discuss' ? <span>Discuss</span> : <span />}
                </IconButton>
              )}
            </div>

            {props.input.length > 3 ? (
              // <div className="text-xs text-falbor-elements-textTertiary">
              //   Use <kbd className="kdb px-1.5 py-0.5 rounded bg-falbor-elements-background-depth-2">Shift</kbd> +{' '}
              //   <kbd className="kdb px-1.5 py-0.5 rounded bg-falbor-elements-background-depth-2">Return</kbd> a new line
              // </div>
              <div></div>
            ) : null}
            <div className="flex items-center gap-1">
              {availableModels.length > 0 && (
                <Popover.Root open={modelSelectorOpen} onOpenChange={setModelSelectorOpen}>
                  <Popover.Trigger asChild>
                    <IconButton
                      title="Choose model"
                      className={classNames(
                        'transition-all flex items-center gap-1 px-1.5 text-[12px] !bg-[#EEEEEE] !dark:bg-falbor-elements-background-depth-2',
                      )}
                    >
                      {props.model === claudeModel?.name ? (
                        <img src="/icons/claude-color.svg" className="w-4 h-4" alt="Claude" />
                      ) : props.model === deepseekModel?.name ? (
                        <img src="/icons/deepseek-color.svg" className="w-4 h-4" alt="DeepSeek" />
                      ) : props.model?.includes('gpt') ? (
                        <div className="i-ph:open-ai-logo text-sm" />
                      ) : (
                        <div className="i-ph:cpu text-sm" />
                      )}
                      <span>{selectedModelInfo?.label || 'Choose models'}</span>
                      <div className="i-ph:caret-down text-[10px] ml-0.5" />
                    </IconButton>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content
                      sideOffset={8}
                      side="top"
                      align="start"
                      className="bg-falbor-elements-background-depth-2 text-falbor-elements-textPrimary rounded-md border border-falbor-elements-borderColor shadow-lg z-[100] overflow-hidden flex flex-col py-1 w-48"
                    >
                      {availableModels.map((m) => {
                        if (!m) return null;
                        const isClaude = m.name.toLowerCase().includes('sonnet');
                        const isGpt = m.name.toLowerCase().includes('gpt');
                        const displayName = m.label || m.name;
                        const isComingSoon = isClaude || isGpt;
                        return (
                          <button
                            key={m.name}
                            disabled={isComingSoon}
                            className={classNames(
                              'flex items-center justify-between w-full px-3 py-2 text-sm text-left transition-colors',
                              isComingSoon ? 'opacity-50 cursor-not-allowed' : 'hover:bg-falbor-elements-background-depth-3',
                              props.model === m.name ? 'bg-falbor-elements-background-depth-3' : 'text-falbor-elements-textPrimary'
                            )}
                            onClick={() => {
                              if (isComingSoon) return;
                              props.setModel?.(m.name);
                              const targetProvider = props.providerList?.find(p => p.name === m.provider);
                              if (targetProvider) {
                                props.setProvider?.(targetProvider);
                              }
                              setModelSelectorOpen(false);
                            }}
                          >
                            <span className="flex items-center gap-2">
                              {isClaude ? (
                                <img src="/icons/claude-color.svg" className="w-4 h-4" alt="Claude" />
                              ) : isGpt ? (
                                <div className="i-ph:open-ai-logo text-lg" />
                              ) : (
                                <img src="/icons/deepseek-color.svg" className="w-4 h-4" alt="DeepSeek" />
                              )}
                              <span>
                                {displayName}
                                {isComingSoon && <span className="ml-2 text-xs font-mono text-falbor-elements-textSecondary">(coming soon)</span>}
                              </span>
                            </span>
                            {props.model === m.name && <div className="i-ph:check text-sm" />}
                          </button>
                        );
                      })}
                      <div className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-falbor-elements-background-depth-3 transition-colors">
                        more models available soon.
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              )}

              {showWorkbench && (
                <DesignSystemToolbar
                  isInspectorMode={isInspectorMode}
                  isDesignSystemMode={isDesignSystemMode}
                />
              )}
              {/* {typeof process !== 'undefined' && !!process.env.NEXT_PUBLIC_SUPABASE_ORG_ID && (
                <SupabaseConnection />
              )} */}
            </div>
            <ExpoQrModal open={props.qrModalOpen} onClose={() => props.setQrModalOpen(false)} />
            <SkillsDialog open={skillsDialogOpen} onOpenChange={setSkillsDialogOpen} />
            {/* {imageGeneratorOpen && (
              <ImageGeneratorDialog
                isOpen={imageGeneratorOpen}
                onClose={() => setImageGeneratorOpen(false)}
                onGenerate={(dataUrl) => {
                  const blob = dataURLtoBlob(dataUrl);
                  const file = new File([blob], 'generated-image.png', { type: 'image/png' });
                  props.setUploadedFiles?.([...props.uploadedFiles, file]);
                  props.setImageDataList?.([...props.imageDataList, dataUrl]);
                }}
              />
            )} */}

            {cloneModalOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-falbor-elements-background-depth-2 border border-falbor-elements-borderColor rounded-xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                  <h2 className="text-lg font-semibold text-falbor-elements-textPrimary flex items-center gap-2">
                    <div className="i-ph:copy text-xl" />
                    Clone Website
                  </h2>
                  <p className="text-sm text-falbor-elements-textSecondary">
                    Enter the URL of the website you want to clone. Our agent will visit the site, extract its design, and build a replica.
                  </p>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={cloneUrlInput}
                    onChange={(e) => setCloneUrlInput(e.target.value)}
                    className="w-full px-3 py-2 bg-falbor-elements-background-depth-1 border border-falbor-elements-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500/50 text-falbor-elements-textPrimary placeholder-falbor-elements-textTertiary"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (cloneUrlInput.trim()) {
                          props.setCloneUrl?.(cloneUrlInput.trim());
                          if (props.handleInputChange) {
                            props.handleInputChange({ target: { value: 'Build a site like this one' } } as any);
                          }
                          setCloneModalOpen(false);
                          setCloneUrlInput('');
                        }
                      }
                    }}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setCloneModalOpen(false)}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-falbor-elements-textSecondary hover:bg-falbor-elements-background-depth-3 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (cloneUrlInput.trim()) {
                          props.setCloneUrl?.(cloneUrlInput.trim());
                          if (props.handleInputChange) {
                            props.handleInputChange({ target: { value: 'Build a site like this one' } } as any);
                          }
                          setCloneModalOpen(false);
                          setCloneUrlInput('');
                        }
                      }}
                      disabled={!cloneUrlInput.trim()}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-500 text-white hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};