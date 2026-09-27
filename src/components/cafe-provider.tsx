"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createDefaultStations,
  type CompletedSession,
  type Station,
} from "@/lib/cafe";
import {
  AVAILABLE_GAME_TYPES,
  DEFAULT_SELECTED_GAME_TYPE_IDS,
  buildDefaultRateConfigs,
  createDefaultRateConfig,
  type RateConfig,
} from "@/lib/rate-card";

interface CafeContextValue {
  stations: Station[];
  setStations: React.Dispatch<React.SetStateAction<Station[]>>;
  sessions: CompletedSession[];
  setSessions: React.Dispatch<React.SetStateAction<CompletedSession[]>>;
  revenue: number;
  setRevenue: React.Dispatch<React.SetStateAction<number>>;
  rateConfigs: Record<string, RateConfig>;
  selectedGameTypeIds: string[];
  draftSelectedIds: string[];
  draftConfigs: Record<string, RateConfig>;
  setDraftSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  setDraftConfigs: React.Dispatch<React.SetStateAction<Record<string, RateConfig>>>;
  initRateCardDraft: () => void;
  saveRateCard: () => void;
  cancelRateCard: () => void;
  addCustomGameType: (label: string) => void;
  toast: string | null;
  showToast: (message: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  availableGameTypes: typeof AVAILABLE_GAME_TYPES;
}

const CafeContext = createContext<CafeContextValue | null>(null);

export function CafeProvider({ children }: { children: ReactNode }) {
  const initialRates = useMemo(() => buildDefaultRateConfigs(), []);
  const [stations, setStations] = useState<Station[]>(() =>
    createDefaultStations(initialRates)
  );
  const [sessions, setSessions] = useState<CompletedSession[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [rateConfigs, setRateConfigs] =
    useState<Record<string, RateConfig>>(initialRates);
  const [selectedGameTypeIds, setSelectedGameTypeIds] = useState<string[]>(
    DEFAULT_SELECTED_GAME_TYPE_IDS
  );
  const [draftSelectedIds, setDraftSelectedIds] = useState<string[]>(
    DEFAULT_SELECTED_GAME_TYPE_IDS
  );
  const [draftConfigs, setDraftConfigs] =
    useState<Record<string, RateConfig>>(initialRates);
  const [customGameTypes, setCustomGameTypes] = useState<
    { id: string; label: string }[]
  >([]);
  const [toast, setToast] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const availableGameTypes = useMemo(
    () => [...AVAILABLE_GAME_TYPES, ...customGameTypes],
    [customGameTypes]
  );

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

  const initRateCardDraft = useCallback(() => {
    setDraftSelectedIds(selectedGameTypeIds);
    setDraftConfigs(
      Object.fromEntries(
        selectedGameTypeIds.map((id) => [
          id,
          rateConfigs[id] ?? createDefaultRateConfig(id),
        ])
      )
    );
  }, [rateConfigs, selectedGameTypeIds]);

  const saveRateCard = useCallback(() => {
    const nextConfigs = Object.fromEntries(
      draftSelectedIds.map((id) => [
        id,
        draftConfigs[id] ?? createDefaultRateConfig(id),
      ])
    );
    setSelectedGameTypeIds(draftSelectedIds);
    setRateConfigs(nextConfigs);

    // Sync idle stations' paid target to the configured interval
    setStations((prev) =>
      prev.map((s) => {
        if (s.status !== "idle") return s;
        const key = s.resource === "PS3" ? "ps3" : "ps4";
        const cfg = nextConfigs[key];
        if (!cfg) return s;
        return { ...s, paidSeconds: cfg.intervalMinutes * 60 };
      })
    );

    showToast("Rate card saved");
  }, [draftConfigs, draftSelectedIds, showToast]);

  const cancelRateCard = useCallback(() => {
    setDraftSelectedIds(selectedGameTypeIds);
    setDraftConfigs(
      Object.fromEntries(
        selectedGameTypeIds.map((id) => [
          id,
          rateConfigs[id] ?? createDefaultRateConfig(id),
        ])
      )
    );
    showToast("Changes discarded");
  }, [rateConfigs, selectedGameTypeIds, showToast]);

  const addCustomGameType = useCallback(
    (label: string) => {
      const trimmed = label.trim();
      if (!trimmed) return;
      const id = `custom-${trimmed.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
      setCustomGameTypes((prev) => [...prev, { id, label: trimmed }]);
      setDraftSelectedIds((prev) => [...prev, id]);
      setDraftConfigs((prev) => ({
        ...prev,
        [id]: createDefaultRateConfig(id),
      }));
      // Override name with custom label
      setDraftConfigs((prev) => ({
        ...prev,
        [id]: { ...prev[id], name: trimmed, gameTypeId: id },
      }));
      showToast(`Created game type “${trimmed}”`);
    },
    [showToast]
  );

  const value = useMemo(
    () => ({
      stations,
      setStations,
      sessions,
      setSessions,
      revenue,
      setRevenue,
      rateConfigs,
      selectedGameTypeIds,
      draftSelectedIds,
      draftConfigs,
      setDraftSelectedIds,
      setDraftConfigs,
      initRateCardDraft,
      saveRateCard,
      cancelRateCard,
      addCustomGameType,
      toast,
      showToast,
      darkMode,
      toggleDarkMode,
      availableGameTypes,
    }),
    [
      stations,
      sessions,
      revenue,
      rateConfigs,
      selectedGameTypeIds,
      draftSelectedIds,
      draftConfigs,
      initRateCardDraft,
      saveRateCard,
      cancelRateCard,
      addCustomGameType,
      toast,
      showToast,
      darkMode,
      toggleDarkMode,
      availableGameTypes,
    ]
  );

  return <CafeContext.Provider value={value}>{children}</CafeContext.Provider>;
}

export function useCafe() {
  const ctx = useContext(CafeContext);
  if (!ctx) throw new Error("useCafe must be used within CafeProvider");
  return ctx;
}
