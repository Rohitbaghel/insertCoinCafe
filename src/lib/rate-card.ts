export type BillingMode = "fixed_interval" | "custom_time_slot";

export interface GameTypeOption {
  id: string;
  label: string;
}

export interface PricingLevel {
  id: string;
  name: string;
  startHour: number;
  endHour: number;
  pricePerInterval: number;
}

export interface RateConfig {
  gameTypeId: string;
  name: string;
  billingMode: BillingMode;
  intervalMinutes: number;
  /** Price charged for one billing interval (₹) */
  pricePerInterval: number;
  pricingLevels: PricingLevel[];
  showAdvancedPricing: boolean;
}

export const AVAILABLE_GAME_TYPES: GameTypeOption[] = [
  { id: "arcade", label: "Arcade Machine" },
  { id: "badminton", label: "Badminton Court" },
  { id: "billiards", label: "Billiards / Pool" },
  { id: "carrom", label: "Carrom Board" },
  { id: "foosball", label: "Foosball" },
  { id: "pc", label: "Gaming PC" },
  { id: "ps3", label: "PS3" },
  { id: "ps4", label: "PlayStation (PS4)" },
  { id: "ps5", label: "PlayStation (PS5)" },
  { id: "switch", label: "Nintendo Switch" },
  { id: "vr", label: "VR Gaming" },
  { id: "xbox", label: "Xbox Series" },
  { id: "table-tennis", label: "Table Tennis" },
  { id: "simulator", label: "Racing Simulator" },
];

export const DEFAULT_SELECTED_GAME_TYPE_IDS = ["ps3", "ps4"];

export function createDefaultRateConfig(gameTypeId: string): RateConfig {
  const option = AVAILABLE_GAME_TYPES.find((g) => g.id === gameTypeId);
  const label = option?.label ?? gameTypeId;

  if (gameTypeId === "ps3") {
    return {
      gameTypeId,
      name: "PS3",
      billingMode: "fixed_interval",
      intervalMinutes: 30,
      pricePerInterval: 30,
      pricingLevels: [],
      showAdvancedPricing: false,
    };
  }

  if (gameTypeId === "ps4") {
    return {
      gameTypeId,
      name: "PlayStation (PS4)",
      billingMode: "fixed_interval",
      intervalMinutes: 30,
      pricePerInterval: 40,
      pricingLevels: [],
      showAdvancedPricing: false,
    };
  }

  return {
    gameTypeId,
    name: label,
    billingMode: "fixed_interval",
    intervalMinutes: 30,
    pricePerInterval: 50,
    pricingLevels: [],
    showAdvancedPricing: false,
  };
}

export function buildDefaultRateConfigs(
  selectedIds: string[] = DEFAULT_SELECTED_GAME_TYPE_IDS
): Record<string, RateConfig> {
  return Object.fromEntries(
    selectedIds.map((id) => [id, createDefaultRateConfig(id)])
  );
}

/** Map station resource keys to rate-card game type ids */
export function resourceToGameTypeId(resource: string): string {
  if (resource === "PS3" || resource === "ps3") return "ps3";
  if (resource === "PS4" || resource === "ps4") return "ps4";
  return resource.toLowerCase();
}

export function displayResourceLabel(
  resource: string,
  rates: Record<string, RateConfig>
): string {
  const id = resourceToGameTypeId(resource);
  return rates[id]?.name ?? (resource === "PS4" ? "PlayStation (PS4)" : resource);
}
