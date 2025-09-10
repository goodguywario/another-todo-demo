import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './db';

async function main() {
  try {
    // Cast due to known drizzle typing issue with $client extension
    await migrate(db as any, { migrationsFolder: './drizzle/migrations' });
    console.log('Migrations applied');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
