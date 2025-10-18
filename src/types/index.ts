export interface Usuario {
    id: number;
    nome: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface Curso {
    id: number;
    nome: string;
    createdAt: string;
    updatedAt: string;
}

export interface Jogador {
    id: number;
    nome: string;
    rm: string;
    curso_id: number;
    curso: {
        id: number;
        nome: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Time {
    id: number;
    nome: string;
    jogador1_id: number;
    jogador2_id: number;
    suporte_id: number;
    curso_id: number;
    cadastrado_por: string;
    data_cadastro: string;
    jogador1: {
        id: number;
        nome: string;
        rm: string;
    };
    jogador2: {
        id: number;
        nome: string;
        rm: string;
    };
    suporte: {
        id: number;
        nome: string;
        rm: string;
    };
    curso: {
        id: number;
        nome: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface PaginationResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface LoginRequest {
    email: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
    user: Usuario;
}

