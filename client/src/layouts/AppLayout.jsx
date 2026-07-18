import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
  X,
  Menu,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { notificationService } from "../services/notificationService";

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const user = auth.user || auth.currentUser;
  const logout = auth.logout || auth.handleLogout;
  const role = user?.role;

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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

  // Close mobile sidebar / dropdowns whenever route changes
  useEffect(() => {
    setShowMobileMenu(false);
    setShowNotifications(false);
    setShowProfileMenu(false);
    setShowMobileSearch(false);
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const closeAll = (e) => {
      if (!e.target.closest("[data-dropdown]")) {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", closeAll);
    return () => document.removeEventListener("click", closeAll);
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: Home },
    ...(role === "admin" ? [{ label: "Admin", path: "/admin", icon: Sparkles }] : []),
    { label: "Gigs", path: "/gigs", icon: BriefcaseBusiness },
    ...(role === "client" ? [{ label: "My Gigs", path: "/my-gigs", icon: FolderKanban }] : []),
    ...(role === "freelancer" ? [{ label: "My Proposals", path: "/my-proposals", icon: FileText }] : []),
    { label: "Payments", path: "/payments", icon: CreditCard },
    { label: "Messages", path: "/messages", icon: MessageCircle },
    { label: "Profile", path: "/profile", icon: UserRound },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile overlay */}
      {showMobileMenu && (
        <div
          onClick={() => setShowMobileMenu(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex
          h-screen w-[80vw] max-w-[280px] flex-col
          overflow-hidden border-r border-white/10
          bg-slate-900/95 p-5 backdrop-blur-xl
          transition-transform duration-300
          sm:p-6
          lg:w-[250px] lg:translate-x-0
          ${showMobileMenu ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg shadow-blue-500/20">
              <Sparkles size={22} />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black sm:text-xl">SkillSphere</h1>
              <p className="truncate text-xs text-slate-400 sm:text-sm">Hyperlocal freelance hub</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowMobileMenu(false)}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-8 mb-3 px-2 sm:mt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Main Menu
          </p>
        </div>

        <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setShowMobileMenu(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "border border-blue-400/30 bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-300 hover:translate-x-1 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-4 shrink-0 rounded-3xl border border-white/10 bg-slate-800/60 p-3 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="flex w-full items-center gap-3 text-left"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 font-black">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user?.name || "User"}</p>
              <p className="truncate text-sm capitalize text-slate-400">{role || "member"}</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-2.5 text-sm font-black text-white transition hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-xl sm:px-5 lg:pl-[calc(250px+2rem)] lg:pr-8">
        <div className="flex items-center justify-between gap-3 sm:gap-5">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setShowMobileMenu(true)}
            className="shrink-0 rounded-xl border border-white/10 bg-white/10 p-2.5 transition hover:bg-white/20 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Welcome text - hidden on very small screens when search is open */}
          <div className={`min-w-0 flex-1 ${showMobileSearch ? "hidden sm:block" : "block"}`}>
            <p className="hidden text-sm text-slate-400 sm:block">Good Evening 👋</p>
            <h2 className="truncate text-lg font-bold sm:text-2xl">
              {user?.name ? `Welcome back, ${user.name}` : "Welcome back"}
            </h2>
          </div>

          {/* Desktop search */}
          <div className="hidden max-w-xl flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 md:flex">
            <Search size={19} className="shrink-0 text-slate-500" />
            <input
              type="text"
              placeholder="Search gigs, freelancers, skills..."
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Mobile search toggle */}
          <button
            type="button"
            onClick={() => setShowMobileSearch((prev) => !prev)}
            className="shrink-0 rounded-xl border border-white/10 bg-white/10 p-2.5 transition hover:bg-white/20 md:hidden"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative" data-dropdown>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications((prev) => !prev);
                  setShowProfileMenu(false);
                }}
                className="relative rounded-2xl border border-white/10 bg-white/[0.07] p-2.5 transition-all duration-200 hover:scale-105 hover:bg-white/[0.12] hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 sm:p-3"
                aria-label="Notifications"
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="fixed inset-x-3 top-[70px] z-50 overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-96">
                  <div className="flex items-center justify-between border-b border-white/10 p-3">
                    <h2 className="font-black">Notifications</h2>
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto overflow-x-hidden scrollbar-thin">
                    {notifications.length === 0 ? (
                      <p className="p-6 text-center text-slate-400">No notifications</p>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item._id}
                          className="group relative border-b border-white/5 p-4 transition hover:bg-white/5"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(item._id);
                            }}
                            className="absolute right-3 top-3 rounded-lg p-1 text-slate-500 opacity-0 transition hover:bg-white/10 hover:text-red-400 group-hover:opacity-100 sm:opacity-0"
                            aria-label="Delete notification"
                          >
                            <X size={16} />
                          </button>
                          <p className="break-words pr-6 font-bold">{item.title}</p>
                          <p className="mt-1 whitespace-pre-wrap break-words pr-6 text-sm text-slate-400">
                            {item.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" data-dropdown>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu((prev) => !prev);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-2.5 py-2.5 transition hover:bg-white/[0.12] sm:px-4 sm:py-3"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 font-black sm:h-10 sm:w-10">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="hidden text-left md:block">
                  <p className="max-w-[120px] truncate text-sm font-black">{user?.name || "User"}</p>
                  <p className="text-xs capitalize text-slate-400">{role || "member"}</p>
                </div>

                <ChevronDown
                  size={16}
                  className={`hidden text-slate-400 transition-transform sm:block ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showProfileMenu && (
                <div className="fixed inset-x-3 top-[70px] z-50 rounded-3xl border border-white/10 bg-slate-900 p-3 shadow-2xl shadow-black/40 sm:absolute sm:inset-x-auto sm:right-0 sm:top-14 sm:w-60">
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
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
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

        {/* Mobile search bar (expands below header row) */}
        {showMobileSearch && (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 md:hidden">
            <Search size={18} className="shrink-0 text-slate-500" />
            <input
              type="text"
              autoFocus
              placeholder="Search gigs, freelancers, skills..."
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="lg:pl-[250px]">
        <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
