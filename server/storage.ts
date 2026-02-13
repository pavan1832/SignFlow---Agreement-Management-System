import { db } from "./db";
import { agreements, auditLogs, type Agreement, type InsertAgreement, type AuditLog, type InsertAuditLog } from "../shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {

  // Agreements
  createAgreement(agreement: InsertAgreement): Promise<Agreement>;
  getAgreement(id: number): Promise<Agreement | undefined>;
  getAgreementsBySender(senderId: string): Promise<Agreement[]>;
  getAgreementsBySigner(signerId: string): Promise<Agreement[]>; // By ID
  getAgreementsBySignerEmail(email: string): Promise<Agreement[]>; // By Email
  updateAgreementStatus(id: number, status: string, signerId?: string): Promise<Agreement>;
  
  // Audit Logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(agreementId: number): Promise<AuditLog[]>;
}

export class DatabaseStorage implements IStorage {
  // Auth methods delegated to authStorage
 

  async createAgreement(agreement: InsertAgreement): Promise<Agreement> {
    const [newAgreement] = await db.insert(agreements).values(agreement).returning();
    return newAgreement;
  }

  async getAgreement(id: number): Promise<Agreement | undefined> {
    const [agreement] = await db.select().from(agreements).where(eq(agreements.id, id));
    return agreement;
  }

  async getAgreementsBySender(senderId: string): Promise<Agreement[]> {
    return db.select().from(agreements).where(eq(agreements.senderId, senderId)).orderBy(desc(agreements.createdAt));
  }

  async getAgreementsBySigner(signerId: string): Promise<Agreement[]> {
    return db.select().from(agreements).where(eq(agreements.signerId, signerId)).orderBy(desc(agreements.createdAt));
  }

  async getAgreementsBySignerEmail(email: string): Promise<Agreement[]> {
    return db.select().from(agreements).where(eq(agreements.signerEmail, email)).orderBy(desc(agreements.createdAt));
  }

  async updateAgreementStatus(id: number, status: string, signerId?: string): Promise<Agreement> {
    const updates: any = { status, updatedAt: new Date() };
    if (signerId) updates.signerId = signerId;
    
    const [updated] = await db.update(agreements)
      .set(updates)
      .where(eq(agreements.id, id))
      .returning();
    return updated;
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
  }

  async getAuditLogs(agreementId: number): Promise<AuditLog[]> {
    return db.select()
      .from(auditLogs)
      .where(eq(auditLogs.agreementId, agreementId))
      .orderBy(desc(auditLogs.timestamp));
  }
}

export const storage = new DatabaseStorage();
