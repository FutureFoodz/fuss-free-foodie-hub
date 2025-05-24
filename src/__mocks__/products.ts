export interface MockProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  inStock: boolean;
  details: string;
  featured: boolean;
}

export const mockProductsData: MockProduct[] = [
  {
    id: 1,
    name: "Artisanal Tempeh",
    description: "Handcrafted fermented soybean goodness with traditional Indonesian methods",
    price: "$12.99",
    category: "Protein",
    image: "photo-1618160702438-9b02ab6515c9",
    inStock: true,
    details: "Organic soybeans, fermented for 48 hours, rich in probiotics and protein",
    featured: true,
  },
  {
    id: 2,
    name: "Dark Chocolate Bliss",
    description: "70% cacao, ethically sourced from sustainable farms",
    price: "$8.50",
    category: "Treats",
    image: "photo-1465146344425-f00d5f5c8f07",
    inStock: true,
    details: "Single-origin cacao, no refined sugars, naturally sweetened",
    featured: true,
  },
  {
    id: 3,
    name: "Probiotic Kimchi",
    description: "Traditional fermented vegetables packed with beneficial bacteria",
    price: "$9.75",
    category: "Fermented",
    image: "photo-1582562124811-c09040d0a901",
    inStock: true,
    details: "Napa cabbage, Korean chili flakes, naturally fermented for 2 weeks",
    featured: false, // Not featured for Index page test differentiation
  },
  {
    id: 4,
    name: "Kombucha Variety Pack",
    description: "Three flavors of our signature fermented tea",
    price: "$24.99",
    category: "Beverages",
    image: "photo-1506744038136-46273834b3fb",
    inStock: true,
    details: "Ginger Lemon, Berry Hibiscus, and Green Tea varieties",
    featured: false,
  },
  {
    id: 5,
    name: "Cashew Cream Cheese",
    description: "Smooth and creamy dairy-free cheese alternative",
    price: "$11.25",
    category: "Dairy Alternatives",
    image: "photo-1513836279014-a89f7a76ae86",
    inStock: false,
    details: "Raw cashews, nutritional yeast, cultured for authentic tangy flavor",
    featured: true, // Another featured product
  },
  {
    id: 6,
    name: "Ancient Grain Bread",
    description: "Hearty and wholesome loaf made with ancient grains.",
    price: "$7.50",
    category: "Bakery", // New category for testing filters
    image: "photo-1534620808146-d338ada627dd",
    inStock: true,
    details: "Spelt, einkorn, and kamut flour blend. Naturally leavened.",
    featured: false,
  },
];
