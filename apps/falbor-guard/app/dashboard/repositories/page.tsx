import { getConnectedRepositories, isGitHubConnected } from '@/actions/github';
import RepositoriesClient from '@/components/RepositoriesClient';

export default async function RepositoriesPage() {
  const initialRepos = await getConnectedRepositories();
  const isConnected = await isGitHubConnected();
  
  return <RepositoriesClient initialRepos={initialRepos} isConnected={isConnected} />;
}
