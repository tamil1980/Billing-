# Billing Software (MERN)

A full-stack billing/invoicing application. React + Vite frontend, Express + MongoDB Atlas backend, deployed on Render.

## Project structure

```
├── backend/     Express REST API (Node.js + MongoDB Atlas via Mongoose)
└── frontend/    React + Vite SPA (invoices, items, suppliers, users, reports)
```

## API endpoints (used by the frontend)

| Method | Endpoint              | Purpose                          |
|--------|-----------------------|----------------------------------|
| GET    | `/api/items`          | List inventory items             |
| POST   | `/api/items`          | Add an item                      |
| DELETE | `/api/items/:id`      | Delete an item                   |
| GET    | `/api/suppliers`      | List suppliers                   |
| POST   | `/api/suppliers`      | Add a supplier                   |
| DELETE | `/api/suppliers/:id`  | Delete a supplier                |
| GET    | `/api/invoices`       | List invoices                    |
| GET    | `/api/invoices/:id`   | Get one invoice (with line items)|
| POST   | `/api/invoices`       | Create an invoice                |
| GET    | `/api/users`          | List users                       |
| POST   | `/api/users`          | Add/register a user              |
| DELETE | `/api/users/:id`      | Delete a user                    |
| POST   | `/api/auth/login`     | Login                            |

## 1. Run locally

### Backend

```bash
cd backend
npm install
cp .env.example .env     # then edit .env with your MongoDB Atlas URI
npm start                # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # VITE_API_BASE_URL=http://localhost:5000 is fine
npm run dev                  # http://localhost:5173
```

## 2. MongoDB Atlas setup

1. Create a free cluster at https://www.mongodb.com/atlas
2. In **Database Access**, create a database user with a password.
3. In **Network Access**, add `0.0.0.0/0` (anywhere) — required for Render to connect.
4. Click **Connect → Drivers** and copy the connection string:
   `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`
5. Optionally append a database name: `...mongodb.net/billing?retryWrites=true&w=majority`
6. Set that string as `MONGODB_URI` on your backend (`.env` locally, env var on Render).

On first start the backend automatically seeds two demo login accounts:

- Admin: `admin@admin.in` / `admin123`
- User:  `user@admin.in` / `user123`

## 3. Deploy to Render

### A. Backend (web service)

1. Push the `backend/` folder to a GitHub repo of its own (Or include it in a repo).
2. In Render: **New → Web Service**, connect the repo.
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Runtime**: Node (Node 20+)
4. **Environment variables**:
   - `MONGODB_URI` = your Atlas connection string
   - `CORS_ORIGIN` = `*` (or your frontend URL, comma-separated for multiple)
5. Deploy. Note the URL, e.g. `https://billing-backend.onrender.com`.

### B. Frontend (static site)

1. Push the `frontend/` folder to a GitHub repo (e.g. your existing `Billing-frontend`).
2. In Render: **New → Static Site**, connect the repo.
3. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
4. **Environment variable**: `VITE_API_BASE_URL` = your backend URL,
   e.g. `https://billing-backend.onrender.com`
5. Deploy, then open the frontend URL and log in with a demo account.

> Alternatively, if you copy the built `frontend/dist` next to `backend/`, the backend
> will serve the SPA itself — but the two-service setup above is the recommended approach.

## Notes

- Passwords are hashed with bcrypt in MongoDB. The `README` demo accounts are seeded once.
- If the frontend cannot reach the API it silently falls back to `localStorage`, so the
  app still opens — but data will not be shared until the API is reachable.