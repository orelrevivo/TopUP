import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32 lg:px-8">
        <Link href="/" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 mb-8 inline-block">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-10">Privacy Policy</h1>
        <div className="prose prose-indigo max-w-none text-gray-600">
          <p>Last updated: August 2026</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>We only collect the information you choose to provide to us, such as your repository names, pull request details, and ADR configurations when you use Falbor Guard.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>Your PR code and descriptions are sent to our AI models solely for the purpose of generating architecture risk reports. We do not use your code to train our models.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Data Security</h2>
          <p>We implement strict security measures to ensure your codebase and rules are kept secure and private. All data is encrypted in transit and at rest.</p>
        </div>
      </div>
    </div>
  );
}
