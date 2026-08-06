const { Stagehand } = require('@browserbasehq/stagehand');
require('dotenv').config();

async function run() {
  const stagehand = new Stagehand({
    env: 'BROWSERBASE',
    modelName: 'gpt-4o',
    logger: () => {}
  });
  
  await stagehand.init();
  console.log(Object.keys(stagehand));
  console.log(stagehand.browserbaseSessionID || 'no session id property');
  
  await stagehand.close();
}

run().catch(console.error);
