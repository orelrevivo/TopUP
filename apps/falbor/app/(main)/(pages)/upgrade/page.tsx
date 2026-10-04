import React, { Suspense } from 'react';
import { UpgradeView } from '~/components/billing/UpgradeView';

export default function GlobalUpgradePage() {
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-black p-6 md:p-10">
      <Suspense fallback={null}>
        <UpgradeView paypalClientId={paypalClientId} />
      </Suspense>
    </div>
  );
}

