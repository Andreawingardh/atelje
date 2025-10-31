"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import {
  AuthResponseDto,
  RegisterDto,
  AuthService,
  OpenAPI,
} from "@/api/generated";

export interface AuthContextType {
  user: AuthResponseDto | null; //
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
  error: string | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      setIsLoading(false)
      return;
    }

    OpenAPI.TOKEN = token;
    console.log("OpenAPI.TOKEN set to:", OpenAPI.TOKEN);

    async function getUser() {
      try {
        const authorizedUser = await AuthService.getApiAuthMe();
        setUser(authorizedUser);
      } catch (error) {
        localStorage.removeItem("auth-token");
        setError("Failed to get user" + error);
      } finally {
        setIsLoading(false);
      }
    }

    getUser();
  }, []);

  async function login(email: string, password: string): Promise<void> {
    try {
      // 1. Call the generated login function
      const response = await AuthService.postApiAuthLogin({
        email,
        password,
      });

      // 2. Save token to localStorage
      const token = response.token;
      if (!token) {
        return;
      }
      localStorage.setItem("auth-token", token);

      // 3. Set OpenAPI.TOKEN
      OpenAPI.TOKEN = token;

      // 4. Update user state
      setUser(response);
    } catch (error) {
      throw error; 
    }
  }

  async function register(dto: RegisterDto): Promise<void> {
    try {
      const response = await AuthService.postApiAuthRegister(dto);

      const token = response.token;
      if (!token) {
        return;
      }
      localStorage.setItem("auth-token", token);

      OpenAPI.TOKEN = token;

      setUser(response);
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("auth-token");
    OpenAPI.TOKEN = undefined;
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, setIsLoading, login, register, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
