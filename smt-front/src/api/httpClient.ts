import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_URL } from "./host";
import { authService } from "./AuthService";

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Helper function to delete cookie
const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// HTTP client class
class HttpClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
  }> = [];
  private refreshAttempts = 0;
  private readonly MAX_REFRESH_ATTEMPTS = 1;

  constructor(baseURL: string = API_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      withCredentials: true, // Always include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add CSRF token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const csrfToken = getCookie('csrf_access_token');
        if (csrfToken) {
          config.headers['X-CSRF-TOKEN'] = csrfToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh for 401 errors on non-auth endpoints
        if (error.response?.status === 401 && 
            !originalRequest._retry && 
            !originalRequest.url?.includes('/login') && 
            !originalRequest.url?.includes('/register') &&
            !originalRequest.url?.includes('/refresh') &&
            this.refreshAttempts < this.MAX_REFRESH_ATTEMPTS) {
          
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.axiosInstance.request(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;
          this.refreshAttempts++;

          try {
            await authService.refreshToken();
            
            // Reset refresh attempts on successful refresh
            this.refreshAttempts = 0;
            
            this.failedQueue.forEach(({ resolve }) => {
              resolve(null);
            });
            this.failedQueue = [];

            return this.axiosInstance.request(originalRequest);
          } catch (refreshError) {
            // Clear all auth tokens and reset state
            this.clearAuthTokens();
            this.refreshAttempts = 0;
            
            this.failedQueue.forEach(({ reject }) => {
              reject(refreshError);
            });
            this.failedQueue = [];

            // Force redirect to login page
            this.redirectToLogin();
            
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        if (error.response) {
          const errorData = error.response.data;
          // Preserve the original error structure from the backend
          return Promise.reject(errorData || error);
        }
        return Promise.reject(error);
      }
    );
  }

  private redirectToLogin(): void {
    // Only redirect if not already on login page and not in a redirect loop
    const currentPath = window.location.pathname;
    if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
      // Use window.location.replace to prevent back button issues
      window.location.replace('/login');
    }
  }

  // Generic request method
  async request<T>(
    endpoint: string,
    config: AxiosRequestConfig = {},
    interceptors: ((response: AxiosResponse) => Promise<AxiosResponse>)[] = []
  ): Promise<T> {
    let response = await this.axiosInstance.request<T>({
      url: endpoint,
      ...config,
    });

    for (const interceptor of interceptors) {
      response = await interceptor(response);
    }

    return response.data;
  }

  // GET request
  async get<T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.axiosInstance.get<T>(endpoint, config).then(response => response.data);
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.axiosInstance.post<T>(endpoint, data, config).then(response => response.data);
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.axiosInstance.put<T>(endpoint, data, config).then(response => response.data);
  }

  // DELETE request
  async delete<T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.axiosInstance.delete<T>(endpoint, config).then(response => response.data);
  }

  // POST request with FormData (for file uploads)
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.axiosInstance.post<T>(endpoint, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data);
  }

  clearAuthTokens(): void {
    deleteCookie('access_token_cookie');
    deleteCookie('refresh_token_cookie');
    deleteCookie('csrf_access_token');
    deleteCookie('csrf_refresh_token');
  }

  // Reset refresh attempts (useful for testing or manual auth state changes)
  resetRefreshAttempts(): void {
    this.refreshAttempts = 0;
  }

}

// Export singleton instance
export { HttpClient };

// Export helper functions for backward compatibility
export { getCookie, deleteCookie }; 