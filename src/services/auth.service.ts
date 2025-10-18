import api from "@/lib/api";
import { LoginRequest, LoginResponse, Usuario } from "@/types";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  getMe: async (): Promise<Usuario> => {
    const response = await api.get("/usuario/me");
    return response.data;
  },

  isAuthenticated: (): boolean => {
    if (typeof document !== 'undefined') {
      return !!document.cookie.includes('token=');
    }
    return false;
  },

  logout: (): void => {
    // Remover cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
};

