# Agreement Management System

A DocuSign-inspired full-stack application for managing agreement workflows, uploading PDFs, tracking status, and maintaining audit trails.

## 🚀 Technologies Used

### Frontend
- **React.js**: Functional components with Hooks.
- **Tailwind CSS**: Modern styling with a customized shadcn/ui component library.
- **Wouter**: Lightweight routing.
- **TanStack Query (React Query)**: Efficient data fetching and state synchronization.
- **Lucide React**: Professional iconography.
- **Framer Motion**: Smooth UI animations and transitions.

### Backend
- **Node.js & Express**: Robust RESTful API architecture.
- **Replit Auth**: Secure OpenID Connect authentication.
- **Multer**: Handling multipart/form-data for PDF uploads.
- **Drizzle ORM**: Type-safe database interactions.

### Database
- **PostgreSQL**: Relational database for storing users, agreements, and audit logs.

### Infrastructure & Deployment
- **Azure Blob Storage (Simulated/Local)**: File storage for uploaded agreement PDFs.
- **Replit**: Development and hosting environment.

---

## 🛠️ Key Features

- **Authentication**: Seamless login using Replit accounts.
- **Role-Based Workflow**:
  - **Senders**: Upload PDFs, assign signers, and track agreement status.
  - **Signers**: View and digitally "sign" assigned documents.
- **Agreement Lifecycle**: Management through states: `Draft` → `Sent` → `Signed`.
- **Audit Trail**: Detailed logging of every action (Created, Viewed, Sent, Signed) with timestamps and user details.
- **PDF Preview**: Integrated document viewing within the application.

---

## 📂 Project Structure

- `client/`: React frontend application.
- `server/`: Express backend, database configuration, and storage logic.
- `shared/`: Shared TypeScript types, Drizzle schemas, and API route definitions.
- `uploads/`: Local directory for stored PDF files.

---

## 🚦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   Ensure your `DATABASE_URL` is configured, then sync the schema:
   ```bash
   npm run db:push
   ```

3. **Run Application**:
   ```bash
   npm run dev
   ```

---
##Live Demo
Project is live here: https://agreement-manager--lokpavan18.replit.app/


## 📝 License
MIT
