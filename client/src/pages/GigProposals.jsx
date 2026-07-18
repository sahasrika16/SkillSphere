import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  ExternalLink,
  IndianRupee,
  Loader2,
  Mail,
  RefreshCcw,
  ShieldCheck,
  UserRound,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";

import AppLayout from "../layouts/AppLayout";
import { proposalService } from "../services/proposalService";

const statusStyles = {
  pending: "bg-yellow-500/10 text-yellow-300 border-yellow-400/20",
  shortlisted: "bg-blue-500/10 text-blue-300 border-blue-400/20",
  accepted: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20",
  rejected: "bg-red-500/10 text-red-300 border-red-400/20",
  withdrawn: "bg-slate-500/10 text-slate-300 border-slate-400/20"
};

const GigProposals = () => {
  const { id } = useParams();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchGigProposals = async () => {
    try {
      setLoading(true);
      const data = await proposalService.getGigProposals(id);
      setProposals(data.proposals || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load proposals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigProposals();
  }, [id]);

  const updateStatus = async (proposalId, status) => {
    try {
      setActionLoadingId(`${proposalId}-${status}`);

      await proposalService.updateProposalStatus(proposalId, {
        status,
        clientNote:
          status === "accepted"
            ? "Accepted. Let's start the project."
            : "Not selected for this project."
      });

      toast.success(`Proposal ${status} successfully`);
      fetchGigProposals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update proposal");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-7">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-blue-950/30 sm:p-8">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold text-blue-300">
                Client Workspace
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
                Gig Proposals
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Review freelancer proposals, compare bids, evaluate timelines,
                and accept or reject candidates.
              </p>
            </div>

            <button
              onClick={fetchGigProposals}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-3 text-sm font-bold transition hover:bg-white/[0.13]"
            >
              <RefreshCcw size={17} />
              Refresh
            </button>
          </div>
        </section>

        {loading ? (
          <div className="grid place-items-center rounded-[2rem] border border-white/10 bg-white/[0.07] p-12">
            <Loader2 className="animate-spin text-blue-300" size={34} />
            <p className="mt-3 text-sm text-slate-400">
              Loading proposals...
            </p>
          </div>
        ) : proposals.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-12 text-center">
            <BriefcaseBusiness className="mx-auto text-blue-300" size={44} />
            <h2 className="mt-5 text-2xl font-black">No proposals yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              Once freelancers apply to this gig, their proposals will appear
              here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {proposals.map((proposal) => (
            <article
  key={proposal._id}
  className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl transition hover:border-blue-400/30 hover:bg-white/[0.1] overflow-hidden"
>
  <div className="flex flex-col gap-6">

    <div className="flex flex-wrap items-center gap-3">
      <Link
        to={`/users/${proposal.freelancer?._id}`}
        className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-lg font-black shrink-0 transition hover:opacity-80"
      >
        {proposal.freelancer?.name?.charAt(0)?.toUpperCase() || "F"}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={`/users/${proposal.freelancer?._id}`}
          className="block text-xl font-black break-words transition hover:text-blue-300"
        >
          {proposal.freelancer?.name || "Freelancer"}
        </Link>

        <p className="flex items-center gap-2 text-sm text-slate-400 break-all">
          <Mail size={14} className="shrink-0" />
          {proposal.freelancer?.email || "No email"}
        </p>
      </div>

      <span
        className={`rounded-full border px-3 py-1 text-xs font-bold capitalize shrink-0 ${
          statusStyles[proposal.status] || statusStyles.pending
        }`}
      >
        {proposal.status}
      </span>
    </div>

    <p className="text-sm leading-7 text-slate-300 break-all line-clamp-4">
      {proposal.coverLetter}
    </p>

    {proposal.coverLetter?.length > 250 && (
      <button
        className="w-fit text-sm font-bold text-blue-400 hover:text-blue-300"
        onClick={() => alert(proposal.coverLetter)}
      >
        Read Full Proposal →
      </button>
    )}

{proposal.portfolioLinks?.length > 0 && (
  <div className="flex flex-wrap gap-2">
    {proposal.portfolioLinks.map((link) => (
      <a
        key={link}
        href={link}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300 transition hover:bg-blue-500 hover:text-white break-all"
      >
        Portfolio
        <ExternalLink size={13} />
      </a>
    ))}
  </div>
)}

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Info
        icon={IndianRupee}
        label="Bid"
        value={`₹${proposal.bidAmount?.toLocaleString()}`}
      />

      <Info
        icon={Clock3}
        label="Timeline"
        value={`${proposal.estimatedDays} days`}
      />

      <Info
        icon={UserRound}
        label="Rating"
        value={`${proposal.freelancer?.rating || 0}/5`}
      />
    </div>

    <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">

      {["pending", "shortlisted"].includes(proposal.status) && (
        <>
          <button
            onClick={() => updateStatus(proposal._id, "accepted")}
            disabled={actionLoadingId !== null}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-600 disabled:opacity-60"
          >
            {actionLoadingId === `${proposal._id}-accepted`
              ? <Loader2 className="animate-spin" size={16} />
              : <BadgeCheck size={16} />}
            Accept
          </button>

          <button
            onClick={() => updateStatus(proposal._id, "rejected")}
            disabled={actionLoadingId !== null}
            className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-300 transition hover:bg-red-500 hover:text-white disabled:opacity-60"
          >
            {actionLoadingId === `${proposal._id}-rejected`
              ? <Loader2 className="animate-spin" size={16} />
              : <XCircle size={16} />}
            Reject
          </button>
        </>
      )}

      {proposal.status === "accepted" && (
        <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-300">
          <ShieldCheck size={16} />
          Freelancer selected
        </div>
      )}

      {proposal.status === "rejected" && (
        <div className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-300">
          <XCircle size={16} />
          Proposal rejected
        </div>
      )}

      {proposal.status === "withdrawn" && (
        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-400/20 bg-slate-500/10 px-4 py-2.5 text-sm font-bold text-slate-300">
          Withdrawn by freelancer
        </div>
      )}
    </div>

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
  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
    <p className="flex items-center gap-2 text-xs text-slate-400">
      <Icon size={15} className="text-blue-300" />
      {label}
    </p>
    <p className="mt-1 text-sm font-black">{value}</p>
  </div>
);

export default GigProposals;