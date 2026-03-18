import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { personsTable } from "./persons";

export const creditEntriesTable = pgTable("credit_entries", {
  id: serial("id").primaryKey(),
  personId: integer("person_id").notNull().references(() => personsTable.id),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  type: text("type", { enum: ["earned", "used"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCreditEntrySchema = createInsertSchema(creditEntriesTable).omit({ id: true, createdAt: true });
export type InsertCreditEntry = z.infer<typeof insertCreditEntrySchema>;
export type CreditEntry = typeof creditEntriesTable.$inferSelect;
