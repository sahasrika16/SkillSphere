import { useState } from "react";
import api from "../services/api";

export default function PaymentModal({
  gigId,
  amount,
  payerId,
  receiverId,
  onSuccess,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompletePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.post("/payments/complete", {
        gigId,
        amount,
        payerId,
        receiverId,
      });

      onSuccess(data.payment);
      onClose();
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Payment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">

        <h2 className="mb-6 text-3xl font-bold">
          Mock Payment
        </h2>

        <div className="rounded-2xl bg-slate-800 p-5">

          <div className="flex justify-between mb-3">
            <span>Amount</span>
            <span className="font-bold text-green-400">
              ₹{amount}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-yellow-400">
              Ready to Pay
            </span>
          </div>

        </div>

        {error && (
          <div className="mt-5 rounded-xl bg-red-500/20 p-3 text-red-300">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          onClick={handleCompletePayment}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 font-bold transition hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? "Processing..." : "Complete Payment"}
        </button>

        <button
          onClick={onClose}
          disabled={loading}
          className="mt-3 w-full rounded-2xl border border-white/10 py-4"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}