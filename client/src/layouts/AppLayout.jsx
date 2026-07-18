import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  FolderKanban,
  Home,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  Sparkles,
  UserRound,
  FileText,
  CreditCard,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { notificationService } from "../services/notificationService";

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const auth = useAuth();

  const user = auth.user || auth.currentUser;
  const logout = auth.logout || auth.handleLogout;
  const role = user?.role;

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem("skillsphere_token");
    localStorage.removeItem("skillsphere_user");
    navigate("/login");
  };

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.log(err);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      loadNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },

    ...(role === "admin"
      ? [
          {
            label: "Admin",
            path: "/admin",
            icon: Sparkles,
          },
        ]
      : []),

    {
      label: "Gigs",
      path: "/gigs",
      icon: BriefcaseBusiness,
    },

    ...(role === "client"
      ? [
          {
            label: "My Gigs",
            path: "/my-gigs",
            icon: FolderKanban,
          },
        ]
      : []),

    ...(role === "freelancer"
      ? [
          {
            label: "My Proposals",
            path: "/my-proposals",
            icon: FileText,
          },
        ]
      : []),

    // NEW PAYMENT PAGE
    {
      label: "Payments",
      path: "/payments",
      icon: CreditCard,
    },

    {
      label: "Messages",
      path: "/messages",
      icon: MessageCircle,
    },

    {
      label: "Profile",
      path: "/profile",
      icon: UserRound,
    },

    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[250px] flex-col overflow-hidden border-r border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg shadow-blue-500/20">
            <Sparkles size={28} />
          </div>

          <div>
            <h1 className="text-xl font-black">SkillSphere</h1>
            <p className="text-sm text-slate-400">Hyperlocal freelance hub</p>
          </div>
        </div>

        <div className="mt-10 mb-3 px-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            MAIN MENU
          </p>
        </div>

        <nav className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-2 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 border border-blue-400/30 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-300 hover:bg-white/10 hover:text-white hover:translate-x-1"
                  }`
                }
              >
                <Icon size={21} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-5 rounded-3xl border border-white/10 bg-slate-800/60 p-3 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="flex w-full items-center gap-3 text-left"
          >
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 font-black">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user?.name || "User"}</p>
              <p className="capitalize text-sm text-slate-400">
                {role || "member"}
              </p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 text-sm font-black text-white transition hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="lg:pl-[250px]">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 px-5 py-5 backdrop-blur-xl lg:px-8">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-sm text-slate-400">
                Good Evening 👋
              </p>

              <h2 className="text-2xl font-bold">
                Welcome back, {user?.name || "User"}
              </h2>
            </div>

            <div className="hidden max-w-xl flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 md:flex">
              <Search size={19} className="text-slate-500" />
              <input
                placeholder="Search gigs, freelancers, skills..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.07] p-3 transition-all duration-200 hover:bg-white/[0.12] hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <Bell size={20} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-96 max-w-[90vw] overflow-hidden origin-top-right animate-[dropdown_0.22s_ease-out] rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40 z-50">
                    <div className="flex items-center justify-between border-b border-white/10 p-3">
                      <h2 className="font-black">
                        Notifications
                      </h2>

                      <button
                        onClick={markAllRead}
                        className="text-sm text-blue-400"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto overflow-x-hidden scrollbar-thin">
                      {notifications.length === 0 ? (
                        <p className="p-6 text-center text-slate-400">
                          No notifications
                        </p>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item._id}
                            className="group relative border-b border-white/5 p-3 hover:bg-white/5"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(item._id);
                              }}
                              className="absolute right-3 top-3 rounded-lg p-1 text-slate-500 opacity-0 transition hover:bg-white/10 hover:text-red-400 group-hover:opacity-100"
                              aria-label="Delete notification"
                            >
                              <X size={16} />
                            </button>

                            <p className="pr-6 font-bold break-words">
                              {item.title}
                            </p>

                            <p className="mt-1 pr-6 text-sm text-slate-400 break-words whitespace-normal overflow-hidden">
                              {item.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 transition hover:bg-white/[0.12] sm:flex"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 font-black">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="hidden text-left md:block">
                    <p className="max-w-[120px] truncate text-sm font-black">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs capitalize text-slate-400">
                      {role || "member"}
                    </p>
                  </div>

                  <ChevronDown size={16} className="text-slate-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-14 z-50 w-60 rounded-3xl border border-white/10 bg-slate-900 p-3 shadow-2xl shadow-black/40">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/profile");
                      }}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/10"
                    >
                      <UserRound size={18} className="text-blue-300" />
                      My Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/settings");
                      }}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/10"
                    >
                      <Settings size={18} className="text-violet-300" />
                      Settings
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center gap-3 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500 hover:text-white"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;