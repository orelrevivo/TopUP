# Project Rules

Follow these rules whenever you read, create, or modify files in this codebase.

## Code Quality

Keep the codebase clean, concise, and human-readable.

* Do not add unnecessary comments.
* Never add decorative or explanatory comments such as `// #`, `// ---`, `// Section`, or similar separators.
* Do not explain obvious code with comments.
* Only add a comment when it provides important context that cannot be understood from the code itself.
* Avoid excessive blank lines. Keep related code close together and use spacing only when it improves readability.
* Do not add verbose documentation inside implementation files unless explicitly requested.
* Do not generate large blocks of boilerplate when a smaller implementation is enough.
* Prefer simple, readable code over overly abstract or over-engineered solutions.
* Match the existing coding style of the file you are editing.

### Bad

```tsx
// # User Profile Section

// Get the current user
const user = getUser();


// Check if the user exists
if (user) {
  // Display the user's name
  return <div>{user.name}</div>;
}
```

### Good

```tsx
const user = getUser();

if (user) {
  return <div>{user.name}</div>;
}
```

## UI and Design

When creating or modifying UI, always reuse the existing design system.

The main UI components are located at:

```text
apps/falbor/app/components/ui
```

Before creating a new component:

1. Check whether an existing component already solves the problem.
2. Reuse or extend the existing component whenever possible.
3. Modify existing components when appropriate instead of recreating the same design from scratch.
4. Create a completely new UI component only when there is no suitable existing component.

Keep new designs consistent with the existing Falbor UI, spacing, typography, components, and interaction patterns.

## Project Structure

The workspace follows this structure:

```text
apps/
└── falbor/
    └── app/
        ├── components/
        │   ├── ui/
        │   │   └── ...
        │   └── ...
        └── ...
```

Respect the existing folder structure. Do not create new folders or move files unless there is a clear reason.

## Tests

All test files must be created inside the appropriate `tests` folder.

Do not place test files next to production files unless the existing project structure explicitly does so.

## Environment Variables and Secrets

Never hardcode API keys, tokens, secrets, credentials, or private configuration values inside source files.

For Falbor, environment variables belong in:

```text
apps/falbor/.env
```

When adding an API integration:

```ts
const apiKey = process.env.EXAMPLE_API_KEY;
```

Never do this:

```ts
const apiKey = "sk-example-secret-key";
```

Do not commit secrets or API credentials to the repository.

If a new environment variable is required, reference it from the code and tell me which variable needs to be added to `.env`.

## Database Safety

Never execute commands that push, migrate, reset, seed, or otherwise modify the database unless I explicitly ask you to.

This includes commands such as:

```bash
npx prisma db push
npx prisma migrate dev
npx prisma migrate deploy
npx prisma db seed
```

Database migrations and database-changing commands are my responsibility.

You may update schemas or write migration-related code when requested, but do not execute database-changing commands yourself.

## Editing Existing Files

When modifying an existing file:

* Make the smallest change necessary to complete the task.
* Preserve existing functionality unless the task requires changing it.
* Do not rewrite an entire file when a small targeted change is enough.
* Do not rename unrelated variables, functions, files, or components.
* Do not reformat unrelated code.
* Do not remove existing functionality without a clear reason.
* Follow the patterns already used in nearby files.

Avoid turning a small request into a large refactor.

## Dependencies

Do not install a new package if the functionality can reasonably be implemented with dependencies already available in the project.

Before adding a dependency, check whether the project already contains a suitable library or utility.

Do not replace an existing library with another library unless explicitly requested.

## Agent Chat Style

Keep messages to me short and focused.

Do not write long explanations before or after making changes.

When working on a task, briefly tell me:

* what you changed;
* which important files were affected;
* whether there is anything I need to do manually.

Usually keep the response to only a few lines.

### Good

> Updated the settings modal to use the existing UI components and fixed the full-width layout.
>
> Changed:
>
> * `ChatSettingsModal.tsx`
>
> No manual steps required.

### Avoid

Long explanations of every line changed, detailed walkthroughs of obvious implementation choices, repeated summaries, or large sections describing what you are about to do.

## General Behavior

Prefer:

```text
Understand → Inspect existing code → Make the smallest correct change → Verify
```

Do not:

```text
Understand → Rebuild everything → Add unnecessary abstractions → Explain every line
```

The goal is to keep the Falbor codebase clean, consistent, maintainable, and written like a real production codebase rather than AI-generated code.
