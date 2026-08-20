'use client';

import { useState } from 'react';
import { saveGitHubToken, disconnectGitHub } from '@/actions/github';
import { updateGlobalSettings } from '@/actions/settings';

export default function SettingsClient({ initialStatus, initialSettings }: { initialStatus: any, initialSettings: any }) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [activeTab, setActiveTab] = useState('github');

  const [analyzerSettings, setAnalyzerSettings] = useState({
    riskyPathKeywords: initialSettings.riskyPathKeywords,
    largePrThreshold: initialSettings.largePrThreshold,
    missingTests: initialSettings.missingTests,
    dependencyChange: initialSettings.dependencyChange
  });

  const [reportSettings, setReportSettings] = useState({
    reportFormat: initialSettings.reportFormat,
    includeLowRisk: initialSettings.includeLowRisk,
    enablePostToGitHub: initialSettings.enablePostToGitHub
  });

  const handleConnectToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveGitHubToken(token);
      // Let server revalidate and we refresh
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    await disconnectGitHub();
    window.location.reload();
  };

  const handleSaveAnalyzerSettings = async () => {
    try {
      await updateGlobalSettings({ ...analyzerSettings });
      alert('Analyzer Settings saved to database.');
    } catch (err: any) {
      alert('Failed to save settings: ' + err.message);
    }
  };

  const handleSaveReportSettings = async () => {
    try {
      await updateGlobalSettings({ ...reportSettings });
      alert('Report Settings saved to database.');
    } catch (err: any) {
      alert('Failed to save settings: ' + err.message);
    }
  };

  const hasRepoScope = status.permissions.includes('repo');

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your integrations, rules, and privacy preferences.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Vertical Tabs Navigation */}
        <aside className="md:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => setActiveTab('github')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'github' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              GitHub Integration
            </button>
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'analyzer' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              Analyzer Settings
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'reports' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              Report Settings
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'privacy' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              Privacy & Data
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          {activeTab === 'github' && (
            <div className="space-y-6">
              
              {/* Option 1: GitHub App (Recommended) */}
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl px-4 py-5 sm:p-6 flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mb-2">Recommended (Production)</span>
                    <h3 className="text-base font-semibold leading-6 text-gray-900">GitHub App Integration</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      GitHub App is the recommended integration. It lets Falbor Guard run automatically on pull requests via webhooks, fetch changed files securely, post PR comments, and create checks without manual token management.
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col mt-4 border-t border-gray-100 pt-4">
                  {initialSettings?.githubAppInstallationId ? (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-gray-900">App Connected (Installation ID: {initialSettings.githubAppInstallationId})</span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4 text-sm text-gray-700">
                        Webhook Status: <span className="font-semibold text-green-600">Active</span>. Falbor Guard will automatically analyze new Pull Requests.
                      </div>
                      <button
                        onClick={handleDisconnect}
                        disabled={loading}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 disabled:opacity-50 self-start"
                      >
                        {loading ? 'Disconnecting...' : 'Disconnect App & Tokens'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start">
                      <a href="/api/github/install" className="flex items-center justify-center gap-2 rounded-md bg-[#24292F] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#24292F]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]">
                        <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                        </svg>
                        Install GitHub App
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Option 2: PAT (Fallback) */}
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl px-4 py-5 sm:p-6 flex flex-col opacity-80">
                <div className="mb-4">
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mb-2">Fallback (Testing)</span>
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Personal Access Token</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Use a manual PAT for quick testing. Webhooks will not work automatically.
                  </p>
                </div>
                
                {status.valid ? (
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="font-semibold text-green-600">✓ Token Active</span> (User: {status.username})
                    <button onClick={handleDisconnect} className="ml-4 text-red-600 hover:text-red-500 text-sm">Remove Token</button>
                  </div>
                ) : (
                  <form onSubmit={handleConnectToken} className="flex-1 flex flex-col mt-4 border-t border-gray-100 pt-4">
                    <label htmlFor="token" className="block text-sm font-medium leading-6 text-gray-900">
                      Paste your token
                    </label>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="password"
                        id="token"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        placeholder="ghp_..."
                        value={token}
                        onChange={e => setToken(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={loading || !token}
                        className="flex justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 disabled:opacity-50 whitespace-nowrap"
                      >
                        {loading ? '...' : 'Connect'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analyzer' && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Analyzer Configuration</h3>
              <p className="text-sm text-gray-500 mb-6">Configure global risk rules and thresholds for pull request analysis.</p>
              
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Risky Path Keywords</label>
                  <input type="text" value={analyzerSettings.riskyPathKeywords} onChange={e => setAnalyzerSettings({...analyzerSettings, riskyPathKeywords: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" placeholder="auth, billing, security, payment" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Large PR Threshold (files changed)</label>
                  <input type="number" value={analyzerSettings.largePrThreshold} onChange={e => setAnalyzerSettings({...analyzerSettings, largePrThreshold: parseInt(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" placeholder="15" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={analyzerSettings.missingTests} onChange={e => setAnalyzerSettings({...analyzerSettings, missingTests: e.target.checked})} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                  <label className="text-sm text-gray-700">Enable missing tests detection</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={analyzerSettings.dependencyChange} onChange={e => setAnalyzerSettings({...analyzerSettings, dependencyChange: e.target.checked})} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                  <label className="text-sm text-gray-700">Enable dependency change detection</label>
                </div>
                <button onClick={handleSaveAnalyzerSettings} className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save Settings</button>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Report Preferences</h3>
              <p className="text-sm text-gray-500 mb-6">Customize how Falbor Guard generates and displays reports.</p>
              
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Default Report Format</label>
                  <select value={reportSettings.reportFormat} onChange={e => setReportSettings({...reportSettings, reportFormat: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                    <option>Markdown (GitHub Style)</option>
                    <option>Plain Text</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={reportSettings.includeLowRisk} onChange={e => setReportSettings({...reportSettings, includeLowRisk: e.target.checked})} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                  <label className="text-sm text-gray-700">Include low-risk findings in summary</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={reportSettings.enablePostToGitHub} onChange={e => setReportSettings({...reportSettings, enablePostToGitHub: e.target.checked})} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                  <label className="text-sm text-gray-700">Enable "Post to GitHub" button (requires permissions)</label>
                </div>
                <button onClick={handleSaveReportSettings} className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save Preferences</button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Privacy & Data</h3>
              <p className="text-sm text-gray-500 mb-6">Manage how Falbor Guard stores your data.</p>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">What we store</h4>
                  <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                    <li>Connected repository names and IDs</li>
                    <li>Custom ADRs and architecture rules</li>
                    <li>Generated PR reports (Summaries and Markdown)</li>
                  </ul>
                  <p className="mt-3 text-sm text-blue-800 font-medium">We do NOT store PR diffs or source code. Source code is only analyzed ephemerally in memory.</p>
                </div>
                
                <div>
                  <button className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50">
                    Delete all my data
                  </button>
                  <p className="mt-2 text-xs text-gray-500">This will permanently delete your repositories, rules, and reports from Falbor Guard.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
