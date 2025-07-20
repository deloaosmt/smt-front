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

    // Response interceptor for error handling and token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Don't retry if this is already a retry attempt or if it's a login/register request
        if (error.response?.status === 401 && !originalRequest._retry && 
            !originalRequest.url?.includes('/login') && 
            !originalRequest.url?.includes('/register')) {
          
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

          try {
            await authService.refreshToken();
            
            this.failedQueue.forEach(({ resolve }) => {
              resolve(null);
            });
            this.failedQueue = [];

            return this.axiosInstance.request(originalRequest);
          } catch (refreshError) {
            this.clearAuthTokens();
            
            this.failedQueue.forEach(({ reject }) => {
              reject(refreshError);
            });
            this.failedQueue = [];

            // Don't redirect if we're already on the login page
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
            
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

  // Authentication helper methods
  isAuthenticated(): boolean {
    return getCookie('access_token_cookie') !== null;
  }

  clearAuthTokens(): void {
    deleteCookie('access_token_cookie');
    deleteCookie('refresh_token_cookie');
  }

  getAccessToken(): string | null {
    return getCookie('access_token_cookie');
  }

  getRefreshToken(): string | null {
    return getCookie('refresh_token_cookie');
  }

  // Get the underlying axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Export singleton instance
export { HttpClient };

// Export helper functions for backward compatibility
export { getCookie, deleteCookie }; 