import { useStore } from '@nanostores/react';
import ReactMarkdown from 'react-markdown';
import { workbenchStore } from '~/lib/stores/workbench';

export const ResourcesView = () => {
  const currentResourcesData = useStore(workbenchStore.currentResourcesData);

  const closeResources = () => {
    workbenchStore.currentView.set('code');
  };

  return (
    <div className="flex flex-col w-full h-full bg-falbor-elements-background-depth-1 overflow-hidden relative">
      <div className="flex items-center justify-between px-6 py-4 border-b border-falbor-elements-borderColor bg-falbor-elements-background-depth-2 shrink-0 z-10 sticky top-0">
        <h2 className="text-lg font-semibold text-falbor-elements-textPrimary flex items-center gap-2">
          <div className="i-ph:link-duotone text-falbor-elements-item-contentAccent" />
          Resources & Links
        </h2>
        <button
          onClick={closeResources}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-falbor-elements-background-depth-3 text-sm font-medium text-falbor-elements-textSecondary hover:text-falbor-elements-textPrimary transition-colors"
        >
          <div className="i-ph:x" />
          Close
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto w-full">
          {currentResourcesData ? (
            <ReactMarkdown
              className="flex flex-col gap-6"
              components={{
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-semibold text-falbor-elements-textPrimary mt-8 mb-4 pb-2 border-b border-falbor-elements-borderColor flex items-center gap-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-medium text-falbor-elements-textPrimary mt-6 mb-3" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-base text-falbor-elements-textSecondary leading-relaxed m-0" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="flex flex-col gap-3 my-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="flex gap-2 text-base text-falbor-elements-textSecondary leading-relaxed items-start before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-falbor-elements-item-contentAccent before:mt-2.5 before:shrink-0" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-falbor-elements-textPrimary bg-falbor-elements-background-depth-3 px-1.5 py-0.5 rounded text-sm mx-0.5 shadow-sm border border-falbor-elements-borderColor/50" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="inline-flex items-center gap-1 px-4 py-2 mt-2 bg-falbor-elements-item-backgroundAccent text-falbor-elements-item-contentAccent rounded-lg hover:opacity-90 transition-opacity font-medium text-sm no-underline shadow-sm" target="_blank" rel="noopener noreferrer" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-falbor-elements-item-contentAccent pl-5 py-3 italic bg-falbor-elements-background-depth-2 rounded-r-lg my-4 text-falbor-elements-textSecondary" {...props} />
                ),
              }}
            >
              {currentResourcesData}
            </ReactMarkdown>
          ) : (
            <div className="flex items-center justify-center h-full text-falbor-elements-textTertiary mt-20">
              No resources data available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
