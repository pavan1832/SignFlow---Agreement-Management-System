export * from "./models/auth";
import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

export const agreements = pgTable("agreements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  fileUrl: text("file_url").notNull(),
  status: text("status", { enum: ["Draft", "Sent", "Signed"] }).default("Draft").notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  signerId: varchar("signer_id").references(() => users.id), // Can be assigned later
  signerEmail: text("signer_email"), // To invite by email if user doesn't exist yet
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  agreementId: integer("agreement_id").references(() => agreements.id).notNull(),
  action: text("action").notNull(), // e.g., "Created", "Sent", "Viewed", "Signed"
  performedBy: varchar("performed_by").references(() => users.id).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Relations
export const agreementsRelations = relations(agreements, ({ one, many }) => ({
  sender: one(users, {
    fields: [agreements.senderId],
    references: [users.id],
    relationName: "senderAgreements",
  }),
  signer: one(users, {
    fields: [agreements.signerId],
    references: [users.id],
    relationName: "signerAgreements",
  }),
  auditLogs: many(auditLogs),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  agreement: one(agreements, {
    fields: [auditLogs.agreementId],
    references: [agreements.id],
  }),
  user: one(users, {
    fields: [auditLogs.performedBy],
    references: [users.id],
  }),
}));

export const insertAgreementSchema = createInsertSchema(agreements).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  senderId: true // set by backend
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ 
  id: true, 
  timestamp: true 
});

export type Agreement = typeof agreements.$inferSelect;
export type InsertAgreement = z.infer<typeof insertAgreementSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
