import React, { ReactNode, CSSProperties, useRef, useEffect, useState } from 'react';
import styles from './ScrollBar.module.css';

interface ScrollBarProps {
  children: ReactNode;
  maxHeight?: string;
  variant?: 'lightSunflowerSeed' | 'darkVanilla';
  contentClassName?: string;
  className?: string;
  style?: CSSProperties;
}

export const ScrollBar: React.FC<ScrollBarProps> = ({ 
  children, 
  maxHeight = 'auto',
  variant = 'lightSunflowerSeed',
  contentClassName = '',
  className = '',
  style = {}
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);

  const variantClassScrollTrack = {
    lightSunflowerSeed: styles.lightSunflowerSeedScrollTrack,
    darkVanilla: styles.darkVanillaScrollTrack,
  }[variant];

  const variantClassScrollThumb = {
    lightSunflowerSeed: styles.lightSunflowerSeedScrollThumb,
    darkVanilla: styles.darkVanillaScrollThumb,
  }[variant];

  // Save scroll position before re-render
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      scrollPosRef.current = element.scrollTop;
      updateThumbPosition();
    };

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, []);

  // Restore scroll position after re-render
  useEffect(() => {
    const element = scrollRef.current;
    if (element && scrollPosRef.current > 0) {
      element.scrollTop = scrollPosRef.current;
    }
  });

  // Calculate thumb size and position
  const updateThumbPosition = () => {
    const element = scrollRef.current;
    if (!element) return;

    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    const scrollTop = element.scrollTop;

    if (scrollHeight <= clientHeight) {
      setThumbHeight(0);
      return;
    }

    const thumbHeightCalc = (clientHeight / scrollHeight) * clientHeight;
    const thumbTopCalc = (scrollTop / scrollHeight) * clientHeight;

    setThumbHeight(thumbHeightCalc);
    setThumbTop(thumbTopCalc);
  };

  // Update thumb on mount and when content changes
  useEffect(() => {
    updateThumbPosition();

    const element = scrollRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(updateThumbPosition);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [children]);

  // Handle thumb dragging
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startY = e.clientY;
    const startTop = thumbTop;
    const element = scrollRef.current;
    if (!element) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newTop = Math.max(0, Math.min(element.clientHeight - thumbHeight, startTop + deltaY));
      
      const scrollPercentage = newTop / (element.clientHeight - thumbHeight);
      element.scrollTop = scrollPercentage * (element.scrollHeight - element.clientHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle track click
  const handleTrackClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    
    const element = scrollRef.current;
    if (!element) return;

    const trackRect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - trackRect.top;
    const scrollPercentage = clickY / trackRect.height;
    
    element.scrollTop = scrollPercentage * (element.scrollHeight - element.clientHeight);
  };

  return (
    <div className={`${styles.scrollBarWrapper} ${className}`}>
      {thumbHeight > 0 && (
        <div className={`${styles.scrollTrack} ${variantClassScrollTrack}`} onClick={handleTrackClick}>
          <div
            ref={thumbRef}
            className={`${styles.scrollTrack} ${variantClassScrollThumb} ${isDragging ? styles.scrollThumbDragging : ''}`}
            style={{
              height: `${thumbHeight}px`,
              top: `${thumbTop}px`,
            }}
            onMouseDown={handleThumbMouseDown}
          />
        </div>
      )}
      <div 
        ref={scrollRef}
        className={styles.scrollContainer}
        style={{ 
          maxHeight,
          ...style 
        }}
      >
        <div className={contentClassName}>
          {children}
        </div>
      </div>
    </div>
  );
};