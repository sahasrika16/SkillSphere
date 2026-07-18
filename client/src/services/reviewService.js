import api from "./api";

const REVIEW_ENDPOINT = "/reviews";

export const reviewService = {
  createReview: async (payload) => {
    const { data } = await api.post(REVIEW_ENDPOINT, payload);
    return data;
  },

  getUserReviews: async (userId) => {
    const { data } = await api.get(`${REVIEW_ENDPOINT}/user/${userId}`);
    return data;
  },

  getGigReviews: async (gigId) => {
    const { data } = await api.get(`${REVIEW_ENDPOINT}/gig/${gigId}`);
    return data;
  },

  deleteReview: async (reviewId) => {
    const { data } = await api.delete(`${REVIEW_ENDPOINT}/${reviewId}`);
    return data;
  }
};