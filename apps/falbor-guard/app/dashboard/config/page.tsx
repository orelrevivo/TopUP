'use client';

export default function ConfigPage() {
  const exampleConfig = `{
  "riskyPaths": ["auth/**", "billing/**", "db/migrations/**", "permissions/**"],
  "approvedDependencies": ["react", "next", "zod", "prisma", "drizzle-orm"],
  "humanReviewRequired": [
    "auth changes",
    "billing changes",
    "database migrations",
    "new dependencies",
    "service boundary changes"
  ]
}`;

  const copyConfig = () => {
    navigator.clipboard.writeText(exampleConfig);
    alert('Copied configuration to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Repository Configuration
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Version control your architecture guardrails directly inside your repository.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">The <code>falbor-guard.config.json</code> file</h3>
          <p className="mt-1 text-sm text-gray-600">
            While you can manage ADRs and Rules directly in the dashboard, the recommended approach for large teams is to commit a <code>falbor-guard.config.json</code> file to the root of your repository. 
            When Falbor Guard analyzes a PR, it will automatically detect this file and apply these rules.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">falbor-guard.config.json</span>
            <button 
              onClick={copyConfig}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Copy Example
            </button>
          </div>
          <div className="p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
              {exampleConfig}
            </pre>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-sm font-medium text-gray-900 mb-4">How it works:</h4>
          <ul className="space-y-4 text-sm text-gray-600 list-disc list-inside">
            <li>
              <strong>riskyPaths:</strong> If any changed files in a PR match these glob patterns, the PR is automatically flagged as High Risk.
            </li>
            <li>
              <strong>approvedDependencies:</strong> Any changes to <code>package.json</code> that introduce dependencies not in this list will trigger a warning.
            </li>
            <li>
              <strong>humanReviewRequired:</strong> Semantic triggers that the AI analyzer looks out for in the PR description and diff.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
