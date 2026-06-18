import type { Property } from "./types";

export const dummyFeaturedProperty: Property = {
  id: "featured-1",
  title: "Lalaland Thick Villa",
  location: "New York, NY",
  imageUrl:
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80&auto=format&fit=crop",
  price: 268,
  badge: "Prime Rent",
  areaSqm: 400,
  bedrooms: 5,
  parking: "Dual Garage",
};

export const dummyRecommendedProperties: Property[] = [
  {
    id: "rec-1",
    title: "2-Bed Residence",
    location: "New York, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=400&q=80&auto=format&fit=crop",
    price: 160000,
  },
  {
    id: "rec-2",
    title: "Modern Loft",
    location: "Brooklyn, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80&auto=format&fit=crop",
    price: 215000,
  },
  {
    id: "rec-3",
    title: "Skyline Apartment",
    location: "Manhattan, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80&auto=format&fit=crop",
    price: 189000,
  },
];
