import styles from "./SingleFrameForm.module.css";
import React from "react";
import { useState, useEffect } from 'react';
import { FrameData } from "../FrameForm/FrameForm";
import { stockPhotos, PhotoCategory, getPhotosByCategory } from "@/lib/stockPhotos";
import Image from 'next/image';
import Button from "@/elements/Button/Button";

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

  return (
    <form className={styles.frameForm}>
      <h3 className={styles.formTitle}>Modify frame</h3>
      <hr className={styles.formDividerDark} />
      <div className={styles.singleFrameForm}>
        <label className={styles.singleFrameLabel}>Color
          <div className={styles.colorPickerContainer}>
            <div 
              className={styles.colorInputWrapper}
              onClick={() => document.getElementById('frameColor')?.click()}
            >
              <div 
                className={styles.colorInputDisplay}
                style={{ backgroundColor: frameColor }}
              />
            </div>
            <input
              id="frameColor"
              type="color"
              value={frameColor}
              onChange={handleFrameColorChange}
              className={styles.colorInput}
            />
          </div>
        </label>
        <hr className={styles.formDivider} />
        <div className={styles.formGroup}>
          <label htmlFor="imageUrl" className={styles.singleFrameLabel}>Picture</label>
          <div className={styles.categoryButtons}>
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.activeCategory : ''}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
        </div>
          <div className={styles.photoGrid}>
            {filteredPhotos.map(photo => (
              <Image
              key={photo.id}
              src={`/stock-photos/${photo.filename}`}
              alt={photo.alt}
              width={80}
              height={80}
              onClick={() => setFrameImage(`/stock-photos/${photo.filename}`)}
              className={`${styles.photoThumbnail} ${imageUrl?.includes(photo.filename) ? styles.selected : ''}`}
              quality={75}
              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            />
            ))}
          </div>
        </div>
        <hr className={styles.formDivider} />
        <div className={styles.formGroup}>
          <label className={styles.singleFrameLabel}>Orientation</label>
          <p>{frameOrientation}</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <label htmlFor="landscapeOrientation" className={styles.orientationSelect}>
              <input
                id="landscapeOrientation"
                type="radio"
                name={`orientation-${id}`}
                value="landscape"
                checked={frameOrientation === "landscape"}
                onChange={handleSetFrameOrientation}
                className={styles.visuallyHidden}
              />
              <img src="/icons/landscape-icon.svg" alt="Landscape" className={styles.orientationIcon} />
            </label>
            <label htmlFor="portraitOrientation" className={styles.orientationSelect}>
              <input
                id="portraitOrientation"
                type="radio"
                name={`orientation-${id}`}
                value="portrait"
                checked={frameOrientation === "portrait"}
                onChange={handleSetFrameOrientation}
                className={styles.visuallyHidden}
              />
              <img src="/icons/portrait-icon.svg" alt="Portrait" className={styles.orientationIcon} />
            </label>
          </div>
        </div>
        <div className={styles.formGroup}>
        <hr className={styles.formDivider} />
          <label className={styles.singleFrameLabel}>Size</label>
          <div className={styles.sizeSelector}>
            <label className={styles.sizeOption}>
              <input
                type="radio"
                name={`size-${id}`}
                value="70x100"
                checked={frameSize === "70x100"}
                onChange={handleSetFrameSize}
                className={styles.visuallyHidden}
              />
              70x100
            </label>
            <label className={styles.sizeOption}>
              <input
                type="radio"
                name={`size-${id}`}
                value="50x70"
                checked={frameSize === "50x70"}
                onChange={handleSetFrameSize}
                className={styles.visuallyHidden}
              />
              50x70
            </label>
            <label className={styles.sizeOption}>
              <input
                type="radio"
                name={`size-${id}`}
                value="40x50"
                checked={frameSize === "40x50"}
                onChange={handleSetFrameSize}
                className={styles.visuallyHidden}
              />
              40x50
            </label>
            <label className={styles.sizeOption}>
              <input
                type="radio"
                name={`size-${id}`}
                value="30x40"
                checked={frameSize === "30x40"}
                onChange={handleSetFrameSize}
                className={styles.visuallyHidden}
              />
              30x40
            </label>
            <label className={styles.sizeOption}>
              <input
                type="radio"
                name={`size-${id}`}
                value="30x30"
                checked={frameSize === "30x30"}
                onChange={handleSetFrameSize}
                className={styles.visuallyHidden}
              />
              30x30
            </label>
            <label className={styles.sizeOption}>
              <input
                type="radio"
                name={`size-${id}`}
                value="20x30"
                checked={frameSize === "20x30"}
                onChange={handleSetFrameSize}
                className={styles.visuallyHidden}
              />
              20x30
            </label>
            <label className={styles.sizeOption}>
              <input
                type="radio"
                name={`size-${id}`}
                value="13x18"
                checked={frameSize === "13x18"}
                onChange={handleSetFrameSize}
                className={styles.visuallyHidden}
              />
              13x18
            </label>
          </div>
        </div>
        <Button 
            type="button" 
            onClick={onDelete}
            variant="rosie"
            buttonText="Delete Frame"
            className={styles.deleteButton}
          />
      </div>
    </form>
  );
};