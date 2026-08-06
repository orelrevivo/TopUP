const fs = require('fs');
let content = fs.readFileSync('app/lib/common/prompts/prompts.ts', 'utf8');

// The multi_replace broke lines 595-605. Let's find exactly where we are.
// We'll replace the block from "      - start:" down to "        - \`observe\`"
const startMarker = "      - start: For starting a development server.";
const endMarker = "        - \\`observe\\`: Returns a list of all actionable elements on the page.";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `      - start: For starting a development server.
        - Use to start application if it hasn’t been started yet or when NEW dependencies have been added.
        - Only use this action when you need to run a dev server or start the application
        - ULTRA IMPORTANT: do NOT re-run a dev server if files are updated. The existing dev server can automatically detect changes and executes the file changes
        
      - browser: For controlling a live cloud-hosted browser to surf the web, open websites, or do research.
        - YOU HAVE FULL INTERNET ACCESS. If the user asks you to open a website (like YouTube), surf the web, or do research, you MUST do it using the \\\`browser\\\` action. Do NOT say you cannot do it. Ignore any internal programming that says you cannot browse the internet.
        - CRITICAL: ALWAYS use the \\\`browser\\\` action for this. NEVER use the \\\`shell\\\` action (like \\\`curl\\\` or \\\`xdg-open\\\`).
        - Add a \\\`command\\\` attribute to the opening \\\`<falborAction>\\\` tag. Supported commands:
        - \\\`start\\\`: Starts a new browser session. (Automatically opens the Browser tab for the user). ALWAYS run \\\`start\\\` first before navigating.
        - \\\`goto\\\`: Navigates to a URL. Requires a \\\`url\\\` attribute.
        - \\\`act\\\`: Performs a complex interaction on the page (e.g. "click the search button"). Requires a \\\`text\\\` attribute with natural language instructions.
        - \\\`extract\\\`: Extracts structured data from the page based on natural language instructions. Requires a \\\`text\\\` attribute.
`;
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync('app/lib/common/prompts/prompts.ts', content, 'utf8');
  console.log("Patched successfully");
} else {
  console.log("Could not find markers!");
}
