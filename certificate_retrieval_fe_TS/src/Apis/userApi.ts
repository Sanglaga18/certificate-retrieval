import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7112/api/",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: "user",
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `user/${id}`,
      }),
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: "user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ data, id }) => ({
        url: "user/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: (id) => ({
        url: `user/resetpassword/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: ({ data, id }) => ({
        url: `user/changepassword/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});
export const {
  useGetUserQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = userApi;
export default userApi;
