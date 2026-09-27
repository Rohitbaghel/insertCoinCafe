"use client";

import Link from "next/link";
import { SiteNav } from "@/components/customer/site-nav";
import { PlayerCard } from "@/components/customer/site-nav";
import { useCustomerZones } from "@/components/customer/use-customer-zones";
import { useCustomer } from "@/components/customer/customer-provider";
import {
  CAFE_NAME,
  CUSTOMER_PHOTOS,
  GAMES,
  POINTS,
  offerIsLive,
  rupees,
} from "@/lib/customer";

export function CustomerHomePage() {
  const zones = useCustomerZones();
  const { offer, user } = useCustomer();
  const liveOffer = offerIsLive(offer);
  const ticker = [
    "PS3",
    "PS4",
    "VR ZONE",
    "RACING SIMS",
    "PRIVATE ROOMS",
    "TOURNAMENTS",
    offer.title,
  ];

  return (
    <>
      <section className="relative min-h-[820px] overflow-hidden bg-[linear-gradient(180deg,#8152FF_0%,#5A24C9_55%,#3A0E72_100%)]">
        <SiteNav variant="home" />
        <span
          className="c-ghost hidden md:block"
          style={{ right: "4vw", top: 160, fontSize: "clamp(160px,28vw,420px)" }}
          aria-hidden
        >
          PLAY
        </span>
        <div className="pointer-events-none absolute top-0 right-0 hidden h-full w-[55%] md:block">
          <div className="c-duo h-full [mask-image:linear-gradient(to_left,#000_55%,transparent)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CUSTOMER_PHOTOS.people} alt="Friends with game controllers" />
          </div>
        </div>
        <div className="relative z-[2] flex max-w-[820px] flex-col items-start px-[var(--c-pad-x)] pt-16 pb-24 md:pt-24">
          <span className="c-eyebrow" style={{ color: "#fff" }}>
            Welcome to {CAFE_NAME}
          </span>
          <h1 className="c-display c-d-xxl mt-4">Game on.</h1>
          <span className="c-tag mt-3 text-[clamp(28px,4vw,56px)]">
            OPEN DAILY · 10AM – 11PM
          </span>
          <p className="c-lead mt-8">
            PS3, PS4, VR, racing rigs and private rooms under one roof. Book a
            1-hour slot online and pay at the counter.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link className="c-btn c-btn--ink" href="/play/book">
              Book a Slot
            </Link>
            <a className="c-btn c-btn--outline" href="#zones">
              See Zones
            </a>
            <Link
              className="c-btn c-btn--outline border-white/40 !text-[18px]"
              href="/"
            >
              Operator Desk
            </Link>
          </div>
        </div>
      </section>

      <div
        className="overflow-hidden whitespace-nowrap bg-[var(--c-ink)] py-6 font-[family-name:var(--c-display)] text-[clamp(28px,3.5vw,48px)] font-semibold"
        aria-hidden
      >
        <div className="c-ticker-track">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={`${t}-${i}`}>
              {t} <i className="not-italic text-[var(--c-purple)]">▶</i>
            </span>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-2 bg-[var(--c-ink)] md:grid-cols-4" aria-label="At the cafe">
        {(["arena", "tournament", "room", "vr"] as const).map((key) => (
          <div key={key} className="c-duo h-40 md:h-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CUSTOMER_PHOTOS[key]} alt="" />
          </div>
        ))}
      </section>

      {liveOffer && (
        <section className="px-[var(--c-pad-x)] pt-16" id="offer-section">
          <div className="relative flex min-h-[300px] flex-wrap items-end justify-between gap-8 overflow-hidden bg-[linear-gradient(120deg,#8152FF_0%,#5A24C9_60%,#3A0E72_100%)] px-8 py-12 md:px-14">
            <span className="c-ghost" style={{ right: 40, top: 10, fontSize: 220 }} aria-hidden>
              %
            </span>
            <div className="relative flex flex-col items-start">
              <span className="c-eyebrow" style={{ color: "#fff" }}>
                Limited time offer
              </span>
              <h2 className="c-display mt-2 text-[clamp(80px,12vw,160px)]">
                {offer.title}
              </h2>
              <span className="c-tag mt-1 text-[clamp(28px,3.5vw,48px)]">
                GRAB IT NOW
              </span>
            </div>
            <div className="relative flex max-w-md flex-col items-start gap-5 md:items-end md:text-right">
              <p className="m-0 text-[20px] font-medium">
                {offer.text} Valid till{" "}
                {new Date(offer.end).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
                .
              </p>
              <Link className="c-btn c-btn--ink" href="/play/book">
                Claim Offer
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="c-section" id="zones">
        <div className="c-section-head">
          <div className="flex flex-col gap-3">
            <span className="c-eyebrow">Choose your zone</span>
            <h2 className="c-display c-d-l">Pick where you play</h2>
          </div>
          <p className="c-muted m-0 max-w-sm">
            Every booking is a 1-hour slot. Extend at the counter if the station
            is free. Live floor availability syncs from the operator desk.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {zones.map((z) =>
            z.featured ? (
              <Link
                key={z.id}
                href={`/play/book?zone=${z.id}`}
                className="relative col-span-1 min-h-[380px] overflow-hidden bg-[var(--c-deep-3)] no-underline md:col-span-2"
              >
                <div className="c-duo absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={CUSTOMER_PHOTOS[z.img]} alt={z.name} />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[rgba(26,7,54,.95)] to-transparent" />
                <span className="c-tag absolute top-7 left-8 z-[1] text-[26px]">
                  MOST BOOKED
                </span>
                <div className="absolute inset-x-3 bottom-3 z-[1] flex flex-wrap items-end justify-between gap-4 p-4">
                  <div className="flex flex-col gap-2">
                    <span className="c-display text-[clamp(48px,6vw,88px)]">
                      {z.name}
                    </span>
                    <span className="text-[18px] text-[#E3D6FF]">
                      {z.desc}
                      {z.freeStations != null
                        ? ` · ${z.freeStations}/${z.stations} free now`
                        : ` · ${z.stations} stations`}{" "}
                      · up to {z.maxPlayers} players
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="font-[family-name:var(--c-display)] text-[44px] font-semibold leading-none">
                      {rupees(z.price)}
                      <small className="text-[20px] text-[var(--c-muted)]">
                        {" "}
                        /HR
                      </small>
                    </span>
                    <span className="c-btn c-btn--white !text-[22px]">
                      Book now
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                key={z.id}
                href={`/play/book?zone=${z.id}`}
                className="flex flex-col bg-[var(--c-deep-3)] text-white no-underline"
              >
                <div className="c-duo h-[220px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={CUSTOMER_PHOTOS[z.img]} alt={z.name} />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <span className="c-display text-[48px] leading-[0.9]">
                    {z.name}
                  </span>
                  <span className="c-muted text-[16px]">
                    {z.freeStations != null
                      ? `${z.freeStations}/${z.stations} free now`
                      : `${z.stations} stations`}{" "}
                    · up to {z.maxPlayers} players
                  </span>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="font-[family-name:var(--c-display)] text-[34px] font-semibold leading-none">
                      {rupees(z.price)}
                      <small className="text-[18px] text-[var(--c-muted)]">
                        {" "}
                        /HR
                      </small>
                    </span>
                    <span className="font-[family-name:var(--c-display)] text-[24px] font-semibold">
                      BOOK ▶
                    </span>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      <section className="c-section c-section--light" id="games">
        <div className="c-section-head">
          <div className="flex flex-col gap-3">
            <span className="c-eyebrow">Game library</span>
            <h2 className="c-display c-d-l">What&apos;s your game?</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {GAMES.map((g) => (
            <div
              key={g}
              className="relative h-48 overflow-hidden bg-[#6B3BF0] md:h-64"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-luminosity grayscale contrast-125"
                style={{ backgroundImage: `url(${CUSTOMER_PHOTOS.neon})` }}
              />
              <span className="c-tag absolute bottom-4 left-3 text-[26px] shadow-none">
                {g.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="relative flex min-h-[560px] flex-wrap justify-between gap-10 overflow-hidden bg-[linear-gradient(180deg,#8152FF,#3A0E72)] px-[var(--c-pad-x)] py-20"
        id="events"
      >
        <span className="c-ghost" style={{ right: 40, top: 40, fontSize: 280 }} aria-hidden>
          CUP
        </span>
        <div className="relative max-w-xl">
          <span className="c-eyebrow" style={{ color: "#fff" }}>
            {CAFE_NAME} presents
          </span>
          <h2 className="c-display c-d-xl mt-4">Weekend Cup</h2>
          <span className="c-tag mt-3 text-[clamp(28px,3.5vw,48px)]">
            SAT 7PM · OPEN ENTRY
          </span>
          <p className="mt-8 text-[20px] font-medium">
            Prize pool ₹10,000 · Entry ₹200 per player · Limited slots
          </p>
          <div className="mt-8">
            <a className="c-btn c-btn--ink" href="#events">
              Register Now
            </a>
          </div>
        </div>
        <div className="c-duo relative h-80 w-full max-w-md md:h-[420px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CUSTOMER_PHOTOS.tournament} alt="Tournament celebration" />
        </div>
      </section>

      <section className="c-section c-section--light" id="rewards">
        <div className="flex flex-wrap items-center gap-12">
          <div className="flex min-w-[280px] flex-1 flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="c-eyebrow">Player rewards</span>
              <h2 className="c-display c-d-l">Earn points. Play free.</h2>
              <p className="c-muted m-0 max-w-xl text-[20px]">
                Every paid hour earns you points. Collect {POINTS.forFreeHour}{" "}
                and your next hour is on us.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1 bg-white p-6 text-[var(--c-deep)]">
                <b className="font-[family-name:var(--c-display)] text-[64px] leading-none text-[#6B3BF0]">
                  +{POINTS.perHour}
                </b>
                <strong className="font-[family-name:var(--c-display)] text-[26px] uppercase">
                  Points per hour
                </strong>
                <span className="c-muted text-[15px]">
                  Added when you pay at the counter.
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-[var(--c-ink)] p-6 text-white">
                <b className="font-[family-name:var(--c-display)] text-[64px] leading-none text-[var(--c-purple-soft)]">
                  {POINTS.forFreeHour}
                </b>
                <strong className="font-[family-name:var(--c-display)] text-[26px] uppercase">
                  Points = 1 hour free
                </strong>
                <span className="text-[15px] text-[#D2C7E8]">
                  Any zone, any day.
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-white p-6 text-[var(--c-deep)]">
                <b className="font-[family-name:var(--c-display)] text-[64px] leading-none text-[#6B3BF0]">
                  1 TAP
                </b>
                <strong className="font-[family-name:var(--c-display)] text-[26px] uppercase">
                  To redeem
                </strong>
                <span className="c-muted text-[15px]">
                  Switch on &quot;Use points&quot; while booking.
                </span>
              </div>
            </div>
          </div>
          <PlayerCard
            name={user?.name ?? "Rahul Kumar"}
            phone={user?.phone ?? "9876543210"}
            points={user?.points ?? 240}
          />
        </div>
      </section>

      <section className="c-section c-section--light">
        <div className="c-section-head">
          <div className="flex flex-col gap-3">
            <span className="c-eyebrow">How it works</span>
            <h2 className="c-display c-d-l">Book in a minute</h2>
          </div>
        </div>
        <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["01", "Log in with your phone", "Quick OTP login, no password."],
            ["02", "Choose zone & time", "Pick a date and a 1-hour slot."],
            ["03", "Get your booking ID", "Confirmed instantly on screen."],
            [
              "04",
              "Play, then pay at the counter",
              "Cash, UPI or card. Points are added when you pay.",
            ],
          ].map(([n, t, d], i) => (
            <li
              key={n}
              className={`flex flex-col gap-2 p-7 ${i === 3 ? "bg-[var(--c-ink)] text-white" : "bg-white text-[var(--c-deep)]"}`}
            >
              <b
                className={`font-[family-name:var(--c-display)] text-[72px] leading-none ${i === 3 ? "text-[var(--c-purple-soft)]" : "text-[#6B3BF0]"}`}
              >
                {n}
              </b>
              <strong className="font-[family-name:var(--c-display)] text-[28px] leading-tight uppercase">
                {t}
              </strong>
              <span className={i === 3 ? "text-[#D2C7E8]" : "c-muted"}>{d}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="c-section" id="visit">
        <div className="flex flex-wrap gap-12">
          <div className="flex min-w-[280px] flex-1 flex-col items-start gap-6">
            <span className="c-eyebrow">Visit us</span>
            <h2 className="c-display c-d-l">Come play</h2>
            <div>
              <div className="font-[family-name:var(--c-display)] text-[20px] tracking-[0.18em] text-[var(--c-purple-text)]">
                ADDRESS
              </div>
              <div className="text-[20px]">12 Arcade Lane, Bengaluru – 560001</div>
            </div>
            <div>
              <div className="font-[family-name:var(--c-display)] text-[20px] tracking-[0.18em] text-[var(--c-purple-text)]">
                HOURS
              </div>
              <div className="text-[20px]">Mon–Sun, 10 AM – 11 PM</div>
            </div>
            <div>
              <div className="font-[family-name:var(--c-display)] text-[20px] tracking-[0.18em] text-[var(--c-purple-text)]">
                PHONE
              </div>
              <div className="text-[20px]">+91 98765 43210</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="c-btn c-btn--white" href="https://wa.me/919876543210">
                WhatsApp Us
              </a>
              <a className="c-btn c-btn--outline" href="#visit">
                Directions
              </a>
            </div>
          </div>
          <div className="flex min-h-[320px] min-w-[280px] flex-1 items-center justify-center border-2 border-dashed border-[#5A3D8F] bg-[var(--c-deep-3)] text-[var(--c-muted-2)]">
            Map · InsertCoinCafe Bengaluru
          </div>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-6 bg-[var(--c-ink)] px-[var(--c-pad-x)] py-10">
        <span className="c-brand">{CAFE_NAME}</span>
        <nav className="flex flex-wrap gap-8 font-[family-name:var(--c-display)] text-[22px]" aria-label="Footer">
          <a className="text-[#D2C7E8] no-underline" href="#visit">
            Instagram
          </a>
          <a className="text-[#D2C7E8] no-underline" href="#visit">
            WhatsApp
          </a>
          <Link className="text-[#D2C7E8] no-underline" href="/">
            Staff Login
          </Link>
        </nav>
      </footer>

    </>
  );
}
