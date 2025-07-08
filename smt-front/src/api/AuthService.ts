import type { UserRegister, UserLogin, UserResponse, TokenResponse, LogoutResponse } from "../types/user";
import { API_URL } from "./host";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to create headers
const createHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

class AuthService {
  async register(userData: UserRegister): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data: UserResponse = await handleResponse(response);
    
    // Store the token
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  }

  async login(credentials: UserLogin): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const data: UserResponse = await handleResponse(response);
    
    // Store the token
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  }

  async logout(): Promise<LogoutResponse> {
    const response = await fetch(`${API_URL}/api/users/logout`, {
      method: 'POST',
      headers: createHeaders()
    });
    
    const data: LogoutResponse = await handleResponse(response);
    
    // Remove the token
    localStorage.removeItem('authToken');
    
    return data;
  }

  async refreshToken(): Promise<TokenResponse> {
    const response = await fetch(`${API_URL}/api/users/refresh`, {
      method: 'POST',
      headers: createHeaders()
    });
    
    const data: TokenResponse = await handleResponse(response);
    
    // Update the token
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token);
    }
    
    return data;
  }

  async getUserInfo(): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/api/users/info`, {
      headers: createHeaders()
    });
    
    return handleResponse(response);
  }

  // Helper methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export types
export type { UserRegister, UserLogin, UserResponse, TokenResponse, LogoutResponse } from "../types/user"; 