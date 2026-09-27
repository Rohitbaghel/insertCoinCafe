"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteNav } from "@/components/customer/site-nav";
import { useCustomer } from "@/components/customer/customer-provider";
import { useCustomerZones } from "@/components/customer/use-customer-zones";
import { POINTS, rupees, slotLabel } from "@/lib/customer";

export function CustomerConfirmedPage() {
  const params = useParams<{ code: string }>();
  const { myBookings } = useCustomer();
  const zones = useCustomerZones();
  const booking =
    myBookings.find((b) => b.code === params.code) ?? myBookings[0];

  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="c-muted">No booking found.</p>
        <Link className="c-btn c-btn--accent" href="/play/book">
          Book a Slot
        </Link>
      </div>
    );
  }

  const zone = zones.find((z) => z.id === booking.zone);
  const date = new Date(booking.dateISO);

  return (
    <>
      <section className="relative min-h-[180px] overflow-hidden bg-[linear-gradient(180deg,#8152FF,#3A0E72)]">
        <span
          className="c-ghost"
          style={{ right: 40, top: 20, fontSize: 200 }}
          aria-hidden
        >
          GG
        </span>
        <SiteNav variant="simple" />
      </section>
      <div className="flex flex-col items-center gap-6 px-[var(--c-pad-x)] py-16 text-center">
        <h1 className="c-display c-d-xl">Slot booked!</h1>
        <span className="c-tag text-[clamp(32px,4vw,56px)] tracking-[4px]">
          ID: {booking.code}
        </span>
        <p className="c-muted m-0 max-w-lg text-[20px]">
          Show this booking ID at the counter and pay there when you arrive.
        </p>
        <span className="text-[18px] font-bold text-[var(--c-purple-text)]">
          {booking.redeemed
            ? `Paid with ${POINTS.forFreeHour} points. Enjoy your free hour!`
            : `+${booking.earns} points will be added when you pay.`}
        </span>
        <div className="grid w-full max-w-3xl grid-cols-2 gap-4 border-2 border-[var(--c-line)] bg-[var(--c-deep-2)] px-6 py-5 text-left md:grid-cols-4">
          <div className="flex flex-col gap-1">
            <span className="text-[14px] text-[var(--c-muted-2)]">Zone</span>
            <b className="font-[family-name:var(--c-display)] text-[28px] font-semibold leading-none">
              {zone?.name ?? booking.zone}
            </b>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[14px] text-[var(--c-muted-2)]">Date</span>
            <b className="font-[family-name:var(--c-display)] text-[28px] font-semibold leading-none">
              {date.toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </b>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[14px] text-[var(--c-muted-2)]">Time</span>
            <b className="font-[family-name:var(--c-display)] text-[28px] font-semibold leading-none">
              {slotLabel(booking.hour)}
            </b>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[14px] text-[var(--c-muted-2)]">
              Pay at cafe
            </span>
            <b className="font-[family-name:var(--c-display)] text-[28px] font-semibold leading-none">
              {rupees(booking.amount)}
            </b>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <Link className="c-btn c-btn--accent" href="/play/book">
            Book Another
          </Link>
          <Link className="c-btn c-btn--outline" href="/play/rewards">
            My Points
          </Link>
        </div>
      </div>
    </>
  );
}
