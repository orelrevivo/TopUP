'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchRealPRs, fetchPRDiff, fetchRepositoryDetails } from '@/actions/github';

export default function RepoDetailClient({ repo, rulesCount, reports, isConnected }: { repo: any, rulesCount: number, reports: any[], isConnected: boolean }) {
  const router = useRouter();
  const [realPRs, setRealPRs] = useState<any[]>([]);
  const [loadingPRs, setLoadingPRs] = useState(false);
  const [errorPRs, setErrorPRs] = useState('');
  const [analyzingPR, setAnalyzingPR] = useState('');
  const [repoDetails, setRepoDetails] = useState<any>(null);

  useEffect(() => {
    if (repo && isConnected) {
      loadRealPRs();
      loadRepoDetails();
    }
  }, [repo, isConnected]);

  const loadRepoDetails = async () => {
    try {
      const details = await fetchRepositoryDetails(repo.fullName);
      setRepoDetails(details);
    } catch (err: any) {
      console.error(err);
    }
  };

  const loadRealPRs = async () => {
    setLoadingPRs(true);
    setErrorPRs('');
    try {
      const prs = await fetchRealPRs(repo.fullName);
      setRealPRs(prs);
    } catch (err: any) {
      setErrorPRs(err.message || 'Failed to fetch PRs');
    } finally {
      setLoadingPRs(false);
    }
  };

  if (!repo) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900">Add a repository first.</h2>
        <a href="/dashboard/repositories" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
          &larr; Back to Repositories
        </a>
      </div>
    );
  }

  const handleAnalyzeRealPR = async (pr: any) => {
    setAnalyzingPR(pr.id);
    try {
      const diffText = await fetchPRDiff(pr.diffUrl);
      
      const query = new URLSearchParams({
        repoId: repo.id,
        title: pr.title,
        diff: diffText,
      });
      router.push(`/dashboard/demo-analyzer?${query.toString()}`);
    } catch (err: any) {
      alert("Failed to run analysis: " + err.message);
      setAnalyzingPR('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-6">
        <a href="/dashboard/repositories" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          &larr; Back to Repositories
        </a>
      </div>
      
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center gap-3">
            {repo.fullName}
            <span className="rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset text-green-700 bg-green-50 ring-green-600/20">
              Connected
            </span>
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {repoDetails ? (
              <>
                <a href={repoDetails.html_url} target="_blank" className="hover:underline">{repoDetails.html_url}</a> • 
                Default branch: <span className="font-mono">{repoDetails.default_branch}</span> • 
              </>
            ) : null}
            Added {new Date(repo.connectedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Setup */}
        <div className="space-y-8">
          <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Repository Stats</h3>
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">Active Rules</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{rulesCount}</dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">PR Reports</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{reports.length}</dd>
              </div>
            </dl>
            <div className="mt-6 text-sm">
              <a href="/dashboard/adrs" className="text-indigo-600 hover:text-indigo-500 font-medium">Manage Rules &rarr;</a>
            </div>
          </div>
          
          <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            <h3 className="text-base font-semibold leading-6 text-gray-900 mb-2">Recent Reports</h3>
            {reports.length === 0 ? (
              <p className="text-sm text-gray-500">No reports generated yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {reports.slice(0, 5).map(report => (
                  <li key={report.id} className="py-3 flex justify-between items-center">
                    <a href={`/dashboard/reports/${report.id}`} className="text-sm font-medium text-indigo-600 hover:underline truncate mr-4">
                      PR #{report.prNumber}
                    </a>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        report.riskLevel === 'High' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                        report.riskLevel === 'Medium' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                        'bg-green-50 text-green-700 ring-green-600/20'
                      }`}>
                        {report.riskLevel}
                      </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Open PRs (Real) */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden flex flex-col min-h-full">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Pull Requests</h3>
              {isConnected && (
                <button onClick={loadRealPRs} disabled={loadingPRs} className="text-xs font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1 disabled:opacity-50">
                  <svg className={`w-3 h-3 ${loadingPRs ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {loadingPRs ? 'Fetching...' : 'Fetch PRs'}
                </button>
              )}
            </div>
            
            {!isConnected ? (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500 mb-4">Connect GitHub token to fetch pull requests.</p>
                <a href="/dashboard/repositories" className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Go to Repositories</a>
              </div>
            ) : errorPRs ? (
              <div className="p-12 text-center text-red-600 text-sm">
                {errorPRs}
              </div>
            ) : realPRs.length === 0 && !loadingPRs ? (
               <div className="p-12 text-center text-sm text-gray-500">
                 No open pull requests found.
               </div>
            ) : (
              <ul className="divide-y divide-gray-200 flex-1">
                {realPRs.map(pr => (
                  <li key={pr.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900">
                          <a href={pr.url} target="_blank" className="hover:underline">{pr.title}</a> <span className="text-gray-400 font-normal">#{pr.number}</span>
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <span className="font-medium text-gray-900">{pr.author}</span>
                          <span>•</span>
                          <span className="font-mono text-xs bg-gray-100 px-1 rounded">{pr.branch}</span>
                          <span>•</span>
                          <span className="capitalize text-green-600 font-medium">{pr.status}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAnalyzeRealPR(pr)}
                        disabled={analyzingPR === pr.id}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                      >
                        {analyzingPR === pr.id ? 'Loading Diff...' : 'Analyze PR'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
              Fetching real PRs directly from the GitHub API.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
