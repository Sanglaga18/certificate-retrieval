import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
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
