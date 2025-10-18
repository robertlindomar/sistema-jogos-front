# Sistema de Jogos - Frontend

Sistema frontend desenvolvido em Next.js para gerenciamento de cursos, jogadores e times da UNIFUNEC.

## 🚀 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Linguagem de programação
- **Tailwind CSS** - Framework CSS
- **Shadcn UI** - Componentes UI
- **Axios** - Cliente HTTP
- **TanStack React Query** - Gerenciamento de estado e cache
- **Lucide React** - Ícones

## 🎨 Design

- **Tema**: Claro
- **Cor Primária**: RGB(23, 152, 139) - #17988B

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Backend rodando em `http://localhost:3000`

## 🔧 Instalação

1. **Instale as dependências**

```bash
cd frontend
npm install
```

2. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

3. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3001`

## 📦 Build para Produção

```bash
npm run build
npm start
```

## 🗂️ Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                    # Páginas e rotas (App Router)
│   │   ├── login/             # Página de login
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── cursos/            # CRUD de cursos
│   │   ├── jogadores/         # CRUD de jogadores
│   │   └── times/             # CRUD de times
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes Shadcn UI
│   │   └── layout/           # Componentes de layout
│   ├── services/             # Serviços de API
│   │   ├── auth.service.ts
│   │   ├── curso.service.ts
│   │   ├── jogador.service.ts
│   │   └── time.service.ts
│   ├── hooks/                # Custom hooks
│   │   └── use-toast.ts
│   ├── lib/                  # Utilitários
│   │   ├── api.ts           # Configuração Axios
│   │   └── utils.ts         # Funções auxiliares
│   └── types/                # Tipos TypeScript
│       └── index.ts
├── public/                    # Arquivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação. O token é armazenado no localStorage e enviado em todas as requisições via header `Authorization`.

## 📱 Funcionalidades

### Dashboard
- Visão geral do sistema
- Estatísticas de cursos, jogadores e times
- Cards com informações resumidas

### Cursos
- Listar cursos com paginação
- Criar novo curso
- Editar curso existente
- Excluir curso
- Buscar cursos por nome

### Jogadores
- Listar jogadores com paginação
- Filtrar por curso
- Criar novo jogador
- Editar jogador existente
- Excluir jogador
- Buscar por nome ou RM

### Times
- Listar times com paginação
- Filtrar por curso
- Criar novo time (com validação de jogadores únicos)
- Editar time existente
- Excluir time
- Visualizar composição completa do time

## 🎨 Componentes UI Disponíveis

- Button
- Input
- Label
- Card
- Table
- Dialog
- Alert Dialog
- Select
- Toast

## 🔄 React Query

O projeto utiliza React Query para:
- Cache automático de dados
- Refetch automático
- Otimização de requisições
- Loading e error states
- DevTools para debug

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## 🌐 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| NEXT_PUBLIC_API_URL | URL da API backend | http://localhost:3000/api |

## 🎯 Próximos Passos

- [ ] Adicionar testes unitários
- [ ] Implementar dark mode
- [ ] Adicionar relatórios
- [ ] Implementar exportação de dados
- [ ] Adicionar dashboard avançado

## 👨‍💻 Desenvolvido para

UNIFUNEC - Sistema de Gerenciamento de Jogos

