import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const planTypeEnum = pgEnum("plan_type", [
  "trial",
  "monthly",
  "yearly",
  "package",
]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "usage",
  "purchase",
  "bonus",
  "refund",
]);
export const userPlanStatusEnum = pgEnum("user_plan_status", [
  "pending",
  "active",
  "expired",
  "canceled",
]);
export const paymentOrderStatusEnum = pgEnum("payment_order_status", [
  "pending",
  "confirmed",
  "canceled",
  "expired",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "pix",
  "credit_card",
  "boleto",
]);

export const userCredits = pgTable("user_credits", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  availableCredits: integer("available_credits").default(3).notNull(),
  totalUsed: integer("total_used").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const plans = pgTable("plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: planTypeEnum("type").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  credits: integer("credits").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userPlans = pgTable(
  "user_plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "restrict" }),
    status: userPlanStatusEnum("status").default("pending").notNull(),
    activatedAt: timestamp("activated_at", { mode: "date" }),
    expiresAt: timestamp("expires_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdStatusIdx: index("user_plans_user_id_status_idx").on(
      table.userId,
      table.status,
    ),
    expiresAtIdx: index("user_plans_expires_at_idx").on(table.expiresAt),
  }),
);

export const creditTransactions = pgTable(
  "credit_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: transactionTypeEnum("type").notNull(),
    amount: integer("amount").notNull(),
    description: text("description").notNull(),
    planId: uuid("plan_id").references(() => plans.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    userIdCreatedAtIdx: index("credit_transactions_user_id_created_at_idx").on(
      table.userId,
      table.createdAt,
    ),
  }),
);

export const paymentOrders = pgTable(
  "payment_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "restrict" }),
    status: paymentOrderStatusEnum("status").default("pending").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    paymentMethod: paymentMethodEnum("payment_method").default("pix").notNull(),
    paymentId: text("payment_id"),
    externalReference: text("external_reference").notNull(),
    paymentData: text("payment_data"),
    processed: boolean("processed").default(false).notNull(),
    confirmedAt: timestamp("confirmed_at", { mode: "date" }),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdStatusIdx: index("payment_orders_user_id_status_idx").on(
      table.userId,
      table.status,
    ),
    statusCreatedAtIdx: index("payment_orders_status_created_at_idx").on(
      table.status,
      table.createdAt,
    ),
    paymentIdIdx: index("payment_orders_payment_id_idx").on(table.paymentId),
    externalReferenceIdx: index("payment_orders_external_reference_idx").on(
      table.externalReference,
    ),
  }),
);

export type UserCredit = typeof userCredits.$inferSelect;
export type NewUserCredit = typeof userCredits.$inferInsert;
export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
export type UserPlan = typeof userPlans.$inferSelect;
export type NewUserPlan = typeof userPlans.$inferInsert;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type NewCreditTransaction = typeof creditTransactions.$inferInsert;
export type PaymentOrder = typeof paymentOrders.$inferSelect;
export type NewPaymentOrder = typeof paymentOrders.$inferInsert;
