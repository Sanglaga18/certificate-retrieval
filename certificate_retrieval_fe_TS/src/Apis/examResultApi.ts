import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const examResultApi = createApi({
  reducerPath: "examResultApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  tagTypes: ["Exam-Results"],
  endpoints: (builder) => ({
    getExamResult: builder.query({
      query: () => ({
        url: "exam-results",
      }),
      providesTags: ["Exam-Results"],
    }),
    getExamResultById: builder.query({
      query: (id) => ({
        url: `exam-results/${id}`,
      }),
      providesTags: ["Exam-Results"],
    }),
    getStudentInfoByExamResultId: builder.query({
      query: (id) => ({
        url: `exam-results/student-info/${id}`,
      }),
      providesTags: ["Exam-Results"],
    }),
    createExamResult: builder.mutation({
      query: (data) => ({
        url: "exam-results",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Exam-Results"],
    }),
    updateExamResult: builder.mutation({
      query: ({ data, id }) => ({
        url: "exam-results/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Exam-Results"],
    }),
    deleteExamResult: builder.mutation({
      query: (id) => ({
        url: "exam-results/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Exam-Results"],
    }),
  }),
});
export const {
  useGetExamResultQuery,
  useGetExamResultByIdQuery,
  useGetStudentInfoByExamResultIdQuery,
  useCreateExamResultMutation,
  useUpdateExamResultMutation,
  useDeleteExamResultMutation,
} = examResultApi;
export default examResultApi;
