"use client";

import { useParams, useRouter } from "next/navigation";
import { useDesign } from "@/features/designs/useDesign";
import { useState, useEffect } from "react";
import { useCustomDesign } from "@/features/designs/useCustomDesign";
import { useAuth } from "@/contexts/AuthContext";
import DesignerWorkspace from "@/features/designer/DesignerWorkspace/DesignerWorkspace";
import { ApiError } from "@/api/generated";
import { useUnsavedChangesWarning } from "@/lib/useUnsavedChangesWarning";
import useBlockNavigation from "@/lib/useBlockNavigation";
import { useModal } from "@/contexts/ModalContext";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";

export default function DesignerPage() {
  const params = useParams();
  const id = params.id ? Number(params.id) : null;
  const router = useRouter();

  const { user } = useAuth();
  const { openModal, setModalCallbacks } = useModal();

  const { saveDesign, loadDesign, currentDesign, isLoading, error } =
    useDesign();
  const [designName, setDesignName] = useState("");

  const {
    loadSceneData,
    getSceneData,
    setCeilingHeight,
    setFrameColor,
    setFrameImage,
    setFrameOrientation,
    setFramePosition,
    setFrameSize,
    setFurnitureColor,
    setFurnitureDepth,
    setFurnitureHeight,
    setFurnitureWidth,
    setWallColor,
    setFlooring,
    setWallWidth,
    addFrame,
    deleteFrame,
    customDesign,
    markAsSaved,
    hasUnsavedChanges,
    occupiedPositions,
    addOccupiedPosition
  } = useCustomDesign();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isAttemptingNavigation, proceedNavigation, cancelNavigation } =
    useBlockNavigation(hasUnsavedChanges);

  useUnsavedChangesWarning(hasUnsavedChanges);

  //This loads the design
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

  //This sets the new design name
  useEffect(() => {
    if (currentDesign?.name) {
      setDesignName(currentDesign.name);
    }
  }, [currentDesign]);

  useEffect(() => {
    if (!isAttemptingNavigation) {
      return;
    }

    setModalCallbacks({onConfirm: proceedNavigation, onCancel: cancelNavigation, saveDesignName: null});
    openModal("confirmation-close");
  }, [isAttemptingNavigation]);

  //this saves the design
  async function handleSave(screenshots?: {
    fullBlob: Blob;
    thumbnailBlob: Blob;
  }) {
    const sceneData = getSceneData();
    try {
      if (!id) {
        setErrorMessage("couldn't find ID");
        return;
      }
      const result = await saveDesign(id, designName, sceneData, screenshots);
      if (result) {
        markAsSaved();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.body?.errors[0] || "Save failed"
          : "An unexpected error occurred"
      );
    }
  }

  console.log("Has unsaved changes:", hasUnsavedChanges);

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
        screenshotUrl={currentDesign?.screenshotUrl}
        setCeilingHeight={setCeilingHeight}
        setWallWidth={setWallWidth}
        setWallColor={setWallColor}
        setFlooring={setFlooring}
        setFrameColor={setFrameColor}
        setFrameImage={setFrameImage}
        setFrameOrientation={setFrameOrientation}
        setFramePosition={setFramePosition}
        setFrameSize={setFrameSize}
        setFurnitureColor={setFurnitureColor}
        setFurnitureDepth={setFurnitureDepth}
        setFurnitureHeight={setFurnitureHeight}
        setFurnitureWidth={setFurnitureWidth}
        addFrame={addFrame}
        deleteFrame={deleteFrame}
        customDesign={customDesign}
        hasUnsavedChanges={hasUnsavedChanges}
        occupiedPositions={occupiedPositions}
        addOccupiedPosition={addOccupiedPosition}
      />
    </ProtectedRoute>
  );
}
