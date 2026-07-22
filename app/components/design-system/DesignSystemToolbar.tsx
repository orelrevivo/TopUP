import React from 'react';
import { classNames } from '~/utils/classNames';
import Popover from '~/components/ui/Popover';
import { Switch } from '~/components/ui/Switch';
import { workbenchStore } from '~/lib/stores/workbench';
import { Button } from '../ui';

interface DesignSystemToolbarProps {
  isInspectorMode: boolean;
  isDesignSystemMode: boolean;
}

export const DesignSystemToolbar: React.FC<DesignSystemToolbarProps> = ({
  isInspectorMode,
  isDesignSystemMode,
}) => {
  const toggleInspectorMode = () => {
    workbenchStore.isInspectorMode.set(!isInspectorMode);
  };

  return (
    <div className="flex items-center ml-1">
      <div
        className={classNames(
          "group flex items-center rounded-full overflow-hidden transition-all duration-300",
          isInspectorMode
            ? "bg-[#0099ff]/20"
            : "bg-falbor-elements-item-backgroundActive"
        )}
      >
        <Button
          onClick={toggleInspectorMode}
          className={classNames(
            "flex items-center gap-1 px-3 py-1 transition-all duration-300 hover:bg-transparent",
            "group-hover:pr-1",
            isInspectorMode ? "" : "hover:text-falbor-elements-item-contentActive"
          )}
          title={
            isInspectorMode
              ? 'Disable Element Inspector'
              : 'Enable Element Inspector'
          }
        >
          <div className="i-ph:cursor-click text-lg" />
          <span className="text-xs font-medium">Select</span>
        </Button>

        <div
          className={classNames(
            "overflow-hidden transition-all duration-300 flex items-center",
            "max-w-0 opacity-0 group-hover:max-w-12 group-hover:opacity-100"
          )}
        >
          <div
            className={classNames(
              "w-px h-4 mx-1 opacity-20",
              isInspectorMode ? "bg-white" : "bg-current"
            )}
          />

          <Popover
            align="start"
            side="top"
            trigger={
              <button
                className={classNames(
                  "px-2 py-1 transition-colors flex items-center justify-center",
                  isInspectorMode
                    ? ""
                    : "hover:text-falbor-elements-item-contentActive"
                )}
              >
                <div className="i-ph:caret-up text-sm" />
              </button>
            }
          >
            <div className="w-40 text-falbor-elements-textPrimary">
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-[#F0EDF0]"
                onClick={() => {
                  const next = !isDesignSystemMode;
                  workbenchStore.isDesignSystemMode.set(next);

                  if (next && !isInspectorMode) {
                    workbenchStore.isInspectorMode.set(true);
                  }
                }}
              >
                <span className="text-xs">Design System</span>

                <Switch
                  checked={isDesignSystemMode}
                  className="pointer-events-none"
                  onCheckedChange={(checked) => {
                    workbenchStore.isDesignSystemMode.set(checked);

                    if (checked && !isInspectorMode) {
                      workbenchStore.isInspectorMode.set(true);
                    }
                  }}
                />
              </div>

              <div className="w-full border-t border-gray-300" />

              <div className="px-2 py-2 w-full">
                <p className="text-xs text-falbor-elements-textSecondary">
                  You can design the elements yourself
                </p>
              </div>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
};