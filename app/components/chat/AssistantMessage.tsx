import { memo, Fragment, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cubicEasingFn } from '~/utils/easings';
import { Markdown } from './Markdown';
import type { JSONValue } from 'ai';
import Popover from '~/components/ui/Popover';
import { workbenchStore } from '~/lib/stores/workbench';
import { WORK_DIR } from '~/utils/constants';
import WithTooltip from '~/components/ui/Tooltip';
import type { Message } from 'ai';
import type { ProviderInfo } from '~/types/model';
import type {
  TextUIPart,
  ReasoningUIPart,
  ToolInvocationUIPart,
  SourceUIPart,
  FileUIPart,
  StepStartUIPart,
} from '@ai-sdk/ui-utils';
import { ToolInvocations } from './ToolInvocations';
import type { ToolCallAnnotation } from '~/types/context';

interface AssistantMessageProps {
  content: string;
  annotations?: JSONValue[];
  messageId?: string;
  onRewind?: (messageId: string) => void;
  onFork?: (messageId: string) => void;
  append?: (message: Message) => void;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  model?: string;
  provider?: ProviderInfo;
  parts:
  | (TextUIPart | ReasoningUIPart | ToolInvocationUIPart | SourceUIPart | FileUIPart | StepStartUIPart)[]
  | undefined;
  addToolResult: ({ toolCallId, result }: { toolCallId: string; result: any }) => void;
}

function openArtifactInWorkbench(filePath: string) {
  filePath = normalizedFilePath(filePath);

  if (workbenchStore.currentView.get() !== 'code') {
    workbenchStore.currentView.set('code');
  }

  workbenchStore.setSelectedFile(`${WORK_DIR}/${filePath}`);
}

function normalizedFilePath(path: string) {
  let normalizedPath = path;

  if (normalizedPath.startsWith(WORK_DIR)) {
    normalizedPath = path.replace(WORK_DIR, '');
  }

  if (normalizedPath.startsWith('/')) {
    normalizedPath = normalizedPath.slice(1);
  }

  return normalizedPath;
}

function parseSkillUsages(content: string) {
  const skills: { name: string, text: string }[] = [];
  let cleanContent = content;

  const regex = /<skill_usage\s+name="([^"]+)">([\s\S]*?)<\/skill_usage>/g;
  let match: RegExpExecArray;
  while ((match = regex.exec(content)!) !== null) {
    skills.push({ name: match[1], text: match[2].trim() });
  }

  const regexSelfClosing = /<skill_usage\s+name="([^"]+)"\s*\/>/g;
  let match2: RegExpExecArray;
  while ((match2 = regexSelfClosing.exec(content)!) !== null) {
    if (!skills.some(s => s.name === match2[1])) {
      skills.push({ name: match2[1], text: "Skill automatically applied" });
    }
  }

  cleanContent = content
    .replace(/<skill_usage\s+name="[^"]+">[\s\S]*?<\/skill_usage>/g, '')
    .replace(/<skill_usage\s+name="[^"]+"\s*\/>/g, '')
    .replace(/^\s+/, '');

  return { skills, cleanContent };
}

function SkillInvocations({ skills }: { skills: { name: string, text: string }[] }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!skills || skills.length === 0) return null;

  return (
    <div className="tool-invocation border border-falbor-elements-borderColor flex flex-col overflow-hidden rounded-lg w-full transition-border duration-150 mb-3 bg-falbor-elements-background-depth-1 mt-2">
      <div className="flex">
        <button
          className="flex items-stretch bg-falbor-elements-background-depth-2 hover:bg-falbor-elements-artifacts-backgroundHover w-full overflow-hidden"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="p-2.5">
            <div className="i-ph:puzzle-piece text-xl text-falbor-elements-textSecondary"></div>
          </div>
          <div className="p-2.5 w-full text-left">
            <div className="w-full text-falbor-elements-textPrimary font-medium leading-5 text-sm">
              {skills.map(s => s.name).join(', ')}
              <span className="w-full text-falbor-elements-textSecondary text-xs mt-0.5 block">
                ({skills.length} skill{skills.length > 1 ? 's' : ''} used)
              </span>
            </div>
          </div>
        </button>
        <AnimatePresence>
          <motion.button
            initial={{ width: 0 }}
            animate={{ width: 'auto' }}
            exit={{ width: 0 }}
            transition={{ duration: 0.15, ease: cubicEasingFn }}
            className="bg-falbor-elements-artifacts-background hover:bg-falbor-elements-artifacts-backgroundHover"
            onClick={() => setShowDetails(!showDetails)}
          >
            <div className="p-2">
              <div
                className={`${showDetails ? 'i-ph:caret-up-bold' : 'i-ph:caret-down-bold'} text-xl text-falbor-elements-textSecondary hover:text-falbor-elements-textPrimary transition-colors`}
              ></div>
            </div>
          </motion.button>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="details"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: '0px' }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-falbor-elements-artifacts-borderColor h-[1px]" />
            <div className="px-3 py-3 text-left bg-falbor-elements-background-depth-2">
              <ul className="list-none space-y-4">
                {skills.map((skill, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: cubicEasingFn }}
                  >
                    <div className="bg-falbor-elements-background-depth-3 rounded-lg p-2">
                      <div className="flex gap-1">
                        <div className="flex flex-col items-center justify-center">
                          <span className="mr-auto font-light font-normal text-md text-falbor-elements-textPrimary rounded-md flex items-center gap-2">
                            <div className="i-ph:check-circle text-lg text-falbor-elements-icon-success"></div>
                            {skill.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-2 ml-auto text-xs text-falbor-elements-textSecondary">
                          Skill read and active
                        </div>
                      </div>
                      {skill.text && (
                        <div className="mt-2 text-xs text-falbor-elements-textSecondary ml-6">
                          <Markdown>{skill.text}</Markdown>
                        </div>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const AssistantMessage = memo(
  ({
    content,
    annotations,
    messageId,
    onRewind,
    onFork,
    append,
    chatMode,
    setChatMode,
    model,
    provider,
    parts,
    addToolResult,
  }: AssistantMessageProps) => {
    const filteredAnnotations = (annotations?.filter(
      (annotation: JSONValue) =>
        annotation && typeof annotation === 'object' && Object.keys(annotation).includes('type'),
    ) || []) as { type: string; value: any } & { [key: string]: any }[];

    let chatSummary: string | undefined = undefined;

    if (filteredAnnotations.find((annotation) => annotation.type === 'chatSummary')) {
      chatSummary = filteredAnnotations.find((annotation) => annotation.type === 'chatSummary')?.summary;
    }

    let codeContext: string[] | undefined = undefined;

    if (filteredAnnotations.find((annotation) => annotation.type === 'codeContext')) {
      codeContext = filteredAnnotations.find((annotation) => annotation.type === 'codeContext')?.files;
    }

    const usage: {
      completionTokens: number;
      promptTokens: number;
      totalTokens: number;
    } = filteredAnnotations.find((annotation) => annotation.type === 'usage')?.value;

    const toolInvocations = parts?.filter((part) => part.type === 'tool-invocation');
    const toolCallAnnotations = filteredAnnotations.filter(
      (annotation) => annotation.type === 'toolCall',
    ) as ToolCallAnnotation[];

    const { skills, cleanContent } = parseSkillUsages(content);

    return (
      <div className="flex flex-col gap-3 items-center w-full">
        {/* <div className="flex flex-row items-start justify-center overflow-hidden shrink-0 self-start">
          <div className="flex w-full items-center justify-between">
            {usage && (
              <div>
                Tokens: {usage.totalTokens} (prompt: {usage.promptTokens}, completion: {usage.completionTokens})
              </div>
            )}
          </div>
        </div> */}
        <div className="relative flex flex-col bg-accent-500/10 dark:bg-[#252525] backdrop-blur-sm px-5 p-3.5 w-full rounded-lg break-words overflow-wrap-anywhere">
          <>
            <div className=" flex gap-2 items-center text-sm text-falbor-elements-textSecondary mb-2">
              {(codeContext || chatSummary) && (
                <Popover side="right" align="start" trigger={<div className="i-ph:info" />}>
                  {chatSummary && (
                    <div className="max-w-chat">
                      <div className="summary max-h-96 flex flex-col">
                        <h2 className="border border-falbor-elements-borderColor rounded-md p4">Summary</h2>
                        <div style={{ zoom: 0.7 }} className="overflow-y-auto m4">
                          <Markdown>{chatSummary}</Markdown>
                        </div>
                      </div>
                      {codeContext && (
                        <div className="code-context flex flex-col p4 border border-falbor-elements-borderColor rounded-md">
                          <h2>Context</h2>
                          <div className="flex gap-4 mt-4 falbor" style={{ zoom: 0.6 }}>
                            {codeContext.map((x) => {
                              const normalized = normalizedFilePath(x);
                              return (
                                <Fragment key={normalized}>
                                  <code
                                    className="bg-falbor-elements-artifacts-inlineCode-background text-falbor-elements-artifacts-inlineCode-text px-1.5 py-1 rounded-md text-falbor-elements-item-contentAccent hover:underline cursor-pointer"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      openArtifactInWorkbench(normalized);
                                    }}
                                  >
                                    {normalized}
                                  </code>
                                </Fragment>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="context"></div>
                </Popover>
              )}
            </div>
          </>
          <SkillInvocations skills={skills} />
          <Markdown append={append} chatMode={chatMode} setChatMode={setChatMode} model={model} provider={provider} html>
            {cleanContent}
          </Markdown>
          {toolInvocations && toolInvocations.length > 0 && (
            <ToolInvocations
              toolInvocations={toolInvocations}
              toolCallAnnotations={toolCallAnnotations}
              addToolResult={addToolResult}
            />
          )}
          {(onRewind || onFork) && messageId && (
            <div className="absolute -bottom-4 right-4 flex gap-1 flex-row justify-end bg-falbor-elements-artifacts-inlineCode-background dark:bg-[#252525] border border-falbor-elements-borderColor rounded-md p-1 shadow-sm z-10">
              {onRewind && (
                <WithTooltip tooltip="Revert to this message">
                  <button
                    onClick={() => onRewind(messageId)}
                    key="i-ph:arrow-u-up-left"
                    className="flex items-center gap-1 p-1 text-falbor-elements-textSecondary hover:text-falbor-elements-textPrimary transition-colors"
                  >
                    <span className="i-ph:arrow-u-up-left text-lg" />
                    <span className="text-sm">Revert</span>
                  </button>
                </WithTooltip>
              )}
              {onFork && (
                <WithTooltip tooltip="Fork chat from this message">
                  <button
                    onClick={() => onFork(messageId)}
                    key="i-ph:git-fork"
                    className="flex items-center gap-1 p-1 text-falbor-elements-textSecondary hover:text-falbor-elements-textPrimary transition-colors"
                  >
                    <span className="i-ph:git-fork text-lg" />
                    <span className="text-sm">Fork</span>
                  </button>
                </WithTooltip>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);