
export interface Variation {
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Offer {
  type: 'discount' | 'bundle' | 'none';
  value: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  variations: Variation[];
  offer: Offer;
  category: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Golden Glamour Bangles",
    description: "Elegant golden bangles, perfect for special occasions. These handcrafted pieces feature intricate detailing that catches the light beautifully. Each bangle is carefully polished to achieve that perfect shine that complements both traditional and contemporary outfits.",
    images: [
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fshop.moneymax.com.sg%2Fcdn%2Fshop%2Ffiles%2FNG0496_A_2048x2048_nologo.jpg%3Fv%3D1692003363&f=1&nofb=1&ipt=2bb3256be611408d8e3f7cd6deb905bcc4e3be88cfef8d8db80f62aa864cadf6",
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.0TwWv3505tgI-Uyw_D7iZQHaHa%3Fpid%3DApi&f=1&ipt=73c1fb7e78cef68070d3769eaa484004c38ca64af25622f5c0d78635c441fff8",
      "https://via.placeholder.com/600x600?text=Golden3"
    ],
    variations: [
      { color: "Gold", size: "2.4", price: 250, quantity: 10 },
      { color: "Gold", size: "2.6", price: 250, quantity: 15 },
      { color: "Gold", size: "2.8", price: 275, quantity: 12 }
    ],
    offer: { type: "discount", value: 0.10 },
    category: "traditional",
    featured: true
  },
  {
    id: "2",
    name: "Colorful Crystal Bangles",
    description: "Vibrant crystal bangles that add a touch of color to your outfit. These eye-catching pieces feature high-quality crystals that sparkle with every movement. Available in stunning red and blue variants, they're perfect for adding a pop of color to any ensemble.",
    images: [
      "https://via.placeholder.com/600x600?text=Crystal1",
      "https://via.placeholder.com/600x600?text=Crystal2"
    ],
    variations: [
      { color: "Red", size: "2.4", price: 300, quantity: 8 },
      { color: "Red", size: "2.6", price: 300, quantity: 12 },
      { color: "Blue", size: "2.4", price: 320, quantity: 10 },
      { color: "Blue", size: "2.6", price: 320, quantity: 14 }
    ],
    offer: { type: "discount", value: 0.15 },
    category: "contemporary",
    featured: true
  },
  {
    id: "3",
    name: "Silver Sparkle Bangles",
    description: "Sterling silver bangles with a sparkling finish, perfect for parties and special events. The minimalist design ensures they pair well with a variety of outfits, while the high-quality silver provides durability and a lasting finish.",
    images: [
      "https://via.placeholder.com/600x600?text=Silver1",
      "https://via.placeholder.com/600x600?text=Silver2"
    ],
    variations: [
      { color: "Silver", size: "2.4", price: 400, quantity: 5 },
      { color: "Silver", size: "2.6", price: 400, quantity: 7 }
    ],
    offer: { type: "none", value: 0 },
    category: "modern"
  },
  {
    id: "4",
    name: "Pearl Elegance Bangles",
    description: "Sophisticated pearl-embedded bangles that bring timeless elegance to any outfit. Each freshwater pearl is carefully selected and embedded in a stunning setting, creating a piece that transitions seamlessly from day to evening wear.",
    images: [
      "https://via.placeholder.com/600x600?text=Pearl1",
      "https://via.placeholder.com/600x600?text=Pearl2"
    ],
    variations: [
      { color: "White", size: "2.4", price: 350, quantity: 8 },
      { color: "Cream", size: "2.6", price: 375, quantity: 6 }
    ],
    offer: { type: "discount", value: 0.05 },
    category: "classic"
  },
  {
    id: "5",
    name: "Boho Chic Bangles Set",
    description: "A set of 5 mixed material bangles with bohemian patterns and charms. This eclectic mix combines wood, metal, and fabric elements to create a statement stack that adds character to casual and boho-inspired outfits.",
    images: [
      "https://via.placeholder.com/600x600?text=Boho1",
      "https://via.placeholder.com/600x600?text=Boho2"
    ],
    variations: [
      { color: "Mixed", size: "2.4", price: 200, quantity: 12 },
      { color: "Mixed", size: "2.6", price: 200, quantity: 10 }
    ],
    offer: { type: "bundle", value: 5 },
    category: "boho",
    featured: true
  },
  {
    id: "6",
    name: "Diamond Accent Bangle",
    description: "Luxurious gold bangle with diamond accents, perfect for making a statement. This high-end piece features ethically sourced diamond chips that catch the light beautifully, set in a substantial gold setting that feels as premium as it looks.",
    images: [
      "https://via.placeholder.com/600x600?text=Diamond1",
      "https://via.placeholder.com/600x600?text=Diamond2"
    ],
    variations: [
      { color: "Gold", size: "2.4", price: 800, quantity: 3 },
      { color: "Gold", size: "2.6", price: 825, quantity: 4 }
    ],
    offer: { type: "none", value: 0 },
    category: "luxury"
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
