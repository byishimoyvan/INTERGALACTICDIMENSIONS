"use client";
import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

const LOGO_URL =
  "https://raw.createusercontent.com/83c42dc4-4b43-4e42-aded-b337415f50ea/";

export default function OnboardingPage() {
  const { data: user, loading: userLoading } = useUser();
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [isContributor, setIsContributor] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("pendingUsername");
      const d = localStorage.getItem("pendingDob");
      const c = localStorage.getItem("pendingIsContributor");
      if (u) setUsername(u);
      if (d) setDob(d);
      if (c === "true") setIsContributor(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, dob, isContributor }),
      });
      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("pendingUsername");
          localStorage.removeItem("pendingDob");
          localStorage.removeItem("pendingIsContributor");
          window.location.href = "/";
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0A0A0F] p-4 font-inter">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img
            src={LOGO_URL}
            alt="Intergalactic Dimensions"
            className="h-14 w-auto object-contain mb-3"
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
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-white/10 bg-[#141420] p-8"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white mb-1">
              Complete Your Profile
            </h1>
            <p className="text-sm text-gray-400">
              Just a few more details to get you started.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Username
              </label>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#7C3AED] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Date of Birth
              </label>
              <input
                required
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#7C3AED] transition-colors [color-scheme:dark]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white rounded-xl px-4 py-3 text-sm font-bold transition-colors"
            >
              {loading ? "Saving..." : "Enter the Multiverse →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
