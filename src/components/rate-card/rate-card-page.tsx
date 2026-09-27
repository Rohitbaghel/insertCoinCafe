"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Info,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCafe } from "@/components/cafe-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { isGameTypeLocked } from "@/lib/cafe";
import { createDefaultRateConfig, type BillingMode } from "@/lib/rate-card";
import { cn } from "@/lib/utils";

export function RateCardPage() {
  const {
    stations,
    availableGameTypes,
    draftSelectedIds,
    draftConfigs,
    setDraftSelectedIds,
    setDraftConfigs,
    saveRateCard,
    cancelRateCard,
    addCustomGameType,
    showToast,
  } = useCafe();

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return availableGameTypes;
    return availableGameTypes.filter((g) => g.label.toLowerCase().includes(q));
  }, [availableGameTypes, search]);

  const toggleGameType = (id: string, checked: boolean) => {
    if (isGameTypeLocked(id, stations)) {
      showToast("Cannot change selection while stations of this type are running");
      return;
    }
    setDraftSelectedIds((prev) => {
      if (checked) {
        if (prev.includes(id)) return prev;
        setDraftConfigs((configs) => ({
          ...configs,
          [id]: configs[id] ?? createDefaultRateConfig(id),
        }));
        return [...prev, id];
      }
      return prev.filter((x) => x !== id);
    });
  };

  const updateConfig = (
    id: string,
    patch: Partial<(typeof draftConfigs)[string]>
  ) => {
    if (isGameTypeLocked(id, stations)) return;
    setDraftConfigs((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? createDefaultRateConfig(id)), ...patch },
    }));
  };

  const handleCreate = () => {
    addCustomGameType(newTypeName);
    setNewTypeName("");
    setCreateOpen(false);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-4 py-6 pb-36 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Rate Card</h1>
            <p className="text-sm text-muted-foreground">
              Manage game types and billing rates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold tracking-wide text-red-700 uppercase dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              Points Mode (Area)
            </span>
            <Link
              href="/"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Close rate card"
            >
              <X className="size-4" />
            </Link>
          </div>
        </div>

        <section className="rounded-xl border border-border bg-white p-4 shadow-sm dark:bg-card sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Available Game Types</h2>
              <span className="rounded-full bg-[#4f46e5] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                {draftSelectedIds.length} Selected
              </span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find game types..."
                className="pl-8"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((game) => {
              const checked = draftSelectedIds.includes(game.id);
              const locked = isGameTypeLocked(game.id, stations);
              return (
                <label
                  key={game.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                    checked
                      ? "border-indigo-300 bg-indigo-50/60 dark:border-indigo-800 dark:bg-indigo-950/30"
                      : "border-border hover:bg-muted/50",
                    locked && "opacity-70"
                  )}
                >
                  <Checkbox
                    checked={checked}
                    disabled={locked && !checked}
                    onCheckedChange={(value) =>
                      toggleGameType(game.id, Boolean(value))
                    }
                  />
                  <span className="truncate">{game.label}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">
              Can&apos;t see your Game type here?
            </span>
            {!createOpen ? (
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-1 font-semibold text-[#4f46e5] hover:underline"
              >
                <Plus className="size-3.5" />
                Create New Game Type
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="e.g. Nintendo Switch Lite"
                  className="w-56"
                />
                <Button size="sm" onClick={handleCreate}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setCreateOpen(false);
                    setNewTypeName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold">
            Added Game Types{" "}
            <span className="text-muted-foreground font-normal">
              ({draftSelectedIds.length})
            </span>
          </h2>

          {draftSelectedIds.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-white px-4 py-10 text-center text-sm text-muted-foreground dark:bg-card">
              Select game types above to configure billing rates.
            </p>
          ) : (
            draftSelectedIds.map((id) => {
              const config = draftConfigs[id] ?? createDefaultRateConfig(id);
              const locked = isGameTypeLocked(id, stations);
              return (
                <article
                  key={id}
                  className={cn(
                    "rounded-xl border bg-white p-4 shadow-sm dark:bg-card sm:p-5",
                    locked ? "border-amber-300" : "border-border"
                  )}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{config.name}</h3>
                    <div className="inline-flex rounded-lg border border-border p-0.5 text-xs font-medium">
                      {(
                        [
                          ["fixed_interval", "Fixed Interval"],
                          ["custom_time_slot", "Custom Time Slot"],
                        ] as const
                      ).map(([mode, label]) => (
                        <button
                          key={mode}
                          type="button"
                          disabled={locked}
                          onClick={() =>
                            updateConfig(id, { billingMode: mode as BillingMode })
                          }
                          className={cn(
                            "rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-50",
                            config.billingMode === mode
                              ? "bg-[#4f46e5] text-white"
                              : "text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {locked && (
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
                      <span className="inline-flex items-center gap-2 font-medium">
                        <AlertTriangle className="size-4 shrink-0" />
                        Cannot modify when stations are in running state
                      </span>
                      <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                        Locked
                      </span>
                    </div>
                  )}

                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 dark:border-sky-900 dark:bg-sky-950/30">
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-sky-900 dark:text-sky-100">
                      <Sparkles className="size-4 text-sky-600" />
                      Pricing setup with AI assistance
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={locked}
                      className="border-sky-300 bg-white text-sky-800 hover:bg-sky-100 dark:border-sky-700 dark:bg-transparent dark:text-sky-200"
                      onClick={() =>
                        showToast("AI pricing assistant — coming soon")
                      }
                    >
                      Tell me your prices
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Game Type Name
                      </label>
                      <Input
                        value={config.name}
                        disabled={locked}
                        onChange={(e) =>
                          updateConfig(id, { name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Billing Interval (MINS)
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={config.intervalMinutes}
                        disabled={locked}
                        onChange={(e) =>
                          updateConfig(id, {
                            intervalMinutes: Math.max(
                              1,
                              Number(e.target.value) || 1
                            ),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Price / Interval (₹)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        step="1"
                        value={config.pricePerInterval}
                        disabled={locked}
                        onChange={(e) =>
                          updateConfig(id, {
                            pricePerInterval: Math.max(
                              0,
                              Number(e.target.value) || 0
                            ),
                          })
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={locked}
                    onClick={() =>
                      updateConfig(id, {
                        showAdvancedPricing: !config.showAdvancedPricing,
                      })
                    }
                    className="mt-4 text-xs font-semibold tracking-wide text-[#4f46e5] uppercase hover:underline disabled:opacity-50"
                  >
                    Different pricing level settings (Morning/Evening/Night)
                  </button>

                  {config.showAdvancedPricing && (
                    <p className="mt-2 rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                      Advanced time-of-day pricing levels can be layered here in
                      a later slice. Base interval price above is used for
                      session billing today.
                    </p>
                  )}
                </article>
              );
            })
          )}
        </section>
      </div>

      <footer className="fixed right-0 bottom-0 left-0 z-30 border-t border-border bg-white/95 backdrop-blur dark:bg-card/95 lg:left-[240px]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0 text-[#4f46e5]" />
            <div>
              <p className="font-semibold text-foreground">Quick Tips</p>
              <ul className="mt-0.5 list-disc space-y-0.5 pl-4">
                <li>Use the CHECKBOX grid above to select game types</li>
                <li>Configure interval minutes and price per interval</li>
                <li>Don&apos;t forget to save changes!</li>
              </ul>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" onClick={cancelRateCard}>
              Cancel
            </Button>
            <Button
              className="bg-[#4f46e5] text-white hover:bg-[#4338ca]"
              onClick={saveRateCard}
            >
              <Check className="size-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
