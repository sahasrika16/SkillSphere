import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { useAuth } from "../context/AuthContext";
import { paymentService } from "../services/paymentService";

import PaymentStats from "../components/payments/PaymentStats";
import PaymentCard from "../components/payments/PaymentCard";
import PaymentDetailsModal from "../components/payments/PaymentDetailsModal";
import EmptyPayments from "../components/payments/EmptyPayments";

import { Search, Filter } from "lucide-react";

const Payments = () => {
  const { user } = useAuth();
if (!user) {
  return (
    <AppLayout>
      <div className="p-8 text-center text-slate-400">
        Loading user...
      </div>
    </AppLayout>
  );
}
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  useEffect(() => {
  if (user?._id) {
    fetchPayments();
  }
}, [user]);

  const fetchPayments = async () => {
  if (!user?._id) return;

  try {
    const data = await paymentService.getPaymentHistory(user?._id);
    setPayments(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const filteredPayments = payments.filter(
    (payment) => {
      const title =
        payment.gigId?.title?.toLowerCase() || "";

      const txn =
        payment.transactionId?.toLowerCase() || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        title.includes(searchText) ||
        txn.includes(searchText);

      if (filter === "paid") {
        return (
          matchesSearch &&
          payment.payer?._id === user?._id
        );
      }

      if (filter === "received") {
        return (
          matchesSearch &&
          payment.receiver?._id === user?._id
        );
      }

      return matchesSearch;
    }
  );
    return (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">

        {/* Header */}

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-4xl font-black text-white">
              💳 Payments
            </h1>

            <p className="mt-2 text-slate-400">
              Track every payment you've sent and received.
            </p>

          </div>

          <div className="flex flex-col gap-4 md:flex-row">

            {/* Search */}

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-5 py-3">

              <Search
                size={18}
                className="text-slate-500"
              />

              <input
                type="text"
                placeholder="Search project or transaction..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full md:w-64 bg-transparent outline-none placeholder:text-slate-500"
              />

            </div>

            {/* Filter */}

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-5 py-3">

              <Filter
                size={18}
                className="text-slate-500"
              />

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
                className="bg-transparent outline-none"
              >

                <option
                  value="all"
                  className="bg-slate-900"
                >
                  All
                </option>

                <option
                  value="paid"
                  className="bg-slate-900"
                >
                  Paid
                </option>

                <option
                  value="received"
                  className="bg-slate-900"
                >
                  Received
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="mb-10">

          <PaymentStats
            payments={payments}
            user={user}
          />

        </div>
                {/* Payment History */}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">

          <div className="border-b border-white/10 px-6 py-5">

            <div>

              <h2 className="text-2xl font-black text-white">
                Recent Payments
              </h2>

              <p className="mt-1 text-slate-400">
                {filteredPayments.length} transaction
                {filteredPayments.length !== 1 && "s"} found
              </p>

            </div>

          </div>

          {loading ? (

            <div className="flex h-72 items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />

                <p className="text-slate-400">
                  Loading payments...
                </p>

              </div>

            </div>

          ) : filteredPayments.length === 0 ? (

            <EmptyPayments />

          ) : (

            <div className="divide-y divide-white/10">

              {filteredPayments.map((payment) => (

                <PaymentCard
                  key={payment._id}
                  payment={payment}
                  user={user}
                  onView={setSelectedPayment}
                />

              ))}

            </div>

          )}

        </div>
                {/* Payment Details Modal */}

        {selectedPayment && (

          <PaymentDetailsModal
            payment={selectedPayment}
            onClose={() => setSelectedPayment(null)}
          />

        )}

      </div>

    </AppLayout>

  );
};

export default Payments;