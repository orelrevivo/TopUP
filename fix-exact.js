const fs = require('fs');
const path = 'apps/falbor/app/lib/db/schema.ts';
let content = fs.readFileSync(path, 'utf8');

const textIds = [
  'messages',
  'chats',
  'analyzed_reports',
  'hacking_chats',
  'skills',
  'hacking_messages'
];

const textChatIds = [
  'chat_images',
  'chat_snapshots',
  'deployments',
  'messages',
  'supabase_databases',
  'neon_databases',
  'workflows',
  'falbor_site_files',
  'analyzed_reports',
  'projects',
  'hacking_chat_snapshots',
  'hacking_messages',
  'files'
];

// Helper to replace within a table definition
function replaceInTable(tableName, regex, replacement) {
  const tableRegex = new RegExp(`export const ${tableName} = pgTable\\("[^"]+", \\{([\\s\\S]*?)\\}\\);`);
  const match = content.match(tableRegex);
  if (match) {
    const tableBody = match[1];
    const newBody = tableBody.replace(regex, replacement);
    content = content.replace(match[0], match[0].replace(tableBody, newBody));
  }
}

// Map db table names to exported const names in schema.ts
const dbToConst = {
  'messages': 'messages',
  'chats': 'chats',
  'analyzed_reports': 'analyzedReports',
  'hacking_chats': 'hackingChats',
  'skills': 'skills',
  'hacking_messages': 'hackingMessages',
  'chat_images': 'chatImages',
  'chat_snapshots': 'chatSnapshots',
  'deployments': 'deployments',
  'supabase_databases': 'supabaseDatabases',
  'neon_databases': 'neonDatabases',
  'workflows': 'workflows',
  'falbor_site_files': 'falborSiteFiles',
  'projects': 'projects',
  'hacking_chat_snapshots': 'hackingChatSnapshots',
  'files': 'files'
};

textIds.forEach(dbName => {
  const constName = dbToConst[dbName];
  if (constName) {
    replaceInTable(constName, /id: uuid\("id"\)\.defaultRandom\(\)\.primaryKey\(\)(, \/\/.*)?/, 'id: text("id").primaryKey()$1');
  }
});

textChatIds.forEach(dbName => {
  const constName = dbToConst[dbName];
  if (constName) {
    replaceInTable(constName, /chatId: uuid\("chat_id"\)/g, 'chatId: text("chat_id")');
  }
});

// Remove name from users
replaceInTable('users', /\n\s*name: text\("name"\),?.*?\n/g, '\n');
// Remove urlId from chats
replaceInTable('chats', /\n\s*urlId: text\("url_id"\),?.*?\n/g, '\n');

fs.writeFileSync(path, content);
console.log("Fixed!");
