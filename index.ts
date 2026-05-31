import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const genres = await sql`SELECT * FROM genres ORDER BY name ASC`;
    return Response.json({ genres });
  } catch (err) {
    console.error("GET /api/genres error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userMeta =
      await sql`SELECT role FROM users_meta WHERE id = ${session.user.id}`;
    if (userMeta[0]?.role !== "owner") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    const { name } = await request.json();
    if (!name?.trim()) {
      return Response.json(
        { error: "Genre name is required" },
        { status: 400 },
      );
    }
    const result = await sql`
      INSERT INTO genres (name) VALUES (${name.trim()})
      ON CONFLICT (name) DO NOTHING
      RETURNING *
    `;
    return Response.json({ genre: result[0] });
  } catch (err) {
    console.error("POST /api/genres error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
