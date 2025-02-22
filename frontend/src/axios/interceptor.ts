import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef } from "react";
import { axiosJWT } from "./axios";

interface DecodedToken {
  exp: number;
}

export const useAxiosInterceptor = (
  accessToken: string | null,
  setAccessToken: (token: string | null) => void
) => {
  // Use a ref to always have access to the latest token
  const tokenRef = useRef(accessToken);

  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    const interceptor = axiosJWT.interceptors.request.use(
      async (config) => {
        // Skip the interceptor for the refresh token endpoint
        if (
          config.url?.includes("/refreshtoken") ||
          config.url?.includes("/login") ||
          config.url?.includes("/register")
        ) {
          return config;
        }

        // Use the latest token from the ref
        const currentToken = tokenRef.current;
        if (!currentToken) {
          console.error("No access token found in interceptor!");
          return config;
        }

        const currentTime = new Date().getTime();
        const decodedToken: DecodedToken = jwtDecode(currentToken);

        if (decodedToken.exp * 1000 < currentTime) {
          try {
            const res = await axios.post<{ accessToken: string }>(
              "http://localhost:8081/refreshtoken",
              {},
              { withCredentials: true }
            );

            await new Promise((resolve) => {
              setAccessToken(res.data.accessToken);
              tokenRef.current = res.data.accessToken;
              resolve(null);
            });

            config.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
          } catch (error) {
            console.error("Error refreshing token:", error);
            return Promise.reject(error);
          }
        } else {
          config.headers["Authorization"] = `Bearer ${currentToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Eject the interceptor when the component unmounts to avoid duplicate interceptors.
    return () => {
      axiosJWT.interceptors.request.eject(interceptor);
    };
  }, [setAccessToken]);
};
