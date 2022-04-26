# Hasura Curriculum Instance

## Prerequisites

You'll need the following services installed and running on your machine to run this instance locally

- [Postgres](https://www.postgresql.org/docs/current/installation.html)
- [Docker](https://docs.docker.com/get-docker/)

You'll also need to (within this directory) run:

```bash
cp .env.example .env
```

and fill in the incomplete values by asking another member of the team.

## Getting Started

These instructions will load and start a docker image for both the postgres instance and the graphql-engine which connects to it.

1. To pull down the docker images (if necessary), and build and start them, run:

```bash
npm run hasura:curriculum:start
```

1. The first time you run this service (or any time it gets out of sync), run:

```bash
npm run hasura:curriculum:migrations:apply
# then
npm run hasura:curriculum:metadata:apply
```

1. If you want to make any changes to the database, you must do it through the console (so that migrations and metadata are tracked), run:

```bash
npm run hasura:curriculum:console
```

1. To stop the instances, you can run:

```bash
npm run hasura:curriculum:stop
```
