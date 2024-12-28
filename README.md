<h1> Instruções</h1>
<ul>
<li>
<h2>Baixar do GitHub</h2>
<p>
  É necessário rodar em separado o front e back da aplicação, com preferência do backend primeiramente. Você pode baixar o arquivo zipado pelo github ou usar git pull tal qual na instrução do próprio github para baixar o arquivo.
</li>
<li>
<h2>PostgreSQL e arquivo .env</h2>
</p>
  É necessário ter em seu postgreSQL um banco já criado com o mesmo nome que será utilizado aqui. Crie no seu backend (pasta raíz dele) um arquivo .env com a seguinte estrutura:
</p>
<br>
<p>
  DB_HOST: <br>
  DB_PORT: <br>
  DB_USERNAME: <br>
  DB_PASSWORD: <br>
  DB_NAME: <br>

  TWILIO_AUTH_TOKEN: <br> 
  TWILIO_ACCOUNT_SID: <br>
  TWILIO_PHONE_NUMBER: <br>

  MAILGUN_USERNAME: <br>
  MAILGUN_PASSWORD: <br>
  FROM_EMAIL: <br>
<p>
<br>
<p>
  Preencha os campos conforme seus dados do PostgreSQL, suas informações do Twilio (para sistema de SMS) e Mailgun (para envio de e-mails). Caso não tenha interesse, você pode comentar a função que os inicia (em src/api/agendamento/agendamento.service -> comentar cada chamada a email ou sms ou descomentar) ou a própria função em si em src/api/notificacao/notificacao.service. O envio de SMS está atualmente comentado para propósitos da apresentação deste TCC. É necessário configurar a lista de e-mails permitidos conforme os do seu Mailgun (caso versão gratuita) para que seja realizado o envio sem erros.
</p>
</li>
<li>
<h2>Comandos do BackEnd / Inicialização</h2>
<p>
  É necessário ter o NodeJS instalado em sua máquina ou de maneira local ao projeto (https://nodejs.org).<br>
  Após baixar o projeto, use o comando "npm i" no terminal de seu diretório. Ele irá baixar todos os componentes necessários da aplicação. Em seguida, utilize ou o comando "npm run start" ou o "nest start" para rodar a aplicação. Ele irá criar as tabelas necessárias no postgreSQL - a conexão com o Twilio e Mailgun somente é feita ao realizar um agendamento, caso não tenha comentado esse trecho.
  O próprio terminal lhe dará qual a porta do localhost(talvez seja necessário rodar o comando npm run start:dev), normalmente sendo http://localhost:3000/
  <br>
  Você pode utilizar estes endpoints com algo como o Postman para testes e deve utiliza-la na configuração do arquivo .env do frontend deste aplicação.
</p>
<br>
<p>
  Para verificar as endpoints disponíveis e o que fazem cada uma, pode utilizar a endpoint http://localhost:3000/api.
</p>
</li>
</ul>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
