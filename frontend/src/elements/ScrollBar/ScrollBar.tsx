import React, { ReactNode, useRef, useEffect, useState } from "react";
import styles from "./ScrollBar.module.css";

interface ScrollBarProps {
  children: ReactNode;
  maxHeight: string;
  className?: string;
  contentClassName?: string;
}

export const ScrollBar: React.FC<ScrollBarProps> = ({
  children,
  maxHeight,
  className = "",
  contentClassName = "",
}) => {
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);

  // Reference to the actual scrollable content div
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScrollbar = () => {
      if (!contentRef.current) return;

      // Get scroll measurements from the content div
      const { scrollHeight, clientHeight, scrollTop } = contentRef.current;
      const hasScroll = scrollHeight > clientHeight;

      setShowScrollbar(hasScroll);

      if (hasScroll) {
        const thumbHeightCalc =
          (clientHeight / scrollHeight) * clientHeight * 0.5;
        setThumbHeight(Math.max(thumbHeightCalc, 40));

        // Calculate thumb position based on scroll percentage
        const maxScroll = scrollHeight - clientHeight;
        const scrollPercentage = scrollTop / maxScroll;
        const maxThumbTop = clientHeight - thumbHeightCalc;
        setThumbTop(scrollPercentage * maxThumbTop);
      }
    };

    const content = contentRef.current;
    if (!content) return;

    content.addEventListener("scroll", updateScrollbar);
    updateScrollbar();

    // Update scrollbar when content size changes
    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(content);

    return () => {
      content.removeEventListener("scroll", updateScrollbar);
      resizeObserver.disconnect();
    };
  }, [children]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!contentRef.current) return;

    const track = e.currentTarget;
    const trackRect = track.getBoundingClientRect();
    const clickPosition = e.clientY - trackRect.top;

    const { scrollHeight, clientHeight } = contentRef.current;
    const scrollPercentage = clickPosition / clientHeight;
    const maxScroll = scrollHeight - clientHeight;

    // Jump scroll to the clicked position
    contentRef.current.scrollTop = scrollPercentage * maxScroll;
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!contentRef.current) return;

      const { scrollHeight, clientHeight } = contentRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const maxThumbTop = clientHeight - thumbHeight;

      // Calculate new thumb position based on mouse movement
      const deltaY = e.movementY;
      const newThumbTop = Math.max(0, Math.min(thumbTop + deltaY, maxThumbTop));

      const scrollPercentage = newThumbTop / maxThumbTop;
      contentRef.current.scrollTop = scrollPercentage * maxScroll;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, thumbTop, thumbHeight]);

  return (
    <div className={`${styles.scrollBarWrapper} ${className}`}>
      {showScrollbar && (
        <div className={styles.scrollTrack} onClick={handleTrackClick}>
          <div
            className={styles.scrollThumb}
            style={{
              height: `${thumbHeight}px`,
              top: `${thumbTop}px`,
            }}
            onMouseDown={handleThumbMouseDown}
          />
        </div>
      )}
      <div
        ref={contentRef}
        className={`${styles.scrollContent} ${contentClassName}`}
        style={{ maxHeight }}
      >
        {children}
      </div>
    </div>
  );
};
