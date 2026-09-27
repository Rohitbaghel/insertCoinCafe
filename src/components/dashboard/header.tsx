"use client";

import { useSyncExternalStore } from "react";
import { Menu, Moon, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatClockDate, formatClockTime } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onMenuClick?: () => void;
  daysLeft?: number;
}

function subscribeClock(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 1000);
  return () => window.clearInterval(id);
}

function getClockSnapshot() {
  return Date.now();
}

function getServerClockSnapshot() {
  return 0;
}

export function DashboardHeader({
  darkMode,
  onToggleDarkMode,
  onMenuClick,
  daysLeft = 28,
}: DashboardHeaderProps) {
  const nowMs = useSyncExternalStore(
    subscribeClock,
    getClockSnapshot,
    getServerClockSnapshot
  );
  const now = nowMs ? new Date(nowMs) : null;

  return (
    <header className="border-b border-border bg-white dark:bg-card">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 lg:gap-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground lg:hidden"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
        </Button>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h1 className="truncate text-lg font-bold tracking-tight text-[#4f46e5] sm:text-xl dark:text-indigo-400">
            Welcome to InsertCoinCafe.in
          </h1>
          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            Monitor sessions, manage resources, and generate invoices.
          </p>
        </div>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="text-muted-foreground"
          >
            {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <Button
            variant="outline"
            className="gap-1.5 border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-950"
          >
            <Sparkles className="size-4" />
            Ask AI
          </Button>

          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-xs font-medium text-orange-800",
              "dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-200"
            )}
          >
            <span>{daysLeft} Days Left</span>
            <button
              type="button"
              className="font-semibold text-orange-600 underline-offset-2 hover:underline dark:text-orange-400"
            >
              Renew
            </button>
          </div>

          <div className="rounded-md border border-border bg-muted/60 px-3 py-1.5 text-center leading-tight dark:bg-muted/30">
            <div
              className="font-mono text-sm font-semibold tabular-nums"
              suppressHydrationWarning
            >
              {now ? formatClockTime(now) : "--:--:--"}
            </div>
            <div
              className="text-[10px] text-muted-foreground"
              suppressHydrationWarning
            >
              {now ? formatClockDate(now) : "—"}
            </div>
            <div className="text-[10px] text-muted-foreground">Asia/Kolkata</div>
          </div>
        </div>
      </div>
    </header>
  );
}
