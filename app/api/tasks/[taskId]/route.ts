import { NextRequest } from 'next/server';
import { db, taskItems } from '@/drizzle/db';
import { eq } from 'drizzle-orm';

interface UpdateTaskBody { title?: string; completed?: boolean }

type ParamInput = { params: { taskId: string } } | { params: Promise<{ taskId: string }> };

async function extractParams(input: ParamInput): Promise<{ taskId: string }> {
  const value = 'then' in input.params ? await input.params : input.params;
  return value;
}

export async function PUT(req: NextRequest, context: ParamInput) {
  const { taskId } = await extractParams(context);
  if (!taskId) return new Response(JSON.stringify({ error: 'Missing taskId'}), { status: 400 });
  try {
    const body = (await req.json()) as UpdateTaskBody;
    const update: Record<string, unknown> = {};
    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || !body.title.trim()) {
        return new Response(JSON.stringify({ error: 'Invalid title' }), { status: 400 });
      }
      update.title = body.title.trim();
    }
    if (body.completed !== undefined) {
      if (typeof body.completed !== 'boolean') {
        return new Response(JSON.stringify({ error: 'Invalid completed' }), { status: 400 });
      }
      update.completed = body.completed;
    }
    if (Object.keys(update).length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), { status: 400 });
    }
    // Always refresh updatedAt at DB level by setting explicitly
    update.updatedAt = new Date();
    const [row] = await db.update(taskItems).set(update).where(eq(taskItems.id, taskId)).returning();
    if (!row) return new Response(JSON.stringify({ error: 'Task not found'}), { status: 404 });
    return Response.json(row);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Server error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: ParamInput) {
  const { taskId } = await extractParams(context);
  if (!taskId) return new Response(JSON.stringify({ error: 'Missing taskId'}), { status: 400 });
  const [row] = await db.delete(taskItems).where(eq(taskItems.id, taskId)).returning();
  if (!row) return new Response(JSON.stringify({ error: 'Task not found'}), { status: 404 });
  return new Response(null, { status: 204 });
}
