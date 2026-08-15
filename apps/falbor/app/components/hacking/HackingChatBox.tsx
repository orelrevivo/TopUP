import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ClientOnly } from '~/components/ui/ClientOnly';
import { classNames } from '~/utils/classNames';
import { SendButton } from './SendButton.client';
import { IconButton } from '~/components/ui/IconButton';
import { toast } from 'react-toastify';
import { SpeechRecognitionButton } from '~/components/chat/SpeechRecognition';
import { ScreenshotStateManager } from '~/components/chat/ScreenshotStateManager';
import styles from '~/components/chat/BaseChat.module.scss';
import { SkillsDialog } from '~/components/skills/SkillsDialog';
import { workbenchStore } from '~/lib/stores/workbench';

interface HackingChatBoxProps {
  isModelSettingsCollapsed: boolean;
  setIsModelSettingsCollapsed: (collapsed: boolean) => void;
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
  handleFileUpload: () => void;
  setUploadedFiles?: ((files: File[]) => void) | undefined;
  setImageDataList?: ((dataList: string[]) => void) | undefined;
  handleInputChange?: ((event: React.ChangeEvent<HTMLTextAreaElement>) => void) | undefined;
  handleStop?: (() => void) | undefined;
  enhancingPrompt?: boolean | undefined;
  enhancePrompt?: (() => void) | undefined;
  exportChat?: () => void;
  qrModalOpen?: boolean;
  setQrModalOpen?: (open: boolean) => void;
  chatMode?: 'discuss' | 'build' | 'troubleshoot' | 'idea';
  setChatMode?: (mode: 'discuss' | 'build' | 'troubleshoot' | 'idea') => void;
  designScheme?: any;
  setDesignScheme?: (scheme: any) => void;
  selectedElement?: any;
  setSelectedElement?: (element: any) => void;
  cloneUrl?: string | null;
  setCloneUrl?: (url: string | null) => void;
  onWebSearchResult?: (result: string) => void;
}

export const ENABLE_SENDING = true; // Toggle this to true to enable sending for everyone

export const HackingChatBox: React.FC<HackingChatBoxProps> = (props) => {
  const hasFiles = props.uploadedFiles.length > 0;
  const [skillsDialogOpen, setSkillsDialogOpen] = React.useState(false);

  return (
    <div className="relative w-full max-w-chat mx-auto z-prompt flex flex-col">
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

      {/* Outer wrapper */}
      <div className={classNames('rounded-xl transition-all', {
        'p-2': !props.chatStarted,
        'p-1.5 bg-[#E3E3E3] dark:bg-[#171717]': props.chatStarted
      })}>
        <div className={classNames("relative transition-all rounded-xl", {
          "bg-white border border-[#E5E5E5] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-[#111114] dark:border-[#222222]": !props.chatStarted,
          "bg-falbor-elements-background-depth-2 dark:bg-[#141414] backdrop-blur border border-[#BDBDBD] dark:border-[#353538] shadow-md": props.chatStarted
        })}>
          {props.chatStarted && (
            <svg className={classNames(styles.PromptEffectContainer)}>
              <defs>
                <linearGradient
                  id="hacking-line-gradient"
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
                <linearGradient id="hacking-shine-gradient">
                  <stop offset="0%" stopColor="white" stopOpacity="0%"></stop>
                  <stop offset="40%" stopColor="#ffffff" stopOpacity="80%"></stop>
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="80%"></stop>
                  <stop offset="100%" stopColor="white" stopOpacity="0%"></stop>
                </linearGradient>
              </defs>
              <rect className={classNames(styles.PromptEffectLine)} pathLength="100" strokeLinecap="round"></rect>
              <rect className={classNames(styles.PromptShine)} x="48" y="24" width="70" height="1"></rect>
            </svg>
          )}

          {/* File previews */}
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

          {/* Textarea — identical to original ChatBox */}
          <textarea
            ref={props.textareaRef}
            className={classNames(
              'w-full pl-4 pt-4 pr-16 resize-none',
              'text-falbor-elements-textPrimary placeholder-falbor-elements-textTertiary',
              'bg-transparent text-sm',
              'transition-all duration-200',
              'border-none focus:border-transparent focus:ring-0 focus:outline-none !outline-none !ring-0 !shadow-none',
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

                if (!ENABLE_SENDING) {
                  return;
                }

                if (props.input.trim().length > 0 || hasFiles) {
                  props.handleSendMessage?.(event);
                }
              }
            }}
            value={props.input}
            onChange={(event) => props.handleInputChange?.(event)}
            onPaste={props.handlePaste}
            style={{
              minHeight: props.TEXTAREA_MIN_HEIGHT,
              maxHeight: props.TEXTAREA_MAX_HEIGHT,
            }}
            placeholder={props.chatStarted ? "How can Falbor help you today?" : "Give your Security agent a task to do..."}
            translate="no"
          />

          {/* Send button */}
          <ClientOnly>
            {() => (
              <SendButton
                show={props.input.length > 0 || props.isStreaming || hasFiles}
                isStreaming={props.isStreaming}
                disabled={!props.input.length && !hasFiles}
                isLimited={!ENABLE_SENDING}
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

          {/* Bottom toolbar — identical layout to original ChatBox */}
          <div className="flex justify-between items-center text-sm p-4 pt-2">
            <div className="flex gap-1 items-center">
              {/* + More actions popover */}
              <Popover.Root>
                <Popover.Trigger asChild>
                  <IconButton
                    title="More actions"
                    className="!rounded-full transition-all border border-transparent hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <div className="i-ph:plus-bold text-xl text-black dark:text-white" />
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

              {/* Speech recognition */}
              <SpeechRecognitionButton
                isListening={props.isListening}
                onStart={props.startListening}
                onStop={props.stopListening}
                disabled={props.isStreaming}
              />

              {/* Live Browser Toggle - ONLY show if chat has started */}
              {props.chatStarted && (
                <IconButton
                  title="Live Browser View"
                  className="transition-all"
                  onClick={() => {
                    workbenchStore.currentView.set('browser');
                    workbenchStore.showWorkbench.set(true);
                  }}
                >
                  <div className="i-ph:globe-hemisphere-west text-xl text-falbor-elements-textSecondary hover:text-falbor-elements-textPrimary" />
                </IconButton>
              )}
            </div>

            {/* Shift+Enter hint */}
            {props.input.length > 3 ? (
              <div className="text-xs text-falbor-elements-textTertiary">
                Use <kbd className="kdb px-1.5 py-0.5 rounded bg-falbor-elements-background-depth-2">Shift</kbd> +{' '}
                <kbd className="kdb px-1.5 py-0.5 rounded bg-falbor-elements-background-depth-2">Return</kbd> a new line
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <SkillsDialog open={skillsDialogOpen} onOpenChange={setSkillsDialogOpen} />
    </div>
  );
};
