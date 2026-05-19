import { create } from "zustand";

interface AuthData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthState {
  data: AuthData;
  setData: (newData: Partial<AuthData>) => void;
  resetData: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  data: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" },
  setData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
  resetData: () => set({ data: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" } }),
}));

export default useAuthStore;