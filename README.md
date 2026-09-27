# InsertCoinCafe

Operator dashboard for InsertCoinCafe gaming cafe billing: live station timers, rate cards, and session invoicing in ₹.

## Features

- **Left sidebar** — Dashboard, Customer Site, Shop Setup (Rate Card + stubs), and more
- **Active sessions** — Start / Pause / Done / Reset per seat with HH:MM:SS timers (Asia/Kolkata)
- **Rate Card** — Game type grid, Fixed Interval vs Custom Time Slot, interval minutes + ₹ price; locked while stations of that type run
- **Customer site (`/play`)** — Marketing home, OTP login, 1-hour slot booking, confirmation, rewards/points
- **Billing** — Session cost uses rate-card interval pricing; discount/adjustment, final total, customer phone/name

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

- Operator desk: [http://127.0.0.1:43127](http://127.0.0.1:43127)
- Rate Card: [http://127.0.0.1:43127/rate-card](http://127.0.0.1:43127/rate-card)
- Customer site: [http://127.0.0.1:43127/play](http://127.0.0.1:43127/play)

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
