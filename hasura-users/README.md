# Hasura Users Instance

## Prerequisites

You'll need the following installed on your machine to run this instance locally
- Postgres
- Docker

## Getting Started

1. To pull down the docker images (if necessary), and build and start them, run:
```sh
npm run hasura:users:start
```
1. The first time you run this service (or any time it gets out of sync), run:
```
npm run hasura:users:migrations:apply
# then
npm run hasura:users:metadata:apply
```
1. If you want to make any changes to the database, you must do it through the console (so that migrations and metadata are tracked), run:
```
npm run hasura:users:console
```
1. To stop the instances, you can run:
```sh
npm run hasura:users:stop
```