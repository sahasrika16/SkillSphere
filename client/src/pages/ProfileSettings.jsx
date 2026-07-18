import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Save, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AppLayout from "../layouts/AppLayout";
import { userService } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import ProfilePicUpload from "../components/uploads/ProfilePicUpload";
import PortfolioUpload from "../components/uploads/PortfolioUpload";
import ResumeUpload from "../components/uploads/ResumeUpload";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    skills: ""
  });

  const [profileData, setProfileData] = useState({
    profilePic: "",
    portfolioImages: [],
    resumeUrl: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userService.getMyProfile();

        setForm({
          name: data.user?.name || "",
          bio: data.user?.bio || "",
          skills: data.user?.skills?.join(", ") || ""
        });

        setProfileData({
          profilePic: data.user?.profilePic || "",
          portfolioImages: data.user?.portfolioImages || [],
          resumeUrl: data.user?.resumeUrl || ""
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      const skillsArray = form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const data = await userService.updateMyProfile({
        name: form.name,
        bio: form.bio,
        skills: skillsArray
      });

      localStorage.setItem("skillsphere_user", JSON.stringify(data.user));
      toast.success("Profile updated successfully");

      setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
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
              <UserRound size={24} />
            </div>
            <h1 className="text-3xl font-black text-white">Profile Settings</h1>
          </div>

          <div className="space-y-5">
            <ProfilePicUpload
              currentPic={profileData.profilePic}
              onUploaded={(url) =>
                setProfileData((p) => ({ ...p, profilePic: url }))
              }
            />

            {user?.role === "freelancer" && (
              <>
                <ResumeUpload
                  currentResume={profileData.resumeUrl}
                  onUploaded={(url) =>
                    setProfileData((p) => ({ ...p, resumeUrl: url }))
                  }
                />

                <PortfolioUpload
                  images={profileData.portfolioImages}
                  onUploaded={(urls) =>
                    setProfileData((p) => ({
                      ...p,
                      portfolioImages: [...p.portfolioImages, ...urls]
                    }))
                  }
                  onRemove={(url) =>
                    setProfileData((p) => ({
                      ...p,
                      portfolioImages: p.portfolioImages.filter((u) => u !== url)
                    }))
                  }
                />
              </>
            )}

            <hr className="border-white/10" />

            <Input
              label="Display Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <div>
              <label className="text-sm font-bold text-slate-300">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={5}
                placeholder="Write something about yourself..."
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
              />
            </div>

            <Input
              label="Skills"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="React, Node.js, MongoDB"
            />

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.02] disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Profile
            </button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-bold text-slate-300">{label}</label>
    <input
      {...props}
      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
    />
  </div>
);

export default ProfileSettings;