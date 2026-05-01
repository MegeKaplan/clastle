import api from "@/lib/axios";

const clubService = {
  getClubs: () => api.get("/clubs"),
  joinClub: (clubId: string) => api.post(`/clubs/${clubId}/join`),
  leaveClub: (clubId: string) => api.post(`/clubs/${clubId}/leave`),
};

export default clubService;
