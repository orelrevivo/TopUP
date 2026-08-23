const fs = require('fs');
const path = 'apps/falbor/app/lib/db/schema.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace all uuid("chat_id") with text("chat_id")
content = content.replace(/uuid\("chat_id"\)/g, 'text("chat_id")');

// Replace hacking_chats id
content = content.replace(
  /export const hackingChats = pgTable\("hacking_chats", \{\n  id: uuid\("id"\)\.defaultRandom\(\)\.primaryKey\(\),/g,
  'export const hackingChats = pgTable("hacking_chats", {\n  id: text("id").primaryKey(),'
);

fs.writeFileSync(path, content);
console.log("Schema fixed");
