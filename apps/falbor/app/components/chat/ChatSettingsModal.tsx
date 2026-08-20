import React, { useState } from 'react';
import { DialogRoot, Dialog, DialogTitle, DialogDescription } from '~/components/ui/Dialog';
import { SetupButton } from '~/components/ui/setup/SetupButton';
import { classNames } from '~/utils/classNames';

interface ChatSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSettingsModal({ isOpen, onClose }: ChatSettingsModalProps) {
  const [activeTab, setActiveTab] = useState('analytics');

  const enableAnalytics = () => {
    onClose();
    
    const agentPrompt = `
# Add Falbor Analytics

Set up the Falbor Analytics SDK directly in my project without requiring an NPM package. Please follow these instructions carefully.

## 1. Create the SDK File
Create a new utility file at \`lib/falbor-analytics.ts\` (or \`src/lib/falbor-analytics.ts\` depending on the project structure) and paste the exact code below into it.

\`\`\`typescript
export interface AnalyticsOptions {
  projectId: string;
  endpoint?: string;
  environment?: string;
  options?: {
    enableAutoTracking?: boolean;
    debugMode?: boolean;
  };
}

export interface AnalyticsEvent {
  projectId: string;
  event: string;
  path: string;
  referrer: string;
  url: string;
  timestamp: number;
  properties?: Record<string, any>;
}

class FalborAnalytics {
  private config: AnalyticsOptions | null = null;
  private initialized = false;
  private defaultEndpoint = 'https://analytics.falbor.xyz/api/event';

  init(config: AnalyticsOptions) {
    this.config = config;
    this.initialized = true;

    if (this.config.options?.debugMode) {
      console.log('[Falbor Analytics] Initialized with config:', this.config);
    }

    if (this.config.options?.enableAutoTracking) {
      this.setupAutoTracking();
    }

    return this;
  }

  private setupAutoTracking() {
    if (typeof window === 'undefined') return;

    // Track initial pageview
    this.track('pageview');

    // Setup history API interception for SPA navigation tracking
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      window.dispatchEvent(new Event('pushstate'));
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event('replacestate'));
    };

    const handleRouteChange = () => {
      this.track('pageview');
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('pushstate', handleRouteChange);
    window.addEventListener('replacestate', handleRouteChange);
  }

  track(eventName: string, properties?: Record<string, any>) {
    if (!this.initialized || !this.config) {
      console.warn('[Falbor Analytics] SDK not initialized. Call init() first.');
      return;
    }

    if (typeof window === 'undefined') return;

    const endpoint = this.config.endpoint || this.defaultEndpoint;
    
    const payload: AnalyticsEvent = {
      projectId: this.config.projectId,
      event: eventName,
      path: window.location.pathname,
      referrer: document.referrer,
      url: window.location.href,
      timestamp: Date.now(),
      properties,
    };

    if (this.config.options?.debugMode) {
      console.log(\`[Falbor Analytics] Tracking Event: \${eventName}\`, payload);
    }

    try {
      fetch(endpoint, {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      if (this.config.options?.debugMode) {
        console.error('[Falbor Analytics] Error sending event:', error);
      }
    }
  }
}

export const analytics = new FalborAnalytics();

export function initFalborAnalytics(config: AnalyticsOptions) {
  return analytics.init(config);
}

export default analytics;
\`\`\`

## 2. Environment Setup
Check the environment variables. Ensure that the following key can be securely injected:
- \`FALBOR_PROJECT_ID\` (If unavailable, use a placeholder and instruct the user to configure it)

## 3. App Integration
Import and initialize this utility file in the main layout or app entry point (e.g., \`app/layout.tsx\` or \`pages/_app.tsx\`) so that auto-tracking begins immediately on load.

\`\`\`javascript
import { initFalborAnalytics } from '@/lib/falbor-analytics'; // adjust path as needed

// Initialize with environment variables
if (typeof window !== 'undefined') {
  initFalborAnalytics({
    projectId: process.env.FALBOR_PROJECT_ID || process.env.NEXT_PUBLIC_FALBOR_PROJECT_ID || 'demo-project',
    options: {
      enableAutoTracking: true,
      debugMode: process.env.NODE_ENV === 'development',
    }
  });
}
\`\`\`
`;

    // Dispatch custom event that Chat.client.tsx will listen to
    const event = new CustomEvent('falbor:externalChatMessage', {
      detail: agentPrompt,
    });
    window.dispatchEvent(event);
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog showCloseButton={true} onClose={onClose} className="sm:max-w-[700px] p-0 overflow-hidden bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333]">
        <div className="flex h-[500px]">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#111] p-4 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">Settings</h3>
            <button
              onClick={() => setActiveTab('analytics')}
              className={classNames(
                'flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors',
                activeTab === 'analytics'
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222]'
              )}
            >
              <div className="i-ph:chart-line-up w-4 h-4 mr-2" />
              Analytics
            </button>
          </div>

          {/* Content Area */}
          <div className="w-2/3 p-6 bg-white dark:bg-[#1a1a1a] flex flex-col">
            {activeTab === 'analytics' && (
              <div className="flex flex-col h-full">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                  <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Analytics Setup</DialogTitle>
                  <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                    Enable analytics for your project to track telemetry, monitor usage, and gain insights via the Falbor Analytics SDK.
                  </DialogDescription>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                  <div className="i-ph:chart-bar w-16 h-16 text-indigo-500 mb-4 opacity-80" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Connect Analytics</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    This will install the <code className="bg-gray-100 dark:bg-[#333] px-1 rounded text-xs">falbor-analytics-sdk</code> in your project and configure your dashboard integration.
                  </p>
                  <SetupButton
                    onClick={enableAnalytics}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                  >
                    Enable Analytics
                  </SetupButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </DialogRoot>
  );
}
