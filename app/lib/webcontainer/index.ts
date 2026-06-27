import { WebContainer } from '@webcontainer/api';
import { WORK_DIR_NAME } from '~/utils/constants';
import { cleanStackTrace } from '~/utils/stacktrace';

interface WebContainerContext {
  loaded: boolean;
}

export const webcontainerContext: WebContainerContext = import.meta.hot?.data.webcontainerContext ?? {
  loaded: false,
};

if (import.meta.hot) {
  import.meta.hot.data.webcontainerContext = webcontainerContext;
}

const BOOT_GUARD_KEY = '__webcontainer_boot_promise__';

function initWebContainer(): Promise<WebContainer> {
  const existing = (window as any)[BOOT_GUARD_KEY];
  if (existing) {
    return existing;
  }

  const promise = WebContainer.boot({
    coep: 'credentialless',
    workdirName: WORK_DIR_NAME,
    forwardPreviewErrors: true,
  }).then(async (instance) => {
    webcontainerContext.loaded = true;

    const { workbenchStore } = await import('~/lib/stores/workbench');

    const response = await fetch('/inspector-script.js');
    const inspectorScript = await response.text();
    await instance.setPreviewScript(inspectorScript);

    instance.on('preview-message', (message) => {
      console.log('WebContainer preview message:', message);

      if (message.type === 'PREVIEW_UNCAUGHT_EXCEPTION' || message.type === 'PREVIEW_UNHANDLED_REJECTION') {
        const isPromise = message.type === 'PREVIEW_UNHANDLED_REJECTION';
        const title = isPromise ? 'Unhandled Promise Rejection' : 'Uncaught Exception';
        workbenchStore.actionAlert.set({
          type: 'preview',
          title,
          description: 'message' in message ? message.message : 'Unknown error',
          content: `Error occurred at ${message.pathname}${message.search}${message.hash}\nPort: ${message.port}\n\nStack trace:\n${cleanStackTrace(message.stack || '')}`,
          source: 'preview',
        });
      }
    });

    return instance;
  });

  (window as any)[BOOT_GUARD_KEY] = promise;
  if (import.meta.hot) {
    import.meta.hot.data.webcontainer = promise;
  }

  return promise;
}

export let webcontainer: Promise<WebContainer> = new Promise(() => {
  // noop for ssr
});

if (typeof window !== 'undefined') {
  webcontainer = import.meta.hot?.data.webcontainer ?? initWebContainer();
}
