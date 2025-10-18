# 🚀 Guia de Instalação - Frontend

## Passo a Passo

### 1. Navegue até a pasta frontend

```bash
cd frontend
```

### 2. Instale as dependências

```bash
npm install
```

Isso pode levar alguns minutos. Aguarde a instalação completa.

### 3. Configure o ambiente

O arquivo `.env.local` já está configurado com:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Se o backend estiver rodando em outra porta, ajuste este arquivo.

### 4. Certifique-se que o backend está rodando

O backend deve estar rodando em `http://localhost:3000`

Para iniciar o backend:
```bash
cd ../backend
npm run dev
```

### 5. Inicie o frontend

```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:3001**

### 6. Faça login no sistema

Use as credenciais padrão do backend:
- **Email**: admin@example.com
- **Senha**: senha123

## 🎯 Verificação

Se tudo estiver correto, você verá:

1. Página de login acessível em `http://localhost:3001`
2. Após login, será redirecionado para o Dashboard
3. Menu lateral com opções: Dashboard, Cursos, Jogadores, Times

## ❗ Problemas Comuns

### Erro de conexão com API

**Problema**: "Network Error" ou "Failed to fetch"

**Solução**: 
- Verifique se o backend está rodando
- Confirme a URL da API no `.env.local`
- Verifique se há conflito de CORS no backend

### Porta já em uso

**Problema**: "Port 3001 is already in use"

**Solução**:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

Ou inicie em outra porta:
```bash
PORT=3002 npm run dev
```

### Erro ao instalar dependências

**Problema**: Erros durante `npm install`

**Solução**:
```bash
# Limpe o cache
npm cache clean --force

# Delete node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstale
npm install
```

## 📝 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Verificar erros de lint
npm run lint
```

## 🎨 Recursos do Sistema

- ✅ Autenticação com JWT
- ✅ Dashboard com estatísticas
- ✅ CRUD completo de Cursos
- ✅ CRUD completo de Jogadores
- ✅ CRUD completo de Times
- ✅ Paginação em todas as listas
- ✅ Busca e filtros
- ✅ Design responsivo
- ✅ Toast notifications
- ✅ Confirmação de exclusões
- ✅ Validações em tempo real

## 🎨 Interface

O sistema possui:
- **Tema claro** profissional
- **Cor primária**: Verde-azulado (#17988B)
- **Layout moderno** com sidebar
- **Componentes Shadcn UI** estilizados
- **Ícones Lucide** em todo o sistema

## 🔄 Fluxo de Uso

1. **Login** → Autenticação
2. **Dashboard** → Visão geral
3. **Cursos** → Cadastrar cursos
4. **Jogadores** → Cadastrar jogadores (vinculados a cursos)
5. **Times** → Criar times (3 jogadores do mesmo curso)

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verifique os logs do terminal
2. Confirme que o backend está funcionando
3. Teste as rotas da API diretamente
4. Verifique o console do navegador (F12)

