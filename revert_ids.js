const fs = require('fs');
let schema = fs.readFileSync('apps/falbor/app/lib/db/schema.ts', 'utf8');

// Revert id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()) back to uuid
schema = schema.replace(/id: text\("id"\)\.primaryKey\(\)\.\$defaultFn\(\(\) => crypto\.randomUUID\(\)\)/g, 'id: uuid("id").defaultRandom().primaryKey()');

// Revert text("id").primaryKey() just in case (for hackingChats, etc.)
schema = schema.replace(/id: text\("id"\)\.primaryKey\(\)/g, 'id: uuid("id").defaultRandom().primaryKey()');

// Revert text("user_id") back to uuid("user_id")
schema = schema.replace(/text\("user_id"\)/g, 'uuid("user_id")');
schema = schema.replace(/text\("chat_id"\)/g, 'uuid("chat_id")');
schema = schema.replace(/text\("follower_id"\)/g, 'uuid("follower_id")');
schema = schema.replace(/text\("following_id"\)/g, 'uuid("following_id")');
schema = schema.replace(/text\("customer_id"\)/g, 'uuid("customer_id")');
schema = schema.replace(/text\("assigned_user_id"\)/g, 'uuid("assigned_user_id")');

fs.writeFileSync('apps/falbor/app/lib/db/schema.ts', schema);
console.log("Reverted text IDs to UUIDs.");
