import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { axiosJWT } from "./functions";

// Define the shape of the decoded token
interface DecodedToken {
  exp: number; // Expiration time (Unix timestamp)
}

// Function to set up the Axios interceptor only once.
export const useAxiosInterceptor = (
  accessToken: string,
  setAccessToken: Dispatch<SetStateAction<string>>
) => {
  // Use a ref to always have access to the latest token
  const tokenRef = useRef(accessToken);

  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    // Add the interceptor once
    const interceptor = axiosJWT.interceptors.request.use(
      async (config) => {
        // Skip the interceptor for the refresh token endpoint
        if (config.url?.includes("/refreshtoken")) {
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

        // If token is expired, attempt to refresh it.
        if (decodedToken.exp * 1000 < currentTime) {
          try {
            // Request a new access token using the refresh token.
            // Make sure withCredentials is set so that HTTP-only cookies are sent.
            const res = await axios.post<{ accessToken: string }>(
              "http://localhost:8081/refreshtoken",
              {},
              { withCredentials: true }
            );

            // Update React state and the ref with the new access token.
            setAccessToken(res.data.accessToken);
            tokenRef.current = res.data.accessToken;

            // Update the request header with the new token.
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
  }, [setAccessToken]); // Run only once (or when setAccessToken function changes)
};
