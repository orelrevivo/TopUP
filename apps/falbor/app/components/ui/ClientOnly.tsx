'use client';
import { useState, useEffect } from 'react';

export function ClientOnly({ children, fallback = null }: { children: () => React.ReactNode, fallback?: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return <>{children()}</>;
}
