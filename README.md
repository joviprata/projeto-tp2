## Projeto TP2

## Instale o Docker e Node

- [Docker](https://www.docker.com/)
- [Node](https://nodejs.org/pt)

## Como Rodar o projeto

- **No windowns** Inicie o docker Desktop antes
- Na pasta raiz do projeto e se for a primeira vez

  ```
  npm run install
  ```

- inicie o container
  ```
  npm run start
  ```
  **IMPORTANTE**: Caso seja a primeira vez rodando, ou alguém tenha realizado alterações no schema do banco de dados, rode:
  ```
    npm run prisma:migrate
  ```
- Caso queria parar o container
  ```
  npm run stop
  ```
- Caso queira visualizar o banco de dados
  ```
  npm run prisma
  ```
- Caso queria rodar os testes
  ```
  npm run test //Roda todos os Testes tanto do frontend como do backend
  npm run test:frontend //Roda so o do frontend
  npm run test:backend //Roda so o do backend
  npm run test:backend:coverage // Rodas os testes do backend com cobertura de testes podesse abrir no navegador a cobertura na pasta gerada pelo comando ela fica em backend/coverage/lcov-report entao abre o arquivo index.html
  ```
- Caso tenha alterado o banco de dados
  ```
  npm run prisma:generate
  ```
- Caso de algum erro veja os logs
  ```
  npm run logs
  ```

**Importante**: Em caso de erro, verifique a versão instalada do npm e tenta fazer o upgrade dela.

## Portas da aplicação

| Aplicação |     Porta      |
| --------- | :------------: |
| FrontEnd  | localhost:3000 |
| BackEnd   | localhost:3001 |
| Prisma    | localhost:5555 |
