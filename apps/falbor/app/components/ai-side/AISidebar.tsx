'use client';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useStore } from '@nanostores/react';
import {
  IoAdd,
  IoTrashOutline,
  IoExpandOutline,
  IoClose,
  IoSparkles,
  IoStopCircle,
  IoPaperPlane,
  IoEllipsisVertical,
  IoChatboxOutline,
  IoCheckmark,
  IoLinkOutline,
  IoLogoWhatsapp,
  IoSettingsOutline,
  IoPersonCircleOutline,
} from 'react-icons/io5';
import { aiSidebarStore, AIEvent } from '~/lib/stores/aiSidebar';
import { sendAgentMessage, stopAgent } from '~/lib/actions/agentChat';
import { WorkspaceSettingsModal } from '~/components/workspace/workspace-settings/WorkspaceSettingsModal';
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
} from '~/components/ui/Dropdown';
import { TelegramConnectModal } from './TelegramConnectModal';
import { TextShimmer } from '~/components/ui/text-shimmer';

import { AgentMessages } from './AgentMessages';
import { AgentChatInput } from './AgentChatInput';
import { Badge } from '../ui';

const HeaderControls = () => {
  const workspaceId = useStore(aiSidebarStore.currentWorkspaceId);
  const currentSessionId = useStore(aiSidebarStore.currentSessionId);
  const currentSessionTitle = useStore(aiSidebarStore.currentSessionTitle);
  const currentAgent = useStore(aiSidebarStore.currentAgent);

  const [sessions, setSessions] = useState<Array<{ id: string; title: string; createdAt: Date }>>([]);
  const [agents, setAgents] = useState<Array<any>>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      import('~/lib/actions/agentSession').then(({ getAgentSessionsList }) => {
        getAgentSessionsList(workspaceId).then(setSessions);
      });
      import('~/lib/actions/agent').then(({ getAgentsList }) => {
        getAgentsList(workspaceId).then(setAgents);
      });
    }
  }, [workspaceId, currentSessionId]);

  const handleCreateNewChat = async () => {
    if (!workspaceId) return;
    try {
      const { createNewAgentSession, getAgentSessionsList } = await import('~/lib/actions/agentSession');
      const newSession = await createNewAgentSession(workspaceId);
      if (newSession) {
        aiSidebarStore.setSession(newSession.id, newSession.title, []);
        const list = await getAgentSessionsList(workspaceId);
        setSessions(list);
      }
    } catch (err) {
      console.error('Failed to create new session:', err);
    }
  };

  const handleSelectSession = async (sessionId: string, sessionTitle: string) => {
    if (sessionId === currentSessionId || !workspaceId) return;
    aiSidebarStore.setSession(sessionId, sessionTitle, []);
    try {
      const { getAgentSessionEvents } = await import('~/lib/actions/agentSession');
      const res = await getAgentSessionEvents(workspaceId, sessionId);
      const evs = Array.isArray(res) ? res : res?.events || [];
      aiSidebarStore.setSession(sessionId, sessionTitle, evs);
    } catch (err) {
      console.error('Failed to load session events:', err);
    }
  };

  const handleStartRename = () => {
    setTitleInput(currentSessionTitle || 'Onboarding');
    setIsEditing(true);
  };

  const handleSaveRename = async () => {
    if (!currentSessionId || !titleInput.trim()) {
      setIsEditing(false);
      return;
    }
    const newTitle = titleInput.trim();
    setIsEditing(false);
    aiSidebarStore.setSession(currentSessionId, newTitle, aiSidebarStore.events.get());
    try {
      const { renameAgentSession, getAgentSessionsList } = await import('~/lib/actions/agentSession');
      await renameAgentSession(currentSessionId, newTitle);
      if (workspaceId) {
        const list = await getAgentSessionsList(workspaceId);
        setSessions(list);
      }
    } catch (err) {
      console.error('Failed to rename session:', err);
    }
  };

  const handleDeleteSession = async () => {
    if (!currentSessionId || !workspaceId) return;
    try {
      const { deleteAgentSession, getAgentSessionsList } = await import('~/lib/actions/agentSession');
      await deleteAgentSession(currentSessionId);
      const remaining = await getAgentSessionsList(workspaceId);
      setSessions(remaining);
      if (remaining.length > 0) {
        handleSelectSession(remaining[0].id, remaining[0].title);
      } else {
        await handleCreateNewChat();
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const handleSelectAgent = async (agent: any) => {
    if (!workspaceId) return;
    aiSidebarStore.setAgent(agent);
    try {
      const { getOrCreateAgentSessionForAgent, getAgentSessionsList } = await import('~/lib/actions/agentSession');
      const session = await getOrCreateAgentSessionForAgent(workspaceId, agent?.id || null);
      if (session) {
        handleSelectSession(session.id, session.title);
        // Refresh session list
        const remaining = await getAgentSessionsList(workspaceId);
        setSessions(remaining);
      }
    } catch (err) {
      console.error('Failed to get or create agent session:', err);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 rounded-md border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2 min-w-0">
          <button
            onClick={handleStartRename}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity focus:outline-none text-left shrink truncate min-w-0"
            title="Click to rename session"
          >
            {currentAgent?.avatarUrl ? (
              <img src={currentAgent.avatarUrl} alt="Agent" className="w-5 h-5 rounded-full object-cover shrink-0" />
            ) : (
              <IoSparkles className="text-blue-500 text-xl shrink-0" />
            )}
            {isEditing ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                onBlur={handleSaveRename}
                autoFocus
                className="text-sm font-semibold bg-white dark:bg-gray-800 border border-blue-500 rounded px-1.5 py-0.5 text-gray-900 dark:text-white outline-none w-full"
              />
            ) : (
              <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {currentSessionTitle || 'Onboarding'}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center shrink-0">
          <Dropdown
            align="end"
            trigger={
              <button
                className="p-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition-colors focus:outline-none"
                title="More options"
              >
                <IoEllipsisVertical className="text-lg" />
              </button>
            }
          >
            <DropdownSub>
              <DropdownSubTrigger>
                <IoPersonCircleOutline className="text-base text-gray-500 dark:text-gray-400 shrink-0" />
                <span>Switch Agent</span>
              </DropdownSubTrigger>
              <DropdownSubContent>
                <DropdownItem
                  active={!currentAgent}
                  onSelect={() => handleSelectAgent(null)}
                >
                  {!currentAgent && <IoCheckmark className="text-sm text-blue-500 shrink-0" />}
                  <span className="truncate flex-1">Felbor Agent (Template)</span>
                </DropdownItem>
                {agents.length > 0 && <DropdownSeparator />}
                {agents.map((agent) => (
                  <DropdownItem
                    key={agent.id}
                    active={currentAgent?.id === agent.id}
                    onSelect={() => handleSelectAgent(agent)}
                  >
                    {currentAgent?.id === agent.id && <IoCheckmark className="text-sm text-blue-500 shrink-0" />}
                    <span className="truncate flex-1">{agent.name}</span>
                  </DropdownItem>
                ))}
              </DropdownSubContent>
            </DropdownSub>
            <DropdownSeparator />

            <DropdownSub>
              <DropdownSubTrigger>
                <IoChatboxOutline className="text-base text-gray-500 dark:text-gray-400 shrink-0" />
                <span>Switch Chat</span>
              </DropdownSubTrigger>
              <DropdownSubContent>
                <DropdownItem onSelect={handleCreateNewChat}>
                  <IoAdd className="text-base text-blue-500 shrink-0" />
                  <span className="text-blue-500 font-medium">New Chat</span>
                </DropdownItem>
                <DropdownSeparator />
                {sessions.length === 0 ? (
                  <DropdownItem active className="font-medium">
                    <span className="truncate">{currentSessionTitle || 'Current Chat'}</span>
                  </DropdownItem>
                ) : (
                  sessions.map((s) => (
                    <DropdownItem
                      key={s.id}
                      active={s.id === currentSessionId}
                      onSelect={() => handleSelectSession(s.id, s.title)}
                    >
                      {s.id === currentSessionId && <IoCheckmark className="text-sm text-blue-500 shrink-0" />}
                      <span className="truncate flex-1">{s.title}</span>
                    </DropdownItem>
                  ))
                )}
              </DropdownSubContent>
            </DropdownSub>

            <DropdownSub>
              <DropdownSubTrigger>
                <IoLinkOutline className="text-base text-gray-500 dark:text-gray-400 shrink-0" />
                <span>Connect</span>
              </DropdownSubTrigger>
              <DropdownSubContent>
                <DropdownItem onSelect={() => setIsTelegramModalOpen(true)}>
                  <img className='shrink-0 w-5 h-5' src="/icons/connectors/telegram_agent.svg" alt="" />
                  <span className="font-medium">Telegram</span>
                </DropdownItem>
                <DropdownItem className="opacity-50 cursor-not-allowed" onSelect={(e) => e.preventDefault()}>
                  <img className='shrink-0 w-5 h-5' src="/icons/connectors/whatsapp.svg" alt="" />
                  <span className="text-gray-400">WhatsApp <Badge variant="secondary">Soon</Badge></span>
                </DropdownItem>
              </DropdownSubContent>
            </DropdownSub>

            <DropdownItem asChild>
              <a href={`/workspace/${workspaceId}/agent/${currentSessionId || 'default'}`}>
                <IoExpandOutline className="text-base text-gray-500 dark:text-gray-400 shrink-0" />
                <span>Full Screen</span>
              </a>
            </DropdownItem>

            <DropdownItem onSelect={() => aiSidebarStore.isBrowserOpen.set(!aiSidebarStore.isBrowserOpen.get())}>
              <i className="i-ph:globe-duotone text-base text-gray-500 dark:text-gray-400 shrink-0" />
              <span>Browser View</span>
            </DropdownItem>

            <DropdownItem
              onSelect={handleDeleteSession}
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <IoTrashOutline className="text-base text-red-500 shrink-0" />
              <span>Delete Chat</span>
            </DropdownItem>

            <DropdownItem onSelect={() => setIsSettingsOpen(true)}>
              <IoSettingsOutline className="text-base text-gray-500 dark:text-gray-400 shrink-0" />
              <span>Settings</span>
            </DropdownItem>

            <DropdownSeparator />

            <DropdownItem onSelect={() => aiSidebarStore.close()}>
              <IoClose className="text-base text-gray-500 dark:text-gray-400 shrink-0" />
              <span>Close</span>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <TelegramConnectModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        sessionId={currentSessionId}
        sessionTitle={currentSessionTitle || 'Onboarding'}
      />

      {workspaceId && (
        <WorkspaceSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          workspaceId={workspaceId}
        />
      )}
    </>
  );
};

export const AISidebar = ({
  className,
  style,
  isDragging,
}: {
  className?: string;
  style?: React.CSSProperties;
  isDragging?: boolean;
}) => {
  const isOpen = useStore(aiSidebarStore.isOpen);
  const isActive = useStore(aiSidebarStore.isActive);
  const rawEvents = useStore(aiSidebarStore.events);
  const events = Array.isArray(rawEvents) ? rawEvents : [];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      if (aiSidebarStore.isActive.get()) return;

      const workspaceId = aiSidebarStore.currentWorkspaceId.get();
      const sessionId = aiSidebarStore.currentSessionId.get();
      if (!workspaceId || !sessionId) return;

      import('~/lib/actions/agentSession').then(({ getAgentSessionEvents }) => {
        getAgentSessionEvents(workspaceId, sessionId).then((res: any) => {
          if (aiSidebarStore.isActive.get()) return;
          const evs = Array.isArray(res) ? res : res?.events || [];
          if (Array.isArray(evs) && evs.length > 0) {
            const currentEvs = aiSidebarStore.events.get();
            if (evs.length >= currentEvs.length && JSON.stringify(evs) !== JSON.stringify(currentEvs)) {
              aiSidebarStore.events.set(evs);
            }
          }
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const enableTransition = mounted && !isDragging;

  return (
    <div
      style={style}
      className={classNames(
        'flex flex-col h-full bg-white dark:bg-[#080808] border border-gray-300 dark:border-gray-800/80 rounded-md z-50 relative shrink-0',
        enableTransition ? 'transition-[width,opacity,transform] duration-200' : 'transition-none',
        isOpen ? 'opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full overflow-hidden border-0',
        className,
      )}
    >
      <HeaderControls />
      <AgentMessages events={events} isActive={isActive} />
      <AgentChatInput />
    </div>
  );
};