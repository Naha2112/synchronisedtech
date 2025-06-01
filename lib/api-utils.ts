/**
 * Utility functions for API requests
 */

/**
 * Create headers with currency information
 */
export function createApiHeaders(currency?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (currency) {
    headers['x-currency'] = currency;
  }
  
  return headers;
}

/**
 * Make an API request with currency information
 */
export async function apiRequest(
  url: string, 
  options: RequestInit & { currency?: string } = {}
) {
  const { currency, ...requestOptions } = options;
  
  const headers = {
    ...createApiHeaders(currency),
    ...(requestOptions.headers || {}),
  };
  
  return fetch(url, {
    ...requestOptions,
    headers,
  });
} 