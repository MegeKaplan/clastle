import api from "@/lib/axios";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  createdAt?: string;
  authorName?: string;
  authorId?: string;
};

export type ClubPost = {
  id: string;
  title: string;
  body: string;
  createdAt?: string;
  authorName?: string;
  authorId?: string;
};

type ContentQuery = {
  authorId?: string;
  clubId?: string;
  type?: "POST" | "ANNOUNCEMENT";
  sortBy?: "createdAt" | "email";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

const normalizeList = <T,>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }

  return [];
};

const fetchContents = async <T,>(params: ContentQuery): Promise<T[]> => {
  try {
    const res = await api.get("/contents", { params });
    return normalizeList<T>(res.data ?? []);
  } catch {
    return [];
  }
};

const contentService = {
  getAnnouncements: async (clubId: string): Promise<Announcement[]> => {
    return fetchContents<Announcement>({ type: "ANNOUNCEMENT", clubId, sortBy: "createdAt", sortOrder: "desc" });
  },
  getPosts: async (clubId: string): Promise<ClubPost[]> => {
    return fetchContents<ClubPost>({ type: "POST", clubId, sortBy: "createdAt", sortOrder: "desc" });
  },
  getAnnouncementsByAuthor: async (authorId: string): Promise<Announcement[]> => {
    return fetchContents<Announcement>({
      type: "ANNOUNCEMENT",
      authorId,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  },
  getPostsByAuthor: async (authorId: string): Promise<ClubPost[]> => {
    return fetchContents<ClubPost>({
      type: "POST",
      authorId,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  },
  createContent: async (data: { title?: string; body: string; type: "POST" | "ANNOUNCEMENT"; authorId: string; clubId: string }) => {
    return api.post("/contents", data);
  }
  ,
  getContent: async <T,>(id: string): Promise<T | null> => {
    try {
      const res = await api.get(`/contents/${id}`);
      // Normalize response shapes: some endpoints return `{ data: item }`, others return item directly.
      const payload = res.data as any;
      if (payload == null) return null;
      return (payload.data ?? payload) as T;
    } catch {
      return null;
    }
  },
  updateContent: async (id: string, data: { title?: string; body?: string; expiresAt?: string | null; visibility?: string }) => {
    return api.patch(`/contents/${id}`, data);
  }
};

export default contentService;
