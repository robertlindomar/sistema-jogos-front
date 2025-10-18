# 📖 Guia Rápido - Sistema de Jogos

## 🚀 Início Rápido

### Para desenvolvedores

```bash
# 1. Instalar dependências
cd frontend
npm install

# 2. Iniciar o servidor
npm run dev
```

Acesse: `http://localhost:3001`

## 🔑 Credenciais Padrão

- **Email**: admin@example.com
- **Senha**: senha123

## 📋 Fluxo de Trabalho Recomendado

### 1️⃣ Cadastrar Cursos
- Acesse **Cursos** no menu lateral
- Clique em **Novo Curso**
- Cadastre pelo menos 1 curso

### 2️⃣ Cadastrar Jogadores
- Acesse **Jogadores** no menu lateral
- Clique em **Novo Jogador**
- Preencha: Nome, RM e selecione o Curso
- Cadastre pelo menos 3 jogadores do mesmo curso

### 3️⃣ Criar Times
- Acesse **Times** no menu lateral
- Clique em **Novo Time**
- Selecione o curso
- Escolha 3 jogadores diferentes:
  - Jogador 1
  - Jogador 2
  - Suporte
- Os jogadores devem ser únicos (sem repetição)
- Todos devem ser do mesmo curso

## 🎯 Funcionalidades Principais

### Dashboard
- Visão geral com estatísticas
- Cards informativos
- Listas de itens recentes

### Busca e Filtros
- **Busca**: Digite no campo de busca
- **Filtros**: Use os dropdowns de filtro
- **Paginação**: Navegue entre as páginas

### CRUD Operations

#### Criar
- Botão "Novo" no canto superior direito
- Preencha o formulário
- Clique em "Criar"

#### Editar
- Ícone de lápis na linha do item
- Modifique os dados
- Clique em "Salvar Alterações"

#### Excluir
- Ícone de lixeira na linha do item
- Confirme a exclusão
- Item removido permanentemente

## 🎨 Recursos da Interface

### Notificações Toast
- **Sucesso**: Verde (operações bem-sucedidas)
- **Erro**: Vermelho (problemas encontrados)
- Aparecem no canto superior direito
- Desaparecem automaticamente

### Validações
- Campos obrigatórios marcados
- Validação em tempo real
- Mensagens de erro claras
- Botões desabilitados quando inválido

### Responsividade
- Desktop: Layout completo com sidebar
- Tablet: Layout adaptado
- Mobile: Menu responsivo

## 🔐 Segurança

### Token JWT
- Armazenado no localStorage
- Enviado em todas requisições
- Expiração automática
- Redirecionamento ao expirar

### Proteção de Rotas
- Login obrigatório
- Redirecionamento automático
- Middleware de verificação

## ⚡ Dicas de Performance

### Cache Automático
- React Query faz cache automático
- Dados atualizados em tempo real
- Menos requisições ao servidor

### Paginação
- 10 itens por página (padrão)
- Carregamento sob demanda
- Navegação rápida

## 🐛 Resolução de Problemas

### Não consigo fazer login
1. Verifique se o backend está rodando
2. Confirme as credenciais
3. Verifique o console do navegador (F12)
4. Limpe o localStorage: `localStorage.clear()`

### Dados não aparecem
1. Verifique conexão com API
2. Olhe o Network tab (F12)
3. Confirme que há dados no backend
4. Tente fazer refresh (F5)

### Erro "Token inválido"
1. Faça logout
2. Limpe o localStorage
3. Faça login novamente

## 📱 Atalhos de Teclado

- `Alt + L` - Fazer logout
- `F5` - Atualizar página
- `Esc` - Fechar dialogs
- `Enter` - Confirmar formulários

## 🎨 Personalização

### Cores do Sistema
- **Primária**: #17988B (Verde-azulado)
- **Secundário**: #F3F4F6 (Cinza claro)
- **Sucesso**: #10B981 (Verde)
- **Erro**: #EF4444 (Vermelho)
- **Aviso**: #F59E0B (Laranja)

### Tema
- Sistema usa tema claro
- Cores suaves e profissionais
- Alto contraste para legibilidade

## 📊 Estrutura de Dados

### Curso
```typescript
{
  id: number
  nome: string
  createdAt: string
  updatedAt: string
}
```

### Jogador
```typescript
{
  id: number
  nome: string
  rm: string
  curso_id: number
  curso: { id, nome }
  createdAt: string
  updatedAt: string
}
```

### Time
```typescript
{
  id: number
  nome: string
  curso_id: number
  jogador1_id: number
  jogador2_id: number
  suporte_id: number
  cadastrado_por: string
  data_cadastro: string
  curso: { id, nome }
  jogador1: { id, nome, rm }
  jogador2: { id, nome, rm }
  suporte: { id, nome, rm }
  createdAt: string
  updatedAt: string
}
```

## 🎓 Regras de Negócio

### Cursos
- Nome único
- Não pode excluir se houver jogadores
- Não pode excluir se houver times

### Jogadores
- RM único
- Deve estar vinculado a um curso
- Não pode excluir se estiver em times

### Times
- Nome único
- 3 jogadores obrigatórios
- Jogadores devem ser diferentes
- Todos do mesmo curso
- Não é possível alterar o curso após criação

## 💡 Boas Práticas

1. **Sempre cadastre cursos primeiro**
2. **Cadastre múltiplos jogadores por curso**
3. **Verifique dados antes de excluir**
4. **Use a busca para encontrar rapidamente**
5. **Mantenha RMs organizados**
6. **Nomeie times de forma clara**

## 📞 Suporte Técnico

Em caso de problemas:
1. Verifique os logs do console
2. Confirme status do backend
3. Teste as rotas da API
4. Verifique a documentação da API

---

**Sistema desenvolvido para UNIFUNEC** 🎮

