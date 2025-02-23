import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { JwtPayload, jwtDecode } from "jwt-decode";

interface User {
  id: number;
  email: string;
}

// Extend JwtPayload to include the User properties
interface CustomJwtPayload extends JwtPayload {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  accessToken: null,
  setAccessToken: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_MODE === "dev"
            ? `http://localhost:8081`
            : `https://entertainment-app-wheat.vercel.app`
        }/refreshtoken`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = response.data.accessToken;
      const decoded: CustomJwtPayload = jwtDecode(newAccessToken);

      const newUser: User = { id: decoded.id, email: decoded.email };
      setUser(newUser);
      setAccessToken(newAccessToken);
    } catch (error) {
      console.error("User not authenticated:", error);
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken && location.pathname !== "/login") {
      refreshToken();
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, accessToken, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
