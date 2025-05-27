import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, totalBalance, cardNumber, cardType, expiryDate, userId } =
      await request.json();

    if (!name || !totalBalance || !cardNumber || !cardType || !expiryDate) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const response = await sql`INSERT INTO 
    credit_cards(card_name,total_balance,card_number,card_type,expiry_date,user_id) 
    VALUES (${name},${totalBalance},${cardNumber},${cardType},${expiryDate},${userId})`;

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

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const userId = searchParams.get("user_id");
    const cardName = searchParams.get("card_name");
    const isName = searchParams.get("name");
    const selected = searchParams.get("selected");
    const isBalance = searchParams.get("balance");

    let response;

    if (isName === "true") {
      response =
        await sql`SELECT card_name from credit_cards WHERE user_id = ${userId}`;
    } else if (selected === "true") {
      response =
        await sql`SELECT * from credit_cards WHERE user_id = ${userId} AND card_name = ${cardName}`;
    } else if (isBalance === "true") {
      response = await sql`
        SELECT SUM(total_balance::numeric) AS total_balance_sum
        FROM credit_cards
        WHERE user_id = ${userId};`;
    } else {
      response =
        await sql`SELECT * from credit_cards WHERE user_id = ${userId}`;
    }

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
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const userId = searchParams.get("user_id");
    const cardName = searchParams.get("card_name");

    if (!userId || !cardName) {
      return new Response(
        JSON.stringify({ error: "Missing user_id or card_name" }),
        {
          status: 400,
        },
      );
    }

    const { addedAmount } = await request.json();

    if (typeof addedAmount !== "number") {
      return new Response(
        JSON.stringify({ error: "Invalid addedAmount value" }),
        {
          status: 400,
        },
      );
    }

    const response = await sql`
      UPDATE credit_cards
      SET total_balance = (COALESCE(total_balance, '0')::numeric + ${addedAmount})::varchar
      WHERE user_id = ${userId} AND card_name = ${cardName}
      RETURNING *;
    `;

    return new Response(JSON.stringify({ data: response[0] }), { status: 200 });
  } catch (err) {
    console.error("PATCH /credit_cards error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { userId, cardName } = await request.json();

    if (!userId || !cardName) {
      return Response.json(
        { error: "Missing required fields: userId and cardName are required" },
        { status: 400 },
      );
    }

    const response = await sql`
      DELETE FROM credit_cards
      WHERE user_id = ${userId} AND card_name = ${cardName}
    `;

    return new Response(
      JSON.stringify({ message: "Card deleted successfully" }),
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
