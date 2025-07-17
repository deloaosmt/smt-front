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
  isAuthenticated(): boolean {
    return httpClient.isAuthenticated() || httpClient.get<UserResponse>('/api/users/info').then(response => response.user !== null).catch(() => false);
  }

  clearToken(): void {
    httpClient.clearAuthTokens();
  }

  // Get the current access token from cookie
  getAccessToken(): string | null {
    return httpClient.getAccessToken();
  }

  // Get the current refresh token from cookie
  getRefreshToken(): string | null {
    return httpClient.getRefreshToken();
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export types
export type { UserRegister, UserLogin, UserResponse, TokenResponse, LogoutResponse } from "../types/user"; 
