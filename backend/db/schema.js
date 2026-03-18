const { pgTable, text, timestamp, varchar, integer } = require('drizzle-orm/pg-core');

const users = pgTable('users', {
  id: text('id').primaryKey().notNull(), // text for crypto.randomUUID()
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const stories = pgTable('stories', {
  id: text('id').primaryKey().notNull(), // Using text for custom string IDs, maybe uuid
  userId: text('user_id').references(() => users.id).notNull(), // Foreign key to users
  title: varchar('title', { length: 255 }).notNull(),
  genre: varchar('genre', { length: 100 }).notNull(),
  character: varchar('character', { length: 255 }).notNull(),
  setting: varchar('setting', { length: 255 }).notNull(),
  length: varchar('length', { length: 50 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

module.exports = { users, stories };
