"use client";

import Canvas3D from "@/features/designer/Canvas3D/Canvas3D";
import { useDesign } from "@/features/designs/useDesign";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";
import { useState } from "react";
import { useCustomDesign } from "@/features/designs/useCustomDesign";
import StructuralForm from "@/features/designer/StructuralForm/StructuralForm";
import FurnitureForm from "@/features/designer/FurnitureForm/FurnitureForm";
import FrameForm from "@/features/designer/FrameForm/FrameForm";

export default function NewDesignPage() {
  const { createDesign, isLoading, error } = useDesign();
  const router = useRouter();
  const [designName, setDesignName] = useState("");

  const {
    customDesign,
    setWallWidth,
    setCeilingHeight,
    setWallColor,
    setFurnitureColor,
    getSceneData,
    setFurnitureDepth,
    setFurnitureWidth,
    setFurnitureHeight,
    addFrame,
  } = useCustomDesign();

  async function handleSave() {
    const sceneData = getSceneData();
    try {
      const newDesign = await createDesign(designName, sceneData);
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
      <StructuralForm
        wallWidth={customDesign.wallWidth}
        setWallWidth={setWallWidth}
        ceilingHeight={customDesign.ceilingHeight}
        setCeilingHeight={setCeilingHeight}
        wallColor={customDesign.wallColor}
        setWallColor={setWallColor}
      />
      <FurnitureForm
        furnitureColor={customDesign.furnitureColor}
        setFurnitureColor={setFurnitureColor}
        furnitureDepth={customDesign.furnitureDepth}
        furnitureWidth={customDesign.furnitureWidth}
        setFurnitureDepth={setFurnitureDepth}
        setFurnitureWidth={setFurnitureWidth}
        furnitureHeight={customDesign.furnitureHeight}
        setFurnitureHeight={setFurnitureHeight}
      />
      <FrameForm
        frames={customDesign.frames}
        onAddFrame={addFrame}
      />
      <Canvas3D
        wallWidth={customDesign.wallWidth}
        ceilingHeight={customDesign.ceilingHeight}
        wallColor={customDesign.wallColor}
        furnitureColor={customDesign.furnitureColor}
        furnitureDepth={customDesign.furnitureDepth}
        furnitureWidth={customDesign.furnitureWidth}
        furnitureHeight={customDesign.furnitureHeight}
        frames={customDesign.frames}
      />
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
