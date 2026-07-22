/**
 * Client-side data helper for the Hacking section.
 * Mirrors app/lib/api/data/chat.ts but talks to /api/data/hacking-chats
 * which reads/writes the isolated hackingChats / hackingMessages / hackingChatSnapshots tables.
 */
const BASE = "/api/data/hacking-chats";

async function api(path: string, options?: RequestInit): Promise<any> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("session_token");
    if (token) headers["x-session-token"] = token;
  }

  if (options?.headers) {
    const optHeaders = options.headers as Record<string, string>;
    Object.assign(headers, optHeaders);
  }

  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `API error ${res.status}`);
  }

  return res.json() as Promise<any>;
}

export interface HackingServerChat {
  id: string;
  userId?: string;
  messages: any[];
  urlId?: string;
  description?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export async function getAllChats(): Promise<HackingServerChat[]> {
  const data = await api("");
  return Array.isArray(data) ? data : [];
}

export async function getChat(id: string): Promise<HackingServerChat | null> {
  try {
    return await api(`/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

export async function saveChat(chat: {
  id: string;
  messages: any[];
  urlId?: string;
  description?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}): Promise<{ id: string }> {
  return api("", {
    method: "POST",
    body: JSON.stringify(chat),
  });
}

export async function deleteChat(id: string): Promise<void> {
  await api(`/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function deleteAllChats(): Promise<void> {
  const chats = await getAllChats();
  await Promise.all(chats.map((c) => deleteChat(c.id)));
}

export async function getNextId(): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `hacking-${crypto.randomUUID()}`;
  }
  return `hacking-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function getUrlId(id: string): Promise<string> {
  const chats = await getAllChats();
  const existing = chats.map((c) => c.urlId).filter(Boolean);
  if (!existing.includes(id)) return id;
  let i = 2;
  while (existing.includes(`${id}-${i}`)) i++;
  return `${id}-${i}`;
}

export async function getSnapshot(chatId: string): Promise<any | null> {
  try {
    return await api(`/${encodeURIComponent(chatId)}/snapshot`);
  } catch {
    return null;
  }
}

export async function setSnapshot(chatId: string, snapshot: any): Promise<void> {
  await api(`/${encodeURIComponent(chatId)}/snapshot`, {
    method: "POST",
    body: JSON.stringify({ snapshot }),
  });
}

export async function deleteSnapshot(chatId: string): Promise<void> {
  try {
    await api(`/${encodeURIComponent(chatId)}/snapshot`, { method: "DELETE" });
  } catch {
    // ignore
  }
}

export async function duplicateChat(id: string): Promise<string> {
  const chat = await getChat(id);
  if (!chat) throw new Error("Hacking chat not found");
  return createChatFromMessages(
    `${chat.description || "Hacking Chat"} (copy)`,
    chat.messages
  );
}

export async function createChatFromMessages(
  description: string,
  messages: any[],
  metadata?: Record<string, any>
): Promise<string> {
  const newId = await getNextId();
  const newUrlId = await getUrlId(newId);
  await saveChat({
    id: newId,
    messages,
    urlId: newUrlId,
    description,
    timestamp: new Date().toISOString(),
    metadata,
  });
  return newUrlId;
}
