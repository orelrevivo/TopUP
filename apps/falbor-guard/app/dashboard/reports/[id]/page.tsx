import { getReportById } from '@/actions/reports';
import { getConnectedRepositories } from '@/actions/github';
import ReportDetailClient from '@/components/ReportDetailClient';

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const report = await getReportById(params.id);
  const repos = await getConnectedRepositories();
  const repo = report ? repos.find(r => r.id === report.repositoryId) : null;
  
  return <ReportDetailClient report={report} repo={repo} />;
}
