# Hasura Users Instance

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
npm run hasura:users:start
```

1. The first time you run this service (or any time it gets out of sync), run:

```bash
npm run hasura:users:migrations:apply
# then
npm run hasura:users:metadata:apply
```

1. If you want to make any changes to the database, you must do it through the console (so that migrations and metadata are tracked), run:

```bash
npm run hasura:users:console
```

1. To stop the instances, you can run:

```bash
npm run hasura:users:stop
```

## Deployment

### [TODO] Github Integration

https://hasura.io/docs/latest/graphql/cloud/projects/github-integration/

### Deploying changes

If you make changes locally through the console, migration and metadata files will be generated.

To apply these changes to your deployed instance, run the following from within this directory:

```bash
hasura migrate apply --endpoint <endpoint> --admin-secret <admin-secret>
hasura metadata apply --endpoint <endpoint> --admin-secret <admin-secret>
```

### Creating a new deployment

To create a new deployment, complete the following steps:

1. Create a Hasura Cloud project ([instructions](https://hasura.io/docs/latest/graphql/cloud/getting-started/index/)). Make sure you connect to a database, if you "Connect existing database", use `PG_DATABASE_URL` env var.
2. Add the appropriate env vars for the project ([instructions](https://hasura.io/docs/latest/graphql/cloud/projects/env-vars/)):

```
HASURA_GRAPHQL_JWT_SECRET
CURRICULUM_DATA_GRAPHQL_ENDPOINT
CURRICULUM_DATA_HASURA_ADMIN_SECRET
```

3. From within this directory, run migrations and apply metadata:

```bash
hasura migrate apply --endpoint <endpoint> --admin-secret <admin-secret>
hasura metadata apply --endpoint <endpoint> --admin-secret <admin-secret>
```
