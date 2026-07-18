import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function PaymentHistory() {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`/api/payments/history/${currentUser._id}`);
        setPayments(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load payment history");
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?._id) fetchHistory();
  }, [currentUser]);

  if (loading) return <p className="p-6 text-gray-500">Loading payment history...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Payment History</h1>

      {payments.length === 0 ? (
        <p className="text-gray-500">No payments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-2 pr-4">Transaction ID</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Payer</th>
                <th className="py-2 pr-4">Receiver</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="py-2 pr-4">{p.transactionId}</td>
                  <td className="py-2 pr-4">₹{p.amount}</td>
                  <td className="py-2 pr-4">{p.payer?.name || p.payer?._id}</td>
                  <td className="py-2 pr-4">{p.receiver?.name || p.receiver?._id}</td>
                  <td className="py-2 pr-4">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        p.status === "Success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}