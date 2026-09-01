'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { analyzePR, PRAnalysisInput, RiskReport } from '@/lib/github/analyzer';
import { getAdrRules } from '@/actions/adrs';
import { saveReport } from '@/actions/reports';
import { fetchRealPRs, getPullRequestFiles } from '@/actions/github';

type AnalyzerMode = 'github' | 'manual';

export default function DemoAnalyzerClient({ repos }: { repos: any[] }) {
  const searchParams = useSearchParams();
  const initialRepoId = searchParams.get('repoId') || (repos[0]?.id || '');
  
  const [mode, setMode] = useState<AnalyzerMode>('github');
  const [selectedRepo, setSelectedRepo] = useState(initialRepoId);
  const [activeRules, setActiveRules] = useState('');
  const [report, setReport] = useState<RiskReport | null>(null);
  const [loading, setLoading] = useState(false);

  // GitHub Mode State
  const [repoPRs, setRepoPRs] = useState<any[]>([]);
  const [loadingPRs, setLoadingPRs] = useState(false);
  const [selectedPRNumber, setSelectedPRNumber] = useState<string>('');
  const [prFiles, setPrFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedFileNames, setSelectedFileNames] = useState<Set<string>>(new Set());
  const [fileSearch, setFileSearch] = useState('');

  // Manual Mode State
  const [input, setInput] = useState<Omit<PRAnalysisInput, 'rules'>>({
    title: searchParams.get('title') || '',
    description: searchParams.get('description') || '',
    changedFiles: searchParams.get('files') || '',
    diffText: searchParams.get('diff') || '',
  });

  // Load Rules
  useEffect(() => {
    if (selectedRepo) {
      getAdrRules(selectedRepo).then(rules => {
        const rulesText = rules.map(r => r.title + ': ' + r.description).join('\n');
        setActiveRules(rulesText);
      });
    } else {
      setActiveRules('');
    }
  }, [selectedRepo]);

  // Load PRs when Repo changes (GitHub Mode)
  useEffect(() => {
    if (mode === 'github' && selectedRepo) {
      const repo = repos.find(r => r.id === selectedRepo);
      if (repo) {
        setLoadingPRs(true);
        fetchRealPRs(repo.fullName)
          .then(setRepoPRs)
          .catch(e => alert("Failed to fetch PRs: " + e.message))
          .finally(() => setLoadingPRs(false));
      }
    }
  }, [selectedRepo, mode]);

  // Load Files when PR changes
  useEffect(() => {
    if (mode === 'github' && selectedRepo && selectedPRNumber) {
      const repo = repos.find(r => r.id === selectedRepo);
      if (repo) {
        setLoadingFiles(true);
        getPullRequestFiles(repo.fullName, selectedPRNumber)
          .then(files => {
            setPrFiles(files);
            setSelectedFileNames(new Set(files.map((f: any) => f.filename)));
          })
          .catch(e => alert("Failed to fetch files: " + e.message))
          .finally(() => setLoadingFiles(false));
      }
    }
  }, [selectedPRNumber]);

  const toggleFile = (filename: string) => {
    const next = new Set(selectedFileNames);
    if (next.has(filename)) next.delete(filename);
    else next.add(filename);
    setSelectedFileNames(next);
  };

  const selectAllFiles = () => setSelectedFileNames(new Set(prFiles.map(f => f.filename)));
  const clearAllFiles = () => setSelectedFileNames(new Set());

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepo) return alert('Select a repository');
    
    let analysisInput: PRAnalysisInput;

    if (mode === 'github') {
      if (!selectedPRNumber) return alert('Select a PR');
      const pr = repoPRs.find(p => p.number === selectedPRNumber);
      if (!pr) return alert('PR not found');

      const includedFiles = prFiles.filter(f => selectedFileNames.has(f.filename));
      if (includedFiles.length === 0) return alert('Select at least one file');

      const changedFilesList = includedFiles.map(f => f.filename).join('\n');
      const combinedDiff = includedFiles.map(f => `--- ${f.filename}\n+++ ${f.filename}\n${f.patch}`).join('\n\n');

      analysisInput = {
        title: pr.title,
        description: pr.body || '',
        changedFiles: changedFilesList,
        diffText: combinedDiff,
        rules: activeRules
      };
    } else {
      analysisInput = { ...input, rules: activeRules };
    }

    setLoading(true);
    try {
      const result = await analyzePR(analysisInput);
      setReport(result);
      
      const repo = repos.find(r => r.id === selectedRepo);
      await saveReport({
        repositoryId: selectedRepo,
        prNumber: mode === 'github' ? selectedPRNumber : 'manual',
        title: analysisInput.title || 'Manual Analysis',
        riskLevel: result.riskLevel,
        summary: result.summary,
        markdownReport: result.markdownReport,
      });
    } catch (err: any) {
      alert("Error analyzing: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = prFiles.filter(f => f.filename.toLowerCase().includes(fileSearch.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            PR Analyzer
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Analyze PR details against your connected repository's database rules.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('github')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'github' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            GitHub PR Mode
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'manual' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Manual Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 rounded-xl flex flex-col">
          <form onSubmit={handleAnalyze} className="space-y-6 flex-1 flex flex-col">
            <div>
              <label className="block text-sm font-medium text-gray-700">Repository</label>
              <select
                value={selectedRepo}
                onChange={e => {
                  setSelectedRepo(e.target.value);
                  setSelectedPRNumber('');
                  setPrFiles([]);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ring-1 ring-inset ring-gray-300"
              >
                {repos.length === 0 && <option value="">No repositories connected</option>}
                {repos.map(r => (
                  <option key={r.id} value={r.id}>{r.fullName}</option>
                ))}
              </select>
            </div>

            {mode === 'github' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pull Request</label>
                  <select
                    value={selectedPRNumber}
                    onChange={e => setSelectedPRNumber(e.target.value)}
                    disabled={loadingPRs || !selectedRepo}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ring-1 ring-inset ring-gray-300"
                  >
                    <option value="">{loadingPRs ? 'Loading PRs...' : 'Select a Pull Request'}</option>
                    {repoPRs.map(pr => (
                      <option key={pr.number} value={pr.number}>#{pr.number} - {pr.title}</option>
                    ))}
                  </select>
                </div>

                {selectedPRNumber && (
                  <div className="flex-1 flex flex-col min-h-[400px]">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Changed Files</label>
                      <div className="text-xs space-x-3">
                        <button type="button" onClick={selectAllFiles} className="text-indigo-600 hover:text-indigo-500">Select All</button>
                        <button type="button" onClick={clearAllFiles} className="text-gray-500 hover:text-gray-700">Clear All</button>
                      </div>
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Search files..."
                      value={fileSearch}
                      onChange={e => setFileSearch(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 mb-3 sm:text-sm"
                    />

                    <div className="border border-gray-200 rounded-md overflow-hidden flex-1 flex flex-col bg-gray-50">
                      {loadingFiles ? (
                        <div className="p-4 text-center text-sm text-gray-500">Loading files...</div>
                      ) : (
                        <div className="overflow-y-auto flex-1 max-h-64 divide-y divide-gray-200">
                          {filteredFiles.map(file => (
                            <label key={file.filename} className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedFileNames.has(file.filename)}
                                onChange={() => toggleFile(file.filename)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <div className="ml-3 flex-1 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={file.filename}>
                                  {file.filename.split('/').pop()}
                                </span>
                                <div className="flex items-center gap-3">
                                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                    file.status === 'added' ? 'bg-green-100 text-green-700' :
                                    file.status === 'removed' ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {file.status}
                                  </span>
                                  <span className="text-xs font-mono">
                                    <span className="text-green-600">+{file.additions}</span>
                                    <span className="text-red-600 ml-1">-{file.deletions}</span>
                                  </span>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">{selectedFileNames.size} of {prFiles.length} files selected.</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">PR Title</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      required
                      id="title"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                      placeholder="e.g. feat: add new billing webhook"
                      value={input.title}
                      onChange={e => setInput({...input, title: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="changedFiles" className="block text-sm font-medium leading-6 text-gray-900">Changed Files (one per line)</label>
                  <div className="mt-2">
                    <textarea
                      id="changedFiles"
                      required
                      rows={4}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 font-mono"
                      placeholder="src/api/billing.ts&#10;package.json"
                      value={input.changedFiles}
                      onChange={e => setInput({...input, changedFiles: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="diffText" className="block text-sm font-medium leading-6 text-gray-900">Diff Text (Snippets)</label>
                  <div className="mt-2">
                    <textarea
                      id="diffText"
                      rows={4}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 font-mono text-xs"
                      placeholder="+ import { createCharge } from 'stripe';"
                      value={input.diffText}
                      onChange={e => setInput({...input, diffText: e.target.value})}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading || !selectedRepo || (mode === 'github' && (!selectedPRNumber || selectedFileNames.size === 0))}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 mt-auto"
            >
              {loading ? 'Analyzing & Saving...' : 'Analyze Architecture Risks'}
            </button>
          </form>
        </div>

        <div>
          {report ? (
            <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Architecture Report</h3>
                <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium ${
                  report.riskLevel === 'High' ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10' :
                  report.riskLevel === 'Medium' ? 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20' :
                  'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                }`}>
                  {report.riskLevel} Risk
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Summary</h4>
                  <p className="mt-1 text-sm text-gray-600">{report.summary}</p>
                </div>

                {report.riskyAreas.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 text-red-600">Risky Paths Modified</h4>
                    <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                      {report.riskyAreas.map((area, i) => <li key={i}>{area}</li>)}
                    </ul>
                  </div>
                )}

                {report.possibleAdrConflicts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 text-orange-600">Possible Rule Conflicts</h4>
                    <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                      {report.possibleAdrConflicts.map((conflict, i) => <li key={i}>{conflict}</li>)}
                    </ul>
                  </div>
                )}

                {report.missingTests.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 text-yellow-600">Testing Gaps</h4>
                    <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                      {report.missingTests.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                )}
                
                {report.humanReviewRequired && (
                   <div className="bg-red-50 p-3 rounded border border-red-200">
                     <p className="text-sm text-red-800 font-semibold flex items-center gap-2">
                       <span>⚠️</span> Human Review Strictly Required
                     </p>
                   </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <a href="/dashboard/reports" className="flex-1 text-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    View Full Report Details
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-12 text-center rounded-xl h-full flex flex-col justify-center min-h-[500px]">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No report generated</h3>
              <p className="mt-1 text-sm text-gray-500">Select a PR and choose which files to analyze.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
