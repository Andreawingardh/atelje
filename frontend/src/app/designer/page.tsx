"use client";

import { useDesign } from "@/features/designs/useDesign";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCustomDesign } from "@/features/designs/useCustomDesign";
import DesignerWorkspace from "@/features/designer/DesignerWorkspace/DesignerWorkspace";
import { ApiError } from "@/api/generated";
import { useModal } from "@/contexts/ModalContext";
import { useUnsavedChangesWarning } from "@/lib/useUnsavedChangesWarning";
import useBlockNavigation from "@/lib/useBlockNavigation";

export default function NewDesignPage() {
  const { createDesign, isLoading, error } = useDesign();
  const router = useRouter();
  const [designName, setDesignName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { openModal, setModalCallbacks } = useModal();

  const {
    getSceneData,
    setCeilingHeight,
    setFrameColor,
    setFrameImage,
    setFrameOrientation,
    setFramePosition,
    setFrameSize,
    setFrames,
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
    hasUnsavedChanges,
    markAsSaved
  } = useCustomDesign();

  const { isAttemptingNavigation, proceedNavigation, cancelNavigation, allowNextNavigation } =
    useBlockNavigation(hasUnsavedChanges);

  useUnsavedChangesWarning(hasUnsavedChanges);

  useEffect(() => {
    if (!isAttemptingNavigation) {
      return;
    }

    setModalCallbacks({
      onConfirm: proceedNavigation,
      onCancel: cancelNavigation, saveDesignName: null
    });
    openModal("confirmation-close");
  }, [isAttemptingNavigation]);

  async function handleSave(screenshots?: {
    fullBlob: Blob;
    thumbnailBlob: Blob;
  }) {
    const sceneData = getSceneData();
    try {
      const newDesign = await createDesign(designName, sceneData, screenshots);
      console.log("About to create design with sceneData:", sceneData);
      console.log("Parsed:", JSON.parse(sceneData));
      if (newDesign) {
        allowNextNavigation();
        router.push(`/designer/${newDesign.id}`);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof ApiError
          ? error.body?.errors[0] || "Save failed"
          : "An unexpected error occurred"
      );
    }
  }

  return (
    <>
      <p>DEBUG: This is the NEW design page</p>
      <h1>Designer 3D-tool</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <DesignerWorkspace
        designName={designName}
        onDesignNameChange={setDesignName}
        onSave={handleSave}
        isLoading={isLoading}
        error={error}
        screenshotUrl={null}
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
      />
    </>
  );
}
