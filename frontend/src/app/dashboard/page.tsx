"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
  return (
    <ProtectedRoute>
    <h1>The dashboard of a singel logged in user</h1>
    </ProtectedRoute>
  );
}