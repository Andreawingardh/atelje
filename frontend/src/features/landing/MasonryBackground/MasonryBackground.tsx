"use client";

import styles from "./MasonryBackground.module.css";
import Image from "next/image";

// Mock data - we'll use placeholder images
const masonryItems = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
  { id: 16 },
  { id: 17 },
  { id: 18 },
  { id: 19 },
  { id: 20 },
  { id: 21 },
  { id: 22 },
  { id: 23 },
  { id: 24 },
  { id: 25 },
  { id: 26 },
  { id: 27 },
  { id: 28 },
];

const column1 = masonryItems.filter((_, i) => i % 4 === 0);
const column2 = masonryItems.filter((_, i) => i % 4 === 1);
const column3 = masonryItems.filter((_, i) => i % 4 === 2);
const column4 = masonryItems.filter((_, i) => i % 4 === 3);

export default function MasonryBackground() {
  return (
    <div className={styles.masonryGrid}>
      {/* Column 1 - scrolls up */}
      <div className={styles.column}>
        <div className={styles.columnUpScroll}>
          {[...column1, ...column1].map((item, index) => (
            <div key={index} className={styles.masonryItem}>
              <Image
                src={`https://picsum.photos/seed/${item.id}/400/600`}
                alt={`Design ${item.id}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Column 2 - scrolls down */}
      <div className={styles.column}>
        <div className={styles.columnDownScroll}>
          {[...column2, ...column2].map((item, index) => (
            <div key={index} className={styles.masonryItem}>
              <Image
                src={`https://picsum.photos/seed/${item.id}/400/600`}
                alt={`Design ${item.id}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Column 3 - scrolls up */}
      <div className={styles.column}>
        <div className={styles.columnUpScroll}>
          {[...column3, ...column3].map((item, index) => (
            <div key={index} className={styles.masonryItem}>
              <Image
                src={`https://picsum.photos/seed/${item.id}/400/600`}
                alt={`Design ${item.id}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Column 4 - scrolls down */}
      <div className={styles.column}>
        <div className={styles.columnDownScroll}>
          {[...column4, ...column4].map((item, index) => (
            <div key={index} className={styles.masonryItem}>
              <Image
                src={`https://picsum.photos/seed/${item.id}/400/600`}
                alt={`Design ${item.id}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
