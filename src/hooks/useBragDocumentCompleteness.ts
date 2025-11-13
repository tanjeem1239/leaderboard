import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BragDocumentSBUData {
  sbu_id: string; // UUID
  sbu_name: string;
  total_active_employees: number;
  submitted_employees: number;
  not_submitted_employees: number;
  completion_percentage: number;
}

interface UseBragDocumentCompletenessParams {
  year: number;
  month: number;
  autoFetch?: boolean;
}

// Cache for storing fetched data by year-month key
const dataCache = new Map<string, BragDocumentSBUData[]>();

export function useBragDocumentCompleteness({
  year,
  month,
  autoFetch = true,
}: UseBragDocumentCompletenessParams) {
  const cacheKey = useMemo(() => `${year}-${month}`, [year, month]);
  const cachedData = useMemo(() => dataCache.get(cacheKey) || [], [cacheKey]);
  
  const [data, setData] = useState<BragDocumentSBUData[]>(cachedData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error: rpcError } = await supabase.rpc(
        'get_brag_document_sbu_completeness',
        {
          p_year: year,
          p_month: month,
        } as any
      );

      if (rpcError) throw rpcError;
      
      // Handle different response types
      let parsedData;
      if (result === null || result === undefined) {
        parsedData = [];
      } else if (typeof result === 'string') {
        // If it's a JSON string, parse it
        parsedData = JSON.parse(result);
      } else if (Array.isArray(result)) {
        // If it's already an array, use it directly
        parsedData = result;
      } else {
        // If it's an object or other type, wrap it or use as-is
        parsedData = result;
      }
      
      const finalData = Array.isArray(parsedData) ? parsedData : [];
      setData(finalData);
      
      // Cache the data
      dataCache.set(cacheKey, finalData);
      
      console.log('Brag document data:', parsedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching brag document completeness:', err);
    } finally {
      setLoading(false);
    }
  }, [year, month, cacheKey]);

  useEffect(() => {
    if (autoFetch && year && month && !dataCache.has(cacheKey)) {
      fetchData();
    }
  }, [year, month, autoFetch, cacheKey, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
