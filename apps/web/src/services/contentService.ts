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
  content: string;
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
  getAnnouncements: async (): Promise<Announcement[]> => {
    try {
      const res = await api.get("/clubs/current/announcements");
      return normalizeList<Announcement>(res.data?.announcements ?? res.data);
    } catch {
      return [];
    }
  },
  getPosts: async (): Promise<ClubPost[]> => {
    try {
      const res = await api.get("/clubs/current/posts");
      return normalizeList<ClubPost>(res.data?.posts ?? res.data);
    } catch {
      return [];
    }
  },
};

export default contentService;
