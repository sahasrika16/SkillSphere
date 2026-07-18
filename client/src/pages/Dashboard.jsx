import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Loader2,
  MessageCircle,
  Plus,
  Sparkles,
  Star,
  UserRound
} from "lucide-react";
import toast from "react-hot-toast";

import AppLayout from "../layouts/AppLayout";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";

const Dashboard = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await userService.getMyProfile();
      setProfile(data.user);
      setStats(data.stats || {});
      setReviews(data.reviews || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const currentUser = profile || user;
  const isFreelancer = currentUser?.role === "freelancer";

  const dashboardStats = isFreelancer
    ? [
        {
          label: "Proposals",
          value: stats.totalProposals || 0,
          icon: BriefcaseBusiness,
          path: "/my-proposals"
        },
        {
          label: "Accepted",
          value: stats.acceptedProposals || 0,
          icon: CheckCircle2,
          path: "/my-proposals"
        },
        {
          label: "Active Projects",
          value: stats.activeProjects || 0,
          icon: Clock3,
          path: "/my-proposals"
        },
        {
          label: "Completed",
          value: stats.completedProjects || 0,
          icon: Award,
          path: "/profile"
        }
      ]
    : [
        {
          label: "Total Gigs",
          value: stats.totalGigs || 0,
          icon: BriefcaseBusiness,
          path: "/my-gigs"
        },
        {
          label: "Active Gigs",
          value: stats.activeGigs || 0,
          icon: CheckCircle2,
          path: "/my-gigs"
        },
        {
          label: "Completed",
          value: stats.completedProjects || 0,
          icon: Award,
          path: "/my-gigs"
        },
        {
          label: "Proposals",
          value: stats.totalProposalsReceived || 0,
          icon: UserRound,
          path: "/my-gigs"
        }
      ];

  const primaryAction = isFreelancer
    ? { label: "Browse Gigs", path: "/gigs" }
    : { label: "Post a Requirement", path: "/gigs/create" };

  if (loading) {
    return (
      <AppLayout>
        <div className="grid min-h-[70vh] place-items-center">
          <Loader2 className="animate-spin text-blue-300" size={38} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-7">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-blue-950/30 sm:p-8">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
                <Sparkles size={14} />
                Your workspace is live
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Welcome back, {currentUser?.name || "User"}.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                {isFreelancer
                  ? "Manage proposals, active projects, messages, and reviews."
                  : "Manage posted gigs, proposals, messages, and freelancer reviews."}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-300 transition hover:bg-yellow-500/20"
                >
                  <Star size={17} className="fill-yellow-400" />
                  {currentUser?.rating || 0}/5 Rating
                </Link>

                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/[0.12]"
                >
                  <MessageCircle size={17} className="text-blue-300" />
                  {currentUser?.totalReviews || 0} Reviews
                </Link>
              </div>
            </div>

            <Link
              to={primaryAction.path}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3.5 text-sm font-bold shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
            >
              <Plus size={19} />
              {primaryAction.label}
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map(({ label, value, icon: Icon, path }) => (
            <Link
              to={path}
              key={label}
              className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 transition hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/[0.1]"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-blue-500/15 p-3 text-blue-300">
                  <Icon size={21} />
                </div>

                <span className="text-xs font-medium text-blue-300">
                  View
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-400">{label}</p>
              <p className="mt-1 text-3xl font-black tracking-tight">
                {value}
              </p>
            </Link>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6">
            <h2 className="text-xl font-black">Recent Reviews</h2>

            {reviews.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/35 p-6 text-center">
                <Star className="mx-auto text-slate-600" size={34} />
                <p className="mt-3 text-sm text-slate-400">
                  No reviews yet.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {reviews.slice(0, 3).map((review) => (
                  <Link
                    to="/profile"
                    key={review._id}
                    className="block rounded-2xl border border-white/10 bg-slate-950/35 p-4 transition hover:border-yellow-400/30 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black">
                        {review.reviewer?.name || "Reviewer"}
                      </p>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-300">
                        <Star size={13} className="fill-yellow-400" />
                        {review.rating}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
                      {review.comment || "No comment provided."}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-300">
                <Clock3 size={21} />
              </div>

              <div>
                <h2 className="font-black">Next Move</h2>
                <p className="text-sm text-slate-400">
                  {isFreelancer ? "Find suitable work" : "Create or review gigs"}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-300">
              {isFreelancer
                ? "Browse gigs that match your skills and send strong proposals."
                : "Post clear requirements or review existing gig proposals."}
            </p>

            <Link
              to={isFreelancer ? "/gigs" : "/gigs/create"}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 py-3 text-sm font-bold shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
            >
              <Plus size={18} />
              {isFreelancer ? "Browse Gigs" : "Create Gig"}
            </Link>

            <Link
              to="/profile"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] py-3 text-sm font-bold transition hover:bg-white/[0.13]"
            >
              <CheckCircle2 size={18} className="text-blue-300" />
              View Profile
            </Link>
          </aside>
        </section>
      </div>
    </AppLayout>
  );
};

export default Dashboard;