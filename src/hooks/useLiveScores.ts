'use client';
import { useState, useEffect, useCallback } from 'react';
import { Match } from '@/types';
import { getLiveMatches } from '@/lib/api';

export function useLiveScores() {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLive = useCallback(async () => {
    try {
      const data = await getLiveMatches();
      setLiveMatches(data);
      setLoading(false);
    } catch (e) {
      setError(e as Error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 10000);
    return () => clearInterval(interval);
  }, [fetchLive]);

  return { liveMatches, loading, error, refetch: fetchLive };
}
