---
name: migration
description: "Generate database or code migration scripts. Use when the user says /migration, asks to create a migration, add a database column, change a schema, migrate data, or refactor code across a codebase. Triggers: migration, migrate, schema change, add column, alter table, database migration, data migration, code migration, upgrade path."
---

# Migration Generator

Generate safe, reversible migration scripts for databases and code.

## Workflow

1. **Detect the migration framework:**
   - **SQL/ORM migrations**: Prisma, Drizzle, Knex, TypeORM, Sequelize, Alembic, Django, Rails ActiveRecord, Flyway, Liquibase, golang-migrate.
   - **Schema files**: Check for `prisma/schema.prisma`, `drizzle/`, `migrations/`, `alembic/`, `db/migrate/`, etc.
   - If no framework detected, generate raw SQL migrations.

2. **Understand the change:**
   - What is being added, modified, or removed?
   - What existing data needs to be preserved or transformed?
   - Are there foreign key or index implications?

3. **Generate the migration:**

### For Schema Migrations (DDL)

- **Up migration**: Apply the change.
- **Down migration**: Reverse the change (when possible).
- Use the framework's migration generator if available (e.g., `npx prisma migrate dev`, `rails generate migration`).

### For Data Migrations

- Batch large updates to avoid locking.
- Include progress logging for long-running migrations.
- Handle null values and edge cases.
- Make data migrations idempotent when possible.

4. **Safety checks:**
   - Will this lock a large table? Warn about downtime.
   - Is the migration reversible? If not, document why.
   - Does it handle zero-downtime deployment? (e.g., add column → backfill → add constraint, not all at once).
   - Are there dependent migrations that need to run first?

5. **Generate a migration plan** for complex changes:

```
Step 1: Add new nullable column (no downtime)
Step 2: Backfill data (background job)
Step 3: Update application code to write to new column
Step 4: Add NOT NULL constraint
Step 5: Remove old column (next release)
```

## Guidelines

- Always generate both up and down migrations when the framework supports it.
- Use transactions where supported (PostgreSQL, not MySQL DDL).
- Name migrations descriptively: `add_email_verified_to_users`, not `migration_042`.
- For destructive changes (drop column, drop table), add a confirmation warning.
- Consider the deploy strategy: can the old and new code run simultaneously?
- Test migrations against a copy of production data when possible.
- Include comments explaining *why* the migration exists.
