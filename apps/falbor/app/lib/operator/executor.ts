import { OperatorAction } from './actions';
import { useOperatorStore } from './context';
import { toast } from 'sonner';

export const executeAction = (action: OperatorAction): Promise<void> => {
  const store = useOperatorStore.getState();

  return new Promise((resolve) => {
    switch (action.type) {
      case 'SAY_MESSAGE':
        if (action.payload?.text) {
          store.setCurrentMessage(action.payload.text);
        }
        resolve();
        break;

      case 'ASK_USER':
        if (action.payload?.text) {
          store.setCurrentMessage(action.payload.text);
          store.setIsAskingUser(true);
        }
        resolve();
        break;

      case 'WRITE_BUILDER_PROMPT':
        if (action.payload?.text) {
          const text = action.payload.text;
          let currentText = '';
          let charIndex = 0;
          
          store.setThinking(true);
          
          const typeChar = () => {
            if (charIndex < text.length) {
              currentText += text[charIndex];
              const event = new CustomEvent('falbor:externalChatInputChange', {
                detail: currentText,
              });
              window.dispatchEvent(event);
              charIndex++;
              setTimeout(typeChar, 15 + Math.random() * 20); // 15-35ms natural typing
            } else {
              store.setThinking(false);
              resolve();
            }
          };
          
          typeChar();
        } else {
          resolve();
        }
        break;

      case 'SUBMIT_BUILDER_PROMPT':
        // First, animate the cursor to click the send button
        const submitSelector = 'button.bg-bolt-elements-button-primary-background, button[type="submit"], [data-title="Send"], [data-testid="send-button"]';
        
        const submitCursorEvent = new CustomEvent('falbor:simulateClick', {
          detail: { selector: submitSelector },
        });
        window.dispatchEvent(submitCursorEvent);

        // Wait for the cursor animation to complete before actually submitting
        setTimeout(() => {
          const submitEvent = new CustomEvent('falbor:externalChatMessage', {
            detail: action.payload?.text || undefined,
          });
          window.dispatchEvent(submitEvent);
          resolve();
        }, 1200); // 1.2 seconds for animation
        break;

      case 'OPEN_PAGE':
        if (action.payload?.url) {
          window.location.href = action.payload.url;
        }
        resolve();
        break;

      case 'OPEN_SETTINGS':
        const settingsSelector = '[data-testid="settings-button"]';
        const settingsCursorEvent = new CustomEvent('falbor:simulateClick', {
          detail: { selector: settingsSelector },
        });
        window.dispatchEvent(settingsCursorEvent);
        
        // Resolve after the cursor animation clicks it
        setTimeout(() => {
          resolve();
        }, 1000);
        break;

      case 'OPEN_RESEARCH':
        toast.info('Opening research panel...');
        resolve();
        break;

      case 'OPEN_PREVIEW':
        toast.info('Opening preview...');
        resolve();
        break;

      case 'READ_CURRENT_ERRORS':
        resolve();
        break;

      case 'SEND_FIX_PROMPT':
        if (action.payload?.text) {
          const fixEvent = new CustomEvent('falbor:externalChatMessage', {
            detail: action.payload.text,
          });
          window.dispatchEvent(fixEvent);
        }
        resolve();
        break;

      case 'HIGHLIGHT_ELEMENT':
        resolve();
        break;

      case 'WAIT_FOR_BUILDER':
        store.setCurrentMessage("The build started. I'll watch for errors.");
        resolve();
        break;

      case 'SIMULATE_CLICK':
        if (action.payload?.selector) {
          const simClickEvent = new CustomEvent('falbor:simulateClick', {
            detail: { selector: action.payload.selector },
          });
          window.dispatchEvent(simClickEvent);
          
          setTimeout(() => {
            resolve();
          }, 1000);
        } else {
          resolve();
        }
        break;

      case 'UPDATE_OPERATOR_MEMORY':
        if (action.payload) {
          store.updateMemory(action.payload);
        }
        resolve();
        break;

      default:
        console.warn('Unknown operator action:', action.type);
        resolve();
    }
  });
};

export const processOperatorResponse = async (response: any) => {
  const store = useOperatorStore.getState();
  
  if (response.message) {
    store.setCurrentMessage(response.message);
  }

  if (response.actions && Array.isArray(response.actions)) {
    // Process actions sequentially one after the other
    for (const action of response.actions) {
      await executeAction(action);
      // Small pause between actions for realism
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }
};
