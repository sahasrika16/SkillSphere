import api from "./api";

export const adminService = {
  getDashboard: async () => {
    const { data } = await api.get("/admin/dashboard");
    return data;
  },

  getUsers: async () => {
    const { data } = await api.get("/admin/users");
    return data;
  },

  toggleBanUser: async (id) => {
    const { data } = await api.patch(`/admin/users/${id}/ban`);
    return data;
  },

  deleteUser: async (id) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },

  getGigs: async () => {
    const { data } = await api.get("/admin/gigs");
    return data;
  },

  deleteGig: async (id) => {
    const { data } = await api.delete(`/admin/gigs/${id}`);
    return data;
  },

  getReviews: async () => {
    const { data } = await api.get("/admin/reviews");
    return data;
  },

  deleteReview: async (id) => {
    const { data } = await api.delete(`/admin/reviews/${id}`);
    return data;
  },
};
