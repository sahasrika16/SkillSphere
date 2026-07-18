import { useState } from "react";
import {
  FileText,
  Loader2,
  Upload,
  ExternalLink,
} from "lucide-react";
import { uploadFile } from "../../utils/uploadFile";

export default function ResumeUpload({
  currentResume,
  onUploaded,
}) {
  const [resumeUrl, setResumeUrl] = useState(currentResume || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setLoading(true);

    try {
      const data = await uploadFile("resume", "resume", file);

      setResumeUrl(data.url);
      onUploaded(data.url);
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="text-sm font-bold text-slate-300">
        Resume
      </label>

      <div className="mt-2 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-300">
            <FileText size={20} />
          </div>

          <div className="min-w-0">
            {resumeUrl ? (
              <a
                 href={`https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=true`}
  target="_blank"
  rel="noopener noreferrer"
                className="flex items-center gap-1 truncate text-sm font-bold text-blue-300 hover:text-blue-200"
              >
                View current resume
                <ExternalLink size={13} />
              </a>
            ) : (
              <p className="text-sm text-slate-500">
                No resume uploaded yet
              </p>
            )}

            <p className="mt-1 text-xs text-slate-500">
              PDF only. Max 20MB.
            </p>
          </div>
        </div>

        <label className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/[0.13]">
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Upload size={16} />
          )}

          {resumeUrl ? "Replace" : "Upload"}

          <input
            type="file"
            accept=".pdf"
            onChange={handleChange}
            disabled={loading}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <p className="mt-1 text-xs font-semibold text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}