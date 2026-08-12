'use client';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { toast } from 'react-toastify';
import { workbenchStore } from '~/lib/stores/workbench';
import { chatId } from '~/lib/persistence/useChatHistory';
import { StudioSidebar } from './database/StudioSidebar';
import { DatabaseSetupScreen } from './database/DatabaseSetupScreen';
import { TablesTab } from './database/TablesTab';
import { AuthTab } from './database/AuthTab';
import { StorageTab } from './database/StorageTab';
import { FunctionsTab } from './database/FunctionsTab';
import { LogsTab } from './database/LogsTab';
import type {
  ActiveTab,
  DbTable,
  DbUser,
  StorageBucket,
  StorageFile,
  DbFunction,
  TableData,
} from './database/types';

interface DatabaseViewProps {
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
}

const POLL_INTERVAL = 5000;

export const DatabaseView = memo(({ sendMessage }: DatabaseViewProps) => {
  const currentChatId = useStore(chatId);

  const [isEnvConfigured, setIsEnvConfigured] = useState(false);
  const [sqlMigrationFiles, setSqlMigrationFiles] = useState<[string, any][]>([]);
  const [isPushing, setIsPushing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('tables');
  const [dbTables, setDbTables] = useState<DbTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [dbUsers, setDbUsers] = useState<DbUser[]>([]);
  const [storageBuckets, setStorageBuckets] = useState<StorageBucket[]>([]);
  const [storageFiles, setStorageFiles] = useState<StorageFile[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [dbFunctions, setDbFunctions] = useState<DbFunction[]>([]);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = workbenchStore.files.subscribe((files) => {
      let found = false;
      for (const [path, file] of Object.entries(files)) {
        if (path.endsWith('.env') && file?.type === 'file' && typeof file.content === 'string') {
          if (
            file.content.includes('VITE_SUPABASE_URL') ||
            file.content.includes('NEXT_PUBLIC_SUPABASE_URL') ||
            file.content.includes('SUPABASE_URL')
          ) {
            found = true;
            break;
          }
        }
      }
      setIsEnvConfigured(found);
      setSqlMigrationFiles(
        Object.entries(files)
          .filter(([p]) => p.endsWith('.sql'))
          .sort(([a], [b]) => a.localeCompare(b)),
      );
    });
    return unsubscribe;
  }, []);

  const adminFetch = useCallback(
    async (action: string, payload?: any) => {
      if (!currentChatId) return null;
      const res = await fetch('/api/database/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: currentChatId, action, payload }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      return res.json();
    },
    [currentChatId],
  );

  const fetchData = useCallback(async () => {
    if (!isEnvConfigured || !currentChatId) return;
    setIsLoading(true);
    try {
      if (activeTab === 'tables' && !selectedTable) {
        const data = await adminFetch('get_tables');
        if (data?.tables) setDbTables(data.tables);
      } else if (activeTab === 'tables' && selectedTable) {
        const data = await adminFetch('get_table_data', { tableName: selectedTable });
        if (data?.columns) setTableData(data);
      } else if (activeTab === 'auth') {
        const data = await adminFetch('get_users');
        if (data?.users) setDbUsers(data.users);
      } else if (activeTab === 'storage' && !selectedBucket) {
        const data = await adminFetch('get_storage_buckets');
        if (data?.buckets) setStorageBuckets(data.buckets);
      } else if (activeTab === 'storage' && selectedBucket) {
        const data = await adminFetch('get_storage_files', { bucketId: selectedBucket });
        if (data?.files) setStorageFiles(data.files);
      } else if (activeTab === 'functions') {
        const data = await adminFetch('get_functions');
        if (data?.functions) setDbFunctions(data.functions);
      }
      setLastUpdated(new Date());
    } catch (e: any) {
      console.error('Dashboard fetch error:', e.message);
    } finally {
      setIsLoading(false);
    }
  }, [isEnvConfigured, currentChatId, activeTab, selectedTable, selectedBucket, adminFetch]);

  useEffect(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    fetchData();
    pollingRef.current = setInterval(fetchData, POLL_INTERVAL);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchData]);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSelectedTable(null);
    setSelectedBucket(null);
    setTableData(null);
    setStorageFiles([]);
  };

  const handlePushMigrations = async () => {
    if (!currentChatId) return;
    setIsPushing(true);
    try {
      if (!sqlMigrationFiles.length) {
        toast.info('No SQL migration files found to push.');
        return;
      }
      toast.info(`Pushing ${sqlMigrationFiles.length} migration(s)...`);
      for (const [path, file] of sqlMigrationFiles) {
        if (file?.type === 'file' && file.content) {
          const res = await fetch('/api/database/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId: currentChatId, sql: file.content }),
          });
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(`Failed to push ${path}: ${errorData.message || res.statusText}`);
          }
        }
      }
      toast.success('Successfully pushed all migrations to Supabase!');
      fetchData();
    } catch (e: any) {
      toast.error(e.message || 'Failed to push migrations');
    } finally {
      setIsPushing(false);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const data = await adminFetch(action, { userId });
      if (data?.success) {
        toast.success('Action completed successfully!');
        fetchData();
      }
    } catch (e: any) {
      toast.error(e.message || 'Action failed');
    }
  };

  if (!isEnvConfigured) {
    return (
      <DatabaseSetupScreen
        onConnectSupabase={() => document.dispatchEvent(new CustomEvent('open-supabase-connection'))}
        onCreateDatabase={() => sendMessage?.({} as any, 'Create a database for this project')}
      />
    );
  }

  return (
    <div className="flex h-full bg-falbor-elements-background-depth-1 text-falbor-elements-textPrimary overflow-hidden">
      <StudioSidebar
        activeTab={activeTab}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        onTabChange={handleTabChange}
      />

      <div className="flex-1 overflow-auto">
        {activeTab === 'tables' && (
          <TablesTab
            sqlMigrationFiles={sqlMigrationFiles}
            dbTables={dbTables}
            selectedTable={selectedTable}
            tableData={tableData}
            isPushing={isPushing}
            onPushMigrations={handlePushMigrations}
            onSelectTable={(name) => setSelectedTable(name)}
            onBack={() => { setSelectedTable(null); setTableData(null); }}
          />
        )}
        {activeTab === 'auth' && (
          <AuthTab users={dbUsers} onUserAction={handleUserAction} />
        )}
        {activeTab === 'storage' && (
          <StorageTab
            buckets={storageBuckets}
            files={storageFiles}
            selectedBucket={selectedBucket}
            onSelectBucket={(id) => setSelectedBucket(id)}
            onBack={() => { setSelectedBucket(null); setStorageFiles([]); }}
          />
        )}
        {activeTab === 'functions' && <FunctionsTab functions={dbFunctions} />}
        {activeTab === 'logs' && <LogsTab />}
      </div>
    </div>
  );
});

DatabaseView.displayName = 'DatabaseView';
