import { useEffect } from "react";
import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut({ callbackUrl: "/", redirect: true });
  }, [signOut]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F9FAFB] font-inter">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#2563EB] border-t-transparent mx-auto"></div>
        <p className="text-sm text-[#6B7280]">Signing you out...</p>
      </div>
    </div>
  );
}
