import { db } from './app/lib/db';
import { chats, messages } from './app/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

async function main() {
  const latestChat = await db.query.chats.findFirst({
    orderBy: [desc(chats.createdAt)],
  });

  if (!latestChat) {
    console.log("No chats found");
    return;
  }

  const msgs = await db.query.messages.findMany({
    where: eq(messages.chatId, latestChat.id),
    orderBy: (messages, { asc }) => [asc(messages.createdAt)],
  });

  console.log("Chat ID:", latestChat.id);
  msgs.forEach((m, i) => {
    console.log(`[${i}] ${m.role}: ${m.content ? m.content.substring(0, 50).replace(/\n/g, "\\n") : "null"}...`);
  });
}

main().catch(console.error);
