import { getAgentSessionsList } from '~/lib/actions/agentSession';
import { getAgentsList } from '~/lib/actions/agent';
import Link from 'next/link';
import { ClientSidebar } from '~/components/sidebar/ClientSidebar';
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from '~/components/ui/Dropdown';
import { AgentCardActions } from './AgentCardActions';

export default async function WorkspaceAgentRootPage({
  params,
}: {
  params: { id: string };
}) {
  const [sessions, agents] = await Promise.all([
    getAgentSessionsList(params.id),
    getAgentsList(params.id),
  ]);

  return (
    <div className="flex flex-row h-screen w-full overflow-hidden bg-falbor-elements-background">
      <ClientSidebar />
      <div className="flex-1 p-4 h-full min-w-0 bg-[#f7f7f8] dark:bg-[#111114] overflow-hidden">
        <div className="flex flex-col h-full w-full relative rounded-md border border-gray-300 dark:border-gray-800/80 bg-white dark:bg-[#080808] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col w-full p-8 max-w-5xl mx-auto mt-4">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <Link href={`/workspace/${params.id}/agent/new`}>
                  <button className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <div className="i-ph:chat-circle-text w-4 h-4" />
                    New Session
                  </button>
                </Link>
                <Dropdown
                  align="end"
                  sideOffset={8}
                  trigger={
                    <button
                      type="button"
                      className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="i-ph:chats w-4 h-4" />
                      Sessions
                      <div className="i-ph:caret-down w-3.5 h-3.5" />
                    </button>
                  }
                >
                  <div className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Your Sessions
                  </div>
                  <DropdownSeparator />
                  {sessions.length === 0 ? (
                    <div className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400">
                      No sessions yet
                    </div>
                  ) : (
                    sessions.map((session) => (
                      <DropdownItem key={session.id} asChild>
                        <Link
                          href={`/workspace/${params.id}/agent/${session.id}`}
                          className="w-full min-w-[260px] max-w-[360px]"
                        >
                          <div className="i-ph:chat-circle-text w-4 h-4 shrink-0 text-gray-500" />
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="truncate">
                              {session.title || 'Untitled Session'}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {Array.isArray(session.events) && session.events.length > 0
                                ? `${session.events.length} messages`
                                : 'Empty session'}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {new Date(
                              session.updatedAt || session.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </Link>
                      </DropdownItem>
                    ))
                  )}
                </Dropdown>
                <Link href={`/workspace/${params.id}/agent/create`}>
                  <button className="flex items-center gap-1 px-2 py-0.5 bg-[#0099ff]/30 text-[#0099ff] rounded-md transition-colors">
                    <div className="i-ph:robot w-4 h-4" />
                    Create Agent
                  </button>
                </Link>
              </div>
            </div>
            <div>
              <h2 className="text-xl text-gray-900 dark:text-white mb-4">
                Your Custom Agents
              </h2>
              {agents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/20">
                  <div className="i-ph:robot w-10 h-10 text-gray-400 mb-3" />

                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    No custom agents
                  </h3>

                  <p className="text-xs text-gray-500">
                    Create specialized agents for marketing, research, or support.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex flex-col p-3 rounded-md border"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-gray-400 bg-gray-200/50 dark:bg-gray-800/50 px-2 py-1 rounded-md">
                            {agent.model}
                          </div>
                          <AgentCardActions
                            workspaceId={params.id}
                            agentId={agent.id}
                            agentName={agent.name}
                          />
                        </div>
                      </div>
                      <h3 className="text-lg text-gray-900 dark:text-gray-100 mb-1">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {agent.role || 'No role defined'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}