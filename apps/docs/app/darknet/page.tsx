import React from 'react';

export default function DarknetDocsPage() {
  return (
    <article className="prose prose-invert prose-falbor max-w-none">
      <h1>Darknet Integration</h1>
      
      <p className="lead text-lg text-falbor-elements-textSecondary mb-8">
        Go beyond the surface web. Our advanced agents scan and verify data against darknet sources, 
        providing unparalleled security intelligence without compromising your safety.
      </p>

      <div className="bg-falbor-elements-background-depth-2 border border-falbor-elements-borderColor rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mt-0 mb-4">Why use Darknet Intelligence?</h2>
        <ul className="space-y-2 mb-0">
          <li><strong>Proactive Security:</strong> Discover leaked credentials or compromised data before malicious actors exploit them.</li>
          <li><strong>Isolated Execution:</strong> Our agents operate in heavily sandboxed environments when querying darknet sources, keeping your internal network completely air-gapped.</li>
          <li><strong>Verified Threat Feeds:</strong> Correlate surface web activities with underground forums and marketplaces.</li>
          <li><strong>Anonymized Scanning:</strong> Operations are performed through specialized routing layers to maintain absolute anonymity.</li>
        </ul>
      </div>

      <h2>How it Works</h2>
      <p>
        The Darknet integration allows specific agent workflows to safely retrieve and analyze data from restricted, non-standard networks.
      </p>

      <h3>1. Automated Credential Monitoring</h3>
      <p>
        You can configure a workflow to securely hash your organization's domains and routinely check against known darknet data dumps. If a match is found, an alert is triggered immediately.
      </p>

      <h3>2. Sandboxed Analysis</h3>
      <p>
        When an agent needs to pull data from a darknet source, the request is routed through our proprietary isolated relay network. The raw data is analyzed by the AI, and only the sanitized, structured insights are returned to your workspace.
      </p>

      <h3>3. Compliance & Ethics</h3>
      <p>
        This feature is built strictly for defensive security intelligence. We employ strict guardrails to prevent offensive actions or interactions on darknet forums, focusing purely on monitoring and threat detection.
      </p>
    </article>
  );
}
