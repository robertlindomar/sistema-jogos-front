"use client";

import { useState } from "react";
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
import { jogadorService } from "@/services/jogador.service";
import { cursoService } from "@/services/curso.service";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Filter, Users, Link as LinkIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Jogador } from "@/types";
import { ModalGerarConvite } from "@/components/convite/modal-gerar-convite";

export default function JogadoresPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [cursoFilter, setCursoFilter] = useState<string>("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isConviteOpen, setIsConviteOpen] = useState(false);
    const [selectedJogador, setSelectedJogador] = useState<Jogador | null>(null);
    const [formData, setFormData] = useState({
        nome: "",
        rm: "",
        curso_id: "",
    });

    const { data, isLoading } = useQuery({
        queryKey: ["jogadores", "paginated", page, search, cursoFilter],
        queryFn: () =>
            jogadorService.getPaginated({
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

    const createMutation = useMutation({
        mutationFn: jogadorService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jogadores"] });
            toast({
                title: "Jogador criado!",
                description: "O jogador foi cadastrado com sucesso.",
            });
            setIsCreateOpen(false);
            setFormData({ nome: "", rm: "", curso_id: "" });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao criar jogador",
                description:
                    error.response?.data?.message || "Ocorreu um erro ao criar o jogador.",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: { nome: string; rm: string; curso_id: number };
        }) => jogadorService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jogadores"] });
            toast({
                title: "Jogador atualizado!",
                description: "O jogador foi atualizado com sucesso.",
            });
            setIsEditOpen(false);
            setSelectedJogador(null);
            setFormData({ nome: "", rm: "", curso_id: "" });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao atualizar jogador",
                description:
                    error.response?.data?.message ||
                    "Ocorreu um erro ao atualizar o jogador.",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: jogadorService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jogadores"] });
            toast({
                title: "Jogador excluído!",
                description: "O jogador foi excluído com sucesso.",
            });
            setIsDeleteOpen(false);
            setSelectedJogador(null);
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao excluir jogador",
                description:
                    error.response?.data?.message ||
                    "Ocorreu um erro ao excluir o jogador.",
            });
        },
    });

    const handleCreate = () => {
        createMutation.mutate({
            nome: formData.nome,
            rm: formData.rm,
            curso_id: parseInt(formData.curso_id),
        });
    };

    const handleEdit = () => {
        if (selectedJogador) {
            updateMutation.mutate({
                id: selectedJogador.id,
                data: {
                    nome: formData.nome,
                    rm: formData.rm,
                    curso_id: parseInt(formData.curso_id),
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedJogador) {
            deleteMutation.mutate(selectedJogador.id);
        }
    };

    const openEditDialog = (jogador: Jogador) => {
        setSelectedJogador(jogador);
        setFormData({
            nome: jogador.nome,
            rm: jogador.rm,
            curso_id: jogador.curso_id.toString(),
        });
        setIsEditOpen(true);
    };

    const openDeleteDialog = (jogador: Jogador) => {
        setSelectedJogador(jogador);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Users className="h-8 w-8 text-primary" />
                        Jogadores
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Gerencie os jogadores cadastrados no sistema
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
                        Novo Jogador
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Lista de Jogadores</CardTitle>
                    <div className="flex items-center gap-2 mt-4">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome ou RM..."
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
                                        <TableHead>RM</TableHead>
                                        <TableHead>Curso</TableHead>
                                        <TableHead>Data de Criação</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.data.map((jogador) => (
                                        <TableRow key={jogador.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">{jogador.id}</TableCell>
                                            <TableCell className="font-medium">{jogador.nome}</TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                                                    {jogador.rm}
                                                </span>
                                            </TableCell>
                                            <TableCell>{jogador.curso.nome}</TableCell>
                                            <TableCell>{formatDate(jogador.createdAt)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(jogador)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openDeleteDialog(jogador)}
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
                                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Nenhum jogador encontrado</p>
                                    <p className="text-sm">Comece criando seu primeiro jogador</p>
                                </div>
                            )}

                            {data && data.pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-sm text-muted-foreground">
                                        Página {data.pagination.page} de {data.pagination.totalPages} -{" "}
                                        {data.pagination.total} jogador(es) no total
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
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo Jogador</DialogTitle>
                        <DialogDescription>
                            Preencha os dados para criar um novo jogador
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-nome">Nome do Jogador</Label>
                            <Input
                                id="create-nome"
                                placeholder="Ex: João Silva"
                                value={formData.nome}
                                onChange={(e) =>
                                    setFormData({ ...formData, nome: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-rm">RM</Label>
                            <Input
                                id="create-rm"
                                placeholder="Ex: 123456"
                                value={formData.rm}
                                onChange={(e) =>
                                    setFormData({ ...formData, rm: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-curso">Curso</Label>
                            <Select
                                value={formData.curso_id}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, curso_id: value })
                                }
                            >
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
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={
                                createMutation.isPending ||
                                !formData.nome ||
                                !formData.rm ||
                                !formData.curso_id
                            }
                        >
                            {createMutation.isPending ? "Criando..." : "Criar Jogador"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Editar */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Jogador</DialogTitle>
                        <DialogDescription>Atualize os dados do jogador</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-nome">Nome do Jogador</Label>
                            <Input
                                id="edit-nome"
                                placeholder="Ex: João Silva"
                                value={formData.nome}
                                onChange={(e) =>
                                    setFormData({ ...formData, nome: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-rm">RM</Label>
                            <Input
                                id="edit-rm"
                                placeholder="Ex: 123456"
                                value={formData.rm}
                                onChange={(e) =>
                                    setFormData({ ...formData, rm: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-curso">Curso</Label>
                            <Select
                                value={formData.curso_id}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, curso_id: value })
                                }
                            >
                                <SelectTrigger id="edit-curso">
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
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleEdit}
                            disabled={
                                updateMutation.isPending ||
                                !formData.nome ||
                                !formData.rm ||
                                !formData.curso_id
                            }
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
                            Tem certeza que deseja excluir o jogador{" "}
                            <strong>{selectedJogador?.nome}</strong>? Esta ação não pode ser
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
