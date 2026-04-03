# PhysicsLab AI

Upload a physics practical PDF → AI generates an interactive real-time simulation.

Built with PERN stack (PostgreSQL, Express, React, Node.js) + Google Gemini AI.

## Setup

### 1. Database
```bash
# Create PostgreSQL database
psql -U postgres -f database/schema.sql
```

### 2. Server
```bash
cd server
cp ../.env.example .env  # Edit with your GEMINI_API_KEY and DATABASE_URL
npm install
npm run dev
```

### 3. Client
```bash
cd client
npm install
npm run dev
```

- Client runs on http://localhost:5173
- Server runs on http://localhost:3001
- Vite proxies `/api` requests to the server automatically

## How It Works

1. **Upload PDF** → Text extracted with `pdf-parse`
2. **Pass 1 (Analysis)** → Gemini extracts equations, parameters, observables as JSON
3. **Pass 2 (Generation)** → Gemini generates self-contained HTML simulation
4. **Render** → HTML displayed in sandboxed iframe with live controls
5. **Save** → Stored in PostgreSQL for history

## API

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/simulations/generate` | Upload PDF, generate simulation |
| GET | `/api/simulations` | List all simulations |
| GET | `/api/simulations/:id` | Get simulation with HTML |
