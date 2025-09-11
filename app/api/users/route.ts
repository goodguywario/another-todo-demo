import { NextRequest } from 'next/server';
import { db, users } from '@/drizzle/db';

export async function GET() {
  const rows = await db.select().from(users).orderBy(users.name);
  return Response.json(rows);
}

interface CreateUserBody { name: string }

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<CreateUserBody>;
    if (!body || typeof body.name !== 'string' || !body.name.trim()) {
      return new Response(JSON.stringify({ error: 'Name required' }), { status: 400 });
    }
    const [inserted] = await db.insert(users).values({ name: body.name.trim() }).returning();
    return new Response(JSON.stringify(inserted), { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Server error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
