import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Eye,
  IndianRupee,
  Loader2,
  RefreshCcw,
  Trash2,
  UsersRound
} from "lucide-react";
import toast from "react-hot-toast";

import AppLayout from "../layouts/AppLayout";
import { gigService } from "../services/gigService";

const statusStyles = {
  draft: "bg-slate-500/10 text-slate-300 border-slate-400/20",
  open: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20",
  in_progress: "bg-blue-500/10 text-blue-300 border-blue-400/20",
  completed: "bg-violet-500/10 text-violet-300 border-violet-400/20",
  cancelled: "bg-red-500/10 text-red-300 border-red-400/20",
  closed: "bg-zinc-500/10 text-zinc-300 border-zinc-400/20"
};

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyGigs = async () => {
    try {
      setLoading(true);
      const data = await gigService.getMyGigs();
      setGigs(data.gigs || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load your gigs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGigs();
  }, []);

  const handleDeleteGig = async (gigId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gig? This action will close the gig and remove it from My Gigs."
    );

    if (!confirmed) return;

    try {
      setDeletingId(gigId);
      await gigService.deleteGig(gigId);

      setGigs((prev) => prev.filter((gig) => gig._id !== gigId));
      toast.success("Gig deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete gig");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-7 overflow-x-hidden">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-blue-950/30 sm:p-8">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold text-blue-300">
                Client Workspace
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
                My Gigs
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Manage posted gigs, track proposal activity, and move the right
                freelancer forward.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={fetchMyGigs}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-3 text-sm font-bold transition hover:bg-white/[0.13]"
              >
                <RefreshCcw size={17} />
                Refresh
              </button>

              <Link
                to="/gigs/create"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-black shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
              >
                Post New Gig
              </Link>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="grid place-items-center rounded-[2rem] border border-white/10 bg-white/[0.07] p-12">
            <Loader2 className="animate-spin text-blue-300" size={34} />
            <p className="mt-3 text-sm text-slate-400">Loading your gigs...</p>
          </div>
        ) : gigs.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-12 text-center">
            <BriefcaseBusiness className="mx-auto text-blue-300" size={44} />
            <h2 className="mt-5 text-2xl font-black">No gigs posted yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              Create your first requirement and start receiving proposals from
              freelancers.
            </p>
            <Link
              to="/gigs/create"
              className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-black"
            >
              Post a Gig
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {gigs.map((gig) => (
              <article
                key={gig._id}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl transition hover:border-blue-400/30 hover:bg-white/[0.1]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="min-w-0 break-words text-xl font-black">
                        {gig.title}
                      </h2>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold capitalize ${
                          statusStyles[gig.status] || statusStyles.open
                        }`}
                      >
                        {gig.status?.replace("_", " ")}
                      </span>
                    </div>

                    <p className="mt-2 break-words text-sm text-slate-400">
                      {gig.category} ·{" "}
                      {gig.location?.remote ? "Remote" : gig.location?.city}
                    </p>

                    <p className="mt-4 line-clamp-2 break-words text-sm leading-6 text-slate-300">
                      {gig.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {gig.skillsRequired?.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="max-w-full break-words rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-[420px] lg:flex-shrink-0">
                    <Info
                      icon={IndianRupee}
                      label="Budget"
                      value={`₹${gig.budget?.min?.toLocaleString()} - ₹${gig.budget?.max?.toLocaleString()}`}
                    />

                    <Info
                      icon={UsersRound}
                      label="Proposals"
                      value={gig.proposalsCount || 0}
                    />

                    <Info
                      icon={CalendarDays}
                      label="Deadline"
                      value={new Date(gig.deadline).toLocaleDateString()}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                  <Link
                    to={`/gigs/${gig.slug || gig._id}`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-sm font-bold transition hover:bg-white/[0.13]"
                  >
                    <Eye size={16} />
                    View Gig
                  </Link>

                  <Link
                    to={`/gigs/${gig._id}/proposals`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
                  >
                    View Proposals
                    <ArrowUpRight size={16} />
                  </Link>

                  <button
                    onClick={() => handleDeleteGig(gig._id)}
                    disabled={deletingId === gig._id}
                    className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-sm font-black text-red-300 transition hover:bg-red-500 hover:text-white disabled:opacity-60"
                  >
                    {deletingId === gig._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete Gig
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

const Info = ({ icon: Icon, label, value }) => (
 <div className="min-w-0 rounded-2xl border border-white/10 bg-slate-950/35 p-3 text-center">
    <p className="flex items-center gap-2 text-xs text-slate-400">
      <Icon size={15} className="text-blue-300" />
      {label}
    </p>
    <p className="mt-1 truncate text-sm font-black">{value}</p>
  </div>
);

export default MyGigs;
