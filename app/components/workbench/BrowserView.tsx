import { useStore } from '@nanostores/react';
import React, { memo } from 'react';
import { workbenchStore } from '~/lib/stores/workbench';

export const BrowserView = memo(() => {
  const currentAiUrl = useStore(workbenchStore.currentAiUrl);

  return (
    <div className="flex flex-col w-full h-full bg-falbor-elements-background-depth-1 border-l border-falbor-elements-borderColor">
      <div className="flex items-center p-2 bg-falbor-elements-background-depth-2 border-b border-falbor-elements-borderColor shadow-sm">
        <div className="flex items-center gap-1.5 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex-1 bg-falbor-elements-background-depth-3 rounded-md px-3 py-1.5 text-sm text-falbor-elements-textPrimary flex items-center gap-2 border border-falbor-elements-borderColor overflow-hidden">
          <div className="i-ph:lock-key text-falbor-elements-icon-success flex-shrink-0"></div>
          <span className="truncate flex-1 font-mono text-xs opacity-80">{currentAiUrl || 'Waiting for AI to browse...'}</span>
        </div>
        <button 
          className="ml-3 p-1.5 hover:bg-falbor-elements-artifacts-backgroundHover rounded-md transition-colors"
          onClick={() => {
            workbenchStore.showWorkbench.set(false);
          }}
          title="Close Browser"
        >
          <div className="i-ph:x text-lg text-falbor-elements-textSecondary hover:text-falbor-elements-textPrimary"></div>
        </button>
      </div>

      <div className="flex-1 w-full bg-white relative overflow-hidden">
        {currentAiUrl ? (
          <iframe 
            src={`/api/proxy?url=${encodeURIComponent(currentAiUrl)}`}
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title="AI Browser View"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-falbor-elements-background-depth-1 text-falbor-elements-textSecondary">
            <div className="i-ph:globe-hemisphere-west-duotone text-6xl mb-4 opacity-50 animate-pulse"></div>
            <p className="text-lg font-medium opacity-80">No active browser session</p>
            <p className="text-sm opacity-60 mt-2 max-w-sm text-center">
              Tell the AI to navigate to a website or perform a web search to see its browser window here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
