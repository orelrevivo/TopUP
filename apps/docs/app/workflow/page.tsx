import React from 'react';

export default function WorkflowDocsPage() {
  return (
    <article className="prose prose-invert prose-falbor max-w-none">
      <h1>Native AI Workflow Automation</h1>
      
      <p className="lead text-lg text-falbor-elements-textSecondary mb-8">
        A production-grade, durable workflow engine built natively into your AI workspace. 
        Automate tasks, run scheduled tests, and integrate external services without ever leaving the platform.
      </p>

      <div className="bg-falbor-elements-background-depth-2 border border-falbor-elements-borderColor rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mt-0 mb-4">Why use Workflows?</h2>
        <ul className="space-y-2 mb-0">
          <li><strong>Daily AI Tasks:</strong> Schedule the AI to automatically run data analysis or send reports every morning.</li>
          <li><strong>Automated Testing:</strong> Trigger an AI workflow to review your codebase or test deployments.</li>
          <li><strong>Durable Waits:</strong> Pause a workflow for 3 days, and it will safely resume precisely where it left off.</li>
          <li><strong>System Integrations:</strong> Connect your databases, emails, or Webhooks seamlessly.</li>
        </ul>
      </div>

      <h2>How it Works</h2>
      <p>
        The workflow system isn't just a simple script runner. It is backed by a <strong>persistent Postgres queue</strong> and a background polling worker. 
        When you run a workflow, it executes node by node. If a node fails, it can be retried. If a node is a "Wait" node, the worker suspends the execution and wakes it up days later.
      </p>

      <h3>1. The Visual Editor</h3>
      <p>
        Access the workflow editor from the <strong>Workbench</strong>. Drag and drop nodes from the sidebar onto the canvas to construct your logic.
      </p>

      <h3>2. Dynamic Variables & Context</h3>
      <p>
        Every time a node executes successfully, its output is saved into the workflow's context. You can access these outputs in subsequent nodes using the double curly brace syntax.
      </p>
      <pre className="bg-[#1e1e1e] p-4 rounded-md overflow-x-auto text-sm text-gray-300 font-mono mb-6">
        <code>
          {`// Example: Accessing the output of an HTTP Request node
{{httpRequestNode_1.body.user.email}}

// Example: Accessing the manual trigger input
{{trigger.user_id}}`}
        </code>
      </pre>

      <h3>3. Node Types</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="border border-falbor-elements-borderColor rounded-md p-4">
          <h4 className="font-medium flex items-center gap-2 mt-0">
            <div className="i-ph:globe-hemisphere-west-fill text-cyan-500"></div> HTTP Request
          </h4>
          <p className="text-sm text-falbor-elements-textSecondary mb-0">
            Make REST API calls to any external service. Supports GET, POST, PUT, DELETE with custom headers and JSON bodies.
          </p>
        </div>
        <div className="border border-falbor-elements-borderColor rounded-md p-4">
          <h4 className="font-medium flex items-center gap-2 mt-0">
            <div className="i-ph:code-fill text-pink-500"></div> JS/TS Code
          </h4>
          <p className="text-sm text-falbor-elements-textSecondary mb-0">
            Execute custom server-side JavaScript securely in an isolated V8 environment. Perfect for complex data transformations.
          </p>
        </div>
        <div className="border border-falbor-elements-borderColor rounded-md p-4">
          <h4 className="font-medium flex items-center gap-2 mt-0">
            <div className="i-ph:clock-fill text-orange-500"></div> Wait
          </h4>
          <p className="text-sm text-falbor-elements-textSecondary mb-0">
            Durably pause execution. The engine goes to sleep and wakes up exactly when the delay expires.
          </p>
        </div>
        <div className="border border-falbor-elements-borderColor rounded-md p-4">
          <h4 className="font-medium flex items-center gap-2 mt-0">
            <div className="i-falbor:mcp text-accent-500"></div> MCP Tools
          </h4>
          <p className="text-sm text-falbor-elements-textSecondary mb-0">
            Expose tools from connected Model Context Protocol servers natively in the workflow.
          </p>
        </div>
      </div>

      <h2>MCP Integration</h2>
      <p>
        The workflow engine is deeply integrated with the platform's <strong>Model Context Protocol (MCP)</strong> architecture.
        In the Integrations tab of the Workflow Editor, you can access your global MCP connections (the exact same ones available in the Chat sidebar). 
        Any tool exposed by your connected MCP servers can be utilized as a dynamic node within your workflows.
      </p>

    </article>
  );
}
