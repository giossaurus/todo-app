# Aplicativo de Tarefas (Todo App)

Um aplicativo de tarefas full-stack com autenticação de usuário, gerenciamento de tarefas e uma simples interface de usuário com tema dark. Esse aplicativo foi desenvolvido para um desafio técnico. 

Acesse o aplicativo aqui.

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

## Para melhora futura
- Por se tratar do Heroku, desde 2022 não fornece mais Redis gratuito e não tive tempo de subir na AWS, penso em usar outro serviço gratuito de Redis e subir o projeto na AWS.
- O UI precisa de melhorias, faria ele com React e componentes para melhor personalização.
- Melhorar a organização do CSS com algo mais simples como Tailwind.
- Adicionar uma biblioteca de idiomas para o site ser usado tanto em EN quanto PT, além de um botão para troca de linguas.
- Adicionar modo claro e escuro com botão.
- Implementar testes nos componentes do front-end e manter a documentação da API atualizada.

### O aplicativo funciona, é possivel criar, salvar e etc. Porém para apagar e atualizar é necessário manualmente recarregar o navegador. As demais funcões de registro e integração com banco de dados estão testadas e funcionado.

## Licença

Este projeto está licenciado sob a Licença MIT.