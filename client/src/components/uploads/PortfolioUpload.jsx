import { useState } from "react";
import { Images, Loader2, Plus, X } from "lucide-react";
import { uploadFile } from "../../utils/uploadFile";

export default function PortfolioUpload({ images = [], onUploaded, onRemove }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setError("");
    setLoading(true);
    try {
      const data = await uploadFile("portfolio", "portfolioImages", files);
      onUploaded(data.urls);
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="text-sm font-bold text-slate-300">Portfolio</label>

      <div className="mt-2 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
        {images.length === 0 && !loading && (
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
            <Images size={16} />
            No portfolio images yet
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div
              key={i}
              className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10"
            >
              <img src={url} alt={`Portfolio ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
              >
                <X size={13} />
              </button>
            </div>
          ))}

          <label className="grid h-24 w-24 shrink-0 cursor-pointer place-items-center rounded-xl border border-dashed border-white/20 bg-white/[0.04] text-slate-400 transition hover:border-blue-400/40 hover:text-blue-300">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={22} />}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleChange}
              disabled={loading}
              className="hidden"
            />
          </label>
        </div>

        <p className="mt-3 text-xs text-slate-500">Up to 10 images. JPG, PNG or WEBP. Max 5MB each.</p>
        {error && <p className="mt-1 text-xs font-semibold text-red-400">{error}</p>}
      </div>
    </div>
  );
}