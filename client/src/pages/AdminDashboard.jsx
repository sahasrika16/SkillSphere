import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { adminService } from "../services/adminService";

const AdminDashboard = () => {
  const location = useLocation();
  const isRootAdmin = location.pathname === "/admin";

  const [stats, setStats] = useState({
    users: 0,
    gigs: 0,
    activeProjects: 0,
    reviews: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (isRootAdmin) {
      loadDashboard();
    }
  }, [isRootAdmin]);

  const loadDashboard = async () => {
    try {
      const data = await adminService.getDashboard();

      setStats({
        users: data.totalUsers,
        gigs: data.totalGigs,
        activeProjects: data.activeProjects,
        reviews: data.totalReviews,
        revenue: data.totalRevenue,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const formatRevenue = (value) => {
    const num = value || 0;
    let formatted;

    if (num >= 10000000) {
      formatted = `${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      formatted = `${(num / 100000).toFixed(2)} L`;
    } else if (num >= 1000) {
      formatted = `${(num / 1000).toFixed(1)}K`;
    } else {
      formatted = num.toString();
    }

    return formatted;
  };

  const revenueFormatted = formatRevenue(stats.revenue);

  const tabs = [
    { label: "Overview", path: "/admin" },
    { label: "Manage Users", path: "/admin/users" },
    { label: "Manage Gigs", path: "/admin/gigs" },
    { label: "Manage Reviews", path: "/admin/reviews" },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-black mb-6">Admin Dashboard</h1>

        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === "/admin"}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        {isRootAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            <div className="bg-slate-800 rounded-2xl p-6">
              <h2>Total Users</h2>
              <p className="text-3xl font-bold mt-3">{stats.users}</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6">
              <h2>Total Gigs</h2>
              <p className="text-3xl font-bold mt-3">{stats.gigs}</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6">
              <h2>Active Projects</h2>
              <p className="text-3xl font-bold mt-3">
                {stats.activeProjects}
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6">
              <h2>Total Reviews</h2>
              <p className="text-3xl font-bold mt-3">{stats.reviews}</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 min-w-0 overflow-hidden">
              <h2>Total Revenue</h2>
              <p
                className="text-3xl font-bold mt-3 truncate"
                title={`₹${new Intl.NumberFormat("en-IN").format(stats.revenue || 0)}`}
              >
                ₹{revenueFormatted}
              </p>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;