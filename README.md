# VYAPO

VYAPO is a full-stack website for a smart POS platform built for restaurants, retail stores, and hospitality businesses.

This repository contains:

- `frontend/`: a Next.js landing website
- `backend/`: an Express API for contact form submissions and admin request access

GitHub repository:

`https://github.com/devashishgorai/Vyapo`

## Features

- Responsive marketing website built with Next.js
- Premium landing page UI with animations and theme support
- Contact form connected to an Express backend
- Admin endpoint for viewing submitted requests
- MongoDB-backed storage with in-memory fallback during development
- Deployment-ready setup for Vercel and Render

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, MongoDB, Mongoose

## Project Structure

```text
vyapo/
├── frontend/     # Next.js frontend
├── backend/      # Express backend
├── render.yaml   # Render deployment blueprint
└── README.md
```

## Local Development

Install dependencies:

```bash
cd frontend
npm install

cd ../backend
npm install
```

Create env files from the examples:

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

Run the backend:

```bash
cd backend
npm start
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Open the app at:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5050`

## Environment Variables

Frontend:

```text
NEXT_PUBLIC_API_URL=http://localhost:5050
```

Backend:

```text
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/vyapo?retryWrites=true&w=majority&appName=<app-name>
PORT=5050
FRONTEND_URL=http://localhost:3000
ADMIN_API_KEY=change-this-admin-key
```

## GitHub Setup

If you already created the GitHub repository manually, use:

```bash
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/devashishgorai/Vyapo.git
git push -u origin main
```

If `origin` already exists:

```bash
git remote set-url origin https://github.com/devashishgorai/Vyapo.git
git push -u origin main
```

## Deploy Frontend On Vercel

1. Import the GitHub repository into Vercel.
2. Set the project Root Directory to `frontend`.
3. Add the environment variable below:

```text
NEXT_PUBLIC_API_URL=https://your-backend-service.onrender.com
```

4. Deploy the project.

## Deploy Backend On Render

Use either the included `render.yaml` or create a web service manually with:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Set these environment variables in Render:

```text
MONGO_URI=<your-mongodb-uri>
FRONTEND_URL=https://your-vercel-project.vercel.app
ADMIN_API_KEY=<your-secret-admin-key>
PORT=5050
```

## Recommended Deployment Order

1. Push the repository to GitHub.
2. Deploy the backend to Render.
3. Copy the Render backend URL.
4. Add that URL in Vercel as `NEXT_PUBLIC_API_URL`.
5. Deploy the frontend to Vercel.
6. Update Render `FRONTEND_URL` to the final Vercel domain.

## Notes

- The backend currently supports an in-memory fallback when MongoDB is unreachable during development.
- In-memory submissions are temporary and disappear when the backend restarts.
- For production, use a working MongoDB connection string in Render.
