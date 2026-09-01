import { Suspense } from 'react';
import { getConnectedRepositories } from '@/actions/github';
import DemoAnalyzerClient from '@/components/DemoAnalyzerClient';

export default async function DemoAnalyzerPage() {
  const repos = await getConnectedRepositories();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DemoAnalyzerClient repos={repos} />
    </Suspense>
  );
}
