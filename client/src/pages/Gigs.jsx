import { BriefcaseBusiness, Plus, RefreshCcw, Search } from "lucide-react";
import { Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import useGigs from "../hooks/useGigs";
import { useAuth } from "../context/AuthContext";
import GigCard from "../components/gigs/GigCard";
import GigFilters from "../components/gigs/GigFilters";
import GigSkeleton from "../components/gigs/GigSkeleton";
import EmptyState from "../components/gigs/EmptyState";
import { useState } from "react";

const initialFilters = {
  search: "",
  category: "",
  skills: "",
  minBudget: "",
  maxBudget: "",
  experienceLevel: ""
};

const Gigs = () => {
  const { gigs, loading, error, pagination, fetchGigs } = useGigs();
  const { user } = useAuth();
  const [filters, setFilters] = useState(initialFilters);

  const isClient = user?.role === "client";

  const handleApplyFilters = () => {
    fetchGigs(filters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    fetchGigs({});
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-7">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-blue-950/30 sm:p-8">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
                <BriefcaseBusiness size={14} />
                Live Gig Marketplace
              </div>

              <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
                Discover high-quality freelance opportunities near you.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Browse curated projects, filter by skills and budget, and connect
                with clients through a focused SkillSphere workspace.
              </p>
            </div>

            {isClient && (
              <Link
                to="/gigs/create"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3.5 text-sm font-bold shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
              >
                <Plus size={19} />
                Post a Gig
              </Link>
            )}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[340px_1fr]">
          <GigFilters
            filters={filters}
            setFilters={setFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />

          <main className="space-y-5">
            <div className="flex flex-col justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold">Available Gigs</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {loading
                    ? "Loading curated opportunities..."
                    : `${pagination?.total || gigs.length} opportunities found`}
                </p>
              </div>

              <button
                onClick={() => fetchGigs(filters)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-bold transition hover:bg-white/[0.13]"
              >
                <RefreshCcw size={17} />
                Refresh
              </button>
            </div>

            {error && (
              <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-5 text-sm text-red-200">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <GigSkeleton key={index} />
                ))}
              </div>
            ) : gigs.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {gigs.map((gig) => (
                  <GigCard key={gig._id} gig={gig} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title="No gigs found"
                description="Try changing your filters or search for another skill."
                actionLabel="Reset Filters"
                onAction={handleResetFilters}
              />
            )}
          </main>
        </section>
      </div>
    </AppLayout>
  );
};

export default Gigs;