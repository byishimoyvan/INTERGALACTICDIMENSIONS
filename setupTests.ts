"use client";
import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Eye, EyeOff, Upload, User } from "lucide-react";

const LOGO_URL =
  "https://raw.createusercontent.com/83c42dc4-4b43-4e42-aded-b337415f50ea/";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isContributor, setIsContributor] = useState(false);

  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password || !username || !dob) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      localStorage.setItem("pendingUsername", username);
      localStorage.setItem("pendingDob", dob);
      localStorage.setItem(
        "pendingIsContributor",
        isContributor ? "true" : "false",
      );
      await signUpWithCredentials({
        email,
        password,
        callbackUrl: "/account/onboarding",
        redirect: true,
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
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
              Join the Multiverse
            </h1>
            <p className="text-sm text-gray-400">
              Create your account to start exploring.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Username *
                </label>
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="star_explorer"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#7C3AED] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Date of Birth *
                </label>
                <input
                  required
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#7C3AED] transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Email *
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
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Password *
              </label>
              <div className="relative">
                <input
                  required
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
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

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsContributor(false)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    !isContributor
                      ? "border-[#7C3AED] bg-[#7C3AED]/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User
                      size={14}
                      className={
                        !isContributor ? "text-[#A78BFA]" : "text-gray-500"
                      }
                    />
                    <span
                      className={`text-sm font-bold ${
                        !isContributor ? "text-white" : "text-gray-400"
                      }`}
                    >
                      Viewer
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Watch movies &amp; read books. No approval needed.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setIsContributor(true)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    isContributor
                      ? "border-[#A78BFA] bg-[#7C3AED]/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Upload
                      size={14}
                      className={
                        isContributor ? "text-[#A78BFA]" : "text-gray-500"
                      }
                    />
                    <span
                      className={`text-sm font-bold ${
                        isContributor ? "text-white" : "text-gray-400"
                      }`}
                    >
                      Contributor
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Upload content. Needs owner approval.
                  </p>
                </button>
              </div>
              {isContributor && (
                <div className="rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 px-4 py-3 text-xs text-[#A78BFA]">
                  ✦ You can watch all content freely while waiting for upload
                  approval.
                </div>
              )}
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
              {loading ? "Creating your account..." : "Create Account — Free"}
            </button>

            <p className="text-center text-xs text-gray-500">
              Already have an account?{" "}
              <a
                href="/account/signin"
                className="text-[#A78BFA] hover:text-white font-semibold transition-colors"
              >
                Sign in
              </a>
            </p>

            <div className="border-t border-white/5 pt-3 text-center">
              <a
                href="/"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                ← Browse without account
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
