"use client";

import { useState } from "react";
import { CafeProvider, useCafe } from "@/components/cafe-provider";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

function ShellInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, toggleDarkMode, toast } = useCafe();

  return (
    <div className="flex min-h-full bg-[#f3f4f6] dark:bg-background">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
      {toast && (
        <div
          role="status"
          className="fixed right-4 bottom-4 z-50 rounded-lg border border-border bg-white px-4 py-2.5 text-sm shadow-lg dark:bg-card"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CafeProvider>
      <ShellInner>{children}</ShellInner>
    </CafeProvider>
  );
}
