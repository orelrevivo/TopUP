'use client';

export default function ReportsClient({ reports, repos }: { reports: any[], repos: any[] }) {
  if (reports.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              PR Risk Reports
            </h2>
          </div>
        </div>
        <div className="mt-8 rounded-lg border border-gray-200 bg-white shadow-sm p-16 text-center text-gray-500">
          <p>No reports generated yet. Use the PR Analyzer to generate your first report.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            PR Risk Reports
          </h2>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <ul role="list" className="divide-y divide-gray-100">
          {reports.map((report) => {
            const repo = repos.find(r => r.id === report.repositoryId);
            return (
              <li key={report.id} className="relative flex items-center justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      <a href={`/dashboard/reports/${report.id}`}>
                        <span className="absolute inset-x-0 -top-px bottom-0" />
                        {repo?.fullName || 'Unknown Repository'} - PR #{report.prNumber}
                      </a>
                    </p>
                    <p className="mt-1 flex text-xs leading-5 text-gray-500">
                      {report.title}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-4">
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">
                      <time dateTime={report.createdAt.toString()}>{new Date(report.createdAt).toLocaleDateString()}</time>
                    </p>
                    <div className="mt-1 flex items-center gap-x-1.5">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        report.riskLevel === 'High' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                        report.riskLevel === 'Medium' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                        'bg-green-50 text-green-700 ring-green-600/20'
                      }`}>
                        {report.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                  <svg className="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
