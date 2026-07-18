import { useEffect, useState } from "react";
import { ArrowLeft, Bell, Loader2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AppLayout from "../layouts/AppLayout";

const NotificationSettings = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    messageNotifications: true,
    proposalNotifications: true,
    reviewNotifications: true
  });

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("skillsphere_settings")) || {};

    setSettings({
      emailNotifications: saved.emailNotifications ?? true,
      messageNotifications: saved.messageNotifications ?? true,
      proposalNotifications: saved.proposalNotifications ?? true,
      reviewNotifications: saved.reviewNotifications ?? true
    });

    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSave = () => {
    const old =
      JSON.parse(localStorage.getItem("skillsphere_settings")) || {};

    localStorage.setItem(
      "skillsphere_settings",
      JSON.stringify({
        ...old,
        ...settings
      })
    );

    toast.success("Notification settings updated");
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="grid min-h-[70vh] place-items-center">
          <Loader2 className="animate-spin text-blue-300" size={36} />
        </div>
      </AppLayout>
    );
  }

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
              <Bell size={24} />
            </div>

            <h1 className="text-3xl font-black">
              Notification Settings
            </h1>
          </div>

          <div className="space-y-4">

            <Toggle
              label="Email Notifications"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
            />

            <Toggle
              label="Message Notifications"
              name="messageNotifications"
              checked={settings.messageNotifications}
              onChange={handleChange}
            />

            <Toggle
              label="Proposal Notifications"
              name="proposalNotifications"
              checked={settings.proposalNotifications}
              onChange={handleChange}
            />

            <Toggle
              label="Review Notifications"
              name="reviewNotifications"
              checked={settings.reviewNotifications}
              onChange={handleChange}
            />

            <button
              onClick={handleSave}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 py-3 font-black text-white"
            >
              <Save size={18} />
              Save Changes
            </button>

          </div>

        </section>

      </div>
    </AppLayout>
  );
};

const Toggle = ({ label, ...props }) => (
  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-4">
    <span className="font-bold text-slate-300">
      {label}
    </span>

    <input
      type="checkbox"
      className="h-5 w-5 accent-blue-500"
      {...props}
    />
  </label>
);

export default NotificationSettings;