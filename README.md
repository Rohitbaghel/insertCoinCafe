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
npm run dev -- --port 43127
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
