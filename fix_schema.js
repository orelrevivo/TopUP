const fs = require('fs');
let schema = fs.readFileSync('apps/falbor/app/lib/db/schema.ts', 'utf8');

// 1. Fix users.id to text
schema = schema.replace(
  /export const users = pgTable\("users", \{[\s\S]*?id: uuid\("id"\)\.defaultRandom\(\)\.primaryKey\(\),/m,
  (match) => match.replace('id: uuid("id").defaultRandom().primaryKey()', 'id: text("id").primaryKey()')
);

// 2. Fix chats.id to uuid and userId to text, add urlId
schema = schema.replace(
  /export const chats = pgTable\("chats", \{[\s\S]*?createdAt: timestamp/m,
  (match) => {
    let s = match;
    s = s.replace('id: text("id").primaryKey(),', 'id: uuid("id").defaultRandom().primaryKey(),');
    s = s.replace('userId: uuid("user_id")', 'userId: text("user_id")');
    if (!s.includes('urlId: text("url_id")')) {
      s = s.replace('description: text("description"),', 'description: text("description"),\n  urlId: text("url_id"),');
    }
    return s;
  }
);

// 3. Fix messages.chatId to uuid, add toolInvocations and imageData
schema = schema.replace(
  /export const messages = pgTable\("messages", \{[\s\S]*?createdAt: timestamp/m,
  (match) => {
    let s = match;
    s = s.replace('chatId: text("chat_id")', 'chatId: uuid("chat_id")');
    if (!s.includes('toolInvocations: jsonb("tool_invocations")')) {
      s = s.replace('content: text("content"),', 'content: text("content"),\n  toolInvocations: jsonb("tool_invocations"),\n  imageData: text("image_data"),');
    }
    return s;
  }
);

// 4. Fix ALL foreign keys to users.id to be text instead of uuid
schema = schema.replace(/uuid\("user_id"\)/g, 'text("user_id")');
schema = schema.replace(/uuid\("follower_id"\)/g, 'text("follower_id")');
schema = schema.replace(/uuid\("following_id"\)/g, 'text("following_id")');
schema = schema.replace(/uuid\("customer_id"\)/g, 'text("customer_id")');
schema = schema.replace(/uuid\("assigned_user_id"\)/g, 'text("assigned_user_id")');

// 5. Fix ALL foreign keys to chats.id to be uuid instead of text
schema = schema.replace(/text\("chat_id"\)/g, 'uuid("chat_id")');

fs.writeFileSync('apps/falbor/app/lib/db/schema.ts', schema);
console.log("Schema updated.");
