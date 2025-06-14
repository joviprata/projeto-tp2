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
  npm run start && npm run prisma:generate
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
  ```
- Caso tenha alterado o banco de dados
  ```
  npm run prisma:generate
  ```
- Caso de algum erro veja os logs
  ```
  npm run logs
  ```
