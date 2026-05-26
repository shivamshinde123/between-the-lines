export default function RootLoading() {
  return (
    <div className="page-shell">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="panel rounded-[32px] px-6 py-8 md:px-8">
          <div className="h-4 w-36 animate-pulse rounded-full bg-white/50" />
          <div className="mt-5 h-12 w-80 max-w-full animate-pulse rounded-[20px] bg-white/55" />
          <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded-full bg-white/45" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-white/40" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel rounded-[28px] p-6">
            <div className="h-5 w-40 animate-pulse rounded-full bg-white/50" />
            <div className="mt-5 h-32 animate-pulse rounded-[22px] bg-white/45" />
          </div>

          <div className="panel rounded-[28px] p-6">
            <div className="h-5 w-48 animate-pulse rounded-full bg-white/50" />
            <div className="mt-5 space-y-3">
              <div className="h-18 animate-pulse rounded-[20px] bg-white/45" />
              <div className="h-18 animate-pulse rounded-[20px] bg-white/40" />
              <div className="h-18 animate-pulse rounded-[20px] bg-white/35" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
