import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const session = await auth();
    if (!session?.user?.id)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const ownerCheck =
      await sql`SELECT role FROM users_meta WHERE id = ${session.user.id}`;
    if (ownerCheck[0]?.role !== "owner")
      return Response.json({ error: "Forbidden" }, { status: 403 });

    // Check if genre is used by any content
    const used =
      await sql`SELECT COUNT(*) as count FROM content WHERE genre_id = ${id}`;
    const count = parseInt(used[0]?.count || 0);
    if (count > 0) {
      return Response.json(
        {
          error: `Cannot delete — ${count} piece(s) of content are using this genre. Reassign them first.`,
        },
        { status: 409 },
      );
    }

    await sql`DELETE FROM genres WHERE id = ${id}`;
    return Response.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/genres/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
