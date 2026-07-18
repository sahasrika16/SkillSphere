import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (id) => {
    try {
      setActionId(id);
      await adminService.toggleBanUser(id);
      await loadUsers();
    } catch (err) {
      console.log(err);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently? This cannot be undone.")) {
      return;
    }

    try {
      setActionId(id);
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.log(err);
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return <p className="text-slate-400">Loading users...</p>;
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-slate-400">
            <th className="py-3 pr-4">Name</th>
            <th className="py-3 pr-4">Email</th>
            <th className="py-3 pr-4">Role</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Joined</th>
            <th className="py-3 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-white/5">
              <td className="py-3 pr-4 font-semibold">{user.name}</td>
              <td className="py-3 pr-4 text-slate-300">{user.email}</td>
              <td className="py-3 pr-4 capitalize">{user.role}</td>
              <td className="py-3 pr-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    user.status === "blocked"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="py-3 pr-4 text-slate-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 pr-4">
                {user.role === "admin" ? (
                  <span className="text-slate-500 text-xs">
                    Admin protected
                  </span>
                ) : (
                  <div className="flex gap-2">
                    <button
                      disabled={actionId === user._id}
                      onClick={() => handleToggleBan(user._id)}
                      className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
                    >
                      {user.status === "blocked" ? "Unban" : "Ban"}
                    </button>
                    <button
                      disabled={actionId === user._id}
                      onClick={() => handleDelete(user._id)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p className="text-slate-400 mt-4">No users found.</p>
      )}
    </div>
  );
};

export default ManageUsers;
