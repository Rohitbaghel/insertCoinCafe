"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlayerCard, SiteNav } from "@/components/customer/site-nav";
import { useCustomer } from "@/components/customer/customer-provider";
import { useCustomerZones } from "@/components/customer/use-customer-zones";
import { rupees, slotLabel } from "@/lib/customer";

export function CustomerRewardsPage() {
  const router = useRouter();
  const { user, myBookings, pointsLog, logout } = useCustomer();
  const zones = useCustomerZones();

  useEffect(() => {
    if (!user) router.replace("/play/login?next=/play/rewards");
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--c-muted)]">
        Redirecting to login…
      </div>
    );
  }

  return (
    <>
      <section className="relative min-h-[240px] overflow-hidden bg-[linear-gradient(180deg,#8152FF,#3A0E72)]">
        <span
          className="c-ghost"
          style={{ right: 40, top: 30, fontSize: 220 }}
          aria-hidden
        >
          PTS
        </span>
        <SiteNav variant="simple" />
        <div className="relative px-[var(--c-pad-x)] pt-4 pb-10">
          <span className="c-eyebrow" style={{ color: "#fff" }}>
            Player rewards
          </span>
          <h1 className="c-display mt-2 text-[clamp(64px,8vw,110px)]">
            My points
          </h1>
        </div>
      </section>

      <div className="flex flex-wrap items-start gap-10 px-[var(--c-pad-x)] py-12">
        <PlayerCard name={user.name} phone={user.phone} points={user.points} />
        <div className="flex min-w-[280px] flex-1 flex-col gap-10">
          <div>
            <h2 className="mb-4 font-[family-name:var(--c-display)] text-[32px] font-semibold uppercase">
              Upcoming bookings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[16px]">
                <thead>
                  <tr>
                    {["ID", "Zone", "When", "Pay at cafe"].map((h) => (
                      <th
                        key={h}
                        className="border-b-2 border-[var(--c-line)] px-3 py-2 text-left font-[family-name:var(--c-display)] text-[18px] font-medium tracking-wide text-[var(--c-muted-2)] uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myBookings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="c-muted px-3 py-4">
                        No upcoming bookings.{" "}
                        <Link className="underline" href="/play/book">
                          Book a slot
                        </Link>{" "}
                        to start earning points.
                      </td>
                    </tr>
                  ) : (
                    myBookings.map((b) => {
                      const zone = zones.find((z) => z.id === b.zone);
                      const date = new Date(b.dateISO);
                      return (
                        <tr key={b.code}>
                          <td className="border-b border-[#33205A] px-3 py-3 font-[family-name:var(--c-display)] text-[22px]">
                            <Link
                              className="no-underline hover:underline"
                              href={`/play/booking/${b.code}`}
                            >
                              {b.code}
                            </Link>
                          </td>
                          <td className="border-b border-[#33205A] px-3 py-3">
                            {zone?.name ?? b.zone}
                          </td>
                          <td className="border-b border-[#33205A] px-3 py-3">
                            {date.toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                            , {slotLabel(b.hour)}
                          </td>
                          <td className="border-b border-[#33205A] px-3 py-3">
                            {rupees(b.amount)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-[family-name:var(--c-display)] text-[32px] font-semibold uppercase">
              Points history
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[16px]">
                <thead>
                  <tr>
                    {["Date", "What", "Points"].map((h) => (
                      <th
                        key={h}
                        className="border-b-2 border-[var(--c-line)] px-3 py-2 text-left font-[family-name:var(--c-display)] text-[18px] font-medium tracking-wide text-[var(--c-muted-2)] uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...pointsLog].reverse().map((l, i) => (
                    <tr key={`${l.date}-${i}`}>
                      <td className="border-b border-[#33205A] px-3 py-3">
                        {new Date(l.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="border-b border-[#33205A] px-3 py-3">
                        {l.what}
                      </td>
                      <td
                        className={`border-b border-[#33205A] px-3 py-3 font-bold ${l.pts > 0 ? "text-[var(--c-success)]" : "text-[#FF9DB5]"}`}
                      >
                        {l.pts > 0 ? "+" : ""}
                        {l.pts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="c-btn c-btn--accent" href="/play/book">
              Book a Slot
            </Link>
            <button
              type="button"
              className="c-btn c-btn--outline"
              onClick={() => {
                logout();
                router.push("/play");
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
