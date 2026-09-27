import Link from "next/link";

export function StubPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-md rounded-xl border border-border bg-white p-8 text-center shadow-sm dark:bg-card">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <p className="mt-4 text-xs font-medium tracking-wide text-amber-700 uppercase">
          Coming soon
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-8 items-center justify-center rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
