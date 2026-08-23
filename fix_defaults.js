const fs = require('fs');
let schema = fs.readFileSync('apps/falbor/app/lib/db/schema.ts', 'utf8');

schema = schema.replace(/id: text\("id"\)\.primaryKey\(\),?/g, 'id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),');

fs.writeFileSync('apps/falbor/app/lib/db/schema.ts', schema);
console.log("Schema defaults updated.");
