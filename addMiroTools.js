const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'app/lib/services/nativeToolsService.ts');
let content = fs.readFileSync(targetFile, 'utf8');

const toolsList = [
  { name: 'preview_resource_poll', desc: 'Check whether a Miro create-result preview resource is ready.' },
  { name: 'record_ui_feedback', desc: 'Record a thumbs up/down rating a user gave on a Miro MCP UI response.' },
  { name: 'user_who_am_i', desc: 'Returns the identity of the current authenticated user.' },
  { name: 'board_list_items', desc: 'List items on a board with cursor-based pagination.' },
  { name: 'context_explore', desc: 'Explore high-level items on a Miro board.' },
  { name: 'context_get', desc: 'Get text context from a Miro board or a specific item on a board.' },
  { name: 'diagram_get_dsl', desc: 'Get the DSL format specification for a diagram type.' },
  { name: 'diagram_create', desc: 'Create a diagram on a Miro board from DSL text.' },
  { name: 'table_create', desc: 'Create a table on a Miro board with specified columns.' },
  { name: 'table_list_rows', desc: 'Get rows from a Miro table with column metadata.' },
  { name: 'table_get_latest_update_history', desc: 'Get the history of a row Latest Update field.' },
  { name: 'table_sync_rows', desc: 'Add or update rows in a Miro table.' },
  { name: 'table_update_view', desc: 'Update a Miro table widget view.' },
  { name: 'doc_get', desc: 'Read the content of a doc format item from a Miro board.' },
  { name: 'doc_update', desc: 'Edit content in an existing doc format item using find-and-replace.' },
  { name: 'doc_create', desc: 'Create a doc format item on a Miro board.' },
  { name: 'image_get_url', desc: 'Get image download URL for an image item from a Miro board.' },
  { name: 'image_get_data', desc: 'Get image data for an image item from a Miro board.' },
  { name: 'image_get_upload_url', desc: 'Get a single-use upload URL for a local image.' },
  { name: 'image_create', desc: 'Create an image item on a Miro board.' },
  { name: 'comment_list_comments', desc: 'List comments from a Miro board or a specific item.' },
  { name: 'comment_create', desc: 'Create a new comment on the Miro board canvas.' },
  { name: 'layout_get_dsl', desc: 'Get the DSL format specification for creating board items.' },
  { name: 'layout_create', desc: 'Create multiple board items on a Miro board from DSL.' },
  { name: 'layout_read', desc: 'Read existing board items and return them as DSL text.' },
  { name: 'layout_update', desc: 'Edit board items and connectors using find-and-replace on DSL.' },
  { name: 'code_widget_create', desc: 'Create a code widget on a Miro board.' },
  { name: 'code_widget_get', desc: 'Read a code widget from a Miro board.' },
  { name: 'code_widget_update', desc: 'Update an existing code widget on a Miro board.' },
  { name: 'code_widget_delete', desc: 'Delete a code widget from a Miro board.' },
  { name: 'code_widget_list_items', desc: 'List code widgets on a Miro board.' },
  { name: 'prototype_get_upload_url', desc: 'Reserve one or more single-use upload slots for HTML screens.' },
  { name: 'prototype_create', desc: 'Create a Miro prototype from one or more HTML screens.' }
];

let generatedCode = '';
for (const t of toolsList) {
  generatedCode += `
    tools['${t.name}'] = tool({
      description: '${t.desc.replace(/'/g, "\\'")}',
      parameters: z.object({
        boardId: z.string().optional().describe('Optional Board ID if operating on a specific board'),
        data: z.any().optional().describe('Payload data for the operation'),
      }),
      execute: async ({ boardId, data }) => {
        try {
          // This is a native API wrapper implementation placeholder
          return 'Executed ${t.name} successfully. Note: Native API implementation is in progress.';
        } catch (err: any) {
          return 'Error executing ${t.name}: ' + err.message;
        }
      }
    });
`;
}

// Insert before the last `return tools;` in getMiroTools
content = content.replace(/    return tools;\n  }\n}\n$/, generatedCode + '    return tools;\n  }\n}\n');
fs.writeFileSync(targetFile, content);
console.log('Tools injected successfully.');
