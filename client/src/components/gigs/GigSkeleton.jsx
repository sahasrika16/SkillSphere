//gig skeleton
const GigSkeleton = () => {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl">
      <div className="h-2 bg-gradient-to-r from-white/10 via-white/20 to-white/10" />

      <div className="p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="h-6 w-4/5 animate-pulse rounded-xl bg-white/10" />
            <div className="h-4 w-1/3 animate-pulse rounded-xl bg-white/10" />
          </div>

          <div className="h-11 w-11 animate-pulse rounded-2xl bg-white/10" />
        </div>

        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded-xl bg-white/10" />
          <div className="h-4 w-11/12 animate-pulse rounded-xl bg-white/10" />
          <div className="h-4 w-2/3 animate-pulse rounded-xl bg-white/10" />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <div className="h-7 w-20 animate-pulse rounded-full bg-blue-500/10" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-blue-500/10" />
          <div className="h-7 w-16 animate-pulse rounded-full bg-blue-500/10" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="h-5 w-28 animate-pulse rounded-xl bg-white/10" />
          <div className="h-5 w-24 animate-pulse rounded-xl bg-white/10" />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
          <div className="h-4 w-28 animate-pulse rounded-xl bg-white/10" />
          <div className="h-10 w-24 animate-pulse rounded-2xl bg-white/10" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </article>
  );
};

export default GigSkeleton;