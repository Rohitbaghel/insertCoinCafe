export type StationStatus = "idle" | "running" | "paused";

export type ResourceType = "PS3" | "PS4";

export interface Station {
  id: string;
  seatLabel: string;
  resource: ResourceType;
  status: StationStatus;
  /** Accumulated ms while not currently ticking */
  accumulatedMs: number;
  /** Wall-clock ms when current run segment started */
  startedAt: number | null;
  /** First start of this session (for display) */
  sessionStartedAt: number | null;
  playerCount: number;
  /** Prepaid / target duration in seconds */
  paidSeconds: number;
  note: string;
  /** When false, Pause/Done still work but timer does not advance */
  timerEnabled: boolean;
  hourlyRate: number;
}

export interface CompletedSession {
  id: string;
  stationId: string;
  seatLabel: string;
  resource: ResourceType;
  durationSeconds: number;
  cost: number;
  note: string;
  completedAt: number;
  selected: boolean;
}

export const DEFAULT_STATIONS: Station[] = [
  {
    id: "seat-1",
    seatLabel: "Seat 1",
    resource: "PS3",
    status: "idle",
    accumulatedMs: 0,
    startedAt: null,
    sessionStartedAt: null,
    playerCount: 1,
    paidSeconds: 3600,
    note: "",
    timerEnabled: true,
    hourlyRate: 50,
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
    paidSeconds: 3600,
    note: "",
    timerEnabled: true,
    hourlyRate: 50,
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
    paidSeconds: 3600,
    note: "",
    timerEnabled: true,
    hourlyRate: 80,
  },
];

export function getElapsedMs(station: Station, now: number): number {
  if (station.status === "running" && station.startedAt != null && station.timerEnabled) {
    return station.accumulatedMs + (now - station.startedAt);
  }
  return station.accumulatedMs;
}

export function getElapsedSeconds(station: Station, now: number): number {
  return Math.floor(getElapsedMs(station, now) / 1000);
}

/** Bill at least the prepaid block; overtime charges proportionally. */
export function getRunningCost(station: Station, now: number): number {
  if (station.status === "idle" && station.accumulatedMs === 0) return 0;
  const elapsed = getElapsedSeconds(station, now);
  const billableSeconds = Math.max(elapsed, station.paidSeconds);
  return (billableSeconds / 3600) * station.hourlyRate;
}

export function resourceCounts(stations: Station[]): Record<string, number> {
  return stations.reduce<Record<string, number>>((acc, s) => {
    const key =
      s.resource === "PS4" ? "PlayStation (PS4)" : s.resource;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}
