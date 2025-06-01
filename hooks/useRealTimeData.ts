import { useState, useEffect, useCallback, useRef } from 'react';

interface UseRealTimeDataOptions {
  interval?: number; // Refresh interval in milliseconds
  enabled?: boolean; // Whether to enable auto-refresh
  onError?: (error: Error) => void;
}

export function useRealTimeData<T>(
  fetchFn: () => Promise<T>,
  options: UseRealTimeDataOptions = {}
) {
  const { interval = 30000, enabled = true, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setError(null);
      const result = await fetchFn();
      
      if (mountedRef.current) {
        setData(result);
        setLastUpdated(new Date());
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      
      if (mountedRef.current) {
        setError(error);
        onError?.(error);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFn, onError]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchData();
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up auto-refresh
  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(() => {
      fetchData();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, interval, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    isStale: lastUpdated ? Date.now() - lastUpdated.getTime() > interval : false
  };
}

// Hook for dashboard stats with caching
export function useDashboardStats() {
  return useRealTimeData(
    async () => {
      const response = await fetch('/api/dashboard/stats', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }
      
      return response.json();
    },
    {
      interval: 30000, // 30 seconds
      enabled: true,
      onError: (error) => {
        console.error('Dashboard stats error:', error);
      }
    }
  );
}

// Hook for recent activity
export function useRecentActivity() {
  return useRealTimeData(
    async () => {
      const response = await fetch('/api/activity/recent', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activity: ${response.status}`);
      }
      
      return response.json();
    },
    {
      interval: 60000, // 1 minute
      enabled: true
    }
  );
} 