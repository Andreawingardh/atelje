"use client";

import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  AuthResponseDto,
  RegisterDto,
  AuthService,
  OpenAPI,
} from "@/api/generated";

export interface AuthContextType {
  user: AuthResponseDto | null; //
  isLoading: boolean,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  login: (email: string, password: string) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      return;
    }

    OpenAPI.TOKEN = token;
    console.log("OpenAPI.TOKEN set to:", OpenAPI.TOKEN);

    async function getUser() {
      try {
        const authorizedUser = await AuthService.getApiAuthMe();
        setUser(authorizedUser);
      } catch (error) {
        console.error("Failed to get user:", error);
        localStorage.removeItem("auth-token");
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
      throw error; // Handle error - maybe throw it so the form can show an error message?
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
    <AuthContext.Provider value={{ user, isLoading, setIsLoading, login, register, logout }}>
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
