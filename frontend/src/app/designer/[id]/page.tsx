"use client";

import { useParams } from "next/navigation";
import { useDesign } from "@/features/designs/useDesign";
import Canvas3D from "@/features/designer/Canvas3D/Canvas3D";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";
import { useState, useEffect } from "react";
import { useCustomDesign } from "@/features/designs/useCustomDesign";
import StructuralForm from "@/features/designer/StructuralForm/StructuralForm";
import FurnitureForm from "@/features/designer/FurnitureForm/FurnitureForm";

export default function DesignerPage() {
  const params = useParams();
  const id = params.id ? Number(params.id) : null;

  const { saveDesign, loadDesign, currentDesign, error, isLoading } =
    useDesign();
  const [designName, setDesignName] = useState("");

  const {
    customDesign,
    setWallWidth,
    setCeilingHeight,
    setWallColor,
    setFurnitureColor,
  } = useCustomDesign();

  useEffect(() => {
    console.log("useEffect running, id is:", id);
    if (id) {
      console.log("About to call loadDesign");
      loadDesign(id);
    }
  }, [id, loadDesign]);

  useEffect(() => {
    if (currentDesign?.name) {
      setDesignName(currentDesign.name);
    }
  }, [currentDesign]);

  async function handleSave() {
    if (!id) {
      throw new Error("couldn't find Id");
    }
    await saveDesign(id, designName);
    console.log("design saved");
  }

  return (
    <ProtectedRoute>
      <p>This is the ID page</p>
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
      />
      <Canvas3D
        wallWidth={customDesign.wallWidth}
        ceilingHeight={customDesign.ceilingHeight}
        wallColor={customDesign.wallColor}
        furnitureColor={customDesign.furnitureColor}
      />
      <div>
        <input
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          placeholder={currentDesign?.name || "Design name"}
        />
        <button onClick={handleSave}>{isLoading ? "Saving" : "Save"}</button>
        {error && <p>{error}</p>}
      </div>
    </ProtectedRoute>
  );
}
