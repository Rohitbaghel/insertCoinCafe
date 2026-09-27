import type { RateConfig } from "@/lib/rate-card";
import { resourceToGameTypeId } from "@/lib/rate-card";

export type StationStatus = "idle" | "running" | "paused";

/** Legacy short codes used on stations; rate card holds display names */
export type ResourceType = "PS3" | "PS4";

export interface Station {
  id: string;
  seatLabel: string;
  resource: ResourceType;
  status: StationStatus;
  accumulatedMs: number;
  startedAt: number | null;
  sessionStartedAt: number | null;
  playerCount: number;
  /** Prepaid / target duration in seconds */
  paidSeconds: number;
  note: string;
  timerEnabled: boolean;
}

export interface CompletedSession {
  id: string;
  stationId: string;
  seatLabel: string;
  resource: ResourceType;
  resourceLabel: string;
  durationSeconds: number;
  cost: number;
  note: string;
  completedAt: number;
  selected: boolean;
}

export function createDefaultStations(
  rates: Record<string, RateConfig>
): Station[] {
  const ps3Interval = (rates.ps3?.intervalMinutes ?? 30) * 60;
  const ps4Interval = (rates.ps4?.intervalMinutes ?? 30) * 60;

  return [
    {
      id: "seat-1",
      seatLabel: "Seat 1",
      resource: "PS3",
      status: "idle",
      accumulatedMs: 0,
      startedAt: null,
      sessionStartedAt: null,
      playerCount: 1,
      paidSeconds: ps3Interval,
      note: "",
      timerEnabled: true,
    },
    {
      id: "seat-2",
      seatLabel: "Seat 2",
      resource: "PS3",
      status: "idle",
      accumulatedMs: 0,
      startedAt: null,
      sessionStartedAt: null,
      playerCount: 1,
      paidSeconds: ps3Interval,
      note: "",
      timerEnabled: true,
    },
    {
      id: "seat-3",
      seatLabel: "Seat 3",
      resource: "PS4",
      status: "idle",
      accumulatedMs: 0,
      startedAt: null,
      sessionStartedAt: null,
      playerCount: 1,
      paidSeconds: ps4Interval,
      note: "",
      timerEnabled: true,
    },
  ];
}

export function getElapsedMs(station: Station, now: number): number {
  if (
    station.status === "running" &&
    station.startedAt != null &&
    station.timerEnabled
  ) {
    return station.accumulatedMs + (now - station.startedAt);
  }
  return station.accumulatedMs;
}

export function getElapsedSeconds(station: Station, now: number): number {
  return Math.floor(getElapsedMs(station, now) / 1000);
}

export function getRateForStation(
  station: Station,
  rates: Record<string, RateConfig>
): RateConfig | undefined {
  return rates[resourceToGameTypeId(station.resource)];
}

/**
 * Fixed Interval: charge whole intervals (ceil).
 * Custom Time Slot: proportional to interval price.
 * Bill at least the prepaid/target duration once a session has started.
 */
export function getRunningCost(
  station: Station,
  now: number,
  rates: Record<string, RateConfig>
): number {
  if (station.status === "idle" && station.accumulatedMs === 0) return 0;

  const rate = getRateForStation(station, rates);
  const intervalMinutes = rate?.intervalMinutes ?? 30;
  const price = rate?.pricePerInterval ?? 30;
  const intervalSeconds = Math.max(1, intervalMinutes * 60);
  const elapsed = getElapsedSeconds(station, now);
  const billableSeconds = Math.max(elapsed, station.paidSeconds);

  if (rate?.billingMode === "custom_time_slot") {
    return (billableSeconds / intervalSeconds) * price;
  }

  const intervals = Math.max(1, Math.ceil(billableSeconds / intervalSeconds));
  return intervals * price;
}

export function resourceCounts(
  stations: Station[],
  rates: Record<string, RateConfig>
): Record<string, number> {
  return stations.reduce<Record<string, number>>((acc, s) => {
    const id = resourceToGameTypeId(s.resource);
    const key = rates[id]?.name ?? (s.resource === "PS4" ? "PlayStation (PS4)" : s.resource);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export function isGameTypeLocked(
  gameTypeId: string,
  stations: Station[]
): boolean {
  return stations.some(
    (s) =>
      resourceToGameTypeId(s.resource) === gameTypeId &&
      (s.status === "running" || s.status === "paused")
  );
}
