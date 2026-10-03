import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import type { RootState } from "@/src/lib/store/store";
import { logout, setCredentials } from "@/src/features/auth/authSlice";
import { tokenStorage } from "@/src/lib/auth/tokenStorage";

// ─── Raw base query ──────────────────────────────────────────────────────────

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;

    const token =
      state.auth.accessToken ?? tokenStorage.getAccessToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");

    return headers;
  },
});

// ─── Reauth wrapper (auto-refresh on 401) ────────────────────────────────────

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      tokenStorage.clear();
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST", body: { refreshToken } },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const data = refreshResult.data as {
        data?: { accessToken?: string; refreshToken?: string };
      };

      const newAccessToken = data.data?.accessToken;
      const newRefreshToken = data.data?.refreshToken ?? refreshToken;

      if (newAccessToken) {
        tokenStorage.setTokens(newAccessToken, newRefreshToken);

        api.dispatch(
          setCredentials({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })
        );

        // Retry the original request with the new token
        result = await rawBaseQuery(args, api, extraOptions);
      }
    } else {
      tokenStorage.clear();
      api.dispatch(logout());
    }
  }

  return result;
};

// ─── Base API ─────────────────────────────────────────────────────────────────

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Students",
    "Groups",
    "Sessions",
    "Attendance",
    "Payments",
    "Dashboard",
    "Subscription",
    "Quizzes",
    "Expenses",
    "Reports",
    "Billing",
  ],
  endpoints: () => ({}),
});
