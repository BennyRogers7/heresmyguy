import { neon } from "@neondatabase/serverless";

interface Env {
  DATABASE_URL: string;
  ADMIN_PASSWORD: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
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
    const url = new URL(context.request.url);

    // Parse query params
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const search = url.searchParams.get("search") || "";
    const state = url.searchParams.get("state") || "";
    const hasWebsite = url.searchParams.get("hasWebsite") || "all";
    const ratingFilter = url.searchParams.get("rating") || "all";

    const offset = (page - 1) * limit;

    // Build WHERE clauses
    const conditions: string[] = [];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`LOWER(name) LIKE LOWER($${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (state) {
      conditions.push(`state = $${paramIndex}`);
      params.push(state);
      paramIndex++;
    }

    if (hasWebsite === "yes") {
      conditions.push(`"hasWebsite" = true`);
    } else if (hasWebsite === "no") {
      conditions.push(`"hasWebsite" = false`);
    }

    if (ratingFilter === "below3") {
      conditions.push(`(rating IS NULL OR rating < 3)`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM "Business" ${whereClause}`;
    const countResult = await sql.query(countQuery, params);
    const countRows = countResult.rows || countResult;
    const total = parseInt(countRows[0]?.total as string) || 0;

    // Get businesses
    const query = `
      SELECT id, name, slug, city, state, "verticalSlug", phone, website, rating, "hasWebsite", "reviewCount"
      FROM "Business"
      ${whereClause}
      ORDER BY name ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const businessParams = [...params, limit, offset];

    const businessesResult = await sql.query(query, businessParams);
    const businesses = businessesResult.rows || businessesResult;

    // Get distinct states for filter
    const statesQuery = `SELECT DISTINCT state FROM "Business" ORDER BY state`;
    const statesResult = await sql.query(statesQuery, []);
    const statesRows = statesResult.rows || statesResult;
    const states = statesRows.map((r: { state: string }) => r.state);

    return new Response(
      JSON.stringify({
        businesses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        states,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Admin businesses error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch businesses" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
