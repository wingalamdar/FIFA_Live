export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 h-10 w-64 animate-pulse rounded-lg bg-white/5" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-white/5 bg-white/[0.02] p-6"
            >
              <div className="mb-4 h-4 w-24 rounded bg-white/5" />
              <div className="mb-3 h-6 w-40 rounded bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="h-8 w-20 rounded bg-white/5" />
                <div className="h-8 w-8 rounded-full bg-white/5" />
                <div className="h-8 w-20 rounded bg-white/5" />
              </div>
              <div className="mt-4 h-3 w-32 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
