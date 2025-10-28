"use client";
/* import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute"; */
import { useState } from "react";
import Canvas3D from "@/features/designer/Canvas3D/Canvas3D";
import StructuralForm from "@/features/designer/StructuralForm/StructuralForm";
import FurnitureForm, { FurnitureColor } from "@/features/designer/FurnitureForm/FurnitureForm";

export default function DesignerPage() {
  const [wallWidth, setWallWidth] = useState(500);
  const [ceilingHeight, setCeilingHeight] = useState(300);
  const [wallColor, setWallColor] = useState("#DEDEDE");
  const [furnitureColor, setFurnitureColor] = useState<FurnitureColor>({
    sofa: "#8B4513",
  });

  return (
    <>
      {/* <ProtectedRoute> */}
      <h1>Designer 3D-tool</h1>
      <StructuralForm
        wallWidth={wallWidth}
        setWallWidth={setWallWidth}
        ceilingHeight={ceilingHeight}
        setCeilingHeight={setCeilingHeight}
        wallColor={wallColor}
        setWallColor={setWallColor}
      />
      <FurnitureForm
        furnitureColor={furnitureColor}
        setFurnitureColor={setFurnitureColor}
      />
      <Canvas3D wallWidth={wallWidth} ceilingHeight={ceilingHeight} wallColor={wallColor} furnitureColor={furnitureColor} />
      {/* </ProtectedRoute> */}
    </>
  );
}
