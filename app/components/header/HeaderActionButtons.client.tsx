'use client';
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { DeployButton } from '~/components/deploy/DeployButton';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { classNames } from '~/utils/classNames';
import { streamingState } from '~/lib/stores/streaming';

interface HeaderActionButtonsProps {
  chatStarted: boolean;
}

export function HeaderActionButtons({ chatStarted: _chatStarted }: HeaderActionButtonsProps) {
  const [activePreviewIndex] = useState(0);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[activePreviewIndex];

  const [isSyncing, setIsSyncing] = useState(false);
  const streaming = useStore(streamingState);

  const handleSyncFiles = useCallback(async () => {
    setIsSyncing(true);

    try {
      const directoryHandle = await window.showDirectoryPicker();
      await workbenchStore.syncFiles(directoryHandle);
      toast.success('Files synced successfully');
    } catch (error) {
      console.error('Error syncing files:', error);
      toast.error('Failed to sync files');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const shouldShowButtons = activePreview;

  return (
    <div className="flex items-center gap-2">
      {/* Sync / Debug Dropdown */}
      {shouldShowButtons && (
        <div className="flex rounded-md overflow-hidden">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              disabled={isSyncing || streaming}
              className="rounded-md bg-white dark:bg-[#252525] text-gray-900 dark:text-white border border-gray-200 dark:border-transparent items-center justify-center [&:is(:disabled,.disabled)]:cursor-not-allowed [&:is(:disabled,.disabled)]:opacity-60 px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-[#333333] !outline-none appearance-none flex items-center gap-1.5 shadow-sm"
            >
              {isSyncing ? 'Syncing...' : 'Sync'}
              <span className={classNames('i-ph:caret-down transition-transform')} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              className={classNames(
                'min-w-[240px] z-[250]',
                'bg-white dark:bg-[#141414]',
                'rounded-lg shadow-lg',
                'border border-gray-200/50 dark:border-gray-800/50',
                'animate-in fade-in-0 zoom-in-95',
                'py-1',
              )}
              sideOffset={5}
              align="end"
            >
              <DropdownMenu.Item
                className={classNames(
                  'cursor-pointer flex items-center w-full px-4 py-2 text-sm text-falbor-elements-textPrimary hover:bg-falbor-elements-item-backgroundActive gap-2 rounded-md group relative',
                )}
                onClick={handleSyncFiles}
                disabled={isSyncing}
              >
                <div className="flex items-center gap-2">
                  {isSyncing ? (
                    <div className="i-ph:spinner" />
                  ) : (
                    <div className="i-ph:cloud-arrow-down" />
                  )}
                  <span>{isSyncing ? 'Syncing...' : 'Sync Files'}</span>
                </div>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className={classNames(
                  'cursor-pointer flex items-center w-full px-4 py-2 text-sm text-falbor-elements-textPrimary hover:bg-falbor-elements-item-backgroundActive gap-2 rounded-md group relative',
                )}
                onClick={async () => {
                  try {
                    const { downloadDebugLog } = await import('~/utils/debugLogger');
                    await downloadDebugLog();
                  } catch (error) {
                    console.error('Failed to download debug log:', error);
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="i-ph:download" />
                  <span>Debug Log</span>
                </div>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      )}
      {/* Deploy Button */}
      {shouldShowButtons && <DeployButton />}
    </div>
  );
}