export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="relative flex h-10 w-10">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-cyan/40" />
          <span className="relative m-auto mt-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
        </span>
        <p className="text-sm text-[#858585]">Loading Phishfix AI…</p>
      </div>
    </div>
  );
}