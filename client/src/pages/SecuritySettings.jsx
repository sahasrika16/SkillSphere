import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AppLayout from "../layouts/AppLayout";
import { userService } from "../services/userService";

const SecuritySettings = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPasswords((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = async () => {
    try {
      if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
        toast.error("Please fill all password fields");
        return;
      }

      setSaving(true);

      await userService.changePassword(passwords);

      toast.success("Password changed successfully");

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Settings
        </button>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-300">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-black">Security</h1>
              <p className="mt-1 text-sm text-slate-400">
                Update your password and keep your account protected.
              </p>
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-emerald-300">
              <Lock size={16} />
              Your account is protected using secure authentication.
            </p>
          </div>

          <div className="space-y-5">
            <PasswordInput
              label="Current Password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              show={showPasswords}
            />

            <PasswordInput
              label="New Password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              show={showPasswords}
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              show={showPasswords}
            />

            <button
              type="button"
              onClick={() => setShowPasswords((prev) => !prev)}
              className="flex items-center gap-2 text-sm font-bold text-blue-300 hover:text-blue-200"
            >
              {showPasswords ? <EyeOff size={17} /> : <Eye size={17} />}
              {showPasswords ? "Hide passwords" : "Show passwords"}
            </button>

            <button
              onClick={handlePasswordChange}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.02] disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <ShieldCheck size={18} />
              )}
              Update Password
            </button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

const PasswordInput = ({ label, show, ...props }) => (
  <div>
    <label className="text-sm font-bold text-slate-300">{label}</label>

    <input
      {...props}
      type={show ? "text" : "password"}
      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
    />
  </div>
);

export default SecuritySettings;