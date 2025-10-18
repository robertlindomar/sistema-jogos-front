"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { conviteService } from "@/services/convite.service";
import apiPublic from "@/lib/api-public";
import { useToast } from "@/hooks/use-toast";
import { Users, Trophy, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Etapa = "validando" | "escolha" | "fluxo-completo" | "jogador" | "time" | "sucesso";

interface Jogador {
    id: number;
    nome: string;
    rm: string;
}

interface JogadorTemp {
    nome: string;
    rm: string;
}

export default function ConvitePage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const token = params.token as string;

    const [etapa, setEtapa] = useState<Etapa>("validando");
    const [curso, setCurso] = useState<{ id: number; nome: string } | null>(null);
    const [jogadorCriado, setJogadorCriado] = useState<any>(null);

    // Para fluxo completo
    const [etapaFluxo, setEtapaFluxo] = useState<1 | 2 | 3 | 4>(1); // 1=jogador1, 2=jogador2, 3=suporte, 4=time
    const [jogadoresTemp, setJogadoresTemp] = useState<JogadorTemp[]>([]);
    const [jogadoresCriados, setJogadoresCriados] = useState<Jogador[]>([]);

    const [jogadorForm, setJogadorForm] = useState({
        nome: "",
        rm: "",
    });

    const [timeForm, setTimeForm] = useState({
        nome: "",
        jogador1_id: "",
        jogador2_id: "",
        suporte_id: "",
        cadastrado_por: "",
    });

    // Validar convite
    const { data: validacao, isLoading: validandoConvite } = useQuery({
        queryKey: ["convite", "validar", token],
        queryFn: () => conviteService.validar(token),
        enabled: !!token,
    });

    // Buscar jogadores do curso via rota pública
    const { data: jogadoresDoCurso } = useQuery<Jogador[]>({
        queryKey: ["jogadores", "curso", token],
        queryFn: async () => {
            const response = await apiPublic.get(`/convite/public/jogadores/${token}`);
            return response.data;
        },
        enabled: !!token && !!curso,
    });

    useEffect(() => {
        if (validacao) {
            if (validacao.valido && validacao.curso) {
                setCurso(validacao.curso);
                setEtapa("escolha");
            } else {
                setEtapa("validando");
            }
        }
    }, [validacao]);

    const criarJogadorMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await apiPublic.post("/convite/public/jogador", {
                ...data,
                token: token
            });
            return response.data;
        },
        onSuccess: (data) => {
            setJogadorCriado(data);
            toast({
                title: "Jogador cadastrado!",
                description: "O jogador foi cadastrado com sucesso.",
            });
            setEtapa("sucesso");
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao cadastrar jogador",
                description:
                    error.response?.data?.message || "Ocorreu um erro ao cadastrar o jogador.",
            });
        },
    });

    // Mutation para fluxo completo - cadastrar jogador
    const criarJogadorFluxoMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await apiPublic.post("/convite/public/jogador", {
                ...data,
                token: token
            });
            return response.data;
        },
        onSuccess: (data) => {
            setJogadoresCriados([...jogadoresCriados, data]);

            const etapaAtual = etapaFluxo;
            if (etapaAtual < 3) {
                // Próximo jogador
                setEtapaFluxo((etapaAtual + 1) as 1 | 2 | 3 | 4);
                setJogadorForm({ nome: "", rm: "" });
                toast({
                    title: `Jogador ${etapaAtual} cadastrado!`,
                    description: `Agora cadastre o ${etapaAtual === 1 ? "Jogador 2" : "Suporte"}.`,
                });
            } else {
                // Todos os jogadores cadastrados, ir para time
                setEtapaFluxo(4);
                setJogadorForm({ nome: "", rm: "" });
                toast({
                    title: "Suporte cadastrado!",
                    description: "Agora preencha os dados do time.",
                });
            }
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao cadastrar jogador",
                description:
                    error.response?.data?.message || "Ocorreu um erro ao cadastrar o jogador.",
            });
        },
    });

    const criarTimeMutation = useMutation({
        mutationFn: async (data: any) => {
            // Buscar os RMs dos jogadores selecionados
            const jogador1 = jogadoresDoCurso?.find((j: Jogador) => j.id.toString() === data.jogador1_id);
            const jogador2 = jogadoresDoCurso?.find((j: Jogador) => j.id.toString() === data.jogador2_id);
            const suporte = jogadoresDoCurso?.find((j: Jogador) => j.id.toString() === data.suporte_id);

            const response = await apiPublic.post("/convite/public/time", {
                nome: data.nome,
                jogador1_rm: jogador1?.rm,
                jogador2_rm: jogador2?.rm,
                suporte_rm: suporte?.rm,
                cadastrado_por: data.cadastrado_por,
                token: token
            });
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: "Time cadastrado!",
                description: "O time foi cadastrado com sucesso.",
            });
            setEtapa("sucesso");
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao cadastrar time",
                description:
                    error.response?.data?.message || "Ocorreu um erro ao cadastrar o time.",
            });
        },
    });

    // Mutation para fluxo completo - cadastrar time
    const criarTimeFluxoMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await apiPublic.post("/convite/public/time", {
                nome: data.nome,
                jogador1_rm: jogadoresCriados[0]?.rm,
                jogador2_rm: jogadoresCriados[1]?.rm,
                suporte_rm: jogadoresCriados[2]?.rm,
                cadastrado_por: data.cadastrado_por,
                token: token
            });
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: "Time cadastrado com sucesso!",
                description: "Todos os jogadores e o time foram cadastrados.",
            });
            setEtapa("sucesso");
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao cadastrar time",
                description:
                    error.response?.data?.message || "Ocorreu um erro ao cadastrar o time.",
            });
        },
    });

    const handleSubmitJogador = (e: React.FormEvent) => {
        e.preventDefault();
        if (!curso) return;

        criarJogadorMutation.mutate({
            ...jogadorForm,
        });
    };

    const handleSubmitTime = (e: React.FormEvent) => {
        e.preventDefault();
        if (!curso) return;

        criarTimeMutation.mutate({
            ...timeForm,
        });
    };

    const handleSubmitJogadorFluxo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!curso) return;

        criarJogadorFluxoMutation.mutate({
            ...jogadorForm,
        });
    };

    const handleSubmitTimeFluxo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!curso) return;

        criarTimeFluxoMutation.mutate({
            ...timeForm,
        });
    };

    if (validandoConvite || etapa === "validando") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            {validandoConvite ? (
                                <>
                                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                                    <p className="text-muted-foreground">Validando convite...</p>
                                </>
                            ) : !validacao?.valido ? (
                                <>
                                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold mb-2">Convite Inválido</h2>
                                    <p className="text-muted-foreground mb-4">
                                        {validacao?.mensagem || "Este convite não é válido."}
                                    </p>
                                    <Button onClick={() => router.push("/")}>
                                        Ir para a página inicial
                                    </Button>
                                </>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Cadastro via Convite</CardTitle>
                    <CardDescription>
                        Você foi convidado para cadastrar no curso: <strong>{curso?.nome}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {etapa === "escolha" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-center mb-2">Cadastro Rápido</h3>
                                <p className="text-center text-sm text-muted-foreground mb-4">
                                    Cadastre 3 jogadores e crie um time de uma vez
                                </p>
                                <Button
                                    className="w-full h-24 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                    onClick={() => {
                                        setEtapa("fluxo-completo");
                                        setEtapaFluxo(1);
                                        setJogadoresCriados([]);
                                        setJogadorForm({ nome: "", rm: "" });
                                        setTimeForm({ nome: "", jogador1_id: "", jogador2_id: "", suporte_id: "", cadastrado_por: "" });
                                    }}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Trophy className="h-8 w-8" />
                                        <span>Cadastrar Time Completo</span>
                                        <span className="text-xs opacity-90">(3 jogadores + time)</span>
                                    </div>
                                </Button>
                            </div>




                        </div>
                    )}

                    {etapa === "jogador" && (
                        <form onSubmit={handleSubmitJogador} className="space-y-4">
                            <div>
                                <Label htmlFor="nome">Nome do Jogador</Label>
                                <Input
                                    id="nome"
                                    value={jogadorForm.nome}
                                    onChange={(e) =>
                                        setJogadorForm({ ...jogadorForm, nome: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="rm">RM</Label>
                                <Input
                                    id="rm"
                                    value={jogadorForm.rm}
                                    onChange={(e) =>
                                        setJogadorForm({ ...jogadorForm, rm: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEtapa("escolha")}
                                    className="flex-1"
                                >
                                    Voltar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={criarJogadorMutation.isPending}
                                    className="flex-1"
                                >
                                    {criarJogadorMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Cadastrando...
                                        </>
                                    ) : (
                                        "Cadastrar Jogador"
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}

                    {etapa === "time" && (
                        <form onSubmit={handleSubmitTime} className="space-y-4">
                            <div>
                                <Label htmlFor="time-nome">Nome do Time</Label>
                                <Input
                                    id="time-nome"
                                    value={timeForm.nome}
                                    onChange={(e) =>
                                        setTimeForm({ ...timeForm, nome: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            {jogadoresDoCurso && jogadoresDoCurso.length > 0 ? (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="time-jogador1">Jogador 1</Label>
                                        <Select
                                            value={timeForm.jogador1_id}
                                            onValueChange={(value) =>
                                                setTimeForm({ ...timeForm, jogador1_id: value })
                                            }
                                        >
                                            <SelectTrigger id="time-jogador1">
                                                <SelectValue placeholder="Selecione o jogador 1" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {jogadoresDoCurso.map((jogador: Jogador) => (
                                                    <SelectItem
                                                        key={jogador.id}
                                                        value={jogador.id.toString()}
                                                        disabled={
                                                            jogador.id.toString() === timeForm.jogador2_id ||
                                                            jogador.id.toString() === timeForm.suporte_id
                                                        }
                                                    >
                                                        {jogador.nome} (RM: {jogador.rm})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="time-jogador2">Jogador 2</Label>
                                        <Select
                                            value={timeForm.jogador2_id}
                                            onValueChange={(value) =>
                                                setTimeForm({ ...timeForm, jogador2_id: value })
                                            }
                                        >
                                            <SelectTrigger id="time-jogador2">
                                                <SelectValue placeholder="Selecione o jogador 2" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {jogadoresDoCurso.map((jogador: Jogador) => (
                                                    <SelectItem
                                                        key={jogador.id}
                                                        value={jogador.id.toString()}
                                                        disabled={
                                                            jogador.id.toString() === timeForm.jogador1_id ||
                                                            jogador.id.toString() === timeForm.suporte_id
                                                        }
                                                    >
                                                        {jogador.nome} (RM: {jogador.rm})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="time-suporte">Suporte</Label>
                                        <Select
                                            value={timeForm.suporte_id}
                                            onValueChange={(value) =>
                                                setTimeForm({ ...timeForm, suporte_id: value })
                                            }
                                        >
                                            <SelectTrigger id="time-suporte">
                                                <SelectValue placeholder="Selecione o suporte" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {jogadoresDoCurso.map((jogador: Jogador) => (
                                                    <SelectItem
                                                        key={jogador.id}
                                                        value={jogador.id.toString()}
                                                        disabled={
                                                            jogador.id.toString() === timeForm.jogador1_id ||
                                                            jogador.id.toString() === timeForm.jogador2_id
                                                        }
                                                    >
                                                        {jogador.nome} (RM: {jogador.rm})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Atenção:</strong> Não há jogadores cadastrados no curso {curso?.nome} ainda.
                                        Cadastre jogadores primeiro antes de criar times.
                                    </p>
                                </div>
                            )}

                            <div>
                                <Label htmlFor="cadastrado_por">Cadastrado Por</Label>
                                <Input
                                    id="cadastrado_por"
                                    value={timeForm.cadastrado_por}
                                    onChange={(e) =>
                                        setTimeForm({ ...timeForm, cadastrado_por: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEtapa("escolha")}
                                    className="flex-1"
                                >
                                    Voltar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={criarTimeMutation.isPending || !jogadoresDoCurso || jogadoresDoCurso.length === 0}
                                    className="flex-1"
                                >
                                    {criarTimeMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Cadastrando...
                                        </>
                                    ) : (
                                        "Cadastrar Time"
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}

                    {etapa === "fluxo-completo" && (
                        <div className="space-y-6">
                            {/* Indicador de progresso */}
                            <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
                                <div className="flex items-center gap-1 min-w-fit">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${etapaFluxo >= 1 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
                                        }`}>
                                        {etapaFluxo > 1 ? "✓" : "1"}
                                    </div>
                                    <span className="text-xs font-medium hidden sm:inline">Jogador 1</span>
                                </div>
                                <div className={`flex-1 h-1 mx-1 min-w-[20px] ${etapaFluxo > 1 ? "bg-purple-600" : "bg-gray-200"}`} />

                                <div className="flex items-center gap-1 min-w-fit">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${etapaFluxo >= 2 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
                                        }`}>
                                        {etapaFluxo > 2 ? "✓" : "2"}
                                    </div>
                                    <span className="text-xs font-medium hidden sm:inline">Jogador 2</span>
                                </div>
                                <div className={`flex-1 h-1 mx-1 min-w-[20px] ${etapaFluxo > 2 ? "bg-purple-600" : "bg-gray-200"}`} />

                                <div className="flex items-center gap-1 min-w-fit">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${etapaFluxo >= 3 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
                                        }`}>
                                        {etapaFluxo > 3 ? "✓" : "3"}
                                    </div>
                                    <span className="text-xs font-medium hidden sm:inline">Suporte</span>
                                </div>
                                <div className={`flex-1 h-1 mx-1 min-w-[20px] ${etapaFluxo > 3 ? "bg-purple-600" : "bg-gray-200"}`} />

                                <div className="flex items-center gap-1 min-w-fit">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${etapaFluxo >= 4 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
                                        }`}>
                                        4
                                    </div>
                                    <span className="text-xs font-medium hidden sm:inline">Time</span>
                                </div>
                            </div>

                            {/* Resumo dos jogadores já cadastrados */}
                            {jogadoresCriados.length > 0 && (
                                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                                    <p className="font-semibold text-green-800 flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        Jogadores cadastrados:
                                    </p>
                                    {jogadoresCriados.map((jog, idx) => (
                                        <div key={idx} className="text-sm text-green-700 ml-6">
                                            • {idx === 0 ? "Jogador 1" : idx === 1 ? "Jogador 2" : "Suporte"}: {jog.nome} (RM: {jog.rm})
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Formulário de jogador (etapas 1, 2, 3) */}
                            {etapaFluxo < 4 && (
                                <form onSubmit={handleSubmitJogadorFluxo} className="space-y-4">
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-purple-900 mb-2">
                                            {etapaFluxo === 1 ? "Cadastre o Jogador 1" : etapaFluxo === 2 ? "Cadastre o Jogador 2" : "Cadastre o Suporte"}
                                        </h3>
                                        <p className="text-sm text-purple-700">
                                            Preencha os dados do {etapaFluxo === 1 ? "primeiro jogador" : etapaFluxo === 2 ? "segundo jogador" : "jogador suporte"}
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="fluxo-nome">Nome do Jogador</Label>
                                        <Input
                                            id="fluxo-nome"
                                            value={jogadorForm.nome}
                                            onChange={(e) =>
                                                setJogadorForm({ ...jogadorForm, nome: e.target.value })
                                            }
                                            placeholder="Digite o nome completo"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="fluxo-rm">RM</Label>
                                        <Input
                                            id="fluxo-rm"
                                            value={jogadorForm.rm}
                                            onChange={(e) =>
                                                setJogadorForm({ ...jogadorForm, rm: e.target.value })
                                            }
                                            placeholder="Digite o RM"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                if (etapaFluxo === 1) {
                                                    setEtapa("escolha");
                                                    setJogadoresCriados([]);
                                                } else {
                                                    setEtapaFluxo((etapaFluxo - 1) as 1 | 2 | 3 | 4);
                                                }
                                            }}
                                            className="flex-1"
                                        >
                                            Voltar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={criarJogadorFluxoMutation.isPending}
                                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                                        >
                                            {criarJogadorFluxoMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Cadastrando...
                                                </>
                                            ) : (
                                                `Cadastrar ${etapaFluxo === 1 ? "Jogador 1" : etapaFluxo === 2 ? "Jogador 2" : "Suporte"}`
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {/* Formulário de time (etapa 4) */}
                            {etapaFluxo === 4 && (
                                <form onSubmit={handleSubmitTimeFluxo} className="space-y-4">
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-purple-900 mb-2">
                                            Agora crie o Time!
                                        </h3>
                                        <p className="text-sm text-purple-700">
                                            Preencha os dados do time com os jogadores cadastrados
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="fluxo-time-nome">Nome do Time</Label>
                                        <Input
                                            id="fluxo-time-nome"
                                            value={timeForm.nome}
                                            onChange={(e) =>
                                                setTimeForm({ ...timeForm, nome: e.target.value })
                                            }
                                            placeholder="Digite o nome do time"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="fluxo-cadastrado-por">Cadastrado Por</Label>
                                        <Input
                                            id="fluxo-cadastrado-por"
                                            value={timeForm.cadastrado_por}
                                            onChange={(e) =>
                                                setTimeForm({ ...timeForm, cadastrado_por: e.target.value })
                                            }
                                            placeholder="Seu nome"
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setEtapaFluxo(3)}
                                            className="flex-1"
                                        >
                                            Voltar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={criarTimeFluxoMutation.isPending}
                                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                                        >
                                            {criarTimeFluxoMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Criando Time...
                                                </>
                                            ) : (
                                                "Criar Time"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {etapa === "sucesso" && (
                        <div className="text-center space-y-4">
                            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                            <h3 className="text-2xl font-bold">Cadastro Realizado!</h3>
                            <p className="text-muted-foreground">
                                Seu cadastro foi realizado com sucesso.
                            </p>
                            {jogadorCriado && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="font-semibold">Dados do Jogador:</p>
                                    <p>Nome: {jogadorCriado.nome}</p>
                                    <p>RM: {jogadorCriado.rm}</p>
                                </div>
                            )}
                            <div className="flex gap-2 pt-4">

                                <Button onClick={() => router.push("/")} className="flex-1">
                                    Finalizar
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

