import { relations } from "drizzle-orm/relations";
import { users, chats, messages, files } from "./schema";

export const chatsRelations = relations(chats, ({one, many}) => ({
	user: one(users, {
		fields: [chats.userId],
		references: [users.id]
	}),
	messages: many(messages),
	files: many(files),
}));

export const usersRelations = relations(users, ({many}) => ({
	chats: many(chats),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	chat: one(chats, {
		fields: [messages.chatId],
		references: [chats.id]
	}),
}));

export const filesRelations = relations(files, ({one}) => ({
	chat: one(chats, {
		fields: [files.chatId],
		references: [chats.id]
	}),
}));