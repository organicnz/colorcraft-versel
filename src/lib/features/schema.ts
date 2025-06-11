import { pgTable, text, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";

/**
 * Feature flags table to store feature flag configurations
 */
export const feature_flags = pgTable("feature_flags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  is_enabled: boolean("is_enabled").notNull().default(false),
  environment: text("environment").notNull().default("development"),
  user_targeting: jsonb("user_targeting"), // JSON for user targeting rules (include/exclude users, percentage rollout)
  rule_groups: jsonb("rule_groups"), // JSON for complex rules like A/B testing or cohort-based flags
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Add composite index for name + environment
export const feature_flags_indices = {
  nameEnvironmentIdx: "feature_flags_name_environment_idx",
};

/**
 * Export typed entities
 */
export type FeatureFlag = typeof feature_flags.$inferSelect;
export type InsertFeatureFlag = typeof feature_flags.$inferInsert;

/**
 * Create feature flag schema and indices
 */
export async function createFeatureFlagSchema(db: any) {
  // Create indices for better query performance
  await db.execute(`
    CREATE INDEX IF NOT EXISTS ${feature_flags_indices.nameEnvironmentIdx}
    ON feature_flags (name, environment);
  `);
}

/**
 * Feature flag constants to use across the application
 */
export const FEATURES = {
  // Core features
  NEW_DASHBOARD_UI: {
    name: "new_dashboard_ui",
    defaultValue: false,
    description: "Enable the new dashboard UI",
    environments: ["development", "staging"],
  },
  ADVANCED_ANALYTICS: {
    name: "advanced_analytics",
    defaultValue: false,
    description: "Enable advanced analytics features",
    environments: ["development", "staging", "production"],
  },
  COLLABORATION_TOOLS: {
    name: "collaboration_tools",
    defaultValue: false,
    description: "Enable team collaboration tools",
    environments: ["development"],
  },

  // Performance improvements
  OPTIMIZED_IMAGE_PROCESSING: {
    name: "optimized_image_processing",
    defaultValue: true,
    description: "Use the optimized image processing pipeline",
    environments: ["development", "staging", "production"],
  },

  // Experimental features
  EXPERIMENTAL_CHAT: {
    name: "experimental_chat",
    defaultValue: false,
    description: "Enable experimental chat feature",
    environments: ["development"],
  },
};
