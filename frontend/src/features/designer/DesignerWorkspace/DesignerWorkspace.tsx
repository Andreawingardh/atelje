import { useCustomDesign } from "@/features/designs/useCustomDesign";
import { useState, useRef, useEffect } from "react";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";
import FurnitureForm, { FurnitureColor } from "../FurnitureForm/FurnitureForm";
import StructuralForm from "../StructuralForm/StructuralForm";
import SingleFrameForm from "../SingleFrameForm/SingleFrameForm";
import FrameForm from "../FrameForm/FrameForm";
import Canvas3D from "../Canvas3D/Canvas3D";
import { FrameData } from "../FrameForm/FrameForm";
import { captureScreenshot } from "@/lib/screenshotCapture";
import { DownloadScreenshotButton } from "@/elements/DownloadScreenshotButton/DownloadScreenshotButton";
import styles from "./DesignerWorkspace.module.css";
import { useModal } from "@/contexts/ModalContext";
import { useAuth } from "@/contexts/AuthContext";

interface DesignerWorkspaceProps {
  designName: string;
  onDesignNameChange: (name: string) => void;
  onSave: (screenshots?: {
    fullBlob: Blob;
    thumbnailBlob: Blob;
  }) => Promise<void>;
  isLoading: boolean;
  error?: string;
  screenshotUrl?: string | null;
  // Add these from useCustomDesign:
  customDesign: ReturnType<typeof useCustomDesign>["customDesign"];
  setWallWidth: (width: number) => void;
  setCeilingHeight: (height: number) => void;
  setWallColor: (color: string) => void;
  setFlooring: (flooring: string) => void;
  setFurnitureColor: (color: FurnitureColor) => void;
  setFurnitureDepth: (depth: number) => void;
  setFurnitureWidth: (width: number) => void;
  setFurnitureHeight: (height: number) => void;
  addFrame: (frame: FrameData) => void;
  setFrameColor: (index: number, color: string) => void;
  setFrameImage: (index: number, url: string) => void;
  setFrameSize: (index: number, size: string) => void;
  setFrameOrientation: (
    index: number,
    orientation: "portrait" | "landscape"
  ) => void;
  setFramePosition: (index: number, position: [number, number, number]) => void;
  deleteFrame: (index: number) => void;
  hasUnsavedChanges: boolean;
}

export default function DesignerWorkspace({
  designName,
  onDesignNameChange,
  onSave,
  isLoading,
  error,
  screenshotUrl,
  customDesign,
  setWallWidth,
  setCeilingHeight,
  setWallColor,
  setFlooring,
  setFurnitureColor,
  setFurnitureDepth,
  setFurnitureHeight,
  setFurnitureWidth,
  addFrame,
  setFrameColor,
  setFrameImage,
  setFrameSize,
  setFrameOrientation,
  setFramePosition,
  deleteFrame,
  hasUnsavedChanges,
}: DesignerWorkspaceProps) {
  const { user } = useAuth();
  const [pendingAction, setPendingAction] = useState<"save" | null>(null);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [showSideBar, setShowSideBar] = useState<
    "frames" | "sofa" | "single-frame"
  >("frames");
  const { openModal} = useModal();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSaveClick = () => {
    if (!user) {
      setPendingAction("save");
      openModal("login");
      return;
    }
    if (!designName) {
      openModal("save-design", {callbacks: {saveDesignName: onDesignNameChange}});
    } else {
      handleSave();
    }
  };

  useEffect(() => {
    console.log("Auth check:", { pendingAction, user: !!user });
    if (pendingAction === "save" && user) {
      console.log("Opening save-design modal");
      setPendingAction(null);
      openModal("save-design", {callbacks: {saveDesignName: onDesignNameChange}});
    }
  }, [pendingAction, user]);

  useEffect(() => {
    console.log("Design name changed:", { designName, hasUnsavedChanges });
    if (designName && hasUnsavedChanges) {
      console.log("Calling handleSave");
      handleSave();
    }
  }, [designName]);

  const handleSave = async () => {
    if (!canvasRef.current) {
      console.error("Canvas not ready");
      await onSave(); // Save without screenshots
      return;
    }

    try {
      const screenshots = await captureScreenshot(canvasRef.current);
      await onSave(screenshots);
    } catch (error) {
      await onSave();
    }
  };

  // Find the selected frame by ID
  const selectedFrameIndex = customDesign.frames.findIndex(
    (frame) => frame.id === selectedFrameId
  );
  const selectedFrame =
    selectedFrameIndex !== -1 ? customDesign.frames[selectedFrameIndex] : null;

  useEffect(() => {
    if (!selectedFrame) setShowSideBar("frames");
    if (selectedFrame) setShowSideBar("single-frame");
  }, [selectedFrame]);

  console.log(designName);

  return (
    <>
      <StructuralForm
        wallWidth={customDesign.wallWidth}
        setWallWidth={setWallWidth}
        ceilingHeight={customDesign.ceilingHeight}
        setCeilingHeight={setCeilingHeight}
        wallColor={customDesign.wallColor}
        setWallColor={setWallColor}
        flooring={customDesign.flooring}
        setFlooring={setFlooring}
      />
      <div>
        <button onClick={handleSaveClick} disabled={!hasUnsavedChanges}>
          {isLoading ? "Saving" : "Save"}
        </button>
        <DownloadScreenshotButton 
          screenshotUrl={screenshotUrl}
          designName={designName || 'design'}
        />
        {error && <p>{error}</p>}
      </div>
      <div className={styles.sideBarForm}>
        <button onClick={() => setShowSideBar("frames")}>Frames</button>
        <button onClick={() => setShowSideBar("sofa")}>Sofa</button>
        {showSideBar == "frames" && (
          <FrameForm
            frames={customDesign.frames}
            wallWidth={customDesign.wallWidth}
            ceilingHeight={customDesign.ceilingHeight}
            gridCellSize={0.01}
            onAddFrame={addFrame}
          />
        )}
        {showSideBar == "sofa" && (
          <FurnitureForm
            furnitureColor={customDesign.furnitureColor}
            setFurnitureColor={setFurnitureColor}
            furnitureDepth={customDesign.furnitureDepth}
            furnitureWidth={customDesign.furnitureWidth}
            setFurnitureDepth={setFurnitureDepth}
            setFurnitureWidth={setFurnitureWidth}
            furnitureHeight={customDesign.furnitureHeight}
            setFurnitureHeight={setFurnitureHeight}
            wallWidth={customDesign.wallWidth}
          />
        )}

        {/* Only show SingleFrameForm when a frame is selected in Canvas3D */}
        {selectedFrame &&
          selectedFrameIndex !== -1 &&
          showSideBar == "single-frame" && (
            <div>
              <h3>Edit Selected Frame</h3>
              <SingleFrameForm
                frames={customDesign.frames}
                id={selectedFrame.id}
                frameColor={selectedFrame.frameColor || "#ac924f"}
                setFrameColor={(color) =>
                  setFrameColor(selectedFrameIndex, color)
                }
                imageUrl={selectedFrame.imageUrl}
                setFrameImage={(url) => setFrameImage(selectedFrameIndex, url!)}
                frameSize={selectedFrame.frameSize || "70x50"}
                setFrameSize={(size) => setFrameSize(selectedFrameIndex, size)}
                frameOrientation={selectedFrame.frameOrientation || "portrait"}
                setFrameOrientation={(orientation) =>
                  setFrameOrientation(
                    selectedFrameIndex,
                    orientation as "portrait" | "landscape"
                  )
                }
                onDelete={() => {
                  deleteFrame(selectedFrameIndex);
                  setSelectedFrameId(null);
                }}
              />
            </div>
          )}
      </div>
      {isLoading ? (
        <div>Loading design...</div>
      ) : (
        <Canvas3D
          wallWidth={customDesign.wallWidth}
          ceilingHeight={customDesign.ceilingHeight}
          wallColor={customDesign.wallColor}
          flooring={customDesign.flooring}
          furnitureColor={customDesign.furnitureColor}
          furnitureDepth={customDesign.furnitureDepth}
          furnitureWidth={customDesign.furnitureWidth}
          furnitureHeight={customDesign.furnitureHeight}
          frames={customDesign.frames}
          selectedFrameId={selectedFrameId}
          onFrameSelect={setSelectedFrameId}
          onFramePositionUpdate={setFramePosition}
          canvasRef={canvasRef}
        />
      )}
    </>
  );
}
