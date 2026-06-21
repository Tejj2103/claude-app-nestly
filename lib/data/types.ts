export type PropertyCategory = "Apartment" | "Houses" | "Retail" | "Lease";
export type FurnishedStatus = "Furnished" | "Semi-Furnished" | "Unfurnished";
export type PropertyStatus = "available" | "sold" | "rented" | "hold";

export interface Property {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  price: number;
  category: PropertyCategory;
  badge?: string;
  areaSqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: FurnishedStatus;
  parking?: string;
  status: PropertyStatus;
  availableFrom?: string;
  description?: string;
  city?: string;
}

export interface PropertyImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}
