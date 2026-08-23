const fs = require('fs');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: 'apps/falbor/.env' });

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const res = await sql`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
    `;
    
    // Create a mapping from table_name -> column_name -> data_type
    const dbTypes = {};
    for (const row of res) {
      if (!dbTypes[row.table_name]) dbTypes[row.table_name] = {};
      dbTypes[row.table_name][row.column_name] = row.data_type;
    }

    const path = 'apps/falbor/app/lib/db/schema.ts';
    let content = fs.readFileSync(path, 'utf8');

    // Parse all tables in schema.ts
    // export const tableName = pgTable("db_table_name", { ... });
    const tableRegex = /export const (\w+) = pgTable\("([^"]+)", \{([\s\S]*?)\}\);/g;
    let match;
    
    while ((match = tableRegex.exec(content)) !== null) {
      const fullMatch = match[0];
      const constName = match[1];
      const dbTableName = match[2];
      let tableBody = match[3];

      if (!dbTypes[dbTableName]) continue;

      // Find all uuid declarations in this table: propName: uuid("column_name")
      const uuidRegex = /(\w+):\s*uuid\("([^"]+)"\)/g;
      let uuidMatch;
      let newTableBody = tableBody;

      while ((uuidMatch = uuidRegex.exec(tableBody)) !== null) {
        const propName = uuidMatch[1];
        const dbColumnName = uuidMatch[2];
        
        const actualType = dbTypes[dbTableName][dbColumnName];
        if (actualType === 'text' || actualType === 'character varying') {
          // Replace uuid("column_name") with text("column_name") for this specific match
          const toReplace = new RegExp(`uuid\\("${dbColumnName}"\\)`, 'g');
          newTableBody = newTableBody.replace(toReplace, `text("${dbColumnName}")`);
        }
      }
      
      if (newTableBody !== tableBody) {
        content = content.replace(tableBody, newTableBody);
      }
    }
    
    fs.writeFileSync(path, content);
    console.log("Schema successfully synced with live database!");
  } catch(e) {
    console.error(e);
  }
}
main();
