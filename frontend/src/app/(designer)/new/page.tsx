"use client";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";
import Canvas3D from "@/features/designer/Canvas3D/Canvas3D";

export default function DesignerPage() {
  return (
    <ProtectedRoute>
    <h1>Designer 3D-tool</h1>
    <Canvas3D />
    </ProtectedRoute>
  );
}