"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCustomer } from "@/components/customer/customer-provider";
import { CAFE_NAME, CUSTOMER_PHOTOS } from "@/lib/customer";

export function CustomerLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/play/book";
  const {
    user,
    pendingPhone,
    needsName,
    sendOtp,
    verifyOtp,
    completeSignup,
    resetLogin,
  } = useCustomer();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, router, next]);

  useEffect(() => {
    if (!pendingPhone || needsName || resendIn <= 0) return;
    const id = window.setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [pendingPhone, needsName, resendIn]);

  const step: "phone" | "otp" | "name" = needsName
    ? "name"
    : pendingPhone
      ? "otp"
      : "phone";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative min-h-[420px] overflow-hidden bg-[linear-gradient(180deg,#8152FF,#3A0E72)]">
        <Link
          className="c-brand absolute top-12 left-8 z-[2] md:left-16"
          href="/play"
        >
          {CAFE_NAME}
        </Link>
        <span
          className="c-ghost"
          style={{ left: -20, top: 240, fontSize: "clamp(160px,28vw,360px)" }}
          aria-hidden
        >
          PLAY
        </span>
        <div className="c-duo absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CUSTOMER_PHOTOS.loginPhoto} alt="" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(129,82,255,.55),rgba(58,14,114,.9))]" />
        <div className="absolute top-36 left-8 z-[2] flex flex-col gap-2 md:left-16">
          <span className="c-eyebrow" style={{ color: "#fff" }}>
            One OTP away
          </span>
          <span className="c-display text-[clamp(56px,8vw,110px)]">
            Ready P1?
          </span>
        </div>
        <span className="c-tag absolute bottom-12 left-8 z-[2] text-[clamp(24px,3vw,36px)] md:left-16">
          BOOKINGS SAVED TO YOUR NUMBER
        </span>
      </div>

      <div className="flex items-center justify-center bg-[var(--c-deep)] px-6 py-16">
        {step === "phone" && (
          <form
            className="flex w-full max-w-md flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              const res = sendOtp(phone);
              if (!res.ok) setError(res.error ?? "Try again");
              else {
                setError("");
                setResendIn(30);
              }
            }}
          >
            <div className="flex flex-col gap-2">
              <span className="c-eyebrow">Step 1 of 2</span>
              <h1 className="c-display text-[64px] md:text-[80px]">
                Log in to book
              </h1>
              <p className="c-muted m-0">
                Enter your mobile number. We&apos;ll send a 6-digit code.
              </p>
            </div>
            <label className="flex flex-col gap-2 text-[15px] font-semibold text-[var(--c-muted)]">
              Mobile number
              <div className="flex h-14 border-2 border-[var(--c-line)] bg-[var(--c-deep-2)] focus-within:border-[var(--c-purple-soft)]">
                <span className="flex items-center border-r-2 border-[var(--c-line)] px-4">
                  +91
                </span>
                <input
                  className="min-w-0 flex-1 bg-transparent px-4 text-[20px] outline-none"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="98765 43210"
                />
              </div>
            </label>
            <p className="min-h-[1.2em] text-[15px] font-semibold text-[#FF9DB5]" role="alert">
              {error}
            </p>
            <button
              className="c-btn c-btn--accent c-btn--block"
              type="submit"
              disabled={phone.length !== 10}
            >
              Send OTP
            </button>
            <span className="c-muted text-[14px]">
              By continuing you agree to the cafe&apos;s terms. Prototype OTP:{" "}
              <b>123456</b>. Try 9876543210 for a returning player.
            </span>
          </form>
        )}

        {step === "otp" && (
          <form
            className="flex w-full max-w-md flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              const res = verifyOtp(otp);
              if (!res.ok) setError(res.error ?? "Try again");
              else {
                setError("");
                if (!res.needName) router.replace(next);
              }
            }}
          >
            <button
              type="button"
              className="self-start text-[16px] text-[var(--c-muted)]"
              onClick={() => {
                setError("");
                setOtp("");
                resetLogin();
              }}
            >
              ◀ Change number
            </button>
            <div className="flex flex-col gap-2">
              <span className="c-eyebrow">Step 2 of 2</span>
              <h1 className="c-display text-[64px] md:text-[80px]">
                Enter the code
              </h1>
              <p className="c-muted m-0">
                Sent to +91 {pendingPhone}. Prototype: use <b>123456</b>.
              </p>
            </div>
            <input
              className="c-input h-[72px] text-center font-[family-name:var(--c-display)] text-[48px] tracking-[0.35em]"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              aria-label="6-digit code"
            />
            <p className="min-h-[1.2em] text-[15px] font-semibold text-[#FF9DB5]" role="alert">
              {error}
            </p>
            <button
              className="c-btn c-btn--accent c-btn--block"
              type="submit"
              disabled={otp.length !== 6}
            >
              Verify &amp; Continue
            </button>
            <button
              type="button"
              className="text-[16px] text-[var(--c-muted)] disabled:opacity-50"
              disabled={resendIn > 0}
              onClick={() => {
                if (pendingPhone) sendOtp(pendingPhone);
                setResendIn(30);
              }}
            >
              {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </button>
          </form>
        )}

        {step === "name" && (
          <form
            className="flex w-full max-w-md flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) {
                setError("Tell us your name to continue.");
                return;
              }
              completeSignup(name);
              router.replace(next);
            }}
          >
            <div className="flex flex-col gap-2">
              <span className="c-eyebrow">New player</span>
              <h1 className="c-display text-[64px] md:text-[80px]">
                What&apos;s your name?
              </h1>
              <p className="c-muted m-0">You only do this once.</p>
            </div>
            <label className="flex flex-col gap-2 text-[15px] font-semibold text-[var(--c-muted)]">
              Your name
              <input
                className="c-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Kumar"
                autoComplete="name"
              />
            </label>
            <p className="min-h-[1.2em] text-[15px] font-semibold text-[#FF9DB5]" role="alert">
              {error}
            </p>
            <button
              className="c-btn c-btn--accent c-btn--block"
              type="submit"
              disabled={!name.trim()}
            >
              Continue to Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
