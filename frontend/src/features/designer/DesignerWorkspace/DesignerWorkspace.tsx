import { useCustomDesign } from "@/features/designs/useCustomDesign";
import { useState, useRef, useEffect } from "react";
import styles from "./DesignerWorkspace.module.css";
import FurnitureForm, { FurnitureColor } from "../FurnitureForm/FurnitureForm";
import StructuralForm from "../StructuralForm/StructuralForm";
import SingleFrameForm from "../SingleFrameForm/SingleFrameForm";
import FrameForm from "../FrameForm/FrameForm";
import Canvas3D from "../Canvas3D/Canvas3D";
import { FrameData } from "../FrameForm/FrameForm";
import { captureScreenshot } from "@/lib/screenshotCapture";

interface DesignerWorkspaceProps {
  designName: string;
  onDesignNameChange: (name: string) => void;
  onSave: (screenshots?: {
    fullBlob: Blob;
    thumbnailBlob: Blob;
  }) => Promise<void>;
  isLoading: boolean;
  error?: string;
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
}

export default function DesignerWorkspace({
  designName,
  onDesignNameChange,
  onSave,
  isLoading,
  error,
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
}: DesignerWorkspaceProps) {
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [showSideBarForm, setShowSideBarForm] = useState<
    "frames" | "sofa" | "single-frame"
  >("frames");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSaveClick = async () => {
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
    if (selectedFrame) setShowSideBarForm("single-frame");
    if (!selectedFrame) setShowSideBarForm("frames");
  }, [selectedFrame]);

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
      <div className={styles.formSideBar}>
        <button onClick={() => setShowSideBarForm("frames")}>Frames</button>
        <button onClick={() => setShowSideBarForm("sofa")}>Sofa</button>

        {showSideBarForm == "frames" && (
          <FrameForm
            frames={customDesign.frames}
            wallWidth={customDesign.wallWidth}
            ceilingHeight={customDesign.ceilingHeight}
            gridCellSize={0.01}
            onAddFrame={addFrame}
          />
        )}

        {showSideBarForm == "sofa" && (
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
        )}

        {/* Only show SingleFrameForm when a frame is selected in Canvas3D */}
        {selectedFrame && selectedFrameIndex !== -1 && showSideBarForm == "single-frame" && (
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
      <div>
        <input
          value={designName}
          onChange={(e) => onDesignNameChange(e.target.value)}
          placeholder={designName || "Give your design a name"}
        />
        <button onClick={handleSaveClick}>
          {isLoading ? "Saving" : "Save"}
        </button>
        {error && <p>{error}</p>}
      </div>
    </>
  );
}
