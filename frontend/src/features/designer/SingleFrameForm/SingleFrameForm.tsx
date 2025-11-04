import styles from "./SingleFrameForm.module.css";
import React from "react";
import { FrameData } from "../FrameForm/FrameForm";
import { useCustomDesign } from "@/features/designs/useCustomDesign";

interface singleFrameFormProps {
  frames: FrameData[];
  id: string;
  frameColor: string;
  setFrameColor: (colors: string) => void;
  imageUrl?: string;
  setFrameImage: (imageUrl: string | undefined) => void;
  frameSize: string;
  setFrameSize: (frameSize: string) => void;
  frameOrientation: 'portrait' | 'landscape';
  setFrameOrientation: (frameOrientation: string) => void;
}

export default function SingleFrameForm({
    id,
    frameColor,
    setFrameColor,
    imageUrl,
    setFrameImage,
    frameSize,
    setFrameSize,
    frameOrientation,
    setFrameOrientation,
}: singleFrameFormProps) {

  const handleFrameColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrameColor(e.target.value);
  };

  const handleFrameImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrameImage(e.target.value || undefined);
  };

  const handleSetFrameOrientation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrameOrientation(e.target.value);
  };

  const handleSetFrameSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrameSize(e.target.value);
  };

  return (
    <form className={styles.frameForm}>
      <div className={styles.colorGroup}>
        <label>Color</label>
        <div className={styles.colorPickerContainer}>
          <input
            type="color"
            value={frameColor}
            onChange={handleFrameColorChange}
            className={styles.colorInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="imageUrl">Picture</label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl || ""}
            onChange={handleFrameImageChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Orientation</label>
          <div>
            <label htmlFor="landscapeOrientation">
              <input
                id="landscapeOrientation"
                type="radio"
                name={`orientation-${id}`}
                value="landscape"
                checked={frameOrientation === "landscape"}
                onChange={handleSetFrameOrientation}
                className={styles.input}
              />
              Landscape
            </label>
            <label htmlFor="portraitOrientation">
              <input
                id="portraitOrientation"
                type="radio"
                name={`orientation-${id}`}
                value="portrait"
                checked={frameOrientation === "portrait"}
                onChange={handleSetFrameOrientation}
                className={styles.input}
              />
              Portrait
            </label>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="frameSize">Size</label>
          <input
            id="frameSize"
            type="text"
            value={frameSize}
            onChange={handleSetFrameSize}
            className={styles.input}
          />
        </div>
      </div>
    </form>
  );
};