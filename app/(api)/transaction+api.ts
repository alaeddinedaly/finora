import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { id, reason, amount, type, date, category, userId } =
      await request.json();

    if (!reason || !amount || !type) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const response = await sql`
      INSERT INTO transactions(title, amount, type, date, card_id, category, user_id)
      VALUES (${reason}, ${amount}, ${type}, ${date}, ${id}, ${category}, ${userId})
    `;

    return new Response(JSON.stringify({ data: response }), { status: 201 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const url = new URL(request.url);

    const userId = url.searchParams.get("user_id");
    const cardName = url.searchParams.get("card_name");
    const isRecent = url.searchParams.get("recent");
    const isData = url.searchParams.get("data");
    const weeklySpending = url.searchParams.get("weekly");
    const type = url.searchParams.get("type");
    const isAi = url.searchParams.get("ai");

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing user_id parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    let response;
    if (isRecent === "true") {
      response = await sql`
        SELECT * FROM transactions
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
          LIMIT 3;
      `;
    } else if (isAi === "true") {
      response = await sql`
        SELECT
          date AS date,
          amount,
          category,
          title
          FROM
          transactions
        WHERE
          user_id = ${userId}
        ORDER BY
          date DESC
          LIMIT 10;
      `;
    } else if (isData === "true") {
      response = await sql`
        SELECT category, SUM(amount::numeric) AS total_amount
        FROM transactions
        WHERE user_id = ${userId}
          AND type = 'expense'
          AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY category;
      `;
    } else if (type === "income" || type === "expense") {
      response = await sql`
        SELECT
          UPPER(TO_CHAR(created_at, 'DY')) AS day,
          SUM(ABS(CAST(amount AS NUMERIC))) AS total
        FROM transactions
        WHERE user_id = ${userId}
          AND type = ${type}
          AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY day
        ORDER BY MIN(created_at);
      `;
    } else if (weeklySpending === "true") {
      response = await sql`
        SELECT
          TO_CHAR(created_at::date, 'DY') AS day,
          SUM(ABS(CAST(amount AS FLOAT))) AS total
        FROM transactions
        WHERE user_id = ${userId}
          AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY day
        ORDER BY MIN(created_at);
      `;
    } else {
      if (!cardName) {
        return new Response(
          JSON.stringify({ error: "Missing card_name parameter" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
      response = await sql`
        SELECT * FROM transactions
        WHERE card_id = (
          SELECT id FROM credit_cards
          WHERE user_id = ${userId} AND card_name = ${cardName}
          LIMIT 1
          );
      `;
    }

    return new Response(JSON.stringify({ data: response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
