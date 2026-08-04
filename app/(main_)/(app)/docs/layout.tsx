import React from 'react';
import Link from 'next/link';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-falbor-elements-background-depth-1 text-falbor-elements-textPrimary">
      {/* Sidebar */}
      <aside className="w-64 border-r border-falbor-elements-borderColor bg-falbor-elements-background-depth-2 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-sm font-semibold tracking-wider text-falbor-elements-textSecondary uppercase mb-4">
            Documentation
          </h2>
          <nav className="flex flex-col gap-2">
            <details className="group" open>
              <summary className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md bg-transparent text-falbor-elements-textPrimary hover:bg-falbor-elements-background-depth-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2">
                  <div className="i-ph:book-open text-falbor-elements-textSecondary" />
                  Guides
                </span>
                <div className="i-ph:caret-down text-xs text-falbor-elements-textSecondary transition-transform group-open:-rotate-180" />
              </summary>
              <div className="flex flex-col gap-1 mt-1 pl-4 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[1px] before:bg-falbor-elements-borderColor">
                <Link 
                  href="/docs/workflow" 
                  className="px-3 py-1.5 text-sm font-medium rounded-md text-falbor-elements-textSecondary hover:bg-falbor-elements-background-depth-3 hover:text-falbor-elements-textPrimary transition-colors relative"
                >
                  Native AI Workflows
                </Link>
                <Link 
                  href="/docs/models" 
                  className="px-3 py-1.5 text-sm font-medium rounded-md text-falbor-elements-textSecondary hover:bg-falbor-elements-background-depth-3 hover:text-falbor-elements-textPrimary transition-colors relative"
                >
                  Models & Credits
                </Link>
              </div>
            </details>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-falbor-elements-background-depth-1">
        <div className="max-w-4xl mx-auto p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
