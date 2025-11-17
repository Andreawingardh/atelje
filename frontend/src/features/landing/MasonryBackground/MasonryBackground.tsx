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
  // Add more items - aim for 15-20 total
];

export default function MasonryBackground() {
  return (
    <div className={styles.masonryGrid}>
      {masonryItems.map((item) => (
        <div
          key={item.id}
          className={styles.masonryItem}
          style={{
            transform: item.id % 2 === 0 ? "translateY(-7rem)" : undefined,
          }}
        >
          <Image
            src={`https://picsum.photos/seed/${item.id}/400/600`}
            alt={`Design ${item.id}`}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  );
}
