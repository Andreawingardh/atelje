import { useCustomDesign } from "@/features/designs/useCustomDesign";
import { useState, useRef } from "react";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute";
import FurnitureForm, { FurnitureColor } from "../FurnitureForm/FurnitureForm";
import StructuralForm from "../StructuralForm/StructuralForm";
import SingleFrameForm from "../SingleFrameForm/SingleFrameForm";
import FrameForm from "../FrameForm/FrameForm";
import Canvas3D from "../Canvas3D/Canvas3D";
import { FrameData } from "../FrameForm/FrameForm";

interface DesignerWorkspaceProps {
  designName: string;
  onDesignNameChange: (name: string) => void;
  onSave: () => void;
  isLoading: boolean;
  error?: string;
  // Add these from useCustomDesign:
  customDesign: ReturnType<typeof useCustomDesign>["customDesign"];
  setWallWidth: (width: number) => void;
  setCeilingHeight: (height: number) => void;
  setWallColor: (color: string) => void;
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
  setFurnitureColor,
  setFurnitureDepth,
  setFurnitureHeight,
  setFurnitureWidth,
  addFrame,
  setFrameColor,
  setFrameImage,
  setFrameSize,
  setFrameOrientation,
}: DesignerWorkspaceProps) {
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Find the selected frame by ID
  const selectedFrameIndex = customDesign.frames.findIndex(
    (frame) => frame.id === selectedFrameId
  );
  const selectedFrame =
    selectedFrameIndex !== -1 ? customDesign.frames[selectedFrameIndex] : null;
  return (
    <ProtectedRoute>
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

      {/* Only show SingleFrameForm when a frame is selected in Canvas3D */}
      {selectedFrame && selectedFrameIndex !== -1 && (
        <div>
          <h3>Edit Selected Frame</h3>
          <SingleFrameForm
            frames={customDesign.frames}
            id={selectedFrame.id}
            frameColor={selectedFrame.frameColor || "#ac924f"}
            setFrameColor={(color) => setFrameColor(selectedFrameIndex, color)}
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
          />
        </div>
      )}

      {isLoading ? (
        <div>Loading design...</div>
      ) : (
        <Canvas3D
          wallWidth={customDesign.wallWidth}
          ceilingHeight={customDesign.ceilingHeight}
          wallColor={customDesign.wallColor}
          furnitureColor={customDesign.furnitureColor}
          furnitureDepth={customDesign.furnitureDepth}
          furnitureWidth={customDesign.furnitureWidth}
          furnitureHeight={customDesign.furnitureHeight}
          frames={customDesign.frames}
          selectedFrameId={selectedFrameId}
          onFrameSelect={setSelectedFrameId}
          canvasRef={canvasRef}
        />
      )}
      <div>
        <input
          value={designName}
          onChange={(e) => onDesignNameChange(e.target.value)}
          placeholder={designName || "Give your design a name"}
        />
        <button onClick={onSave}>{isLoading ? "Saving" : "Save"}</button>
        {error && <p>{error}</p>}
      </div>
    </ProtectedRoute>
  );
}
