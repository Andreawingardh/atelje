"use client";
/* import { ProtectedRoute } from "@/features/auth/ProtectedRoute/ProtectedRoute"; */
import Canvas3D from "@/features/designer/Canvas3D/Canvas3D";
import StructuralForm from "@/features/designer/StructuralForm/StructuralForm";
import FurnitureForm from "@/features/designer/FurnitureForm/FurnitureForm";
import { useCustomDesign } from "@/features/designs/useCustomDesign";

export default function DesignerPage() {
  const {
    customDesign,
    setWallWidth,
    setCeilingHeight,
    setWallColor,
    setFurnitureColor,
  } = useCustomDesign();

  return (
    <>
      {/* <ProtectedRoute> */}
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
      {/* </ProtectedRoute> */}
    </>
  );
}
