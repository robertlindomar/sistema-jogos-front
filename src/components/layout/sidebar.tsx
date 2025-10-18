"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Trophy,
  LogOut,
  BarChart3,
} from "lucide-react";
import { authService } from "@/services/auth.service";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Visão geral do sistema",
  },
  {
    title: "Cursos",
    href: "/cursos",
    icon: BookOpen,
    description: "Gerenciar cursos",
  },
  {
    title: "Jogadores",
    href: "/jogadores",
    icon: Users,
    description: "Gerenciar jogadores",
  },
  {
    title: "Times",
    href: "/times",
    icon: Trophy,
    description: "Gerenciar times",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    if (confirm("Deseja realmente sair?")) {
      authService.logout();
    }
  };

  return (
    <div className="flex h-screen w-72 flex-col border-r bg-card shadow-sm">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Sistema de Jogos</h1>
            <p className="text-xs text-muted-foreground">UNIFUNEC</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
            Navegação
          </p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col gap-1 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform",
                    isActive ? "text-primary-foreground" : "group-hover:scale-110"
                  )} />
                  <span className="font-medium">{item.title}</span>
                </div>
                {!isActive && (
                  <p className="text-xs text-muted-foreground/70 ml-8">
                    {item.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair da conta</span>
        </button>
      </div>
    </div>
  );
}

