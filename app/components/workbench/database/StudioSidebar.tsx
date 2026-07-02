'use client';
import React from 'react';
import { classNames } from '~/utils/classNames';
import type { ActiveTab } from './types';

interface StudioSidebarProps {
  activeTab: ActiveTab;
  isLoading: boolean;
  lastUpdated: Date | null;
  onTabChange: (tab: ActiveTab) => void;
}

const NAV_ITEMS: { id: ActiveTab; label: string; icon: string }[] = [
  { id: 'tables', label: 'Tables', icon: 'i-ph:table' },
  { id: 'auth', label: 'Authentication', icon: 'i-ph:users' },
  { id: 'storage', label: 'Storage', icon: 'i-ph:folder-open' },
  { id: 'functions', label: 'Functions', icon: 'i-ph:function' },
  { id: 'logs', label: 'Logs', icon: 'i-ph:list-dashes' },
];

export function StudioSidebar({ activeTab, isLoading, lastUpdated, onTabChange }: StudioSidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-falbor-elements-borderColor bg-falbor-elements-background-depth-2 flex flex-col">
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-falbor-elements-borderColor">
        <span className="font-semibold text-base text-falbor-elements-textPrimary">Database</span>
        {isLoading && (
          <div className="i-ph:spinner-gap-bold animate-spin ml-auto text-falbor-elements-textTertiary text-sm" />
        )}
      </div>

      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={classNames(
              'flex items-center gap-3 w-full px-3 py-1.5 rounded-md text-sm font-medium text-left',
              activeTab === item.id
                ? 'bg-falbor-elements-background-depth-3 text-falbor-elements-textPrimary font-semibold'
                : 'text-falbor-elements-textSecondary hover:bg-falbor-elements-background-depth-3 hover:text-falbor-elements-textPrimary',
            )}
          >
            <div className={classNames(item.icon, 'text-[18px]')} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
