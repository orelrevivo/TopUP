'use client';
import React from 'react';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import type { StorageBucket, StorageFile } from './types';

interface StorageTabProps {
  buckets: StorageBucket[];
  files: StorageFile[];
  selectedBucket: string | null;
  onSelectBucket: (id: string) => void;
  onBack: () => void;
}

export function StorageTab({ buckets, files, selectedBucket, onSelectBucket, onBack }: StorageTabProps) {
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {selectedBucket ? `Bucket: ${selectedBucket}` : 'Storage Buckets'}
          </h1>
          <p className="text-sm text-falbor-elements-textSecondary mt-0.5">
            Manage files and assets stored in Supabase Storage
          </p>
        </div>
        {selectedBucket && (
          <Button variant="outline" size="sm" onClick={onBack}>
            ← Back
          </Button>
        )}
      </div>

      {!selectedBucket ? (
        <Card className="border-falbor-elements-borderColor">
          {buckets.length > 0 ? (
            <div className="divide-y divide-falbor-elements-borderColor">
              {buckets.map((b) => (
                <div
                  key={b.id}
                  onClick={() => onSelectBucket(b.id)}
                  className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-falbor-elements-background-depth-2 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="i-ph:folder-open text-falbor-elements-textTertiary group-hover:text-[#3ECF8E] text-xl" />
                    <div>
                      <p className="font-medium text-sm">{b.name}</p>
                      <p className="text-xs text-falbor-elements-textTertiary">
                        {b.public ? 'Public' : 'Private'} · Created {new Date(b.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="i-ph:caret-right text-falbor-elements-textTertiary text-sm" />
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-falbor-elements-textTertiary italic">
              No storage buckets found.
            </p>
          )}
        </Card>
      ) : (
        <Card className="border-falbor-elements-borderColor overflow-hidden">
          {files.length > 0 ? (
            <div className="divide-y divide-falbor-elements-borderColor">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-falbor-elements-background-depth-2">
                  <div className="i-ph:file text-falbor-elements-textTertiary text-base" />
                  <span className="text-sm font-medium flex-1 truncate">{f.name}</span>
                  <span className="text-xs text-falbor-elements-textTertiary">
                    {new Date(f.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-falbor-elements-textTertiary italic">
              This bucket is empty.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
