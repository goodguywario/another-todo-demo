import 'dotenv/config';
import { db, users, taskItems } from './db';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('Seeding data...');

  // Upsert style: check if users exist first.
  const existing = await db.select().from(users).where(eq(users.name, 'Ricky'));
  if (existing.length === 0) {
    await db.insert(users).values([{ name: 'Ricky' }, { name: 'Bobby' }]).returning();
    console.log('Inserted users Ricky & Bobby');
  } else {
    console.log('Users already exist, skipping user insert');
  }

  const allUsers = await db.select().from(users);
  const ricky = allUsers.find(u => u.name === 'Ricky');
  const bobby = allUsers.find(u => u.name === 'Bobby');
  if (!ricky || !bobby) throw new Error('Required users missing');

  // Ensure at least one NASCAR themed task each with required titles
  const tasks = await db.select().from(taskItems);
  const hasGoFast = tasks.some(t => t.title === 'Go fast!' && t.authorId === ricky.id);
  const hasGoFaster = tasks.some(t => t.title === 'Go faster!' && t.authorId === bobby.id);

  const inserts = [] as { title: string; authorId: string }[];
  if (!hasGoFast) inserts.push({ title: 'Go fast!', authorId: ricky.id });
  if (!hasGoFaster) inserts.push({ title: 'Go faster!', authorId: bobby.id });
  // Add a couple extra flavor tasks if not present
  if (!tasks.some(t => t.title === 'Tune engine')) inserts.push({ title: 'Tune engine', authorId: ricky.id });
  if (!tasks.some(t => t.title === 'Change tires')) inserts.push({ title: 'Change tires', authorId: bobby.id });

  if (inserts.length) {
    await db.insert(taskItems).values(inserts);
    console.log(`Inserted ${inserts.length} task(s).`);
  } else {
    console.log('No new tasks to insert');
  }

  console.log('Seed complete.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
