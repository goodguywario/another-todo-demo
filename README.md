This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database / Drizzle ORM

We use Postgres with Drizzle ORM.

1. Set environment variable in `.env`:

```
DATABASE_URL=postgres://user:password@localhost:5432/todo_demo
```

2. Schema lives in `drizzle/schema.ts`.

3. Generate SQL migrations from the schema:

```bash
pnpm db:generate
```

4. Apply migrations (creates tables):

```bash
pnpm db:migrate
```

5. (Optional) Push directly without migration files (not recommended for prod):

```bash
pnpm db:push
```

### Tables

- users
- task_items

### Columns

users:
- id (uuid pk)
- name (text)

task_items:
- id (uuid pk)
- title (text)
- author_id (uuid fk → users.id)
- completed (boolean)
- created_at (timestamptz default now())
- updated_at (timestamptz default now())

The ER relationship: one user has many task_items.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
