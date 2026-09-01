import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32 lg:px-8">
        <Link href="/" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 mb-8 inline-block">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-10">Terms of Service</h1>
        <div className="prose prose-indigo max-w-none text-gray-600">
          <p>Last updated: August 2026</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By using Falbor Guard, you agree to these terms of service. If you do not agree to these terms, please do not use the service.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
          <p>Falbor Guard provides an automated architecture and risk analysis tool for Pull Requests. It is designed to assist human reviewers, not replace them.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Limitation of Liability</h2>
          <p>We are not responsible for any bugs, architectural flaws, or security vulnerabilities that make it into your codebase, even if Falbor Guard fails to flag them.</p>
        </div>
      </div>
    </div>
  );
}
