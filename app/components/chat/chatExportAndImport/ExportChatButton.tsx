import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';

export const ExportChatButton = ({ exportChat }: { exportChat?: () => void }) => {
  return (
    <div className="flex rounded-md overflow-hidden">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="rounded-md bg-white dark:bg-[#252525] text-gray-900 dark:text-white border border-gray-200 dark:border-transparent items-center justify-center [&:is(:disabled,.disabled)]:cursor-not-allowed [&:is(:disabled,.disabled)]:opacity-60 px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-[#333333] !outline-none appearance-none flex items-center gap-1.5 shadow-sm">
          Export
          <span className={classNames('i-ph:caret-down transition-transform')} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          className={classNames(
            'z-[250]',
            'bg-falbor-elements-background-depth-2',
            'rounded-lg shadow-lg',
            'border border-falbor-elements-borderColor',
            'animate-in fade-in-0 zoom-in-95',
            'py-1',
          )}
          sideOffset={5}
          align="end"
        >
          <DropdownMenu.Item
            className={classNames(
              'cursor-pointer flex items-center w-auto px-4 py-2 text-sm text-falbor-elements-textPrimary hover:bg-falbor-elements-item-backgroundActive gap-2 rounded-md group relative',
            )}
            onClick={() => {
              workbenchStore.downloadZip();
            }}
          >
            <div className="i-ph:code size-4.5"></div>
            <span>Download Code</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={classNames(
              'cursor-pointer flex items-center w-full px-4 py-2 text-sm text-falbor-elements-textPrimary hover:bg-falbor-elements-item-backgroundActive gap-2 rounded-md group relative',
            )}
            onClick={() => exportChat?.()}
          >
            <div className="i-ph:chat size-4.5"></div>
            <span>Export Chat</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};