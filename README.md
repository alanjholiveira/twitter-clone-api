# Adonis API application

This is the boilerplate for creating an API server in AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Authentication JWT
3. CORS
4. Lucid ORM
5. Migrations and seeds
6. Validators

## Getting Started

Clone the project repository by running the command below if you use SSH.

```
git clone git@github.com:alanjholiveira/twitter-clone-api.git
```

If you use HTTPS, use this instead.

```
git clone https://github.com/alanjholiveira/twitter-clone-api.git
```

### Setup

Run the command below to install dependencies

```
npm install
```
or use yarn

```
yarn install
```

#### Environment variables

Rename `.env.example` to `.env`


##### Migrations

Setup your database and enter the following in .env


```
DB_CONNECTION=pg
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_DATABASE=tweetr
```

Run the following command to run startup migrations.

```
adonis migration:run
```

Finally, start the application:

```
adonis serve --dev
```
