import api from "./api";

export const paymentService = {
  getPaymentHistory: async (userId) => {
    const { data } = await api.get(`/payments/history/${userId}`);
    return data;
  },
};