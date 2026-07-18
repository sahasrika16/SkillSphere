import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await adminService.getReviews();
      setReviews(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review permanently? This cannot be undone.")) {
      return;
    }

    try {
      setActionId(id);
      await adminService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.log(err);
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return <p className="text-slate-400">Loading reviews...</p>;
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Reviews</h2>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-slate-400">
            <th className="py-3 pr-4">Gig</th>
            <th className="py-3 pr-4">Reviewer</th>
            <th className="py-3 pr-4">Reviewee</th>
            <th className="py-3 pr-4">Rating</th>
            <th className="py-3 pr-4">Comment</th>
            <th className="py-3 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id} className="border-b border-white/5">
              <td className="py-3 pr-4 max-w-xs truncate">
                {review.gig?.title || "—"}
              </td>
              <td className="py-3 pr-4 text-slate-300">
                {review.reviewer?.name || "—"}
              </td>
              <td className="py-3 pr-4 text-slate-300">
                {review.reviewee?.name || "—"}
              </td>
              <td className="py-3 pr-4">⭐ {review.rating}</td>
              <td className="py-3 pr-4 max-w-sm truncate text-slate-400">
                {review.comment || "—"}
              </td>
              <td className="py-3 pr-4">
                <button
                  disabled={actionId === review._id}
                  onClick={() => handleDelete(review._id)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reviews.length === 0 && (
        <p className="text-slate-400 mt-4">No reviews found.</p>
      )}
    </div>
  );
};

export default ManageReviews;
