export type ZoneId = "ps3" | "ps4" | "vr" | "race" | "room";

export interface Zone {
  id: ZoneId;
  name: string;
  desc: string;
  /** Fallback hourly price when rate card has no matching type */
  defaultPrice: number;
  stations: number;
  maxPlayers: number;
  active: boolean;
  featured?: boolean;
  img: keyof typeof CUSTOMER_PHOTOS;
  /** Maps to rate-card game type id when applicable */
  rateTypeId?: string;
  resourceCode?: "PS3" | "PS4";
}

export interface CustomerUser {
  name: string;
  phone: string;
  points: number;
}

export interface CustomerBooking {
  code: string;
  zone: ZoneId;
  dateISO: string;
  hour: number;
  players: number;
  amount: number;
  earns: number;
  redeemed: boolean;
  name: string;
  phone: string;
  status: "CONFIRMED" | "CHECKED_IN" | "PAID" | "NO_SHOW";
}

export interface PointsLogEntry {
  date: string;
  what: string;
  pts: number;
}

export interface Offer {
  title: string;
  percent: number;
  text: string;
  start: string;
  end: string;
  active: boolean;
}

export const CAFE_NAME = "InsertCoinCafe";

export const CUSTOMER_PHOTOS = {
  hero: "https://images.pexels.com/photos/7849510/pexels-photo-7849510.jpeg?auto=compress&cs=tinysrgb&w=1260",
  people:
    "https://images.pexels.com/photos/9068911/pexels-photo-9068911.jpeg?auto=compress&cs=tinysrgb&w=1260",
  loginPhoto:
    "https://images.pexels.com/photos/7862270/pexels-photo-7862270.jpeg?auto=compress&cs=tinysrgb&w=1260",
  ps5: "https://images.pexels.com/photos/9409819/pexels-photo-9409819.jpeg?auto=compress&cs=tinysrgb&w=1260",
  ps4: "https://images.pexels.com/photos/7887371/pexels-photo-7887371.jpeg?auto=compress&cs=tinysrgb&w=1260",
  vr: "https://images.pexels.com/photos/7562131/pexels-photo-7562131.jpeg?auto=compress&cs=tinysrgb&w=1260",
  racing:
    "https://images.pexels.com/photos/28993071/pexels-photo-28993071.jpeg?auto=compress&cs=tinysrgb&w=1260",
  room: "https://images.pexels.com/photos/6345411/pexels-photo-6345411.jpeg?auto=compress&cs=tinysrgb&w=1260",
  snacks:
    "https://images.pexels.com/photos/7776896/pexels-photo-7776896.jpeg?auto=compress&cs=tinysrgb&w=1260",
  tournament:
    "https://images.pexels.com/photos/7862621/pexels-photo-7862621.jpeg?auto=compress&cs=tinysrgb&w=1260",
  neon: "https://images.pexels.com/photos/29096083/pexels-photo-29096083.jpeg?auto=compress&cs=tinysrgb&w=1260",
  arena:
    "https://images.pexels.com/photos/9072388/pexels-photo-9072388.jpeg?auto=compress&cs=tinysrgb&w=1260",
  duo: "https://images.pexels.com/photos/7849505/pexels-photo-7849505.jpeg?auto=compress&cs=tinysrgb&w=1260",
  ps3: "https://images.pexels.com/photos/7887371/pexels-photo-7887371.jpeg?auto=compress&cs=tinysrgb&w=1260",
} as const;

export const DEFAULT_ZONES: Zone[] = [
  {
    id: "ps4",
    name: "PlayStation (PS4)",
    desc: "Budget-friendly sessions with a big library of classics.",
    defaultPrice: 80,
    stations: 1,
    maxPlayers: 4,
    active: true,
    featured: true,
    img: "ps4",
    rateTypeId: "ps4",
    resourceCode: "PS4",
  },
  {
    id: "ps3",
    name: "PS3 Zone",
    desc: "Classic consoles with familiar favourites.",
    defaultPrice: 60,
    stations: 2,
    maxPlayers: 4,
    active: true,
    img: "ps3",
    rateTypeId: "ps3",
    resourceCode: "PS3",
  },
  {
    id: "vr",
    name: "VR Zone",
    desc: "Immersive headsets with a dedicated play space.",
    defaultPrice: 250,
    stations: 2,
    maxPlayers: 1,
    active: true,
    img: "vr",
  },
  {
    id: "race",
    name: "Racing Sim",
    desc: "Wheel, pedals and a bucket seat.",
    defaultPrice: 200,
    stations: 2,
    maxPlayers: 1,
    active: true,
    img: "racing",
  },
  {
    id: "room",
    name: "Private Room",
    desc: "Big screen and sofa seating for groups.",
    defaultPrice: 500,
    stations: 1,
    maxPlayers: 8,
    active: true,
    img: "room",
  },
];

export const GAMES = [
  "Football",
  "Racing",
  "Fighting",
  "Shooter",
  "Adventure",
  "Cricket",
];

export const DEFAULT_OFFER: Offer = {
  title: "25% OFF",
  percent: 25,
  text: "25% off any zone on your next booking. Applied automatically at checkout.",
  start: "2026-09-20",
  end: "2026-10-31",
  active: true,
};

export const POINTS = { perHour: 10, forFreeHour: 100 };
export const OPEN_HOUR = 10;
export const CLOSE_HOUR = 23;

export const KNOWN_USERS: Record<string, CustomerUser> = {
  "9876543210": {
    name: "Rahul Kumar",
    phone: "9876543210",
    points: 240,
  },
};

export const DEFAULT_POINTS_LOG: PointsLogEntry[] = [
  { date: "2026-09-02", what: "Paid booking GC-4102 · PS5 Zone", pts: 10 },
  { date: "2026-09-09", what: "Paid booking GC-4290 · VR Zone", pts: 10 },
  { date: "2026-09-14", what: "Welcome bonus", pts: 200 },
  { date: "2026-09-18", what: "Paid booking GC-4555 · PS5 Zone", pts: 10 },
  { date: "2026-09-21", what: "Paid booking GC-4610 · PS4 Zone", pts: 10 },
];

export function rupees(n: number): string {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export function fmtHour(h: number): string {
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}${h < 12 || h === 24 ? " AM" : " PM"}`;
}

export function slotLabel(h: number): string {
  return `${fmtHour(h)} – ${fmtHour(h + 1)}`;
}

export function next7Dates(from = new Date()): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(from);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function offerIsLive(offer: Offer, today = new Date()): boolean {
  if (!offer.active) return false;
  const key = today.toISOString().slice(0, 10);
  return (!offer.start || key >= offer.start) && (!offer.end || key <= offer.end);
}

export function hourlyFromRate(
  pricePerInterval: number,
  intervalMinutes: number
): number {
  return Math.round(pricePerInterval * (60 / Math.max(1, intervalMinutes)));
}

export function priceFor(
  base: number,
  redeem: boolean,
  offer: Offer
): { base: number; discount: number; label: string; total: number; earns: number } {
  if (redeem) {
    return {
      base,
      discount: base,
      label: `Points (${POINTS.forFreeHour} pts)`,
      total: 0,
      earns: 0,
    };
  }
  const live = offerIsLive(offer);
  const pct = live ? offer.percent : 0;
  const discount = Math.round((base * pct) / 100);
  return {
    base,
    discount,
    label: pct ? `Offer: ${pct}% off` : "No offer",
    total: base - discount,
    earns: POINTS.perHour,
  };
}
