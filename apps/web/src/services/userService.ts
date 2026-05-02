import api from "@/lib/axios";

type UserRole = "SUPERADMIN" | "ADMIN" | "USER";

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  onboardingCompleted?: boolean;
}

const userService = {
  getUsers: () => api.get("/users"),
  createUser: (data: CreateUserData) => api.post("/users", data),
  approveUser: (userId: string) => api.post(`/users/${userId}/approve`),
  rejectUser: (userId: string) => api.post(`/users/${userId}/reject`),
  updateUser: (userId: string, data: Partial<CreateUserData>) => api.patch(`/users/${userId}`, data),
  deleteUser: (userId: string) => api.delete(`/users/${userId}`),
};

export default userService;
