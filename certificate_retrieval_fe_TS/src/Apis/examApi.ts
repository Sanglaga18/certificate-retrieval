import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const examApi = createApi({
  reducerPath: "examApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7112/api/",
  }),
  tagTypes: ["Exam"],
  endpoints: (builder) => ({
    getExam: builder.query({
      query: () => ({
        url: "exams",
      }),
      providesTags: ["Exam"],
    }),
    getExamById: builder.query({
      query: (id) => ({
        url: `exams/${id}`,
      }),
      providesTags: ["Exam"],
    }),
    createExam: builder.mutation({
      query: (data) => ({
        url: "exams",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Exam"],
    }),
    updateExam: builder.mutation({
      query: ({ data, id }) => ({
        url: "exams/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Exam"],
    }),
    deleteExam: builder.mutation({
      query: (id) => ({
        url: "exams/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Exam"],
    }),
  }),
});
export const {
  useGetExamQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
} = examApi;
export default examApi;