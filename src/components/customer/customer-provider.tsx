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
  DEFAULT_OFFER,
  DEFAULT_POINTS_LOG,
  KNOWN_USERS,
  POINTS,
  priceFor,
  type CustomerBooking,
  type CustomerUser,
  type Offer,
  type PointsLogEntry,
  type ZoneId,
} from "@/lib/customer";

interface BookingDraft {
  zone: ZoneId | null;
  dateIdx: number;
  hour: number | null;
  players: number;
  redeem: boolean;
}

interface CustomerContextValue {
  user: CustomerUser | null;
  offer: Offer;
  pointsLog: PointsLogEntry[];
  myBookings: CustomerBooking[];
  draft: BookingDraft;
  setDraft: React.Dispatch<React.SetStateAction<BookingDraft>>;
  sendOtp: (phone: string) => { ok: boolean; error?: string };
  verifyOtp: (code: string) => { ok: boolean; needName?: boolean; error?: string };
  completeSignup: (name: string) => void;
  logout: () => void;
  resetLogin: () => void;
  pendingPhone: string | null;
  needsName: boolean;
  confirmBooking: (input: {
    zoneId: ZoneId;
    date: Date;
    hour: number;
    players: number;
    redeem: boolean;
    basePrice: number;
  }) => CustomerBooking | null;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

const emptyDraft = (): BookingDraft => ({
  zone: null,
  dateIdx: 0,
  hour: null,
  players: 1,
  redeem: false,
});

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [needsName, setNeedsName] = useState(false);
  const [pointsLog, setPointsLog] = useState(DEFAULT_POINTS_LOG);
  const [myBookings, setMyBookings] = useState<CustomerBooking[]>([]);
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const offer = DEFAULT_OFFER;

  const sendOtp = useCallback((phone: string) => {
    const digits = phone.replace(/\D/g, "").slice(0, 10);
    if (digits.length !== 10) {
      return { ok: false, error: "Enter a valid 10-digit mobile number." };
    }
    setPendingPhone(digits);
    setNeedsName(false);
    return { ok: true };
  }, []);

  const verifyOtp = useCallback(
    (code: string) => {
      if (!pendingPhone) return { ok: false, error: "Start with your phone number." };
      if (code.trim() !== "123456") {
        return { ok: false, error: "Incorrect code. Prototype OTP is 123456." };
      }
      const known = KNOWN_USERS[pendingPhone];
      if (known) {
        setUser({ ...known });
        setPendingPhone(null);
        setNeedsName(false);
        return { ok: true };
      }
      setNeedsName(true);
      return { ok: true, needName: true };
    },
    [pendingPhone]
  );

  const completeSignup = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed || !pendingPhone) return;
      setUser({ name: trimmed, phone: pendingPhone, points: 0 });
      setPendingPhone(null);
      setNeedsName(false);
    },
    [pendingPhone]
  );

  const logout = useCallback(() => {
    setUser(null);
    setDraft(emptyDraft());
  }, []);

  const resetLogin = useCallback(() => {
    setPendingPhone(null);
    setNeedsName(false);
  }, []);

  const confirmBooking = useCallback(
    (input: {
      zoneId: ZoneId;
      date: Date;
      hour: number;
      players: number;
      redeem: boolean;
      basePrice: number;
    }) => {
      if (!user) return null;
      const pricing = priceFor(input.basePrice, input.redeem, offer);
      if (input.redeem && user.points < POINTS.forFreeHour) return null;

      const code = `GC-${Math.floor(1000 + Math.random() * 9000)}`;
      if (input.redeem) {
        setUser((u) =>
          u ? { ...u, points: u.points - POINTS.forFreeHour } : u
        );
        setPointsLog((prev) => [
          ...prev,
          {
            date: new Date().toISOString().slice(0, 10),
            what: `Redeemed free hour · ${code}`,
            pts: -POINTS.forFreeHour,
          },
        ]);
      }

      const booking: CustomerBooking = {
        code,
        zone: input.zoneId,
        dateISO: input.date.toISOString(),
        hour: input.hour,
        players: input.players,
        amount: pricing.total,
        earns: pricing.earns,
        redeemed: input.redeem,
        name: user.name,
        phone: user.phone,
        status: "CONFIRMED",
      };
      setMyBookings((prev) => [booking, ...prev]);
      setDraft(emptyDraft());
      return booking;
    },
    [offer, user]
  );

  const value = useMemo(
    () => ({
      user,
      offer,
      pointsLog,
      myBookings,
      draft,
      setDraft,
      sendOtp,
      verifyOtp,
      completeSignup,
      logout,
      resetLogin,
      pendingPhone,
      needsName,
      confirmBooking,
    }),
    [
      user,
      offer,
      pointsLog,
      myBookings,
      draft,
      sendOtp,
      verifyOtp,
      completeSignup,
      logout,
      resetLogin,
      pendingPhone,
      needsName,
      confirmBooking,
    ]
  );

  return (
    <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used within CustomerProvider");
  return ctx;
}
