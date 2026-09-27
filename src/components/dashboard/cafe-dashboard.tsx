"use client";

import { useCallback, useMemo, useState } from "react";
import { BillingPanel } from "@/components/dashboard/billing-panel";
import { DashboardHeader } from "@/components/dashboard/header";
import { StationCard } from "@/components/dashboard/station-card";
import { StatsBar } from "@/components/dashboard/stats-bar";
import {
  DEFAULT_STATIONS,
  getElapsedSeconds,
  getRunningCost,
  resourceCounts,
  type CompletedSession,
  type Station,
} from "@/lib/cafe";

function idleStation(station: Station): Station {
  return {
    ...station,
    status: "idle",
    accumulatedMs: 0,
    startedAt: null,
    sessionStartedAt: null,
    note: "",
    timerEnabled: true,
  };
}

export function CafeDashboard() {
  const [stations, setStations] = useState<Station[]>(DEFAULT_STATIONS);
  const [sessions, setSessions] = useState<CompletedSession[]>([]);
  const [showRevenue, setShowRevenue] = useState(false);
  const [revenue, setRevenue] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [isPercentDiscount, setIsPercentDiscount] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const counts = useMemo(() => resourceCounts(stations), [stations]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  const updateStation = useCallback(
    (id: string, updater: (s: Station) => Station) => {
      setStations((prev) => prev.map((s) => (s.id === id ? updater(s) : s)));
    },
    []
  );

  const handleStart = useCallback(
    (id: string) => {
      const now = Date.now();
      updateStation(id, (s) => {
        if (s.status === "running") return s;
        if (s.status === "paused") {
          return {
            ...s,
            status: "running",
            startedAt: now,
            timerEnabled: true,
          };
        }
        return {
          ...s,
          status: "running",
          startedAt: now,
          sessionStartedAt: now,
          accumulatedMs: 0,
          timerEnabled: true,
        };
      });
    },
    [updateStation]
  );

  const handlePause = useCallback(
    (id: string) => {
      const now = Date.now();
      updateStation(id, (s) => {
        if (s.status !== "running") return s;
        const accumulated =
          s.startedAt != null && s.timerEnabled
            ? s.accumulatedMs + (now - s.startedAt)
            : s.accumulatedMs;
        return {
          ...s,
          status: "paused",
          accumulatedMs: accumulated,
          startedAt: null,
        };
      });
    },
    [updateStation]
  );

  const handleDone = useCallback(
    (id: string) => {
      const now = Date.now();
      setStations((prev) => {
        const station = prev.find((s) => s.id === id);
        if (!station || station.status === "idle") return prev;

        const durationSeconds = getElapsedSeconds(station, now);
        const cost = getRunningCost(station, now);

        const completed: CompletedSession = {
          id: `session-${id}-${now}`,
          stationId: station.id,
          seatLabel: station.seatLabel,
          resource: station.resource,
          durationSeconds,
          cost,
          note: station.note,
          completedAt: now,
          selected: true,
        };

        setSessions((sessionsPrev) => [completed, ...sessionsPrev]);
        setRevenue((r) => r + cost);
        showToast(
          `${station.seatLabel} session completed · ₹${cost.toFixed(2)}`
        );

        return prev.map((s) => (s.id === id ? idleStation(s) : s));
      });
    },
    [showToast]
  );

  const handleReset = useCallback(
    (id: string) => {
      updateStation(id, idleStation);
    },
    [updateStation]
  );

  const handleToggleTimer = useCallback(
    (id: string, enabled: boolean) => {
      const now = Date.now();
      updateStation(id, (s) => {
        if (s.status === "running" && s.startedAt != null) {
          if (!enabled && s.timerEnabled) {
            // Freeze: bank elapsed so far
            return {
              ...s,
              timerEnabled: false,
              accumulatedMs: s.accumulatedMs + (now - s.startedAt),
              startedAt: null,
            };
          }
          if (enabled && !s.timerEnabled) {
            return {
              ...s,
              timerEnabled: true,
              startedAt: now,
            };
          }
        }
        return { ...s, timerEnabled: enabled };
      });
    },
    [updateStation]
  );

  const handleResetAll = useCallback(() => {
    setStations((prev) => prev.map(idleStation));
    showToast("All stations reset");
  }, [showToast]);

  return (
    <div className="flex min-h-full flex-col bg-[#f3f4f6] dark:bg-background">
      <DashboardHeader darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      <StatsBar
        resourceCounts={counts}
        revenue={revenue}
        showRevenue={showRevenue}
        onToggleRevenue={() => setShowRevenue((v) => !v)}
        onSnacksSale={() => showToast("Snacks sale — coming soon")}
        onTransferStations={() => showToast("Transfer stations — coming soon")}
        onResetAll={handleResetAll}
      />

      <div className="flex flex-1 flex-col lg:flex-row">
        <main className="flex-1 p-4 lg:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                onStart={handleStart}
                onPause={handlePause}
                onDone={handleDone}
                onReset={handleReset}
                onToggleTimer={handleToggleTimer}
                onNoteChange={(id, note) =>
                  updateStation(id, (s) => ({ ...s, note }))
                }
                onPlayerCountChange={(id, count) =>
                  updateStation(id, (s) => ({ ...s, playerCount: count }))
                }
              />
            ))}
          </div>
        </main>

        <div className="w-full shrink-0 lg:w-[340px] xl:w-[380px]">
          <div className="lg:sticky lg:top-0 lg:h-[calc(100vh-8.5rem)]">
            <BillingPanel
              sessions={sessions}
              discountValue={discountValue}
              isPercentDiscount={isPercentDiscount}
              customerPhone={customerPhone}
              customerName={customerName}
              onToggleSession={(id) =>
                setSessions((prev) =>
                  prev.map((s) =>
                    s.id === id ? { ...s, selected: !s.selected } : s
                  )
                )
              }
              onRemoveSession={(id) =>
                setSessions((prev) => prev.filter((s) => s.id !== id))
              }
              onDiscountValueChange={setDiscountValue}
              onPercentToggle={setIsPercentDiscount}
              onCustomerPhoneChange={setCustomerPhone}
              onCustomerNameChange={setCustomerName}
            />
          </div>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed right-4 bottom-4 z-50 rounded-lg border border-border bg-white px-4 py-2.5 text-sm shadow-lg dark:bg-card"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
