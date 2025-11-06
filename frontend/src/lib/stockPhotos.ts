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
  {
    id: 'leaf-with-waterdrop',
    filename: 'leaf-with-waterdrop-aaron-burden-unsplash.jpg',
    category: 'nature',
    alt: 'Close-up of a leaf with a water drop on it',
    photographer: 'Aaron Burden',
    aspectRatio: 1.5
  },
  {
    id: 'mountains-field-flowers',
    filename: 'mountains-field-flowers-daniela-kokina-unsplash.jpg',
    category: 'nature',
    alt: 'A mountain with field of flowers in front of it',
    photographer: 'Sergey Shmidt',
    aspectRatio: 1.5
  },
  {
    id: 'yellow-flowers',
    filename: 'yellow-flowers-sergey-shmidt-unsplash.jpg',
    category: 'nature',
    alt: 'Yellow flowers in a field',
    photographer: 'Sergey Shmidt',
    aspectRatio: 1.5
  },
  {
    id: 'sunset-wheat',
    filename: 'sunset-wheat-ann-savchenko-unsplash.jpg',
    category: 'nature',
    alt: 'Sunset with the silhouette of wheat in the foreground',
    photographer: 'Ann Savchenko',
    aspectRatio: 1.5
  },
  {
    id: 'sunset-with-palms',
    filename: 'sunset-with-palms-prometey-sanchez-unsplash.jpg',
    category: 'nature',
    alt: 'Sunset with the silhouette of palms in the foreground',
    photographer: 'Prometey Sanchez',
    aspectRatio: 1.5
  },
  {
    id: 'dark-sea-water',
    filename: 'dark-sea-water-akira-hojo-unsplash.jpg',
    category: 'nature',
    alt: 'Dark blue sea water',
    photographer: 'Akira Hojo',
    aspectRatio: 1.5
  },
  {
    id: 'light-pool-water',
    filename: 'light-pool-water-wesley-tingey-9-unsplash.jpg',
    category: 'nature',
    alt: 'Light blue pool water',
    photographer: 'Wesley Tingey',
    aspectRatio: 1.5
  },
  {
    id: 'neon-signs',
    filename: 'neon-signs-joel-fulgencio-unsplash.jpg',
    category: 'city',
    alt: 'Neon signs at night',
    photographer: 'Joel Fulgencio',
    aspectRatio: 1.5
  },
  {
    id: 'vintage-birds',
    filename: 'vintage-birds-print-mcgill-library-unsplash.jpg',
    category: 'vintage',
    alt: 'Vintage print of two blue birds',
    photographer: 'McGill Library',
    aspectRatio: 1.5
  },
  {
    id: 'vintage-photo-swimmers',
    filename: 'vintage-photo-swimmers-colored-boston-public-library-unsplash.jpg',
    category: 'vintage',
    alt: 'Vintage print of two blue birds',
    photographer: 'Boston Public Library',
    aspectRatio: 1.5
  },
  {
    id: 'vintage-scheveningen-poster',
    filename: 'vintage-scheveningen-poster-mcgill-library-unsplash.jpg',
    category: 'vintage',
    alt: 'Vintage poster of Scheveningen beach',
    photographer: 'McGill Library',
    aspectRatio: 1.5
  },
  {
    id: 'vintage-sketch-woman-on-bed',
    filename: 'vintage-sketch-woman-on-bed-birmingham-museums-trust-unsplash.jpg',
    category: 'vintage',
    alt: 'Vintage sketch of woman on bed',
    photographer: 'Birmingham Museums Trust',
    aspectRatio: 1.5
  },
  {
    id: 'graphic-print-ampersand',
    filename: 'graphic-print-ampersand-boxicons-O4c-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of an ampersand',
    photographer: 'Boxicons',
    aspectRatio: 1.5
  },
  {
    id: 'graphic-print-black-cat',
    filename: 'graphic-print-black-cat-annie-spratt-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of a black cat',
    photographer: 'Annie Spratt',
    aspectRatio: 1.5
  },
  {
    id: 'graphic-print-colorful-flora',
    filename: 'graphic-print-colorful-flora-lungani-magwaza-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of colorful flora',
    photographer: 'Lungani Magwaza',
    aspectRatio: 1.5
  },
  {
    id: 'graphic-print-orange',
    filename: 'graphic-print-orange-mia-robinson-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of half an orange',
    photographer: 'Mia Robinson',
    aspectRatio: 1.5
  },
  {
    id: 'graphic-print-black-smudge',
    filename: 'graphic-print-black-smudge-sheldon-liu-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of black smudge on white background',
    photographer: 'Sheldon Liu',
    aspectRatio: 1.5
  },
  {
    id: 'graphic-print-snake',
    filename: 'graphic-print-snake-anna-magenta-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of a snake',
    photographer: 'Anna Magenta',
    aspectRatio: 1.5
  },
  {
    id: 'graphic-print-abstract',
    filename: 'graphic-print-abstract-the-new-york-public-library-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of rectangles in various colors',
    photographer: 'The New York Public Library',
    aspectRatio: 1.5
  }
];

// Helper functions
export const getPhotosByCategory = (category: PhotoCategory) => 
  stockPhotos.filter(photo => photo.category === category);

export const getPhotoById = (id: string) => 
  stockPhotos.find(photo => photo.id === id);