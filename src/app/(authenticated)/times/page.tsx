"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { timeService } from "@/services/time.service";
import { cursoService } from "@/services/curso.service";
import { jogadorService } from "@/services/jogador.service";
import { useToast } from "@/hooks/use-toast";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    Trophy,
    Users,
    Link as LinkIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Time, Jogador, Usuario } from "@/types";
import { ModalGerarConvite } from "@/components/convite/modal-gerar-convite";

export default function TimesPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [cursoFilter, setCursoFilter] = useState<string>("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isConviteOpen, setIsConviteOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState<Time | null>(null);
    const [selectedCursoForJogadores, setSelectedCursoForJogadores] = useState<string>("");
    const [user, setUser] = useState<Usuario | null>(null);
    const [formData, setFormData] = useState({
        nome: "",
        curso_id: "",
        jogador1_id: "",
        jogador2_id: "",
        suporte_id: "",
    });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ["times", "paginated", page, search, cursoFilter],
        queryFn: () =>
            timeService.getPaginated({
                page,
                limit: 10,
                search,
                curso_id: cursoFilter && cursoFilter !== "all" ? parseInt(cursoFilter) : undefined,
            }),
    });

    const { data: cursos } = useQuery({
        queryKey: ["cursos", "all"],
        queryFn: cursoService.getAll,
    });

    const { data: jogadoresDoCurso } = useQuery({
        queryKey: ["jogadores", "curso", selectedCursoForJogadores],
        queryFn: () =>
            jogadorService.getByCurso(parseInt(selectedCursoForJogadores)),
        enabled: !!selectedCursoForJogadores,
    });

    const createMutation = useMutation({
        mutationFn: timeService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["times"] });
            toast({
                title: "Time criado!",
                description: "O time foi cadastrado com sucesso.",
            });
            setIsCreateOpen(false);
            resetForm();
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao criar time",
                description:
                    error.response?.data?.message || "Ocorreu um erro ao criar o time.",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: {
                nome: string;
                jogador1_id: number;
                jogador2_id: number;
                suporte_id: number;
            };
        }) => timeService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["times"] });
            toast({
                title: "Time atualizado!",
                description: "O time foi atualizado com sucesso.",
            });
            setIsEditOpen(false);
            setSelectedTime(null);
            resetForm();
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao atualizar time",
                description:
                    error.response?.data?.message ||
                    "Ocorreu um erro ao atualizar o time.",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: timeService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["times"] });
            toast({
                title: "Time excluído!",
                description: "O time foi excluído com sucesso.",
            });
            setIsDeleteOpen(false);
            setSelectedTime(null);
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao excluir time",
                description:
                    error.response?.data?.message ||
                    "Ocorreu um erro ao excluir o time.",
            });
        },
    });

    const resetForm = () => {
        setFormData({
            nome: "",
            curso_id: "",
            jogador1_id: "",
            jogador2_id: "",
            suporte_id: "",
        });
        setSelectedCursoForJogadores("");
    };

    const handleCreate = () => {
        if (!user) return;

        createMutation.mutate({
            nome: formData.nome,
            curso_id: parseInt(formData.curso_id),
            jogador1_id: parseInt(formData.jogador1_id),
            jogador2_id: parseInt(formData.jogador2_id),
            suporte_id: parseInt(formData.suporte_id),
            cadastrado_por: user.email,
        });
    };

    const handleEdit = () => {
        if (selectedTime) {
            updateMutation.mutate({
                id: selectedTime.id,
                data: {
                    nome: formData.nome,
                    jogador1_id: parseInt(formData.jogador1_id),
                    jogador2_id: parseInt(formData.jogador2_id),
                    suporte_id: parseInt(formData.suporte_id),
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedTime) {
            deleteMutation.mutate(selectedTime.id);
        }
    };

    const openEditDialog = (time: Time) => {
        setSelectedTime(time);
        setFormData({
            nome: time.nome,
            curso_id: time.curso_id.toString(),
            jogador1_id: time.jogador1_id.toString(),
            jogador2_id: time.jogador2_id.toString(),
            suporte_id: time.suporte_id.toString(),
        });
        setSelectedCursoForJogadores(time.curso_id.toString());
        setIsEditOpen(true);
    };

    const openDeleteDialog = (time: Time) => {
        setSelectedTime(time);
        setIsDeleteOpen(true);
    };

    const handleCursoChange = (value: string) => {
        setFormData({
            ...formData,
            curso_id: value,
            jogador1_id: "",
            jogador2_id: "",
            suporte_id: "",
        });
        setSelectedCursoForJogadores(value);
    };

    const isFormValid = () => {
        return (
            formData.nome &&
            formData.curso_id &&
            formData.jogador1_id &&
            formData.jogador2_id &&
            formData.suporte_id &&
            formData.jogador1_id !== formData.jogador2_id &&
            formData.jogador1_id !== formData.suporte_id &&
            formData.jogador2_id !== formData.suporte_id
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Trophy className="h-8 w-8 text-primary" />
                        Times
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Gerencie os times cadastrados no sistema
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsConviteOpen(true)}
                        variant="outline"
                        className="shadow-sm"
                        disabled={!cursoFilter || cursoFilter === "all"}
                        title={cursoFilter === "all" ? "Selecione um curso para gerar convite" : "Gerar link de convite"}
                    >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Gerar Convite
                    </Button>
                    <Button onClick={() => setIsCreateOpen(true)} className="shadow-sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Time
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Lista de Times</CardTitle>
                    <div className="flex items-center gap-2 mt-4">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar times..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="max-w-sm"
                        />
                        <Filter className="h-4 w-4 text-muted-foreground ml-4" />
                        <Select
                            value={cursoFilter}
                            onValueChange={(value) => {
                                setCursoFilter(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filtrar por curso" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os cursos</SelectItem>
                                {cursos?.map((curso) => (
                                    <SelectItem key={curso.id} value={curso.id.toString()}>
                                        {curso.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="text-muted-foreground mt-2">Carregando...</p>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Curso</TableHead>
                                        <TableHead>Jogadores</TableHead>
                                        <TableHead>Data de Criação</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.data.map((time) => (
                                        <TableRow key={time.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">{time.id}</TableCell>
                                            <TableCell className="font-semibold">{time.nome}</TableCell>
                                            <TableCell>{time.curso.nome}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        <span className="font-medium">J1:</span> {time.jogador1.nome}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        <span className="font-medium">J2:</span> {time.jogador2.nome}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        <span className="font-medium">Sup:</span> {time.suporte.nome}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatDate(time.createdAt)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(time)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openDeleteDialog(time)}
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {data?.data.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Nenhum time encontrado</p>
                                    <p className="text-sm">Comece criando seu primeiro time</p>
                                </div>
                            )}

                            {data && data.pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-sm text-muted-foreground">
                                        Página {data.pagination.page} de {data.pagination.totalPages} -{" "}
                                        {data.pagination.total} time(s) no total
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page - 1)}
                                            disabled={!data.pagination.hasPrev}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Anterior
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page + 1)}
                                            disabled={!data.pagination.hasNext}
                                        >
                                            Próxima
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Dialog Criar */}
            <Dialog
                open={isCreateOpen}
                onOpenChange={(open) => {
                    setIsCreateOpen(open);
                    if (!open) resetForm();
                }}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Novo Time</DialogTitle>
                        <DialogDescription>
                            Preencha os dados para criar um novo time
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-nome">Nome do Time</Label>
                            <Input
                                id="create-nome"
                                placeholder="Ex: Team Rocket"
                                value={formData.nome}
                                onChange={(e) =>
                                    setFormData({ ...formData, nome: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-curso">Curso</Label>
                            <Select value={formData.curso_id} onValueChange={handleCursoChange}>
                                <SelectTrigger id="create-curso">
                                    <SelectValue placeholder="Selecione um curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cursos?.map((curso) => (
                                        <SelectItem key={curso.id} value={curso.id.toString()}>
                                            {curso.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedCursoForJogadores && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="create-jogador1">Jogador 1</Label>
                                    <Select
                                        value={formData.jogador1_id}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, jogador1_id: value })
                                        }
                                    >
                                        <SelectTrigger id="create-jogador1">
                                            <SelectValue placeholder="Selecione o jogador 1" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jogadoresDoCurso?.map((jogador) => (
                                                <SelectItem
                                                    key={jogador.id}
                                                    value={jogador.id.toString()}
                                                    disabled={
                                                        jogador.id.toString() === formData.jogador2_id ||
                                                        jogador.id.toString() === formData.suporte_id
                                                    }
                                                >
                                                    {jogador.nome} (RM: {jogador.rm})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="create-jogador2">Jogador 2</Label>
                                    <Select
                                        value={formData.jogador2_id}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, jogador2_id: value })
                                        }
                                    >
                                        <SelectTrigger id="create-jogador2">
                                            <SelectValue placeholder="Selecione o jogador 2" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jogadoresDoCurso?.map((jogador) => (
                                                <SelectItem
                                                    key={jogador.id}
                                                    value={jogador.id.toString()}
                                                    disabled={
                                                        jogador.id.toString() === formData.jogador1_id ||
                                                        jogador.id.toString() === formData.suporte_id
                                                    }
                                                >
                                                    {jogador.nome} (RM: {jogador.rm})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="create-suporte">Suporte</Label>
                                    <Select
                                        value={formData.suporte_id}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, suporte_id: value })
                                        }
                                    >
                                        <SelectTrigger id="create-suporte">
                                            <SelectValue placeholder="Selecione o suporte" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jogadoresDoCurso?.map((jogador) => (
                                                <SelectItem
                                                    key={jogador.id}
                                                    value={jogador.id.toString()}
                                                    disabled={
                                                        jogador.id.toString() === formData.jogador1_id ||
                                                        jogador.id.toString() === formData.jogador2_id
                                                    }
                                                >
                                                    {jogador.nome} (RM: {jogador.rm})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCreateOpen(false);
                                resetForm();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={createMutation.isPending || !isFormValid()}
                        >
                            {createMutation.isPending ? "Criando..." : "Criar Time"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Editar */}
            <Dialog
                open={isEditOpen}
                onOpenChange={(open) => {
                    setIsEditOpen(open);
                    if (!open) {
                        resetForm();
                        setSelectedTime(null);
                    }
                }}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Time</DialogTitle>
                        <DialogDescription>Atualize os dados do time</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-nome">Nome do Time</Label>
                            <Input
                                id="edit-nome"
                                placeholder="Ex: Team Rocket"
                                value={formData.nome}
                                onChange={(e) =>
                                    setFormData({ ...formData, nome: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Curso</Label>
                            <Input
                                value={
                                    cursos?.find((c) => c.id.toString() === formData.curso_id)
                                        ?.nome || ""
                                }
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                O curso não pode ser alterado após a criação do time
                            </p>
                        </div>

                        {selectedCursoForJogadores && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-jogador1">Jogador 1</Label>
                                    <Select
                                        value={formData.jogador1_id}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, jogador1_id: value })
                                        }
                                    >
                                        <SelectTrigger id="edit-jogador1">
                                            <SelectValue placeholder="Selecione o jogador 1" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jogadoresDoCurso?.map((jogador) => (
                                                <SelectItem
                                                    key={jogador.id}
                                                    value={jogador.id.toString()}
                                                    disabled={
                                                        jogador.id.toString() === formData.jogador2_id ||
                                                        jogador.id.toString() === formData.suporte_id
                                                    }
                                                >
                                                    {jogador.nome} (RM: {jogador.rm})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-jogador2">Jogador 2</Label>
                                    <Select
                                        value={formData.jogador2_id}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, jogador2_id: value })
                                        }
                                    >
                                        <SelectTrigger id="edit-jogador2">
                                            <SelectValue placeholder="Selecione o jogador 2" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jogadoresDoCurso?.map((jogador) => (
                                                <SelectItem
                                                    key={jogador.id}
                                                    value={jogador.id.toString()}
                                                    disabled={
                                                        jogador.id.toString() === formData.jogador1_id ||
                                                        jogador.id.toString() === formData.suporte_id
                                                    }
                                                >
                                                    {jogador.nome} (RM: {jogador.rm})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-suporte">Suporte</Label>
                                    <Select
                                        value={formData.suporte_id}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, suporte_id: value })
                                        }
                                    >
                                        <SelectTrigger id="edit-suporte">
                                            <SelectValue placeholder="Selecione o suporte" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jogadoresDoCurso?.map((jogador) => (
                                                <SelectItem
                                                    key={jogador.id}
                                                    value={jogador.id.toString()}
                                                    disabled={
                                                        jogador.id.toString() === formData.jogador1_id ||
                                                        jogador.id.toString() === formData.jogador2_id
                                                    }
                                                >
                                                    {jogador.nome} (RM: {jogador.rm})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditOpen(false);
                                resetForm();
                                setSelectedTime(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleEdit}
                            disabled={updateMutation.isPending || !isFormValid()}
                        >
                            {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Excluir */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o time{" "}
                            <strong>{selectedTime?.nome}</strong>? Esta ação não pode ser
                            desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal Gerar Convite */}
            {cursoFilter && cursoFilter !== "all" && (
                <ModalGerarConvite
                    isOpen={isConviteOpen}
                    onClose={() => setIsConviteOpen(false)}
                    cursoId={parseInt(cursoFilter)}
                    cursoNome={cursos?.find((c) => c.id === parseInt(cursoFilter))?.nome || ""}
                />
            )}
        </div>
    );
}
