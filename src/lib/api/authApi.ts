import { baseApi } from "./baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
};

type AuthUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export type AuthResponse = {
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
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    getMe: builder.query<GetMeResponse, void>({
      query: () => "/auth/me",
      providesTags: [{ type: "Auth", id: "ME" }],
    }),

    updateMe: builder.mutation<
      { success: boolean; data: { user: AuthUser } },
      { firstName?: string; lastName?: string; phone?: string }
    >({
      query: (body) => ({
        url: "/auth/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Auth", id: "ME" }],
    }),

    changePassword: builder.mutation<
      { success: boolean; message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body,
      }),
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

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi;
