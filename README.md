# Aplicativo de Tarefas (Todo App)

Um aplicativo de tarefas full-stack com autenticação de usuário, gerenciamento de tarefas e uma simples interface de usuário com tema dark. Esse aplicativo foi desenvolvido para um desafio técnico.

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Documentação da API](#documentação-da-api)
- [Segurança](#segurança)
- [Licença](#licença)

## Funcionalidades

- Registro e autenticação de usuários
- Criar, ler, atualizar e excluir tarefas
- Interface de usuário responsiva com tema escuro
- API segura com autenticação JWT
- Criptografia HTTPS

## Tecnologias

- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Banco de Dados**: MongoDB com Mongoose ODM
- **Cache**: Redis
- **Autenticação**: JSON Web Tokens (JWT)
- **Documentação da API**: Swagger/OpenAPI
- **Implantação**: Heroku

## Documentação da API

A documentação da API está disponível via Swagger UI. Após iniciar o servidor backend, visite:

```
http://localhost:3000/api-docs
```
## Segurança

Este aplicativo implementa várias medidas de segurança:

- Criptografia HTTPS
- JWT para autenticação
- Política de Segurança de Conteúdo (CSP)
- HTTP Strict Transport Security (HSTS)

## Licença

Este projeto está licenciado sob a Licença MIT.