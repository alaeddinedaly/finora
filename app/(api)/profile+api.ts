import { neon } from "@neondatabase/serverless";
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { clerk_id, image_url } = body;

    if (!clerk_id || !image_url) {
      return new Response(
        JSON.stringify({ error: "Missing email or image_url" }),
        { status: 400 },
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`
      UPDATE users
      SET image_url = ${image_url}
      WHERE clerk_id = ${clerk_id}
        RETURNING *;
    `;

    if (response.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ data: response[0] }), { status: 200 });
  } catch (err) {
    console.error("PATCH error:", err);
    return new Response(JSON.stringify({ error: "Failed to update user" }), {
      status: 500,
    });
  }
}
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");
  const isSummary = searchParams.get("summary");

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    let result;

    if (isSummary === "true") {
      if (!userId) {
        return new Response(JSON.stringify({ error: "Missing userId" }), {
          status: 400,
        });
      }
      result = await sql`
        SELECT
          (
            SELECT COUNT(*) FROM credit_cards
            WHERE user_id = ${userId}
          ) AS card_count,
          (
            SELECT COUNT(*) FROM transactions
            WHERE user_id = ${userId}
          ) AS transaction_count,
          (
            SELECT COUNT(*) FROM goals
            WHERE user_id = ${userId}
          ) AS goal_count
      `;
    } else {
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Missing email or userId" }),
          {
            status: 400,
          },
        );
      }
      result = await sql`
        SELECT image_url FROM users WHERE clerk_id = ${userId};
      `;
    }

    if (!result || result.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ data: result[0] }), { status: 200 });
  } catch (err) {
    console.error("GET /profile error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
