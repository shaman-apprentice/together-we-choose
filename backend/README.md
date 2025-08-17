## Local Development

1. Copy `.env.example` to `.env` (and optionally `.env.local`) and adjust the values.
2. Install dependencies and run migrations.

```
npm install
npm run migration:run
npm run start
```

## Migrations

- `npx typeorm-ts-node-commonjs migration:create src/database/migrations/<name>` – create a new migration
- `npx typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts` – apply pending migrations
- `npx typeorm-ts-node-commonjs migration:revert -d src/database/data-source.ts` – roll back the latest migration
