# ✅ USITech Admin API Check (Completeness & Consistency)

This report validates your proposed Admin API list against the current frontend code (src/**) and the database schema. It flags duplicates/misplacements, confirms coverage, and proposes minimal additions to fully support the UI.

---

## 1) Verdict

- Overall coverage: SUFFICIENT with minor corrections and 3 small additions
- Backend implementation status: Missing (no `src/app/api/**` routes in project)

---

## 2) Duplicates / Misplacements / Inconsistencies

- AUTHENTICATION row contains `GET /api/admin/analytics` → Incorrect section (Analytics, not Authentication).
- `PATCH /api/admin/users/:id/ban` appears in Dashboard & Analytics section → Misplaced (belongs to User Management only).
- `PUT /api/admin/workflows/:id` appears twice across sections → Keep once under Workflow Management.

Action: Move/normalize sections as per table below.

---

## 3) Completeness vs Frontend Features

The frontend uses mock data and expects these capabilities which your list mostly covers:

- Dashboard metrics & analytics: OK (2 endpoints)
- Users list, detail, ban/unban, export: OK (4 endpoints)
- Workflows list/detail/create/update/delete; assets upload/delete: OK (7 endpoints)
- Purchases list/detail/update status; export: OK (4 endpoints)
- Notifications list, mark read, mark all read, delete, export: OK (5 endpoints)
- Settings (admin create/delete/change password): OK (4 endpoints)
- Profile get/update: OK (2 endpoints)
- Categories CRUD: OK (4 endpoints)

Gaps identified (minimal additions):
- A1. GET `/api/admin/workflows/:id/assets` — fetch all assets for a workflow (frontend can rely on details but a dedicated endpoint is useful and matches `workflow_assets` table). Optional but recommended.
- A2. PATCH `/api/admin/notifications/:id/dismiss` — separate from delete (UI “dismiss” suggests soft action; if you prefer hard delete, you can skip). Optional.
- A3. Healthcheck: GET `/api/admin/health` — optional infra endpoint.

Out of scope (no current UI screens):
- Contact messages APIs (table exists but no page)
- Comments APIs (table exists but no page)
- Invoices APIs (derived from purchases; no dedicated page)

---

## 4) Final Normalized API Table (by section)

- AUTHENTICATION
  - POST `/api/admin/login`

- DASHBOARD & ANALYTICS
  - GET `/api/admin/dashboard`
  - GET `/api/admin/analytics`

- USER MANAGEMENT
  - GET  `/api/admin/users`
  - GET  `/api/admin/users/:id`
  - PATCH `/api/admin/users/:id/ban`
  - GET  `/api/admin/users/export`

- WORKFLOW MANAGEMENT
  - GET    `/api/admin/workflows`
  - GET    `/api/admin/workflows/:id`
  - POST   `/api/admin/workflows`
  - PUT    `/api/admin/workflows/:id`
  - DELETE `/api/admin/workflows/:id`
  - POST   `/api/admin/workflows/:id/assets`
  - DELETE `/api/admin/workflows/:id/assets/:assetId`
  - (A1) GET `/api/admin/workflows/:id/assets`  ← recommended

- PURCHASE MANAGEMENT
  - GET  `/api/admin/purchases`
  - GET  `/api/admin/purchases/:id`
  - PATCH `/api/admin/purchases/:id/status`
  - GET  `/api/admin/purchases/export`

- NOTIFICATIONS
  - GET   `/api/admin/notifications`
  - PATCH `/api/admin/notifications/:id/read`
  - PATCH `/api/admin/notifications/read-all`
  - DELETE `/api/admin/notifications/:id`
  - GET   `/api/admin/notifications/export`
  - (A2) PATCH `/api/admin/notifications/:id/dismiss` ← optional vs delete

- SETTINGS & SYSTEM CONFIG
  - GET    `/api/admin/settings`
  - POST   `/api/admin/settings/admins`
  - DELETE `/api/admin/settings/admins/:id`
  - PATCH  `/api/admin/settings/password`

- PROFILE MANAGEMENT
  - GET   `/api/admin/profile`
  - PATCH `/api/admin/profile`

- CATEGORY MANAGEMENT
  - GET    `/api/admin/categories`
  - POST   `/api/admin/categories`
  - PUT    `/api/admin/categories/:id`
  - DELETE `/api/admin/categories/:id`

- INFRA (optional)
  - (A3) GET `/api/admin/health`

---

## 5) Request/Response Conventions (from `src/lib/models.ts`)

- JSON bodies use camelCase fields; DB uses snake_case; map at API boundary.
- Key payloads:
  - User list: `UserWithStats[]`
  - Workflow list: `WorkflowWithStats[]`
  - Purchases: `PurchaseWithDetails[]`
  - Notifications: `NotificationWithUser[]`
  - Forms: `WorkflowFormData`, User/Password forms as described in admin-api-list.md

---

## 6) Database Mappings (primary → related)

- users → purchases
- workflows → workflow_assets, workflow_categories → categories, purchases
- purchases → users, workflows, invoices
- notifications → users
- categories → workflow_categories

---

## 7) Implementation Status

- Backend routes: Missing (no `src/app/api/**`)
- Suggest implementation order: Login → Dashboard/Analytics → Users → Workflows (+assets) → Purchases → Notifications → Settings → Profile → Categories

---

## 8) Summary

- Your list is nearly complete and aligned with the UI and schema.
- Fix two misplacements (analytics under auth, ban under dashboard) and remove the duplicate PUT workflow.
- Add 1 recommended endpoint (`GET /api/admin/workflows/:id/assets`) and 1 optional (`PATCH /api/admin/notifications/:id/dismiss`).
- Optionally add healthcheck endpoint.

Outcome: READY TO IMPLEMENT with minor adjustments above.
