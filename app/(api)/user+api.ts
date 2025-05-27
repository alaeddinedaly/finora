import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const response =
      await sql`INSERT INTO users(name,email,clerk_id) VALUES (${name},${email},${clerkId})`;
    return new Response(JSON.stringify({ data: response }), { status: 201 });
  } catch (err) {
    console.log(err);
    return Response.json(
      JSON.stringify({
        error: err,
      }),
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, email, image_url, userId } = await request.json();

    if (!name || !email || !image_url || !userId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const response = await sql`
      UPDATE users
      SET name = ${name}, email = ${email}, image_url = ${image_url}
      WHERE clerk_id = ${userId}
    `;

    return Response.json(
      { message: "User updated successfully", data: response },
      { status: 200 },
    );
  } catch (err) {
    console.error("PATCH error:", err);
    return Response.json(
      {
        error: "Internal server error",
        details: err instanceof Error ? err.message : err,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("id");

    if (!clerkId) {
      return Response.json(
        { error: "Missing required ClerkId" },
        { status: 400 },
      );
    }

    const response = await sql`SELECT * from users WHERE clerk_id = ${clerkId}`;
    return new Response(JSON.stringify({ data: response }), { status: 201 });
  } catch (err) {
    console.log(err);
    return Response.json(
      JSON.stringify({
        error: err,
      }),
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("id");

    if (!clerkId) {
      return Response.json(
        { error: "Missing required ClerkId" },
        { status: 400 },
      );
    }

    const result = await sql`DELETE FROM users WHERE clerk_id = ${clerkId}`;

    return Response.json(
      { message: "User deleted successfully", result },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to delete user", details: err },
      { status: 500 },
    );
  }
}
