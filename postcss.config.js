import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const session = await auth();

    const contentRows = await sql`
      SELECT c.*, um.username as owner_name, g.name as genre_name
      FROM content c
      LEFT JOIN users_meta um ON c.owner_id = um.id
      LEFT JOIN genres g ON c.genre_id = g.id
      WHERE c.id = ${id} AND c.status = 'approved'
      LIMIT 1
    `;

    const content = contentRows?.[0];
    if (!content) {
      return Response.json({ error: "Content not found" }, { status: 404 });
    }

    if (!content.is_free) {
      if (!session || !session.user?.id) {
        return Response.json({
          content: { ...content, file_url: null },
          needs_purchase: true,
        });
      }

      // Check per-content purchase
      const purchaseRows = await sql`
        SELECT id FROM purchases 
        WHERE user_id = ${session.user.id} AND content_id = ${id}
        LIMIT 1
      `;

      // Check active subscription
      const subRows = await sql`
        SELECT id FROM subscriptions
        WHERE user_id = ${session.user.id} AND status = 'active' AND ends_at > NOW()
        LIMIT 1
      `;

      const hasPurchase = purchaseRows.length > 0;
      const hasSubscription = subRows.length > 0;
      const isContentOwner = content.owner_id === session.user.id;

      if (!hasPurchase && !hasSubscription && !isContentOwner) {
        const ownerCheck =
          await sql`SELECT role FROM users_meta WHERE id = ${session.user.id}`;
        if (ownerCheck[0]?.role !== "owner") {
          return Response.json({
            content: { ...content, file_url: null },
            needs_purchase: true,
          });
        }
      }
    }

    return Response.json({ content, needs_purchase: false });
  } catch (err) {
    console.error("GET /api/content/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST to /api/content/[id] increments view count
export async function POST(request, { params }) {
  try {
    const { id } = params;
    await sql`UPDATE content SET views = COALESCE(views, 0) + 1 WHERE id = ${id}`;
    return Response.json({ ok: true });
  } catch (err) {
    console.error("POST /api/content/[id] view error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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
    await sql`DELETE FROM episodes WHERE content_id = ${id}`;
    await sql`DELETE FROM purchases WHERE content_id = ${id}`;
    await sql`DELETE FROM content WHERE id = ${id}`;
    return Response.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/content/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const session = await auth();
    if (!session?.user?.id)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const ownerCheck =
      await sql`SELECT role FROM users_meta WHERE id = ${session.user.id}`;
    if (ownerCheck[0]?.role !== "owner")
      return Response.json({ error: "Forbidden" }, { status: 403 });
    const body = await request.json();
    const {
      title,
      description,
      file_url,
      poster_url,
      is_private,
      genre_id,
      tags,
    } = body;
    const updates = [];
    const values = [];
    let idx = 1;
    if (title !== undefined) {
      updates.push(`title = $${idx++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${idx++}`);
      values.push(description);
    }
    if (file_url !== undefined) {
      updates.push(`file_url = $${idx++}`);
      values.push(file_url);
    }
    if (poster_url !== undefined) {
      updates.push(`poster_url = $${idx++}`);
      values.push(poster_url);
    }
    if (is_private !== undefined) {
      updates.push(`is_private = $${idx++}`);
      values.push(is_private);
    }
    if (genre_id !== undefined) {
      updates.push(`genre_id = $${idx++}`);
      values.push(genre_id);
    }
    if (tags !== undefined) {
      updates.push(`tags = $${idx++}`);
      values.push(tags);
    }
    if (updates.length === 0)
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    values.push(parseInt(id));
    await sql(
      `UPDATE content SET ${updates.join(", ")} WHERE id = $${idx}`,
      values,
    );
    return Response.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/content/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
