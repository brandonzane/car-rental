import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface Listing {
  id: number;
  name: string;
  medium_url: string;
  car_type: string;
  price: number;
  // review_scores_rating: number;
  latitude: number | null; // Add latitude
  longitude: number | null; // Add longitude
}

export const useListings = (category: string) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        console.log("Fetching listings for category:", category);
        let query = supabase
          .from("listings")
          .select("id, name, medium_url, car_type, price, latitude, longitude"); // Include latitude and longitude

        if (category !== "All") {
          query = query.eq("car_type", category);
        }

        console.log("Executing Supabase query...");
        const { data, error } = await query;

        if (error) {
          console.error("Supabase query error:", error);
          throw error;
        }

        console.log("Fetched listings:", data);
        console.log("Number of listings:", data ? data.length : 0);
        setListings(data as Listing[]);
      } catch (err: any) {
        console.error("Error in fetchListings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category]);

  return { listings, loading, error };
};
