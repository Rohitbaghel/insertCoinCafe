"use client";

import {
  ArrowLeftRight,
  Eye,
  EyeOff,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

interface StatsBarProps {
  resourceCounts: Record<string, number>;
  revenue: number;
  showRevenue: boolean;
  onToggleRevenue: () => void;
  onSnacksSale: () => void;
  onTransferStations: () => void;
  onResetAll: () => void;
}

export function StatsBar({
  resourceCounts,
  revenue,
  showRevenue,
  onToggleRevenue,
  onSnacksSale,
  onTransferStations,
  onResetAll,
}: StatsBarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6 dark:bg-card">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground">
        {Object.entries(resourceCounts).map(([name, count]) => (
          <span key={name}>
            <span className="font-medium">{name}:</span> {count}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:gap-3">
        <button
          type="button"
          onClick={onToggleRevenue}
          className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide text-foreground"
          aria-label={showRevenue ? "Hide revenue" : "Show revenue"}
        >
          REVENUE{" "}
          {showRevenue ? (
            <span className="tabular-nums text-emerald-600 dark:text-emerald-400">
              {formatCurrency(revenue)}
            </span>
          ) : (
            <span className="tabular-nums">₹****</span>
          )}
          {showRevenue ? (
            <Eye className="size-4 text-muted-foreground" />
          ) : (
            <EyeOff className="size-4 text-muted-foreground" />
          )}
        </button>

        <Button
          variant="outline"
          size="sm"
          onClick={onSnacksSale}
          className="border-emerald-400 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-950"
        >
          <ShoppingCart className="size-3.5" />
          Snacks Sale
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onTransferStations}
          className="border-blue-400 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950"
        >
          <ArrowLeftRight className="size-3.5" />
          Transfer Stations
        </Button>

        <Button variant="outline" size="sm" onClick={onResetAll}>
          <RefreshCw className="size-3.5" />
          Reset All
        </Button>
      </div>
    </div>
  );
}
