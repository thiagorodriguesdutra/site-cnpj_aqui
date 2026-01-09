import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const cnpjQueries = pgTable(
  "cnpj_queries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    cnpj: text("cnpj").notNull(),
    responseData: jsonb("response_data"),
    queriedAt: timestamp("queried_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdQueriedAtIdx: index("cnpj_queries_user_id_queried_at_idx").on(
      table.userId,
      table.queriedAt,
    ),
    cnpjIdx: index("cnpj_queries_cnpj_idx").on(table.cnpj),
  }),
);

export type CnpjQuery = typeof cnpjQueries.$inferSelect;
export type NewCnpjQuery = typeof cnpjQueries.$inferInsert;
