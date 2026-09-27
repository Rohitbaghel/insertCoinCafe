"use client";

import Link from "next/link";
import { CAFE_NAME } from "@/lib/customer";
import { useCustomer } from "@/components/customer/customer-provider";

export function SiteNav({
  variant = "home",
}: {
  variant?: "home" | "simple" | "book";
}) {
  const { user } = useCustomer();

  return (
    <header className="c-nav">
      <Link className="c-brand" href="/play">
        {CAFE_NAME}
      </Link>
      {variant === "home" && (
        <nav className="c-nav-links" aria-label="Main">
          <a href="#zones">Zones</a>
          <a href="#games">Games</a>
          <a href="#events">Events</a>
          <a href="#rewards">Rewards</a>
          <a href="#visit">Contact</a>
        </nav>
      )}
      {variant === "book" && (
        <nav className="c-nav-links" aria-label="Account">
          <Link href="/play/rewards">My Points</Link>
        </nav>
      )}
      <Link
        className="c-account"
        href={user ? "/play/rewards" : "/play/login"}
      >
        {user ? (
          <>
            <span className="c-avatar">{user.name[0]}</span>
            <span>
              {user.name.split(" ")[0]} · {user.points} pts
            </span>
          </>
        ) : (
          <span>Sign Up / Log In</span>
        )}
      </Link>
    </header>
  );
}

export function PlayerCard({
  name,
  phone,
  points,
}: {
  name: string;
  phone: string;
  points: number;
}) {
  const free = 100;
  const ready = Math.floor(points / free);
  const toward = points % free;

  return (
    <div className="relative flex min-h-[480px] w-full max-w-[460px] flex-col overflow-hidden bg-[linear-gradient(160deg,#8152FF,#3A0E72)] p-8 shadow-[0_30px_60px_rgba(58,14,114,.35)]">
      <span
        className="c-ghost"
        style={{ right: -20, bottom: -30, fontSize: 280 }}
        aria-hidden
      >
        PTS
      </span>
      <div className="relative flex items-center justify-between gap-2">
        <span className="c-brand" style={{ fontSize: 32 }}>
          {CAFE_NAME}
        </span>
        <span className="c-tag" style={{ fontSize: 20, transform: "none", boxShadow: "none" }}>
          PLAYER CARD
        </span>
      </div>
      <span className="relative mt-8 text-[17px] text-[#E3D6FF]">
        {name} · +91 {phone}
      </span>
      <span className="c-display relative mt-1" style={{ fontSize: clampPts(points) }}>
        {points} PTS
      </span>
      <div className="relative mt-8 flex flex-col gap-2">
        <div className="flex justify-between text-[16px]">
          <span>Next free hour</span>
          <b>
            {toward} / {free}
          </b>
        </div>
        <div
          className="h-3.5 bg-[rgba(26,7,54,.6)]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={free}
          aria-valuenow={toward}
        >
          <div
            className="h-full bg-white"
            style={{ width: `${(toward / free) * 100}%` }}
          />
        </div>
      </div>
      <span
        className="c-tag relative mt-auto self-start"
        style={{ fontSize: 32 }}
      >
        {ready} FREE HOUR{ready === 1 ? "" : "S"} READY
      </span>
    </div>
  );
}

function clampPts(points: number) {
  if (points >= 1000) return 96;
  return 120;
}
