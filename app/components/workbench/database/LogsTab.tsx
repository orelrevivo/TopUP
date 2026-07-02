'use client';
import React from 'react';
import { Card } from '~/components/ui/Card';

export function LogsTab() {
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold">Logs</h1>
        <p className="text-sm text-falbor-elements-textSecondary mt-0.5">Database and API activity logs</p>
      </div>

      <Card className="border-falbor-elements-borderColor">
        <div className="p-8 text-center space-y-3">
          <div className="i-ph:info text-3xl text-falbor-elements-textTertiary mx-auto" />
          <h3 className="font-medium">Logs via Supabase Management API</h3>
          <p className="text-sm text-falbor-elements-textSecondary max-w-sm mx-auto">
            Real-time logs are available directly in your{' '}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3ECF8E] underline hover:text-[#35c07f]"
            >
              Supabase Dashboard
            </a>
            . The Management API does not expose raw logs — this is a Supabase platform limitation.
          </p>
        </div>
      </Card>
    </div>
  );
}
