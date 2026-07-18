import { useState } from "react";
import { X, Send, IndianRupee, Clock3, Link as LinkIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { proposalService } from "../../../services/proposalService";

const SendProposalModal = ({ gig, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [portfolioInput, setPortfolioInput] = useState("");

  const [formData, setFormData] = useState({
    coverLetter: "",
    bidAmount: "",
    estimatedDays: "",
    portfolioLinks: []
  });

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addPortfolioLink = () => {
    const clean = portfolioInput.trim();
    if (!clean) return;

    setFormData((prev) => ({
      ...prev,
      portfolioLinks: [...prev.portfolioLinks, clean]
    }));

    setPortfolioInput("");
  };

  const removePortfolioLink = (link) => {
    setFormData((prev) => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter((item) => item !== link)
    }));
  };

  const validate = () => {
    if (formData.coverLetter.trim().length < 30) {
      return "Cover letter must be at least 30 characters.";
    }

    if (!formData.bidAmount || Number(formData.bidAmount) <= 0) {
      return "Enter a valid bid amount.";
    }

    if (!formData.estimatedDays || Number(formData.estimatedDays) <= 0) {
      return "Enter valid estimated delivery days.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setLoading(true);

      await proposalService.createProposal({
        gigId: gig._id,
        coverLetter: formData.coverLetter,
        bidAmount: Number(formData.bidAmount),
        estimatedDays: Number(formData.estimatedDays),
        portfolioLinks: formData.portfolioLinks
      });

      toast.success("Proposal sent successfully!");

      await onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send proposal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-blue-950/40">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-2xl bg-white/10 p-2 text-slate-300 transition hover:bg-red-500 hover:text-white"
        >
          <X size={19} />
        </button>

        <div className="pr-12">
          <p className="text-sm font-bold text-blue-300">Send Proposal</p>
          <h2 className="mt-2 text-2xl font-black">{gig?.title}</h2>
          <p className="mt-2 text-sm text-slate-400">
            Write a clear proposal with your price, timeline, and proof of work.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Cover Letter
            </label>
            <textarea
              rows={7}
              value={formData.coverLetter}
              onChange={(e) => updateField("coverLetter", e.target.value)}
              placeholder="Explain why you're the right freelancer, your approach, and how you'll complete this project..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm outline-none transition focus:border-blue-400"
            />
            <p className="mt-2 text-xs text-slate-500">
              Minimum 30 characters. Keep it specific, not generic.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FieldIcon icon={IndianRupee}>
              <input
                type="number"
                value={formData.bidAmount}
                onChange={(e) => updateField("bidAmount", e.target.value)}
                placeholder="Bid amount"
                className="w-full bg-transparent text-sm outline-none"
              />
            </FieldIcon>

            <FieldIcon icon={Clock3}>
              <input
                type="number"
                value={formData.estimatedDays}
                onChange={(e) => updateField("estimatedDays", e.target.value)}
                placeholder="Estimated days"
                className="w-full bg-transparent text-sm outline-none"
              />
            </FieldIcon>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Portfolio Links
            </label>

            <div className="flex gap-2">
              <FieldIcon icon={LinkIcon} className="flex-1">
                <input
                  value={portfolioInput}
                  onChange={(e) => setPortfolioInput(e.target.value)}
                  placeholder="https://github.com/your-project"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </FieldIcon>

              <button
                type="button"
                onClick={addPortfolioLink}
                className="rounded-2xl bg-blue-500 px-4 text-sm font-bold transition hover:bg-blue-600"
              >
                Add
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {formData.portfolioLinks.map((link) => (
                <span
                  key={link}
                  className="inline-flex max-w-full items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300"
                >
                  <span className="truncate">{link}</span>
                  <button type="button" onClick={() => removePortfolioLink(link)}>
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Gig Budget
            </p>
            <p className="mt-2 text-lg font-black">
              ₹{gig?.budget?.min?.toLocaleString()} - ₹
              {gig?.budget?.max?.toLocaleString()}
            </p>
          </div>

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 py-4 text-sm font-black shadow-lg shadow-blue-500/25 transition hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={19} />}
            {loading ? "Sending Proposal..." : "Send Proposal"}
          </button>
        </form>
      </div>
    </div>
  );
};

const FieldIcon = ({ icon: Icon, children, className = "" }) => (
  <div
    className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 transition focus-within:border-blue-400 ${className}`}
  >
    <Icon size={18} className="text-blue-300" />
    {children}
  </div>
);

export default SendProposalModal;