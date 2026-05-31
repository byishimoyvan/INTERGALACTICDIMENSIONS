"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
const LOGO_URL =
  "https://raw.createusercontent.com/83c42dc4-4b43-4e42-aded-b337415f50ea/";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setToken(params.get("token") || "");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
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
          {success ? (
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-5 border border-green-500/20 text-2xl">
                ✅
              </div>
              <h2 className="text-xl font-black text-white mb-3">
                Password Reset!
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Your password has been updated. You can now sign in.
              </p>
              <a
                href="/account/signin"
                className="inline-block bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl px-8 py-3 text-sm font-bold transition-colors"
              >
                Sign In Now
              </a>
            </div>
          ) : !token ? (
            <div className="text-center py-4">
              <p className="text-red-400 mb-4">
                Invalid or missing reset token.
              </p>
              <a
                href="/account/forgot-password"
                className="text-[#A78BFA] hover:text-white text-sm"
              >
                Request new link →
              </a>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-white mb-2">
                New Password
              </h1>
              <p className="text-sm text-gray-400 mb-7">
                Choose a strong password for your account.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 outline-none focus:border-[#7C3AED] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <input
                    required
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
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
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
