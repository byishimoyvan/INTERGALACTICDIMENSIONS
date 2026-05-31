import sql from "@/app/api/utils/sql";
import crypto from "crypto";
import { sendEmail } from "@/app/api/utils/send-email";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email)
      return Response.json({ error: "Email required" }, { status: 400 });

    const users =
      await sql`SELECT id, email FROM auth_users WHERE email = ${email.toLowerCase()} LIMIT 1`;
    if (users.length === 0) return Response.json({ ok: true });

    const user = users[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await sql`
      INSERT INTO password_reset_tokens (token, user_id, used, expires_at)
      VALUES (${token}, ${user.id}, false, ${expiresAt})
    `;

    const resetLink = `${process.env.NEXT_PUBLIC_CREATE_APP_URL || ""}/account/reset-password?token=${token}`;

    try {
      await sendEmail({
        to: email,
        subject: "Reset Your Password — Intergalactic Dimensions",
        html: `
          <div style="font-family:Arial,sans-serif;background:#030308;color:#fff;padding:40px;max-width:500px;margin:0 auto;border-radius:16px;border:1px solid #1f1f3a;">
            <h1 style="color:#A78BFA;font-size:13px;letter-spacing:.3em;margin:0 0 4px;">INTERGALACTIC</h1>
            <h2 style="color:#fff;font-size:13px;letter-spacing:.3em;margin:0 0 32px;">DIMENSIONS</h2>
            <h2 style="font-size:22px;font-weight:900;margin:0 0 12px;">Reset Your Password</h2>
            <p style="color:#9ca3af;margin:0 0 28px;">Click below to reset your password. This link expires in 1 hour.</p>
            <p style="color:#6b7280;font-size:12px;margin:0 0 20px;">Reset link for: <strong style="color:#A78BFA;">${email}</strong></p>
            <a href="${resetLink}" style="display:inline-block;background:#7C3AED;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:900;font-size:14px;">Reset Password</a>
            <p style="color:#4b5563;margin:24px 0 0;font-size:12px;">If you didn't request this, ignore this email.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Password reset email error:", emailErr.message);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("forgot-password error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
