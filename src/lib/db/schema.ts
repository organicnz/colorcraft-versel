import {
  pgTable,
  text,
  varchar,
  timestamp,
  uuid,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { dbLogger } from "@/lib/logger";

/**
 * Timestamp fields generator for consistent timestamps across tables
 * Automatically manages created_at and updated_at fields
 */
const addTimestampFields = () => ({
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Users table schema with improved indexing
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    full_name: text("full_name"),
    ...addTimestampFields(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex("users_email_idx").on(table.email),
      createdAtIdx: index("users_created_at_idx").on(table.created_at),
    };
  }
);

/**
 * Projects table schema with proper indexing and relations
 */
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    image_url: text("image_url"),
    is_published: boolean("is_published").default(false).notNull(),
    ...addTimestampFields(),
  },
  (table) => {
    return {
      userIdIdx: index("projects_user_id_idx").on(table.user_id),
      publishedIdx: index("projects_published_idx").on(table.is_published),
      titleIdx: index("projects_title_idx").on(table.title),
      createdAtIdx: index("projects_created_at_idx").on(table.created_at),
      // Composite index for common query patterns
      userPublishedIdx: index("projects_user_published_idx").on(table.user_id, table.is_published),
    };
  }
);

/**
 * Track schema version for migrations
 */
export const schemaVersion = pgTable("schema_version", {
  id: uuid("id").primaryKey().defaultRandom(),
  version: varchar("version", { length: 50 }).notNull(),
  applied_at: timestamp("applied_at").defaultNow().notNull(),
  description: text("description"),
});

/**
 * Define relationships between tables
 */
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.user_id],
    references: [users.id],
  }),
}));

/**
 * Type definitions derived from schema
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

/**
 * Register a trigger function in the database to automatically update 'updated_at'
 * Must be executed manually after migrations
 */
export async function registerAutoUpdateTrigger(db: any) {
  try {
    dbLogger.info("Setting up auto-update timestamp trigger");

    // Create the trigger function if it doesn't exist
    await db.execute(`
      CREATE OR REPLACE FUNCTION update_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Add triggers to tables
    const tables = ["users", "projects"];
    for (const table of tables) {
      // Check if trigger already exists
      const { rows } = await db.execute(`
        SELECT 1 FROM pg_trigger
        WHERE tgname = '${table}_updated_at_trigger'
      `);

      if (rows.length === 0) {
        await db.execute(`
          CREATE TRIGGER ${table}_updated_at_trigger
          BEFORE UPDATE ON ${table}
          FOR EACH ROW
          EXECUTE FUNCTION update_timestamp();
        `);
        dbLogger.info(`Created updated_at trigger for ${table}`);
      }
    }

    dbLogger.info("Auto-update timestamp triggers configured successfully");
  } catch (error) {
    dbLogger.error("Failed to set up auto-update timestamp triggers: " + String(error));
  }
}
