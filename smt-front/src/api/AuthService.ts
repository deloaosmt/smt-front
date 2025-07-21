import type { UserRegister, UserLogin, UserResponse, TokenResponse, LogoutResponse } from "../types/user";
import { HttpClient } from "./httpClient";

const httpClient = new HttpClient();

class AuthService {
  async register(userData: UserRegister): Promise<UserResponse> {
    return httpClient.post<UserResponse>('/api/users/register', userData);
  }

  async login(credentials: UserLogin): Promise<UserResponse> {
    return httpClient.post<UserResponse>('/api/users/login', credentials);
  }

  async logout(): Promise<LogoutResponse> {
    const data = await httpClient.post<LogoutResponse>('/api/users/logout');

    // Clear cookies on logout
    httpClient.clearAuthTokens();

    return data;
  }

  async refreshToken(): Promise<TokenResponse> {
    return httpClient.post<TokenResponse>('/api/users/refresh');
  }

  async getUserInfo(): Promise<UserResponse> {
    return httpClient.get<UserResponse>('/api/users/info');
  }

  // Helper methods
  async isAuthenticated(): Promise<boolean> {
    try {
      const response = await httpClient.get<UserResponse>('/api/users/info');
      return response.user !== null;
    } catch {
      // Don't clear tokens here as it might be a network error
      // The HTTP client will handle auth errors appropriately
      return false;
    }
  }

  clearToken(): void {
    httpClient.clearAuthTokens();
    // Reset refresh attempts when manually clearing tokens
    httpClient.resetRefreshAttempts();
  }

  // Check if user has any auth cookies (without making API calls)
  hasAuthCookies(): boolean {
    const accessToken = document.cookie.includes('access_token_cookie');
    const refreshToken = document.cookie.includes('refresh_token_cookie');
    return accessToken || refreshToken;
  }

}

// Export singleton instance
export const authService = new AuthService();

// Export types
export type { UserRegister, UserLogin, UserResponse, TokenResponse, LogoutResponse } from "../types/user"; 
