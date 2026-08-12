import { db } from "~/lib/db";
import { neonDatabases } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import { createScopedLogger } from "~/utils/logger";

const logger = createScopedLogger("api.neonService");

export class NeonService {
  /**
   * Retrieves an existing Neon database for the chat, or creates a new one via the Neon API.
   */
  static async getOrCreateNeonDatabase(chatId: string): Promise<string | null> {
    try {
      // 1. Check if database already exists for this chat
      const [existing] = await db.select().from(neonDatabases).where(eq(neonDatabases.chatId, chatId)).limit(1);

      if (existing) {
        return existing.databaseUrl;
      }

      // 2. No existing database, check for API key
      const apiKey = process.env.NEON_API_KEY;
      if (!apiKey) {
        logger.warn("NEON_API_KEY is not set. Skipping Neon database auto-provisioning.");
        return null;
      }

      // 3. Create a new Neon project
      logger.info(`Creating Neon project for chat: ${chatId}`);
      
      const res = await fetch("https://console.neon.tech/api/v2/projects", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          project: {
            name: `chat-${chatId}`
          }
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Neon API error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      
      // Neon returns connection_uris array on project creation
      const connectionUri = data.connection_uris?.[0]?.connection_uri;
      const projectId = data.project?.id;

      if (!connectionUri || !projectId) {
        throw new Error("Invalid response from Neon API: missing connection_uri or project.id");
      }

      // 4. Save to database
      await db.insert(neonDatabases).values({
        chatId,
        databaseUrl: connectionUri,
        projectId: projectId,
      });

      logger.info(`Successfully provisioned Neon project ${projectId} for chat ${chatId}`);
      return connectionUri;
    } catch (error) {
      logger.error("Failed to provision Neon database", error);
      return null;
    }
  }
}
