import ivm from 'isolated-vm';

export async function handleCodeExecute(nodeData: any, context: Record<string, any>) {
  const { code } = nodeData;

  if (!code) {
    throw new Error('Code Execution node requires code');
  }

  // Create a new isolate with 128MB memory limit
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const ivmContext = await isolate.createContext();
  
  // Get a Reference to the global object
  const jail = ivmContext.global;
  
  // Set the global to itself so `global` is available
  await jail.set('global', jail.derefInto());

  // Inject the workflow context
  await jail.set('workflowContext', new ivm.ExternalCopy(context).copyInto());
  
  // We need to provide a console.log wrapper if we want to capture logs
  const logs: string[] = [];
  await jail.set('log', new ivm.Reference((...args: any[]) => {
    logs.push(args.join(' '));
  }));

  const scriptStr = `
    const console = { log };
    (async function() {
      ${code}
    })();
  `;

  try {
    const script = await isolate.compileScript(scriptStr);
    const resultRef = await script.run(ivmContext, { promise: true, reference: true });
    
    let result = undefined;
    if (resultRef && typeof resultRef.copy === 'function') {
        result = await resultRef.copy();
    }
    
    return {
      result,
      logs
    };
  } catch (error: any) {
    throw new Error(`Code Execution Failed: ${error.message}`);
  } finally {
    isolate.dispose();
  }
}
