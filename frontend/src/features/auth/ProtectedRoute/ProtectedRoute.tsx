"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }

    console.log("isLoading: " + isLoading)
  }, [user, isLoading, router]);

  // Don't render children until we know auth status
  if (isLoading || !user) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <>{error}</>;
  }

  return <>{children}</>;
}
