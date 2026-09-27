"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  getElapsedSeconds,
  getRunningCost,
  type Station,
} from "@/lib/cafe";
import {
  formatCurrency,
  formatStartTime,
  formatTimer,
} from "@/lib/format";
import { cn } from "@/lib/utils";

interface StationCardProps {
  station: Station;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onDone: (id: string) => void;
  onReset: (id: string) => void;
  onToggleTimer: (id: string, enabled: boolean) => void;
  onNoteChange: (id: string, note: string) => void;
  onPlayerCountChange: (id: string, count: number) => void;
}

export function StationCard({
  station,
  onStart,
  onPause,
  onDone,
  onReset,
  onToggleTimer,
  onNoteChange,
  onPlayerCountChange,
}: StationCardProps) {
  const [now, setNow] = useState(() => Date.now());
  const isActive = station.status === "running" || station.status === "paused";
  const isRunning = station.status === "running";

  useEffect(() => {
    if (!isRunning || !station.timerEnabled) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [isRunning, station.timerEnabled]);

  const elapsed = getElapsedSeconds(station, now);
  const cost = getRunningCost(station, now);
  const startLabel = formatStartTime(station.sessionStartedAt);
  const statusColor =
    station.status === "running" && station.timerEnabled
      ? "bg-emerald-500"
      : station.status === "paused" ||
          (station.status === "running" && !station.timerEnabled)
        ? "bg-amber-400"
        : "bg-zinc-300 dark:bg-zinc-600";

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border bg-white p-4 shadow-sm transition-colors dark:bg-card",
        isRunning && station.timerEnabled
          ? "border-emerald-400/80 ring-1 ring-emerald-200/60 dark:border-emerald-600 dark:ring-emerald-900/40"
          : "border-border"
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn("size-2.5 shrink-0 rounded-full", statusColor)}
            aria-hidden
          />
          <h3 className="truncate font-semibold text-foreground">
            {station.seatLabel} - {station.resource}
          </h3>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Stop timer</span>
          <Switch
            checked={station.timerEnabled}
            onCheckedChange={(checked) =>
              onToggleTimer(station.id, Boolean(checked))
            }
            aria-label="Stop timer toggle"
          />
        </label>
      </div>

      <p className="mb-2 text-xs text-muted-foreground">
        {startLabel ? `Start: ${startLabel}` : "\u00A0"}
      </p>

      <div className="mb-3 rounded-lg bg-muted/70 px-3 py-4 text-center dark:bg-muted/40">
        <span className="font-mono text-3xl font-bold tracking-wider tabular-nums text-foreground sm:text-4xl">
          {formatTimer(elapsed)}
        </span>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button
          size="sm"
          disabled={station.status === "running"}
          onClick={() => onStart(station.id)}
          className="bg-[#4f46e5] text-white hover:bg-[#4338ca] disabled:opacity-40"
        >
          Start
        </Button>
        <Button
          size="sm"
          disabled={station.status !== "running"}
          onClick={() => onPause(station.id)}
          className="bg-[#312e81] text-white hover:bg-[#1e1b4b] disabled:opacity-40"
        >
          Pause
        </Button>
        <Button
          size="sm"
          disabled={!isActive}
          onClick={() => onDone(station.id)}
          className="bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40"
        >
          Done
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={!isActive && elapsed === 0}
          onClick={() => onReset(station.id)}
        >
          Reset
        </Button>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2">
          <select
            className="h-8 rounded-md border border-border bg-background px-2 text-sm"
            value={station.playerCount}
            onChange={(e) =>
              onPlayerCountChange(station.id, Number(e.target.value))
            }
            aria-label="Player count"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}P
              </option>
            ))}
          </select>
          <span className="text-muted-foreground">
            Paid: {formatTimer(station.paidSeconds)}
          </span>
        </div>
        <span className="font-semibold tabular-nums">
          Cost: {formatCurrency(cost)}
        </span>
      </div>

      <Input
        value={station.note}
        onChange={(e) => onNoteChange(station.id, e.target.value)}
        disabled={!isActive}
        placeholder={
          isActive
            ? "Add note (e.g. customer name)..."
            : "Start timer to add a note"
        }
        className="mt-auto"
      />
    </article>
  );
}
