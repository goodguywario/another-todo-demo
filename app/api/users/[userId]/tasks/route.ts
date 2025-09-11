import { NextRequest } from 'next/server';
import { db, users, taskItems } from '@/drizzle/db';
import { eq } from 'drizzle-orm';

interface CreateTaskBody { title: string }

type ParamInput = { params: { userId: string } } | { params: Promise<{ userId: string }> };

async function extractParams(input: ParamInput): Promise<{ userId: string }> {
  const value = 'then' in input.params ? await input.params : input.params;
  return value;
}

export async function GET(_req: NextRequest, context: ParamInput) {
  const { userId } = await extractParams(context);
  if (!userId) return new Response(JSON.stringify({ error: 'Missing userId'}), { status: 400 });
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return new Response(JSON.stringify({ error: 'User not found'}), { status: 404 });
  const rows = await db.select().from(taskItems).where(eq(taskItems.authorId, userId)).orderBy(taskItems.createdAt);
  return Response.json(rows);
}

export async function POST(req: NextRequest, context: ParamInput) {
  const { userId } = await extractParams(context);
  if (!userId) return new Response(JSON.stringify({ error: 'Missing userId'}), { status: 400 });
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return new Response(JSON.stringify({ error: 'User not found'}), { status: 404 });
  try {
    const body = (await req.json()) as Partial<CreateTaskBody>;
    if (!body || typeof body.title !== 'string' || !body.title.trim()) {
      return new Response(JSON.stringify({ error: 'Title required' }), { status: 400 });
    }
    const [inserted] = await db.insert(taskItems).values({ title: body.title.trim(), authorId: userId }).returning();
    return new Response(JSON.stringify(inserted), { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Server error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
