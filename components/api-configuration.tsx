'use client';

import { useState } from 'react';
import { useApi } from '@/lib/api-context';
import { getApiService } from '@/lib/api-service';
import { Button } from '@/components/ui/button';

export function ApiConfiguration() {
  const { baseUrl, setBaseUrl, setIsConnected, setSchema } = useApi();
  const [inputUrl, setInputUrl] = useState(baseUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleConnect = async () => {
    if (!inputUrl.trim()) {
      setError('Silakan masukkan URL dasar');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiService = getApiService(inputUrl);
      const isConnected = await apiService.testConnection();

      if (isConnected) {
        setBaseUrl(inputUrl);
        setIsConnected(true);
        setSuccess('Terhubung dengan sukses!');
        // Reset schema on new connection
        setSchema({});
      } else {
        setError('Gagal terhubung ke API');
        setIsConnected(false);
      }
    } catch (err: any) {
      setError(err.message || 'Koneksi gagal');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          URL Dasar API
        </label>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://api.example.com"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-md text-green-700 dark:text-green-400 text-sm flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      <Button
        onClick={handleConnect}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Menghubungkan...' : 'Hubungkan'}
      </Button>
    </div>
  );
}
