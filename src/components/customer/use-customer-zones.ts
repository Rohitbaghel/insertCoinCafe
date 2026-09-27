"use client";

import { useMemo } from "react";
import { useCafe } from "@/components/cafe-provider";
import {
  DEFAULT_ZONES,
  hourlyFromRate,
  type Zone,
} from "@/lib/customer";

export function useCustomerZones(): (Zone & {
  price: number;
  freeStations: number | null;
})[] {
  const { rateConfigs, stations } = useCafe();

  return useMemo(() => {
    return DEFAULT_ZONES.filter((z) => z.active).map((z) => {
      let price = z.defaultPrice;
      if (z.rateTypeId && rateConfigs[z.rateTypeId]) {
        const cfg = rateConfigs[z.rateTypeId];
        price = hourlyFromRate(cfg.pricePerInterval, cfg.intervalMinutes);
      }
      let freeStations: number | null = null;
      if (z.resourceCode) {
        const matching = stations.filter((s) => s.resource === z.resourceCode);
        freeStations = matching.filter((s) => s.status === "idle").length;
      }
      return { ...z, price, freeStations };
    });
  }, [rateConfigs, stations]);
}
