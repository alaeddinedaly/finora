import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing user_id" }), {
      status: 400,
    });
  }

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql`
      SELECT name,color FROM categories WHERE user_id = ${userId}
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({ data: [] }), { status: 200 });
    }

    return new Response(JSON.stringify({ data: result }), { status: 200 });
  } catch (err) {
    console.error("GET /category error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  const { name, userId, color } = await request.json();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing user_id" }), {
      status: 400,
    });
  }

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const result = await sql`
      INSERT INTO categories(name,user_id,color) VALUES(${name}, ${userId},${color})
    `;

    return new Response(JSON.stringify({ data: result }), { status: 200 });
  } catch (err) {
    console.error("GET /category error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
