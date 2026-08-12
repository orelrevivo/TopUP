import { useStore } from '@nanostores/react';
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { memo } from 'react';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';
import { BrowserView } from '~/components/workbench/BrowserView';
import useViewport from '~/lib/hooks';
import { workbenchStore } from '~/lib/stores/workbench';

const workbenchVariants = {
  closed: {
    width: 0,
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    width: 'var(--workbench-width)',
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

export const HackingWorkbench = memo(() => {
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const isSmallViewport = useViewport(1024);

  return (
    showWorkbench && (
      <motion.div
        initial="closed"
        animate="open"
        exit="closed"
        variants={workbenchVariants}
        className={classNames(
          'z-workbench',
          {
            'absolute inset-y-0 right-0 w-full z-50': isSmallViewport,
            'flex-shrink-0 relative': !isSmallViewport,
          },
        )}
      >
        <div className="absolute inset-0 px-2 lg:px-4">
          <div className="h-full flex flex-col bg-falbor-elements-background-depth-2 border border-falbor-elements-borderColor shadow-sm rounded-xl overflow-hidden">
            <div className="flex items-center px-3 py-2 border-b border-falbor-elements-borderColor bg-falbor-elements-background-depth-3">
              <div className="flex items-center gap-2 text-sm font-medium text-falbor-elements-textPrimary">
                <div className="i-ph:globe-hemisphere-west text-lg text-falbor-elements-textSecondary" />
                Live Browser Sync
              </div>
              <div className="ml-auto">
                <button
                  className="p-1 hover:bg-falbor-elements-artifacts-backgroundHover rounded-md transition-colors"
                  onClick={() => workbenchStore.showWorkbench.set(false)}
                >
                  <div className="i-ph:x text-lg text-falbor-elements-textSecondary" />
                </button>
              </div>
            </div>
            <div className="relative flex-1 overflow-hidden">
              <BrowserView />
            </div>
          </div>
        </div>
      </motion.div>
    )
  );
});
