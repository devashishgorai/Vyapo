# VYAPO

VYAPO is a two-part project:

- `frontend/`: Next.js marketing site
- `backend/`: Express API for contact form submissions and admin request listing

## Local Setup

Install dependencies:

```bash
cd frontend && npm install
cd ../backend && npm install
```

Run locally:

```bash
cd backend && npm start
cd frontend && npm run dev
```

Environment variables:

- `frontend/.env.example`
- `backend/.env.example`

## GitHub Setup

Initialize git locally:

```bash
git init
git add .
git commit -m "Initial project setup"
```

Then create an empty GitHub repository and connect it:

```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## Deploy Frontend On Vercel

1. Import the GitHub repository into Vercel.
2. Set the Vercel project Root Directory to `frontend`.
3. Add this environment variable:

```text
NEXT_PUBLIC_API_URL=https://<your-render-backend-url>
```

4. Deploy.

## Deploy Backend On Render

You can deploy from the included `render.yaml` or create the service manually.

Manual settings:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Required environment variables:

```text
MONGO_URI=<your-mongodb-connection-string>
FRONTEND_URL=https://<your-vercel-frontend-url>
ADMIN_API_KEY=<optional-secret>
PORT=5050
```

## Deployment Order

1. Push this project to GitHub.
2. Deploy the backend to Render.
3. Copy the Render URL into Vercel as `NEXT_PUBLIC_API_URL`.
4. Deploy the frontend to Vercel.
5. Update Render `FRONTEND_URL` to your final Vercel URL.
