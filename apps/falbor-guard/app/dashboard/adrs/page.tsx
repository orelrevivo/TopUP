import { getConnectedRepositories } from '@/actions/github';
import { getAdrRules } from '@/actions/adrs';
import AdrsClient from '@/components/AdrsClient';

export default async function AdrsPage() {
  const repos = await getConnectedRepositories();
  
  // Fetch rules for all repos to pass down (in a real app you might load these per repo, but this works for MVP)
  const allRulesPromises = repos.map(repo => getAdrRules(repo.id));
  const rulesArrays = await Promise.all(allRulesPromises);
  const rules = rulesArrays.flat();

  return <AdrsClient repos={repos} rules={rules} />;
}
