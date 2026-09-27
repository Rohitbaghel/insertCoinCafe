"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { CompletedSession } from "@/lib/cafe";
import { formatCurrency, formatTimer } from "@/lib/format";
import { cn } from "@/lib/utils";

interface BillingPanelProps {
  sessions: CompletedSession[];
  discountValue: number;
  isPercentDiscount: boolean;
  customerPhone: string;
  customerName: string;
  onToggleSession: (id: string) => void;
  onRemoveSession: (id: string) => void;
  onDiscountValueChange: (value: number) => void;
  onPercentToggle: (checked: boolean) => void;
  onCustomerPhoneChange: (value: string) => void;
  onCustomerNameChange: (value: string) => void;
}

export function BillingPanel({
  sessions,
  discountValue,
  isPercentDiscount,
  customerPhone,
  customerName,
  onToggleSession,
  onRemoveSession,
  onDiscountValueChange,
  onPercentToggle,
  onCustomerPhoneChange,
  onCustomerNameChange,
}: BillingPanelProps) {
  const selected = sessions.filter((s) => s.selected);
  const subtotal = selected.reduce((sum, s) => sum + s.cost, 0);

  let adjustment = 0;
  if (isPercentDiscount) {
    adjustment = (subtotal * discountValue) / 100;
  } else {
    adjustment = discountValue;
  }
  const finalTotal = Math.max(0, subtotal + adjustment);

  return (
    <aside className="flex h-full flex-col border-border bg-white lg:border-l dark:bg-card">
      <div className="border-b border-border px-4 py-4">
        <h2 className="text-lg font-semibold">Billing</h2>
        <p className="text-sm text-muted-foreground">
          Select completed sessions to invoice.
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {sessions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-muted/40 px-3 py-8 text-center text-sm text-muted-foreground">
            No completed sessions yet. Click &quot;Done&quot; on a station to add
            it here.
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "flex items-start gap-2 rounded-lg border p-3",
                session.selected
                  ? "border-indigo-300 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/30"
                  : "border-border"
              )}
            >
              <Checkbox
                checked={session.selected}
                onCheckedChange={() => onToggleSession(session.id)}
                className="mt-0.5"
                aria-label={`Select ${session.seatLabel}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">
                    {session.seatLabel} · {session.resource}
                  </p>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {formatCurrency(session.cost)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatTimer(session.durationSeconds)}
                  {session.note ? ` · ${session.note}` : ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onRemoveSession(session.id)}
                aria-label="Remove session"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="space-y-4 border-t border-border px-4 py-4">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Discount / Adjustment</span>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={isPercentDiscount}
                onCheckedChange={(checked) => onPercentToggle(Boolean(checked))}
              />
              % discount
            </label>
          </div>
          <div className="relative">
            <Input
              type="number"
              step="any"
              value={discountValue}
              onChange={(e) =>
                onDiscountValueChange(Number(e.target.value) || 0)
              }
              className="pr-8"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              {isPercentDiscount ? "%" : "₹"}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Enter negative value for discount (-₹) or positive for price increase
            (+₹)
          </p>
        </div>

        <div className="rounded-lg bg-muted/60 px-4 py-3 dark:bg-muted/30">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Final Total
          </p>
          <p className="text-2xl font-bold tabular-nums text-foreground">
            {formatCurrency(finalTotal)}
          </p>
          {selected.length > 0 && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {selected.length} session{selected.length === 1 ? "" : "s"} ·
              subtotal {formatCurrency(subtotal)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div>
            <label
              htmlFor="customer-phone"
              className="mb-1 block text-sm font-medium"
            >
              Customer Phone Number
            </label>
            <Input
              id="customer-phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={customerPhone}
              onChange={(e) =>
                onCustomerPhoneChange(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />
          </div>
          <div>
            <label
              htmlFor="customer-name"
              className="mb-1 block text-sm font-medium"
            >
              Customer Name
            </label>
            <Input
              id="customer-name"
              placeholder="Customer name"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
