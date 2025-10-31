"use client";

import { useParams } from "next/navigation";
import { useDesign } from "@/features/designs/useDesign";
import Canvas3D from "@/features/designer/Canvas3D/Canvas3D";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";
import { useState, useEffect } from "react";
import { useCustomDesign } from "@/features/designs/useCustomDesign";
import StructuralForm from "@/features/designer/StructuralForm/StructuralForm";
import FurnitureForm from "@/features/designer/FurnitureForm/FurnitureForm";
import FrameForm from "@/features/designer/FrameForm/FrameForm";
import { OpenAPI } from "@/api/generated";
import { useAuth } from "@/contexts/AuthContext";

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
    loadSceneData,
    getSceneData,
    setFurnitureDepth,
    setFurnitureWidth,
    setFurnitureHeight,
    addFrame,
  } = useCustomDesign();

  const { user } = useAuth();

  useEffect(() => {
    console.log("useEffect running, id is:", id);
    console.log("=== loadDesign useEffect running ===");
    console.log("user:", user);
    console.log("OpenAPI.TOKEN:", OpenAPI.TOKEN);
    console.log("id:", id);
    const fetchAndLoad = async () => {
      if (id && user) {
        const loadedDesign = await loadDesign(id);
        if (loadedDesign) {
          loadSceneData(loadedDesign.designData);
        }
      }
    };

    fetchAndLoad(); // Call it
  }, [id, loadDesign, loadSceneData, user]);

  useEffect(() => {
    if (currentDesign?.name) {
      setDesignName(currentDesign.name);
    }
  }, [currentDesign]);

  async function handleSave() {
    const sceneData = getSceneData();
    if (!id) {
      throw new Error("couldn't find Id");
    }
    await saveDesign(id, designName, sceneData);
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
        furnitureDepth={customDesign.furnitureDepth}
        furnitureWidth={customDesign.furnitureWidth}
        setFurnitureDepth={setFurnitureDepth}
        setFurnitureWidth={setFurnitureWidth}
        furnitureHeight={customDesign.furnitureHeight}
        setFurnitureHeight={setFurnitureHeight}
      />
      <FrameForm
        frames={customDesign.frames}
        wallWidth={customDesign.wallWidth}
        ceilingHeight={customDesign.ceilingHeight}
        gridCellSize={0.01}
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
          placeholder={currentDesign?.name || "Design name"}
        />
        <button onClick={handleSave}>{isLoading ? "Saving" : "Save"}</button>
        {error && <p>{error}</p>}
      </div>
    </ProtectedRoute>
  );
}
