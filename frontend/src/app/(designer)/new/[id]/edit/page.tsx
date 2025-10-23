"use client";

import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";

export default function EditDesignPage() {
  return (
    <ProtectedRoute>
    <h1>Designer 3D-tool editing existing design</h1>
    </ProtectedRoute>
  );
}