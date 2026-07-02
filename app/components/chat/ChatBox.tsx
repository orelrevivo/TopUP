import React from 'react';
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
}

export const ChatBox: React.FC<ChatBoxProps> = (props) => {
  const hasFiles = props.uploadedFiles.length > 0;

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
      )}

      <div className="relative bg-falbor-elements-background-depth-2 backdrop-blur shadow-xs border border-falbor-elements-borderColor rounded-lg">
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
              <stop offset="0%" stopColor="#B12B06" stopOpacity="0%"></stop>
              <stop offset="40%" stopColor="#B12B06" stopOpacity="80%"></stop>
              <stop offset="50%" stopColor="#B12B06" stopOpacity="80%"></stop>
              <stop offset="100%" stopColor="#B12B06" stopOpacity="0%"></stop>
            </linearGradient>
            <linearGradient id="shine-gradient">
              <stop offset="0%" stopColor="white" stopOpacity="0%"></stop>
              <stop offset="40%" stopColor="#ffffff" stopOpacity="80%"></stop>
              <stop offset="50%" stopColor="#ffffff" stopOpacity="80%"></stop>
              <stop offset="100%" stopColor="white" stopOpacity="0%"></stop>
            </linearGradient>
          </defs>
          <rect className={classNames(styles.PromptEffectLine)} pathLength="100" strokeLinecap="round"></rect>
          <rect className={classNames(styles.PromptShine)} x="48" y="24" width="70" height="1"></rect>
        </svg>

        {/* File previews — inside the chat box, above the textarea, neat grid */}
        {hasFiles && (
          <div className="px-4 pt-3 pb-1">
            <div className="flex flex-wrap gap-2">
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
              show={props.input.length > 0 || props.isStreaming || props.uploadedFiles.length > 0}
              isStreaming={props.isStreaming}
              disabled={!props.providerList || props.providerList.length === 0}
              onClick={(event) => {
                if (props.isStreaming) {
                  props.handleStop?.();
                  return;
                }
                if (props.input.length > 0 || props.uploadedFiles.length > 0) {
                  props.handleSendMessage?.(event);
                }
              }}
            />
          )}
        </ClientOnly>

        <div className="flex justify-between items-center text-sm p-4 pt-2">
          <div className="flex gap-1 items-center">
            <IconButton title="Upload file" className="transition-all" onClick={() => props.handleFileUpload()}>
              <div className="i-ph:paperclip text-xl"></div>
            </IconButton>
            <ColorSchemeDialog designScheme={props.designScheme} setDesignScheme={props.setDesignScheme} />
            <McpTools />
            <WebSearch
              onSearchResult={(result) => props.onWebSearchResult?.(result)}
              disabled={props.isStreaming}
            />
            <IconButton
              title="Enhance prompt"
              disabled={props.input.length === 0 || props.enhancingPrompt}
              className={classNames('transition-all', props.enhancingPrompt ? 'opacity-100' : '')}
              onClick={() => {
                props.enhancePrompt?.();
                toast.success('Prompt enhanced!');
              }}
            >
              {props.enhancingPrompt ? (
                <div className="i-svg-spinners:90-ring-with-bg text-falbor-elements-loader-progress text-xl animate-spin"></div>
              ) : (
                <div className="i-falbor:stars text-xl"></div>
              )}
            </IconButton>

            <ScreenRecorderButton
              disabled={props.isStreaming}
              onPromptGenerated={(prompt) => {
                if (props.handleInputChange) {
                  const syntheticEvent = {
                    target: { value: props.input + (props.input ? '\\n' : '') + prompt }
                  } as React.ChangeEvent<HTMLTextAreaElement>;
                  props.handleInputChange(syntheticEvent);
                }
              }}
            />

            <SpeechRecognitionButton
              isListening={props.isListening}
              onStart={props.startListening}
              onStop={props.stopListening}
              disabled={props.isStreaming}
            />

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
            <div className="text-xs text-falbor-elements-textTertiary">
              Use <kbd className="kdb px-1.5 py-0.5 rounded bg-falbor-elements-background-depth-2">Shift</kbd> +{' '}
              <kbd className="kdb px-1.5 py-0.5 rounded bg-falbor-elements-background-depth-2">Return</kbd> a new line
            </div>
          ) : null}

          {typeof process !== 'undefined' && !!process.env.NEXT_PUBLIC_SUPABASE_ORG_ID && (
            <SupabaseConnection />
          )}
          <ExpoQrModal open={props.qrModalOpen} onClose={() => props.setQrModalOpen(false)} />
        </div>
      </div>
    </div>
  );
};