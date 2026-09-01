import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cubicEasingFn } from '~/utils/easings';
import { createPortal } from 'react-dom';

export function ScreenshotAccordion({ url, title }: { url: string; title: string }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!url) return null;

  return (
    <>
      <div className="tool-invocation border border-falbor-elements-borderColor flex flex-col overflow-hidden rounded-lg w-full transition-border duration-150 mb-3 bg-falbor-elements-background-depth-1 mt-2">
        <div className="flex">
          <button
            className="flex items-stretch bg-falbor-elements-background-depth-2 hover:bg-falbor-elements-artifacts-backgroundHover w-full overflow-hidden"
            onClick={() => setShowDetails(!showDetails)}
          >
            <div className="p-2.5">
              <div className="i-ph:camera text-xl text-falbor-elements-textSecondary"></div>
            </div>
            <div className="p-2.5 w-full text-left">
              <div className="w-full text-falbor-elements-textPrimary font-medium leading-5 text-sm">
                Screenshot Taken
                <span className="w-full text-falbor-elements-textSecondary text-xs mt-0.5 block truncate">
                  {title}
                </span>
              </div>
            </div>
          </button>
          <AnimatePresence>
            <motion.button
              initial={{ width: 0 }}
              animate={{ width: 'auto' }}
              exit={{ width: 0 }}
              transition={{ duration: 0.15, ease: cubicEasingFn }}
              className="bg-falbor-elements-artifacts-background hover:bg-falbor-elements-artifacts-backgroundHover"
              onClick={() => setShowDetails(!showDetails)}
            >
              <div className="p-2">
                <div
                  className={`${showDetails ? 'i-ph:caret-up-bold' : 'i-ph:caret-down-bold'} text-xl text-falbor-elements-textSecondary hover:text-falbor-elements-textPrimary transition-colors`}
                ></div>
              </div>
            </motion.button>
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {showDetails && (
            <motion.div
              className="details"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: '0px' }}
              transition={{ duration: 0.15 }}
            >
              <div className="bg-falbor-elements-artifacts-borderColor h-[1px]" />
              <div className="px-3 py-3 text-left bg-falbor-elements-background-depth-2 flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full mb-3 last:mb-0"
                >
                  <img 
                    src={url} 
                    alt={title} 
                    className="w-full rounded-md cursor-pointer hover:opacity-90 transition-opacity border border-falbor-elements-borderColor shadow-sm"
                    onClick={() => setIsFullscreen(true)}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {}
      {isFullscreen && typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-8 cursor-zoom-out"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={url}
              className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
            <button 
              className="absolute top-6 right-6 p-3 bg-black/60 text-white rounded-full hover:bg-white hover:text-black transition-colors shadow-lg"
              onClick={() => setIsFullscreen(false)}
            >
              <div className="i-ph:x-bold text-2xl"></div>
            </button>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
