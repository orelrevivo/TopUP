'use client';

import { useState } from 'react';
import { fetchGitHubRepositories, connectRepository } from '@/actions/github';

export default function RepositoriesClient({ initialRepos, isConnected }: { initialRepos: any[], isConnected: boolean }) {
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const loadGithubRepos = async () => {
    setLoading(true);
    setError('');
    try {
      const repos = await fetchGitHubRepositories();
      setGithubRepos(repos);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch repositories.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectRepo = async (repo: any) => {
    try {
      await connectRepository(repo.id, repo.name, repo.fullName);
      setGithubRepos(githubRepos.filter(r => r.id !== repo.id)); // Remove from available list
    } catch (err: any) {
      alert('Failed to connect: ' + err.message);
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Repositories
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 gap-3">
          {isConnected ? (
            <button 
              onClick={loadGithubRepos}
              disabled={loading}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Fetching...' : 'Fetch from GitHub'}
            </button>
          ) : (
            <a
              href="/dashboard/settings"
              className="inline-flex items-center rounded-md bg-[#24292F] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#24292F]/90"
            >
              Go to Settings to Connect GitHub
            </a>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {githubRepos.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Available on GitHub</h3>
          <ul role="list" className="divide-y divide-gray-100 border border-gray-200 rounded-md bg-white">
            {githubRepos.map((repo) => (
              <li key={repo.id} className="flex items-center justify-between gap-x-6 py-4 px-6">
                <div className="min-w-0">
                  <div className="flex items-start gap-x-3">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{repo.fullName}</p>
                    {repo.private && (
                      <span className="rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset text-gray-600 bg-gray-50 ring-gray-500/10">
                        Private
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-none items-center gap-x-4">
                  <button
                    onClick={() => handleConnectRepo(repo)}
                    className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                  >
                    Connect
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Connected Repositories</h3>
        {initialRepos.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-16 text-center text-gray-500">
            <p>No repositories connected yet. Fetch from GitHub to start.</p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-100 border border-gray-200 rounded-md bg-white">
            {initialRepos.map((repo) => (
              <li key={repo.id} className="flex items-center justify-between gap-x-6 py-4 px-6 hover:bg-gray-50 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-start gap-x-3">
                    <a href={`/dashboard/repositories/${repo.id}`} className="text-sm font-semibold leading-6 text-indigo-600 hover:underline">
                      {repo.fullName}
                    </a>
                    <span className="rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset text-green-700 bg-green-50 ring-green-600/20">
                      Connected
                    </span>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-x-4">
                  <a
                    href={`/dashboard/repositories/${repo.id}`}
                    className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                  >
                    View Details &rarr;
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
