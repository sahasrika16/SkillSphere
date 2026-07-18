import api from "./api";

const USER_ENDPOINT = "/users";

export const userService = {
  getMyProfile: async () => {
    const { data } = await api.get(`${USER_ENDPOINT}/me`);
    return data;
  },

  updateMyProfile: async (payload) => {
    const { data } = await api.patch(`${USER_ENDPOINT}/me`, payload);
    return data;
  },

  changePassword: async (payload) => {
    const { data } = await api.patch(
      `${USER_ENDPOINT}/change-password`,
      payload
    );
    return data;
  },

  getUserProfile: async (userId) => {
  const { data } = await api.get(`${USER_ENDPOINT}/${userId}`);
  return data;
},

getAllUsers: async () => {
  const { data } = await api.get(USER_ENDPOINT);
  return data;
}
};