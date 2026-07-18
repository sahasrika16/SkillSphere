import { CreditCard, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyPayments = () => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 py-20 text-center">

      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/10">
        <CreditCard size={48} className="text-cyan-400" />
      </div>

      <h2 className="text-3xl font-black text-white">
        No Payments Yet
      </h2>

      <p className="mx-auto mt-4 max-w-md text-slate-400 leading-7">
        Your payment history is empty. Once you complete a project,
        every successful transaction will appear here.
      </p>

      <div className="mt-8">

        <Link
          to="/gigs"
          className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-bold text-white transition hover:scale-105"
        >
          <BriefcaseBusiness size={20} />
          Browse Gigs
        </Link>

      </div>

    </div>
  );
};

export default EmptyPayments;