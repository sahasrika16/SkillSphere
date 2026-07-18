import { ChevronRight, Bell, ShieldCheck, UserRound, Info, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const settingsItems = [
    {
      title: "Profile Settings",
      subtitle: "Update your profile information",
      icon: UserRound,
      path: "/settings/profile"
    },
    {
      title: "Notifications",
      subtitle: "Manage notification preferences",
      icon: Bell,
      path: "/settings/notifications"
    },
    {
      title: "Security",
      subtitle: "Change your password",
      icon: ShieldCheck,
      path: "/settings/security"
    },
    {
      title: "About SkillSphere",
      subtitle: "Version & information",
      icon: Info,
      path: "/settings/about"
    }
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">

        <h1 className="mb-8 text-4xl font-black text-white">
          Settings
        </h1>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06]">

          {settingsItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className="flex w-full items-center justify-between border-b border-white/10 px-6 py-5 transition hover:bg-white/10"
              >
                <div className="flex items-center gap-4">

                  <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-300">
                    <Icon size={22} />
                  </div>

                  <div className="text-left">
                    <p className="font-bold text-white">
                      {item.title}
                    </p>

                    <p className="text-sm text-slate-400">
                      {item.subtitle}
                    </p>
                  </div>

                </div>

                <ChevronRight className="text-slate-500" size={22} />
              </button>
            );
          })}

          <button
            onClick={logout}
            className="flex w-full items-center justify-between px-6 py-5 transition hover:bg-red-500/10"
          >
            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-red-500/10 p-3 text-red-400">
                <LogOut size={22} />
              </div>

              <p className="font-bold text-red-400">
                Logout
              </p>

            </div>

            <ChevronRight className="text-red-400" size={22} />
          </button>

        </div>

      </div>
    </AppLayout>
  );
};

export default Settings;