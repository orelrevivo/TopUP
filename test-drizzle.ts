import { db } from './apps/falbor/app/lib/visual-editor/db';
import * as schema from './apps/falbor/app/lib/db/schema';
console.log("Schema tables:");
console.log(Object.keys(schema).filter(k => k.includes('Relations')));
console.log("Testing query:");
db.query.veFunnels.findMany({ with: { FunnelPages: true } })
  .then(() => console.log("Success!"))
  .catch((e: any) => console.error("Error:", e.message, e.stack));
