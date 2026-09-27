const IST = "Asia/Kolkata";

export function formatTimer(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function formatClockTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    timeZone: IST,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatClockDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    timeZone: IST,
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatStartTime(ms: number | null): string | null {
  if (ms == null) return null;
  return new Date(ms).toLocaleTimeString("en-IN", {
    timeZone: IST,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
