import { pgTable, serial, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core'


export const roleEnum = pgEnum('role_enum', ['assistant', 'user'])

export const chats = pgTable('chats', {
    id:serial('id').primaryKey(),
    videoUrl: text('video-url').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    title: text('title').notNull(),
    description: text('description'),
    thumbnailUrl : text('thumbnail url'),
    channelTitle : text('channel tiitle'),
})

export type DrizzleChat = typeof chats.$inferSelect


export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    chatId: integer('chat_id').references(() => chats.id).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    role: roleEnum('role').notNull()
})