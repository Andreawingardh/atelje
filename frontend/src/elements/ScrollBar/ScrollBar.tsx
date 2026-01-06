import React, { ReactNode, CSSProperties, useRef, useEffect } from 'react';
import styles from './ScrollBar.module.css';

interface ScrollBarProps {
  children: ReactNode;
  maxHeight?: string;
  contentClassName?: string;
  style?: CSSProperties;
}

export const ScrollBar: React.FC<ScrollBarProps> = ({ 
  children, 
  maxHeight = 'auto',
  contentClassName = '',
  style = {}
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef<number>(0);

  // Save scroll position before re-render
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      scrollPosRef.current = element.scrollTop;
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

  return (
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
  );
};