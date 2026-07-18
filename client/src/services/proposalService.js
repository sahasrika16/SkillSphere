import api from "./api";

const PROPOSAL_ENDPOINT = "/proposals";

export const proposalService = {
  createProposal: async (proposalData) => {
    const { data } = await api.post(PROPOSAL_ENDPOINT, proposalData);
    return data;
  },

  getMyProposals: async () => {
    const { data } = await api.get(`${PROPOSAL_ENDPOINT}/my-proposals`);
    return data;
  },

  getGigProposals: async (gigId) => {
    const { data } = await api.get(`${PROPOSAL_ENDPOINT}/gig/${gigId}`);
    return data;
  },

  updateProposalStatus: async (proposalId, statusData) => {
    const { data } = await api.patch(
      `${PROPOSAL_ENDPOINT}/${proposalId}/status`,
      statusData
    );
    return data;
  },

  withdrawProposal: async (proposalId) => {
    const { data } = await api.patch(
      `${PROPOSAL_ENDPOINT}/${proposalId}/withdraw`
    );
    return data;
  },

  submitWork: async (proposalId, workData) => {
    const { data } = await api.patch(
      `${PROPOSAL_ENDPOINT}/${proposalId}/submit`,
      workData
    );
    return data;
  }
};