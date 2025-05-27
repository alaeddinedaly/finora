import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { title, targetAmount, savedAmount, dueDate, userId } =
      await request.json();

    if (!title || !targetAmount || !dueDate) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const response = await sql`
      INSERT INTO goals (goal_title, target_amount, current_amount, deadline,user_id)
      VALUES (${title}, ${targetAmount}, ${savedAmount || 0}, ${dueDate}, ${userId})
    `;

    return new Response(JSON.stringify({ data: response }), { status: 201 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const user_id = searchParams.get("user_id");
    const isRecent = searchParams.get("recent");

    if (!user_id) {
      return Response.json(
        { error: "Missing user_id parameter" },
        { status: 400 },
      );
    }

    let response;
    if (isRecent === "true") {
      response = await sql`
        SELECT * FROM goals WHERE user_id = ${user_id} ORDER BY id DESC LIMIT 1
      `;
    } else {
      response = await sql`
        SELECT * FROM goals WHERE user_id = ${user_id}
      `;
    }

    return new Response(JSON.stringify({ data: response }), { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { userId, title } = await request.json();

    if (!userId || !title) {
      return Response.json(
        { error: "Missing required fields: userId and title are required" },
        { status: 400 },
      );
    }

    const response = await sql`
      DELETE FROM goals
      WHERE user_id = ${userId} AND goal_title = ${title}
    `;

    return new Response(
      JSON.stringify({ message: "Goal deleted successfully" }),
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log(err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const {
      userId,
      originalTitle,
      newTitle,
      savedAmount,
      targetAmount,
      dueDate,
    } = await request.json();

    // Validate required fields
    if (!userId || !originalTitle) {
      return Response.json(
        {
          error:
            "Missing required fields: userId and originalTitle are required",
        },
        { status: 400 },
      );
    }

    const response = await sql`
      UPDATE goals
      SET 
        goal_title = ${newTitle},
        current_amount = ${savedAmount},
        target_amount = ${targetAmount},
        deadline = ${dueDate}
      WHERE user_id = ${userId} AND goal_title = ${originalTitle}
    `;

    return new Response(
      JSON.stringify({ message: "Goal updated successfully" }),
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log(err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
