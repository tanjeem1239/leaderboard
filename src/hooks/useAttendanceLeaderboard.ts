import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceSBUData {
  sbu_id: string; // UUID
  sbu_name: string;
  rank: number;
  total_employees: number;
  avg_worked_hours: number;
  missing_logs_percentage: number | null;
  low_hours_percentage: number | null;
  high_hours_percentage: number | null;
  invalid_hours_percentage: number | null;
  health_score: number | null;
  employees_with_issues: number;
}

interface UseAttendanceLeaderboardParams {
  startDate: string; // Format: YYYY-MM-DD
  endDate: string;   // Format: YYYY-MM-DD
  autoFetch?: boolean;
}

// Cache for storing fetched data by date range key
const dataCache = new Map<string, AttendanceSBUData[]>();

export function useAttendanceLeaderboard({
  startDate,
  endDate,
  autoFetch = true,
}: UseAttendanceLeaderboardParams) {
  const cacheKey = useMemo(() => `${startDate}-${endDate}`, [startDate, endDate]);
  const cachedData = useMemo(() => dataCache.get(cacheKey) || [], [cacheKey]);
  
  const [data, setData] = useState<AttendanceSBUData[]>(cachedData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error: rpcError } = await supabase.rpc(
        'get_attendance_sbu_leaderboard',
        {
          p_start_date: startDate,
          p_end_date: endDate,
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
      
      console.log('Attendance data:', parsedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching attendance leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, cacheKey]);

  useEffect(() => {
    if (autoFetch && startDate && endDate && !dataCache.has(cacheKey)) {
      fetchData();
    }
  }, [startDate, endDate, autoFetch, cacheKey, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
