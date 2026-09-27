"use client";

import { CafeProvider } from "@/components/cafe-provider";
import { CustomerProvider } from "@/components/customer/customer-provider";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <CafeProvider>
      <CustomerProvider>{children}</CustomerProvider>
    </CafeProvider>
  );
}
