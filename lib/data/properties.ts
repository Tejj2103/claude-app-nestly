import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import type { FurnishedStatus, Property, PropertyCategory } from "./types";

export type BhkFilter = "Studio" | "1" | "2" | "3" | "Any";
export type BathroomsFilter = "1" | "2" | "3+" | "Any";
export type SortBy = "price-asc" | "price-desc" | "none";

export interface HomeFilters {
  category?: PropertyCategory | "All";
  query?: string;
  bhk?: BhkFilter;
  furnished?: FurnishedStatus | "Any";
  bathrooms?: BathroomsFilter;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortBy;
}

const BHK_BEDROOMS: Record<Exclude<BhkFilter, "Any">, number> = {
  Studio: 0,
  "1": 1,
  "2": 2,
  "3": 3,
};

interface PropertyRow {
  id: string;
  title: string;
  location: string;
  image_url: string;
  price: number;
  category: PropertyCategory;
  badge: string | null;
  area_sqm: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  furnished: FurnishedStatus | null;
  parking: string | null;
}

export function mapPropertyRow(row: PropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    imageUrl: row.image_url,
    price: row.price,
    category: row.category,
    badge: row.badge ?? undefined,
    areaSqm: row.area_sqm ?? undefined,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    furnished: row.furnished ?? undefined,
    parking: row.parking ?? undefined,
  };
}

interface UseHomesResult {
  data: Property[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Live Supabase-backed read. Filters are applied server-side where
 * practical (category/query/bhk/furnished/bathrooms/price/sort).
 */
export function useHomes(filters: HomeFilters = {}): UseHomesResult {
  const { category, query, bhk, furnished, bathrooms, minPrice, maxPrice, sortBy } = filters;

  const [data, setData] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (mode: "initial" | "refresh") => {
      if (mode === "initial") setIsLoading(true);
      else setIsRefreshing(true);
      setError(null);

      let q = supabase.from("properties").select("*");

      if (category && category !== "All") {
        q = q.eq("category", category);
      }
      if (query?.trim()) {
        const term = query.trim().replace(/[%,]/g, "");
        q = q.or(`title.ilike.%${term}%,location.ilike.%${term}%`);
      }
      if (bhk && bhk !== "Any") {
        q = q.eq("bedrooms", BHK_BEDROOMS[bhk]);
      }
      if (furnished && furnished !== "Any") {
        q = q.eq("furnished", furnished);
      }
      if (bathrooms && bathrooms !== "Any") {
        q = bathrooms === "3+" ? q.gte("bathrooms", 3) : q.eq("bathrooms", Number(bathrooms));
      }
      if (minPrice != null) {
        q = q.gte("price", minPrice);
      }
      if (maxPrice != null) {
        q = q.lte("price", maxPrice);
      }
      q =
        sortBy === "price-asc"
          ? q.order("price", { ascending: true })
          : sortBy === "price-desc"
            ? q.order("price", { ascending: false })
            : q.order("created_at", { ascending: false });

      const { data: rows, error: queryError } = await q;

      if (queryError) {
        setError(queryError.message);
        setData([]);
      } else {
        setData((rows ?? []).map((row) => mapPropertyRow(row as PropertyRow)));
      }

      if (mode === "initial") setIsLoading(false);
      else setIsRefreshing(false);
    },
    [category, query, bhk, furnished, bathrooms, minPrice, maxPrice, sortBy]
  );

  useEffect(() => {
    load("initial");
  }, [load]);

  const refetch = useCallback(() => {
    load("refresh");
  }, [load]);

  return { data, isLoading, isRefreshing, error, refetch };
}

interface UseHomeResult {
  data: Property | undefined;
  isLoading: boolean;
  error: string | null;
}

export function useHome(id: string | undefined): UseHomeResult {
  const [data, setData] = useState<Property | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(undefined);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data: row, error: queryError }) => {
        if (cancelled) return;
        if (queryError) {
          setError(queryError.message);
          setData(undefined);
        } else {
          setData(row ? mapPropertyRow(row as PropertyRow) : undefined);
        }
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, isLoading, error };
}
