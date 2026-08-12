import React from 'react';

export default function BuilderDocsPage() {
  return (
    <article className="prose prose-invert prose-falbor max-w-none">
      <h1>Website Builder</h1>
      
      <p className="lead text-lg text-falbor-elements-textSecondary mb-8">
        Transform your ideas into fully functional, responsive websites instantly. 
        Our agentic AI writes production-ready code so you can focus on growing your business.
      </p>

      <div className="bg-falbor-elements-background-depth-2 border border-falbor-elements-borderColor rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mt-0 mb-4">Why use the AI Website Builder?</h2>
        <ul className="space-y-2 mb-0">
          <li><strong>Instant Generation:</strong> Describe your vision, and our AI will scaffold a complete project in seconds.</li>
          <li><strong>Production-Ready Code:</strong> Generates clean, maintainable React code using modern frameworks and best practices.</li>
          <li><strong>Real-time Preview:</strong> See your changes rendered instantly as the AI continues to build and iterate.</li>
          <li><strong>Responsive by Default:</strong> Every site is built to look great on desktop, tablet, and mobile devices automatically.</li>
        </ul>
      </div>

      <h2>How it Works</h2>
      <p>
        The Website Builder operates as an integrated environment within your workspace. 
        By simply starting a new project and giving a text prompt, the underlying agent ecosystem takes over:
      </p>

      <h3>1. Requirement Analysis</h3>
      <p>
        The agent breaks down your prompt into necessary components, routing, and state management requirements.
      </p>

      <h3>2. Iterative Generation</h3>
      <p>
        As you converse with the AI, it writes and refines the code file by file. You can see the actual source code being generated in the file explorer, ensuring there is no vendor lock-in.
      </p>

      <h3>3. Seamless Deployment</h3>
      <p>
        Once you're satisfied with the result, you can instantly deploy your site to the edge with a single click, or export the codebase to continue developing it locally.
      </p>
    </article>
  );
}
