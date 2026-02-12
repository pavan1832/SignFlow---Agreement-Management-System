# Project Report: Agreement Management System

## 1. Project Overview
The **Agreement Management System** is a full-stack web platform designed to streamline the process of uploading, sending, and signing digital agreements. It provides a secure environment for document management with a clear audit trail for compliance and tracking.

## 2. Technical Specification

### 2.1 Frontend Architecture
- **Framework**: React.js (Vite-powered)
- **State Management**: TanStack Query for server state; React Hooks for local state.
- **UI Framework**: Tailwind CSS with shadcn/ui primitives.
- **Routing**: Wouter for a fast, minimal routing experience.
- **Animations**: Framer Motion for enhanced user experience.

### 2.2 Backend Architecture
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: Replit Auth (OIDC) with session-based persistence.
- **File Handling**: Multer for processing PDF uploads.
- **ORM**: Drizzle ORM for type-safe PostgreSQL queries.

### 2.3 Database Schema
- **Users**: Stores profile information and roles (Sender/Signer).
- **Agreements**: Tracks document metadata, file paths, and current status (`Draft`, `Sent`, `Signed`).
- **Audit Logs**: Records every interaction with an agreement for security and transparency.
- **Sessions**: Manages user authentication sessions.

## 3. System Workflow

### 3.1 Upload & Draft
Senders upload a PDF document. The system stores the file locally (simulating Azure Blob Storage) and creates a database record in the `Draft` state.

### 3.2 Dispatch
The sender assigns a signer (via email) and moves the document to the `Sent` state. This triggers an audit log entry.

### 3.3 Signing
The designated signer accesses the document through their dashboard. Upon "signing," the document status transitions to `Signed`, and the action is permanently recorded in the audit trail.

## 4. Security & Compliance
- **Authenticated Access**: All routes are protected by OIDC authentication.
- **Audit Logging**: Every sensitive action is logged with the performing user's ID and a timestamp.
- **Type Safety**: End-to-end type safety using TypeScript and shared schemas between frontend and backend.

## 5. Deployment & Environment
- **Platform**: Developed and hosted on Replit.
- **Database**: Managed PostgreSQL instance.
- **File System**: Local `uploads/` directory for document storage.

## 6. Conclusion
The system successfully replicates core "DocuSign" functionality, offering a scalable and maintainable codebase for document workflow management.
