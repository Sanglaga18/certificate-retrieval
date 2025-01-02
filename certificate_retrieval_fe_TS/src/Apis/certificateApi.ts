import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const certificateApi = createApi({
  reducerPath: "certificateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7112/api/",
  }),
  tagTypes: ["Certificate"],
  endpoints: (builder) => ({
    getCertificate: builder.query({
      query: ({ userID, searchString }) => ({
        url: "certificate",
        params: {
          ...(userID && { userID }),
          ...(searchString && { searchString }),
        },
      }),
      providesTags: ["Certificate"],
    }),
    getCertificateById: builder.query({
      query: ({ id, userID }) => ({
        url: `certificate/${id}`,
        params: {
          ...(userID && { userID }),
        },
      }),
      providesTags: ["Certificate"],
    }),
    createCertificate: builder.mutation({
      query: (data) => ({
        url: "certificate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Certificate"],
    }),
    updateCertificate: builder.mutation({
      query: ({ data, id }) => ({
        url: "certificate/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Certificate"],
    }),
    deleteCertificate: builder.mutation({
      query: (id) => ({
        url: "certificate/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Certificate"],
    }),
  }),
});
export const {
  useGetCertificateQuery,
  useGetCertificateByIdQuery,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
} = certificateApi;
export default certificateApi;
