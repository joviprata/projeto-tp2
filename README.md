# Global Market - Sistema de Comparação de Preços

O **Global Market** é uma aplicação web completa para comparação de preços de produtos em diferentes supermercados. O sistema permite que usuários consultem preços, criem listas de compras e solicitem novos produtos, enquanto administradores podem gerenciar o catálogo e validar informações.

## Funcionalidades Principais

### Para Clientes:
- **Consulta de Produtos**: Busca por produtos com preços atualizados de diferentes supermercados
- **Comparação de Preços**: Visualização dos melhores preços por estabelecimento
- **Listas de Compras**: Criação e gerenciamento de listas personalizadas
- **Solicitação de Produtos**: Requisição de novos produtos ou preços não cadastrados
- **Sistema de Notificações**: Feedback em tempo real das ações realizadas

### Para Administradores:
- **Gestão de Produtos**: Cadastro, edição e remoção de produtos
- **Gerenciamento de Preços**: Validação e atualização de registros de preços
- **Administração de Usuários**: Controle de acesso e permissões
- **Dashboard Administrativo**: Painel para aprovação de solicitações

### Arquitetura:
- **Frontend**: Next.js 15 com React 19 e TypeScript
- **Backend**: Node.js com Express e Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Documentação**: Swagger/OpenAPI
- **Containerização**: Docker e Docker Compose
- **Testes**: Jest com cobertura de código

## Pré-requisitos

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/pt) (versão 18 ou superior)

## Como Rodar o Projeto

### Configuração Inicial

**No Windows**: Inicie o Docker Desktop antes de prosseguir.

1. **Primeira instalação** - Na pasta raiz do projeto:
   ```bash
   npm run install
   ```

2. **Iniciar containers**:
   ```bash
   npm run start
   ```

3. **IMPORTANTE**: Na primeira execução ou após alterações no schema do banco:
   ```bash
   npm run prisma:migrate
   ```

### Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run start` | Inicia todos os containers da aplicação |
| `npm run stop` | Para todos os containers |
| `npm run prisma` | Abre o Prisma Studio para visualizar o banco |
| `npm run prisma:generate` | Regenera o cliente Prisma após mudanças no schema |
| `npm run prisma:migrate` | Aplica migrações do banco de dados |
| `npm run logs` | Visualiza logs dos containers |

### Testes

```bash
# Executar todos os testes
npm run test

# Testes apenas do backend
npm run test:backend

# Testes do backend com cobertura
npm run test:backend:coverage
```

> **Dica**: Após executar os testes com cobertura, abra o arquivo `backend/coverage/lcov-report/index.html` no navegador para visualizar o relatório detalhado.

## Acesso às Aplicações

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | [http://localhost:3000](http://localhost:3000) | Interface principal da aplicação |
| **Backend API** | [http://localhost:3001](http://localhost:3001) | API REST |
| **Docs API** | [http://localhost:3001/api-docs/#/](http://localhost:3001/api-docs/#/) | Documentação da API |
| **Prisma Studio** | [http://localhost:5555](http://localhost:5555) | Interface para visualização do banco de dados |

## Banco de Dados

O sistema utiliza PostgreSQL com as seguintes entidades principais:

- **Users**: Usuários do sistema (clientes e administradores)
- **Products**: Catálogo de produtos com código de barras
- **Supermarkets**: Estabelecimentos comerciais
- **PriceRecords**: Registros de preços por produto/supermercado
- **ShoppingLists**: Listas de compras dos usuários
- **ListItems**: Itens das listas de compras

## Tecnologias Utilizadas

### Frontend
- **Next.js 15**: Framework React para produção
- **React 19**: Biblioteca para interfaces de usuário
- **TypeScript**: Superset JavaScript com tipagem estática
- **CSS Modules**: Estilização com escopo local

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web para APIs
- **Prisma**: ORM moderno para TypeScript/JavaScript
- **PostgreSQL**: Banco de dados relacional
- **Swagger**: Documentação automática da API
- **Winston**: Sistema de logging
- **Jest**: Framework de testes

### DevOps
- **Docker**: Containerização da aplicação
- **Docker Compose**: Orquestração de containers

## Solução de Problemas

- **Erro de permissão**: Verifique se o Docker está rodando
- **Erro de porta ocupada**: Certifique-se de que as portas 3000, 3001 e 5555 estão livres
- **Erro de migração**: Execute `npm run prisma:migrate` após alterações no schema
- **Erro de dependências**: Verifique a versão do npm e faça upgrade se necessário
- **Erro de Imagem e volumes**: Remover imagens e volumes antigas do Docker
