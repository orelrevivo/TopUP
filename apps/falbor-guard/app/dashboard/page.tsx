export default function DashboardHome() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome to Falbor Guard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Set up your automated architecture and risk analysis guardrails.
          </p>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-6">Setup Checklist</h3>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm ml-4 md:ml-0 md:mr-0">
                <h4 className="font-semibold text-gray-900">Connect a Repository</h4>
                <p className="text-sm text-gray-500 mt-1 mb-3">Fetch your GitHub repositories and select one to protect.</p>
                <a href="/dashboard/repositories" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Go to Repositories &rarr;</a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span className="text-gray-600 font-bold text-sm">2</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm ml-4 md:ml-0 md:mr-0 text-left md:text-right">
                <h4 className="font-semibold text-gray-900">Configure ADRs & Rules</h4>
                <p className="text-sm text-gray-500 mt-1 mb-3">Define risky paths, conventions, and human-review triggers.</p>
                <a href="/dashboard/adrs" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Configure Rules &rarr;</a>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span className="text-gray-600 font-bold text-sm">3</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm ml-4 md:ml-0 md:mr-0">
                <h4 className="font-semibold text-gray-900">Analyze your first PR</h4>
                <p className="text-sm text-gray-500 mt-1 mb-3">Run the analyzer against a Pull Request to generate a risk report.</p>
                <a href="/dashboard/demo-analyzer" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Open Analyzer &rarr;</a>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span className="text-gray-600 font-bold text-sm">4</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm ml-4 md:ml-0 md:mr-0 text-left md:text-right">
                <h4 className="font-semibold text-gray-900">Review Project Config</h4>
                <p className="text-sm text-gray-500 mt-1 mb-3">Check out how to version your guardrails directly inside your repository.</p>
                <a href="/dashboard/config" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View Config Setup &rarr;</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
