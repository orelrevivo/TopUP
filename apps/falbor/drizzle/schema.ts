import { pgTable, text, timestamp, foreignKey, unique, uuid, jsonb } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const users = pgTable("users", {
	id: text("id").primaryKey().notNull(),
	email: text("email").notNull(),
	name: text("name"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const chats = pgTable("chats", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: text("user_id"),
	description: text("description"),
	urlId: text("url_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		chatsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "chats_user_id_users_id_fk"
		}),
		chatsUrlIdUnique: unique("chats_url_id_unique").on(table.urlId),
	}
});

export const messages = pgTable("messages", {
	id: text("id").primaryKey().notNull(),
	chatId: uuid("chat_id"),
	role: text("role").notNull(),
	content: text("content").notNull(),
	toolInvocations: jsonb("tool_invocations"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	imageData: text("image_data"),
},
(table) => {
	return {
		messagesChatIdChatsIdFk: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chats.id],
			name: "messages_chat_id_chats_id_fk"
		}).onDelete("cascade"),
	}
});

export const files = pgTable("files", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	chatId: uuid("chat_id"),
	path: text("path").notNull(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		filesChatIdChatsIdFk: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chats.id],
			name: "files_chat_id_chats_id_fk"
		}).onDelete("cascade"),
	}
});