import { useEffect, useState } from "react";
import { gigService } from "../services/gigService";

const useGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState("");

  const fetchGigs = async (filters = {}) => {
    try {
      setLoading(true);

      const data = await gigService.getAllGigs(filters);

      setGigs(data.gigs);
      setPagination({
        total: data.total,
        page: data.page,
        pages: data.pages
      });

      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch gigs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  return {
    gigs,
    loading,
    error,
    pagination,
    fetchGigs
  };
};

export default useGigs;