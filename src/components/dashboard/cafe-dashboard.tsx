"use client";

import { useCallback, useMemo, useState } from "react";
import { BillingPanel } from "@/components/dashboard/billing-panel";
import { StationCard } from "@/components/dashboard/station-card";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { useCafe } from "@/components/cafe-provider";
import {
  getElapsedSeconds,
  getRunningCost,
  resourceCounts,
  type CompletedSession,
  type Station,
} from "@/lib/cafe";
import { displayResourceLabel } from "@/lib/rate-card";

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
  const {
    stations,
    setStations,
    sessions,
    setSessions,
    revenue,
    setRevenue,
    rateConfigs,
    showToast,
  } = useCafe();

  const [showRevenue, setShowRevenue] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [isPercentDiscount, setIsPercentDiscount] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");

  const counts = useMemo(
    () => resourceCounts(stations, rateConfigs),
    [stations, rateConfigs]
  );

  const updateStation = useCallback(
    (id: string, updater: (s: Station) => Station) => {
      setStations((prev) => prev.map((s) => (s.id === id ? updater(s) : s)));
    },
    [setStations]
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
        const key = s.resource === "PS3" ? "ps3" : "ps4";
        const interval = (rateConfigs[key]?.intervalMinutes ?? 30) * 60;
        return {
          ...s,
          status: "running",
          startedAt: now,
          sessionStartedAt: now,
          accumulatedMs: 0,
          timerEnabled: true,
          paidSeconds: interval,
        };
      });
    },
    [rateConfigs, updateStation]
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
        const cost = getRunningCost(station, now, rateConfigs);

        const completed: CompletedSession = {
          id: `session-${id}-${now}`,
          stationId: station.id,
          seatLabel: station.seatLabel,
          resource: station.resource,
          resourceLabel: displayResourceLabel(station.resource, rateConfigs),
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
    [rateConfigs, setRevenue, setSessions, setStations, showToast]
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
  }, [setStations, showToast]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
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
                resourceLabel={displayResourceLabel(
                  station.resource,
                  rateConfigs
                )}
                onStart={handleStart}
                onPause={handlePause}
                onDone={handleDone}
                onReset={handleReset}
                onToggleTimer={handleToggleTimer}
                onNoteChange={(sid, note) =>
                  updateStation(sid, (s) => ({ ...s, note }))
                }
                onPlayerCountChange={(sid, count) =>
                  updateStation(sid, (s) => ({ ...s, playerCount: count }))
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
    </div>
  );
}
