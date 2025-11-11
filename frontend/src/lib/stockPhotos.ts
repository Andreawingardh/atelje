export type PhotoCategory = 'nature' | 'city' | 'graphic' | 'vintage' | 'animals' | 'people';

export interface StockPhoto {
  id: string;
  filename: string;
  category: PhotoCategory;
  alt: string;
  photographer: string;
}

export const stockPhotos: StockPhoto[] = [
  {
    id: 'orange-cat',
    filename: 'orange-cat-amber-kipp-unsplash.jpg',
    category: 'animals',
    alt: 'Portrait of an orange cat laying on a table',
    photographer: 'Amber Kipp'
  },
  {
    id: 'corgi-yorkshireterrier',
    filename: 'corgi-yorkshireterrier-alvan-nee-unsplash.jpg',
    category: 'animals',
    alt: 'A corgi and a yorkshire terrier running down a road',
    photographer: 'Alvan Nee'
  },
  {
    id: 'pug',
    filename: 'pug-jc-gellidon-unsplash.jpg',
    category: 'animals',
    alt: 'A pug resting on the floor',
    photographer: 'JC Gellidon'
  },
  {
    id: 'black-cat',
    filename: 'black-cat-gio-bartlett-unsplash.jpg',
    category: 'animals',
    alt: 'A Black cat in profile',
    photographer: 'Gio Bartlett'
  },
  {
    id: 'horse',
    filename: 'horse-seth-fink-unsplash.jpg',
    category: 'animals',
    alt: 'A brown horse in daytime',
    photographer: 'Seth Fink'
  },
  {
    id: 'bunny-rabbit',
    filename: 'bunny-rabbit-erik-jan-leusink-unsplash.jpg',
    category: 'animals',
    alt: 'A rabbit lying down',
    photographer: 'Erik Jan Leusink'
  },
  {
    id: 'children-on-bridge',
    filename: 'children-on-bridge-kevin-gent-unsplash.jpg',
    category: 'people',
    alt: 'Two children walking on a bridge with their backs to the camera',
    photographer: 'Kevin Gent'
  },
  {
    id: 'family-flying-kite',
    filename: 'family-flying-kite-klara-kulikova-unsplash.jpg',
    category: 'people',
    alt: 'A family flying a kite in a field',
    photographer: 'Klara Kulikova'
  },
  {
    id: 'family-in-forest',
    filename: 'family-in-forest-andrew-yurkiv-unsplash.jpg',
    category: 'people',
    alt: 'A family walking in the forest',
    photographer: 'Andrew Yurkiv'
  },
  {
    id: 'family-in-field',
    filename: 'family-in-field-jessica-rockowitz-unsplash.jpg',
    category: 'people',
    alt: 'A family walking in a field',
    photographer: 'Jessica Rockowitz'
  },
  {
    id: 'parent-playing-with-child',
    filename: 'parent-playing-with-child-natasha-ivanchikhina-unsplash.jpg',
    category: 'people',
    alt: 'A parent holding their child in the air',
    photographer: 'Natasha Ivanchikhina'
  },
  {
    id: 'family-on-the-beach',
    filename: 'family-on-the-beach-devon-daniel-unsplash.jpg',
    category: 'people',
    alt: 'Parents with child sitting by the water',
    photographer: 'Devon Daniel'
  },
  {
    id: 'leaf-with-waterdrop',
    filename: 'leaf-with-waterdrop-aaron-burden-unsplash.jpg',
    category: 'nature',
    alt: 'Close-up of a leaf with a water drop on it',
    photographer: 'Aaron Burden'
  },
  {
    id: 'mountains-field-flowers',
    filename: 'mountains-field-flowers-daniela-kokina-unsplash.jpg',
    category: 'nature',
    alt: 'A mountain with field of flowers in front of it',
    photographer: 'Sergey Shmidt'
  },
  {
    id: 'yellow-flowers',
    filename: 'yellow-flowers-sergey-shmidt-unsplash.jpg',
    category: 'nature',
    alt: 'Yellow flowers in a field',
    photographer: 'Sergey Shmidt'
  },
  {
    id: 'sunset-wheat',
    filename: 'sunset-wheat-ann-savchenko-unsplash.jpg',
    category: 'nature',
    alt: 'Sunset with the silhouette of wheat in the foreground',
    photographer: 'Ann Savchenko'
  },
  {
    id: 'sunset-with-palms',
    filename: 'sunset-with-palms-prometey-sanchez-unsplash.jpg',
    category: 'nature',
    alt: 'Sunset with the silhouette of palms in the foreground',
    photographer: 'Prometey Sanchez'
  },
  {
    id: 'dark-sea-water',
    filename: 'dark-sea-water-akira-hojo-unsplash.jpg',
    category: 'nature',
    alt: 'Dark blue sea water',
    photographer: 'Akira Hojo'
  },
  {
    id: 'light-pool-water',
    filename: 'light-pool-water-wesley-tingey-9-unsplash.jpg',
    category: 'nature',
    alt: 'Light blue pool water',
    photographer: 'Wesley Tingey'
  },
  {
    id: 'neon-signs',
    filename: 'neon-signs-joel-fulgencio-unsplash.jpg',
    category: 'city',
    alt: 'Neon signs at night',
    photographer: 'Joel Fulgencio'
  },
    {
    id: 'golden-gate-bridge',
    filename: 'golden-gate-bridge-maarten-van-den-heuvel-unsplash.jpg',
    category: 'city',
    alt: 'Golden gate bridge during daytime',
    photographer: 'Maarten Van den Heuvel'
  },
    {
    id: 'gothenburg-tram',
    filename: 'gothenburg-tram-louise-krause-unsplash.jpg',
    category: 'city',
    alt: 'A tram in Gothenburg on the rail in daytime',
    photographer: 'Louise Krause'
  },
    {
    id: 'copenhagen-houses',
    filename: 'copenhagen-houses-maksym-potapenko-unsplash.jpg',
    category: 'city',
    alt: 'Assorted-color buildings and a red boat during daytime',
    photographer: 'Maksym Potapenko'
  },
    {
    id: 'yellow-taxi',
    filename: 'yellow-taxi-ross-sneddon-unsplash.jpg',
    category: 'city',
    alt: 'Yellow car on the street in daytime',
    photographer: 'Ross Sneddon'
  },
    {
    id: 'eiffel-tower',
    filename: 'eiffel-tower-bw-jorge-gascon-Q-unsplash.jpg',
    category: 'city',
    alt: 'Closeup of Eiffel tower in black and white',
    photographer: 'Ross Sneddon'
  },
  {
    id: 'vintage-vase-of-flowers',
    filename: 'vase-of-flowers-europeana-jan-davidsz-de-heem-unsplash.jpg',
    category: 'vintage',
    alt: 'Pink and white flowers with green leaves',
    photographer: 'Jan Davidsz de Heem'
  },
  {
    id: 'portrait-woman',
    filename: 'portrait-woman-birmingham-museums-trust-unsplash.jpg',
    category: 'vintage',
    alt: 'A woman in profile',
    photographer: 'Birmingham mUSEUM Trust'
  },
  {
    id: 'vintage-photo-swimmers',
    filename: 'vintage-photo-swimmers-colored-boston-public-library-unsplash.jpg',
    category: 'vintage',
    alt: 'Vintage print of swimmers in a pool',
    photographer: 'Boston Public Library'
  },
  {
    id: 'vintage-pink-rose',
    filename: 'pink-rose-the-new-york-public-library-unsplash.jpg',
    category: 'vintage',
    alt: 'Vintage print of a pink rose',
    photographer: 'The New York Public Library'
  },
  {
    id: 'vintage-scheveningen-poster',
    filename: 'vintage-scheveningen-poster-mcgill-library-unsplash.jpg',
    category: 'vintage',
    alt: 'Vintage poster of Scheveningen beach',
    photographer: 'McGill Library'
  },
  {
    id: 'vintage-sketch-woman-on-bed',
    filename: 'vintage-sketch-woman-on-bed-birmingham-museums-trust-unsplash.jpg',
    category: 'vintage',
    alt: 'Vintage sketch of woman on bed',
    photographer: 'Birmingham Museums Trust'
  },
  {
    id: 'graphic-print-ampersand',
    filename: 'graphic-print-ampersand-boxicons-O4c-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of an ampersand',
    photographer: 'Boxicons'
  },
  {
    id: 'graphic-print-black-cat',
    filename: 'graphic-print-black-cat-annie-spratt-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of a black cat',
    photographer: 'Annie Spratt'
  },
  {
    id: 'graphic-print-colorful-flora',
    filename: 'graphic-print-colorful-flora-lungani-magwaza-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of colorful flora',
    photographer: 'Lungani Magwaza'
  },
  {
    id: 'graphic-print-orange',
    filename: 'graphic-print-orange-mia-robinson-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of half an orange',
    photographer: 'Mia Robinson'
  },
  {
    id: 'graphic-print-black-smudge',
    filename: 'graphic-print-black-smudge-sheldon-liu-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of black smudge on white background',
    photographer: 'Sheldon Liu'
  },
  {
    id: 'graphic-print-snake',
    filename: 'graphic-print-snake-anna-magenta-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of a snake',
    photographer: 'Anna Magenta'
  },
  {
    id: 'graphic-print-abstract',
    filename: 'graphic-print-abstract-the-new-york-public-library-unsplash.jpg',
    category: 'graphic',
    alt: 'Graphic print of rectangles in various colors',
    photographer: 'The New York Public Library'
  }
];

// Helper functions
export const getPhotosByCategory = (category: PhotoCategory) =>
  stockPhotos.filter(photo => photo.category === category);

export const getPhotoById = (id: string) =>
  stockPhotos.find(photo => photo.id === id);