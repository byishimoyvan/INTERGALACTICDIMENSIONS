"use client";
import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Eye, EyeOff } from "lucide-react";

const LOGO_URL =
  "https://raw.createusercontent.com/83c42dc4-4b43-4e42-aded-b337415f50ea/";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0A0A0F] p-4 font-inter">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={LOGO_URL}
            alt="Intergalactic Dimensions"
            className="h-16 w-auto object-contain mb-3"
          />
          <div className="text-center">
            <div className="text-xs font-bold tracking-[0.3em] text-[#A78BFA]">
              INTERGALACTIC
            </div>
            <div className="text-xs font-bold tracking-[0.3em] text-white">
              DIMENSIONS
            </div>
          </div>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          className="w-full rounded-2xl border border-white/10 bg-[#141420] p-8"
        >
          <div className="mb-7">
            <h1 className="text-2xl font-black text-white mb-1">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-400">
              Sign in to enter the multiverse.
            </p>
          </div>

          <div className="space-y-4">
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="/account/forgot-password"
                  className="text-xs text-[#A78BFA] hover:text-white transition-colors"
                >
                  Forgot password?
                </a>
              </div>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white rounded-xl px-4 py-3 text-sm font-bold transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-xs text-gray-500">
              No account?{" "}
              <a
                href="/account/signup"
                className="text-[#A78BFA] hover:text-white font-semibold transition-colors"
              >
                Create one free
              </a>
            </p>

            <div className="border-t border-white/5 pt-3 text-center">
              <a
                href="/"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                ← Back to browsing
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
