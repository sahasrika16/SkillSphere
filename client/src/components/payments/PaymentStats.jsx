import {
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
const formatAmount = (amount) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};
const PaymentStats = ({ payments, user }) => {
  const totalTransactions = payments.length;

  const totalPaid = payments
    .filter((payment) => payment.payer?._id === user._id)
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalReceived = payments
    .filter((payment) => payment.receiver?._id === user._id)
    .reduce((sum, payment) => sum + payment.amount, 0);

  const successfulPayments = payments.filter(
    (payment) => payment.status === "Success"
  ).length;

  const cards = [
    {
      title: "Transactions",
      value: totalTransactions,
      subtitle: `${successfulPayments} Successful`,
      icon: CreditCard,
      color: "from-cyan-500 to-blue-600",
    },
    {
  title: "Total Received",
  value: formatAmount(totalReceived),
  subtitle: "Money Earned",
  icon: ArrowDownLeft,
  color: "from-green-500 to-emerald-600",
},
{
  title: "Total Paid",
  value: formatAmount(totalPaid),
  subtitle: "Money Spent",
  icon: ArrowUpRight,
  color: "from-rose-500 to-red-600",
},
    {
      title: "Success Rate",
      value:
        totalTransactions === 0
          ? "0%"
          : `${Math.round(
              (successfulPayments / totalTransactions) * 100
            )}%`,
      subtitle: "Completed Payments",
      icon: CheckCircle2,
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color}`}
            >
              <Icon size={28} className="text-white" />
            </div>

            <p className="text-sm text-slate-400">
              {card.title}
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-white whitespace-nowrap">
              {card.value}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {card.subtitle}
            </p>

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/5 blur-3xl group-hover:bg-blue-500/10" />
          </div>
        );
      })}
    </div>
  );
};

export default PaymentStats;