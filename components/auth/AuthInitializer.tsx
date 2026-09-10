"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/src/lib/store/hooks";
import { authApi } from "@/src/lib/api/authApi";
import { logout, setCredentials, setInitialized } from "@/src/features/auth/authSlice";
import { tokenStorage } from "@/src/lib/auth/tokenStorage";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initialize = async () => {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      // No tokens at all — mark as initialized and bail
      if (!accessToken && !refreshToken) {
        dispatch(setInitialized(true));
        return;
      }

      // Hydrate Redux with whatever tokens are in storage
      dispatch(
        setCredentials({
          accessToken: accessToken ?? undefined,
          refreshToken: refreshToken ?? undefined,
        })
      );

      try {
        // Verify the token is still valid and load the user
        const response = await dispatch(
          authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true })
        ).unwrap();

        dispatch(setCredentials({ user: response.data.user }));
      } catch {
        // Token invalid / expired and refresh failed — clear everything
        tokenStorage.clear();
        dispatch(logout());
      } finally {
        dispatch(setInitialized(true));
      }
    };

    initialize();
  }, [dispatch]);

  return children;
}
