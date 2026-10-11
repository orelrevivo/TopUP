import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { aiSidebarStore } from '~/lib/stores/aiSidebar';

export interface AgentSession {
  id: string;
  title: string;
  createdAt: Date;
}

export function useAgentSessions() {
  const workspaceId = useStore(aiSidebarStore.currentWorkspaceId);
  const currentSessionId = useStore(aiSidebarStore.currentSessionId);
  const currentSessionTitle = useStore(aiSidebarStore.currentSessionTitle);

  const [sessions, setSessions] = useState<AgentSession[]>([]);

  useEffect(() => {
    if (workspaceId) {
      import('~/lib/actions/agentSession').then(({ getAgentSessionsList }) => {
        getAgentSessionsList(workspaceId).then(setSessions);
      });
    }
  }, [workspaceId, currentSessionId]);

  const refreshSessions = async () => {
    if (!workspaceId) return [];
    try {
      const { getAgentSessionsList } = await import('~/lib/actions/agentSession');
      const list = await getAgentSessionsList(workspaceId);
      setSessions(list);
      return list;
    } catch (err) {
      console.error('Failed to refresh sessions:', err);
      return [];
    }
  };

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

  const handleSaveRename = async (titleInput: string) => {
    if (!currentSessionId || !titleInput.trim()) return;
    const newTitle = titleInput.trim();
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

  return {
    sessions,
    workspaceId,
    currentSessionId,
    currentSessionTitle,
    handleCreateNewChat,
    handleSelectSession,
    handleSaveRename,
    handleDeleteSession,
    refreshSessions,
  };
}
