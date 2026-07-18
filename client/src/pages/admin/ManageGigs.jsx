import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";

const ManageGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getGigs();
      setGigs(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gig permanently? This cannot be undone.")) {
      return;
    }

    try {
      setActionId(id);
      await adminService.deleteGig(id);
      setGigs((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.log(err);
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return <p className="text-slate-400">Loading gigs...</p>;
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Gigs</h2>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-slate-400">
            <th className="py-3 pr-4">Title</th>
            <th className="py-3 pr-4">Client</th>
            <th className="py-3 pr-4">Category</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Budget</th>
            <th className="py-3 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {gigs.map((gig) => (
            <tr key={gig._id} className="border-b border-white/5">
              <td className="py-3 pr-4 font-semibold max-w-xs truncate">
                {gig.title}
              </td>
              <td className="py-3 pr-4 text-slate-300">
                {gig.client?.name || "—"}
              </td>
              <td className="py-3 pr-4 capitalize">{gig.category}</td>
              <td className="py-3 pr-4">
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400 capitalize">
                  {gig.status}
                </span>
              </td>
              <td className="py-3 pr-4 text-slate-400">
                ₹{gig.budget?.min}–₹{gig.budget?.max}
              </td>
              <td className="py-3 pr-4">
                <button
                  disabled={actionId === gig._id}
                  onClick={() => handleDelete(gig._id)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {gigs.length === 0 && (
        <p className="text-slate-400 mt-4">No gigs found.</p>
      )}
    </div>
  );
};

export default ManageGigs;
