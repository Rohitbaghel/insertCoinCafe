# InsertCoinCafe

Operator dashboard for InsertCoinCafe gaming cafe billing: live station timers, resource overview, and session invoicing in ₹.

## Features

- **Active sessions** — Start / Pause / Done / Reset per seat with HH:MM:SS timers (Asia/Kolkata)
- **Resources** — PS3 and PlayStation (PS4) station cards with player count, prepaid time, running cost, and notes
- **Billing** — Completed sessions move to the billing panel with discount/adjustment, final total, and customer phone/name
- **Ops bar** — Resource counts, show/hide revenue, snacks sale / transfer / reset-all actions

State is client-side only for this slice (no auth or database).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui

## Run locally

```bash
npm install
npm run build
npm run start
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

For hot-reload development:

```bash
npm run dev
```

(`dev` uses webpack on port **43127**.)

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server (webpack, port 43127) |
| `npm run build` | Production build |
| `npm run start` | Serve production build on port 43127 |
| `npm run lint` | ESLint |
