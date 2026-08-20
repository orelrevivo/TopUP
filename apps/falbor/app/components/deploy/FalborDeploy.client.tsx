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
          type: 'build' as const,
          content: 'npm run build',
        },
      };

      // Add the action first
      artifact.runner.addAction(actionData);

      // Then run it
      await artifact.runner.runAction(actionData);
      
      const buildOutput = artifact.runner.buildOutput;

      if (!buildOutput || buildOutput.exitCode !== 0) {
        // Notify that build failed
        deployArtifact.runner.handleDeployAction('building', 'failed', {
          error: formatBuildFailureOutput(buildOutput?.output),
          source: 'falbor',
        });
        throw new Error('Build failed');
      }

      // Notify that build succeeded and deployment is starting
      deployArtifact.runner.handleDeployAction('deploying', 'running', { source: 'falbor' });

      // Get the build files
      const container = await webcontainer;

      // Check if the build path exists
      let finalBuildPath = '';
      let buildPathExists = false;

      // First trust the path returned by the action-runner
      if (buildOutput.path) {
        try {
          await container.fs.readdir(buildOutput.path);
          finalBuildPath = buildOutput.path;
          buildPathExists = true;
        } catch (e) {
          // Fall back to searching
        }
      }

      if (!buildPathExists) {
        // List of common output directories to check
        const commonOutputDirs = ['dist', 'build', 'out', 'output', '.next', 'public'];
  
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
            const isBinary = /\.(png|jpg|jpeg|gif|webp|ico|bmp|mp3|mp4|wav|woff|woff2|ttf|eot)$/i.test(entry.name);
            let content;
            if (isBinary) {
              const bytes = await container.fs.readFile(fullPath);
              let binary = '';
              const len = bytes.byteLength;
              for (let i = 0; i < len; i++) {
                  binary += String.fromCharCode(bytes[i]);
              }
              content = window.btoa(binary);
            } else {
              content = await container.fs.readFile(fullPath, 'utf-8');
            }

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

      const fileEntries = Object.entries(fileContents);
      const CHUNK_MAX_SIZE = 2 * 1024 * 1024; // 2MB
      const chunks: Record<string, string>[] = [];
      let currentChunk: Record<string, string> = {};
      let currentSize = 0;

      for (const [filePath, content] of fileEntries) {
        const size = content.length;
        if (currentSize + size > CHUNK_MAX_SIZE && Object.keys(currentChunk).length > 0) {
          chunks.push(currentChunk);
          currentChunk = {};
          currentSize = 0;
        }
        currentChunk[filePath] = content;
        currentSize += size;
      }
      if (Object.keys(currentChunk).length > 0) {
        chunks.push(currentChunk);
      }

      let activeSubdomain = existingSubdomain;
      let finalDeployUrl = '';
      let activeSubdomainData = '';

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const isInitial = i === 0;

        const response = await fetch('/api/falbor-deploy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: chunk,
            chatId: currentChatId,
            subdomain: activeSubdomain,
            isInitial,
          }),
        });

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          console.error(`Non-JSON response from deploy API (chunk ${i}):`, text.substring(0, 500));
          throw new Error(`Deployment API returned non-JSON response (${response.status}): ${text.substring(0, 100)}`);
        }

        if (!response.ok || !data.success) {
          // Notify that deployment failed
          deployArtifact.runner.handleDeployAction('deploying', 'failed', {
            error: data.error || 'Invalid deployment response',
            source: 'falbor',
          });
          throw new Error(data.error || 'Invalid deployment response');
        }

        if (isInitial && data.subdomain) {
          activeSubdomain = data.subdomain;
        }
        finalDeployUrl = data.url;
        activeSubdomainData = data.subdomain;
      }

      if (finalDeployUrl) {
        localStorage.setItem(`deploy-url-${currentChatId}`, finalDeployUrl);
        localStorage.setItem(`deploy-source-${currentChatId}`, 'falbor');

        // Persist to server
        try {
          await fetch('/api/deployments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chatId: currentChatId,
              url: finalDeployUrl,
              provider: 'falbor',
              subdomain: activeSubdomainData,
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
        url: finalDeployUrl,
        source: 'falbor',
      });

      // Show success toast notification
      toast.success(`🚀 Falbor deployment completed successfully!`);

      return true;
    } catch (error) {
      console.error('Deploy error:', error);
      toast.error(error instanceof Error ? error.message : 'Deployment failed');
      
      const deploymentId = `deploy-artifact`;
      const deployArtifact = workbenchStore.artifacts.get()[deploymentId];
      if (deployArtifact) {
        deployArtifact.runner.handleDeployAction('deploying', 'failed', {
          error: error instanceof Error ? error.message : 'Deployment failed',
          source: 'falbor'
        });
      }

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
