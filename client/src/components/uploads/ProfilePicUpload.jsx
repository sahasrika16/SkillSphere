import { useState } from "react";
import { Camera, Loader2, UserRound } from "lucide-react";
import { uploadFile } from "../../utils/uploadFile";

export default function ProfilePicUpload({ currentPic, onUploaded }) {
  const [preview, setPreview] = useState(currentPic || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      const data = await uploadFile("profile-pic", "profilePic", file);
      setPreview(data.url);
      onUploaded(data.url);
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="text-sm font-bold text-slate-300">Profile Picture</label>

      <div className="mt-2 flex items-center gap-5 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {preview ? (
            <img src={preview} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-slate-500">
              <UserRound size={28} />
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 grid place-items-center bg-black/50">
              <Loader2 className="animate-spin text-white" size={20} />
            </div>
          )}
        </div>

        <div className="flex-1">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/[0.13]">
            <Camera size={16} />
            {preview ? "Change Photo" : "Upload Photo"}
            <input type="file" accept="image/*" onChange={handleChange} disabled={loading} className="hidden" />
          </label>

          <p className="mt-2 text-xs text-slate-500">JPG, PNG or WEBP. Max 5MB.</p>
          {error && <p className="mt-1 text-xs font-semibold text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}