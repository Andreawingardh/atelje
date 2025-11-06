export type PhotoCategory = 'nature' | 'city' | 'graphic' | 'vintage' | 'animals' | 'people';

export interface StockPhoto {
  id: string;
  filename: string;
  category: PhotoCategory;
  alt: string;
  photographer: string;

  aspectRatio?: number;
}

export const stockPhotos: StockPhoto[] = [
  {
    id: 'orange-cat',
    filename: 'orange-cat-amber-kipp-unsplash.jpg',
    category: 'animals',
    alt: 'Portrait of an orange cat laying on a table',
    photographer: 'Amber Kipp',
    aspectRatio: 1.5
  },
  {
    id: 'corgi-yorkshireterrier',
    filename: 'corgi-yorkshireterrier-alvan-nee-unsplash.jpg',
    category: 'animals',
    alt: 'A corgi and a yorkshire terrier running down a road',
    photographer: 'Alvan Nee',
    aspectRatio: 1.5
  },
  {
    id: 'children-on-bridge',
    filename: 'children-on-bridge-kevin-gent-unsplash.jpg',
    category: 'people',
    alt: 'Two children walking on a bridge with their backs to the camera',
    photographer: 'Kevin Gent',
    aspectRatio: 1.5
  },
  {
    id: 'family-flying-kite',
    filename: 'family-flying-kite-klara-kulikova-unsplash.jpg',
    category: 'people',
    alt: 'A family flying a kite in a field',
    photographer: 'Klara Kulikova',
    aspectRatio: 1.5
  },
];

// Helper functions
export const getPhotosByCategory = (category: PhotoCategory) => 
  stockPhotos.filter(photo => photo.category === category);

export const getPhotoById = (id: string) => 
  stockPhotos.find(photo => photo.id === id);