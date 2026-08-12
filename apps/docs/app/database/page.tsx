import React from 'react';

export default function DatabaseDocsPage() {
  return (
    <article className="prose prose-invert prose-falbor max-w-none">
      <h1>Integrated Database</h1>
      
      <p className="lead text-lg text-falbor-elements-textSecondary mb-8">
        Every site gets a powerful database out-of-the-box. No need to configure external storage—every chat and site automatically provisions a secure, scalable database instantly.
      </p>

      <div className="bg-falbor-elements-background-depth-2 border border-falbor-elements-borderColor rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mt-0 mb-4">Key Database Features</h2>
        <ul className="space-y-2 mb-0">
          <li><strong>Zero Configuration:</strong> No connection strings, no provisioning, no hassle. It just works from the moment your project is created.</li>
          <li><strong>Relational & Document Stores:</strong> Support for structured SQL tables as well as flexible JSON data storage.</li>
          <li><strong>Edge Optimized:</strong> Data is geographically distributed and cached at the edge for incredibly fast read speeds globally.</li>
          <li><strong>Automatic Backups:</strong> Point-in-time recovery and automated daily snapshots keep your data safe.</li>
        </ul>
      </div>

      <h2>How it Works</h2>
      <p>
        Our infrastructure abstracts away the complexities of traditional database administration.
      </p>

      <h3>1. Automated Schema Generation</h3>
      <p>
        When you use the AI to build a feature that requires persistent data, the AI automatically generates the necessary database migrations and schema updates.
      </p>

      <h3>2. Built-in ORM</h3>
      <p>
        Your generated code automatically connects to the database using an integrated Object-Relational Mapper (ORM), ensuring type-safe queries and preventing SQL injection.
      </p>

      <h3>3. Database Dashboard</h3>
      <p>
        You can inspect your data, run manual queries, and edit records directly through the Falbor Database Dashboard, giving you full transparency and control over your underlying data.
      </p>
    </article>
  );
}
