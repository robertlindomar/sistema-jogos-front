import api from "@/lib/api";
import { Jogador, PaginationResponse } from "@/types";

export const jogadorService = {
  getPaginated: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    curso_id?: number;
  }): Promise<PaginationResponse<Jogador>> => {
    const response = await api.get("/jogador", { params });
    return response.data;
  },

  getByCurso: async (cursoId: number): Promise<Jogador[]> => {
    const response = await api.get(`/jogador/curso/${cursoId}`);
    return response.data;
  },

  getById: async (id: number): Promise<Jogador> => {
    const response = await api.get(`/jogador/${id}`);
    return response.data;
  },

  create: async (data: {
    nome: string;
    rm: string;
    curso_id: number;
  }): Promise<Jogador> => {
    const response = await api.post("/jogador", data);
    return response.data;
  },

  update: async (
    id: number,
    data: {
      nome?: string;
      rm?: string;
      curso_id?: number;
    }
  ): Promise<Jogador> => {
    const response = await api.put(`/jogador/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/jogador/${id}`);
  },
};

