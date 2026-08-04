import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Switch from '@radix-ui/react-switch';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { Dropdown, DropdownItem, DropdownSub, DropdownSubTrigger, DropdownSubContent, DropdownSeparator } from '~/components/ui/Dropdown';
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
import { Tooltip } from '~/components/ui/Tooltip';
import { Badge } from '../ui';
import { MCP_CONNECTORS } from '~/components/@settings/tabs/mcp/connectors';
import { useMCPStore } from '~/lib/stores/mcp';
import Link from 'next/link';

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
  const isSlidesMode = useStore(workbenchStore.isSlidesMode);
  const isGameMode = useStore(workbenchStore.isGameMode);
  const { user } = useAuth();

  const { handleDesignSystemSave, handleLiveUpdate } = useDesignSystem();
  const [skillsDialogOpen, setSkillsDialogOpen] = React.useState(false);
  const [imageGeneratorOpen, setImageGeneratorOpen] = React.useState(false);
  const [cloneModalOpen, setCloneModalOpen] = React.useState(false);
  const [cloneUrlInput, setCloneUrlInput] = React.useState('');
  const [modelSelectorOpen, setModelSelectorOpen] = React.useState(false);
  const { imageGenerationEnabled, applyDesignScheme, setApplyDesignScheme } = useSettings();

  const selectedMCPs = useMCPStore((state) => state.selectedMCPs);
  const toggleSelectedMCP = useMCPStore((state) => state.toggleSelectedMCP);
  const [connections, setConnections] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/mcp/connections', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.connections)) {
          setConnections(data.connections);
        } else if (Array.isArray(data)) {
          setConnections(data);
        } else {
          setConnections([]);
        }
      })
      .catch((err) => console.error('Error fetching connections', err));
  }, []);

  const claudeModel = props.modelList.find(m => m.name.toLowerCase().includes('sonnet') && m.provider === 'Anthropic');
  const haikuModel = props.modelList.find(m => m.name === 'claude-haiku-4-5' && m.provider === 'Anthropic');
  const deepseekModel = props.modelList.find(m => (m.name === 'deepseek-v4-flash' || m.name === 'deepseek-v4-pro' || m.name === 'deepseek-reasoner' || m.name === 'deepseek-chat') && m.provider === 'Deepseek');
  const gptSolModel = props.modelList.find(m => m.name === 'gpt-5.6-sol' && m.provider === 'OpenAI');
  const geminiProModel = props.modelList.find(m => m.name === 'gemini-3.6-pro' && m.provider === 'Google');
  const geminiFlashModel = props.modelList.find(m => m.name === 'gemini-3.6-flash' && m.provider === 'Google');
  const qwenModel = props.modelList.find(m => m.name === 'qwen3.7-flash' && m.provider === 'Qwen');
  const availableModels = [claudeModel, haikuModel, geminiProModel, geminiFlashModel, gptSolModel, deepseekModel, qwenModel].filter(Boolean);
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
      <div className={classNames('rounded-xl relative transition-all duration-300', {
        'p-[1.5px] dark:p-1.5 dark:bg-transparent shadow-sm': !props.chatStarted
      })}>
        {!props.chatStarted && (
          <>
            <div className="absolute inset-0 rounded-xl overflow-hidden dark:hidden pointer-events-none">
              <div className="absolute inset-[-150%] animate-[spin_5s_linear_infinite]"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(168, 85, 247, 1) 75%, rgba(59, 130, 246, 1) 85%, rgba(236, 72, 153, 1) 95%, transparent 100%)'
                }}
              />
            </div>
          </>
        )}
        <div className="relative bg-white dark:bg-[#141414] backdrop-blur border border-[#D6D6D6] dark:border-[#353538] rounded-[10.5px] dark:rounded-lg h-full z-10">
          <svg className={classNames(styles.PromptEffectContainer, "hidden dark:block")}>
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
          {(hasFiles || !!props.cloneUrl) && (
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

          <div className="relative w-full">
            <div
              className={classNames(
                'absolute inset-0 pl-4 pt-4 pr-16',
                'text-sm font-sans whitespace-pre-wrap break-words pointer-events-none',
                'overflow-hidden'
              )}
              aria-hidden="true"
            >
              {(() => {
                if (!props.input) return null;
                const parts = props.input.split(/(@\w+\s?)/g);
                return parts.map((part, i) => {
                  const mcpMatch = part.match(/^@(\w+)(\s?)$/);
                  if (mcpMatch) {
                    const isMcpToken = MCP_CONNECTORS.some(c => c.id === mcpMatch[1]);
                    if (isMcpToken) {
                      return (
                        <span key={i}>
                          <span className="bg-[#0099ff]/20 text-[#0099ff] rounded-[4px] px-1 font-medium">@{mcpMatch[1]}</span>
                          {mcpMatch[2]}
                        </span>
                      );
                    }
                  }
                  return <span key={i} className="text-falbor-elements-textPrimary">{part}</span>;
                });
              })()}
              {props.input.endsWith('\n') ? <br /> : null}
            </div>

            <textarea
              ref={props.textareaRef}
              className={classNames(
                'relative w-full pl-4 pt-4 pr-16 outline-none resize-none font-sans',
                'placeholder-falbor-elements-textTertiary',
                'bg-transparent text-transparent caret-falbor-elements-textPrimary text-sm',
                'transition-all duration-200',
                'border-none focus:border-none focus:outline-none focus:ring-0',
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
                if (event.key === 'Backspace') {
                  const textarea = event.currentTarget;
                  const cursorPosition = textarea.selectionStart;
                  const textBefore = props.input.substring(0, cursorPosition);
                  // Regex matches an MCP token at the end of the current cursor position
                  const mcpMatch = textBefore.match(/@(\w+)\s?$/);
                  if (mcpMatch) {
                    const connectorId = mcpMatch[1];
                    const isMcpToken = MCP_CONNECTORS.some(c => c.id === connectorId);
                    if (isMcpToken) {
                      event.preventDefault();
                      const textAfter = props.input.substring(cursorPosition);
                      const newValue = textBefore.substring(0, cursorPosition - mcpMatch[0].length) + textAfter;
                      if (props.handleInputChange) {
                        props.handleInputChange({ target: { value: newValue } } as any);
                      }
                      setTimeout(() => {
                        textarea.focus();
                        textarea.setSelectionRange(cursorPosition - mcpMatch[0].length, cursorPosition - mcpMatch[0].length);
                      }, 0);
                      return;
                    }
                  }
                }

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
              onChange={(event) => {
                props.handleInputChange?.(event);
              }}
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
          </div>

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
              <Dropdown
                sideOffset={10}
                align="start"
                trigger={
                  <IconButton
                    title="More actions"
                    className="!rounded-full transition-all border border-falbor-elements-borderColor"
                  >
                    <div className="i-ph:plus text-xl" />
                  </IconButton>
                }
              >
                <DropdownItem onSelect={() => setSkillsDialogOpen(true)}>
                  <div className="i-ph:puzzle-piece text-xl text-falbor-elements-textSecondary"></div>
                  <span>Using the skill</span>
                </DropdownItem>

                <DropdownItem onSelect={() => props.handleFileUpload()}>
                  <div className="i-ph:paperclip text-xl text-falbor-elements-textSecondary"></div>
                  <span>Upload file</span>
                </DropdownItem>

                {imageGenerationEnabled && (
                  <DropdownItem
                    className="cursor-not-allowed opacity-50"
                  >
                    <div className="i-ph:image text-xl text-falbor-elements-textSecondary"></div>
                    <span>Image generator <span className="text-xs font-mono">(coming soon)</span></span>
                  </DropdownItem>
                )}
                {/* 
                <div className="relative flex items-center gap-2 px-1.5 py-1 rounded-md text-sm text-falbor-elements-textPrimary hover:bg-[#E3E3E3] dark:hover:bg-[#2A2A2A] cursor-pointer w-full">
                  <div className="flex-1">
                    <ColorSchemeDialog designScheme={props.designScheme} setDesignScheme={props.setDesignScheme} asMenuItem={true} />
                  </div>
                  <div className="absolute right-3 flex items-center h-full pointer-events-auto">
                    <Switch.Root
                      checked={applyDesignScheme}
                      onCheckedChange={setApplyDesignScheme}
                      className="w-8 h-4 bg-falbor-elements-background-depth-4 border border-falbor-elements-borderColor rounded-full relative shadow-inner focus:outline-none data-[state=checked]:bg-green-500 data-[state=checked]:border-green-600 transition-colors"
                    >
                      <Switch.Thumb className="block w-3 h-3 bg-white rounded-full transition-transform transform translate-x-0.5 data-[state=checked]:translate-x-4.5 shadow-sm" />
                    </Switch.Root>
                  </div>
                </div> */}

                <DropdownSub>
                  <DropdownSubTrigger>
                    <div className="i-ph:graph text-xl text-falbor-elements-textSecondary"></div>
                    <span>Connectors</span>
                  </DropdownSubTrigger>
                  <DropdownSubContent className="w-64 max-h-[300px] overflow-y-auto z-[1000]">
                    {MCP_CONNECTORS.filter(c => c.id !== 'custom').map((connector) => {
                      const hasDbConnection = Array.isArray(connections) && connections.some((c) => c.connectorId === connector.id || c.connector_id === connector.id);
                      const hasLocalConnection = Object.keys(useMCPStore.getState().settings?.mcpConfig?.mcpServers || {}).some(key => key.startsWith(`${connector.id}-`));
                      const isConnected = hasDbConnection || hasLocalConnection;
                      const isSelected = selectedMCPs.includes(connector.id);

                      return (
                        <div key={connector.id} className="relative group w-full">
                          <button
                            onClick={() => {
                              if (isConnected) {
                                if (!isSelected) {
                                  toggleSelectedMCP(connector.id);
                                }
                                const textarea = props.textareaRef?.current;
                                if (textarea && props.handleInputChange) {
                                  const cursorPosition = textarea.selectionStart;
                                  const textBefore = props.input.substring(0, cursorPosition);
                                  const textAfter = props.input.substring(cursorPosition);
                                  const token = `@${connector.id} `;
                                  const newValue = textBefore + token + textAfter;
                                  props.handleInputChange({ target: { value: newValue } } as any);
                                  setTimeout(() => {
                                    textarea.focus();
                                    textarea.setSelectionRange(cursorPosition + token.length, cursorPosition + token.length);
                                  }, 10);
                                }
                              }
                            }}
                            disabled={!isConnected}
                            className={classNames(
                              'flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm transition-colors text-left',
                              isConnected
                                ? 'text-falbor-elements-textPrimary hover:bg-falbor-elements-background-depth-3 cursor-pointer'
                                : 'text-falbor-elements-textTertiary opacity-60 cursor-not-allowed',
                              isSelected && 'bg-falbor-elements-background-depth-3'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <img src={connector.logo} className="w-5 h-5 object-contain" alt={connector.name} />
                              <span>{connector.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {isSelected && <div className="i-ph:check text-accent-500 text-sm" />}
                              {!isConnected && (
                                <div className="i-ph:warning-circle text-orange-500 text-sm opacity-80" />
                              )}
                            </div>
                          </button>

                          {!isConnected && (
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-falbor-elements-background-depth-4 text-falbor-elements-textPrimary text-xs rounded border border-falbor-elements-borderColor shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                              Needs to be connected in settings
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <DropdownSeparator />
                    <McpTools asMenuItem={true} />
                  </DropdownSubContent>
                </DropdownSub>

                {/* <WebSearch
                  onSearchResult={(result) => props.onWebSearchResult?.(result)}
                  disabled={props.isStreaming}
                  asMenuItem={true}
                /> */}

                {/* <ScreenRecorderButton
                  disabled={props.isStreaming}
                  asMenuItem={true}
                  onPromptGenerated={(prompt) => {
                    if (props.handleInputChange) {
                      const syntheticEvent = {
                        target: { value: props.input + (props.input ? '\n' : '') + prompt }
                      } as React.ChangeEvent<HTMLTextAreaElement>;
                      props.handleInputChange(syntheticEvent);
                    }
                  }}
                /> */}

                <DropdownItem
                  className={classNames(props.input.length === 0 || props.enhancingPrompt ? 'opacity-50' : '')}
                  onSelect={(e) => {
                    if (props.input.length === 0 || props.enhancingPrompt) {
                      e.preventDefault();
                      return;
                    }
                    e.preventDefault();
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
                </DropdownItem>
              </Dropdown>

              <SpeechRecognitionButton
                isListening={props.isListening}
                onStart={props.startListening}
                onStop={props.stopListening}
                disabled={props.isStreaming}
              />

              {isSlidesMode && (
                <IconButton
                  title="Disable Slides Mode"
                  className="transition-all flex items-center gap-1 px-1.5 !bg-falbor-elements-item-backgroundAccent !text-falbor-elements-item-contentAccent"
                  onClick={() => {
                    workbenchStore.isSlidesMode.set(false);
                  }}
                >
                  <div className="i-ph:presentation-chart text-xl" />
                  <span>Slides</span>
                </IconButton>
              )}

              {isGameMode && (
                <IconButton
                  title="Disable 2D Game Mode"
                  className="transition-all flex items-center gap-1 px-1.5 !bg-falbor-elements-item-backgroundAccent !text-falbor-elements-item-contentAccent"
                  onClick={() => {
                    workbenchStore.isGameMode.set(false);
                  }}
                >
                  <div className="i-ph:game-controller text-xl" />
                  <span>2D Game</span>
                </IconButton>
              )}

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
              {showWorkbench && (
                <DesignSystemToolbar
                  isInspectorMode={isInspectorMode}
                  isDesignSystemMode={isDesignSystemMode}
                />
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
                <Dropdown
                  sideOffset={8}
                  align="start"
                  className="w-56"
                  trigger={
                    <IconButton
                      title="Choose model"
                      className={classNames(
                        'transition-all flex items-center gap-1 px-1.5 text-[12px] !bg-[#EEEEEE] !dark:bg-falbor-elements-background-depth-2',
                      )}
                    >
                      {props.model?.includes('claude') ? (
                        <>
                          <img src="/icons/models/claude-light.svg" className="w-4 h-4 dark:hidden" alt="Claude" />
                          <img src="/icons/models/claude-dark.svg" className="w-4 h-4 hidden dark:block" alt="Claude" />
                        </>
                      ) : props.model === deepseekModel?.name ? (
                        <>
                          <img src="/icons/models/deepseek-light.svg" className="w-4 h-4 dark:hidden" alt="DeepSeek" />
                          <img src="/icons/models/deepseek-dark.svg" className="w-4 h-4 hidden dark:block" alt="DeepSeek" />
                        </>
                      ) : props.model?.includes('gpt') ? (
                        <>
                          <img src="/icons/models/chatGPT-light.svg" className="w-3.5 h-3.5 dark:hidden" alt="ChatGPT" />
                          <img src="/icons/models/chatGPT-dark.svg" className="w-3.5 h-3.5 hidden dark:block" alt="ChatGPT" />
                        </>
                      ) : props.model?.includes('gemini') ? (
                        <>
                          <img src="/icons/models/Gemini-light.svg" className="w-4 h-4 dark:hidden" alt="Gemini" />
                          <img src="/icons/models/Gemini-dark.svg" className="w-4 h-4 hidden dark:block" alt="Gemini" />
                        </>
                      ) : props.model?.includes('qwen') ? (
                        <>
                          <img src="/icons/models/qwen-light.svg" className="w-4 h-4 dark:hidden" alt="Qwen" />
                          <img src="/icons/models/qwen-dark.svg" className="w-4 h-4 hidden dark:block" alt="Qwen" />
                        </>
                      ) : (
                        <div className="i-ph:cpu text-sm" />
                      )}
                      <span className="dark:text-white text-[#27251E]">{selectedModelInfo?.label || 'Choose models'}</span>
                      <div className="i-ph:caret-down text-[10px] ml-0.5" />
                    </IconButton>
                  }
                >
                  {availableModels.map((m) => {
                    if (!m) return null;
                    const isClaude = m.name.toLowerCase().includes('sonnet') || m.name.toLowerCase().includes('haiku');
                    const isGpt = m.name.toLowerCase().includes('gpt');
                    const isGemini = m.name.toLowerCase().includes('gemini');
                    const isDeepSeek = m.name.toLowerCase().includes('deepseek');
                    const isQwen = m.name.toLowerCase().includes('qwen');
                    let displayName = (m.label || m.name).replace(/\s\([^)]+\scontext\)/i, '');

                    let vision = "Supports images";
                    let bestFor = "General tasks";
                    let speed = "Normal";
                    let price = "$$";
                    let providerName = "Unknown";
                    let modelIcon = "Default";

                    if (isDeepSeek) {
                      vision = "No images";
                      bestFor = "Coding & Logic";
                      speed = "Fast";
                      price = "$ (Cheapest)";
                      providerName = "DeepSeek";
                      modelIcon = "deepseek-color";
                    } else if (isClaude) {
                      bestFor = "Maximum intelligence for complex work";
                      speed = "Heavy";
                      price = "$$$ (Expensive)";
                      providerName = "Anthropic";
                      modelIcon = "claude-color";
                    } else if (isGpt) {
                      bestFor = "Maximum intelligence for complex work";
                      speed = "Heavy";
                      price = "$$$ (Expensive)";
                      providerName = "OpenAI";
                      modelIcon = "OpenAI";
                    } else if (isGemini) {
                      bestFor = "Speed & Efficiency";
                      speed = "Fastest";
                      price = "$$ (Medium)";
                      providerName = "Google";
                      modelIcon = "gemini";
                    } else if (isQwen) {
                      bestFor = "Lightweight efficiency";
                      speed = "Fast";
                      price = "$ (Cheapest)";
                      providerName = "Qwen";
                      modelIcon = "Default";
                    }

                    return (
                      <DropdownItem
                        key={m.name}
                        className="group overflow-visible"
                        active={props.model === m.name}
                        onSelect={() => {
                          props.setModel?.(m.name);
                          const targetProvider = props.providerList?.find(p => p.name === m.provider);
                          if (targetProvider) {
                            props.setProvider?.(targetProvider);
                          }
                        }}
                      >
                        <span className="flex items-center gap-2 flex-1">
                          {isClaude ? (
                            <>
                              <img src="/icons/models/claude-light.svg" className="w-4 h-4 dark:hidden" alt="Claude" />
                              <img src="/icons/models/claude-dark.svg" className="w-4 h-4 hidden dark:block" alt="Claude" />
                            </>
                          ) : isGpt ? (
                            <>
                              <img src="/icons/models/chatGPT-light.svg" className="w-4 h-4 dark:hidden" alt="ChatGPT" />
                              <img src="/icons/models/chatGPT-dark.svg" className="w-4 h-4 hidden dark:block scale-[1.2]" alt="ChatGPT" />
                            </>
                          ) : isGemini ? (
                            <>
                              <img src="/icons/models/Gemini-light.svg" className="w-4 h-4 dark:hidden" alt="Gemini" />
                              <img src="/icons/models/Gemini-dark.svg" className="w-4 h-4 hidden dark:block" alt="Gemini" />
                            </>
                          ) : isQwen ? (
                            <>
                              <img src="/icons/models/qwen-light.svg" className="w-4 h-4 dark:hidden" alt="Qwen" />
                              <img src="/icons/models/qwen-dark.svg" className="w-4 h-4 hidden dark:block" alt="Qwen" />
                            </>
                          ) : (
                            <>
                              <img src="/icons/models/deepseek-light.svg" className="w-4 h-4 dark:hidden" alt="DeepSeek" />
                              <img src="/icons/models/deepseek-dark.svg" className="w-4 h-4 hidden dark:block" alt="DeepSeek" />
                            </>
                          )}
                          <span className="flex items-center gap-2">
                            {displayName}
                            {(m.name === 'claude-haiku-4-5' || m.name === 'gpt-5.6-sol' || m.name === 'gemini-3.6-pro') && (
                              <Badge size="sm" variant="destructive" className='!rounded-md'>
                                New
                              </Badge>
                            )}
                          </span>
                        </span>
                        {props.model === m.name && <div className="i-ph:check text-sm text-falbor-elements-textPrimary" />}

                        <div className="absolute left-[calc(100%+8px)] top-0 hidden group-hover:flex flex-col w-[260px] p-3 rounded-xl bg-white dark:bg-[#1C1C1E] border border-[#E5E5E5] dark:border-[#2C2C2E] shadow-xl z-[1001] animate-in fade-in zoom-in-95 cursor-default">
                          <div className="text-[13px] font-medium text-[#11181C] dark:text-[#EDEDED] leading-snug">{bestFor}</div>
                          <div className="flex items-center gap-1.5 mt-2 text-[12px] text-[#687076] dark:text-[#A0A0AB]">
                            <img src={`/icons/${modelIcon}.svg`} className="w-3.5 h-3.5" alt={providerName} />
                            <span>Powered by {displayName}</span>
                          </div>

                          <div className="h-px w-full bg-[#E5E5E5] dark:bg-[#2C2C2E] my-3" />

                          <div className="flex flex-col gap-1.5">
                            <div className="text-[12px] text-[#687076] dark:text-[#A0A0AB] flex justify-between"><span>Vision:</span> <span className={vision.includes('No') ? 'text-red-500/80' : 'text-green-500/80'}>{vision}</span></div>
                            <div className="text-[12px] text-[#687076] dark:text-[#A0A0AB] flex justify-between"><span>Speed:</span> <span className="text-[#11181C] dark:text-[#EDEDED]">{speed}</span></div>
                            <div className="text-[12px] text-[#687076] dark:text-[#A0A0AB] flex justify-between"><span>Cost:</span> <span className="text-[#11181C] dark:text-[#EDEDED]">{price}</span></div>
                          </div>
                        </div>
                      </DropdownItem>
                    );
                  })}
                  <div className='p-1 mt-1'>
                    <div className="border border-[#D6D6D6] dark:border-[#353538] rounded-md flex flex-col items-start w-full px-2 py-2 text-[10px] text-left gap-1">
                      <span className="flex items-center text-xs text-falbor-elements-textPrimary font-medium">
                        <div className="i-ph:info mr-1 w-4 h-4 text-falbor-elements-textSecondary" />
                        more models available soon.
                        <Link className='text-[#0099ff]' target="_blank" href="/docs/models">Learn more</Link>
                      </span>
                    </div>
                  </div>
                </Dropdown>
              )}

              {/* {typeof process !== 'undefined' && !!process.env.NEXT_PUBLIC_SUPABASE_ORG_ID && ( */}
              <SupabaseConnection />
              {/* )} */}
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