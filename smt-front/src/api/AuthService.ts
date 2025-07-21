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
      // For HTTP-only cookies, we need to make an API call to validate the session
      // The backend will check the cookies and return user info if valid
      const response = await httpClient.get<UserResponse>('/api/users/info');
      return response.user !== null && response.user !== undefined;
    } catch (error) {
      // If the request fails (401, 403, etc.), the session is invalid
      console.log('🔍 AuthService: Authentication check failed:', error);
      this.clearToken();
      return false;
    }
  }

  clearToken(): void {
    httpClient.clearAuthTokens();
  }

}

// Export singleton instance
export const authService = new AuthService();

// Export types
export type { UserRegister, UserLogin, UserResponse, TokenResponse, LogoutResponse } from "../types/user"; 
