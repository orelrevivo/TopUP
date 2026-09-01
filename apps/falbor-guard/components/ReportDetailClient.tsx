'use client';

import { useState } from 'react';

import { postPullRequestComment } from '@/actions/github';

export default function ReportDetailClient({ report, repo }: { report: any, repo: any }) {
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900">Report not found</h2>
        <a href="/dashboard/reports" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
          &larr; Back to Reports
        </a>
      </div>
    );
  }

  const isManual = report.prNumber === 'manual';

  const handlePostToGitHub = async () => {
    if (isManual) return alert("Cannot post to GitHub. This was a manual analysis.");
    if (!repo) return alert("Repository not found.");
    
    setPosting(true);
    try {
      await postPullRequestComment(repo.fullName, report.prNumber, report.markdownReport);
      setPosted(true);
      setTimeout(() => setPosted(false), 5000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPosting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(report.markdownReport);
    alert('Copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6">
        <a href="/dashboard/reports" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          &larr; Back to Reports
        </a>
      </div>
      
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center gap-3">
            {repo?.fullName || 'Unknown Repo'} 
            <span className="text-gray-400 font-normal">#{isManual ? 'Manual' : `PR-${report.prNumber}`}</span>
            {!isManual && repo && (
              <a href={`https://github.com/${repo.fullName}/pull/${report.prNumber}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                View on GitHub ↗
              </a>
            )}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {report.title}
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 gap-3">
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Copy Markdown
          </button>
          <button
            onClick={handlePostToGitHub}
            disabled={posting || posted || isManual}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            title={isManual ? "Disabled for manual analysis" : "Post to GitHub"}
          >
            {posting ? 'Posting...' : posted ? 'Posted ✓' : 'Post to GitHub PR (Beta)'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
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

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Raw Output (GitHub Markdown)</h4>
              <pre className="bg-gray-50 p-4 rounded-md text-sm text-gray-600 overflow-x-auto font-mono whitespace-pre-wrap">
                {report.markdownReport}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
