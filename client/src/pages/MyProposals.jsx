
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  IndianRupee,
  Loader2,
  RefreshCcw,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
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

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const data = await proposalService.getMyProposals();
      setProposals(data.proposals || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load proposals"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleWithdraw = async (proposalId) => {
    try {
      setWithdrawingId(proposalId);

      await proposalService.withdrawProposal(proposalId);

      toast.success("Proposal withdrawn successfully");

      fetchProposals();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to withdraw proposal"
      );
    } finally {
      setWithdrawingId(null);
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
                Freelancer Workspace
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
                My Proposals
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Track every proposal you send and monitor client decisions.
              </p>
            </div>

            <button
              onClick={fetchProposals}
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
              Loading your proposals...
            </p>
          </div>
        ) : proposals.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-12 text-center">
            <BriefcaseBusiness className="mx-auto text-blue-300" size={42} />

            <h2 className="mt-5 text-2xl font-black">
              No proposals yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              Browse gigs and send your first proposal.
            </p>

            <Link
              to="/gigs"
              className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-black"
            >
              Browse Gigs
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {proposals.map((proposal) => (
              <article
                key={proposal._id}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl transition hover:border-blue-400/30 hover:bg-white/[0.1]"
              >
                <div className="space-y-5">

                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-black break-words">
                      {proposal.gig?.title || "Untitled Gig"}
                    </h2>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${
                        statusStyles[proposal.status] ||
                        statusStyles.pending
                      }`}
                    >
                      {proposal.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400">
                    Client: {proposal.client?.name || "Client"} ·{" "}
                    {proposal.gig?.category}
                  </p>

                  <p className="line-clamp-4 break-words text-sm leading-7 text-slate-300">
                    {proposal.coverLetter}
                  </p>

                  {proposal.coverLetter?.length > 250 && (
                    <button
                      className="text-sm font-bold text-blue-400 hover:text-blue-300"
                      onClick={() =>
                        alert(proposal.coverLetter)
                      }
                    >
                      Read Full Proposal →
                    </button>
                  )}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

                    <Link
                      to={`/gigs/${
                        proposal.gig?.slug || proposal.gig?._id
                      }`}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-bold transition hover:bg-blue-600"
                    >
                      View
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>

                  {["pending", "shortlisted"].includes(
                    proposal.status
                  ) && (
                    <button
                      onClick={() =>
                        handleWithdraw(proposal._id)
                      }
                      disabled={
                        withdrawingId === proposal._id
                      }
                      className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-300 transition hover:bg-red-500 hover:text-white disabled:opacity-60"
                    >
                      {withdrawingId === proposal._id ? (
                        <Loader2
                          className="animate-spin"
                          size={16}
                        />
                      ) : (
                        <XCircle size={16} />
                      )}

                      Withdraw
                    </button>
                  )}
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
  <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/35 p-3">
    <p className="flex items-center gap-2 text-xs text-slate-400">
      <Icon size={15} className="text-blue-300" />
      {label}
    </p>

    <p className="mt-1 break-words text-sm font-black">
      {value}
    </p>
  </div>
);

export default MyProposals;

