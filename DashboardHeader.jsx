"use client";
import { useState } from "react";
const LOGO_URL =
  "https://raw.createusercontent.com/83c42dc4-4b43-4e42-aded-b337415f50ea/";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030308] p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <img
            src={LOGO_URL}
            alt="Logo"
            className="h-16 w-auto object-contain mb-3"
          />
          <div className="text-xs font-bold tracking-[0.3em] text-[#A78BFA]">
            INTERGALACTIC
          </div>
          <div className="text-xs font-bold tracking-[0.3em] text-white">
            DIMENSIONS
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d0d1a] p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-5 border border-green-500/20">
                <span className="text-2xl">✉️</span>
              </div>
              <h2 className="text-xl font-black text-white mb-3">
                Check Your Email
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                If an account exists for{" "}
                <strong className="text-white">{email}</strong>, we sent a reset
                link. Check your inbox (and spam folder).
              </p>
              <a
                href="/account/signin"
                className="text-sm text-[#A78BFA] hover:text-white transition-colors"
              >
                ← Back to Sign In
              </a>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-white mb-2">
                Forgot Password?
              </h1>
              <p className="text-sm text-gray-400 mb-7">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#7C3AED] transition-colors"
                  />
                </div>
                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white rounded-xl py-3 text-sm font-bold transition-colors"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
                <p className="text-center text-xs text-gray-500">
                  Remember it?{" "}
                  <a
                    href="/account/signin"
                    className="text-[#A78BFA] hover:text-white font-semibold"
                  >
                    Sign in
                  </a>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
