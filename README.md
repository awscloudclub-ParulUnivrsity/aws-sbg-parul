# AWS SBG Parul University — Monorepo

Welcome to the official repository of the AWS Student Builder Group at Parul University. This project is structured as a modern full-stack monorepo featuring a React frontend, an Express API backend, and a Neon PostgreSQL database managed via Prisma.

## 📁 Repository Structure

This project uses npm workspaces to manage its packages and apps inside a single repository:

```
├── apps/
│   ├── frontend/        # React + Vite (SPA frontend client)
│   └── backend/         # Express REST API (Database access and authorization)
├── database/
│   └── prisma/          # Prisma schema, migrations, and seeding scripts
├── docs/                # Project audits, checklists, and documentation
├── package.json         # Root configuration and scripts
└── .env                 # Unified environment variables
```

---

## 🛠️ Tech Stack

- **Frontend Client:** React 19, Vite, Tailwind CSS v4, Lucide Icons
- **Backend API:** Express, Helmet (headers security), CORS, Node.js
- **Database Layer:** Neon PostgreSQL, Prisma ORM
- **Auth & Storage:** Supabase Auth (client JWTs) & Supabase Storage (binary uploads)

---

## 📋 Hybrid Architecture

This application employs a highly secure hybrid architecture:
1. **Authentication & Storage:** Handled directly on the frontend client using the Supabase JS SDK. Clients authenticate with Supabase Auth and retrieve JWT session tokens, and upload certificate images directly to Supabase Storage.
2. **Database & Business Logic:** Restricted from client-side direct access. The frontend client sends the Supabase JWT token in the `Authorization: Bearer <token>` header of REST API calls to the Express backend.
3. **Backend Middleware:** The Express backend extracts the token, verifies it against Supabase Auth, resolves the user metadata, syncs/verifies the user profile with Neon PostgreSQL, and checks the user's role before processing the request.

---

## 🚀 Getting Started

### 1. Prerequisite Installations
Ensure you have **Node.js (v18+)** and **npm (v9+)** installed on your system.

### 2. Configure Environment Variables
Create a `.env` file at the root of the repository with the following structure:
```env
# Supabase Configuration (Client Auth & Storage)
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Database Connection (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@neon-host/dbname?sslmode=require

# Backend Options (Optional)
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173,https://your-production-domain.com
```

### 3. Install Workspace Dependencies
Install dependencies for all workspaces synchronously from the monorepo root:
```bash
npm install
```
*Note: This will trigger a `postinstall` script to automatically generate the Prisma Client.*

### 4. Database Setup & Seeding
If you are setting up the database for the first time, push the schema to Neon PostgreSQL:
```bash
npm run db:push --workspace=database
```

---

## 💻 Development Commands

All commands can be run from the root directory:

| Command | Action |
|---------|--------|
| `npm run dev` | Runs both Frontend and Backend concurrently |
| `npm run dev:frontend` | Runs the Vite dev server only |
| `npm run dev:backend` | Runs the nodemon Express server only |
| `npm run build` | Builds the React frontend application for production |
| `npm run generate` | Regenerates the Prisma Client |

---

## 🔒 Production Security Hardening

- **Helmet Integration:** Express routes are guarded with Helmet headers to prevent standard cross-site scripting (XSS) and clickjacking attacks.
- **Dynamic CORS Controls:** Limits API access strictly to designated production domains and local development environments.
- **Sanitized Errors:** Internal SQL and schema error stacks are logged exclusively to the server stdout, shielding the client from internal database layouts.
- **Cascaded Relations:** Nullable foreign keys in the Prisma schema are configured with `onDelete: SetNull` or `onDelete: Cascade` to prevent foreign key errors when deleting users.
- **Registration Controls:** The backend checks `registration_enabled` setting on signup. If disabled, new OAuth or credentials signups are blocked in the backend.

---

## 👥 User Roles & Access Control

| Role | Access Permissions |
|------|--------------------|
| **Leader** | Full access to settings, members, teams, events, and certifications |
| **Technical** | Access to create, update, and delete events |
| **Social Media** | Access to read, review, and draft posts for certifications |
| **Operations** | Access to view and approve member registrations |
| **Member** | Access to download digital badges and edit personal profiles |

---

## 📜 License

Distributed under the MIT License. Created by AWS Student Builder Group, Parul University.
