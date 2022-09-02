# AuthNestJS.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# craete/restart Docker image for Postgres DB 
$ npm run db:dev:restart

# migrate db
$ npm run prisma:dev:deploy

# start and watch server
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

## License

Nest is [MIT licensed](LICENSE).
