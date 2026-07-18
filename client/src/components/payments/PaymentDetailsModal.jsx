import {
  X,
  Copy,
  CheckCircle2,
  IndianRupee,
  CalendarDays,
  User,
  BriefcaseBusiness,
} from "lucide-react";

const PaymentDetailsModal = ({ payment, onClose }) => {
  if (!payment) return null;

  const copyTxn = () => {
    navigator.clipboard.writeText(payment.transactionId);
  };

  const date = new Date(
  payment.paidAt || payment.createdAt || Date.now()
);

  return (
    <div className="
fixed inset-0 z-50 
flex items-end justify-center
bg-black/70 backdrop-blur-sm
sm:items-center
overflow-hidden
">

      <div className="
w-full
max-w-md
max-h-[85vh]
overflow-y-auto
rounded-t-3xl
bg-slate-900
p-6
shadow-2xl
sm:rounded-3xl
">


        {/* HEADER */}

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-lg font-bold text-white">
            Payment Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/10"
          >
            <X size={20}/>
          </button>

        </div>



        {/* AMOUNT */}

        <div className="text-center">

          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">

            <CheckCircle2 
              className="text-green-400"
              size={32}
            />

          </div>


          <p className="text-sm text-slate-400">
            Payment Successful
          </p>


          <h1 className="
            mt-2
            font-black
            text-green-400
            text-[clamp(1.8rem,8vw,2.5rem)]
          ">
            ₹{Number(payment.amount).toLocaleString("en-IN")}
          </h1>

        </div>



        {/* DETAILS */}

        <div className="mt-8 space-y-1">


          <DetailRow
            icon={<BriefcaseBusiness size={18}/>}
            title="Project"
            value={payment.gigId?.title}
          />


          <DetailRow
            icon={<User size={18}/>}
            title="Paid By"
            value={payment.payer?.name}
          />


          <DetailRow
            icon={<User size={18}/>}
            title="Paid To"
            value={payment.receiver?.name}
          />


          <DetailRow
            icon={<CalendarDays size={18}/>}
            title="Date"
            value={date.toLocaleString()}
          />


          <div className="
            flex
            items-center
            justify-between
            border-t
            border-slate-800
            py-4
          ">

            <div className="min-w-0">

              <p className="text-xs text-slate-500">
                Transaction ID
              </p>

              <p className="
                max-w-[220px]
                truncate
                text-sm
                font-semibold
              ">
                {payment.transactionId}
              </p>

            </div>


            <button
              onClick={copyTxn}
              className="
              rounded-lg
              p-2
              hover:bg-white/10
              "
            >
              <Copy size={18}/>
            </button>

          </div>


        </div>



        <button
          onClick={onClose}
          className="
          mt-6
          w-full
          rounded-xl
          bg-cyan-500
          py-3
          font-bold
          text-white
          hover:bg-cyan-600
          "
        >
          Done
        </button>


      </div>

    </div>
  );
};



const DetailRow = ({icon,title,value}) => (
  <div className="
    flex
    items-center
    gap-3
    border-b
    border-slate-800
    py-4
  ">

    <div className="text-cyan-400">
      {icon}
    </div>


    <div className="min-w-0">

      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p className="
max-w-[230px]
truncate
text-sm
font-semibold
text-white
">
        {value || "-"}
      </p>

    </div>

  </div>
);


export default PaymentDetailsModal;