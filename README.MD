# Intro

CRUD nodejs app with authentication using JWT is sent via http-only cookie. The server will be available at `http://localhost:8081`. The app uses "dockerized" PostgresSQL and Seqeulize.


## Endpoints: 
    - login, register, update, delete

## Example: 
    localhost:8081/user/login
    

1. **Install the dependencies:**

```sh
yarn install
```

2. **Build the project:**

```sh
yarn run build
```
(in .swcrc check baseUrl)
3. **docker:**

```sh
docker compose up -d
```

4. **run dev:**
```sh
yarn run dev
```

(export NODE_ENV=development)

## Testing

Basic the Jest test:

```sh
yarn run test
``

##  Dependencies
Node JS v18.15.0 
Yarn: `npm i -g yarn`
Docker  - https://www.docker.com/products/docker-desktop/