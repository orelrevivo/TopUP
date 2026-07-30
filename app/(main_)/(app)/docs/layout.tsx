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
            <Link 
              href="/docs/workflow" 
              className="px-3 py-2 text-sm font-medium rounded-md bg-accent-500/10 text-accent-500 hover:bg-accent-500/20 transition-colors"
            >
              Native AI Workflows
            </Link>
            {/* Future links can go here */}
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
