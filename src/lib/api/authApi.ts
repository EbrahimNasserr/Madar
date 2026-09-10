import { baseApi } from "./baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

type LoginRequest = {
  email: string;
  password: string;
};

type AuthUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

type LoginResponse = {
  success: boolean;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
};

type GetMeResponse = {
  success: boolean;
  data: { user: AuthUser };
};

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    getMe: builder.query<GetMeResponse, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),

    logout: builder.mutation<unknown, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useLogoutMutation } = authApi;
