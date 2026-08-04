const fs = require('fs');
const file = 'app/lib/services/supabaseService.ts';
let content = fs.readFileSync(file, 'utf8');

// Add static cache Set
content = content.replace('export class SupabaseService {', 'export class SupabaseService {\n  private static failedProvisionChats = new Set<string>();');

// Check cache before attempting
content = content.replace('      const [existing] = await db.select().from(supabaseDatabases).where(eq(supabaseDatabases.chatId, chatId)).limit(1);', '      if (this.failedProvisionChats.has(chatId)) {\n        throw new Error("Supabase provisioning previously failed for this chat (max projects reached). Skipping retry.");\n      }\n\n      const [existing] = await db.select().from(supabaseDatabases).where(eq(supabaseDatabases.chatId, chatId)).limit(1);');

// Add to cache on failure
content = content.replace('      if (!res.ok) {\n        const errorText = await res.text();\n        throw new Error(`Supabase API error: ${res.status} - ${errorText}`);\n      }', '      if (!res.ok) {\n        const errorText = await res.text();\n        if (res.status === 400 && errorText.includes("maximum limits")) {\n          this.failedProvisionChats.add(chatId);\n        }\n        throw new Error(`Supabase API error: ${res.status} - ${errorText}`);\n      }');

fs.writeFileSync(file, content);
console.log('Patched');
