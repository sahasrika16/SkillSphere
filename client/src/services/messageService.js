import api from "./api";

const MESSAGE_ENDPOINT = "/messages";

export const messageService = {
  startConversation: async (payload) => {
    const { data } = await api.post(`${MESSAGE_ENDPOINT}/start`, payload);
    return data;
  },

  sendMessage: async (payload) => {
    const { data } = await api.post(`${MESSAGE_ENDPOINT}/send`, payload);
    return data;
  },

  getMyChats: async () => {
    const { data } = await api.get(`${MESSAGE_ENDPOINT}/my-chats`);
    return data;
  },

  getMessages: async (conversationId) => {
    const { data } = await api.get(`${MESSAGE_ENDPOINT}/${conversationId}`);
    return data;
  },

  markAsRead: async (conversationId) => {
    const { data } = await api.patch(
      `${MESSAGE_ENDPOINT}/${conversationId}/read`
    );
    return data;
  },

  deleteConversation: async (conversationId) => {
    const { data } = await api.delete(
      `${MESSAGE_ENDPOINT}/${conversationId}`
    );
    return data;
  }
};