"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { conviteService, Convite } from "@/services/convite.service";
import { useToast } from "@/hooks/use-toast";
import { Copy, CheckCircle, ExternalLink, Loader2 } from "lucide-react";

interface ModalGerarConviteProps {
    isOpen: boolean;
    onClose: () => void;
    cursoId: number;
    cursoNome: string;
}

export function ModalGerarConvite({
    isOpen,
    onClose,
    cursoId,
    cursoNome,
}: ModalGerarConviteProps) {
    const { toast } = useToast();
    const [diasValidade, setDiasValidade] = useState(7);
    const [conviteGerado, setConviteGerado] = useState<Convite | null>(null);
    const [linkCopiado, setLinkCopiado] = useState(false);

    const gerarConviteMutation = useMutation({
        mutationFn: () =>
            conviteService.criar({
                curso_id: cursoId,
                dias_validade: diasValidade,
            }),
        onSuccess: (data) => {
            setConviteGerado(data);
            toast({
                title: "Convite gerado!",
                description: "O link de convite foi criado com sucesso.",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erro ao gerar convite",
                description:
                    error.response?.data?.message || "Ocorreu um erro ao gerar o convite.",
            });
        },
    });

    const handleCopiarLink = () => {
        if (conviteGerado?.link) {
            navigator.clipboard.writeText(conviteGerado.link);
            setLinkCopiado(true);
            toast({
                title: "Link copiado!",
                description: "O link foi copiado para a área de transferência.",
            });
            setTimeout(() => setLinkCopiado(false), 2000);
        }
    };

    const handleClose = () => {
        setConviteGerado(null);
        setDiasValidade(7);
        setLinkCopiado(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Gerar Link de Convite</DialogTitle>
                    <DialogDescription>
                        Crie um link de convite para o curso <strong>{cursoNome}</strong>
                    </DialogDescription>
                </DialogHeader>

                {!conviteGerado ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="dias">Validade do convite (dias)</Label>
                            <Input
                                id="dias"
                                type="number"
                                min={1}
                                max={365}
                                value={diasValidade}
                                onChange={(e) => setDiasValidade(parseInt(e.target.value))}
                            />
                            <p className="text-sm text-muted-foreground">
                                O link expirará após {diasValidade} dia{diasValidade !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>O que é isso?</strong>
                                <br />
                                Com este link, qualquer pessoa poderá cadastrar jogadores e times no
                                curso selecionado, sem precisar fazer login no sistema.
                            </p>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => gerarConviteMutation.mutate()}
                                disabled={gerarConviteMutation.isPending}
                            >
                                {gerarConviteMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Gerando...
                                    </>
                                ) : (
                                    "Gerar Link"
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-2 text-green-600 mb-4">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-semibold">Convite gerado com sucesso!</span>
                        </div>

                        <div className="space-y-2">
                            <Label>Link do Convite</Label>
                            <div className="flex gap-2">
                                <Input value={conviteGerado.link} readOnly className="flex-1" />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopiarLink}
                                    title="Copiar link"
                                >
                                    {linkCopiado ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => window.open(conviteGerado.link, "_blank")}
                                    title="Abrir em nova aba"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Importante:</strong>
                                <br />
                                Este link expirará em{" "}
                                <strong>
                                    {new Date(conviteGerado.expira_em).toLocaleDateString("pt-BR")}
                                </strong>
                                . Compartilhe-o apenas com pessoas autorizadas.
                            </p>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button onClick={handleClose}>Fechar</Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

