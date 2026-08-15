import { upsertFunnel } from './app/lib/visual-editor/queries';
import { v4 } from 'uuid';

async function run() {
  try {
    const res = await upsertFunnel(
      v4(), 
      { name: 'test funnel', description: 'test', subDomainName: 'test', favicon: 'test', liveProducts: '[]' }, 
      v4()
    );
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
