"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { clearTokens, getAccessToken, setTokens } from "@/api/axios";
import { getMyProfile } from "@/api/requests";

import type { AuthTokens, UserProfile } from "@/api/types";

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: AuthTokens) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the session on mount: if a token is already stored, hydrate the
  // user from the profile endpoint. (One-time bootstrap syncing localStorage
  // with the server — a legitimate effect, not reactive data fetching.)
  useEffect(() => {
    let active = true;

    async function restoreSession(): Promise<void> {
      if (!getAccessToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const profile = await getMyProfile();
        if (active) setUser(profile);
      } catch {
        clearTokens();
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (tokens: AuthTokens) => {
    setTokens(tokens.accessToken, tokens.refreshToken);
    const profile = await getMyProfile();
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
