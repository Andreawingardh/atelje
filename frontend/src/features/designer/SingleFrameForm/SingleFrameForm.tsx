import styles from "./SingleFrameForm.module.css";
import React from "react";
import { FrameData } from "../FrameForm/FrameForm";

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
  onDelete: () => void; 
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
    onDelete,
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
          <label htmlFor="frameSizeLable">
          <input
            id="frameSize"
            type="radio"
            value={"70x100"}
            checked={frameSize === "70x100"}
            onChange={handleSetFrameSize}
            className={styles.input}
          />
            70x100
          </label>
          <label htmlFor="frameSizeLable">
          <input
            id="frameSize"
            type="radio"
            value={"50x70"}
            checked={frameSize === "50x70"}
            onChange={handleSetFrameSize}
            className={styles.input}
          />
            50x70
          </label>
          <label htmlFor="frameSizeLable">
          <input
            id="frameSize"
            type="radio"
            value={"40x50"}
            checked={frameSize === "40x50"}
            onChange={handleSetFrameSize}
            className={styles.input}
          />
            40x50
          </label>
          <label htmlFor="frameSizeLable">
          <input
            id="frameSize"
            type="radio"
            value={"30x40"}
            checked={frameSize === "30x40"}
            onChange={handleSetFrameSize}
            className={styles.input}
          />
            30x40
          </label>
          <label htmlFor="frameSizeLable">
          <input
            id="frameSize"
            type="radio"
            value={"30x30"}
            checked={frameSize === "30x30"}
            onChange={handleSetFrameSize}
            className={styles.input}
          />
            30x30
          </label>
          <label htmlFor="frameSizeLable">
          <input
            id="frameSize"
            type="radio"
            value={"20x30"}
            checked={frameSize === "20x30"}
            onChange={handleSetFrameSize}
            className={styles.input}
          />
            20x30
          </label>
          <label htmlFor="frameSizeLable">
          <input
            id="frameSize"
            type="radio"
            value={"13x18"}
            checked={frameSize === "13x18"}
            onChange={handleSetFrameSize}
            className={styles.input}
          />
            13x18
          </label>
        </div>
      </div>
    </form>
  );
};