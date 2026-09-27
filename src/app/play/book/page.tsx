import { Suspense } from "react";
import { CustomerBookPage } from "@/components/customer/book-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-[var(--c-muted)]">
          Loading…
        </div>
      }
    >
      <CustomerBookPage />
    </Suspense>
  );
}
