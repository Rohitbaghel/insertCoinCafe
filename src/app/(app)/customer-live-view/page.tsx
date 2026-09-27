import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-md rounded-xl border border-border bg-white p-8 text-center shadow-sm dark:bg-card">
        <h1 className="text-xl font-bold">Customer Live View</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Players book and track sessions on the public InsertCoinCafe site.
          Open the customer experience to preview what guests see.
        </p>
        <Link
          href="/play"
          className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-[#4f46e5] px-4 text-sm font-medium text-white hover:bg-[#4338ca]"
        >
          Open Customer Site
        </Link>
      </div>
    </div>
  );
}
