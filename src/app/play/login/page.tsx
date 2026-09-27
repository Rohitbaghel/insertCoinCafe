import { Suspense } from "react";
import { CustomerLoginPage } from "@/components/customer/login-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-[var(--c-muted)]">
          Loading…
        </div>
      }
    >
      <CustomerLoginPage />
    </Suspense>
  );
}
