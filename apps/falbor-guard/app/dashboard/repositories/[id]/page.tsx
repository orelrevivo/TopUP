import { getConnectedRepositories, isGitHubConnected } from '@/actions/github';
import { getAdrRules } from '@/actions/adrs';
import { getReports } from '@/actions/reports';
import RepoDetailClient from '@/components/RepoDetailClient';

export default async function RepositoryDetailPage({ params }: { params: { id: string } }) {
  const repos = await getConnectedRepositories();
  const repo = repos.find(r => r.id === params.id);
  const isConnected = await isGitHubConnected();
  
  if (!repo) {
    return <RepoDetailClient repo={null} rulesCount={0} reports={[]} isConnected={isConnected} />;
  }

  const rules = await getAdrRules(repo.id);
  const allReports = await getReports();
  const repoReports = allReports.filter(r => r.repositoryId === repo.id);

  return <RepoDetailClient repo={repo} rulesCount={rules.length} reports={repoReports} isConnected={isConnected} />;
}
