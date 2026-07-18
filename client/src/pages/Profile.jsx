import { useEffect, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  Images,
  Loader2,
  Mail,
  Star,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import AppLayout from "../layouts/AppLayout";
import { userService } from "../services/userService";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const data = await userService.getMyProfile();

      setProfile(data.user);
      setStats(data.stats || {});
      setReviews(data.reviews || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const roleLabel = profile?.role === "client" ? "Client" : "Freelancer";
  const isFreelancer = profile?.role === "freelancer";

  const statCards =
    profile?.role === "client"
      ? [
          {
            label: "Total Gigs",
            value: stats.totalGigs || 0,
            icon: BriefcaseBusiness,
          },
          {
            label: "Active Gigs",
            value: stats.activeGigs || 0,
            icon: CheckCircle2,
          },
          {
            label: "Completed Projects",
            value: stats.completedProjects || 0,
            icon: Award,
          },
          {
            label: "Proposals Received",
            value: stats.totalProposalsReceived || 0,
            icon: UserRound,
          },
        ]
      : [
          {
            label: "Total Proposals",
            value: stats.totalProposals || 0,
            icon: BriefcaseBusiness,
          },
          {
            label: "Accepted Proposals",
            value: stats.acceptedProposals || 0,
            icon: CheckCircle2,
          },
          {
            label: "Active Projects",
            value: stats.activeProjects || 0,
            icon: Award,
          },
          {
            label: "Completed Projects",
            value: stats.completedProjects || 0,
            icon: UserRound,
          },
        ];

  const skills =
    profile?.skills?.length > 0
      ? profile.skills
      : profile?.role === "freelancer"
      ? ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"]
      : ["Project Management", "Hiring", "Communication", "Collaboration"];

  if (loading) {
    return (
      <AppLayout>
        <div className="grid min-h-[70vh] place-items-center">
          <div className="text-center">
            <Loader2
              className="mx-auto animate-spin text-blue-300"
              size={38}
            />
            <p className="mt-4 text-sm text-slate-400">
              Loading profile...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-red-400/20 bg-red-500/10 p-8 text-red-200">
          Profile not found.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-7">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-blue-950/30 sm:p-8">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-500 to-violet-500 text-5xl font-black text-white shadow-lg shadow-blue-500/25 sm:h-32 sm:w-32">
              {profile.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                profile.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-blue-300">
                SkillSphere Profile
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">
                {profile.name || "User"}
              </h1>

              <p className="mt-2 capitalize text-slate-400">
                {roleLabel}
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2">
                  <Mail size={17} className="text-blue-300" />
                  {profile.email}
                </span>

                <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2">
                  <CalendarDays size={17} className="text-violet-300" />
                  Joined {formatDate(profile.createdAt)}
                </span>

                <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 capitalize">
                  <UserRound size={17} className="text-emerald-300" />
                  {profile.role}
                </span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-500/10 p-6 text-center">
              <Star
                className="mx-auto fill-yellow-400 text-yellow-400"
                size={36}
              />
              <h2 className="mt-3 text-4xl font-black text-white">
                {profile.rating || 0}
              </h2>
              <p className="text-sm text-yellow-200">
                {profile.totalReviews || 0} Reviews
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 text-blue-300">
                    <Icon size={24} />
                  </div>

                  <p className="text-3xl font-black text-white">
                    {card.value}
                  </p>
                </div>

                <p className="mt-4 text-sm font-bold text-slate-300">
                  {card.label}
                </p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <main className="space-y-6">
            <Card>
              <h2 className="text-xl font-black text-white">About</h2>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {profile.bio ||
                  (profile.role === "freelancer"
                    ? "A skilled freelancer on SkillSphere focused on delivering clean, reliable, and professional project work."
                    : "A verified client on SkillSphere who posts projects, reviews proposals, and collaborates with freelancers.")}
              </p>
            </Card>

            <Card>
              <h2 className="text-xl font-black text-white">Skills</h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
                        {isFreelancer && (
              <Card>
                <h2 className="text-xl font-black text-white">Resume</h2>

                {profile.resumeUrl ? (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-blue-400/30 hover:bg-white/[0.06]"
                  >
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-300">
                      <FileText size={20} />
                    </div>

                    <span className="flex items-center gap-1 font-bold text-blue-300">
                      View Resume
                      <ExternalLink size={14} />
                    </span>
                  </a>
                ) : (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-center">
                    <FileText className="mx-auto text-slate-600" size={30} />
                    <p className="mt-3 text-sm text-slate-400">
                      No resume uploaded yet.
                    </p>
                  </div>
                )}
              </Card>
            )}

            {isFreelancer && (
              <Card>
                <h2 className="text-xl font-black text-white">Portfolio</h2>

                {profile.portfolioImages?.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {profile.portfolioImages.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-2xl border border-white/10"
                      >
                        <img
                          src={url}
                          alt={`Portfolio ${i + 1}`}
                          className="h-32 w-full object-cover transition hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-center">
                    <Images className="mx-auto text-slate-600" size={30} />
                    <p className="mt-3 text-sm text-slate-400">
                      No portfolio images uploaded yet.
                    </p>
                  </div>
                )}
              </Card>
            )}

            <Card>
              <h2 className="text-xl font-black text-white">
                Latest Reviews
              </h2>

              {reviews.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-center">
                  <Star className="mx-auto text-slate-600" size={34} />
                  <p className="mt-3 text-sm text-slate-400">
                    No reviews yet.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="rounded-2xl border border-white/10 bg-slate-950/35 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black text-white">
                            {review.reviewer?.name || "Reviewer"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {review.gig?.title || "Project"}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-3 py-1 text-yellow-300">
                          <Star
                            size={14}
                            className="fill-yellow-400"
                          />
                          <span className="text-xs font-black">
                            {review.rating}
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-slate-300">
                        {review.comment || "No comment provided."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </main>

          <aside className="space-y-6">
            <Card>
              <h2 className="text-xl font-black text-white">
                Profile Strength
              </h2>

              <div className="mt-5 space-y-4">
                <StrengthItem label="Verified Account" done />
                <StrengthItem label="Profile Information" done />
                <StrengthItem
                  label="Skills Added"
                  done={skills.length > 0}
                />
                <StrengthItem
                  label="Reviews Received"
                  done={(profile.totalReviews || 0) > 0}
                />
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-black text-white">
                Account Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <SummaryRow
                  label="Role"
                  value={roleLabel}
                />
                <SummaryRow
                  label="Email"
                  value={profile.email}
                />
                <SummaryRow
                  label="Joined"
                  value={formatDate(profile.createdAt)}
                />
                <SummaryRow
                  label="Rating"
                  value={`${profile.rating || 0}/5`}
                />
              </div>
            </Card>
          </aside>
        </section>
      </div>
    </AppLayout>
  );
};

const Card = ({ children }) => (
  <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-xl">
    {children}
  </div>
);

const StrengthItem = ({ label, done }) => (
  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/35 p-4">
    <span className="text-sm font-bold text-slate-300">
      {label}
    </span>

    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${
        done
          ? "bg-emerald-500/10 text-emerald-300"
          : "bg-red-500/10 text-red-300"
      }`}
    >
      {done ? "Done" : "Pending"}
    </span>
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0">
    <span className="text-slate-400">
      {label}
    </span>

    <span className="text-right font-bold text-white">
      {value}
    </span>
  </div>
);

export default Profile;