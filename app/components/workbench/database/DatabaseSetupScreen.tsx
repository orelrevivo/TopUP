'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';

interface DatabaseSetupScreenProps {
  onConnectSupabase: () => void;
  onCreateDatabase: () => void;
}

export function DatabaseSetupScreen({ onConnectSupabase, onCreateDatabase }: DatabaseSetupScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-falbor-elements-background-depth-1">
      <Card className="max-w-md w-full border-falbor-elements-borderColor shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-accent-500/10 text-accent-500">
            <div className="i-ph:database-duotone text-3xl" />
          </div>
          <CardTitle>Power up your backend with Falbor Database</CardTitle>
          <CardDescription className="mt-2">
            Ask Falbor to create a database to unlock these services.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-8">
          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              onClick={onConnectSupabase}
              className="w-full flex items-center justify-center gap-2 bg-[#098F5F] hover:bg-[#0aa06c] text-white"
            >
              <img
                height="16"
                width="16"
                crossOrigin="anonymous"
                src="https://cdn.simpleicons.org/supabase/white"
                alt="Supabase"
                className="opacity-90"
              />
              Connect to Supabase
            </Button>
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-falbor-elements-borderColor" />
              <span className="flex-shrink-0 mx-4 text-sm text-falbor-elements-textTertiary">or</span>
              <div className="flex-grow border-t border-falbor-elements-borderColor" />
            </div>
            <Button
              size="lg"
              onClick={onCreateDatabase}
              className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white"
            >
              <div className="i-ph:magic-wand-duotone text-lg" />
              Ask Falbor to create a database
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
