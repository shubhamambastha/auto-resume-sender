"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface ResumeType {
  id: string;
  name: string;
  display_name: string;
  link: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useResumeTypes() {
  const [resumeTypes, setResumeTypes] = useState<ResumeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResumeTypes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("resumes")
        .select("*")
        .eq("is_active", true)
        .order("display_name", { ascending: true });

      if (fetchError) {
        console.error("Error fetching resume types:", fetchError);
        setError("Failed to load resume types. Please try again.");
      } else {
        setResumeTypes(data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching resume types:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeTypes();
  }, []);

  return {
    resumeTypes,
    isLoading,
    error,
    refetch: fetchResumeTypes,
  };
}
