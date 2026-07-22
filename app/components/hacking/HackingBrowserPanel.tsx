'use client';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { classNames } from '~/utils/classNames';

interface HackingBrowserPanelProps {
  currentUrl?: string;
  isStreaming?: boolean;
  isSearching?: boolean;
  searchQuery?: string;
}

function getSafeHostname(rawUrl: string): string {
  try {
    const u = new URL(rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl);
    return u.hostname;
  } catch {
    return rawUrl;
  }
}

function toFullUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  // If no spaces and has a dot, treat as domain
  if (!trimmed.includes(' ') && trimmed.includes('.')) return 'https://' + trimmed;
  // Otherwise treat as a search query
  return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
}

export function HackingBrowserPanel({ currentUrl, isStreaming, isSearching, searchQuery }: HackingBrowserPanelProps) {
  const [iframeUrl, setIframeUrl] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // When the AI sends a NAVIGATE command, load that URL
  useEffect(() => {
    if (currentUrl) {
      setIframeUrl(currentUrl);
      setInputValue(currentUrl);
      setIsLoading(true);
    }
  }, [currentUrl]);

  // When AI starts a web search, automatically navigate to DuckDuckGo
  useEffect(() => {
    if (isSearching && searchQuery) {
      const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;
      setIframeUrl(searchUrl);
      setInputValue(searchUrl);
      setIsLoading(true);
    } else if (!isSearching && !isStreaming) {
      setIsLoading(false);
    }
  }, [isSearching, searchQuery, isStreaming]);

  const navigate = (raw: string) => {
    const full = toFullUrl(raw);
    if (!full) return;
    setIframeUrl(full);
    setInputValue(full);
    setIsLoading(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') navigate(inputValue);
  };

  const favicon = iframeUrl ? `https://www.google.com/s2/favicons?sz=16&domain=${iframeUrl}` : null;
  const displayHostname = iframeUrl ? getSafeHostname(iframeUrl) : 'New Tab';

  return (
    <div className="flex flex-col h-full w-full bg-falbor-elements-background-depth-1 rounded-lg overflow-hidden border border-falbor-elements-borderColor">
      {/* Browser Chrome */}
      <div className="flex flex-col bg-falbor-elements-background-depth-2 border-b border-falbor-elements-borderColor select-none">
        {/* Traffic Lights + Tabs Row */}
        <div className="flex items-center gap-2 px-3 pt-2.5 pb-0">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {/* Tab */}
          <div className="flex items-center gap-2 bg-falbor-elements-background-depth-1 border border-falbor-elements-borderColor border-b-0 rounded-t-md px-3 py-1.5 min-w-0 max-w-[200px]">
            {favicon && iframeUrl ? (
              <img
                src={favicon}
                alt=""
                className="w-3.5 h-3.5 flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="i-ph:globe text-falbor-elements-textSecondary text-xs flex-shrink-0" />
            )}
            <span className="text-xs text-falbor-elements-textPrimary truncate">
              {displayHostname}
            </span>
          </div>
        </div>

        {/* Address Bar Row */}
        <div className="flex items-center gap-1.5 px-3 py-2">
          <button
            className="p-1 rounded hover:bg-falbor-elements-background-depth-3 transition-colors"
            onClick={() => iframeRef.current?.contentWindow?.history.back()}
          >
            <div className="i-ph:arrow-left text-falbor-elements-textSecondary text-sm" />
          </button>
          <button
            className="p-1 rounded hover:bg-falbor-elements-background-depth-3 transition-colors"
            onClick={() => iframeRef.current?.contentWindow?.history.forward()}
          >
            <div className="i-ph:arrow-right text-falbor-elements-textSecondary text-sm" />
          </button>
          <button
            className="p-1 rounded hover:bg-falbor-elements-background-depth-3 transition-colors"
            onClick={() => { 
              setIsLoading(true);
              const current = iframeUrl;
              setIframeUrl('');
              setTimeout(() => setIframeUrl(current), 50);
            }}
          >
            <div className={classNames('text-falbor-elements-textSecondary text-sm transition-transform', {
              'i-ph:arrow-clockwise animate-spin': isLoading,
              'i-ph:arrow-clockwise': !isLoading,
            })} />
          </button>

          {/* URL Bar */}
          <div className="flex-1 flex items-center gap-2 bg-falbor-elements-background-depth-3 border border-falbor-elements-borderColor rounded-md px-3 py-1">
            {isLoading ? (
              <div className="i-svg-spinners:3-dots-fade text-falbor-elements-item-contentAccent text-sm flex-shrink-0" />
            ) : iframeUrl ? (
              <div className="i-ph:lock-simple text-green-500 text-xs flex-shrink-0" />
            ) : (
              <div className="i-ph:globe text-falbor-elements-textSecondary text-xs flex-shrink-0" />
            )}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={(e) => e.target.select()}
              placeholder="Search or type a URL and press Enter..."
              className="flex-1 bg-transparent text-xs text-falbor-elements-textPrimary outline-none placeholder:text-falbor-elements-textTertiary"
            />
            {inputValue && (
              <button
                onClick={() => navigate(inputValue)}
                className="flex-shrink-0 transition-colors"
              >
                <div className="i-ph:arrow-right text-falbor-elements-textSecondary hover:text-falbor-elements-textPrimary text-sm" />
              </button>
            )}
          </div>

          {/* AI Indicator */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent-500/20 border border-accent-500/30"
              >
                <div className="i-ph:robot text-accent-500 text-xs" />
                <span className="text-accent-500 text-xs font-medium whitespace-nowrap">AI Browsing</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 relative overflow-hidden bg-white">
        {!iframeUrl ? (
          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-falbor-elements-background-depth-1 to-falbor-elements-background-depth-2 gap-3">
            <div className="i-ph:globe text-6xl text-falbor-elements-textSecondary/30" />
            <p className="text-falbor-elements-textSecondary text-sm font-medium">AI Browser</p>
            <p className="text-falbor-elements-textTertiary text-xs text-center max-w-[180px]">
              Type a URL or search above, or it will open automatically when the AI searches the web
            </p>
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 flex items-center gap-2 text-accent-500 text-xs"
              >
                <div className="i-svg-spinners:3-dots-fade text-lg" />
                AI is thinking...
              </motion.div>
            )}
          </div>
        ) : (
          <>
            {isLoading && (
              <motion.div
                key="progress"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
                className="absolute top-0 left-0 right-0 h-0.5 bg-accent-500 origin-left z-10"
              />
            )}
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              className="w-full h-full border-0"
              title="AI Browser"
              onLoad={() => setIsLoading(false)}
            />
          </>
        )}

        {/* AI Browsing Overlay */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-falbor-elements-background-depth-1/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 pointer-events-none"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-3"
              >
                <div className="i-ph:robot text-5xl text-accent-500" />
                <div className="text-falbor-elements-textPrimary font-semibold">AI is searching...</div>
                {searchQuery && (
                  <div className="text-falbor-elements-textSecondary text-sm px-4 py-1.5 bg-falbor-elements-background-depth-2 rounded-full border border-falbor-elements-borderColor max-w-[220px] truncate text-center">
                    "{searchQuery}"
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
