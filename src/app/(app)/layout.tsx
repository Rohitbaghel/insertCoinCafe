import { AppShell } from "@/components/layout/app-shell";

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
