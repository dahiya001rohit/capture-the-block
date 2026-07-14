<p align="center">
  <strong>🟥 🟩 🟦 🟨</strong>
</p>

<h1 align="center">capture / the / block</h1>

<p align="center">
  A real-time, multiplayer shared grid where every tile is up for grabs.<br/>
  Click to claim. Steal to survive. Watch it all happen live.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/socket.io-4.8-010101?style=flat-square&logo=socket.io" />
  <img src="https://img.shields.io/badge/redis-7-DC382D?style=flat-square&logo=redis" />
  <img src="https://img.shields.io/badge/postgres-16-4169E1?style=flat-square&logo=postgresql" />
  <img src="https://img.shields.io/badge/node-24-339933?style=flat-square&logo=node.js" />
</p>

---

## What is this?

A **40 × 40 shared canvas** (1,600 tiles) that every visitor shares simultaneously. You land on the site, get assigned a random color and anonymous identity, and start clicking tiles to claim them. Every claim is broadcast to every connected client in real-time via WebSockets — no polling, no refresh. Other players can steal your tiles, and you can steal theirs. The board never stops moving.

---

## ✨ Demo

| Landing Page | Board (gameplay) |
|:---:|:---:|
| A polished marketing-style landing page with a **live animated mini-grid**, scroll-triggered animations, and a **real-time online counter** in the navbar. | The core 40×40 interactive grid with sidebar showing your identity, cooldown timer, live leaderboard, and presence count. |

---

## Tech Stack & Why

| Layer | Tech | Why |
|:---|:---|:---|
| **Frontend** | React 19, Vite 8, TypeScript | Fast HMR, modern JSX, type safety across the full stack |
| **Styling** | Tailwind CSS v4 | Utility-first for rapid, consistent UI without CSS file sprawl |
| **Animations** | Framer Motion | Declarative scroll-triggered reveals and stagger animations for the landing page |
| **State** | Zustand | Minimal boilerplate store — one flat object, selector-based re-renders, no context wrappers |
| **Real-time** | Socket.IO (WebSocket) | Persistent bidirectional channel. Auto-reconnect, room support, and binary transport out of the box |
| **Server** | Node.js, Express, TypeScript | Same language front-to-back. Express for the health/board REST endpoints; Socket.IO for everything else |
| **Cache / Atomic ops** | Redis (ioredis) | Sub-millisecond reads for the hot path. A **Lua script** makes each claim fully atomic (see below) |
| **Database** | PostgreSQL (pg) | Durable source of truth. The board survives restarts; Redis is the fast layer on top |
| **Deployment** | Vercel (client) + Render (server) | Free tier friendly. Vercel for static SPA hosting; Render for the Node + Redis + Postgres backend |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         CLIENTS                              │
│  React + Zustand + Socket.IO-client                          │
│  Optimistic UI: paint first, reconcile later                 │
└────────────────────────┬─────────────────────────────────────┘
                         │  WebSocket (persistent)
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    NODE / EXPRESS SERVER                      │
│                                                              │
│  gateway.ts ── Socket.IO event handlers                      │
│    ├─ connection  → resolve/create player, send init payload │
│    ├─ claim       → rate-limit check → runClaim (Lua)        │
│    ├─ name:update → sanitize → persist → broadcast           │
│    └─ disconnect  → broadcast new online count               │
│                                                              │
│  flusher.ts ── periodic dirty-tile flush to Postgres         │
│  identity.ts ── anonymous ID generation + name sanitization  │
│  http.ts ── GET /health, GET /board (REST fallback)          │
└────────────┬────────────────────────┬────────────────────────┘
             │                        │
             ▼                        ▼
┌────────────────────┐    ┌────────────────────────┐
│       REDIS        │    │      POSTGRESQL         │
│                    │    │                          │
│  ctb:board (hash)  │    │  players (id, name,     │
│  ctb:lb (zset)     │    │           color)         │
│  ctb:cd:* (expiry) │    │  tiles (idx, owner_id,   │
│  ctb:dirty (set)   │    │         color,            │
│  ctb:player:* (h)  │    │         updated_at)       │
└────────────────────┘    └────────────────────────┘
```

### Data Flow for a Single Claim

1. **Client clicks a tile** → Optimistic paint: the tile turns to the player's color instantly in local Zustand state. Cooldown timer starts client-side.
2. **`claim` event sent** over the WebSocket to the server.
3. **Rate-limit check** — a sliding window (max 10 claims/sec) prevents abuse. Exceeding it disconnects the socket.
4. **Redis Lua script (`claim.lua`)** executes atomically:
   - Check the player's cooldown key (`PTTL`). If active → reject with remaining TTL.
   - Check if the tile is already owned by the same player → reject (`self`).
   - Otherwise: update the board hash, increment the claimer's score in the sorted set, decrement the previous owner's score (removing them if they hit 0), set the cooldown key with a TTL, and mark the tile as dirty.
   - All of this happens in **a single atomic Redis operation** — no race conditions, no partial updates.
5. **Server broadcasts** `tile` event to **all** connected clients.
6. **Leaderboard** is marked dirty and rebroadcast every 750ms (throttled to avoid spamming).
7. **Flusher** picks up dirty tiles every 5 seconds and batch-upserts them into Postgres for durability.
8. **If the claim was rejected** (cooldown or self-claim), the server sends `claim:rejected` back to the originating client. The client **reconciles** — reverting the optimistic paint to the server's truth.

---

## 🌟 Bonus Features Implemented

### ✅ User Names & Colors
Every player gets a **randomly assigned color** from a curated 20-color palette and an anonymous identity (`anon-xxxxxxxx`). Players can **rename themselves** via an inline edit in the identity chip — the new name propagates to all clients instantly (leaderboard, tile tooltips, and board state all update).

### ✅ Cooldown System (3-second)
After every successful claim, a **3-second cooldown** locks the player out. This is enforced **server-side** via a Redis key with a TTL — no client-side bypass is possible. The UI shows a smooth animated cooldown bar that drains in real-time using `requestAnimationFrame`. If a player clicks during cooldown, the tile briefly flashes to give tactile feedback without sending a network request.

### ✅ Real-Time Leaderboard
A **live top-10 leaderboard** is displayed in the sidebar. It uses a Redis sorted set (`ZSET`) that's updated atomically with every claim. Rankings recompute instantly — climb or fall with each tile flip. The leaderboard uses a **FLIP animation** technique: when ranks change, rows smoothly slide to their new positions using `useLayoutEffect` + CSS transforms.

### ✅ Live Online Presence
The navbar (on both the landing page and board page) shows the **real-time count of connected players**. This updates via Socket.IO's `online` event every time someone connects or disconnects. The green pulsing dot uses a custom `pulse-dot` CSS animation.

### ✅ Animations & Micro-Interactions
- **Tile claim animation** (`animate-claim`): a subtle scale pulse when you claim a tile.
- **Tile flip animation** (`animate-flip`): a brightness flash when someone else claims a tile you can see.
- **Hover effects**: tiles brighten on hover with a subtle outline to show they're interactive.
- **Your tiles**: marked with a white inner border (`box-shadow`) so you always know what you own.
- **Cooldown flash**: clicking during cooldown triggers a brightness spike on the tile.
- **Reconnection toast**: if the WebSocket drops, a toast appears with an amber pulsing dot and "reconnecting…" message.
- **Landing page**: Framer Motion scroll-triggered fade-up reveals with staggered children. A live mini-grid in the hero section with random tile flips.
- **Marquee ticker**: infinite-scroll banner highlighting game rules.
- **Leaderboard FLIP**: rank position changes animate smoothly.

### ✅ Optimistic UI
Claims paint **immediately** on the client before server confirmation arrives. If the server rejects the claim (someone beat you by milliseconds), the tile quietly reverts to the true owner. This makes the app feel instant even on higher-latency connections.

### ✅ Atomic Conflict Resolution (Lua Script)
The core claim logic is a **31-line Lua script** that runs inside Redis. Because Redis executes Lua atomically, two players clicking the same tile in the same millisecond will never cause a double-paint, a torn state, or a leaderboard desync. The script handles:
- Cooldown enforcement (server-authoritative)
- Self-claim prevention (you can't reclaim your own tile)
- Board state update + leaderboard score adjustment + dirty-set marking — all in one atomic operation

### ✅ Durability (Write-Behind to Postgres)
Redis is fast but volatile. A **flusher** runs every 5 seconds, collecting all tiles marked "dirty" and batch-upserting them into Postgres. On server restart, if the Redis board is empty, it's rehydrated from Postgres. The board survives crashes and redeploys.

### ✅ Rate Limiting
A per-socket sliding window limits claims to **10 per second**. Exceeding this **disconnects the socket** entirely — no warning, no retry. This prevents bots and scripts from flooding the board.

### ✅ Session Persistence
Your anonymous ID is stored in `localStorage`. When you reconnect (or refresh the page), the client sends it via Socket.IO's `auth` callback. The server looks up your player record in Redis and restores your identity, color, and name. You pick up right where you left off.

### ✅ Responsive Mobile UI
The entire landing page adapts to mobile viewports. The navbar switches to a hamburger menu below 650px while keeping the live online count always visible. Cards and sections reflow cleanly.

---

## Project Structure

```
capture-the-block/
├── client/                          # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── board/               # Board page components
│   │   │   │   ├── Board.tsx        # 40×40 grid renderer
│   │   │   │   ├── Tile.tsx         # Memoized tile with claim/flip animations
│   │   │   │   ├── Cooldown.tsx     # rAF-driven cooldown bar
│   │   │   │   ├── Leaderboard.tsx  # Top 10 with FLIP animations
│   │   │   │   ├── IdentityChip.tsx # Player identity + inline rename
│   │   │   │   ├── PresenceBadge.tsx# Online player count
│   │   │   │   ├── Toast.tsx        # Reconnection notification
│   │   │   │   ├── NameInput.tsx    # Rename text input
│   │   │   │   └── Footer.tsx       # Board page footer
│   │   │   └── landing/             # Landing page components
│   │   │       ├── Navbar.tsx       # Sticky nav with hamburger menu
│   │   │       ├── Hero.tsx         # Hero section with live mini-grid
│   │   │       ├── MarqueeTicker.tsx # Infinite scroll ticker
│   │   │       ├── WhySection.tsx   # Feature cards
│   │   │       ├── HowItWorks.tsx   # 3-step flow
│   │   │       ├── Standings.tsx    # Sample leaderboard
│   │   │       ├── CTASection.tsx   # Call to action
│   │   │       ├── LandingFooter.tsx# Footer
│   │   │       └── anim.ts         # Shared Framer Motion variants
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx      # Landing page layout
│   │   │   ├── BoardPage.tsx        # Board page layout
│   │   │   └── AboutPage.tsx        # About / tech deep-dive
│   │   ├── state/
│   │   │   ├── store.ts            # Zustand store (global state)
│   │   │   └── useSocket.ts        # Socket.IO event wiring + optimistic claims
│   │   ├── socket.ts               # Socket.IO client instance + auth
│   │   ├── types.ts                # Shared TypeScript interfaces
│   │   ├── App.tsx                  # Router + global socket init
│   │   └── index.css               # Tailwind v4, fonts, keyframes
│   ├── vercel.json                  # SPA rewrite rules for Vercel
│   └── package.json
│
├── server/                          # Node.js backend
│   ├── src/
│   │   ├── index.ts                # Entrypoint — boot, migrate, hydrate, listen
│   │   ├── config.ts               # Environment + game constants
│   │   ├── gateway.ts              # Socket.IO event handlers (the core)
│   │   ├── identity.ts             # Player creation + name validation
│   │   ├── flusher.ts              # Periodic dirty-tile flush to Postgres
│   │   ├── http.ts                 # REST routes (/health, /board)
│   │   ├── types.ts                # Server-side TypeScript interfaces
│   │   ├── redis/
│   │   │   ├── client.ts           # ioredis instance + Lua script loader
│   │   │   ├── store.ts            # All Redis read/write operations
│   │   │   └── claim.lua           # ★ Atomic claim script (31 lines)
│   │   └── db/
│   │       ├── pool.ts             # pg connection pool
│   │       ├── repo.ts             # Postgres queries (upsert, load)
│   │       └── migrations.sql      # Schema (players + tiles)
│   ├── tsconfig.json
│   └── package.json
│
└── .env.example                     # Required environment variables
```

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 20
- **Redis** ≥ 7 (running locally or a hosted instance)
- **PostgreSQL** ≥ 14 (running locally or a hosted instance)

### 1. Clone

```bash
git clone https://github.com/dahiya001rohit/capture-the-block.git
cd capture-the-block
```

### 2. Server Setup

```bash
cd server
cp ../.env.example .env
# Edit .env with your Redis URL, Postgres URL, and CORS origin
npm install
npm run dev
```

The server runs on `http://localhost:3001` by default.

### 3. Client Setup

```bash
cd client
cp .env.example .env
# Set VITE_SERVER_URL=http://localhost:3001
npm install
npm run dev
```

The client runs on `http://localhost:5173`.

### Environment Variables

| Variable | Description | Default |
|:---|:---|:---|
| `PORT` | Server port | `3001` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `DATABASE_URL` | Postgres connection string | `postgres://postgres:postgres@localhost:5432/capture_the_block` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |
| `SELF_URL` | (Optional) Server's own URL for keep-alive pings on free-tier hosts | — |
| `VITE_SERVER_URL` | (Client) Backend URL | `http://localhost:3001` |

---

## Design Decisions

### Why Redis + Postgres (not just one)?

**Redis** handles the hot path — every claim, every cooldown check, every leaderboard read. It's fast enough to feel instant. But Redis is volatile; a restart wipes everything.

**Postgres** is the durable layer. A background flusher batch-writes dirty tiles every 5 seconds. On cold start, the server checks if Redis is empty and rehydrates from Postgres. This gives us the speed of an in-memory store with the durability of a relational database.

### Why a Lua script instead of multiple Redis commands?

Without Lua, a claim requires multiple round-trips: check cooldown, read tile, write tile, update scores, set cooldown, mark dirty. Between any two of these steps, another player's claim could interleave, causing a race condition (double-counting, stale reads, etc.).

The Lua script runs all of this as a **single atomic operation** inside Redis. No interleaving is possible. It's the simplest way to guarantee correctness without external locks or transactions.

### Why optimistic UI?

If we waited for the server to confirm before painting the tile, every click would have a visible delay (round-trip latency). Instead, we paint immediately and reconcile if the server disagrees. In practice, rejections are rare (mainly cooldown violations), so the optimistic paint is correct >99% of the time. The result: the app feels local-speed even on a 100ms connection.

### Why Zustand over Redux/Context?

Zustand is 1KB, has no boilerplate, and supports selector-based re-renders out of the box. For a store with ~7 fields and a flat shape, Redux's ceremony (actions, reducers, middleware) would be overkill. Zustand's `useStore(selector)` pattern means individual tiles and the leaderboard only re-render when their specific data changes.

---

## Key Metrics

| Metric | Value |
|:---|:---|
| Board size | 40 × 40 = **1,600 tiles** |
| Color palette | **20 colors** |
| Claim cooldown | **3 seconds** (server-enforced) |
| Leaderboard broadcast interval | **750ms** (throttled) |
| Dirty tile flush interval | **5 seconds** |
| Rate limit | **10 claims/sec** per socket |
| Claim latency (Lua script) | **< 1ms** on Redis |

---

## License

MIT

---

<p align="center">
  <em>a pixel is never permanent</em>
</p>
