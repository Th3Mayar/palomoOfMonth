interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export const useApiClient = () => {
  const config = useRuntimeConfig();
  const token = useCookie('auth-token');

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`;
    }

    return headers;
  };

  const apiCall = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const { method = 'GET', body, headers: customHeaders = {} } = options;
    
    const requestHeaders = {
      ...getAuthHeaders(),
      ...customHeaders,
    };

    try {
      const response = await $fetch(`${config.public.apiBaseUrl}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      }) as unknown as T;

      return response;
    } catch (error: any) {
      // Handle 401 Unauthorized - redirect to login
      if (error.statusCode === 401) {
        token.value = null;
        await navigateTo('/auth/login');
        throw new Error('Unauthorized - Please login again');
      }

      // Handle other errors
      throw new Error(error.message || error.data?.message || 'API request failed');
    }
  };

  const get = <T>(endpoint: string, headers?: Record<string, string>): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'GET', headers });
  };

  const post = <T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'POST', body, headers });
  };

  const put = <T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'PUT', body, headers });
  };

  const del = <T>(endpoint: string, headers?: Record<string, string>): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'DELETE', headers });
  };

  return {
    get,
    post,
    put,
    delete: del,
    getAuthHeaders,
  };
};
