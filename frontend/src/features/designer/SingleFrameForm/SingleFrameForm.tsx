import styles from "./SingleFrameForm.module.css";
import React from "react";
import { useState, useEffect } from 'react';
import { FrameData } from "../FrameForm/FrameForm";
import { stockPhotos, PhotoCategory, getPhotosByCategory } from "@/lib/stockPhotos";

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
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory>('nature');
  const categories: PhotoCategory[] = ['nature', 'city', 'graphic', 'vintage', 'animals', 'people'];
  const filteredPhotos = getPhotosByCategory(selectedCategory);

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
  
  //Get current image category when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      // Extract filename from the full path
      const filename = imageUrl.split('/').pop();
      
      // Find the photo in stockPhotos
      const currentPhoto = stockPhotos.find(photo => photo.filename === filename);
      
      // If found, set the category to match
      if (currentPhoto) {
        setSelectedCategory(currentPhoto.category);
      }
    }
  }, [imageUrl]);

  console.log('Selected Category:', selectedCategory);

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
          <div className={styles.categoryButtons}>
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          <div className={styles.photoGrid}>
            {filteredPhotos.map(photo => (
              <img
                key={photo.id}
                src={`/stock-photos/${photo.filename}`}
                alt={photo.alt}
                onClick={() => setFrameImage(`/stock-photos/${photo.filename}`)}
                className={`${styles.photoThumbnail} ${imageUrl?.includes(photo.filename) ? styles.selected : ''}`}
              />
            ))}
          </div>
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
      <button 
        type="button" 
        onClick={onDelete}
        className={styles.deleteButton}
      >
        Delete Frame
      </button>
    </form>
  );
};