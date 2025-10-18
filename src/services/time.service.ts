import api from "@/lib/api";
import { Time, PaginationResponse } from "@/types";

export const timeService = {
  getPaginated: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    curso_id?: number;
  }): Promise<PaginationResponse<Time>> => {
    const response = await api.get("/time", { params });
    return response.data;
  },

  getByCurso: async (cursoId: number): Promise<Time[]> => {
    const response = await api.get(`/time/curso/${cursoId}`);
    return response.data;
  },

  getById: async (id: number): Promise<Time> => {
    const response = await api.get(`/time/${id}`);
    return response.data;
  },

  create: async (data: {
    nome: string;
    jogador1_id: number;
    jogador2_id: number;
    suporte_id: number;
    curso_id: number;
    cadastrado_por: string;
  }): Promise<Time> => {
    const response = await api.post("/time", data);
    return response.data;
  },

  update: async (
    id: number,
    data: {
      nome?: string;
      jogador1_id?: number;
      jogador2_id?: number;
      suporte_id?: number;
    }
  ): Promise<Time> => {
    const response = await api.put(`/time/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/time/${id}`);
  },
};

