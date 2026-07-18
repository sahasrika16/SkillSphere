import { useState } from "react";
import { Loader2, Star, X } from "lucide-react";
import toast from "react-hot-toast";

import { reviewService } from "../../../services/reviewService";

const ReviewModal = ({
  isOpen,
  onClose,
  gigId,
  revieweeId,
  revieweeName,
  onSuccess
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const submitReview = async (e) => {
    e.preventDefault();

    if (!gigId || !revieweeId) {
      toast.error("Review details missing");
      return;
    }

    try {
      setLoading(true);

      await reviewService.createReview({
        gigId,
        revieweeId,
        rating,
        comment,
        communicationRating: rating,
        qualityRating: rating,
        deliveryRating: rating
      });

      toast.success("Review submitted successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-blue-950/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-blue-300">Submit Review</p>
            <h2 className="mt-2 text-2xl font-black">
              Rate {revieweeName || "Freelancer"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-white/10 p-2 text-slate-300 hover:bg-red-500 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submitReview} className="mt-6 space-y-5">
          <div>
            <label className="mb-3 block text-sm font-bold text-slate-300">
              Rating
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition hover:scale-110"
                >
                  <Star
                    size={34}
                    className={
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-600"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Review Comment
            </label>

            <textarea
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your experience..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 py-3.5 text-sm font-black shadow-lg shadow-blue-500/25 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Star size={18} />
            )}
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;