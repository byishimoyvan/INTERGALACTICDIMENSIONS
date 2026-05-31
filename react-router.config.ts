import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const genreId = searchParams.get("genreId");
    const status = searchParams.get("status") || "approved";
    const sortBy = searchParams.get("sortBy");
    const search = searchParams.get("search");

    let query = `
      SELECT c.*, g.name as genre_name, um.username as owner_name
      FROM content c
      LEFT JOIN genres g ON c.genre_id = g.id
      LEFT JOIN users_meta um ON c.owner_id::text = um.id::text
      WHERE c.status = $1 AND c.is_private = false
    `;
    const params = [status];

    // When type is 'movie', include both movies and series
    if (type === "movie") {
      params.push("movie");
      params.push("series");
      query += ` AND c.type IN ($${params.length - 1}, $${params.length})`;
    } else if (type && type !== "all") {
      params.push(type);
      query += ` AND c.type = $${params.length}`;
    }

    if (genreId && genreId !== "all") {
      params.push(genreId);
      query += ` AND c.genre_id = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      query += ` AND (LOWER(c.title) LIKE $${params.length} OR LOWER(c.description) LIKE $${params.length})`;
    }

    if (sortBy === "views") {
      query += ` ORDER BY COALESCE(c.views, 0) DESC`;
    } else {
      query += ` ORDER BY c.created_at DESC`;
    }

    const content = await sql(query, params);
    return Response.json({ content });
  } catch (err) {
    console.error("GET /api/content error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userMeta =
      await sql`SELECT role, status FROM users_meta WHERE id = ${userId}`;

    const meta = userMeta[0];
    const isOwner = meta?.role === "owner";
    const isApprovedContributor =
      meta?.role === "contributor" && meta?.status === "approved";

    if (!meta || (!isOwner && !isApprovedContributor)) {
      return Response.json(
        {
          error:
            "Forbidden. Only the owner or approved contributors can upload.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      genreId,
      fileUrl,
      posterUrl,
      price,
      isFree,
      isPrivate,
    } = body;

    if (!title || !type || !fileUrl) {
      return Response.json(
        { error: "Missing required fields: title, type, fileUrl" },
        { status: 400 },
      );
    }

    const initialStatus = isOwner ? "approved" : "pending";
    const privateFlag = isOwner ? (isPrivate ?? false) : false;

    const result = await sql`
      INSERT INTO content (title, description, type, genre_id, file_url, poster_url, price, is_free, owner_id, status, is_private)
      VALUES (${title}, ${description}, ${type}, ${genreId || null}, ${fileUrl}, ${posterUrl || null}, ${price || 0}, ${isFree ?? true}, ${userId}, ${initialStatus}, ${privateFlag})
      RETURNING *
    `;

    return Response.json({ content: result[0] });
  } catch (err) {
    console.error("POST /api/content error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userMeta =
      await sql`SELECT role FROM users_meta WHERE id = ${session.user.id}`;
    if (userMeta[0]?.role !== "owner") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id, status, isFree, price } = await request.json();
    const result = await sql`
      UPDATE content
      SET status  = COALESCE(${status ?? null}, status),
          is_free = COALESCE(${isFree ?? null}, is_free),
          price   = COALESCE(${price ?? null}, price)
      WHERE id = ${id}
      RETURNING *
    `;
    return Response.json({ content: result[0] });
  } catch (err) {
    console.error("PATCH /api/content error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
