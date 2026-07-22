'use client';
import { toast } from 'react-toastify';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { webcontainer } from '~/lib/webcontainer';
import { path } from '~/utils/path';
import { useState } from 'react';
import type { ActionCallbackData } from '~/lib/runtime/message-parser';
import { chatId } from '~/lib/persistence/useChatHistory';
import { formatBuildFailureOutput } from './deployUtils';

export function useFalborDeploy() {
  const [isDeploying, setIsDeploying] = useState(false);
  const currentChatId = useStore(chatId);

  const handleFalborDeploy = async () => {
    if (!currentChatId) {
      toast.error('No active chat found');
      return false;
    }

    try {
      setIsDeploying(true);

      const artifact = workbenchStore.firstArtifact;

      if (!artifact) {
        throw new Error('No active project found');
      }

      // Create a deployment artifact for visual feedback
      const deploymentId = `deploy-artifact`;
      workbenchStore.addArtifact({
        id: deploymentId,
        messageId: deploymentId,
        title: 'Publish with Falbor',
        type: 'standalone',
      });

      const deployArtifact = workbenchStore.artifacts.get()[deploymentId];

      // Notify that build is starting
      deployArtifact.runner.handleDeployAction('building', 'running', { source: 'falbor' });

      // Open the terminal visually
      workbenchStore.toggleTerminal(true);

      // Set up build action
      const actionId = 'build-' + Date.now();
      const actionData: ActionCallbackData = {
        messageId: 'falbor build',
        artifactId: artifact.id,
        actionId,
        action: {
          type: 'shell' as const,
          content: 'npm run build',
        },
      };

      // Add the action first
      artifact.runner.addAction(actionData);

      // Then run it
      await artifact.runner.runAction(actionData);

      // Notify that build succeeded and deployment is starting
      deployArtifact.runner.handleDeployAction('deploying', 'running', { source: 'falbor' });

      // Get the build files
      const container = await webcontainer;

      // Check if the build path exists
      let finalBuildPath = '';

      // List of common output directories to check
      const commonOutputDirs = ['/dist', '/build', '/out', '/output', '/.next', '/public'];

      // Verify the build path exists, or try to find an alternative
      let buildPathExists = false;

      for (const dir of commonOutputDirs) {
        try {
          await container.fs.readdir(dir);
          finalBuildPath = dir;
          buildPathExists = true;
          break;
        } catch (error) {
          continue;
        }
      }

      if (!buildPathExists) {
        throw new Error('Could not find build output directory. Please check your build configuration.');
      }

      async function getAllFiles(dirPath: string): Promise<Record<string, string>> {
        const files: Record<string, string> = {};
        const entries = await container.fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name);

          if (entry.isFile()) {
            const content = await container.fs.readFile(fullPath, 'utf-8');

            // Remove build path prefix from the path
            const deployPath = fullPath.replace(finalBuildPath, '');
            files[deployPath] = content;
          } else if (entry.isDirectory()) {
            const subFiles = await getAllFiles(fullPath);
            Object.assign(files, subFiles);
          }
        }

        return files;
      }

      const fileContents = await getAllFiles(finalBuildPath);

      // Get current deployment state to see if we should update an existing URL
      let existingSubdomain;
      try {
        const { deploymentStore } = await import('~/lib/stores/deployments');
        const currentDeployment = deploymentStore.get().current;
        if (currentDeployment && currentDeployment.provider === 'falbor' && currentDeployment.subdomain) {
          existingSubdomain = currentDeployment.subdomain;
        }
      } catch (e) {
        // Ignore errors importing store dynamically
      }

      const response = await fetch('/api/falbor-deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: fileContents,
          chatId: currentChatId,
          subdomain: existingSubdomain,
        }),
      });

      const data = (await response.json()) as any;

      if (!response.ok || !data.success) {
        // Notify that deployment failed
        deployArtifact.runner.handleDeployAction('deploying', 'failed', {
          error: data.error || 'Invalid deployment response',
          source: 'falbor',
        });
        throw new Error(data.error || 'Invalid deployment response');
      }

      const deployUrl = data.url;

      if (deployUrl) {
        localStorage.setItem(`deploy-url-${currentChatId}`, deployUrl);
        localStorage.setItem(`deploy-source-${currentChatId}`, 'falbor');

        // Persist to server
        try {
          await fetch('/api/deployments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chatId: currentChatId,
              url: deployUrl,
              provider: 'falbor',
              subdomain: data.subdomain,
            }),
          });
          
          // Refresh store
          const { fetchDeployment } = await import('~/lib/stores/deployments');
          await fetchDeployment(currentChatId);
        } catch (e) {
          console.error('Failed to save deployment to db', e);
        }
      }

      // Notify that deployment completed successfully
      deployArtifact.runner.handleDeployAction('complete', 'complete', {
        url: deployUrl,
        source: 'falbor',
      });

      // Show success toast notification
      toast.success(`🚀 Falbor deployment completed successfully!`);

      return true;
    } catch (error) {
      console.error('Deploy error:', error);
      toast.error(error instanceof Error ? error.message : 'Deployment failed');

      return false;
    } finally {
      setIsDeploying(false);
    }
  };

  return {
    isDeploying,
    handleFalborDeploy,
  };
}
