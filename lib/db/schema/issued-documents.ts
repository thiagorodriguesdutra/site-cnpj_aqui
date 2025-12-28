import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const issuedDocuments = pgTable(
  "issued_documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "set null",
      })
      .notNull(),
    cnpj: text("cnpj").notNull(),
    documentData: jsonb("document_data").notNull(),
    issuedAt: timestamp("issued_at", { mode: "date" }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    idIdx: index("issued_documents_id_idx").on(table.id),
    userIdIdx: index("issued_documents_user_id_idx").on(table.userId),
    cnpjIdx: index("issued_documents_cnpj_idx").on(table.cnpj),
    issuedAtIdx: index("issued_documents_issued_at_idx").on(table.issuedAt),
  }),
);

export const documentValidations = pgTable(
  "document_validations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    documentId: uuid("document_id")
      .references(() => issuedDocuments.id, {
        onDelete: "cascade",
      })
      .notNull(),
    validatedAt: timestamp("validated_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    documentIdIdx: index("document_validations_document_id_idx").on(
      table.documentId,
    ),
    validatedAtIdx: index("document_validations_validated_at_idx").on(
      table.validatedAt,
    ),
  }),
);

export type IssuedDocument = typeof issuedDocuments.$inferSelect;
export type NewIssuedDocument = typeof issuedDocuments.$inferInsert;
export type DocumentValidation = typeof documentValidations.$inferSelect;
export type NewDocumentValidation = typeof documentValidations.$inferInsert;
