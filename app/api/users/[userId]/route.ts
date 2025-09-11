import { NextRequest } from 'next/server';
import { db, users, taskItems } from '@/drizzle/db';
import { eq } from 'drizzle-orm';

// Support Next.js potential promise params signature
 type ParamInput = { params: { userId: string } } | { params: Promise<{ userId: string }> };
 async function extract(input: ParamInput) { return 'then' in input.params ? await input.params : input.params; }

interface UpdateUserBody { name?: string }

export async function PUT(req: NextRequest, context: ParamInput) {
  const { userId } = await extract(context);
  if (!userId) return new Response(JSON.stringify({ error: 'Missing userId'}), { status: 400 });
  try {
    const body = (await req.json()) as UpdateUserBody;
    if (!body.name || !body.name.trim()) {
      return new Response(JSON.stringify({ error: 'Name required' }), { status: 400 });
    }
    const [row] = await db.update(users).set({ name: body.name.trim() }).where(eq(users.id, userId)).returning();
    if (!row) return new Response(JSON.stringify({ error: 'User not found'}), { status: 404 });
    return Response.json(row);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Server error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: ParamInput) {
  const { userId } = await extract(context);
  if (!userId) return new Response(JSON.stringify({ error: 'Missing userId'}), { status: 400 });
  // Optionally cascade delete tasks (tasks have FK ON DELETE CASCADE already)
  const [row] = await db.delete(users).where(eq(users.id, userId)).returning();
  if (!row) return new Response(JSON.stringify({ error: 'User not found'}), { status: 404 });
  return new Response(null, { status: 204 });
}
