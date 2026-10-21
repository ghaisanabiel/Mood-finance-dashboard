MOOD Finance Dashboard

Status of this first drop:
Implemented and locally tested: finance calculation engine and unit tests.
Written, not yet migrated: Prisma schema (run db:validate, then db:migrate on a real Postgres).
Not started: auth, Shopee OAuth, sync, CSV import, dashboard UI.
Shopee endpoints, signatures and permissions: unverified.

Setup:
1. Copy .env.example to .env and fill in values.
2. npm install
3. npm test
