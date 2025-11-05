"use client";

import { useParams, useRouter } from "next/navigation";
import { useDesign } from "@/features/designs/useDesign";
import { useState, useEffect } from "react";
import { useCustomDesign } from "@/features/designs/useCustomDesign";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";
import DesignerWorkspace from "@/features/designer/DesignerWorkspace/DesignerWorkspace";
import { ApiError } from "@/api/generated";

export default function DesignerPage() {
  const params = useParams();
  const id = params.id ? Number(params.id) : null;
  const router = useRouter();

  const { saveDesign, loadDesign, currentDesign, isLoading, error } =
    useDesign();
  const [designName, setDesignName] = useState("");

  const { loadSceneData, getSceneData, setCeilingHeight, setFrameColor, setFrameImage, setFrameOrientation, setFrameSize, setFrames, setFurnitureColor, setFurnitureDepth, setFurnitureHeight, setFurnitureWidth, setWallColor, setWallWidth, addFrame, customDesign } = useCustomDesign();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchAndLoad = async () => {
      if (id && user) {
        const loadedDesign = await loadDesign(id);
        console.log("Loaded design:", loadedDesign);
        console.log("Design data:", loadedDesign?.designData);

        if (loadedDesign == undefined) {
          router.push("/designer");
          return;
        }
        loadSceneData(loadedDesign.designData);
      }
    };

    fetchAndLoad(); // Call it
  }, [id, loadDesign, loadSceneData, user, router]);

  useEffect(() => {
    if (currentDesign?.name) {
      setDesignName(currentDesign.name);
    }
  }, [currentDesign]);

  async function handleSave() {
    const sceneData = getSceneData();
    try {
      if (!id) {
        setErrorMessage("couldn't find ID");
        return;
      }
      await saveDesign(id, designName, sceneData);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.body?.errors[0] || "Save failed"
          : "An unexpected error occurred"
      );
    }
  }

  return (
    <ProtectedRoute>
      <h1>this is the ID page</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <DesignerWorkspace
        designName={designName}
        onDesignNameChange={setDesignName}
        onSave={handleSave}
        isLoading={isLoading}
        error={error}
        setCeilingHeight={setCeilingHeight}
        setWallWidth={setWallWidth}
        setWallColor={setWallColor}
        setFrameColor={setFrameColor}
        setFrameImage={setFrameImage}
        setFrameOrientation={setFrameOrientation}
        setFrameSize={setFrameSize}
        setFurnitureColor={setFurnitureColor}
        setFurnitureDepth={setFurnitureDepth}
        setFurnitureHeight={setFurnitureHeight}
        setFurnitureWidth={setFurnitureWidth}
        addFrame={addFrame}
        customDesign={customDesign}
      />
    </ProtectedRoute>
  );
}
