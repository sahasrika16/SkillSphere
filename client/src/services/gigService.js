import api from "./api";

export const gigService = {
  createGig: async (gigData) => {
    const { data } = await api.post("/gigs", gigData);
    return data;
  },

  getAllGigs: async (params = {}) => {
    const { data } = await api.get("/gigs", { params });
    return data;
  },

  getGigById: async (id) => {
    const { data } = await api.get(`/gigs/${id}`);
    return data;
  },

  getMyGigs: async () => {
    const { data } = await api.get("/gigs/my-gigs");
    return data;
  },

  updateGig: async (id, gigData) => {
    const { data } = await api.patch(`/gigs/${id}`, gigData);
    return data;
  },

  deleteGig: async (id) => {
    const { data } = await api.delete(`/gigs/${id}`);
    return data;
  },

  saveGig: async (id) => {
    const { data } = await api.patch(`/gigs/${id}/save`);
    return data;
  },

  submitWork: async (id, workData) => {
  const { data } = await api.patch(
    `/gigs/${id}/submit`,
    workData
  );
  return data;
},

  completeProject: async (id) => {
    const { data } = await api.patch(`/gigs/${id}/complete`);
    return data;
  }
};