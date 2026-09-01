import React from 'react';

export default function OrganizationsDocsPage() {
  return (
    <article className="prose prose-invert prose-falbor max-w-none">
      <h1>Organizations</h1>
      
      <p className="lead text-lg text-falbor-elements-textSecondary mb-8">
        Manage projects and issues in one place. Scale your workflow with built-in organization tools. 
        Track errors, manage multiple projects, and collaborate with your team from a unified dashboard.
      </p>

      <div className="bg-falbor-elements-background-depth-2 border border-falbor-elements-borderColor rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mt-0 mb-4">Why use Organizations?</h2>
        <ul className="space-y-2 mb-0">
          <li><strong>Unified Dashboard:</strong> View the status, deployments, and database metrics for all your projects in a single view.</li>
          <li><strong>Role-Based Access Control:</strong> Fine-grained permissions ensure team members only have access to the resources they need.</li>
          <li><strong>Collaborative Workspaces:</strong> Share chat sessions, workflows, and database schemas seamlessly across your organization.</li>
          <li><strong>Centralized Billing:</strong> Manage billing, usage limits, and subscriptions for the entire organization from one place.</li>
        </ul>
      </div>

      <h2>How it Works</h2>
      <p>
        An Organization acts as a top-level container for all your projects, resources, and team members.
      </p>

      <h3>1. Creating an Organization</h3>
      <p>
        Any user can create an organization. Upon creation, you become the Owner and can immediately start inviting team members via email or shareable links.
      </p>

      <h3>2. Managing Projects</h3>
      <p>
        Projects created within an organization inherit the organization's resource pools and billing. You can assign specific teams to specific projects, keeping workflows isolated and secure.
      </p>

      <h3>3. Activity Audit Logs</h3>
      <p>
        Every action taken within an organization—from a deployment to a database modification—is logged in the immutable audit trail, ensuring compliance and easy troubleshooting.
      </p>
    </article>
  );
}
