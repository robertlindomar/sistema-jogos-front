"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cursoService } from "@/services/curso.service";
import { jogadorService } from "@/services/jogador.service";
import { timeService } from "@/services/time.service";
import { BookOpen, Users, Trophy, TrendingUp } from "lucide-react";

export default function DashboardPage() {
    const { data: cursosData } = useQuery({
        queryKey: ["cursos", "paginated", 1],
        queryFn: () => cursoService.getPaginated({ page: 1, limit: 10 }),
    });

    const { data: jogadoresData } = useQuery({
        queryKey: ["jogadores", "paginated", 1],
        queryFn: () => jogadorService.getPaginated({ page: 1, limit: 10 }),
    });

    const { data: timesData } = useQuery({
        queryKey: ["times", "paginated", 1],
        queryFn: () => timeService.getPaginated({ page: 1, limit: 10 }),
    });

    const stats = [
        {
            title: "Total de Cursos",
            value: cursosData?.pagination.total || 0,
            icon: BookOpen,
            description: "Cursos cadastrados",
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            title: "Total de Jogadores",
            value: jogadoresData?.pagination.total || 0,
            icon: Users,
            description: "Jogadores cadastrados",
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            title: "Total de Times",
            value: timesData?.pagination.total || 0,
            icon: Trophy,
            description: "Times cadastrados",
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
        },
        {
            title: "Média de Jogadores/Time",
            value: timesData?.pagination.total
                ? Math.round((jogadoresData?.pagination.total || 0) / timesData.pagination.total * 10) / 10
                : 0,
            icon: TrendingUp,
            description: "Taxa de participação",
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Visão geral do sistema de gerenciamento de jogos
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Cursos Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {cursosData?.data.slice(0, 5).map((curso) => (
                            <div
                                key={curso.id}
                                className="flex items-center justify-between py-2 border-b last:border-0"
                            >
                                <div>
                                    <p className="font-medium">{curso.nome}</p>
                                    <p className="text-xs text-muted-foreground">
                                        ID: {curso.id}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {!cursosData?.data.length && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                Nenhum curso cadastrado
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Times Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {timesData?.data.slice(0, 5).map((time) => (
                            <div
                                key={time.id}
                                className="flex items-center justify-between py-2 border-b last:border-0"
                            >
                                <div>
                                    <p className="font-medium">{time.nome}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {time.curso.nome}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {!timesData?.data.length && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                Nenhum time cadastrado
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
