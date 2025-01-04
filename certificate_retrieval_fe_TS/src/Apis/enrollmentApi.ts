import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  tagTypes: ["Enrollment"],
  endpoints: (builder) => ({
    getEnrollment: builder.query({
      query: () => ({
        url: "enrollment",
      }),
      providesTags: ["Enrollment"],
    }),
    getEnrollmentById: builder.query({
      query: (id) => ({
        url: `enrollment/${id}`,
      }),
      providesTags: ["Enrollment"],
    }),
    getStudentInfoByEnrollmentId: builder.query({
      query: (id) => ({
        url: `enrollment/student-info/${id}`,
      }),
      providesTags: ["Enrollment"],
    }),
    createEnrollment: builder.mutation({
      query: (data) => ({
        url: "enrollment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Enrollment"],
    }),
    updateEnrollment: builder.mutation({
      query: ({ data, id }) => ({
        url: "enrollment/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Enrollment"],
    }),
    deleteEnrollment: builder.mutation({
      query: (id) => ({
        url: "enrollment/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Enrollment"],
    }),
  }),
});
export const {
  useGetEnrollmentQuery,
  useGetEnrollmentByIdQuery,
  useGetStudentInfoByEnrollmentIdQuery,
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
} = enrollmentApi;
export default enrollmentApi;
