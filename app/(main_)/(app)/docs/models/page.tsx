import React from 'react';

export default function ModelsDocsPage() {
  return (
    <article className="prose prose-invert prose-falbor max-w-none">
      <h1>AI Models & Credits</h1>
      
      <p className="lead text-lg text-falbor-elements-textSecondary mb-8">
        Understand the different AI models available in your workspace, their capabilities, and how they impact your credit balance.
      </p>

      <div className="bg-falbor-elements-background-depth-2 border border-falbor-elements-borderColor rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mt-0 mb-4">How Credits Work</h2>
        <p className="mb-4">
          Every user starts with a free balance. As you interact with the AI, generate code, or ask questions, tokens are consumed. The rate at which your balance decreases depends directly on <strong>which model you choose</strong>.
        </p>
        <ul className="space-y-2 mb-0">
          <li><strong>Free Subscription:</strong> Your balance is limited. It is highly recommended to use cheaper models like DeepSeek to stretch your credits further. Using premium models will consume your free credits very quickly.</li>
          <li><strong>Pro Subscription:</strong> Gives you a much larger balance and access to premium models without constantly worrying about token consumption.</li>
        </ul>
      </div>

      <h2>Model Capabilities & Pricing</h2>
      <p>
        Not all models are created equal. Some excel at deep reasoning and coding, while others are built for lightning-fast responses or visual analysis. Below is a breakdown of the models currently available on the platform.
      </p>

      <div className="overflow-x-auto my-8 border border-falbor-elements-borderColor rounded-lg">
        <table className="w-full text-left text-sm text-falbor-elements-textSecondary mb-0 border-collapse">
          <thead className="bg-falbor-elements-background-depth-2 text-falbor-elements-textPrimary">
            <tr>
              <th className="px-4 py-3 font-medium border-b border-falbor-elements-borderColor">Model Name</th>
              <th className="px-4 py-3 font-medium border-b border-falbor-elements-borderColor">Best For</th>
              <th className="px-4 py-3 font-medium border-b border-falbor-elements-borderColor">Speed</th>
              <th className="px-4 py-3 font-medium border-b border-falbor-elements-borderColor">Vision (Images)</th>
              <th className="px-4 py-3 font-medium border-b border-falbor-elements-borderColor">Cost Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-falbor-elements-borderColor bg-transparent">
            <tr className="hover:bg-falbor-elements-background-depth-2/50 transition-colors">
              <td className="px-4 py-3 font-medium text-falbor-elements-textPrimary">Deepseek V4 Pro</td>
              <td className="px-4 py-3">Coding & Logic</td>
              <td className="px-4 py-3">Fast</td>
              <td className="px-4 py-3 text-red-400">No</td>
              <td className="px-4 py-3 text-green-400">$ (Cheapest)</td>
            </tr>
            <tr className="hover:bg-falbor-elements-background-depth-2/50 transition-colors">
              <td className="px-4 py-3 font-medium text-falbor-elements-textPrimary">Gemini 3.6 Flash / Pro</td>
              <td className="px-4 py-3">Speed & Efficiency</td>
              <td className="px-4 py-3">Fastest</td>
              <td className="px-4 py-3 text-green-400">Yes</td>
              <td className="px-4 py-3">$$ (Medium)</td>
            </tr>
            <tr className="hover:bg-falbor-elements-background-depth-2/50 transition-colors">
              <td className="px-4 py-3 font-medium text-falbor-elements-textPrimary">Claude Haiku 4.5</td>
              <td className="px-4 py-3">General Tasks</td>
              <td className="px-4 py-3">Normal</td>
              <td className="px-4 py-3 text-green-400">Yes</td>
              <td className="px-4 py-3">$$ (Medium)</td>
            </tr>
            <tr className="hover:bg-falbor-elements-background-depth-2/50 transition-colors">
              <td className="px-4 py-3 font-medium text-falbor-elements-textPrimary">Claude Sonnet 4.5</td>
              <td className="px-4 py-3">Complex Tasks & Websites</td>
              <td className="px-4 py-3">Heavy</td>
              <td className="px-4 py-3 text-green-400">Yes</td>
              <td className="px-4 py-3 text-orange-400">$$$ (Expensive)</td>
            </tr>
            <tr className="hover:bg-falbor-elements-background-depth-2/50 transition-colors">
              <td className="px-4 py-3 font-medium text-falbor-elements-textPrimary">GPT-5.6 Sol</td>
              <td className="px-4 py-3">Complex Tasks & Websites</td>
              <td className="px-4 py-3">Heavy</td>
              <td className="px-4 py-3 text-green-400">Yes</td>
              <td className="px-4 py-3 text-orange-400">$$$ (Expensive)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Choosing the right model</h2>
      <p>
        If you are on a free plan and want to build a simple application or ask general programming questions, we strongly recommend using <strong>Deepseek V4 Pro</strong>. It consumes a fraction of the credits compared to other models.
      </p>
      <p>
        When you need pixel-perfect website clones, deep architectural design, or you need the AI to analyze an image you uploaded, switch to <strong>Claude Sonnet 4.5</strong> or <strong>GPT-5.6 Sol</strong>. These models are significantly more expensive, but they are the industry leaders for complex generative tasks.
      </p>
    </article>
  );
}
