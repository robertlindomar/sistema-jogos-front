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
import { Label } from "@/components/ui/label";
import { cursoService } from "@/services/curso.service";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Curso } from "@/types";

export default function CursosPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
    const [formData, setFormData] = useState({ nome: "" });

    const { data, isLoading } = useQuery({
        queryKey: ["cursos", "paginated", page, search],
        queryFn: () => cursoService.getPaginated({ page, limit: 10, search }),
    });

    const createMutation = useMutation({
        mutationFn: cursoService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cursos"] });
            toast({
                title: "Curso criado!",
                description: "O curso foi cadastrado com sucesso.",
            });
            setIsCreateOpen(false);
            setFormData({ nome: "" });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao criar curso",
                description: error.response?.data?.message || "Ocorreu um erro ao criar o curso.",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: { nome: string } }) =>
            cursoService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cursos"] });
            toast({
                title: "Curso atualizado!",
                description: "O curso foi atualizado com sucesso.",
            });
            setIsEditOpen(false);
            setSelectedCurso(null);
            setFormData({ nome: "" });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao atualizar curso",
                description: error.response?.data?.message || "Ocorreu um erro ao atualizar o curso.",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: cursoService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cursos"] });
            toast({
                title: "Curso excluído!",
                description: "O curso foi excluído com sucesso.",
            });
            setIsDeleteOpen(false);
            setSelectedCurso(null);
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao excluir curso",
                description: error.response?.data?.message || "Ocorreu um erro ao excluir o curso.",
            });
        },
    });

    const handleCreate = () => {
        createMutation.mutate(formData);
    };

    const handleEdit = () => {
        if (selectedCurso) {
            updateMutation.mutate({ id: selectedCurso.id, data: formData });
        }
    };

    const handleDelete = () => {
        if (selectedCurso) {
            deleteMutation.mutate(selectedCurso.id);
        }
    };

    const openEditDialog = (curso: Curso) => {
        setSelectedCurso(curso);
        setFormData({ nome: curso.nome });
        setIsEditOpen(true);
    };

    const openDeleteDialog = (curso: Curso) => {
        setSelectedCurso(curso);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <BookOpen className="h-8 w-8 text-primary" />
                        Cursos
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Gerencie os cursos cadastrados no sistema
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Curso
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Lista de Cursos</CardTitle>
                    <div className="flex items-center gap-2 mt-4">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar cursos..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="max-w-sm"
                        />
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
                                        <TableHead>Data de Criação</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.data.map((curso) => (
                                        <TableRow key={curso.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">{curso.id}</TableCell>
                                            <TableCell className="font-medium">{curso.nome}</TableCell>
                                            <TableCell>{formatDate(curso.createdAt)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(curso)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openDeleteDialog(curso)}
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
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Nenhum curso encontrado</p>
                                    <p className="text-sm">Comece criando seu primeiro curso</p>
                                </div>
                            )}

                            {data && data.pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-sm text-muted-foreground">
                                        Página {data.pagination.page} de {data.pagination.totalPages} -{" "}
                                        {data.pagination.total} curso(s) no total
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
                        <DialogTitle>Novo Curso</DialogTitle>
                        <DialogDescription>
                            Preencha os dados para criar um novo curso
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-nome">Nome do Curso</Label>
                            <Input
                                id="create-nome"
                                placeholder="Ex: Engenharia de Software"
                                value={formData.nome}
                                onChange={(e) => setFormData({ nome: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={createMutation.isPending || !formData.nome}
                        >
                            {createMutation.isPending ? "Criando..." : "Criar Curso"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Editar */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Curso</DialogTitle>
                        <DialogDescription>
                            Atualize os dados do curso
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-nome">Nome do Curso</Label>
                            <Input
                                id="edit-nome"
                                placeholder="Ex: Engenharia de Software"
                                value={formData.nome}
                                onChange={(e) => setFormData({ nome: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleEdit}
                            disabled={updateMutation.isPending || !formData.nome}
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
                            Tem certeza que deseja excluir o curso{" "}
                            <strong>{selectedCurso?.nome}</strong>? Esta ação não pode ser
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
        </div>
    );
}
