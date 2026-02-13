import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "../shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

// Setup multer for local file storage

// TEMP auth middleware (replaces Replit Auth locally)
const isAuthenticated = (req: any, _res: any, next: any) => {
  // mock logged-in user
  req.user = {
    claims: {
      sub: "local-user-123",
      email: "localuser@test.com"
    }
  };
  next();
};

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storageConfig });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  

  // Serve uploaded files statically (protected? mostly public for signedURL simulation)
  // In a real app, this should be protected or use SAS tokens.
  app.use('/uploads', express.static(uploadDir));

  // Agreements Routes
  app.get(api.agreements.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const userEmail = (req.user as any).claims.email;
    
    // Get agreements where user is sender OR signer
    const sent = await storage.getAgreementsBySender(userId);
    
    // For signers, check both ID and Email
    const receivedById = await storage.getAgreementsBySigner(userId);
    let receivedByEmail: any[] = [];
    if (userEmail) {
      receivedByEmail = await storage.getAgreementsBySignerEmail(userEmail);
    }
    
    // Combine and dedup
    const all = [...sent, ...receivedById, ...receivedByEmail];
    const unique = Array.from(new Map(all.map(item => [item.id, item])).values());
    
    // Sort by created desc
    unique.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

    res.json(unique);
  });

  app.post(api.agreements.create.path, isAuthenticated, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Parse body fields (multer puts them in req.body)
      const input = api.agreements.create.input.parse({
        title: req.body.title,
        signerEmail: req.body.signerEmail,
        fileUrl: `/uploads/${req.file.filename}`, // Local URL
        // Status defaults to Draft
      });

      const userId = (req.user as any).claims.sub;
      
      const agreement = await storage.createAgreement({
        ...input,
        senderId: userId,
        status: "Draft",
        fileUrl: `/uploads/${req.file.filename}`
      });

      // Audit Log
      await storage.createAuditLog({
        agreementId: agreement.id,
        action: "Created",
        performedBy: userId,
      });

      res.status(201).json(agreement);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.agreements.get.path, isAuthenticated, async (req, res) => {
    const agreement = await storage.getAgreement(Number(req.params.id));
    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }
    
    // Basic Access Control
    const userId = (req.user as any).claims.sub;
    const userEmail = (req.user as any).claims.email;
    
    const isSender = agreement.senderId === userId;
    const isSigner = agreement.signerId === userId || (userEmail && agreement.signerEmail === userEmail);

    if (!isSender && !isSigner) {
        return res.status(401).json({ message: "Unauthorized access to this agreement" });
    }
    
    // Log "Viewed" action if not owner? Or just log every view? 
    // Let's log if it's the signer viewing it for the first time or something.
    // Simpler: Just log "Viewed"
    await storage.createAuditLog({
        agreementId: agreement.id,
        action: "Viewed",
        performedBy: userId,
    });

    res.json(agreement);
  });

  app.patch(api.agreements.updateStatus.path, isAuthenticated, async (req, res) => {
    const agreementId = Number(req.params.id);
    const { status, signerId } = req.body;
    
    const agreement = await storage.getAgreement(agreementId);
    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    const userId = (req.user as any).claims.sub;
    
    // Logic for state transitions
    if (status === "Sent") {
        if (agreement.senderId !== userId) {
            return res.status(401).json({ message: "Only sender can send agreement" });
        }
        await storage.updateAgreementStatus(agreementId, "Sent");
        await storage.createAuditLog({
            agreementId,
            action: "Sent",
            performedBy: userId
        });
    } else if (status === "Signed") {
        // Check if user is the designated signer
        const userEmail = (req.user as any).claims.email;
        const isSigner = agreement.signerId === userId || (userEmail && agreement.signerEmail === userEmail);
        
        if (!isSigner) {
             return res.status(401).json({ message: "Only designated signer can sign" });
        }

        await storage.updateAgreementStatus(agreementId, "Signed", userId); // Link signer ID if verified
        await storage.createAuditLog({
            agreementId,
            action: "Signed",
            performedBy: userId
        });
    }

    const updated = await storage.getAgreement(agreementId);
    res.json(updated);
  });

  app.get(api.audit.list.path, isAuthenticated, async (req, res) => {
      const logs = await storage.getAuditLogs(Number(req.params.id));
      
      // Enrich with user details (mock or fetch)
      // Since we don't have a joined query easily, we'll fetch user details or just return IDs for now
      // Actually, let's try to fetch user details if possible.
      // For now, return logs. Frontend can show IDs or we can fetch names.
      // Let's fetch names.
      
      const enrichedLogs = await Promise.all(logs.map(async (log) => {
          const user = await storage.getUser(log.performedBy);
          return {
              ...log,
              user: {
                  firstName: user?.firstName || 'Unknown',
                  lastName: user?.lastName || '',
                  email: user?.email || ''
              }
          };
      }));

      res.json(enrichedLogs);
  });

  return httpServer;
}
