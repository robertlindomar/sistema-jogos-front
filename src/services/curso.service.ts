import api from "@/lib/api";
import { Curso, PaginationResponse } from "@/types";

export const cursoService = {
  getAll: async (): Promise<Curso[]> => {
    const response = await api.get("/curso/all");
    return response.data;
  },

  getPaginated: async (params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginationResponse<Curso>> => {
    const response = await api.get("/curso", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Curso> => {
    const response = await api.get(`/curso/${id}`);
    return response.data;
  },

  create: async (data: { nome: string }): Promise<Curso> => {
    const response = await api.post("/curso", data);
    return response.data;
  },

  update: async (id: number, data: { nome: string }): Promise<Curso> => {
    const response = await api.put(`/curso/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/curso/${id}`);
  },
};

