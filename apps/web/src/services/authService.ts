import api from "@/lib/axios";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

const authService = {
  register: (data: RegisterData) => api.post("/auth/register", data),
  login: (data: LoginData) => api.post("/auth/login", data),
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
  }
};

export default authService