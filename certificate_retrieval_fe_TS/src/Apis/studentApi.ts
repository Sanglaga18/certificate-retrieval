import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers: Headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.append("Authorization", "Bearer " + token);
      }
      return headers;
    },
  }),
  tagTypes: ["Student"],
  endpoints: (builder) => ({
    getStudent: builder.query({
      query: () => ({
        url: "students",
      }),
      providesTags: ["Student"],
    }),
    getStudentById: builder.query({
      query: (id) => ({
        url: `students/${id}`,
      }),
      providesTags: ["Student"],
    }),
    updateStudent: builder.mutation({
      query: ({ data, id }) => ({
        url: "students/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),
  }),
});
export const {
  useGetStudentQuery,
  useGetStudentByIdQuery,
  useUpdateStudentMutation,
} = studentApi;
export default studentApi;
