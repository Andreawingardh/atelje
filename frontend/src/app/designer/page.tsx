"use client";

import Canvas3D from "@/features/designer/Canvas3D/Canvas3D";
import { useDesign } from "@/features/designs/useDesign";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";
import { useState } from "react";

export default function NewDesignPage() {
  const { createDesign, isLoading, error } = useDesign();
  const router = useRouter();
  const [designName, setDesignName] = useState("");

  async function handleSave() {
    try {
      const newDesign = await createDesign(designName);
      if (newDesign) {
        router.push(`/designer/${newDesign.id}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <ProtectedRoute>
      <p>DEBUG: This is the NEW design page</p>
      <h1>Designer 3D-tool</h1>
      <Canvas3D />
      <div>
        <input
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          placeholder="Design name"
          required={true}
        />
        <button onClick={handleSave}>{isLoading ? "Saving" : "Save"}</button>
        {error && <p>{error}</p>}
      </div>
    </ProtectedRoute>
  );
}
