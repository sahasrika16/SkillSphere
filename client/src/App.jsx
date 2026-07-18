  import { Navigate, Route, Routes } from "react-router-dom";
  import { useAuth } from "./context/AuthContext";

  import Login from "./pages/Login";
  import Register from "./pages/Register";
  import Dashboard from "./pages/Dashboard";
  import Gigs from "./pages/Gigs";
  import CreateGig from "./pages/CreateGig";
  import GigDetails from "./pages/GigDetails";
  import MyGigs from "./pages/MyGigs";
  import MyProposals from "./pages/MyProposals";
  import GigProposals from "./pages/GigProposals";
  import Messages from "./pages/Messages";
  import Profile from "./pages/Profile";
  import Settings from "./pages/Settings";
  import ProfileSettings from "./pages/ProfileSettings";
  import NotificationSettings from "./pages/NotificationSettings";
  import SecuritySettings from "./pages/SecuritySettings";
  import About from "./pages/About";
  import AdminDashboard from "./pages/AdminDashboard";
  import ManageUsers from "./pages/admin/ManageUsers";
  import ManageGigs from "./pages/admin/ManageGigs";
  import ManageReviews from "./pages/admin/ManageReviews";
  import PublicProfile from "./pages/PublicProfile";
  
  import Payments from "./pages/Payments";
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, authLoading } = useAuth();

    if (authLoading) {
      return (
        <div className="grid min-h-screen place-items-center bg-slate-950 text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <p className="text-sm text-slate-400">
              Loading SkillSphere...
            </p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  const AdminRoute = ({ children }) => {
    const { user, authLoading } = useAuth();

    if (authLoading) {
      return (
        <div className="grid min-h-screen place-items-center bg-slate-950 text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <p className="text-sm text-slate-400">
              Loading SkillSphere...
            </p>
          </div>
        </div>
      );
    }

    if (!user || user.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  function App() {
    return (
      <Routes>

  <Route path="/" element={<Login />} />

  <Route path="/login" element={<Login />} />

  <Route path="/register" element={<Register />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

        <Route
          path="/gigs"
          element={
            <ProtectedRoute>
              <Gigs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gigs/create"
          element={
            <ProtectedRoute>
              <CreateGig />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gigs/:id"
          element={
            <ProtectedRoute>
              <GigDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-gigs"
          element={
            <ProtectedRoute>
              <MyGigs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-proposals"
          element={
            <ProtectedRoute>
              <MyProposals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gigs/:id/proposals"
          element={
            <ProtectedRoute>
              <GigProposals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/profile"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/notifications"
          element={
            <ProtectedRoute>
              <NotificationSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/security"
          element={
            <ProtectedRoute>
              <SecuritySettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
  <Route
    path="/users/:userId"
    element={
      <ProtectedRoute>
        <PublicProfile />
      </ProtectedRoute>
    }
  />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route path="users" element={<ManageUsers />} />
          <Route path="gigs" element={<ManageGigs />} />
          <Route path="reviews" element={<ManageReviews />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
        
<Route
  path="/payments"
  element={
    <ProtectedRoute>
      <Payments />
    </ProtectedRoute>
  }
/>
      </Routes>
    );
  }

  export default App;
