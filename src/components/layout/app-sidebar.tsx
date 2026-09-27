"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  ChevronDown,
  ChevronRight,
  CircuitBoard,
  ClipboardList,
  Gamepad2,
  LayoutDashboard,
  Lock,
  LogOut,
  Medal,
  Settings2,
  Smartphone,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

const SHOP_SETUP = [
  { href: "/rate-card", label: "Rate Card" },
  { href: "/manage-resources", label: "Manage Resources" },
  { href: "/manage-staff", label: "Manage Staff" },
  { href: "/manage-snacks", label: "Manage Snacks" },
  { href: "/customer-live-view", label: "Customer Live View" },
  { href: "/tax-config", label: "Tax Config" },
  { href: "/shop-details", label: "Shop Details" },
] as const;

const TOP_LINKS = [
  { href: "/pc-lock", label: "PC Lock", icon: Lock },
  { href: "/advanced-bookings", label: "Advanced Bookings", icon: CalendarClock },
  { href: "/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/subscription-plans", label: "Subscription Plans", icon: ClipboardList },
] as const;

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const shopSetupActive = SHOP_SETUP.some((i) => pathname.startsWith(i.href));
  const [shopOpenManual, setShopOpenManual] = useState<boolean | null>(null);
  const shopOpen = shopOpenManual ?? true;
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-border bg-white transition-transform dark:bg-card lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#4f46e5] text-white">
              <Gamepad2 className="size-4" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-bold text-[#4f46e5]">
                InsertCoinCafe
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                Operator console
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3 text-sm">
          <NavLink
            href="/"
            active={pathname === "/"}
            onNavigate={onClose}
            icon={LayoutDashboard}
          >
            Dashboard
          </NavLink>

          <NavLink
            href="/play"
            active={pathname.startsWith("/play")}
            onNavigate={onClose}
            icon={Gamepad2}
          >
            Customer Site
          </NavLink>

          <div>
            <button
              type="button"
              onClick={() => setShopOpenManual((v) => !(v ?? shopOpen))}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left font-medium text-foreground hover:bg-muted",
                shopSetupActive && "text-[#4f46e5]"
              )}
            >
              <Settings2 className="size-4 shrink-0" />
              <span className="flex-1">Shop Setup</span>
              {shopOpen ? (
                <ChevronDown className="size-3.5 opacity-60" />
              ) : (
                <ChevronRight className="size-3.5 opacity-60" />
              )}
            </button>
            {shopOpen && (
              <div className="mt-0.5 space-y-0.5 border-l border-border ml-4 pl-2">
                {SHOP_SETUP.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    active={pathname.startsWith(item.href)}
                    onNavigate={onClose}
                    nested
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <CollapsibleLabel
            open={rewardsOpen}
            onToggle={() => setRewardsOpen((v) => !v)}
            icon={Medal}
            label="Rewards Setup"
          >
            <NavLink href="/rewards" active={pathname === "/rewards"} onNavigate={onClose} nested>
              Loyalty Points
            </NavLink>
          </CollapsibleLabel>

          <CollapsibleLabel
            open={reportsOpen}
            onToggle={() => setReportsOpen((v) => !v)}
            icon={ClipboardList}
            label="Reports"
          >
            <NavLink href="/reports" active={pathname === "/reports"} onNavigate={onClose} nested>
              Revenue Overview
            </NavLink>
          </CollapsibleLabel>

          {TOP_LINKS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              active={pathname.startsWith(item.href)}
              onNavigate={onClose}
              icon={item.icon}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-2 border-t border-border p-3 text-xs">
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            <p className="font-semibold">Support</p>
            <p className="opacity-90">5 PM to 2 AM IST</p>
          </div>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md border border-border px-2.5 py-2 text-left hover:bg-muted"
          >
            <Users className="size-3.5" />
            <span className="truncate font-medium">Shop Operator</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md border border-border px-2.5 py-2 text-left hover:bg-muted"
          >
            <Smartphone className="size-3.5" />
            Android app
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-2 py-1.5 font-medium text-orange-800 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-200"
            >
              <CircuitBoard className="size-3.5" />
              Free Trial · 28d left
            </button>
            <button
              type="button"
              className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Log out"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavLink({
  href,
  active,
  children,
  onNavigate,
  icon: Icon,
  nested,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onNavigate: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "relative flex items-center gap-2 rounded-md px-2.5 py-2 font-medium transition-colors",
        nested && "py-1.5 text-[13px]",
        active
          ? "bg-indigo-50 text-[#4f46e5] dark:bg-indigo-950/40 dark:text-indigo-300"
          : "text-foreground/80 hover:bg-muted hover:text-foreground"
      )}
    >
      {active && (
        <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[#4f46e5]" />
      )}
      {Icon && <Icon className="size-4 shrink-0" />}
      <span className="truncate">{children}</span>
    </Link>
  );
}

function CollapsibleLabel({
  open,
  onToggle,
  icon: Icon,
  label,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left font-medium text-foreground hover:bg-muted"
      >
        <Icon className="size-4 shrink-0" />
        <span className="flex-1">{label}</span>
        {open ? (
          <ChevronDown className="size-3.5 opacity-60" />
        ) : (
          <ChevronRight className="size-3.5 opacity-60" />
        )}
      </button>
      {open && (
        <div className="mt-0.5 space-y-0.5 border-l border-border ml-4 pl-2">
          {children}
        </div>
      )}
    </div>
  );
}
