"use client";

import { useParams } from "next/navigation";
import { useDesign } from "@/features/designs/useDesign";
import Canvas3D from "@/features/designer/Canvas3D/Canvas3D";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DesignerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id ? Number(params.id) : null;

  const { createDesign, saveDesign, loadDesign, error, isLoading } =
    useDesign();
  const [designName, setDesignName] = useState("");

  useEffect(() => {
    console.log("useEffect running, id is:", id);
    if (id) {
      console.log("About to call loadDesign");
      loadDesign(id);
    }
  }, [id]);

  async function handleSave() {
    if (id) {
      await saveDesign(id, "test save name");
      console.log("design saved");
    }

    await createDesign("test create name");
    console.log("design created");
    const newDesign = await createDesign("test");
    router.push(`/designer/${newDesign!.id}`);
  }
  // TODO: Save button that's smart about create vs update

  return (
    <ProtectedRoute>
      <h1>Designer 3D-tool</h1>
      <Canvas3D />
      <div>
        <input
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          placeholder="Design name"
        />
        <button onClick={handleSave}>Save</button>
        {/* TODO: Show loading/error states */}
      </div>
    </ProtectedRoute>
  );
}
