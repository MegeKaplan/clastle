import api from "@/lib/axios";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  createdAt?: string;
  authorName?: string;
};

export type ClubPost = {
  id: string;
  title: string;
  body: string;
  createdAt?: string;
  authorName?: string;
};

const normalizeList = <T,>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }

  return [];
};

const contentService = {
  getAnnouncements: async (clubId: string): Promise<Announcement[]> => {
    try {
      const res = await api.get(`/contents`, { params: { type: "ANNOUNCEMENT", clubId } });
      return normalizeList<Announcement>(res.data ?? []);
    } catch {
      return [];
    }
  },
  getPosts: async (clubId: string): Promise<ClubPost[]> => {
    try {
      const res = await api.get(`/contents`, { params: { type: "POST", clubId } });
      return normalizeList<ClubPost>(res.data ?? []);
    } catch {
      return [];
    }
  },
  createContent: async (data: { title?: string; body: string; type: "POST" | "ANNOUNCEMENT"; authorId: string; clubId: string }) => {
    return api.post("/contents", data);
  }
};

export default contentService;
