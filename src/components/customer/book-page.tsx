"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteNav } from "@/components/customer/site-nav";
import { useCustomer } from "@/components/customer/customer-provider";
import { useCustomerZones } from "@/components/customer/use-customer-zones";
import {
  CLOSE_HOUR,
  CUSTOMER_PHOTOS,
  OPEN_HOUR,
  POINTS,
  next7Dates,
  priceFor,
  rupees,
  slotLabel,
  type ZoneId,
} from "@/lib/customer";
import { cn } from "@/lib/utils";

export function CustomerBookPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { user, offer, draft, setDraft, confirmBooking } = useCustomer();
  const zones = useCustomerZones();
  const dates = useMemo(() => next7Dates(), []);

  useEffect(() => {
    if (!user) {
      router.replace("/play/login?next=/play/book");
    }
  }, [user, router]);

  useEffect(() => {
    const z = search.get("zone") as ZoneId | null;
    if (z && zones.some((x) => x.id === z)) {
      setDraft((d) => ({ ...d, zone: z }));
    }
  }, [search, setDraft, zones]);

  const selected = zones.find((z) => z.id === draft.zone);
  const pricing = selected
    ? priceFor(selected.price, draft.redeem, offer)
    : null;
  const canRedeem = (user?.points ?? 0) >= POINTS.forFreeHour;
  const now = new Date();
  const ready = !!selected && draft.hour !== null;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--c-muted)]">
        Redirecting to login…
      </div>
    );
  }

  return (
    <>
      <section className="relative min-h-[260px] overflow-hidden bg-[linear-gradient(180deg,#8152FF,#3A0E72)]">
        <span
          className="c-ghost"
          style={{ right: 40, top: 40, fontSize: 220 }}
          aria-hidden
        >
          SLOT
        </span>
        <SiteNav variant="book" />
        <div className="relative px-[var(--c-pad-x)] pt-6 pb-10">
          <span className="c-eyebrow" style={{ color: "#fff" }}>
            1-hour slots · pay at counter
          </span>
          <h1 className="c-display mt-2 text-[clamp(64px,8vw,110px)]">
            Book a slot
          </h1>
        </div>
      </section>

      <div className="flex flex-col gap-10 px-[var(--c-pad-x)] py-12 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-4 font-[family-name:var(--c-display)] text-[32px] font-semibold uppercase">
              <span className="text-[var(--c-purple-soft)]">01</span> Choose a
              zone
            </legend>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              {zones.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  className={cn(
                    "c-choice !p-0 overflow-hidden",
                    draft.zone === z.id && "ring-0"
                  )}
                  aria-pressed={draft.zone === z.id}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      zone: z.id,
                      players: Math.min(d.players, z.maxPlayers),
                    }))
                  }
                >
                  <span className="c-duo block h-[100px] w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={CUSTOMER_PHOTOS[z.img]} alt="" />
                  </span>
                  <span className="flex w-full flex-col gap-0.5 p-3 text-left">
                    <span className="font-[family-name:var(--c-display)] text-[22px] font-semibold uppercase leading-none">
                      {z.name}
                    </span>
                    <small className="text-[13px] text-[var(--c-muted)]">
                      {rupees(z.price)} / hr
                      {z.freeStations != null
                        ? ` · ${z.freeStations} free`
                        : ""}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-4 font-[family-name:var(--c-display)] text-[32px] font-semibold uppercase">
              <span className="text-[var(--c-purple-soft)]">02</span> Pick a
              date
            </legend>
            <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
              {dates.map((d, i) => (
                <button
                  key={d.toISOString()}
                  type="button"
                  className="c-choice"
                  aria-pressed={draft.dateIdx === i}
                  onClick={() =>
                    setDraft((prev) => ({ ...prev, dateIdx: i, hour: null }))
                  }
                >
                  <small className="text-[12px] font-semibold uppercase tracking-wide">
                    {i === 0
                      ? "Today"
                      : d.toLocaleDateString("en-IN", { weekday: "short" })}
                  </small>
                  <span className="font-[family-name:var(--c-display)] text-[40px] font-bold leading-none">
                    {d.getDate()}
                  </span>
                  <small>
                    {d.toLocaleDateString("en-IN", { month: "short" })}
                  </small>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-4 font-[family-name:var(--c-display)] text-[32px] font-semibold uppercase">
              <span className="text-[var(--c-purple-soft)]">03</span> Pick a
              1-hour slot
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {Array.from(
                { length: CLOSE_HOUR - OPEN_HOUR },
                (_, i) => OPEN_HOUR + i
              ).map((h) => {
                const past = draft.dateIdx === 0 && h <= now.getHours();
                return (
                  <button
                    key={h}
                    type="button"
                    className="c-choice text-[15px] font-semibold"
                    aria-pressed={draft.hour === h}
                    disabled={past}
                    onClick={() => setDraft((d) => ({ ...d, hour: h }))}
                  >
                    {slotLabel(h)}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-5">
            <span className="font-[family-name:var(--c-display)] text-[32px] font-semibold uppercase">
              <span className="text-[var(--c-purple-soft)]">04</span> Players
            </span>
            <div className="flex h-14 w-48 items-center justify-between border-2 border-[var(--c-line)] bg-[var(--c-deep-2)] px-1">
              <button
                type="button"
                className="size-12 text-[24px]"
                aria-label="Fewer players"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    players: Math.max(1, d.players - 1),
                  }))
                }
              >
                −
              </button>
              <output className="font-[family-name:var(--c-display)] text-[34px] font-semibold">
                {draft.players}
              </output>
              <button
                type="button"
                className="size-12 text-[24px]"
                aria-label="More players"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    players: Math.min(
                      selected?.maxPlayers ?? 8,
                      d.players + 1
                    ),
                  }))
                }
              >
                +
              </button>
            </div>
            <span className="c-muted text-[15px]">
              {selected
                ? `Max ${selected.maxPlayers} for this zone`
                : "Choose a zone first"}
            </span>
          </div>
        </div>

        <aside className="w-full shrink-0 bg-[var(--c-ink)] lg:sticky lg:top-6 lg:w-[360px]">
          <div className="c-duo h-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                CUSTOMER_PHOTOS[selected?.img ?? "hero"]
              }
              alt=""
            />
          </div>
          <div className="flex flex-col gap-3 p-6">
            <span className="c-display text-[40px] leading-none">
              Your booking
            </span>
            <Row label="Zone" value={selected?.name ?? "—"} />
            <Row
              label="Date"
              value={dates[draft.dateIdx].toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            />
            <Row
              label="Time"
              value={draft.hour === null ? "—" : slotLabel(draft.hour)}
            />
            <Row label="Players" value={String(draft.players)} />
            <Row
              label="Price"
              value={pricing ? rupees(pricing.base) : "—"}
            />
            <div className="flex justify-between gap-3 text-[17px] text-[var(--c-purple-text)]">
              <span>{pricing?.label ?? "Offer"}</span>
              <b>
                {pricing
                  ? pricing.discount
                    ? `−${rupees(pricing.discount)}`
                    : "₹0"
                  : "—"}
              </b>
            </div>
            <div className="flex items-center justify-between gap-3 bg-[#2E2E2E] px-3 py-3">
              <span className="flex flex-col gap-0.5">
                <b className="text-[16px]">Use {POINTS.forFreeHour} points</b>
                <span className="text-[13px] text-[#B8AFCB]">
                  Balance: {user.points} pts · this hour free
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={draft.redeem}
                disabled={!canRedeem}
                onClick={() =>
                  setDraft((d) => ({ ...d, redeem: !d.redeem }))
                }
                className={cn(
                  "flex h-7 w-12 shrink-0 rounded-full p-0.5 disabled:opacity-40",
                  draft.redeem
                    ? "justify-end bg-[var(--c-purple)]"
                    : "justify-start bg-[#555]"
                )}
              >
                <span className="size-6 rounded-full bg-white" />
              </button>
            </div>
            <div className="flex items-baseline justify-between border-t border-[#3D3D3D] pt-3">
              <span>Pay at counter</span>
              <b className="font-[family-name:var(--c-display)] text-[48px] leading-none">
                {pricing ? rupees(pricing.total) : "—"}
              </b>
            </div>
            <button
              type="button"
              className="c-btn c-btn--accent c-btn--block"
              disabled={!ready}
              onClick={() => {
                if (!selected || draft.hour === null) return;
                const booking = confirmBooking({
                  zoneId: selected.id,
                  date: dates[draft.dateIdx],
                  hour: draft.hour,
                  players: draft.players,
                  redeem: draft.redeem && canRedeem,
                  basePrice: selected.price,
                });
                if (booking) router.push(`/play/booking/${booking.code}`);
              }}
            >
              Confirm Booking
            </button>
            <span className="text-[15px] font-bold text-[var(--c-purple-text)]">
              {pricing
                ? draft.redeem
                  ? "Free hour with points. No points earned on this booking."
                  : `You will earn +${pricing.earns} points when you pay.`
                : ""}
            </span>
            <span className="text-[14px] text-[#B8AFCB]">
              {!selected
                ? "Choose a zone to continue."
                : draft.hour === null
                  ? "Pick a time slot to continue."
                  : "No payment now. You pay at the cafe after your session."}
            </span>
            <Link className="text-[14px] text-[var(--c-muted)] underline" href="/">
              View live floor (operator)
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-[17px]">
      <span className="text-[#B8AFCB]">{label}</span>
      <b className="text-right">{value}</b>
    </div>
  );
}
