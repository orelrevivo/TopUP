'use client';
import { motion, type Variants } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Dialog, DialogButton, DialogDescription, DialogRoot, DialogTitle } from '~/components/ui/Dialog';
import { ThemeSwitch } from '~/components/ui/ThemeSwitch';
import { ControlPanel } from '~/components/@settings/core/ControlPanel';
import { TAB_ICONS, TAB_LABELS, DEFAULT_TAB_CONFIG } from '~/components/@settings/core/constants';
import { tabConfigurationStore, resetTabConfiguration, settingsOpenStore, settingsTabStore } from '~/lib/stores/settings';
import type { TabType } from '~/components/@settings/core/types';
import { SettingsButton, HelpButton } from '~/components/ui/SettingsButton';
import { Button } from '~/components/ui/Button';
import { db, deleteById, getAll, chatId, type ChatHistoryItem, useChatHistory } from '~/lib/persistence';
import { cubicEasingFn } from '~/utils/easings';
import { HistoryItem } from './HistoryItem';
import { binDates } from './date-binning';
import { useSearchFilter } from '~/lib/hooks/useSearchFilter';
import { classNames } from '~/utils/classNames';
import { useStore } from '@nanostores/react';
import { profileStore } from '~/lib/stores/profile';
import { useAuth } from '~/hooks/useAuth';
import { sidebarOpen, sidebarPinned } from '~/lib/stores/sidebar';
import { chatStore } from '~/lib/stores/chat';

const squareMenuVariants = {
  closed: {
    width: '70px',
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    width: '340px',
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

const fullMenuVariants = {
  closed: {
    opacity: 0,
    visibility: 'hidden',
    left: '-340px',
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    opacity: 1,
    visibility: 'initial',
    left: 0,
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

type DialogContent =
  | { type: 'delete'; item: ChatHistoryItem }
  | { type: 'bulkDelete'; items: ChatHistoryItem[] }
  | null;

function CurrentDateTime() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800/50">
      <div className="h-4 w-4 i-ph:clock opacity-80" />
      <div className="flex gap-2">
        <span>{dateTime.toLocaleDateString()}</span>
        <span>{dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}

interface MenuProps {
  variant?: 'full' | 'square';
}

export const Menu = ({ variant = 'full' }: MenuProps) => {
  const { duplicateCurrentChat, exportChat } = useChatHistory();
  const menuRef = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<ChatHistoryItem[]>([]);
  const open = useStore(sidebarOpen);
  const isPinned = useStore(sidebarPinned);
  const chat = useStore(chatStore);
  const [dialogContent, setDialogContent] = useState<DialogContent>(null);
  const isSettingsOpen = useStore(settingsOpenStore);
  const activeSettingsTab = useStore(settingsTabStore);
  const profile = useStore(profileStore) as any;

  const tabConfiguration = useStore(tabConfigurationStore);
  const baseTabConfig = useMemo(() => {
    return new Map(DEFAULT_TAB_CONFIG.map((tab) => [tab.id, tab]));
  }, []);

  const visibleTabs = useMemo(() => {
    if (!tabConfiguration?.userTabs || !Array.isArray(tabConfiguration.userTabs)) {
      resetTabConfiguration();
      return [];
    }

    const notificationsDisabled = profile?.preferences?.notifications === false;

    return tabConfiguration.userTabs
      .filter((tab) => {
        if (!tab?.id) return false;
        if (tab.id === 'notifications' && notificationsDisabled) return false;
        return tab.visible && tab.window === 'user';
      })
      .sort((a, b) => a.order - b.order);
  }, [tabConfiguration, profile?.preferences?.notifications, baseTabConfig]);
  const { user } = useAuth();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { filteredItems: filteredList, handleSearchChange } = useSearchFilter({
    items: list,
    searchFields: ['description'],
  });

  const loadEntries = useCallback(() => {
    if (db) {
      getAll(db)
        .then(setList)
        .catch((error) => toast.error(error.message));
    }
  }, []);

  const deleteChat = useCallback(
    async (id: string): Promise<void> => {
      if (!db) {
        throw new Error('Database not available');
      }

      try {
        const snapshotKey = `snapshot:${id}`;
        localStorage.removeItem(snapshotKey);
        console.log('Removed snapshot for chat:', id);
      } catch (snapshotError) {
        console.error(`Error deleting snapshot for chat ${id}:`, snapshotError);
      }

      await deleteById(db, id);
      console.log('Successfully deleted chat:', id);
    },
    [db],
  );

  const deleteItem = useCallback(
    (event: React.UIEvent, item: ChatHistoryItem) => {
      event.preventDefault();
      event.stopPropagation();

      console.log('Attempting to delete chat:', { id: item.id, description: item.description });

      deleteChat(item.id)
        .then(() => {
          toast.success('Chat deleted successfully', {
            position: 'bottom-right',
            autoClose: 3000,
          });

          loadEntries();

          if (chatId.get() === item.id) {
            console.log('Navigating away from deleted chat');
            window.location.pathname = '/';
          }
        })
        .catch((error) => {
          console.error('Failed to delete chat:', error);
          toast.error('Failed to delete conversation', {
            position: 'bottom-right',
            autoClose: 3000,
          });

          loadEntries();
        });
    },
    [loadEntries, deleteChat],
  );

  const deleteSelectedItems = useCallback(
    async (itemsToDeleteIds: string[]) => {
      if (!db || itemsToDeleteIds.length === 0) {
        console.log('Bulk delete skipped: No DB or no items to delete.');
        return;
      }

      console.log(`Starting bulk delete for ${itemsToDeleteIds.length} chats`, itemsToDeleteIds);

      let deletedCount = 0;
      const errors: string[] = [];
      const currentChatId = chatId.get();
      let shouldNavigate = false;

      for (const id of itemsToDeleteIds) {
        try {
          await deleteChat(id);
          deletedCount++;

          if (id === currentChatId) {
            shouldNavigate = true;
          }
        } catch (error) {
          console.error(`Error deleting chat ${id}:`, error);
          errors.push(id);
        }
      }

      if (errors.length === 0) {
        toast.success(`${deletedCount} chat${deletedCount === 1 ? '' : 's'} deleted successfully`);
      } else {
        toast.warning(`Deleted ${deletedCount} of ${itemsToDeleteIds.length} chats. ${errors.length} failed.`, {
          autoClose: 5000,
        });
      }

      await loadEntries();

      setSelectedItems([]);
      setSelectionMode(false);

      if (shouldNavigate) {
        console.log('Navigating away from deleted chat');
        window.location.pathname = '/';
      }
    },
    [deleteChat, loadEntries, db],
  );

  const closeDialog = () => {
    setDialogContent(null);
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);

    if (selectionMode) {
      setSelectedItems([]);
    }
  };

  const toggleItemSelection = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const newSelectedItems = prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id];
      console.log('Selected items updated:', newSelectedItems);
      return newSelectedItems;
    });
  }, []);

  const handleBulkDeleteClick = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.info('Select at least one chat to delete');
      return;
    }

    const selectedChats = list.filter((item) => selectedItems.includes(item.id));

    if (selectedChats.length === 0) {
      toast.error('Could not find selected chats');
      return;
    }

    setDialogContent({ type: 'bulkDelete', items: selectedChats });
  }, [selectedItems, list]);

  const selectAll = useCallback(() => {
    const allFilteredIds = filteredList.map((item) => item.id);
    setSelectedItems((prev) => {
      const allFilteredAreSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => prev.includes(id));

      if (allFilteredAreSelected) {
        const newSelectedItems = prev.filter((id) => !allFilteredIds.includes(id));
        console.log('Deselecting all filtered items. New selection:', newSelectedItems);
        return newSelectedItems;
      } else {
        const newSelectedItems = [...new Set([...prev, ...allFilteredIds])];
        console.log('Selecting all filtered items. New selection:', newSelectedItems);
        return newSelectedItems;
      }
    });
  }, [filteredList]);

  useEffect(() => {
    if (open) {
      loadEntries();
    }
  }, [open, loadEntries]);

  useEffect(() => {
    if (!open && selectionMode) {
      console.log('Sidebar closed, preserving selection state');
    }
  }, [open, selectionMode]);

  const prevVariant = useRef<string | null>(null);

  useEffect(() => {
    // If the layout is 'square' and we haven't seen it before (e.g. initial mount or transition to it), open it by default
    if (variant === 'square' && prevVariant.current !== 'square') {
      sidebarOpen.set(true);
    } else if (variant !== 'square') {
      // Old behavior for 'full' variant
      if (!chat.started && isPinned) {
        sidebarOpen.set(true);
      } else {
        sidebarOpen.set(false);
      }
    }
    prevVariant.current = variant;
  }, [chat.started, isPinned, variant]);

  useEffect(() => {
    const enterThreshold = 20;
    const exitThreshold = 20;

    function onMouseMove(event: MouseEvent) {
      if (variant === 'square') return;
      if (isSettingsOpen) {
        return;
      }

      if (!chat.started && isPinned) {
        return;
      }

      if (event.pageX < enterThreshold) {
        sidebarOpen.set(true);
      }

      if (menuRef.current && event.clientX > menuRef.current.getBoundingClientRect().right + exitThreshold) {
        sidebarOpen.set(false);
      }
    }

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [variant, isSettingsOpen, chat.started, isPinned]);

  const handleDuplicate = async (id: string) => {
    await duplicateCurrentChat(id);
    loadEntries();
  };

  const handleSettingsClick = () => {
    settingsOpenStore.set(true);
    sidebarOpen.set(true);
  };

  const handleSettingsClose = () => {
    settingsOpenStore.set(false);
  };

  const setDialogContentWithLogging = useCallback((content: DialogContent) => {
    console.log('Setting dialog content:', content);
    setDialogContent(content);
  }, []);

  return (
    <>
      {/* Mobile Backdrop for Square Layout */}
      {open && variant === 'square' && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => sidebarOpen.set(false)}
        />
      )}
      <motion.div
        ref={menuRef}
        initial={variant === 'square' ? 'open' : 'closed'}
        animate={open ? 'open' : 'closed'}
        variants={variant === 'square' ? squareMenuVariants : fullMenuVariants}
        style={variant === 'full' ? { width: '340px' } : {}}
        className={classNames(
          variant === 'square'
            ? classNames(
              'flex selection-accent flex-col side-menu h-full overflow-hidden shrink-0 border-none text-sm',
              'absolute md:relative left-0 top-0 bottom-0 bg-white dark:bg-[#111114] md:bg-transparent shadow-xl md:shadow-none z-50 md:z-sidebar',
              !open && 'max-md:!w-0 max-md:!opacity-0 max-md:!p-0 pointer-events-none md:pointer-events-auto'
            )
            : 'flex selection-accent flex-col side-menu fixed top-0 h-full bg-white dark:bg-[#111114] border-r border-falbor-elements-borderColor shadow-sm text-sm',
          variant === 'full' && isSettingsOpen ? 'z-40' : (variant === 'full' ? 'z-sidebar' : '')
        )}
      >
        {variant === 'square' ? (
          <div className={classNames(
            "h-14 flex items-center px-4 gap-2 border-b border-transparent bg-transparent transition-all",
            open ? "justify-between" : "justify-center"
          )}>
            {open ? (
              <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                <a href="/" className="text-2xl font-semibold text-accent-500 flex items-center" onClick={(e) => e.stopPropagation()}>
                  <img src="/logo-light-styled.png" alt="logo" className="w-[130px] inline-block dark:hidden" />
                  <img src="/logo-dark-styled.png" alt="logo" className="w-[130px] inline-block hidden dark:block" />
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 rounded-md bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold">L</div>
              </div>
            )}
            <div className="flex items-center gap-1">
              {open && (
                <>
                  <ThemeSwitch />
                  <SettingsButton onClick={handleSettingsClick} />
                </>
              )}
              <button
                onClick={() => sidebarOpen.set(!open)}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                title="Toggle Sidebar"
              >
                <div className="i-ph:sidebar w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-14 flex items-center justify-end px-4 gap-2 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50">
            <ThemeSwitch />
            <SettingsButton onClick={handleSettingsClick} />
          </div>
        )}
        <div className={classNames("flex-1 flex flex-col h-full w-full overflow-hidden", variant === 'square' ? "transition-opacity duration-200" : "", variant === 'square' && !open ? "opacity-0 pointer-events-none" : "opacity-100")}>
          {isSettingsOpen ? (
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 modern-scrollbar">
              <div className="flex items-center justify-between mb-3 px-3">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Settings
                </div>
                <button
                  onClick={handleSettingsClose}
                  className="text-xs font-medium text-falbor-elements-textSecondary hover:text-falbor-elements-textPrimary flex items-center gap-1 transition-colors"
                >
                  <div className="i-ph:arrow-left w-3 h-3" />
                  Back to Chats
                </button>
              </div>
              {visibleTabs.map((tab) => {
                const Icon = TAB_ICONS[tab.id as TabType];
                const isSelected = activeSettingsTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => settingsTabStore.set(tab.id as TabType)}
                    className={classNames(
                      'flex items-center gap-3 w-full px-3 py-1.5 rounded-md text-sm font-medium text-left',
                      isSelected
                        ? 'bg-falbor-elements-background-depth-3 text-falbor-elements-textPrimary font-semibold'
                        : 'text-falbor-elements-textSecondary hover:bg-falbor-elements-background-depth-3 hover:text-falbor-elements-textPrimary',
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{TAB_LABELS[tab.id as TabType]}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="relative w-full">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    {/* ✅ FIX: added `block` so the icon element has dimensions */}
                    <span className="i-ph:magnifying-glass block h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    className="w-full bg-gray-50 dark:bg-gray-900 relative pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 border border-gray-200 dark:border-gray-800"
                    type="search"
                    placeholder="Search chats..."
                    onChange={handleSearchChange}
                    aria-label="Search chats"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm px-4 py-2">
                <div className="font-medium text-gray-600 dark:text-gray-400">Your Chats</div>
                {selectionMode && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={selectAll}>
                      {selectedItems.length === filteredList.length ? 'Deselect all' : 'Select all'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDeleteClick}
                      disabled={selectedItems.length === 0}
                    >
                      Delete selected
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-auto px-3 pb-3">
                {filteredList.length === 0 && (
                  <div className="px-4 text-gray-500 dark:text-gray-400 text-sm">
                    {list.length === 0 ? 'No previous conversations' : 'No matches found'}
                  </div>
                )}
                <DialogRoot open={dialogContent !== null}>
                  {binDates(filteredList).map(({ category, items }) => (
                    <div key={category} className="mt-2 first:mt-0 space-y-1">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 sticky top-0 z-1 bg-white dark:bg-gray-950 px-4 py-1">
                        {category}
                      </div>
                      <div className="space-y-0.5 pr-1">
                        {items.map((item) => (
                          <HistoryItem
                            key={item.id}
                            item={item}
                            exportChat={exportChat}
                            onDelete={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              console.log('Delete triggered for item:', item);
                              setDialogContentWithLogging({ type: 'delete', item });
                            }}
                            onDuplicate={() => handleDuplicate(item.id)}
                            selectionMode={selectionMode}
                            isSelected={selectedItems.includes(item.id)}
                            onToggleSelection={toggleItemSelection}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  <Dialog onBackdrop={closeDialog} onClose={closeDialog}>
                    {dialogContent?.type === 'delete' && (
                      <>
                        <div className="p-6 bg-white dark:bg-gray-950">
                          <DialogTitle className="text-gray-900 dark:text-white">Delete Chat?</DialogTitle>
                          <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
                            <p>
                              You are about to delete{' '}
                              <span className="font-medium text-gray-900 dark:text-white">
                                {dialogContent.item.description}
                              </span>
                            </p>
                            <p className="mt-2">Are you sure you want to delete this chat?</p>
                          </DialogDescription>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                          <DialogButton type="secondary" onClick={closeDialog}>
                            Cancel
                          </DialogButton>
                          <DialogButton
                            type="danger"
                            onClick={(event) => {
                              console.log('Dialog delete button clicked for item:', dialogContent.item);
                              deleteItem(event, dialogContent.item);
                              closeDialog();
                            }}
                          >
                            Delete
                          </DialogButton>
                        </div>
                      </>
                    )}
                    {dialogContent?.type === 'bulkDelete' && (
                      <>
                        <div className="p-6 bg-white dark:bg-gray-950">
                          <DialogTitle className="text-gray-900 dark:text-white">Delete Selected Chats?</DialogTitle>
                          <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
                            <p>
                              You are about to delete {dialogContent.items.length}{' '}
                              {dialogContent.items.length === 1 ? 'chat' : 'chats'}:
                            </p>
                            <div className="mt-2 max-h-32 overflow-auto border border-gray-100 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-900 p-2">
                              <ul className="list-disc pl-5 space-y-1">
                                {dialogContent.items.map((item) => (
                                  <li key={item.id} className="text-sm">
                                    <span className="font-medium text-gray-900 dark:text-white">{item.description}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <p className="mt-3">Are you sure you want to delete these chats?</p>
                          </DialogDescription>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                          <DialogButton type="secondary" onClick={closeDialog}>
                            Cancel
                          </DialogButton>
                          <DialogButton
                            type="danger"
                            onClick={() => {
                              const itemsToDeleteNow = [...selectedItems];
                              console.log('Bulk delete confirmed for', itemsToDeleteNow.length, 'items', itemsToDeleteNow);
                              deleteSelectedItems(itemsToDeleteNow);
                              closeDialog();
                            }}
                          >
                            Delete
                          </DialogButton>
                        </div>
                      </>
                    )}
                  </Dialog>
                </DialogRoot>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};