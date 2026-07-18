import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  IndianRupee,
  MapPin,
  Send,
  Sparkles,
  Tag,
  CheckCircle2,
  Star,
  Loader2,
  X
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import AppLayout from "../layouts/AppLayout";
import { gigService } from "../services/gigService";
import { useAuth } from "../context/AuthContext";
import SendProposalModal from "../components/gigs/proposals/SendProposalModal";
import ReviewModal from "../components/gigs/reviews/ReviewModal";
import PaymentModal from "./PaymentModal";

const GigDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showProposalModal, setShowProposalModal] = useState(false);

  const [showSubmitWorkModal, setShowSubmitWorkModal] = useState(false);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryLink, setDeliveryLink] = useState("");

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const userId = user?._id || user?.id;

  const isFreelancer = user?.role === "freelancer";
  const isClient = user?.role === "client";

  const clientId =
    typeof gig?.client === "object"
      ? gig.client._id
      : gig?.client;

  const hiredFreelancerId =
    typeof gig?.hiredFreelancer === "object"
      ? gig.hiredFreelancer?._id
      : gig?.hiredFreelancer;

  const isOwnGig = String(clientId) === String(userId);

  const hasApplied = gig?.proposals?.some(
  (p) =>
    String(p.freelancer?._id || p.freelancer) === String(userId) &&
    p.status !== "rejected"
);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        setLoading(true);

        const data = await gigService.getGigById(id);

        setGig(data.gig);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load gig details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  const refreshGig = async () => {
    const data = await gigService.getGigById(id);
    setGig(data.gig);
  };

  const submitWork = async () => {
    try {
      await gigService.submitWork(gig._id, {
        deliveryMessage,
        deliveryLink
      });

      alert("Work submitted successfully!");

      setDeliveryMessage("");
      setDeliveryLink("");
      setShowSubmitWorkModal(false);

      await refreshGig();

    } catch (err) {
      console.log(err);
      alert("Failed to submit work");
    }
  };

  const completeProject = async () => {
    try {
      await gigService.completeProject(gig._id);

      await refreshGig();

      alert("Project completed successfully!");

    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
          "Failed to complete project"
      );
    }
  };

  if (loading)
    return (
      <AppLayout>
        <div className="py-24 text-center text-white text-xl">
          Loading...
        </div>
      </AppLayout>
    );

  if (error || !gig)
    return (
      <AppLayout>
        <div className="py-24 text-center text-red-400">
          {error || "Gig not found"}
        </div>
      </AppLayout>
    );

  return (
    <AppLayout>

      <div className="mx-auto max-w-7xl px-4 py-8">

        <div className="mb-8">

          <Link
            to="/gigs"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-gray-300 transition hover:border-blue-500 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Gigs
          </Link>

        </div>

        <div className="
grid 
grid-cols-1 
xl:grid-cols-[1fr_350px]
gap-8
">

          <div className="space-y-6 lg:col-span-2">

            {/* HERO */}

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl">

              <div className="mb-6 flex items-center justify-between">

                <span className="rounded-full bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-300">
                  {gig.category}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold capitalize
                  ${
                    gig.status === "completed"
                      ? "bg-green-500/20 text-green-300"
                      : gig.status === "submitted"
                      ? "bg-purple-500/20 text-purple-300"
                      : gig.status === "in_progress"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {gig.status.replace("_", " ")}
                </span>

              </div>

              <h1 className="text-4xl font-bold text-white break-words line-clamp-2">
  {gig.title}
</h1>

              <p className="
text-gray-400
break-words
line-clamp-3
overflow-hidden
">
 {gig.description}
</p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">
                    Budget
                  </p>

                  <div className="flex items-center gap-2 font-bold text-white">
  <IndianRupee size={18} />
  ₹{gig.budget?.min?.toLocaleString()} - ₹{gig.budget?.max?.toLocaleString()}
</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">
                    Location
                  </p>

                  <div className="flex items-center gap-2 font-bold text-white">
                    <MapPin size={18} />
                    {gig.location?.remote
                      ? "Remote"
                      : gig.location?.city}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">
                    Experience
                  </p>

                  <div className="flex items-center gap-2 font-bold capitalize text-white">
                    <Sparkles size={18} />
                    {gig.experienceLevel}
                  </div>
                </div>

              </div>

            </div>
                        {/* REQUIRED SKILLS */}

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-7 shadow-xl">

              <div className="mb-6 flex items-center gap-3">

                <Tag className="text-blue-400" size={22} />

                <h2 className="text-2xl font-black text-white">
                  Required Skills
                </h2>

              </div>

              <div className="flex flex-wrap gap-3">

                {gig.skillsRequired?.map((skill) => (

                  <span
                    key={skill}
                    className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 font-semibold capitalize text-blue-300 transition hover:scale-105"
                  >
                    {skill}
                  </span>

                ))}

              </div>

            </div>

            {/* PROJECT TIMELINE */}

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-7 shadow-xl">

              <div className="mb-6 flex items-center gap-3">

                <CalendarDays
                  className="text-violet-400"
                  size={22}
                />

                <h2 className="text-2xl font-black text-white">
                  Project Timeline
                </h2>

              </div>

              <div className="space-y-6">

                <div className="flex justify-between">

                  <div>

                    <p className="text-sm text-slate-400">
                      Created
                    </p>

                    <p className="font-semibold">
                      {new Date(
                        gig.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  <Clock3 className="text-slate-500" />

                </div>

                <div className="flex justify-between">

                  <div>

                    <p className="text-sm text-slate-400">
                      Deadline
                    </p>

                    <p className="font-semibold">
                      {new Date(
                        gig.deadline
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  <CalendarDays className="text-slate-500" />

                </div>

                {gig.submission?.submittedAt && (

                  <div className="flex justify-between">

                    <div>

                      <p className="text-sm text-slate-400">
                        Submitted
                      </p>

                      <p className="font-semibold">
                        {new Date(
                          gig.submission.submittedAt
                        ).toLocaleString()}
                      </p>

                    </div>

                    <Send className="text-green-400" />

                  </div>

                )}

              </div>

            </div>

          </div>

          {/* RIGHT SIDEBAR */}

          <div className="space-y-6">

            <div className="sticky top-6 rounded-3xl border border-white/10 bg-slate-900 p-7 shadow-xl">

              <h2 className="mb-6 text-2xl font-black">
                Project Summary
              </h2>

              <div className="space-y-5">

                <div>

                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Client
                  </p>

                  <div className="mt-2 flex items-center gap-3">

                    <div className="h-12 w-12 overflow-hidden rounded-full bg-blue-500/20">
  {gig.client?.profilePic ? (
    <img
      src={gig.client.profilePic}
      alt={gig.client.name}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center font-bold text-blue-300">
      {gig.client?.name?.charAt(0)}
    </div>
  )}
</div>

                    <div>

                      <p className="font-bold">
                        {gig.client?.name}
                      </p>

                      <p className="text-sm text-slate-400">
                        Verified Client
                      </p>

                    </div>

                  </div>

                </div>

                <hr className="border-white/10" />

                <div>

                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Freelancer
                  </p>

                  <p className="mt-2 font-semibold">
                    {gig.hiredFreelancer?.name ||
                      "Not Assigned"}
                  </p>

                </div>

                <hr className="border-white/10" />

                <div>

                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Current Status
                  </p>

                  <p className="mt-2 font-semibold capitalize text-green-400">
                    {gig.status.replace("_", " ")}
                  </p>

                </div>

                {gig.status === "completed" && (
                  <>
                    <hr className="border-white/10" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Payment
                      </p>
                      <p className={`mt-2 font-semibold ${gig.isPaid ? "text-green-400" : "text-yellow-400"}`}>
                        {gig.isPaid ? "Paid" : "Payment Pending"}
                      </p>
                    </div>
                  </>
                )}

              </div>

              <div className="mt-8 space-y-3">

                {isFreelancer &&
                  !gig.hiredFreelancer &&
                  gig.status === "open" && (

                    hasApplied ? (
                      <button
                        disabled
                        className="w-full cursor-not-allowed rounded-2xl border border-white/10 bg-white/5 py-4 font-bold text-slate-400"
                      >
                        ✅ Proposal Sent
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setShowProposalModal(true)
                        }
                        className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 py-4 font-bold transition hover:scale-[1.02]"
                      >
                        🚀 Send Proposal
                      </button>
                    )

                )}

                {isFreelancer &&
                  String(hiredFreelancerId) ===
                    String(userId) &&
                  gig.status === "in_progress" && (

                    <button
                      onClick={() =>
                        setShowSubmitWorkModal(true)
                      }
                      className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 py-4 font-bold transition hover:scale-[1.02]"
                    >
                      📤 Submit Work
                    </button>

                )}

                {isClient &&
                  isOwnGig &&
                  gig.status === "submitted" && (

                    <button
                      onClick={completeProject}
                      className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 py-4 font-bold transition hover:scale-[1.02]"
                    >
                      ✅ Complete Project
                    </button>

                )}

                {isClient &&
                  isOwnGig &&
                  gig.status === "completed" &&
                  !gig.isPaid && (

                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 font-bold transition hover:scale-[1.02]"
                    >
                      💳 Pay Now
                    </button>

                )}

                {isClient &&
                  isOwnGig &&
                  gig.status === "completed" && (

                    <button
                      onClick={() =>
                        setShowReviewModal(true)
                      }
                      className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 py-4 font-bold transition hover:scale-[1.02]"
                    >
                      ⭐ Leave Review
                    </button>

                )}

                {isClient &&
                  isOwnGig && (

                    <Link
                      to={`/gigs/${gig._id}/proposals`}
                      className="block w-full rounded-2xl border border-white/10 py-4 text-center font-semibold transition hover:border-blue-500 hover:bg-blue-500/10"
                    >
                      👥 View Proposals
                    </Link>

                )}

              </div>

            </div>
                        {/* WORK SUBMITTED CARD */}

            {isClient &&
              isOwnGig &&
              gig.status === "submitted" &&
              gig.submission && (

                <div className="rounded-3xl border border-white/10 bg-slate-900 p-7 shadow-xl">

                  <div className="mb-5 flex items-center gap-3">

                    <CheckCircle2
                      className="text-green-400"
                      size={24}
                    />

                    <h2 className="text-2xl font-black">
                      Work Submitted
                    </h2>

                  </div>

                  <div className="space-y-5">

                    <div>

                      <p className="text-sm text-slate-400">
                        Delivery Message
                      </p>

                      <p className="mt-2">
                        {gig.submission.deliveryMessage ||
                          "No message"}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-slate-400">
                        Project Link
                      </p>

                      <a
                        href={gig.submission.deliveryLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-blue-400 underline"
                      >
                        {gig.submission.deliveryLink}
                      </a>

                    </div>

                  </div>

                </div>

            )}

          </div>

        </div>

        {/* ---------------- MODALS ---------------- */}

        {isFreelancer &&
          !gig.hiredFreelancer &&
          gig.status === "open" &&
          !hasApplied && (

            <SendProposalModal
              gig={gig}
              isOpen={showProposalModal}
              onClose={() =>
                setShowProposalModal(false)
              }
              onSuccess={refreshGig}
            />

        )}

        {showSubmitWorkModal &&
          String(hiredFreelancerId) ===
            String(userId) &&
          gig.status === "in_progress" && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-8">

              <h2 className="mb-6 text-3xl font-black">
                Submit Work
              </h2>

              <textarea
                rows={6}
                value={deliveryMessage}
                onChange={(e) =>
                  setDeliveryMessage(e.target.value)
                }
                placeholder="Describe the completed work..."
                className="mb-4 w-full rounded-2xl border border-white/10 bg-white/5 p-4 outline-none focus:border-blue-500"
              />

              <input
                value={deliveryLink}
                onChange={(e) =>
                  setDeliveryLink(e.target.value)
                }
                placeholder="GitHub / Drive / Live URL"
                className="mb-6 w-full rounded-2xl border border-white/10 bg-white/5 p-4 outline-none focus:border-blue-500"
              />

              <div className="flex gap-3">

                <button
                  onClick={submitWork}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 py-4 font-bold transition hover:scale-[1.02]"
                >
                  Submit Work
                </button>

                <button
                  onClick={() =>
                    setShowSubmitWorkModal(false)
                  }
                  className="flex-1 rounded-2xl border border-white/10 py-4 transition hover:bg-white/5"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )}

        {showReviewModal &&
          isClient &&
          isOwnGig &&
          gig.status === "completed" && (

          <ReviewModal
            isOpen={showReviewModal}
            onClose={() =>
              setShowReviewModal(false)
            }
            gigId={gig._id}
            revieweeId={hiredFreelancerId}
            revieweeName={
              gig.hiredFreelancer?.name
            }
            onSuccess={refreshGig}
          />

        )}

        {showPaymentModal &&
          isClient &&
          isOwnGig &&
          gig.status === "completed" &&
          !gig.isPaid && (

          <PaymentModal
            gigId={gig._id}
            amount={gig.budget?.max}
            payerId={userId}
            receiverId={hiredFreelancerId}
            onSuccess={(payment) => {
    refreshGig();

    alert(
        `✅ Payment Successful

Transaction ID:
${payment.transactionId}`
    );
}}
            onClose={() => setShowPaymentModal(false)}
          />

        )}

      </div>

    </AppLayout>
  );
};

export default GigDetails;