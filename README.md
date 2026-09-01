# Falbor

Falbor is a modern, AI-powered workspace and website builder designed for momentum. It seamlessly integrates a chat-based assistant with a visual editor to help developers and creators build, deploy, and share web applications rapidly.

## Key Features

- **AI Chat Assistant**: An interactive workspace where you can prompt the AI to generate code, refactor components, and fix issues.
- **Visual Editor**: Instantly preview and edit your site's UI in real-time.
- **Template Library**: Discover, use, and publish templates. Creators can share their starting points with the community.
- **Instant Deployment**: Connect your Vercel or Netlify accounts to publish your projects with a single click.
- **Seamless Cloning**: Fork existing projects and templates while keeping your environment secrets (like `.env` files) secure.

## Project Structure

This repository is structured as a monorepo containing:
- `apps/falbor/`: The main Next.js web application.
- `packages/`: Shared libraries and utilities.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/orelrevivo/TopUP.git
   cd Falbor-main
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env` in the `apps/falbor` directory.
   - Fill in the required API keys (e.g., OpenAI, Database URI, etc.).

4. Start the development server:
   ```bash
   cd apps/falbor
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Connecting Services
To use the full capabilities of Falbor (such as publishing), you will need to link your accounts within the **Chat Settings**:
- **Vercel / Netlify**: Go to settings to authorize your deployment accounts. You must deploy a site before you can publish it as a public template.
- **Database**: Ensure your `DATABASE_URL` is set up correctly in the `.env` file to support chats, users, and templates.

## Publishing Templates
Users can publish their workspaces as templates for others to remix:
1. Deploy your site using the Vercel or Netlify integration.
2. Open the Chat Settings and navigate to the **Template** tab.
3. Fill out the template details (name, description, categories, and screenshots).
4. Click **Publish**. (Note: `.env` secrets are automatically stripped when others clone your template).

---
*Built for momentum. Ready to remix.*
