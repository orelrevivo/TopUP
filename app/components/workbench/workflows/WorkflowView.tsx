'use client';

import React, { memo, useState } from 'react';
import { WorkflowCanvas } from './WorkflowCanvas';
import { Sidebar } from './Sidebar';
import { WorkflowList } from './WorkflowList';
import { McpTools } from '~/components/chat/MCPTools';
import { Dialog, DialogTitle, DialogRoot } from '~/components/ui/Dialog';
import { WorkflowTemplates, type TemplateType } from './WorkflowTemplates';
import { useParams } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { chatId as chatIdStore } from '~/lib/persistence';

interface WorkflowViewProps {
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
}

export const WorkflowView = memo(({ sendMessage }: WorkflowViewProps) => {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [creatingTemplate, setCreatingTemplate] = useState<string | null>(null);

  const params = useParams();
  const storeChatId = useStore(chatIdStore);
  const chatId = (params.id as string) || storeChatId;

  const openEditor = (id: string | null) => {
    setCurrentWorkflowId(id);
    setView('editor');
  };

  const handleUseTemplate = async (template: TemplateType) => {
    setCreatingTemplate(template.id);
    try {
      const res = await fetch('/api/workflows/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: template.name + ' (Copy)',
          description: template.description,
          nodes: template.nodes,
          edges: template.edges,
          chatId: chatId || null
        })
      });
      const data = await res.json();
      if (data.success && data.workflowId) {
        setIsTemplatesOpen(false);
        openEditor(data.workflowId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingTemplate(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-falbor-elements-background-depth-1 text-falbor-elements-textPrimary overflow-hidden">
      {/* Workflow Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-falbor-elements-borderColor bg-falbor-elements-background-depth-2 shrink-0">

        {/* Left Side - Title */}
        <div className="flex items-center gap-2 text-sm font-medium px-2 py-1 text-falbor-elements-textPrimary">
          {view === 'editor' && (
            <button
              onClick={() => setView('list')}
              className="mr-2 p-1 hover:bg-falbor-elements-background-depth-4 rounded text-falbor-elements-textSecondary hover:text-falbor-elements-textPrimary transition-colors"
            >
              <div className="i-ph:arrow-left" />
            </button>
          )}

          {view === 'editor' ? 'Workflow Editor' : 'Your Workflows'}
          <a
            href="/docs/workflow"
            target="_blank"
            className="text-sm font-medium text-blue-500 underline hover:text-accent-400 hover:underline flex items-center gap-1"
          >
            <div className="i-ph:info" />
            Learn more about this feature
          </a>
        </div>


        {/* Right Side - Actions */}
        <div className="flex items-center gap-4">
          <McpTools />

          <button
            onClick={() => setIsTemplatesOpen(true)}
            className="px-4 py-2 border border-falbor-elements-borderColor text-falbor-elements-textPrimary rounded-none text-sm font-semibold hover:bg-falbor-elements-background-depth-3 transition-colors"
          >
            Templates
          </button>

          <button
            onClick={() => openEditor(null)}
            className="px-5 py-2.5 bg-[#009ff2]/20 text-[#0099ff] rounded-none text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Create Blank Workflow
          </button>
        </div>

      </div>


      {/* Content */}
      {view === 'list' ? (
        <WorkflowList onSelectWorkflow={openEditor} />
      ) : (
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar />

          <div className="flex-1 relative h-full">
            <WorkflowCanvas
              workflowId={currentWorkflowId}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      )}

      <DialogRoot open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
        <Dialog onClose={() => setIsTemplatesOpen(false)} onBackdrop={() => setIsTemplatesOpen(false)}>
          <div className="flex items-center justify-between p-4 border-b border-falbor-elements-borderColor">
            <DialogTitle>Templates <span className='text-xs font-normal text-[#0099FF] bg-[#0099ff]/20 px-2 py-1 ml-2 rounded-sm'>by falbor</span></DialogTitle>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            <WorkflowTemplates creatingTemplate={creatingTemplate} onUseTemplate={handleUseTemplate} />
          </div>
        </Dialog>
      </DialogRoot>
    </div>
  );
});

WorkflowView.displayName = 'WorkflowView';