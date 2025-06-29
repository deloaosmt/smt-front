export interface User {
  id: number;
  email: string;
  full_name?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
}

export interface UserRegister {
  email: string;
  password: string;
  full_name?: string | null;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  user: User;
  token: string;
}

export interface TokenResponse {
  access_token: string;
}

export interface LogoutResponse {
  message: string;
} 