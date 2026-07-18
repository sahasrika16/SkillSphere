import api from "./api";

const NOTIFICATION_ENDPOINT = "/notifications";

export const notificationService = {
  getMyNotifications: async () => {
    const { data } = await api.get(NOTIFICATION_ENDPOINT);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await api.patch(`${NOTIFICATION_ENDPOINT}/read-all`);
    return data;
  },

  deleteNotification: async (notificationId) => {
    const { data } = await api.delete(
      `${NOTIFICATION_ENDPOINT}/${notificationId}`
    );
    return data;
  }
};