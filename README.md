# foodexplorer-back


# Food Explorer- API Restful

Projeto final desenvolvido no programa Explorer da Rocketseat

## Sobre o projeto

A aplicação  é um cardápio digital para um restaurante fictício.


## Tecnlogias utilizadas

- NodeJS
- Express
- SQLite
- Knex
- Cors
- Multer

## Funcionalidades

- Autenticação JWT

- Upload de imagens

- Persitência de dados no localstorage

- API Rest (Própria)

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/vinihasselmann/foodExplorer-back.git
```

Entre no diretório do projeto

```bash
  cd foodExplorer-Back
```

Instale as dependências

```bash
  yarn install
```

Rode as migrations e o seed

```bash
  yarn migrate
  yarn seed
```

Inicie o servidor

```bash
  yarn dev
```

### Admin login
- email: admin@email.com
- password: 112233

O servidor iniciará na porta 3333 - vá para http://localhost:3333