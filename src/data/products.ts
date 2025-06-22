export interface Variation {
  color: string;
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  variations: Variation[];
  category: string;
  featured?: boolean;
}

export const products: Product[] = [
  // COMBO BANGLES
  {
    id: "combo-yellow-green-1",
    name: "Yellow Green Combo Bangle Set",
    description: "Beautiful combination of yellow and green bangles perfect for festive occasions. This set features vibrant colors that complement traditional Indian attire beautifully.",
    images: [
      "/BANGLES/COMBO/Yellow_Green_Combo1.jpg",
      "/BANGLES/COMBO/Yellow_Green_Combo2.jpg"
    ],
    variations: [
      { color: "Yellow Green Combo", size: "2.2", price: 180 },
      { color: "Yellow Green Combo", size: "2.4", price: 180 },
      { color: "Yellow Green Combo", size: "2.6", price: 180 },
      { color: "Yellow Green Combo", size: "2.8", price: 180 }
    ],
    category: "combo",
    featured: true
  },
  {
    id: "combo-lavender-wine",
    name: "Lavender Wine Combo Bangle Set",
    description: "Elegant combination of lavender and wine colored bangles. Perfect for adding sophistication to any traditional or contemporary outfit.",
    images: [
      "/BANGLES/COMBO/Lavender_Wine_Combo1.jpg"
    ],
    variations: [
      { color: "Lavender Wine Combo", size: "2.2", price: 180 },
      { color: "Lavender Wine Combo", size: "2.4", price: 180 },
      { color: "Lavender Wine Combo", size: "2.6", price: 180 },
      { color: "Lavender Wine Combo", size: "2.8", price: 180 }
    ],
    category: "combo"
  },

  // ELEGANT BANGLES
  {
    id: "elegant-green",
    name: "Elegant Green Bangle",
    description: "Sophisticated green bangle with elegant design. Perfect for traditional occasions and adds a touch of grace to any ensemble.",
    images: [
      "/BANGLES/ELEGANT_BANGLES/Elegant_Green.jpg"
    ],
    variations: [
      { color: "Green", size: "2.2", price: 180 },
      { color: "Green", size: "2.4", price: 180 },
      { color: "Green", size: "2.6", price: 180 },
      { color: "Green", size: "2.8", price: 180 }
    ],
    category: "elegant"
  },
  {
    id: "elegant-green-kundhan-1",
    name: "Elegant Green with Kundhan Bangle",
    description: "Stunning green bangle adorned with kundhan work. The combination of green glass and kundhan creates a luxurious and traditional look.",
    images: [
      "/BANGLES/ELEGANT_BANGLES/Elegant_Green_with_Kundhan1.jpg",
      "/BANGLES/ELEGANT_BANGLES/Elegant_Green_with_Kundhan2.jpg"
    ],
    variations: [
      { color: "Green with Kundhan", size: "2.2", price: 180 },
      { color: "Green with Kundhan", size: "2.4", price: 180 },
      { color: "Green with Kundhan", size: "2.6", price: 180 },
      { color: "Green with Kundhan", size: "2.8", price: 180 }
    ],
    category: "elegant",
    featured: true
  },
  {
    id: "elegant-green-red",
    name: "Elegant Green and Red Bangle",
    description: "Beautiful combination of green and red in an elegant design. Perfect for festive occasions and traditional celebrations.",
    images: [
      "/BANGLES/ELEGANT_BANGLES/Elegant_Green_and_Red1.jpg"
    ],
    variations: [
      { color: "Green and Red", size: "2.2", price: 180 },
      { color: "Green and Red", size: "2.4", price: 180 },
      { color: "Green and Red", size: "2.6", price: 180 },
      { color: "Green and Red", size: "2.8", price: 180 }
    ],
    category: "elegant"
  },
  {
    id: "elegant-red-1",
    name: "Elegant Red Bangle",
    description: "Classic red bangle with elegant design. A timeless piece that adds warmth and tradition to any outfit.",
    images: [
      "/BANGLES/ELEGANT_BANGLES/Elegant_Red1.jpg",
      "/BANGLES/ELEGANT_BANGLES/Elegant_Red2.jpg"
    ],
    variations: [
      { color: "Red", size: "2.2", price: 180 },
      { color: "Red", size: "2.4", price: 180 },
      { color: "Red", size: "2.6", price: 180 },
      { color: "Red", size: "2.8", price: 180 }
    ],
    category: "elegant"
  },
  {
    id: "elegant-red-kundhan",
    name: "Elegant Red with Kundhan Bangle",
    description: "Luxurious red bangle enhanced with kundhan work. The perfect blend of traditional red and intricate kundhan detailing.",
    images: [
      "/BANGLES/ELEGANT_BANGLES/Elegant_Red_with_Kundhan1.jpg"
    ],
    variations: [
      { color: "Red with Kundhan", size: "2.2", price: 180 },
      { color: "Red with Kundhan", size: "2.4", price: 180 },
      { color: "Red with Kundhan", size: "2.6", price: 180 },
      { color: "Red with Kundhan", size: "2.8", price: 180 }
    ],
    category: "elegant",
    featured: true
  },

  // OLIVE BANGLES
  {
    id: "olive-green",
    name: "Olive Green Bangle",
    description: "Sophisticated olive green bangle with a unique earthy tone. Perfect for those who prefer subtle, elegant colors.",
    images: [
      "/BANGLES/OLIVE/Olive_Green1.jpg"
    ],
    variations: [
      { color: "Olive Green", size: "2.2", price: 200 },
      { color: "Olive Green", size: "2.4", price: 200 },
      { color: "Olive Green", size: "2.6", price: 200 },
      { color: "Olive Green", size: "2.8", price: 200 }
    ],
    category: "olive"
  },
  {
    id: "olive-green-kundhan",
    name: "Olive Green with Kundhan Bangle",
    description: "Elegant olive green bangle adorned with kundhan work. The earthy tone combined with kundhan creates a sophisticated look.",
    images: [
      "/BANGLES/OLIVE/Olive_Green_with_Kundhan1.jpg"
    ],
    variations: [
      { color: "Olive Green with Kundhan", size: "2.2", price: 200 },
      { color: "Olive Green with Kundhan", size: "2.4", price: 200 },
      { color: "Olive Green with Kundhan", size: "2.6", price: 200 },
      { color: "Olive Green with Kundhan", size: "2.8", price: 200 }
    ],
    category: "olive",
    featured: true
  },

  // OREO BANGLES
  {
    id: "oreo-red-1",
    name: "Oreo Red Bangle",
    description: "Classic oreo style red bangle with a unique layered design. The oreo pattern adds texture and visual interest to this traditional piece.",
    images: [
      "/BANGLES/OREO_BANGLES/Oreo_Red1.jpg",
      "/BANGLES/OREO_BANGLES/Oreo_Red2.jpg"
    ],
    variations: [
      { color: "Red", size: "2.2", price: 180 },
      { color: "Red", size: "2.4", price: 180 },
      { color: "Red", size: "2.6", price: 180 },
      { color: "Red", size: "2.8", price: 180 }
    ],
    category: "oreo"
  },
  {
    id: "oreo-red-kundhan",
    name: "Oreo Red with Kundhan Bangle",
    description: "Stunning oreo red bangle enhanced with kundhan work. The layered design combined with kundhan creates a luxurious appearance.",
    images: [
      "/BANGLES/OREO_BANGLES/Oreo_Red_with_kundhan1.jpg"
    ],
    variations: [
      { color: "Red with Kundhan", size: "2.2", price: 180 },
      { color: "Red with Kundhan", size: "2.4", price: 180 },
      { color: "Red with Kundhan", size: "2.6", price: 180 },
      { color: "Red with Kundhan", size: "2.8", price: 180 }
    ],
    category: "oreo",
    featured: true
  },
  {
    id: "oreo-peacock-blue-1",
    name: "Oreo Peacock Blue Bangle",
    description: "Beautiful oreo style bangle in peacock blue. The layered design in this vibrant color creates a stunning visual effect.",
    images: [
      "/BANGLES/OREO_BANGLES/Oreo_PeacockBlue1.jpg",
      "/BANGLES/OREO_BANGLES/Oreo_PeacockBlue2.jpg"
    ],
    variations: [
      { color: "Peacock Blue", size: "2.2", price: 180 },
      { color: "Peacock Blue", size: "2.4", price: 180 },
      { color: "Peacock Blue", size: "2.6", price: 180 },
      { color: "Peacock Blue", size: "2.8", price: 180 }
    ],
    category: "oreo"
  },
  {
    id: "oreo-peacock-blue-kundhan",
    name: "Oreo Peacock Blue with Kundhan Bangle",
    description: "Luxurious oreo peacock blue bangle with kundhan embellishments. The combination creates a regal and sophisticated look.",
    images: [
      "/BANGLES/OREO_BANGLES/Oreo_PeacockBlue_with_Kundhan1.jpg"
    ],
    variations: [
      { color: "Peacock Blue with Kundhan", size: "2.2", price: 180 },
      { color: "Peacock Blue with Kundhan", size: "2.4", price: 180 },
      { color: "Peacock Blue with Kundhan", size: "2.6", price: 180 },
      { color: "Peacock Blue with Kundhan", size: "2.8", price: 180 }
    ],
    category: "oreo",
    featured: true
  },
  {
    id: "oreo-multi-color-1",
    name: "Oreo Multi Color Bangle",
    description: "Vibrant oreo style bangle featuring multiple colors. Perfect for adding a pop of color and fun to any outfit.",
    images: [
      "/BANGLES/OREO_BANGLES/Oreo_Multi_Color1.jpg",
      "/BANGLES/OREO_BANGLES/Oreo_Multi_Color2.jpg"
    ],
    variations: [
      { color: "Multi Color", size: "2.2", price: 180 },
      { color: "Multi Color", size: "2.4", price: 180 },
      { color: "Multi Color", size: "2.6", price: 180 },
      { color: "Multi Color", size: "2.8", price: 180 }
    ],
    category: "oreo",
    featured: true
  },

  // PEARL BANGLES
  {
    id: "pearl-green",
    name: "Pearl Bangle - Green",
    description: "Elegant pearl bangle in a beautiful green shade. The pearl finish adds a sophisticated and luxurious touch to this piece.",
    images: [
      "/BANGLES/PEARL_BANGLE/Pearl_Bangle_Green1.jpg"
    ],
    variations: [
      { color: "Green", size: "2.2", price: 180 },
      { color: "Green", size: "2.4", price: 180 },
      { color: "Green", size: "2.6", price: 180 },
      { color: "Green", size: "2.8", price: 180 }
    ],
    category: "pearl"
  },
  {
    id: "pearl-pink-1",
    name: "Pearl Bangle - Pink",
    description: "Delicate pearl bangle in soft pink. Perfect for adding a feminine and elegant touch to any outfit.",
    images: [
      "/BANGLES/PEARL_BANGLE/Pearl_Bangle_Pink1.jpg",
      "/BANGLES/PEARL_BANGLE/Pearl_Bangle_Pink2.jpg"
    ],
    variations: [
      { color: "Pink", size: "2.2", price: 180 },
      { color: "Pink", size: "2.4", price: 180 },
      { color: "Pink", size: "2.6", price: 180 },
      { color: "Pink", size: "2.8", price: 180 }
    ],
    category: "pearl"
  },
  {
    id: "pearl-rani-pink-1",
    name: "Pearl Bangle - Rani Pink",
    description: "Bold rani pink pearl bangle with a striking appearance. Perfect for making a statement at special occasions.",
    images: [
      "/BANGLES/PEARL_BANGLE/Pearl_Bangle_Rani_Pink1.jpg",
      "/BANGLES/PEARL_BANGLE/Pearl_Bangle_Rani_Pink2.jpg"
    ],
    variations: [
      { color: "Rani Pink", size: "2.2", price: 180 },
      { color: "Rani Pink", size: "2.4", price: 180 },
      { color: "Rani Pink", size: "2.6", price: 180 },
      { color: "Rani Pink", size: "2.8", price: 180 }
    ],
    category: "pearl",
    featured: true
  },
  {
    id: "pearl-lavender",
    name: "Pearl Bangle - Lavender",
    description: "Soft lavender pearl bangle with a gentle, elegant appearance. Perfect for adding a touch of sophistication to any ensemble.",
    images: [
      "/BANGLES/PEARL_BANGLE/Pearl_Bangle_Lavender1.jpg"
    ],
    variations: [
      { color: "Lavender", size: "2.2", price: 180 },
      { color: "Lavender", size: "2.4", price: 180 },
      { color: "Lavender", size: "2.6", price: 180 },
      { color: "Lavender", size: "2.8", price: 180 }
    ],
    category: "pearl"
  },
  {
    id: "pearl-yellow",
    name: "Pearl Bangle - Yellow",
    description: "Bright yellow pearl bangle that adds warmth and vibrancy to any outfit. Perfect for festive occasions and celebrations.",
    images: [
      "/BANGLES/PEARL_BANGLE/Pearl_Bangle_Yellow1.jpg"
    ],
    variations: [
      { color: "Yellow", size: "2.2", price: 180 },
      { color: "Yellow", size: "2.4", price: 180 },
      { color: "Yellow", size: "2.6", price: 180 },
      { color: "Yellow", size: "2.8", price: 180 }
    ],
    category: "pearl"
  },

  // RAINDROP BANGLES
  {
    id: "raindrop-black-1",
    name: "Raindrop Black Bangle",
    description: "Classic black raindrop bangle with a unique textured design. The raindrop pattern creates an elegant and sophisticated look.",
    images: [
      "/BANGLES/RAINDROP/Raindrop_Black1.jpg",
      "/BANGLES/RAINDROP/Raindrop_Black2.jpg",
      "/BANGLES/RAINDROP/Raindrop_Black3.jpg",
      "/BANGLES/RAINDROP/Raindrop_Black4.jpg"
    ],
    variations: [
      { color: "Black", size: "2.2", price: 180 },
      { color: "Black", size: "2.4", price: 180 },
      { color: "Black", size: "2.6", price: 180 },
      { color: "Black", size: "2.8", price: 180 }
    ],
    category: "raindrop"
  },
  {
    id: "raindrop-lavender",
    name: "Raindrop Lavender Bangle",
    description: "Soft lavender raindrop bangle with a gentle, feminine appearance. The raindrop texture adds subtle elegance to this piece.",
    images: [
      "/BANGLES/RAINDROP/Raindrop_Lavender.jpg"
    ],
    variations: [
      { color: "Lavender", size: "2.2", price: 180 },
      { color: "Lavender", size: "2.4", price: 180 },
      { color: "Lavender", size: "2.6", price: 180 },
      { color: "Lavender", size: "2.8", price: 180 }
    ],
    category: "raindrop"
  },
  {
    id: "raindrop-reddish-pink-1",
    name: "Raindrop Reddish Pink Bangle",
    description: "Beautiful reddish pink raindrop bangle with a warm, inviting color. Perfect for adding a touch of romance to any outfit.",
    images: [
      "/BANGLES/RAINDROP/Raindrop_Reddishpink1.jpg",
      "/BANGLES/RAINDROP/Raindrop_Reddishpink2.jpg"
    ],
    variations: [
      { color: "Reddish Pink", size: "2.2", price: 180 },
      { color: "Reddish Pink", size: "2.4", price: 180 },
      { color: "Reddish Pink", size: "2.6", price: 180 },
      { color: "Reddish Pink", size: "2.8", price: 180 }
    ],
    category: "raindrop"
  },
  {
    id: "raindrop-vine",
    name: "Raindrop Vine Bangle",
    description: "Unique vine-patterned raindrop bangle with a natural, organic design. Perfect for those who appreciate nature-inspired jewelry.",
    images: [
      "/BANGLES/RAINDROP/Raindrop_Vine.jpg"
    ],
    variations: [
      { color: "Vine", size: "2.2", price: 180 },
      { color: "Vine", size: "2.4", price: 180 },
      { color: "Vine", size: "2.6", price: 180 },
      { color: "Vine", size: "2.8", price: 180 }
    ],
    category: "raindrop"
  },

  // RAINDROP MULTI COLOR BANGLES
  {
    id: "raindrop-multi-1",
    name: "Raindrop Multi Color Bangle",
    description: "Vibrant multi-color raindrop bangle featuring a beautiful blend of colors. Perfect for adding fun and excitement to any ensemble.",
    images: [
      "/BANGLES/RAINDROP_MULTI_COLOR_BANGLES/Raindrop_Multi1.jpg",
      "/BANGLES/RAINDROP_MULTI_COLOR_BANGLES/Raindrop_Multi2.jpg",
      "/BANGLES/RAINDROP_MULTI_COLOR_BANGLES/Raindrop_Multi3.jpg"
    ],
    variations: [
      { color: "Multi Color", size: "2.2", price: 180 },
      { color: "Multi Color", size: "2.4", price: 180 },
      { color: "Multi Color", size: "2.6", price: 180 },
      { color: "Multi Color", size: "2.8", price: 180 }
    ],
    category: "raindrop-multi",
    featured: true
  },
  {
    id: "raindrop-multi-green-1",
    name: "Raindrop Multi Green Bangle",
    description: "Beautiful green-themed multi-color raindrop bangle. The combination of different green shades creates a harmonious and natural look.",
    images: [
      "/BANGLES/RAINDROP_MULTI_COLOR_BANGLES/Raindrop_Multi_Green1.jpg",
      "/BANGLES/RAINDROP_MULTI_COLOR_BANGLES/Raindrop_Multi_Green2.jpg"
    ],
    variations: [
      { color: "Multi Green", size: "2.2", price: 180 },
      { color: "Multi Green", size: "2.4", price: 180 },
      { color: "Multi Green", size: "2.6", price: 180 },
      { color: "Multi Green", size: "2.8", price: 180 }
    ],
    category: "raindrop-multi"
  },
  {
    id: "raindrop-multi-yellow-1",
    name: "Raindrop Multi Yellow Bangle",
    description: "Warm yellow-themed multi-color raindrop bangle. The combination of yellow shades creates a bright and cheerful appearance.",
    images: [
      "/BANGLES/RAINDROP_MULTI_COLOR_BANGLES/Raindrop_Multi_Yellow1.jpg",
      "/BANGLES/RAINDROP_MULTI_COLOR_BANGLES/Raindrop_Multi_Yellow2.jpg"
    ],
    variations: [
      { color: "Multi Yellow", size: "2.2", price: 180 },
      { color: "Multi Yellow", size: "2.4", price: 180 },
      { color: "Multi Yellow", size: "2.6", price: 180 },
      { color: "Multi Yellow", size: "2.8", price: 180 }
    ],
    category: "raindrop-multi"
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') {
    return products;
  }
  return products.filter(product => product.category === category);
};
