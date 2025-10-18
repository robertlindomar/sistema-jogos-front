import api from "@/lib/api";
import apiPublic from "@/lib/api-public";

export interface ConviteRequest {
    curso_id: number;
    dias_validade?: number;
}

export interface Convite {
    id: number;
    token: string;
    curso: {
        id: number;
        nome: string;
    };
    criado_por: {
        id: number;
        nome: string;
    };
    expira_em: string;
    ativo: boolean;
    link: string;
    createdAt: string;
}

export interface ValidarConviteResponse {
    valido: boolean;
    curso?: {
        id: number;
        nome: string;
    };
    mensagem?: string;
}

export const conviteService = {
    async criar(data: ConviteRequest): Promise<Convite> {
        const response = await api.post("/convite", data);
        return response.data;
    },

    async validar(token: string): Promise<ValidarConviteResponse> {
        const response = await apiPublic.get(`/convite/validar/${token}`);
        return response.data;
    },

    async listarMeusConvites(): Promise<Convite[]> {
        const response = await api.get("/convite/meus-convites");
        return response.data;
    },

    async listarPorCurso(curso_id: number): Promise<Convite[]> {
        const response = await api.get(`/convite/curso/${curso_id}`);
        return response.data;
    },

    async desativar(id: number): Promise<void> {
        await api.patch(`/convite/${id}/desativar`);
    },

    async excluir(id: number): Promise<void> {
        await api.delete(`/convite/${id}`);
    },
};

