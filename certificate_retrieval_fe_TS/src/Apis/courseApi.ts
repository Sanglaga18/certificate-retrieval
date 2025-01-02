import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7112/api/",
  }),
  tagTypes: ["Course"],
  endpoints: (builder) => ({
    getCourse: builder.query({
      query: () => ({
        url: "Course",
      }),
      providesTags: ["Course"],
    }),
    getCourseById: builder.query({
      query: (id) => ({
        url: `Course/${id}`,
      }),
      providesTags: ["Course"],
    }),
    createCourse: builder.mutation({
      query: (data) => ({
        url: "Course",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),
    updateCourse: builder.mutation({
      query: ({ data, id }) => ({
        url: "Course/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: "Course/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});
export const {
  useGetCourseQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
export default courseApi;
