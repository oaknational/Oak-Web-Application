# Hasura Users Instance

## Prerequisites

You'll need the following installed on your machine to run this instance locally
- Postgres
- Docker

## Getting Started

1. The first time you run this instance locally, you'll have to create a postgres database:
```sh
createdb oak_hasura_users_local
```
2. Build the docker container:
```sh
npm run hasura:users:setup
```
3. 