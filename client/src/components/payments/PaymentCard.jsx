import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

const PaymentCard = ({ payment, user, onView }) => {
  const isReceived = payment.receiver?._id === user._id;

  const formattedAmount = Number(payment.amount).toLocaleString("en-IN");

  const date = new Date(payment.paidAt || payment.createdAt);

  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  const formattedTime = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <button
      onClick={() => onView(payment)}
      className="
      group
      flex
      w-full
      items-center
      justify-between
      border-b
      border-slate-800
      px-2
      py-4
      transition
      hover:bg-slate-800/40
      "
    >

      {/* LEFT SECTION */}

      <div className="flex min-w-0 items-center gap-3">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full
          ${
            isReceived
              ? "bg-green-500/10"
              : "bg-red-500/10"
          }`}
        >

          {isReceived ? (
            <ArrowDownLeft
              size={18}
              className="text-green-400"
            />
          ) : (
            <ArrowUpRight
              size={18}
              className="text-red-400"
            />
          )}

        </div>


        <div className="min-w-0 text-left">

          <h3
            className="
            max-w-[180px]
            truncate
            text-sm
            font-semibold
            text-white
            md:max-w-[300px]
            "
            title={payment.gigId?.title}
          >
            {payment.gigId?.title || "Untitled Gig"}
          </h3>


          <p className="mt-1 text-xs text-slate-400">

            {isReceived ? "Received" : "Paid"}

            {" • "}

            {formattedDate}

            {" • "}

            {formattedTime}

          </p>

        </div>

      </div>



      {/* RIGHT SECTION */}

      <div className="flex shrink-0 items-center gap-2">


        <div className="text-right">

          <p
            className={`
            font-semibold
            leading-tight
            text-sm
            sm:text-base
            max-w-[110px]
            truncate
            ${
              isReceived
              ? "text-green-400"
              : "text-red-400"
            }
            `}
          >

            {isReceived ? "+" : "-"}
            ₹{formattedAmount}

          </p>


          <p className="hidden text-[10px] text-slate-500 sm:block">
            {payment.status}
          </p>

        </div>


        <ChevronRight
          size={18}
          className="
          text-slate-600
          transition
          group-hover:translate-x-1
          "
        />

      </div>


    </button>
  );
};

export default PaymentCard;