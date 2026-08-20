import { getReports } from '@/actions/reports';
import { getConnectedRepositories } from '@/actions/github';
import ReportsClient from '@/components/ReportsClient';

export default async function ReportsPage() {
  const reports = await getReports();
  const repos = await getConnectedRepositories();
  
  return <ReportsClient reports={reports} repos={repos} />;
}
