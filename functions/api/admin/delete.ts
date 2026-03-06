import { neon } from "@neondatabase/serverless";

interface Env {
  DATABASE_URL: string;
  ADMIN_PASSWORD: string;
}

interface DeleteRequest {
  ids: string[];
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  // Check auth
  const authHeader = context.request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  const credentials = atob(authHeader.slice(6));
  const [, password] = credentials.split(":");

  if (password !== context.env.ADMIN_PASSWORD) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  try {
    const sql = neon(context.env.DATABASE_URL);
    const data: DeleteRequest = await context.request.json();

    if (!data.ids || !Array.isArray(data.ids) || data.ids.length === 0) {
      return new Response(
        JSON.stringify({ error: "No IDs provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Delete businesses by IDs
    const placeholders = data.ids.map((_, i) => `$${i + 1}`).join(", ");
    const query = `DELETE FROM "Business" WHERE id IN (${placeholders}) RETURNING id`;
    const result = await sql.query(query, data.ids);
    const rows = result.rows || result;

    return new Response(
      JSON.stringify({
        success: true,
        deleted: rows.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Admin delete error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete businesses" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
