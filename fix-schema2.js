const fs = require('fs');
const path = 'apps/falbor/app/lib/db/schema.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace hacking_messages id
content = content.replace(
  /export const hackingMessages = pgTable\("hacking_messages", \{\n  id: uuid\("id"\)\.defaultRandom\(\)\.primaryKey\(\),/g,
  'export const hackingMessages = pgTable("hacking_messages", {\n  id: text("id").primaryKey(),'
);

// Replace hacking_chat_snapshots id
content = content.replace(
  /export const hackingChatSnapshots = pgTable\("hacking_chat_snapshots", \{\n  id: uuid\("id"\)\.defaultRandom\(\)\.primaryKey\(\),/g,
  'export const hackingChatSnapshots = pgTable("hacking_chat_snapshots", {\n  id: text("id").primaryKey(),'
);

fs.writeFileSync(path, content);
console.log("Schema fixed 2");
