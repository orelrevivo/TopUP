'use client';

import { useState } from 'react';
import { createAdrRule, deleteAdrRule } from '@/actions/adrs';

export default function AdrsClient({ repos, rules }: { repos: any[], rules: any[] }) {
  const [selectedRepo, setSelectedRepo] = useState(repos[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('High');
  const [loading, setLoading] = useState(false);

  const filteredRules = rules.filter(r => r.repositoryId === selectedRepo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepo) return alert("Select a repository first.");
    
    setLoading(true);
    try {
      await createAdrRule({ repositoryId: selectedRepo, title, description, severity });
      setTitle('');
      setDescription('');
    } catch (err: any) {
      alert("Failed to create rule: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      await deleteAdrRule(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Architecture Decision Records (ADRs)
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Create New Rule</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Repository</label>
                <select
                  value={selectedRepo}
                  onChange={e => setSelectedRepo(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ring-1 ring-inset ring-gray-300"
                >
                  {repos.length === 0 && <option value="">No repositories connected</option>}
                  {repos.map(r => (
                    <option key={r.id} value={r.id}>{r.fullName}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Rule Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ring-1 ring-inset ring-gray-300"
                  placeholder="e.g. No direct DB access in UI components"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ring-1 ring-inset ring-gray-300"
                  placeholder="Explain the context and exactly what to look out for."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Severity</label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ring-1 ring-inset ring-gray-300"
                >
                  <option value="High">High (Block PR)</option>
                  <option value="Medium">Medium (Warn)</option>
                  <option value="Low">Low (Info)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !selectedRepo}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Add ADR Rule'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {repos.length === 0 ? (
             <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 rounded-xl text-center text-gray-500 py-16">
               Please connect a repository first in the Repositories tab.
             </div>
          ) : (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Rules for:</h3>
                <select
                  value={selectedRepo}
                  onChange={e => setSelectedRepo(e.target.value)}
                  className="block w-64 rounded-md border-gray-300 text-sm py-1 px-2 ring-1 ring-inset ring-gray-300"
                >
                  {repos.map(r => (
                    <option key={r.id} value={r.id}>{r.fullName}</option>
                  ))}
                </select>
              </div>

              {filteredRules.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No rules found for this repository. Create one to get started.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredRules.map(rule => (
                    <li key={rule.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            rule.severity === 'High' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                            rule.severity === 'Medium' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                            'bg-green-50 text-green-700 ring-green-600/20'
                          }`}>
                            {rule.severity}
                          </span>
                          <h4 className="text-base font-semibold text-gray-900">{rule.title}</h4>
                        </div>
                        <button onClick={() => handleDelete(rule.id)} className="text-sm text-red-600 hover:text-red-900">Delete</button>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{rule.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
