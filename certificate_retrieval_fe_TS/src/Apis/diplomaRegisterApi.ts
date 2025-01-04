import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const diplomaRegisterApi = createApi({
  reducerPath: "diplomaRegisterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  tagTypes: ["Diploma-Register"],
  endpoints: (builder) => ({
    getDiplomaRegister: builder.query({
      query: () => ({
        url: "diploma-register",
      }),
      providesTags: ["Diploma-Register"],
    }),
    getDiplomaRegisterById: builder.query({
      query: (id) => ({
        url: `diploma-register/${id}`,
      }),
      providesTags: ["Diploma-Register"],
    }),
    createDiplomaRegister: builder.mutation({
      query: (data) => ({
        url: "diploma-register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Diploma-Register"],
    }),
    updateDiplomaRegister: builder.mutation({
      query: ({ data, id }) => ({
        url: "diploma-register/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Diploma-Register"],
    }),
    deleteDiplomaRegister: builder.mutation({
      query: (id) => ({
        url: "diploma-register/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Diploma-Register"],
    }),
  }),
});
export const {
  useGetDiplomaRegisterQuery,
  useGetDiplomaRegisterByIdQuery,
  useCreateDiplomaRegisterMutation,
  useUpdateDiplomaRegisterMutation,
  useDeleteDiplomaRegisterMutation,
} = diplomaRegisterApi;
export default diplomaRegisterApi;
