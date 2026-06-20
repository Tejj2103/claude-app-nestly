export type PropertyCategory = "Apartment" | "Houses" | "Retail" | "Lease";
export type FurnishedStatus = "Furnished" | "Semi-Furnished" | "Unfurnished";

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
}
