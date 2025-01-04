import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const diplomaApi = createApi({
  reducerPath: "diplomaApi",
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
  tagTypes: ["Diploma"],
  endpoints: (builder) => ({
    getDiploma: builder.query({
      query: ({ userID, searchString }) => ({
        url: "diplomas",
        params: {
          ...(userID && { userID }),
          ...(searchString && { searchString }),
        },
      }),
      providesTags: ["Diploma"],
    }),
    getDiplomaById: builder.query({
      query: ({ id, userID }) => ({
        url: `diplomas/${id}`,
        params: {
          ...(userID && { userID }),
        },
      }),
      providesTags: ["Diploma"],
    }),
    createDiploma: builder.mutation({
      query: (data) => ({
        url: "diplomas",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Diploma"],
    }),
    updateDiploma: builder.mutation({
      query: ({ data, id }) => ({
        url: "diplomas/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Diploma"],
    }),
    deleteDiploma: builder.mutation({
      query: (id) => ({
        url: "diplomas/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Diploma"],
    }),
  }),
});
export const {
  useGetDiplomaQuery,
  useGetDiplomaByIdQuery,
  useCreateDiplomaMutation,
  useUpdateDiplomaMutation,
  useDeleteDiplomaMutation,
} = diplomaApi;
export default diplomaApi;
