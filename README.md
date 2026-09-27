# InsertCoinCafe

Operator dashboard for InsertCoinCafe gaming cafe billing: live station timers, rate cards, and session invoicing in ₹.

## Features

- **Left sidebar** — Dashboard, Shop Setup (Rate Card + stubs), Rewards, Reports, PC Lock, bookings, tournaments, plans
- **Active sessions** — Start / Pause / Done / Reset per seat with HH:MM:SS timers (Asia/Kolkata)
- **Rate Card** — Game type grid, Fixed Interval vs Custom Time Slot, interval minutes + ₹ price; locked while stations of that type run
- **Billing** — Session cost uses rate-card interval pricing; discount/adjustment, final total, customer phone/name
- **Ops bar** — Resource counts, show/hide revenue, snacks / transfer / reset-all actions

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

Open [http://127.0.0.1:43127](http://127.0.0.1:43127) — Rate Card at [/rate-card](http://127.0.0.1:43127/rate-card).

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
